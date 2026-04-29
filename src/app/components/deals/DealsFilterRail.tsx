import { useState } from 'react';
import { ChevronDown, ChevronUp, X, Calendar } from 'lucide-react';
import type { Deal } from '../../data/mockDeals';

// ============================================================================
// Collapsible Filter Rail
// Left sidebar with all filter controls matching the Cashy visual language
// ============================================================================

export interface FilterState {
  company: string[];
  branch: string[];
  shop: string[];
  businessUnit: string[];
  businessArea: string[];
  mode: string[];
  status: string[];
  labels: string[];
  assignedTo: string[];
  pickupType: string[];
  hasMissingDocs: 'all' | 'yes' | 'no';
  isExtension: 'all' | 'yes' | 'no';
  createdDateFrom: string;
  createdDateTo: string;
  dueDateFrom: string;
  dueDateTo: string;
  minSuggestedPayout: string;
  maxSuggestedPayout: string;
}

export const INITIAL_FILTERS: FilterState = {
  company: [],
  branch: [],
  shop: [],
  businessUnit: [],
  businessArea: [],
  mode: [],
  status: [],
  labels: [],
  assignedTo: [],
  pickupType: [],
  hasMissingDocs: 'all',
  isExtension: 'all',
  createdDateFrom: '',
  createdDateTo: '',
  dueDateFrom: '',
  dueDateTo: '',
  minSuggestedPayout: '',
  maxSuggestedPayout: '',
};

interface DealsFilterRailProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  deals: Deal[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}

// Collapsible section wrapper
function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#e5e7eb] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-[16px] py-[10px] hover:bg-[#f8f9fb] transition-colors cursor-pointer"
      >
        <span className="text-[12px] font-semibold text-[#8b95a5] uppercase tracking-wider">{title}</span>
        {open ? <ChevronUp size={14} className="text-[#8b95a5]" /> : <ChevronDown size={14} className="text-[#8b95a5]" />}
      </button>
      {open && <div className="px-[16px] pb-[12px]">{children}</div>}
    </div>
  );
}

