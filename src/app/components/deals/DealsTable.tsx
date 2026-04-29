import { useState, useRef, useCallback, useEffect } from 'react';
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown, Eye, EyeOff, AlertTriangle, FileWarning, RefreshCw } from 'lucide-react';
import type { Deal } from '../../data/mockDeals';
import { BUSINESS_AREA_COLORS, STATUS_STYLES } from '../../data/mockDeals';

// ============================================================================
// Deals Data Table
// Full-featured table with multi-sort, column management, Business Area
// color stripe, status badges, row selection, pagination, row actions
// ============================================================================

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface DealsTableProps {
  deals: Deal[];
  sortConfigs: SortConfig[];
  onSortChange: (configs: SortConfig[]) => void;
  selectedRows: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onRowClick: (deal: Deal) => void;
  activeDealId: string | null;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// Column definition
interface ColumnDef {
  key: string;
  label: string;
  width: number;
  minWidth: number;
  visible: boolean;
  sortable: boolean;
}

const DEFAULT_COLUMNS: ColumnDef[] = [
  { key: 'dealId', label: 'Deal ID', width: 110, minWidth: 90, visible: true, sortable: true },
  { key: 'mode', label: 'Mode', width: 90, minWidth: 70, visible: true, sortable: true },
  { key: 'status', label: 'Status', width: 120, minWidth: 90, visible: true, sortable: true },
  { key: 'company', label: 'Company', width: 110, minWidth: 90, visible: true, sortable: true },
  { key: 'branch', label: 'Branch', width: 100, minWidth: 80, visible: true, sortable: true },
  { key: 'businessUnit', label: 'Business Unit', width: 130, minWidth: 100, visible: false, sortable: true },
  { key: 'businessArea', label: 'Business Area', width: 120, minWidth: 100, visible: true, sortable: true },
  { key: 'customer', label: 'Customer', width: 160, minWidth: 120, visible: true, sortable: true },
  { key: 'primaryItem', label: 'Primary Item', width: 160, minWidth: 120, visible: true, sortable: true },
  { key: 'totalMarketValue', label: 'Market Value', width: 120, minWidth: 90, visible: true, sortable: true },
  { key: 'suggestedPayout', label: 'Suggested', width: 110, minWidth: 90, visible: true, sortable: true },
  { key: 'totalRequestedPayout', label: 'Requested', width: 110, minWidth: 90, visible: true, sortable: true },
  { key: 'durationDays', label: 'Duration', width: 90, minWidth: 70, visible: true, sortable: true },
  { key: 'dueDate', label: 'Due Date', width: 110, minWidth: 90, visible: true, sortable: true },
  { key: 'createdAt', label: 'Created', width: 110, minWidth: 90, visible: true, sortable: true },
  { key: 'pickupType', label: 'Pickup', width: 120, minWidth: 90, visible: false, sortable: true },
  { key: 'labels', label: 'Labels', width: 140, minWidth: 100, visible: true, sortable: false },
  { key: 'assignedTo', label: 'Assigned To', width: 130, minWidth: 100, visible: true, sortable: true },
  { key: 'flags', label: 'Flags', width: 80, minWidth: 60, visible: true, sortable: false },
  { key: 'column', label: 'Column', width: 120, minWidth: 90, visible: true, sortable: true },
];

// Format currency
function formatEur(value: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

// Relative date
function relativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
}

// Row action menu
function RowActionMenu({ deal, onAction }: { deal: Deal; onAction: (action: string, deal: Deal) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="p-[4px] rounded-[4px] hover:bg-[#edeef1] transition-colors cursor-pointer"
      >
        <MoreHorizontal size={16} className="text-[#8b95a5]" />
      </button>
      {open && (
        <div className="absolute right-0 top-[28px] z-50 bg-white border border-[#d7dbe0] rounded-[8px] shadow-lg py-[4px] w-[180px]">
          {[
            { key: 'open', label: 'Open Deal Wizard' },
            { key: 'comment', label: 'Add Comment' },
            { key: 'archive', label: 'Mark Archived' },
            { key: 'export', label: 'Export Row' },
          ].map(action => (
            <button
              key={action.key}
              onClick={(e) => { e.stopPropagation(); onAction(action.key, deal); setOpen(false); }}
              className="w-full text-left px-[12px] py-[6px] text-[13px] text-[#3d444f] hover:bg-[#f8f9fb] transition-colors cursor-pointer"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DealsTable({
  deals,
  sortConfigs,
  onSortChange,
  selectedRows,
  onSelectionChange,
  onRowClick,
  activeDealId,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}: DealsTableProps) {
  const [columns, setColumns] = useState<ColumnDef[]>(DEFAULT_COLUMNS);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [resizingCol, setResizingCol] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; width: number } | null>(null);
  const columnPickerRef = useRef<HTMLDivElement>(null);

  // Close column picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (columnPickerRef.current && !columnPickerRef.current.contains(e.target as Node)) setShowColumnPicker(false);
    };
    if (showColumnPicker) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showColumnPicker]);

  // Column resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent, colKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    const col = columns.find(c => c.key === colKey);
    if (col) {
      setResizingCol(colKey);
      setResizeStart({ x: e.clientX, width: col.width });
    }
  }, [columns]);

  useEffect(() => {
    if (!resizingCol || !resizeStart) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStart.x;
      const col = columns.find(c => c.key === resizingCol);
      if (col) {
        const newWidth = Math.max(col.minWidth, resizeStart.width + diff);
        setColumns(cols => cols.map(c => c.key === resizingCol ? { ...c, width: newWidth } : c));
      }
    };

    const handleMouseUp = () => {
      setResizingCol(null);
      setResizeStart(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingCol, resizeStart, columns]);

  // Sort handling
  const handleSortClick = (key: string, e: React.MouseEvent) => {
    const existing = sortConfigs.find(s => s.key === key);
    if (e.shiftKey) {
      // Multi-sort: add or toggle
      if (existing) {
        if (existing.direction === 'asc') {
          onSortChange(sortConfigs.map(s => s.key === key ? { ...s, direction: 'desc' } : s));
        } else {
          onSortChange(sortConfigs.filter(s => s.key !== key));
        }
      } else {
        onSortChange([...sortConfigs, { key, direction: 'asc' }]);
      }
    } else {
      // Single sort
      if (existing && existing.direction === 'asc') {
        onSortChange([{ key, direction: 'desc' }]);
      } else if (existing && existing.direction === 'desc') {
        onSortChange([]);
      } else {
        onSortChange([{ key, direction: 'asc' }]);
      }
    }
  };

  // Pagination
  const totalPages = Math.ceil(deals.length / pageSize);
  const paginatedDeals = deals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Select all on page
  const allPageSelected = paginatedDeals.length > 0 && paginatedDeals.every(d => selectedRows.has(d.dealId));
  const somePageSelected = paginatedDeals.some(d => selectedRows.has(d.dealId));

  const handleSelectAll = () => {
    if (allPageSelected) {
      const newSet = new Set(selectedRows);
      paginatedDeals.forEach(d => newSet.delete(d.dealId));
      onSelectionChange(newSet);
    } else {
      const newSet = new Set(selectedRows);
      paginatedDeals.forEach(d => newSet.add(d.dealId));
      onSelectionChange(newSet);
    }
  };

  const toggleRow = (dealId: string) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(dealId)) newSet.delete(dealId);
    else newSet.add(dealId);
    onSelectionChange(newSet);
  };

  const visibleColumns = columns.filter(c => c.visible);

  // Row action handler
  const handleRowAction = (action: string, deal: Deal) => {
    // For now, just console log — real implementation would dispatch actions
    console.log(`Action: ${action}`, deal.dealId);
  };

  // Get cell value
  const renderCell = (deal: Deal, col: ColumnDef) => {
    switch (col.key) {
      case 'dealId':
        return (
          <span className="font-medium text-[#1b1d20] text-[13px]">{deal.dealId}</span>
        );
      case 'mode':
        return (
          <span className={`inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[11px] font-semibold uppercase tracking-wide ${
            deal.mode === 'custom_deal'
              ? 'bg-[#ede9fe] text-[#7c3aed]'
              : 'bg-[#dbeafe] text-[#2563eb]'
          }`}>
            {deal.mode === 'custom_deal' ? 'Appraisal' : 'Deal'}
          </span>
        );
      case 'status': {
        const style = STATUS_STYLES[deal.status];
        return (
          <span
            className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[11px] font-semibold tracking-wide"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            {deal.status.replace('_', ' ')}
          </span>
        );
      }
      case 'company':
        return <span className="text-[13px] text-[#3d444f]">{deal.company.replace('CASHY_', '')}</span>;
      case 'branch':
        return <span className="text-[13px] text-[#3d444f]">{deal.branch}</span>;
      case 'businessUnit':
        return <span className="text-[12px] text-[#5e6978]">{deal.businessUnit}</span>;
      case 'businessArea':
        return (
          <span className="text-[13px] text-[#3d444f]">{deal.businessArea}</span>
        );
      case 'customer':
        return (
          <div className="flex flex-col">
            <span className="text-[13px] text-[#1b1d20]">{deal.primaryCustomer.firstName} {deal.primaryCustomer.lastName}</span>
          </div>
        );
      case 'primaryItem':
        return (
          <div className="flex flex-col">
            <span className="text-[13px] text-[#1b1d20] truncate">{deal.items[0]?.title || '—'}</span>
            {deal.items.length > 1 && (
              <span className="text-[11px] text-[#8b95a5]">+{deal.items.length - 1} more</span>
            )}
          </div>
        );
      case 'totalMarketValue':
        return <span className="text-[13px] text-[#1b1d20] font-medium tabular-nums">{formatEur(deal.totalMarketValue)}</span>;
      case 'suggestedPayout':
        return <span className="text-[13px] text-[#16a34a] font-medium tabular-nums">{formatEur(deal.suggestedPayout)}</span>;
      case 'totalRequestedPayout':
        return <span className="text-[13px] text-[#1b1d20] tabular-nums">{formatEur(deal.totalRequestedPayout)}</span>;
      case 'durationDays':
        return <span className="text-[13px] text-[#3d444f]">{deal.durationDays}d</span>;
      case 'dueDate':
        return <span className="text-[13px] text-[#3d444f]">{deal.dueDate}</span>;
      case 'createdAt':
        return <span className="text-[13px] text-[#5e6978]">{relativeDate(deal.createdAt)}</span>;
      case 'pickupType':
        return <span className="text-[12px] text-[#5e6978]">{deal.pickupType.replace('_', ' ')}</span>;
      case 'labels':
        return (
          <div className="flex gap-[4px] flex-wrap">
            {deal.labels.map(label => (
              <span key={label} className="inline-flex items-center px-[6px] py-[1px] rounded-full text-[10px] font-medium bg-[#f3f3f5] text-[#5e6978] border border-[#e5e7eb]">
                {label}
              </span>
            ))}
          </div>
        );
      case 'assignedTo':
        return (
          <span className={`text-[13px] ${deal.assignedTo === 'Unassigned' ? 'text-[#8b95a5] italic' : 'text-[#3d444f]'}`}>
            {deal.assignedTo}
          </span>
        );
      case 'flags':
        return (
          <div className="flex items-center gap-[4px]">
            {deal.hasMissingDocs && (
              <span title="Missing documents" className="text-[#d97706]">
                <FileWarning size={14} />
              </span>
            )}
            {deal.isExtension && (
              <span title="Extension" className="text-[#7c3aed]">
                <RefreshCw size={14} />
              </span>
            )}
            {deal.status === 'DRAFT' && (
              <span className="inline-flex items-center px-[5px] py-[1px] rounded-[3px] text-[10px] font-medium bg-[#edeef1] text-[#5e6978]">
                Draft
              </span>
            )}
          </div>
        );
      case 'column':
        return <span className="text-[13px] text-[#3d444f]">{deal.column}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Column picker toggle */}
      <div className="flex items-center justify-end px-[8px] py-[6px] gap-[8px]">
        <div className="relative" ref={columnPickerRef}>
          <button
            onClick={() => setShowColumnPicker(!showColumnPicker)}
            className="flex items-center gap-[6px] px-[10px] py-[4px] text-[12px] font-medium text-[#5e6978] hover:text-[#1b1d20] hover:bg-[#f3f3f5] rounded-[4px] transition-colors cursor-pointer"
          >
            <Eye size={14} />
            Columns
          </button>
          {showColumnPicker && (
            <div className="absolute right-0 top-[30px] z-50 bg-white border border-[#d7dbe0] rounded-[8px] shadow-lg p-[8px] w-[220px] max-h-[400px] overflow-y-auto slick-scrollbar">
              <p className="text-[11px] font-semibold text-[#8b95a5] uppercase tracking-wider px-[4px] pb-[6px]">Show/Hide Columns</p>
              {columns.map(col => (
                <label key={col.key} className="flex items-center gap-[8px] px-[4px] py-[4px] rounded-[4px] hover:bg-[#f8f9fb] cursor-pointer transition-colors">
                  <div
                    className={`w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${col.visible ? 'bg-[#4649e5] border-[#4649e5]' : 'border-[#b4bbc5] bg-white'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setColumns(cols => cols.map(c => c.key === col.key ? { ...c, visible: !c.visible } : c));
                    }}
                  >
                    {col.visible && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] text-[#3d444f]">{col.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <span className="text-[12px] text-[#8b95a5]">
          Shift+Click to multi-sort
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto slick-scrollbar bg-white border border-[#d7dbe0] rounded-[8px]">
        <table className="w-full border-collapse" style={{ minWidth: visibleColumns.reduce((sum, c) => sum + c.width, 100) + 'px' }}>
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#f8f9fb] border-b border-[#e5e7eb]">
              {/* Select all checkbox */}
              <th className="w-[40px] px-[12px] py-[8px] text-left sticky left-0 bg-[#f8f9fb]">
                <div
                  className={`w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center cursor-pointer transition-colors ${
                    allPageSelected ? 'bg-[#4649e5] border-[#4649e5]' : somePageSelected ? 'bg-[#4649e5]/30 border-[#4649e5]' : 'border-[#b4bbc5] bg-white'
                  }`}
                  onClick={handleSelectAll}
                >
                  {allPageSelected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {somePageSelected && !allPageSelected && (
                    <div className="w-[8px] h-[1.5px] bg-white rounded" />
                  )}
                </div>
              </th>
              {/* Color stripe spacer */}
              <th className="w-[4px] p-0" />
              {visibleColumns.map(col => {
                const sortIdx = sortConfigs.findIndex(s => s.key === col.key);
                const sortConfig = sortIdx >= 0 ? sortConfigs[sortIdx] : null;
                return (
                  <th
                    key={col.key}
                    className="text-left relative group"
                    style={{ width: col.width + 'px', minWidth: col.minWidth + 'px' }}
                  >
                    <div
                      className={`flex items-center gap-[4px] px-[8px] py-[8px] text-[11px] font-semibold text-[#8b95a5] uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:text-[#1b1d20]' : ''} select-none`}
                      onClick={(e) => col.sortable && handleSortClick(col.key, e)}
                    >
                      <span className="truncate">{col.label}</span>
                      {col.sortable && !sortConfig && (
                        <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
                      )}
                      {sortConfig && (
                        <span className="flex items-center gap-[1px] shrink-0">
                          {sortConfig.direction === 'asc' ? <ArrowUp size={12} className="text-[#4649e5]" /> : <ArrowDown size={12} className="text-[#4649e5]" />}
                          {sortConfigs.length > 1 && (
                            <span className="text-[9px] text-[#4649e5] font-bold">{sortIdx + 1}</span>
                          )}
                        </span>
                      )}
                    </div>
                    {/* Resize handle */}
                    <div
                      className="absolute right-0 top-0 bottom-0 w-[4px] cursor-col-resize hover:bg-[#4649e5]/30 transition-colors"
                      onMouseDown={(e) => handleResizeStart(e, col.key)}
                    />
                  </th>
                );
              })}
              {/* Actions column */}
              <th className="w-[44px] px-[4px]" />
            </tr>
          </thead>
          <tbody>
            {paginatedDeals.map(deal => {
              const isSelected = selectedRows.has(deal.dealId);
              const isActive = activeDealId === deal.dealId;
              const areaColor = BUSINESS_AREA_COLORS[deal.businessArea] || '#6b7280';
              return (
                <tr
                  key={deal.dealId}
                  className={`border-b border-[#f1f3f5] transition-colors cursor-pointer ${
                    isActive ? 'bg-[#eeeffe]' : isSelected ? 'bg-[#f0f4ff]' : 'hover:bg-[#f8f9fb]'
                  }`}
                  onClick={() => onRowClick(deal)}
                >
                  {/* Checkbox */}
                  <td className="px-[12px] py-[8px] sticky left-0" style={{ backgroundColor: isActive ? '#eeeffe' : isSelected ? '#f0f4ff' : 'white' }}>
                    <div
                      className={`w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#4649e5] border-[#4649e5]' : 'border-[#b4bbc5] bg-white'
                      }`}
                      onClick={(e) => { e.stopPropagation(); toggleRow(deal.dealId); }}
                    >
                      {isSelected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </td>
                  {/* Color stripe */}
                  <td className="p-0">
                    <div className="w-[4px] h-full min-h-[40px]" style={{ backgroundColor: areaColor }} />
                  </td>
                  {/* Data cells */}
                  {visibleColumns.map(col => (
                    <td key={col.key} className="px-[8px] py-[8px]">
                      {renderCell(deal, col)}
                    </td>
                  ))}
                  {/* Row actions */}
                  <td className="px-[4px] py-[8px]" onClick={(e) => e.stopPropagation()}>
                    <RowActionMenu deal={deal} onAction={handleRowAction} />
                  </td>
                </tr>
              );
            })}
            {paginatedDeals.length === 0 && (
              <tr>
                <td colSpan={visibleColumns.length + 3} className="text-center py-[40px]">
                  <div className="flex flex-col items-center gap-[8px]">
                    <AlertTriangle size={24} className="text-[#8b95a5]" />
                    <span className="text-[14px] text-[#5e6978]">No deals match the current filters.</span>
                    <span className="text-[13px] text-[#8b95a5]">Try adjusting or clearing your filters.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-[4px] py-[8px] mt-[8px]">
        <div className="flex items-center gap-[8px]">
          <span className="text-[12px] text-[#8b95a5]">
            Showing {Math.min((currentPage - 1) * pageSize + 1, deals.length)}–{Math.min(currentPage * pageSize, deals.length)} of {deals.length}
          </span>
          {selectedRows.size > 0 && (
            <span className="text-[12px] text-[#4649e5] font-medium">
              ({selectedRows.size} selected)
            </span>
          )}
        </div>
        <div className="flex items-center gap-[8px]">
          {/* Page size selector */}
          <select
            value={pageSize}
            onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
            className="h-[28px] px-[8px] text-[12px] rounded-[4px] border border-[#d7dbe0] bg-white text-[#3d444f] focus:outline-none focus:border-[#4649e5] cursor-pointer"
          >
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>

          {/* Page navigation */}
          <div className="flex items-center gap-[2px]">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-[8px] py-[4px] text-[12px] font-medium text-[#3d444f] hover:bg-[#f3f3f5] rounded-[4px] transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
              Math.max(0, currentPage - 3),
              Math.min(totalPages, currentPage + 2)
            ).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-[8px] py-[4px] text-[12px] font-medium rounded-[4px] transition-colors cursor-pointer ${
                  page === currentPage
                    ? 'bg-[#4649e5] text-white'
                    : 'text-[#3d444f] hover:bg-[#f3f3f5]'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-[8px] py-[4px] text-[12px] font-medium text-[#3d444f] hover:bg-[#f3f3f5] rounded-[4px] transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
