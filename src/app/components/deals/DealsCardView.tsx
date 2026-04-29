import { FileWarning, RefreshCw } from 'lucide-react';
import type { Deal } from '../../data/mockDeals';
import { BUSINESS_AREA_COLORS, STATUS_STYLES } from '../../data/mockDeals';

// ============================================================================
// Compact Card View (alternative to table)
// ============================================================================

interface DealsCardViewProps {
  deals: Deal[];
  selectedRows: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onRowClick: (deal: Deal) => void;
  activeDealId: string | null;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

function formatEur(value: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

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

export function DealsCardView({
  deals,
  selectedRows,
  onSelectionChange,
  onRowClick,
  activeDealId,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
}: DealsCardViewProps) {
  const totalPages = Math.ceil(deals.length / pageSize);
  const paginatedDeals = deals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleRow = (dealId: string) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(dealId)) newSet.delete(dealId);
    else newSet.add(dealId);
    onSelectionChange(newSet);
  };

  return (
    <div className="flex flex-col flex-1 min-w-0">
      {/* Cards grid */}
      <div className="flex-1 overflow-y-auto slick-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[12px]">
          {paginatedDeals.map(deal => {
            const isSelected = selectedRows.has(deal.dealId);
            const isActive = activeDealId === deal.dealId;
            const areaColor = BUSINESS_AREA_COLORS[deal.businessArea] || '#6b7280';
            const statusStyle = STATUS_STYLES[deal.status];

            return (
              <div
                key={deal.dealId}
                onClick={() => onRowClick(deal)}
                className={`relative bg-white rounded-[8px] border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                  isActive ? 'border-[#4649e5] shadow-md ring-1 ring-[#4649e5]/20' : isSelected ? 'border-[#4649e5]/40 bg-[#f0f4ff]' : 'border-[#d7dbe0] hover:border-[#b4bbc5]'
                }`}
              >
                {/* Left color stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ backgroundColor: areaColor }} />

                <div className="pl-[16px] pr-[12px] py-[12px]">
                  {/* Top row: checkbox + dealId + status */}
                  <div className="flex items-center justify-between mb-[8px]">
                    <div className="flex items-center gap-[8px]">
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
                      <span className="text-[13px] font-semibold text-[#1b1d20]">{deal.dealId}</span>
                      <span className={`inline-flex items-center px-[6px] py-[1px] rounded-[3px] text-[10px] font-semibold uppercase tracking-wide ${
                        deal.mode === 'custom_deal' ? 'bg-[#ede9fe] text-[#7c3aed]' : 'bg-[#dbeafe] text-[#2563eb]'
                      }`}>
                        {deal.mode === 'custom_deal' ? 'Appraisal' : 'Deal'}
                      </span>
                    </div>
                    <span
                      className="inline-flex items-center px-[6px] py-[1px] rounded-[3px] text-[10px] font-semibold tracking-wide"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      {deal.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="text-[14px] font-medium text-[#1b1d20] mb-[2px]">
                    {deal.primaryCustomer.firstName} {deal.primaryCustomer.lastName}
                  </div>

                  {/* Primary item */}
                  <div className="text-[12px] text-[#5e6978] mb-[10px]">
                    {deal.items[0]?.title || '—'}
                    {deal.items.length > 1 && ` +${deal.items.length - 1} more`}
                  </div>

                  {/* Bottom row: payout + date + flags */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[12px]">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#8b95a5] uppercase">Suggested</span>
                        <span className="text-[14px] font-semibold text-[#16a34a] tabular-nums">{formatEur(deal.suggestedPayout)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#8b95a5] uppercase">Market</span>
                        <span className="text-[12px] text-[#3d444f] tabular-nums">{formatEur(deal.totalMarketValue)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[6px]">
                      {deal.hasMissingDocs && <FileWarning size={14} className="text-[#d97706]" />}
                      {deal.isExtension && <RefreshCw size={14} className="text-[#7c3aed]" />}
                      <span className="text-[11px] text-[#8b95a5]">{relativeDate(deal.createdAt)}</span>
                    </div>
                  </div>

                  {/* Labels */}
                  {deal.labels.length > 0 && (
                    <div className="flex gap-[4px] mt-[8px] flex-wrap">
                      {deal.labels.map(label => (
                        <span key={label} className="inline-flex items-center px-[6px] py-[1px] rounded-full text-[10px] font-medium bg-[#f3f3f5] text-[#5e6978] border border-[#e5e7eb]">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination — same as table */}
      <div className="flex items-center justify-between px-[4px] py-[8px] mt-[8px]">
        <span className="text-[12px] text-[#8b95a5]">
          Showing {Math.min((currentPage - 1) * pageSize + 1, deals.length)}–{Math.min(currentPage * pageSize, deals.length)} of {deals.length}
        </span>
        <div className="flex items-center gap-[8px]">
          <select
            value={pageSize}
            onChange={(e) => { onPageSizeChange(Number(e.target.value)); onPageChange(1); }}
            className="h-[28px] px-[8px] text-[12px] rounded-[4px] border border-[#d7dbe0] bg-white text-[#3d444f] focus:outline-none focus:border-[#4649e5] cursor-pointer"
          >
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>
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
                  page === currentPage ? 'bg-[#4649e5] text-white' : 'text-[#3d444f] hover:bg-[#f3f3f5]'
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
