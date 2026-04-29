import { Search, Plus, ChevronDown, Download, LayoutGrid, LayoutList, Archive, UserPlus, X } from 'lucide-react';

// ============================================================================
// Deals Toolbar
// Search, saved views, view toggle, bulk actions, New Deal CTA
// ============================================================================

interface DealsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'table' | 'card';
  onViewModeChange: (mode: 'table' | 'card') => void;
  totalResults: number;
  selectedCount: number;
  onBulkAssign: () => void;
  onBulkArchive: () => void;
  onBulkExport: () => void;
  onNewDeal: () => void;
  onExportAll: () => void;
  onClearSelection: () => void;
}

export function DealsToolbar({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  totalResults,
  selectedCount,
  onBulkAssign,
  onBulkArchive,
  onBulkExport,
  onNewDeal,
  onExportAll,
  onClearSelection,
}: DealsToolbarProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      {/* Main toolbar row */}
      <div className="flex items-center justify-between gap-[16px]">
        {/* Left: Title + Search */}
        <div className="flex items-center gap-[16px] flex-1 min-w-0">
          <div className="flex items-center gap-[8px] shrink-0">
            <h1 className="text-[20px] font-semibold text-[#1b1d20] font-['Inter',sans-serif]">Deals</h1>
            <span className="text-[13px] text-[#8b95a5] font-medium tabular-nums bg-[#f3f3f5] px-[8px] py-[2px] rounded-full">
              {totalResults}
            </span>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-[400px]">
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b95a5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search deals, customers, items, VIN, IMEI..."
              className="w-full h-[36px] pl-[36px] pr-[12px] text-[13px] rounded-[6px] border border-[#d7dbe0] focus:outline-none focus:border-[#4649e5] focus:ring-1 focus:ring-[#4649e5] bg-white text-[#1b1d20] placeholder:text-[#8b95a5] font-['Inter',sans-serif]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-[8px] top-1/2 -translate-y-1/2 p-[2px] hover:bg-[#f3f3f5] rounded-[4px] transition-colors cursor-pointer"
              >
                <X size={14} className="text-[#8b95a5]" />
              </button>
            )}
          </div>
        </div>

        {/* Right: View toggle + Actions */}
        <div className="flex items-center gap-[8px] shrink-0">
          {/* View toggle */}
          <div className="flex bg-[#edeef1] p-[3px] rounded-[6px]">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-[6px] rounded-[4px] transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#1b1d20] shadow-sm' : 'text-[#5e6978] hover:text-[#1b1d20]'
              }`}
              title="Table view"
            >
              <LayoutList size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('card')}
              className={`p-[6px] rounded-[4px] transition-colors cursor-pointer ${
                viewMode === 'card' ? 'bg-white text-[#1b1d20] shadow-sm' : 'text-[#5e6978] hover:text-[#1b1d20]'
              }`}
              title="Card view"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

          {/* Export */}
          <button
            onClick={onExportAll}
            className="flex items-center gap-[6px] px-[12px] py-[7px] text-[13px] font-medium text-[#3d444f] bg-white border border-[#d7dbe0] hover:bg-[#f8f9fb] rounded-[6px] transition-colors cursor-pointer shadow-sm"
          >
            <Download size={14} />
            Export
          </button>

          {/* New Deal CTA */}
          <button
            onClick={onNewDeal}
            className="flex items-center gap-[6px] px-[14px] py-[7px] text-[13px] font-semibold text-white bg-[#4649e5] hover:bg-[#3b3ec3] rounded-[6px] transition-colors cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            New Deal
          </button>
        </div>
      </div>

      {/* Bulk action bar — visible when rows selected */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-[12px] px-[16px] py-[8px] bg-[#eeeffe] border border-[#c7c9f9] rounded-[8px]">
          <span className="text-[13px] font-medium text-[#4649e5]">
            {selectedCount} deal{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <div className="w-[1px] h-[16px] bg-[#c7c9f9]" />
          <button
            onClick={onBulkAssign}
            className="flex items-center gap-[6px] px-[10px] py-[4px] text-[12px] font-medium text-[#4649e5] hover:bg-[#d8dafd] rounded-[4px] transition-colors cursor-pointer"
          >
            <UserPlus size={14} />
            Assign
          </button>
          <button
            onClick={onBulkArchive}
            className="flex items-center gap-[6px] px-[10px] py-[4px] text-[12px] font-medium text-[#4649e5] hover:bg-[#d8dafd] rounded-[4px] transition-colors cursor-pointer"
          >
            <Archive size={14} />
            Archive
          </button>
          <button
            onClick={onBulkExport}
            className="flex items-center gap-[6px] px-[10px] py-[4px] text-[12px] font-medium text-[#4649e5] hover:bg-[#d8dafd] rounded-[4px] transition-colors cursor-pointer"
          >
            <Download size={14} />
            Export CSV
          </button>
          <div className="flex-1" />
          <button
            onClick={onClearSelection}
            className="text-[12px] text-[#5e6978] hover:text-[#1b1d20] cursor-pointer"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
