import { useState } from 'react';
import { motion } from 'motion/react';
import { X, ChevronDown, ChevronUp, Plus, Upload, AlertCircle, CheckCircle2, Calculator, RefreshCw, Edit2, Search, Loader2, Pencil } from 'lucide-react';

const CAR_DATA: Record<string, string[]> = {
  'Volkswagen': ['Golf', 'Tiguan', 'Passat', 'Polo', 'ID.4'],
  'BMW': ['3 Series', '5 Series', 'X5', 'X3', '1 Series'],
  'Audi': ['A3', 'A4', 'A6', 'Q5', 'Q3'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'A-Class', 'S-Class'],
  'Toyota': ['Corolla', 'Yaris', 'RAV4', 'C-HR', 'Camry'],
  'Ford': ['Focus', 'Fiesta', 'Puma', 'Kuga', 'Mustang'],
};

interface CreateDealModalProps {
  onClose: () => void;
}

type DealMode = 'Pawn' | 'Purchase';
type CustomerMode = 'Registered' | 'Guest' | 'Create New';

interface SearchableDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchableDropdown({ label, value, options, onChange, placeholder }: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-[6px] relative">
      <label className="text-[13px] font-medium text-[#5e6978]">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? search : value}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => { setIsOpen(true); setSearch(''); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder || `Select ${label}...`}
          className="w-full h-[38px] px-[12px] py-[8px] pr-[32px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5] bg-white text-[#1b1d20]"
        />
        <Search size={16} className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#8b95a5]" />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#d7dbe0] rounded-[6px] shadow-lg z-20 max-h-[200px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <button
                key={opt}
                className="w-full text-left px-[12px] py-[8px] text-[14px] hover:bg-[#f8f9fb] transition-colors"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </button>
            ))
          ) : (
            <div className="px-[12px] py-[8px] text-[14px] text-[#8b95a5] italic">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

export function CreateDealModal({ onClose }: CreateDealModalProps) {
  const [dealMode, setDealMode] = useState<DealMode>('Pawn');
  const [primaryCustomerMode, setPrimaryCustomerMode] = useState<CustomerMode>('Guest');
  const [secondaryCustomerMode, setSecondaryCustomerMode] = useState<CustomerMode>('Guest');
  const [hasSecondaryCustomer, setHasSecondaryCustomer] = useState(false);
  const [duration, setDuration] = useState('90');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Dynamic Items State
  const [items, setItems] = useState<{ 
    id: string; 
    category: string; 
    title: string; 
    requestedPayout: string; 
    overrideSuggested?: string; 
    condition?: string;
    // Car specific fields
    vin?: string;
    make?: string;
    model?: string;
    year?: string;
    odometer?: string;
    indicataStatus?: 'idle' | 'searching' | 'not_found';
  }>([
    { id: '1', category: '', title: '', requestedPayout: '', condition: '', indicataStatus: 'idle' }
  ]);
  const [nextItemId, setNextItemId] = useState(2);
  
  // Sections collapse state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    customer: true,
    metadata: true,
    items: true,
    transport: true,
    notes: true,
    workflow: true,
  });

  const [expandedItemCards, setExpandedItemCards] = useState<Record<string, boolean>>({ '1': true });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleItemCard = (id: string) => {
    setExpandedItemCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const addItem = () => {
    const newId = String(nextItemId);
    setItems([...items, { id: newId, category: '', title: '', requestedPayout: '', condition: '' }]);
    setNextItemId(prev => prev + 1);
    setExpandedItemCards(prev => ({ ...prev, [newId]: true }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id !== id) return item;

        let updatedItem = { ...item, [field]: value };

        // Auto-generate title for Car
        if (updatedItem.category === 'Car' && (field === 'make' || field === 'model' || field === 'year')) {
          const parts = [updatedItem.make, updatedItem.model, updatedItem.year].filter(Boolean);
          updatedItem.title = parts.join(' ');
        }

        // Handle VIN Search Simulation
        if (field === 'vin' && value.length >= 17 && item.indicataStatus === 'idle') {
          updatedItem.indicataStatus = 'searching';
          
          // Simulate search delay
          setTimeout(() => {
            setItems(currentItems => 
              currentItems.map(ci => 
                ci.id === id ? { ...ci, indicataStatus: 'not_found' } : ci
              )
            );
          }, 1500);
        }

        return updatedItem;
      });
    });
  };

  // Mock calculations for sidebar
  const getMockSuggested = (category: string, condition?: string) => {
    if (!category || !condition) return 0;
    
    let base = 0;
    switch (category) {
      case 'Car': base = 1472.50; break;
      case 'Motorcycle': base = 850.00; break;
      case 'Smartphones': base = 350.00; break;
      case 'Watches': base = 850.00; break;
      default: return 0;
    }
    
    switch (condition) {
      case 'New': return base * 1.2;
      case 'New-like': return base * 1.1;
      case 'Used': return base;
      case 'Worn Out': return base * 0.7;
      default: return base;
    }
  };

  const getItemSuggested = (item: { category: string; condition?: string; overrideSuggested?: string }) => {
    if (!item.category || !item.condition) return 0;
    if (item.overrideSuggested !== undefined && item.overrideSuggested.trim() !== '') {
      const val = parseFloat(item.overrideSuggested);
      if (!isNaN(val)) return val;
    }
    return getMockSuggested(item.category, item.condition);
  };

  const totalSuggested = items.reduce((sum, item) => sum + getItemSuggested(item), 0);
  const totalMarketValue = items.reduce((sum, item) => sum + (getItemSuggested(item) / 0.6), 0);
  const totalLtv = totalMarketValue * 0.65;
  const totalFees = totalLtv - totalSuggested;

  let totalRequested = 0;
  let hasAllRequestedPayouts = items.length > 0;
  items.forEach(item => {
    const val = parseFloat(item.requestedPayout);
    if (!isNaN(val) && item.requestedPayout.trim() !== '') {
      totalRequested += val;
    } else {
      hasAllRequestedPayouts = false;
    }
  });

  const hasCar = items.some(item => item.category === 'Car');

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-['Inter',sans-serif]">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-[#17142b]/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Slide-over panel */}
      <motion.div 
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-[1100px] bg-[#edeef1] h-full shadow-2xl flex flex-col"
      >
        
        {/* Header */}
        <div className="bg-white px-[24px] py-[16px] border-b border-[#d7dbe0] flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-[24px]">
            <h2 className="text-[20px] font-semibold text-[#1b1d20]">Create Deal</h2>
            <div className="flex bg-[#edeef1] p-[4px] rounded-[6px]">
              {(['Pawn', 'Purchase'] as DealMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDealMode(mode)}
                  className={`px-[12px] py-[6px] text-[14px] font-medium rounded-[4px] transition-colors ${
                    dealMode === mode 
                      ? 'bg-white text-[#1b1d20] shadow-sm' 
                      : 'text-[#5e6978] hover:text-[#1b1d20]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <button 
              onClick={onClose}
              className="px-[16px] py-[8px] text-[14px] font-semibold text-[#3d444f] hover:bg-[#edeef1] rounded-[8px] transition-colors"
            >
              Cancel
            </button>
            <button className="px-[16px] py-[8px] text-[14px] font-semibold text-[#4649e5] bg-[#eeeffe] hover:bg-[#e4e6fe] rounded-[8px] transition-colors">
              Save Draft
            </button>
            <button className="px-[16px] py-[8px] text-[14px] font-semibold text-white bg-[#4649e5] hover:bg-[#3b3ec3] rounded-[8px] transition-colors shadow-sm">
              Create {dealMode} Deal
            </button>
            <button 
              onClick={onClose}
              className="ml-[8px] p-[8px] text-[#5e6978] hover:bg-[#edeef1] rounded-[8px] transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

              {/* Content Area - Split Pane */}
        <div className="flex flex-1 min-h-0">
          
          {/* Left Pane - Form */}
          <div className="flex-1 overflow-y-auto slick-scrollbar p-[24px]">
            <div className="max-w-[700px] flex flex-col gap-[16px]">
              
              {/* Customer Block */}
              <div className="bg-white rounded-[8px] border border-[#d7dbe0] overflow-hidden">
                <button 
                  onClick={() => toggleSection('customer')}
                  className="w-full flex items-center justify-between p-[16px] bg-white hover:bg-[#f8f9fb] transition-colors"
                >
                  <h3 className="text-[16px] font-semibold text-[#1b1d20]">Customer</h3>
                  {expandedSections.customer ? <ChevronUp size={20} className="text-[#8b95a5]" /> : <ChevronDown size={20} className="text-[#8b95a5]" />}
                </button>
                
                {expandedSections.customer && (
                  <div className="p-[16px] pt-0 border-t border-[#f1f3f5] mt-[4px]">
                    
                    {/* Primary Customer */}
                    <div className="mt-[12px]">
                      {hasSecondaryCustomer && (
                        <h4 className="text-[14px] font-medium text-[#1b1d20] mb-[12px]">Primary Customer</h4>
                      )}
                      <div className="flex gap-[16px] mb-[16px]">
                        {(['Registered', 'Guest', 'Create New'] as CustomerMode[]).map((mode) => (
                          <label key={mode} className="flex items-center gap-[8px] cursor-pointer">
                            <div className={`w-[16px] h-[16px] rounded-full border flex items-center justify-center ${primaryCustomerMode === mode ? 'border-[#4649e5]' : 'border-[#b4bbc5]'}`}>
                              {primaryCustomerMode === mode && <div className="w-[8px] h-[8px] rounded-full bg-[#4649e5]" />}
                            </div>
                            <span className="text-[14px] text-[#3d444f]">{mode}</span>
                          </label>
                        ))}
                      </div>

                      {primaryCustomerMode === 'Guest' && (
                        <div className="grid grid-cols-2 gap-[16px]">
                          <div className="flex flex-col gap-[6px]">
                            <label className="text-[13px] font-medium text-[#5e6978]">Email *</label>
                            <input type="email" placeholder="customer@example.com" className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5] focus:ring-1 focus:ring-[#4649e5]" />
                          </div>
                          <div className="flex flex-col gap-[6px]">
                            <label className="text-[13px] font-medium text-[#5e6978]">Phone (Optional)</label>
                            <input type="tel" placeholder="+1 234 567 8900" className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5] focus:ring-1 focus:ring-[#4649e5]" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Secondary Customer */}
                    {hasSecondaryCustomer ? (
                      <div className="mt-[24px] pt-[20px] border-t border-[#e5e7eb]">
                        <div className="flex justify-between items-center mb-[12px]">
                          <h4 className="text-[14px] font-medium text-[#1b1d20]">Secondary Customer</h4>
                          <button 
                            onClick={() => setHasSecondaryCustomer(false)}
                            className="text-[#b91d1c] text-[13px] font-medium hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex gap-[16px] mb-[16px]">
                          {(['Registered', 'Guest', 'Create New'] as CustomerMode[]).map((mode) => (
                            <label key={mode} className="flex items-center gap-[8px] cursor-pointer">
                              <div className={`w-[16px] h-[16px] rounded-full border flex items-center justify-center ${secondaryCustomerMode === mode ? 'border-[#4649e5]' : 'border-[#b4bbc5]'}`}>
                                {secondaryCustomerMode === mode && <div className="w-[8px] h-[8px] rounded-full bg-[#4649e5]" />}
                              </div>
                              <span className="text-[14px] text-[#3d444f]">{mode}</span>
                            </label>
                          ))}
                        </div>

                        {secondaryCustomerMode === 'Guest' && (
                          <div className="grid grid-cols-2 gap-[16px]">
                            <div className="flex flex-col gap-[6px]">
                              <label className="text-[13px] font-medium text-[#5e6978]">Email *</label>
                              <input type="email" placeholder="secondary@example.com" className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5] focus:ring-1 focus:ring-[#4649e5]" />
                            </div>
                            <div className="flex flex-col gap-[6px]">
                              <label className="text-[13px] font-medium text-[#5e6978]">Phone (Optional)</label>
                              <input type="tel" placeholder="+1 234 567 8900" className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5] focus:ring-1 focus:ring-[#4649e5]" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={() => setHasSecondaryCustomer(true)}
                        className="mt-[20px] flex items-center gap-[8px] text-[#4649e5] text-[14px] font-medium hover:underline"
                      >
                        <Plus size={16} />
                        Add secondary customer
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="bg-white rounded-[8px] border border-[#d7dbe0] overflow-hidden">
                <button 
                  onClick={() => toggleSection('items')}
                  className="w-full flex items-center justify-between p-[16px] bg-white hover:bg-[#f8f9fb] transition-colors"
                >
                  <div className="flex items-center gap-[8px]">
                    <h3 className="text-[16px] font-semibold text-[#1b1d20]">Items</h3>
                    <span className="bg-[#edeef1] text-[#5e6978] text-[12px] px-[8px] py-[2px] rounded-full font-medium">{items.length}</span>
                  </div>
                  {expandedSections.items ? <ChevronUp size={20} className="text-[#8b95a5]" /> : <ChevronDown size={20} className="text-[#8b95a5]" />}
                </button>
                
                {expandedSections.items && (
                  <div className="p-[16px] pt-0 border-t border-[#f1f3f5] mt-[4px]">
                    {items.map((item, index) => (
                      <div key={item.id} className="mt-[12px] border border-[#e5e7eb] rounded-[8px] bg-[#fcfcfd] overflow-hidden">
                        <div 
                          className="flex justify-between items-center p-[16px] cursor-pointer hover:bg-[#f8f9fb] transition-colors"
                          onClick={() => toggleItemCard(item.id)}
                        >
                          <div className="flex items-center gap-[8px]">
                            <h4 className="font-medium text-[#1b1d20] text-[14px]">Item #{index + 1}</h4>
                            <span className="text-[13px] text-[#5e6978]">- {item.category}</span>
                          </div>
                          <div className="flex items-center gap-[12px]">
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                              className="text-[#b91d1c] text-[13px] font-medium hover:underline"
                            >
                              Remove
                            </button>
                            {expandedItemCards[item.id] ? <ChevronUp size={16} className="text-[#8b95a5]" /> : <ChevronDown size={16} className="text-[#8b95a5]" />}
                          </div>
                        </div>
                        
                        {expandedItemCards[item.id] && (
                          <div className="p-[16px] pt-0 border-t border-[#f1f3f5] mt-[4px]">
                            {/* Category Selection */}
                            <div className="grid grid-cols-2 gap-[16px] mb-[16px] mt-[12px]">
                              <div className="flex flex-col gap-[6px]">
                                <label className="text-[13px] font-medium text-[#5e6978]">Category *</label>
                                <select 
                                  value={item.category}
                                  onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                                  className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] bg-white text-[#1b1d20] focus:outline-none focus:border-[#4649e5]"
                                >
                                  <option value="" disabled>Select a category...</option>
                                  <option value="Car">Car</option>
                                  <option value="Motorcycle">Motorcycle</option>
                                  <option value="Smartphones">Smartphones</option>
                                  <option value="Watches">Watches</option>
                                </select>
                              </div>
                              
                              {/* VIN Field - Shown immediately for Car */}
                              {item.category === 'Car' && (
                                <div className="flex flex-col gap-[6px]">
                                  <label className="text-[13px] font-medium text-[#5e6978]">VIN number *</label>
                                  <input 
                                    type="text" 
                                    value={item.vin || ''}
                                    onChange={(e) => updateItem(item.id, 'vin', e.target.value.toUpperCase())}
                                    placeholder="Enter 17-digit VIN"
                                    maxLength={17}
                                    className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5] uppercase" 
                                  />
                                </div>
                              )}

                              {/* Standard Item Title for non-car items */}
                              {item.category !== 'Car' && item.category !== '' && (
                                <div className="flex flex-col gap-[6px]">
                                  <label className="text-[13px] font-medium text-[#5e6978]">Item Title</label>
                                  <input 
                                    type="text" 
                                    value={item.title}
                                    onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                                    placeholder={
                                      item.category === 'Smartphones' ? 'e.g. iPhone 14 Pro, Samsung Galaxy S23' :
                                      'e.g. Rolex Submariner, Omega Speedmaster'
                                    } 
                                    className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5]" 
                                  />
                                </div>
                              )}
                            </div>

                            {/* Indicata Search Simulation for Car */}
                            {item.category === 'Car' && item.indicataStatus === 'searching' && (
                              <div className="mb-[16px] p-[12px] bg-[#f0f7ff] border border-[#e0e7ff] rounded-[6px] flex items-center gap-[12px]">
                                <Loader2 size={18} className="text-[#4649e5] animate-spin" />
                                <span className="text-[14px] font-medium text-[#4649e5]">Searching Indicata records...</span>
                              </div>
                            )}

                            {item.category === 'Car' && item.indicataStatus === 'not_found' && (
                              <div className="mb-[16px] p-[12px] bg-[#fff1f2] border border-[#fecdd3] rounded-[6px] flex items-center gap-[12px]">
                                <AlertCircle size={18} className="text-[#e11d48]" />
                                <span className="text-[14px] font-medium text-[#e11d48]">No records found on Indicata. Please enter details manually.</span>
                              </div>
                            )}

                            {/* Manual Car Details - Shown after Indicata "not found" */}
                            {item.category === 'Car' && item.indicataStatus === 'not_found' && (
                              <div className="space-y-[16px]">
                                <div className="grid grid-cols-2 gap-[16px]">
                                  <SearchableDropdown 
                                    label="Vehicle Make"
                                    value={item.make || ''}
                                    options={Object.keys(CAR_DATA)}
                                    onChange={(val) => updateItem(item.id, 'make', val)}
                                  />
                                  <SearchableDropdown 
                                    label="Vehicle Model"
                                    value={item.model || ''}
                                    options={item.make ? CAR_DATA[item.make] || [] : []}
                                    onChange={(val) => updateItem(item.id, 'model', val)}
                                    placeholder={item.make ? "Select Model" : "Select Make first"}
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-[16px]">
                                  <div className="flex flex-col gap-[6px]">
                                    <label className="text-[13px] font-medium text-[#5e6978]">Vehicle Year</label>
                                    <input 
                                      type="number" 
                                      value={item.year || ''}
                                      onChange={(e) => updateItem(item.id, 'year', e.target.value)}
                                      placeholder="2022"
                                      className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5]" 
                                    />
                                  </div>
                                  <div className="flex flex-col gap-[6px]">
                                    <label className="text-[13px] font-medium text-[#5e6978]">Odometer</label>
                                    <div className="relative">
                                      <input 
                                        type="number" 
                                        value={item.odometer || ''}
                                        onChange={(e) => updateItem(item.id, 'odometer', e.target.value)}
                                        placeholder="45000"
                                        className="w-full h-[38px] px-[12px] py-[8px] pr-[40px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5]" 
                                      />
                                      <span className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#8b95a5] text-[13px] font-medium">KM</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-[16px]">
                                  <div className="flex flex-col gap-[6px]">
                                    <label className="text-[13px] font-medium text-[#5e6978]">Suggested Market Value</label>
                                    <div className="relative group">
                                      <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b95a5] text-[14px]">€</span>
                                      <input 
                                        type="number" 
                                        value={item.overrideSuggested || ''}
                                        onChange={(e) => updateItem(item.id, 'overrideSuggested', e.target.value)}
                                        placeholder="15000" 
                                        className="h-[38px] w-full pl-[28px] pr-[36px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5] font-medium text-[#16a34a]" 
                                      />
                                      <Pencil size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#8b95a5] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-[6px]">
                                    <label className="text-[13px] font-medium text-[#5e6978]">Item Name</label>
                                    <input 
                                      type="text" 
                                      value={item.title || ''}
                                      readOnly
                                      placeholder="Make + Model + Year"
                                      className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#f1f3f5] bg-[#f8f9fb] text-[#5e6978] text-[14px] font-medium focus:outline-none" 
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Standard Payout & Condition for non-car OR car after VIN */}
                            {(item.category !== 'Car' || (item.category === 'Car' && item.indicataStatus === 'not_found')) && (
                              <div className="grid grid-cols-2 gap-[16px] mt-[16px]">
                                <div className="flex flex-col gap-[6px]">
                                  <label className="text-[13px] font-medium text-[#5e6978]">Requested Payout</label>
                                  <div className="relative">
                                    <span className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b95a5] text-[14px]">€</span>
                                    <input 
                                      type="number" 
                                      value={item.requestedPayout}
                                      onChange={(e) => updateItem(item.id, 'requestedPayout', e.target.value)}
                                      placeholder="1200" 
                                      className="h-[38px] w-full pl-[28px] pr-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5]" 
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-[6px]">
                                  <label className="text-[13px] font-medium text-[#5e6978]">Item Condition *</label>
                                  <select 
                                    value={item.condition || ''}
                                    onChange={(e) => updateItem(item.id, 'condition', e.target.value)}
                                    className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] bg-white text-[#1b1d20] focus:outline-none focus:border-[#4649e5]"
                                  >
                                    <option value="" disabled>Select condition...</option>
                                    <option value="New">New</option>
                                    <option value="New-like">New-like</option>
                                    <option value="Used">Used</option>
                                    <option value="Worn Out">Worn Out</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    <button 
                      onClick={addItem}
                      className="mt-[16px] flex items-center gap-[8px] text-[#4649e5] text-[14px] font-medium hover:underline"
                    >
                      <Plus size={16} />
                      Add another item
                    </button>
                  </div>
                )}
              </div>

              {/* Deal Metadata */}
              <div className="bg-white rounded-[8px] border border-[#d7dbe0] overflow-hidden">
                <button 
                  onClick={() => toggleSection('metadata')}
                  className="w-full flex items-center justify-between p-[16px] bg-white hover:bg-[#f8f9fb] transition-colors"
                >
                  <h3 className="text-[16px] font-semibold text-[#1b1d20]">Deal Metadata</h3>
                  {expandedSections.metadata ? <ChevronUp size={20} className="text-[#8b95a5]" /> : <ChevronDown size={20} className="text-[#8b95a5]" />}
                </button>
                
                {expandedSections.metadata && (
                  <div className="p-[16px] pt-0 border-t border-[#f1f3f5] mt-[4px]">
                    <div className="grid grid-cols-2 gap-[16px] mt-[12px]">
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[13px] font-medium text-[#5e6978]">Company *</label>
                        <select className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] bg-white text-[#1b1d20] focus:outline-none focus:border-[#4649e5]">
                          <option>CASHY_AUT</option>
                          <option>CASHY_GER</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[13px] font-medium text-[#5e6978]">Branch / Shop *</label>
                        <select className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] bg-white text-[#1b1d20] focus:outline-none focus:border-[#4649e5]">
                          <option>Vienna Main</option>
                          <option>Berlin Center</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[13px] font-medium text-[#5e6978]">Duration (days)</label>
                        <input 
                          type="number" 
                          value={duration} 
                          onChange={(e) => setDuration(e.target.value)}
                          className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5]" 
                        />
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[13px] font-medium text-[#5e6978]">Due Date *</label>
                        <input 
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5] bg-white text-[#1b1d20]" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transport & Storage */}
              <div className="bg-white rounded-[8px] border border-[#d7dbe0] overflow-hidden">
                <button 
                  onClick={() => toggleSection('transport')}
                  className="w-full flex items-center justify-between p-[16px] bg-white hover:bg-[#f8f9fb] transition-colors"
                >
                  <h3 className="text-[16px] font-semibold text-[#1b1d20]">Transport & Storage</h3>
                  {expandedSections.transport ? <ChevronUp size={20} className="text-[#8b95a5]" /> : <ChevronDown size={20} className="text-[#8b95a5]" />}
                </button>
                
                {expandedSections.transport && (
                  <div className="p-[16px] pt-0 border-t border-[#f1f3f5] mt-[4px]">
                    <div className="grid grid-cols-2 gap-[16px] mt-[12px]">
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[13px] font-medium text-[#5e6978]">Transport Method</label>
                        <select className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] bg-white text-[#1b1d20] focus:outline-none focus:border-[#4649e5]">
                          <option>Pickup: SHOP</option>
                          <option>Pickup: EXTENSION</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[13px] font-medium text-[#5e6978]">Preferred Payout Method</label>
                        <select className="h-[38px] px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] bg-white text-[#1b1d20] focus:outline-none focus:border-[#4649e5]">
                          <option>Cash</option>
                          <option>Bank Transfer</option>
                          <option>PayPal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div className="bg-white rounded-[8px] border border-[#d7dbe0] overflow-hidden">
                <button 
                  onClick={() => toggleSection('notes')}
                  className="w-full flex items-center justify-between p-[16px] bg-white hover:bg-[#f8f9fb] transition-colors"
                >
                  <h3 className="text-[16px] font-semibold text-[#1b1d20]">Additional Notes</h3>
                  {expandedSections.notes ? <ChevronUp size={20} className="text-[#8b95a5]" /> : <ChevronDown size={20} className="text-[#8b95a5]" />}
                </button>
                
                {expandedSections.notes && (
                  <div className="p-[16px] pt-0 border-t border-[#f1f3f5] mt-[4px]">
                    <div className="flex flex-col gap-[6px] mt-[12px]">
                      <textarea 
                        placeholder="e.g. Any special handling instructions or customer notes"
                        className="w-full px-[12px] py-[8px] rounded-[6px] border border-[#d7dbe0] text-[14px] focus:outline-none focus:border-[#4649e5] min-h-[80px] resize-y"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Right Pane - Live Calculation */}
          <div className="w-[400px] border-l border-[#d7dbe0] bg-[#f8f9fb] p-[24px] flex flex-col gap-[20px] shrink-0 overflow-y-auto slick-scrollbar">
            
            <div className="flex items-center justify-between pb-[16px] border-b border-[#e5e7eb]">
              <div className="flex items-center gap-[8px]">
                <Calculator size={20} className="text-[#4649e5]" />
                <h3 className="text-[16px] font-semibold text-[#1b1d20]">Calculation Engine</h3>
                <div className="flex items-center gap-[4px] ml-[4px] px-[8px] py-[2px] bg-[#dcfce7] rounded-full border border-[#bbf7d0]">
                  <div className="w-[6px] h-[6px] rounded-full bg-[#16a34a] animate-pulse" />
                  <span className="text-[12px] font-medium text-[#166534]">Live</span>
                </div>
              </div>
              <button className="flex items-center gap-[6px] text-[13px] font-medium text-[#3d444f] bg-white border border-[#d7dbe0] hover:bg-[#edeef1] transition-colors px-[12px] py-[6px] rounded-[6px] shadow-sm">
                <RefreshCw size={14} />
                Sync
              </button>
            </div>

            {/* Itemized Breakdown */}
            {items.length > 0 && (
              <div className="flex flex-col gap-[12px] pb-[16px] border-b border-[#e5e7eb]">
                <h4 className="text-[12px] font-semibold text-[#8b95a5] uppercase tracking-wider">Item Breakdown</h4>
                {items.map((item, idx) => {
                  const isReady = item.category && item.condition;
                  const suggested = isReady ? getMockSuggested(item.category, item.condition) : 0;
                  const requested = parseFloat(item.requestedPayout);
                  const hasReq = !isNaN(requested) && item.requestedPayout.trim() !== '';

                  return (
                    <div key={item.id} className="bg-white rounded-[8px] p-[12px] border border-[#e5e7eb] shadow-sm flex flex-col gap-[8px]">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-[#1b1d20] text-[14px] truncate">
                          {item.title || `Item #${idx + 1}`} <span className="text-[#8b95a5] font-normal">({item.category || 'No Category'})</span>
                        </span>
                      </div>
                      
                      {!isReady ? (
                        <div className="text-[13px] text-[#8b95a5] italic py-[4px]">
                          Select category and condition to calculate value.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-[4px] text-[13px]">
                          <div className="flex justify-between items-center group/edit">
                            <span className="text-[#5e6978] flex items-center gap-[4px]" title="Edit suggested value">
                              Suggested
                              <Edit2 size={12} className="text-[#8b95a5] opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                            </span>
                            <div className="relative flex items-center bg-transparent hover:bg-[#f8f9fb] focus-within:bg-white focus-within:shadow-[0_0_0_2px_rgba(70,73,229,0.2)] rounded-[4px] transition-all -mr-[4px] pr-[4px]">
                              <span className="text-[#16a34a] font-medium pl-[4px] pr-[2px] pointer-events-none">€</span>
                              <input
                                type="number"
                                value={item.overrideSuggested ?? suggested.toFixed(2)}
                                onChange={(e) => updateItem(item.id, 'overrideSuggested', e.target.value)}
                                placeholder={suggested.toFixed(2)}
                                className="w-[70px] bg-transparent text-right font-medium text-[#16a34a] placeholder:text-[#16a34a]/50 border-none focus:outline-none p-0 py-[2px] transition-colors appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                              />
                            </div>
                          </div>
                          {hasReq && (
                            <div className="flex justify-between items-center">
                              <span className="text-[#5e6978]">Requested</span>
                              <span className="font-medium text-[#1b1d20]">€ {requested.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary */}
            <div className="flex flex-col gap-[16px]">
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[#5e6978]">Total Market Value</span>
                <span className="font-medium text-[#1b1d20]">€ {totalMarketValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[#5e6978]">Max LTV (65%)</span>
                <span className="font-medium text-[#1b1d20]">€ {totalLtv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[14px]">
                <span className="text-[#5e6978]">Fees (Estimated)</span>
                <span className="font-medium text-[#b91d1c]">- € {totalFees.toFixed(2)}</span>
              </div>
              
              <div className="h-[1px] bg-[#d7dbe0] w-full my-[4px]" />
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-[#1b1d20]">Suggested Payout</span>
                  {hasAllRequestedPayouts && (
                    <span className="text-[13px] text-[#5e6978] mt-[2px]">Requested Payout Total</span>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[20px] font-bold text-[#16a34a]">€ {totalSuggested.toFixed(2)}</span>
                  {hasAllRequestedPayouts && (
                    <span className="text-[14px] font-medium text-[#1b1d20] mt-[2px]">€ {totalRequested.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>

            {hasCar && (
              <div className="mt-[16px] bg-[#fffbed] border border-[#fef08a] rounded-[8px] p-[16px]">
                <div className="flex gap-[12px]">
                  <AlertCircle size={20} className="text-[#ca8a04] shrink-0" />
                  <div className="flex flex-col gap-[4px]">
                    <h4 className="text-[14px] font-medium text-[#854d0e]">Validation steps</h4>
                    <p className="text-[13px] text-[#a16207] mt-[4px] mb-[8px] leading-relaxed">
                      Based on the category of the items, these need to be validated before verification and payout:
                    </p>
                    <ul className="text-[13px] text-[#a16207] list-disc list-inside">
                      <li>Car documents</li>
                      <li>VIN formatting</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
