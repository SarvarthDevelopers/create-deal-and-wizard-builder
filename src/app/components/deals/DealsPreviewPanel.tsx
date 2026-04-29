import { X, ExternalLink, FileWarning, RefreshCw, Clock, MessageSquare, ArrowRight, Package } from 'lucide-react';
import { motion } from 'motion/react';
import type { Deal } from '../../data/mockDeals';
import { BUSINESS_AREA_COLORS, STATUS_STYLES } from '../../data/mockDeals';

// ============================================================================
// Deal Preview Panel
// Right slide-in panel showing deal summary, calculation snapshot, timeline
// ============================================================================

interface DealsPreviewPanelProps {
  deal: Deal;
  onClose: () => void;
}

function formatEur(value: number): string {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Mock timeline events
function generateTimeline(deal: Deal) {
  const events = [
    { type: 'created', label: 'Deal created', date: deal.createdAt, icon: Package },
    { type: 'column', label: `Moved to ${deal.column}`, date: deal.lastColumnLabelAssignedAt, icon: ArrowRight },
  ];
  if (deal.hasMissingDocs) {
    events.push({ type: 'warning', label: 'Missing documents flagged', date: new Date(new Date(deal.createdAt).getTime() + 86400000).toISOString(), icon: FileWarning });
  }
  if (deal.isExtension) {
    events.push({ type: 'extension', label: 'Extension applied', date: new Date(new Date(deal.createdAt).getTime() + 172800000).toISOString(), icon: RefreshCw });
  }
  if (deal.notes) {
    events.push({ type: 'note', label: deal.notes, date: new Date(new Date(deal.createdAt).getTime() + 3600000).toISOString(), icon: MessageSquare });
  }
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function DealsPreviewPanel({ deal, onClose }: DealsPreviewPanelProps) {
  const areaColor = BUSINESS_AREA_COLORS[deal.businessArea] || '#6b7280';
  const statusStyle = STATUS_STYLES[deal.status];
  const timeline = generateTimeline(deal);

  // Calculate fees estimate
  const fees = deal.totalMarketValue * 0.05; // rough 5%
  const ltv = deal.suggestedPayout / deal.totalMarketValue;

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="w-[400px] bg-white border-l border-[#d7dbe0] flex flex-col h-full overflow-hidden shrink-0 font-['Inter',sans-serif]"
    >
      {/* Header */}
      <div className="px-[20px] py-[14px] border-b border-[#e5e7eb] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-[10px]">
          <span className="text-[16px] font-semibold text-[#1b1d20]">{deal.dealId}</span>
          <span
            className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[11px] font-semibold"
            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
          >
            {deal.status.replace('_', ' ')}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-[6px] hover:bg-[#f3f3f5] rounded-[6px] transition-colors cursor-pointer"
        >
          <X size={16} className="text-[#8b95a5]" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto slick-scrollbar">
        {/* Badges */}
        <div className="px-[20px] py-[12px] flex items-center gap-[8px] flex-wrap border-b border-[#f1f3f5]">
          <span className={`inline-flex items-center px-[8px] py-[3px] rounded-[4px] text-[11px] font-semibold uppercase tracking-wide ${
            deal.mode === 'custom_deal' ? 'bg-[#ede9fe] text-[#7c3aed]' : 'bg-[#dbeafe] text-[#2563eb]'
          }`}>
            {deal.mode === 'custom_deal' ? 'Appraisal' : 'Deal'}
          </span>
          <span className="inline-flex items-center px-[8px] py-[3px] rounded-[4px] text-[11px] font-medium bg-[#f3f3f5] text-[#5e6978]">
            {deal.businessUnit}
          </span>
          <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-[4px] text-[11px] font-medium text-white" style={{ backgroundColor: areaColor }}>
            {deal.businessArea}
          </span>
          {deal.labels.map(label => (
            <span key={label} className="inline-flex items-center px-[6px] py-[2px] rounded-full text-[10px] font-medium bg-[#f3f3f5] text-[#5e6978] border border-[#e5e7eb]">
              {label}
            </span>
          ))}
        </div>

        {/* Customer */}
        <div className="px-[20px] py-[14px] border-b border-[#f1f3f5]">
          <h4 className="text-[11px] font-semibold text-[#8b95a5] uppercase tracking-wider mb-[8px]">Customer</h4>
          <div className="flex flex-col gap-[4px]">
            <span className="text-[14px] font-medium text-[#1b1d20]">
              {deal.primaryCustomer.firstName} {deal.primaryCustomer.lastName}
            </span>
            <span className="text-[12px] text-[#5e6978]">{deal.primaryCustomer.email}</span>
            <span className="text-[12px] text-[#5e6978]">{deal.primaryCustomer.phone}</span>
          </div>
        </div>

        {/* Items */}
        <div className="px-[20px] py-[14px] border-b border-[#f1f3f5]">
          <h4 className="text-[11px] font-semibold text-[#8b95a5] uppercase tracking-wider mb-[8px]">
            Items ({deal.items.length})
          </h4>
          <div className="flex flex-col gap-[8px]">
            {deal.items.map(item => (
              <div key={item.itemId} className="flex items-center justify-between p-[10px] bg-[#f8f9fb] rounded-[6px] border border-[#f1f3f5]">
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-[#1b1d20]">{item.title}</span>
                  <span className="text-[11px] text-[#8b95a5]">{item.variant}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[12px] text-[#5e6978]">{formatEur(item.marketValue)}</span>
                  <span className="text-[11px] text-[#8b95a5]">asked {formatEur(item.requestedPayout)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Snapshot */}
        <div className="px-[20px] py-[14px] border-b border-[#f1f3f5]">
          <h4 className="text-[11px] font-semibold text-[#8b95a5] uppercase tracking-wider mb-[10px]">Calculation</h4>
          <div className="flex flex-col gap-[8px]">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#5e6978]">Total Market Value</span>
              <span className="font-medium text-[#1b1d20]">{formatEur(deal.totalMarketValue)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#5e6978]">LTV Ratio</span>
              <span className="font-medium text-[#1b1d20]">{(ltv * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#5e6978]">Est. Fees</span>
              <span className="font-medium text-[#b91d1c]">− {formatEur(fees)}</span>
            </div>
            <div className="h-[1px] bg-[#e5e7eb] my-[4px]" />
            <div className="flex justify-between text-[14px]">
              <span className="font-semibold text-[#1b1d20]">Suggested Payout</span>
              <span className="font-bold text-[#16a34a]">{formatEur(deal.suggestedPayout)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#5e6978]">Requested Payout</span>
              <span className="font-medium text-[#1b1d20]">{formatEur(deal.totalRequestedPayout)}</span>
            </div>
          </div>
        </div>

        {/* Key Flags */}
        {(deal.hasMissingDocs || deal.isExtension) && (
          <div className="px-[20px] py-[14px] border-b border-[#f1f3f5]">
            <div className="flex flex-col gap-[8px]">
              {deal.hasMissingDocs && (
                <div className="flex items-center gap-[10px] p-[10px] bg-[#fffbed] border border-[#fef08a] rounded-[6px]">
                  <FileWarning size={16} className="text-[#d97706] shrink-0" />
                  <div>
                    <span className="text-[13px] font-medium text-[#854d0e]">Missing Documents</span>
                    <p className="text-[12px] text-[#a16207] mt-[2px]">Required documents are incomplete for this deal.</p>
                  </div>
                </div>
              )}
              {deal.isExtension && (
                <div className="flex items-center gap-[10px] p-[10px] bg-[#ede9fe] border border-[#c4b5fd] rounded-[6px]">
                  <RefreshCw size={16} className="text-[#7c3aed] shrink-0" />
                  <div>
                    <span className="text-[13px] font-medium text-[#5b21b6]">Extension Deal</span>
                    <p className="text-[12px] text-[#6d28d9] mt-[2px]">This deal has been extended from a previous term.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deal Info */}
        <div className="px-[20px] py-[14px] border-b border-[#f1f3f5]">
          <h4 className="text-[11px] font-semibold text-[#8b95a5] uppercase tracking-wider mb-[8px]">Details</h4>
          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[8px]">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#8b95a5]">Company</span>
              <span className="text-[12px] text-[#1b1d20]">{deal.company}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#8b95a5]">Branch / Shop</span>
              <span className="text-[12px] text-[#1b1d20]">{deal.branch} / {deal.shop}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#8b95a5]">Duration</span>
              <span className="text-[12px] text-[#1b1d20]">{deal.durationDays} days</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#8b95a5]">Due Date</span>
              <span className="text-[12px] text-[#1b1d20]">{deal.dueDate}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#8b95a5]">Pickup Type</span>
              <span className="text-[12px] text-[#1b1d20]">{deal.pickupType}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#8b95a5]">Assigned To</span>
              <span className="text-[12px] text-[#1b1d20]">{deal.assignedTo}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#8b95a5]">Column</span>
              <span className="text-[12px] text-[#1b1d20]">{deal.column}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#8b95a5]">Priority</span>
              <span className={`text-[12px] font-medium ${deal.priority === 'High' ? 'text-[#dc2626]' : deal.priority === 'Medium' ? 'text-[#d97706]' : 'text-[#5e6978]'}`}>
                {deal.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="px-[20px] py-[14px]">
          <h4 className="text-[11px] font-semibold text-[#8b95a5] uppercase tracking-wider mb-[10px]">Timeline</h4>
          <div className="flex flex-col">
            {timeline.map((event, idx) => {
              const Icon = event.icon;
              return (
                <div key={idx} className="flex gap-[10px] relative">
                  {/* Timeline line */}
                  {idx < timeline.length - 1 && (
                    <div className="absolute left-[9px] top-[24px] bottom-0 w-[1px] bg-[#e5e7eb]" />
                  )}
                  <div className="w-[20px] h-[20px] rounded-full bg-[#f3f3f5] flex items-center justify-center shrink-0 mt-[2px] border border-[#e5e7eb]">
                    <Icon size={10} className="text-[#8b95a5]" />
                  </div>
                  <div className="flex flex-col pb-[14px]">
                    <span className="text-[12px] text-[#1b1d20]">{event.label}</span>
                    <span className="text-[11px] text-[#8b95a5]">{formatDate(event.date)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-[20px] py-[14px] border-t border-[#e5e7eb] shrink-0">
        <button className="w-full flex items-center justify-center gap-[8px] px-[16px] py-[10px] text-[14px] font-semibold text-white bg-[#4649e5] hover:bg-[#3b3ec3] rounded-[8px] transition-colors cursor-pointer shadow-sm">
          <ExternalLink size={16} />
          Open Deal Wizard
        </button>
      </div>
    </motion.div>
  );
}