// Multi-checkbox filter
function MultiCheckboxFilter({
  options,
  selected,
  onChange,
  deals,
  filterKey,
}: {
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
  deals: Deal[];
  filterKey: keyof Deal;
}) {
  const getCounts = (opt: string) => {
    return deals.filter(d => {
      const val = d[filterKey];
      if (Array.isArray(val)) return (val as any[]).includes(opt);
      return val === opt;
    }).length;
  };

  return (
    <div className="flex flex-col gap-[4px]">
      {options.map(opt => {
        const checked = selected.includes(opt);
        const count = getCounts(opt);
        return (
          <label key={opt} className="flex items-center gap-[8px] cursor-pointer py-[3px] px-[4px] rounded-[4px] hover:bg-[#f3f3f5] transition-colors">
            <div
              className={`w-[14px] h-[14px] rounded-[3px] border flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-[#4649e5] border-[#4649e5]' : 'border-[#b4bbc5] bg-white'}`}
              onClick={(e) => {
                e.preventDefault();
                if (checked) {
                  onChange(selected.filter(s => s !== opt));
                } else {
                  onChange([...selected, opt]);
                }
              }}
            >
              {checked && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-[13px] text-[#3d444f] flex-1 truncate">{opt}</span>
            <span className="text-[11px] text-[#8b95a5] font-medium tabular-nums">{count}</span>
          </label>
        );
      })}
    </div>
  );
}

// Radio filter (all/yes/no)
function TriStateFilter({
  value,
  onChange,
  label,
}: {
  value: 'all' | 'yes' | 'no';
  onChange: (val: 'all' | 'yes' | 'no') => void;
  label: string;
}) {
  const options: Array<{ val: 'all' | 'yes' | 'no'; label: string }> = [
    { val: 'all', label: 'All' },
    { val: 'yes', label: 'Yes' },
    { val: 'no', label: 'No' },
  ];
  return (
    <div className="flex gap-[4px]">
      {options.map(opt => (
        <button
          key={opt.val}
          onClick={() => onChange(opt.val)}
          className={`px-[10px] py-[4px] text-[12px] font-medium rounded-[4px] transition-colors cursor-pointer ${
            value === opt.val
              ? 'bg-[#4649e5] text-white'
              : 'bg-[#f3f3f5] text-[#5e6978] hover:bg-[#edeef1]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function DealsFilterRail({ filters, onFiltersChange, deals, collapsed, onToggleCollapse }: DealsFilterRailProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = () => {
    return (
      filters.company.length > 0 ||
      filters.branch.length > 0 ||
      filters.shop.length > 0 ||
      filters.businessUnit.length > 0 ||
      filters.businessArea.length > 0 ||
      filters.mode.length > 0 ||
      filters.status.length > 0 ||
      filters.labels.length > 0 ||
      filters.assignedTo.length > 0 ||
      filters.pickupType.length > 0 ||
      filters.hasMissingDocs !== 'all' ||
      filters.isExtension !== 'all' ||
      filters.createdDateFrom !== '' ||
      filters.createdDateTo !== '' ||
      filters.dueDateFrom !== '' ||
      filters.dueDateTo !== '' ||
      filters.minSuggestedPayout !== '' ||
      filters.maxSuggestedPayout !== ''
    );
  };

  // Get unique values from data for filter options
  const uniqueBranches = [...new Set(deals.map(d => d.branch))].sort();
  const uniqueShops = [...new Set(deals.map(d => d.shop))].sort();
  const uniqueAssignees = [...new Set(deals.map(d => d.assignedTo))].sort();

  if (collapsed) {
    return (
      <div className="w-[40px] bg-white border border-[#d7dbe0] rounded-[8px] shrink-0 flex flex-col items-center py-[12px]">
        <button
          onClick={onToggleCollapse}
          className="p-[8px] hover:bg-[#f8f9fb] rounded-[6px] transition-colors cursor-pointer"
          title="Show filters"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="#5e6978" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {hasActiveFilters() && (
          <div className="w-[6px] h-[6px] rounded-full bg-[#4649e5] mt-[4px]" />
        )}
      </div>
    );
  }

  return (
    <div className="w-[256px] bg-white border border-[#d7dbe0] rounded-[8px] shrink-0 flex flex-col max-h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-[16px] py-[12px] border-b border-[#e5e7eb]">
        <div className="flex items-center gap-[8px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="#1b1d20" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[14px] font-semibold text-[#1b1d20]">Filters</span>
          {hasActiveFilters() && (
            <span className="bg-[#4649e5] text-white text-[10px] px-[6px] py-[1px] rounded-full font-medium">●</span>
          )}
        </div>
        <div className="flex items-center gap-[4px]">
          {hasActiveFilters() && (
            <button
              onClick={() => onFiltersChange(INITIAL_FILTERS)}
              className="text-[12px] text-[#4649e5] font-medium hover:underline cursor-pointer"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-[4px] hover:bg-[#f8f9fb] rounded-[4px] transition-colors cursor-pointer ml-[4px]"
          >
            <X size={14} className="text-[#8b95a5]" />
          </button>
        </div>
      </div>

      {/* Scrollable filter content */}
      <div className="flex-1 overflow-y-auto slick-scrollbar">
        <FilterSection title="Company">
          <MultiCheckboxFilter
            options={['CASHY_AUT', 'CASHY_DE']}
            selected={filters.company}
            onChange={(val) => updateFilter('company', val)}
            deals={deals}
            filterKey="company"
          />
        </FilterSection>

        <FilterSection title="Branch">
          <MultiCheckboxFilter
            options={uniqueBranches}
            selected={filters.branch}
            onChange={(val) => updateFilter('branch', val)}
            deals={deals}
            filterKey="branch"
          />
        </FilterSection>

        <FilterSection title="Shop" defaultOpen={false}>
          <MultiCheckboxFilter
            options={uniqueShops}
            selected={filters.shop}
            onChange={(val) => updateFilter('shop', val)}
            deals={deals}
            filterKey="shop"
          />
        </FilterSection>

        <FilterSection title="Business Unit">
          <MultiCheckboxFilter
            options={['AUTOMOTIVE', 'GENERAL', 'LUXURY', 'ELECTRONICS']}
            selected={filters.businessUnit}
            onChange={(val) => updateFilter('businessUnit', val)}
            deals={deals}
            filterKey="businessUnit"
          />
        </FilterSection>

        <FilterSection title="Business Area">
          <MultiCheckboxFilter
            options={['Automotive', 'Electronics', 'Luxury', 'Mixed']}
            selected={filters.businessArea}
            onChange={(val) => updateFilter('businessArea', val)}
            deals={deals}
            filterKey="businessArea"
          />
        </FilterSection>

        <FilterSection title="Deal Mode">
          <MultiCheckboxFilter
            options={['deal', 'custom_deal']}
            selected={filters.mode}
            onChange={(val) => updateFilter('mode', val)}
            deals={deals}
            filterKey="mode"
          />
        </FilterSection>

        <FilterSection title="Status">
          <MultiCheckboxFilter
            options={['DRAFT', 'BOOKED', 'IN_PROGRESS', 'REVIEWING', 'COUNTEROFFER', 'ACCEPTED', 'DECLINED', 'ARCHIVED']}
            selected={filters.status}
            onChange={(val) => updateFilter('status', val)}
            deals={deals}
            filterKey="status"
          />
        </FilterSection>

        <FilterSection title="Labels" defaultOpen={false}>
          <MultiCheckboxFilter
            options={['vip', 'needs-docs', 'high-value', 'online']}
            selected={filters.labels}
            onChange={(val) => updateFilter('labels', val)}
            deals={deals}
            filterKey="labels"
          />
        </FilterSection>

        <FilterSection title="Assigned To" defaultOpen={false}>
          <MultiCheckboxFilter
            options={uniqueAssignees}
            selected={filters.assignedTo}
            onChange={(val) => updateFilter('assignedTo', val)}
            deals={deals}
            filterKey="assignedTo"
          />
        </FilterSection>

        <FilterSection title="Pickup Type" defaultOpen={false}>
          <MultiCheckboxFilter
            options={['SHOP', 'STANDARD_SHIPMENT', 'STOREBOX', 'EXTENSION']}
            selected={filters.pickupType}
            onChange={(val) => updateFilter('pickupType', val)}
            deals={deals}
            filterKey="pickupType"
          />
        </FilterSection>

        <FilterSection title="Missing Docs" defaultOpen={false}>
          <TriStateFilter
            value={filters.hasMissingDocs}
            onChange={(val) => updateFilter('hasMissingDocs', val)}
            label="Has Missing Docs"
          />
        </FilterSection>

        <FilterSection title="Extension" defaultOpen={false}>
          <TriStateFilter
            value={filters.isExtension}
            onChange={(val) => updateFilter('isExtension', val)}
            label="Is Extension"
          />
        </FilterSection>

        <FilterSection title="Created Date" defaultOpen={false}>
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-col gap-[4px]">
              <label className="text-[11px] text-[#8b95a5] font-medium">From</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-[8px] top-1/2 -translate-y-1/2 text-[#8b95a5]" />
                <input
                  type="date"
                  value={filters.createdDateFrom}
                  onChange={(e) => updateFilter('createdDateFrom', e.target.value)}
                  className="w-full h-[32px] pl-[28px] pr-[8px] text-[12px] rounded-[4px] border border-[#d7dbe0] focus:outline-none focus:border-[#4649e5] bg-white text-[#1b1d20]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="text-[11px] text-[#8b95a5] font-medium">To</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-[8px] top-1/2 -translate-y-1/2 text-[#8b95a5]" />
                <input
                  type="date"
                  value={filters.createdDateTo}
                  onChange={(e) => updateFilter('createdDateTo', e.target.value)}
                  className="w-full h-[32px] pl-[28px] pr-[8px] text-[12px] rounded-[4px] border border-[#d7dbe0] focus:outline-none focus:border-[#4649e5] bg-white text-[#1b1d20]"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Due Date" defaultOpen={false}>
          <div className="flex flex-col gap-[8px]">
            <div className="flex flex-col gap-[4px]">
              <label className="text-[11px] text-[#8b95a5] font-medium">From</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-[8px] top-1/2 -translate-y-1/2 text-[#8b95a5]" />
                <input
                  type="date"
                  value={filters.dueDateFrom}
                  onChange={(e) => updateFilter('dueDateFrom', e.target.value)}
                  className="w-full h-[32px] pl-[28px] pr-[8px] text-[12px] rounded-[4px] border border-[#d7dbe0] focus:outline-none focus:border-[#4649e5] bg-white text-[#1b1d20]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[4px]">
              <label className="text-[11px] text-[#8b95a5] font-medium">To</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-[8px] top-1/2 -translate-y-1/2 text-[#8b95a5]" />
                <input
                  type="date"
                  value={filters.dueDateTo}
                  onChange={(e) => updateFilter('dueDateTo', e.target.value)}
                  className="w-full h-[32px] pl-[28px] pr-[8px] text-[12px] rounded-[4px] border border-[#d7dbe0] focus:outline-none focus:border-[#4649e5] bg-white text-[#1b1d20]"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        <FilterSection title="Suggested Payout" defaultOpen={false}>
          <div className="flex gap-[8px]">
            <div className="flex flex-col gap-[4px] flex-1">
              <label className="text-[11px] text-[#8b95a5] font-medium">Min (€)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minSuggestedPayout}
                onChange={(e) => updateFilter('minSuggestedPayout', e.target.value)}
                className="w-full h-[32px] px-[8px] text-[12px] rounded-[4px] border border-[#d7dbe0] focus:outline-none focus:border-[#4649e5] bg-white text-[#1b1d20]"
              />
            </div>
            <div className="flex flex-col gap-[4px] flex-1">
              <label className="text-[11px] text-[#8b95a5] font-medium">Max (€)</label>
              <input
                type="number"
                placeholder="∞"
                value={filters.maxSuggestedPayout}
                onChange={(e) => updateFilter('maxSuggestedPayout', e.target.value)}
                className="w-full h-[32px] px-[8px] text-[12px] rounded-[4px] border border-[#d7dbe0] focus:outline-none focus:border-[#4649e5] bg-white text-[#1b1d20]"
              />
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
