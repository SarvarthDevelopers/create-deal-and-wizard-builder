import { useState, useMemo, useCallback } from 'react';
import { MOCK_DEALS } from '../../data/mockDeals';
import type { Deal } from '../../data/mockDeals';
import { DealsToolbar } from './DealsToolbar';
import { DealsFilterRail, INITIAL_FILTERS } from './DealsFilterRail';
import type { FilterState } from './DealsFilterRail';
import { DealsTable } from './DealsTable';
import type { SortConfig } from './DealsTable';
import { DealsPreviewPanel } from './DealsPreviewPanel';
import { DealsCardView } from './DealsCardView';
import { Header } from '../Header';

// ============================================================================
// DealsPage — Top-level container
// Manages all state: filters, sort, selection, preview panel, pagination
// ============================================================================

// Apply filters to deals
function applyFilters(deals: Deal[], filters: FilterState): Deal[] {
  return deals.filter(deal => {
    if (filters.company.length > 0 && !filters.company.includes(deal.company)) return false;
    if (filters.branch.length > 0 && !filters.branch.includes(deal.branch)) return false;
    if (filters.shop.length > 0 && !filters.shop.includes(deal.shop)) return false;
    if (filters.businessUnit.length > 0 && !filters.businessUnit.includes(deal.businessUnit)) return false;
    if (filters.businessArea.length > 0 && !filters.businessArea.includes(deal.businessArea)) return false;
    if (filters.mode.length > 0 && !filters.mode.includes(deal.mode)) return false;
    if (filters.status.length > 0 && !filters.status.includes(deal.status)) return false;
    if (filters.labels.length > 0 && !filters.labels.some(l => deal.labels.includes(l))) return false;
    if (filters.assignedTo.length > 0 && !filters.assignedTo.includes(deal.assignedTo)) return false;
    if (filters.pickupType.length > 0 && !filters.pickupType.includes(deal.pickupType)) return false;
    if (filters.hasMissingDocs === 'yes' && !deal.hasMissingDocs) return false;
    if (filters.hasMissingDocs === 'no' && deal.hasMissingDocs) return false;
    if (filters.isExtension === 'yes' && !deal.isExtension) return false;
    if (filters.isExtension === 'no' && deal.isExtension) return false;

    if (filters.createdDateFrom) {
      if (new Date(deal.createdAt) < new Date(filters.createdDateFrom)) return false;
    }
    if (filters.createdDateTo) {
      if (new Date(deal.createdAt) > new Date(filters.createdDateTo + 'T23:59:59')) return false;
    }
    if (filters.dueDateFrom) {
      if (new Date(deal.dueDate) < new Date(filters.dueDateFrom)) return false;
    }
    if (filters.dueDateTo) {
      if (new Date(deal.dueDate) > new Date(filters.dueDateTo)) return false;
    }

    if (filters.minSuggestedPayout) {
      if (deal.suggestedPayout < Number(filters.minSuggestedPayout)) return false;
    }
    if (filters.maxSuggestedPayout) {
      if (deal.suggestedPayout > Number(filters.maxSuggestedPayout)) return false;
    }

    return true;
  });
}

// Apply search to deals
function applySearch(deals: Deal[], query: string): Deal[] {
  if (!query.trim()) return deals;
  const q = query.toLowerCase().trim();
  return deals.filter(deal => {
    // Search across dealId, customer name, item titles, VIN/variant
    const searchFields = [
      deal.dealId,
      deal.primaryCustomer.firstName,
      deal.primaryCustomer.lastName,
      `${deal.primaryCustomer.firstName} ${deal.primaryCustomer.lastName}`,
      deal.primaryCustomer.email,
      deal.primaryCustomer.phone,
      ...deal.items.map(i => i.title),
      ...deal.items.map(i => i.variant),
      ...deal.items.map(i => i.category),
      deal.branch,
      deal.shop,
      deal.assignedTo,
      deal.company,
      deal.status,
      deal.businessArea,
      deal.businessUnit,
      ...deal.labels,
      deal.notes || '',
    ];
    return searchFields.some(field => field.toLowerCase().includes(q));
  });
}

// Apply multi-column sort
function applySort(deals: Deal[], sortConfigs: SortConfig[]): Deal[] {
  if (sortConfigs.length === 0) return deals;
  const sorted = [...deals];
  sorted.sort((a, b) => {
    for (const config of sortConfigs) {
      const { key, direction } = config;
      let aVal: any;
      let bVal: any;

      switch (key) {
        case 'dealId': aVal = a.dealId; bVal = b.dealId; break;
        case 'mode': aVal = a.mode; bVal = b.mode; break;
        case 'status': aVal = a.status; bVal = b.status; break;
        case 'company': aVal = a.company; bVal = b.company; break;
        case 'branch': aVal = a.branch; bVal = b.branch; break;
        case 'businessUnit': aVal = a.businessUnit; bVal = b.businessUnit; break;
        case 'businessArea': aVal = a.businessArea; bVal = b.businessArea; break;
        case 'customer': aVal = `${a.primaryCustomer.lastName} ${a.primaryCustomer.firstName}`; bVal = `${b.primaryCustomer.lastName} ${b.primaryCustomer.firstName}`; break;
        case 'primaryItem': aVal = a.items[0]?.title || ''; bVal = b.items[0]?.title || ''; break;
        case 'totalMarketValue': aVal = a.totalMarketValue; bVal = b.totalMarketValue; break;
        case 'suggestedPayout': aVal = a.suggestedPayout; bVal = b.suggestedPayout; break;
        case 'totalRequestedPayout': aVal = a.totalRequestedPayout; bVal = b.totalRequestedPayout; break;
        case 'durationDays': aVal = a.durationDays; bVal = b.durationDays; break;
        case 'dueDate': aVal = a.dueDate; bVal = b.dueDate; break;
        case 'createdAt': aVal = a.createdAt; bVal = b.createdAt; break;
        case 'pickupType': aVal = a.pickupType; bVal = b.pickupType; break;
        case 'assignedTo': aVal = a.assignedTo; bVal = b.assignedTo; break;
        case 'column': aVal = a.column; bVal = b.column; break;
        default: continue;
      }

      if (aVal === bVal) continue;

      const cmp = typeof aVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));

      if (cmp !== 0) return direction === 'asc' ? cmp : -cmp;
    }
    return 0;
  });
  return sorted;
}

// CSV export
function exportToCSV(deals: Deal[], filename = 'cashy-deals-export.csv') {
  const headers = [
    'Deal ID', 'Mode', 'Status', 'Company', 'Branch', 'Shop',
    'Business Unit', 'Business Area', 'Customer First Name', 'Customer Last Name',
    'Customer Email', 'Customer Phone', 'Primary Item', 'Items Count',
    'Total Market Value', 'Total Requested Payout', 'Suggested Payout',
    'Duration (days)', 'Due Date', 'Created At', 'Labels', 'Priority',
    'Is Extension', 'Pickup Type', 'Has Missing Docs', 'Assigned To',
    'Column', 'Notes'
  ];

  const rows = deals.map(d => [
    d.dealId, d.mode, d.status, d.company, d.branch, d.shop,
    d.businessUnit, d.businessArea, d.primaryCustomer.firstName, d.primaryCustomer.lastName,
    d.primaryCustomer.email, d.primaryCustomer.phone, d.items[0]?.title || '', d.items.length,
    d.totalMarketValue, d.totalRequestedPayout, d.suggestedPayout,
    d.durationDays, d.dueDate, d.createdAt, d.labels.join(';'), d.priority,
    d.isExtension, d.pickupType, d.hasMissingDocs, d.assignedTo,
    d.column, d.notes
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function DealsPage() {
  // State
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([{ key: 'createdAt', direction: 'desc' }]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Derived data
  const allDeals = MOCK_DEALS;

  const filteredDeals = useMemo(() => {
    let result = applyFilters(allDeals, filters);
    result = applySearch(result, searchQuery);
    result = applySort(result, sortConfigs);
    return result;
  }, [allDeals, filters, searchQuery, sortConfigs]);

  // Reset page when filters/search change
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Row click opens preview
  const handleRowClick = useCallback((deal: Deal) => {
    setActiveDeal(prev => prev?.dealId === deal.dealId ? null : deal);
  }, []);

  // Bulk actions
  const handleBulkExport = useCallback(() => {
    const selected = allDeals.filter(d => selectedRows.has(d.dealId));
    exportToCSV(selected, 'cashy-deals-selected.csv');
  }, [allDeals, selectedRows]);

  const handleExportAll = useCallback(() => {
    exportToCSV(filteredDeals);
  }, [filteredDeals]);

  const handleBulkAssign = useCallback(() => {
    console.log('Bulk assign:', [...selectedRows]);
    // Mock — would open an assign dialog
  }, [selectedRows]);

  const handleBulkArchive = useCallback(() => {
    console.log('Bulk archive:', [...selectedRows]);
    // Mock — would trigger archive action
  }, [selectedRows]);

  const handleNewDeal = useCallback(() => {
    // Navigate to wizard builder or open create modal
    window.location.href = '/';
  }, []);

  return (
    <div className="bg-[#edeef1] h-screen w-full overflow-hidden flex flex-col font-['Inter',sans-serif]">
      <Header currentPage="deals" />

      {/* Page content */}
      <div className="flex-1 min-h-0 flex flex-col px-[24px] py-[16px]">
        {/* Toolbar */}
        <DealsToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={filteredDeals.length}
          selectedCount={selectedRows.size}
          onBulkAssign={handleBulkAssign}
          onBulkArchive={handleBulkArchive}
          onBulkExport={handleBulkExport}
          onNewDeal={handleNewDeal}
          onExportAll={handleExportAll}
          onClearSelection={() => setSelectedRows(new Set())}
        />

        {/* Main area: Filter Rail + Table/Cards + Preview Panel */}
        <div className="flex gap-[16px] flex-1 min-h-0 mt-[12px]">
          {/* Filter Rail */}
          <DealsFilterRail
            filters={filters}
            onFiltersChange={handleFiltersChange}
            deals={allDeals}
            collapsed={filterCollapsed}
            onToggleCollapse={() => setFilterCollapsed(!filterCollapsed)}
          />

          {/* Table or Card view */}
          {viewMode === 'table' ? (
            <DealsTable
              deals={filteredDeals}
              sortConfigs={sortConfigs}
              onSortChange={setSortConfigs}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              onRowClick={handleRowClick}
              activeDealId={activeDeal?.dealId || null}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          ) : (
            <DealsCardView
              deals={filteredDeals}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              onRowClick={handleRowClick}
              activeDealId={activeDeal?.dealId || null}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}

          {/* Preview Panel */}
          {activeDeal && (
            <DealsPreviewPanel
              deal={activeDeal}
              onClose={() => setActiveDeal(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
