import svgPaths from "../../imports/svg-4o201vrq4p";
import svgPathsCheckbox from "../../imports/svg-jusezbzcm9";
import { Field } from './DealWizardBuilder';

interface FieldItemProps {
  field: Field;
  onRemove: (fieldId: string) => void;
  onUpdate: (fieldId: string, updates: Partial<Field>) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  dragHandleRef?: (node: any) => any;
}

export function FieldItem({ field, onRemove, onUpdate, isSelected, onSelect, dragHandleRef }: FieldItemProps) {
  const isExpanded = field.expanded;
  
  const toggleExpanded = () => {
    if (onSelect) onSelect();
    onUpdate(field.id, { expanded: !field.expanded });
  };

  const getFieldIcon = () => {
    switch (field.fieldType.type) {
      case 'text':
        return (
          <div className="overflow-clip relative shrink-0 size-[16px]">
            <div className="absolute inset-[12.5%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                <g>
                  <path d={svgPaths.p2af8c680} fill="#131518" />
                  <path clipRule="evenodd" d={svgPaths.p2d532b80} fill="#131518" fillRule="evenodd" />
                  <path d={svgPaths.p39383280} fill="#131518" />
                  <path d={svgPaths.p13ccf000} fill="#131518" />
                </g>
              </svg>
            </div>
          </div>
        );
      case 'dropdown':
        return (
          <div className="overflow-clip relative shrink-0 size-[16px]">
            <div className="absolute inset-[4.17%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6667 14.6667">
                <g>
                  <path clipRule="evenodd" d={svgPaths.p24e57c00} fill="#131518" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgPaths.p6279b00} fill="#131518" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgPaths.p340ca370} fill="#131518" fillRule="evenodd" />
                </g>
              </svg>
            </div>
          </div>
        );
      case 'checkbox':
        return (
          <div className="overflow-clip relative shrink-0 size-[16px]">
            <div className="absolute inset-[8.33%_4.17%_8.33%_8.33%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 13.3333">
                <g>
                  <path clipRule="evenodd" d={svgPathsCheckbox.p2e52cc00} fill="#131518" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgPathsCheckbox.pd7544a0} fill="#131518" fillRule="evenodd" />
                </g>
              </svg>
            </div>
          </div>
        );
      case 'fileUpload':
        return (
          <div className="overflow-clip relative shrink-0 size-[16px]">
            <div className="absolute inset-[8.33%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
                <g>
                  <path clipRule="evenodd" d={svgPaths.p25937080} fill="#131518" fillRule="evenodd" />
                  <path d={svgPaths.p21545400} fill="#131518" />
                  <path d={svgPaths.p1e5ff180} fill="#131518" />
                  <path clipRule="evenodd" d={svgPaths.p29f95a00} fill="#131518" fillRule="evenodd" />
                  <path d={svgPaths.p11b3300} fill="#131518" />
                </g>
              </svg>
            </div>
          </div>
        );
      default:
        return (
          <div className="overflow-clip relative shrink-0 size-[16px]">
            <div className="absolute inset-[12.5%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                <g>
                  <path d={svgPaths.p2af8c680} fill="#131518" />
                  <path clipRule="evenodd" d={svgPaths.p2d532b80} fill="#131518" fillRule="evenodd" />
                  <path d={svgPaths.p39383280} fill="#131518" />
                  <path d={svgPaths.p13ccf000} fill="#131518" />
                </g>
              </svg>
            </div>
          </div>
        );
    }
  };

  if (isExpanded) {
    return (
      <div 
        className="bg-white relative rounded-[8px] border border-[#17142b] w-full p-[24px] cursor-pointer"
        onClick={(e) => {
          if (onSelect) onSelect();
          const target = e.target as HTMLElement;
          if (!target.closest('button') && !target.closest('input') && !target.closest('label') && !target.closest('select') && !target.closest('.drag-handle')) {
            // Check if user is currently selecting text to avoid unintended collapse
            const selection = window.getSelection();
            if (selection && selection.toString().length > 0) {
              return;
            }
            onUpdate(field.id, { expanded: !field.expanded });
          }
        }}
      >
        <div className="flex flex-col gap-[20px] cursor-default">
          {/* Header with drag handle and delete */}
          <div className="flex items-center gap-[12px]">
            {/* Drag Handle */}
            <div ref={dragHandleRef} className="relative shrink-0 size-[20px] cursor-move drag-handle">
              <div className="absolute inset-[20.83%_29.17%]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.33333 11.6667">
                  <path d={svgPaths.pec0fb80} fill="#6C798B" />
                </svg>
              </div>
            </div>

            {/* Field Type Icon */}
            <div className="bg-[#d7dbe0] relative rounded-[8px] shrink-0">
              <div className="p-[10px]">
                {getFieldIcon()}
              </div>
            </div>

            {/* Field Type Title */}
            <div className="font-['Inter',sans-serif] font-medium text-[#131518] text-[14px] ml-[4px]">
              {field.fieldType.label}
            </div>

            <div className="flex-1" />

            {/* Delete Button */}
            <button
              onClick={() => onRemove(field.id)}
              className="bg-white border border-[#b4bbc5] flex items-center justify-center p-[8px] rounded-[8px] hover:bg-[#fef2f2] hover:border-[#b91d1c] transition-colors"
            >
              <div className="overflow-clip relative shrink-0 size-[16px]">
                <div className="absolute inset-[4.17%_8.33%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 14.6667">
                    <g>
                      <path clipRule="evenodd" d={svgPaths.p38ef9c80} fill="#131518" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPaths.p3d5ca800} fill="#131518" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPaths.p732ef00} fill="#131518" fillRule="evenodd" />
                      <path d={svgPaths.p35b9a200} fill="#131518" />
                    </g>
                  </svg>
                </div>
              </div>
            </button>

            {/* Collapse Button */}
            <button
              onClick={toggleExpanded}
              className="text-[#6c798b] hover:text-[#131518] text-[14px] font-['Inter',sans-serif]"
            >
              Collapse
            </button>
          </div>

          {/* COMMON CONFIGURATION (LABEL & HELP TEXT) */}
          <div className="flex flex-col gap-[16px] bg-[#fbfcfc] p-[16px] rounded-[8px] border border-[#d7dbe0]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Inter',sans-serif] font-semibold text-[#131518] text-[13px] uppercase tracking-wider">
                General
              </label>
              
              {/* Field Label Input */}
              <div className="flex flex-col gap-[6px]">
                <span className="font-['Inter',sans-serif] font-medium text-[#3d444f] text-[14px]">Field Label</span>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                  className="border border-[#b4bbc5] rounded-[8px] px-[12px] py-[10px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b] transition-all bg-white"
                  placeholder="e.g. Full Name"
                />
              </div>

              {/* Help Text Input */}
              <div className="flex flex-col gap-[6px]">
                <span className="font-['Inter',sans-serif] font-medium text-[#3d444f] text-[14px]">Help Text / Description</span>
                <input
                  type="text"
                  value={field.helpText || ''}
                  onChange={(e) => onUpdate(field.id, { helpText: e.target.value })}
                  className="border border-[#b4bbc5] rounded-[8px] px-[12px] py-[10px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b] transition-all bg-white"
                  placeholder="e.g. Please enter your name as per Aadhaar"
                />
              </div>
            </div>
          </div>

          {/* TYPE-SPECIFIC CONFIGURATION */}
          <div className="flex flex-col gap-[16px] bg-white p-[16px] rounded-[8px] border border-[#d7dbe0]">
            <label className="font-['Inter',sans-serif] font-semibold text-[#131518] text-[13px] uppercase tracking-wider">
              {field.fieldType.type === 'fileUpload' || field.fieldType.type === 'imageUpload' ? 'Constraints' : field.fieldType.type === 'dropdown' || field.fieldType.type === 'checkbox' ? 'Options' : 'Properties'}
            </label>

            {/* Field Configuration Based on Type */}
            {(field.fieldType.type === 'text' || field.fieldType.type === 'textarea' || field.fieldType.type === 'url' || field.fieldType.type === 'datePicker') && (
              <div className="grid grid-cols-2 gap-[16px]">
                {/* Field Placeholder Input */}
                <div className="flex flex-col gap-[6px]">
                  <span className="font-['Inter',sans-serif] font-medium text-[#3d444f] text-[14px]">Placeholder</span>
                  <input
                    type="text"
                    value={field.placeholder}
                    onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
                    className="border border-[#b4bbc5] rounded-[8px] px-[12px] py-[10px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b] bg-white"
                    placeholder="Enter placeholder text"
                  />
                </div>
                
                {/* Default Value Input */}
                <div className="flex flex-col gap-[6px]">
                  <span className="font-['Inter',sans-serif] font-medium text-[#3d444f] text-[14px]">Default Value</span>
                  <input
                    type={field.fieldType.type === 'datePicker' ? 'date' : 'text'}
                    value={field.defaultValue || ''}
                    onChange={(e) => onUpdate(field.id, { defaultValue: e.target.value })}
                    className="border border-[#b4bbc5] rounded-[8px] px-[12px] py-[10px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b] bg-white"
                    placeholder="Optional default"
                  />
                </div>
              </div>
            )}

            {(field.fieldType.type === 'fileUpload' || field.fieldType.type === 'imageUpload') && (
              <div className="flex flex-col gap-[16px]">
                <div className="grid grid-cols-1 gap-[16px]">
                  {/* Button Label Input */}
                  <div className="flex flex-col gap-[6px]">
                    <span className="font-['Inter',sans-serif] font-medium text-[#3d444f] text-[14px]">Button Label</span>
                    <input
                      type="text"
                      value={field.buttonLabel || 'Upload'}
                      onChange={(e) => onUpdate(field.id, { buttonLabel: e.target.value })}
                      className="border border-[#b4bbc5] rounded-[8px] px-[12px] py-[10px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b] bg-white"
                      placeholder="e.g. Upload File"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-[16px]">
                  {/* Max File Size */}
                  <div className="flex flex-col gap-[6px]">
                    <span className="font-['Inter',sans-serif] font-medium text-[#3d444f] text-[14px]">Max File Size (MB)</span>
                    <input
                      type="number"
                      value={field.maxFileSize || 10}
                      onChange={(e) => onUpdate(field.id, { maxFileSize: parseInt(e.target.value) || 10 })}
                      className="border border-[#b4bbc5] rounded-[8px] px-[12px] py-[10px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b] bg-white"
                    />
                  </div>
                  
                  {/* Allowed Formats */}
                  <div className="flex flex-col gap-[6px]">
                    <span className="font-['Inter',sans-serif] font-medium text-[#3d444f] text-[14px]">Allowed Formats</span>
                    <input
                      type="text"
                      value={field.allowedFormats || ''}
                      onChange={(e) => onUpdate(field.id, { allowedFormats: e.target.value })}
                      className="border border-[#b4bbc5] rounded-[8px] px-[12px] py-[10px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b] bg-white"
                      placeholder=".pdf, .png, .jpg"
                    />
                  </div>
                </div>
              </div>
            )}

            {(field.fieldType.type === 'dropdown' || field.fieldType.type === 'checkbox') && (
              <div className="flex flex-col gap-[12px]">
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center justify-between">
                    <span className="font-['Inter',sans-serif] font-medium text-[#3d444f] text-[14px]">Manage Options</span>
                    <span className="text-[#6c798b] text-[12px]">Add labels for your selection items</span>
                  </div>
                  
                  <div className="flex flex-col gap-[8px] max-h-[200px] overflow-y-auto px-1 py-1 pr-2 slick-scrollbar">
                    {(field.options || []).map((option, idx) => (
                      <div key={idx} className="flex gap-[8px] items-center">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...(field.options || [])];
                            newOptions[idx] = e.target.value;
                            onUpdate(field.id, { options: newOptions });
                          }}
                          className="flex-1 bg-white border border-[#d7dbe0] rounded-[8px] px-[12px] py-[8px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b]"
                        />
                        <button
                          onClick={() => {
                            const newOptions = [...(field.options || [])];
                            newOptions.splice(idx, 1);
                            onUpdate(field.id, { options: newOptions });
                          }}
                          className="text-[#6c798b] hover:text-[#b91d1c] hover:bg-red-50 p-2 rounded-[6px] transition-all"
                        >
                          <div className="size-[16px]">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 14.6667">
                              <path clipRule="evenodd" d={svgPaths.p38ef9c80} fill="currentColor" fillRule="evenodd" />
                              <path clipRule="evenodd" d={svgPaths.p3d5ca800} fill="currentColor" fillRule="evenodd" />
                              <path clipRule="evenodd" d={svgPaths.p732ef00} fill="currentColor" fillRule="evenodd" />
                              <path d={svgPaths.p35b9a200} fill="currentColor" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-[8px] mt-2">
                    <input
                      type="text"
                      className="flex-1 border border-[#b4bbc5] rounded-[8px] px-[12px] py-[10px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b] bg-white transition-all shadow-sm"
                      placeholder="Type a new option..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (input.value.trim()) {
                            const newOptions = [...(field.options || []), input.value.trim()];
                            onUpdate(field.id, { options: newOptions });
                            input.value = '';
                          }
                        }
                      }}
                    />
                  <button
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input && input.value.trim()) {
                          const newOptions = [...(field.options || []), input.value.trim()];
                          onUpdate(field.id, { options: newOptions });
                          input.value = '';
                        }
                      }}
                      className="bg-[#151027] text-white px-[16px] py-[10px] rounded-[8px] font-semibold text-[14px] hover:bg-[#1f1a3a] transition-all shrink-0 shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Default Selection */}
                {field.fieldType.type === 'dropdown' && (field.options || []).length > 0 && (
                  <div className="flex flex-col gap-[6px] mt-2 border-t pt-4">
                    <span className="font-['Inter',sans-serif] font-medium text-[#3d444f] text-[14px]">Default Selection</span>
                    <select
                      value={field.defaultValue || ''}
                      onChange={(e) => onUpdate(field.id, { defaultValue: e.target.value })}
                      className="border border-[#b4bbc5] rounded-[8px] px-[12px] py-[10px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b] bg-white transition-all shadow-sm"
                    >
                      <option value="">None (Placeholder)</option>
                      {(field.options || []).map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {field.fieldType.type === 'toggle' && (
              <div className="flex flex-col gap-[6px]">
                <span className="font-['Inter',sans-serif] font-medium text-[#3d444f] text-[14px]">Interaction Hint</span>
                <input
                  type="text"
                  value={field.helpText || ''}
                  onChange={(e) => onUpdate(field.id, { helpText: e.target.value })}
                  className="border border-[#b4bbc5] rounded-[8px] px-[12px] py-[10px] font-['Inter',sans-serif] text-[14px] text-[#131518] focus:outline-none focus:ring-2 focus:ring-[#17142b] bg-white transition-all"
                  placeholder="e.g. Switch on to enable dark mode"
                />
              </div>
            )}
          </div>

          {/* Required Toggle */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => onUpdate(field.id, { required: !field.required })}
              className="flex gap-[10px] items-center"
            >
              <div className="font-['Inter',sans-serif] text-[#131518] text-[16px] font-medium">
                <p className="leading-[1.4]">Required</p>
              </div>
              <div
                className={`${
                  field.required ? 'bg-[#151027]' : 'bg-[#9ca3af]'
                } h-[20px] overflow-clip relative rounded-[19px] shrink-0 w-[40px] transition-colors`}
              >
                <div className="absolute top-1/2 -translate-y-1/2 size-[16px] transition-all" style={{
                  right: field.required ? '3px' : 'calc(100% - 19px)'
                }}>
                  <div className="absolute inset-[-12.5%_-18.75%_-25%_-18.75%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
                      <g style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.08)) drop-shadow(0 1px 2px rgba(0,0,0,0.04))' }}>
                        <circle cx="11" cy="10" fill="white" r="8" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Collapsed view
  return (
    <div 
      className={`bg-white h-[71.5px] relative rounded-[8px] border w-full cursor-pointer hover:border-[#17142b] transition-colors ${isSelected ? 'border-[#17142b]' : 'border-[#b4bbc5]'}`}
      onClick={() => {
        if (onSelect) onSelect();
        // Skip expansion if user is selecting text
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) {
          return;
        }
        toggleExpanded();
      }}
    >
      <div className="flex gap-[12px] items-center px-[15px] h-full w-full">
        {/* Drag Handle */}
        <div ref={dragHandleRef} className="relative shrink-0 size-[20px] cursor-move flex items-center justify-center drag-handle">
          <svg width="8" height="12" viewBox="0 0 8.33333 11.6667" fill="none">
            <path d={svgPaths.pec0fb80} fill="#6C798B" />
          </svg>
        </div>

        {/* Field Type Icon */}
        <div className="bg-[#d7dbe0] relative rounded-[8px] shrink-0 p-[10px]">
          {getFieldIcon()}
        </div>

        {/* Field Info */}
        <div className="flex-1 min-w-0 mr-[16px]">
          <div className="flex flex-col gap-[2px]">
            <p className="font-['Inter',sans-serif] font-medium text-[#131518] text-[14px] truncate">
              {field.label}
            </p>
            <p className="font-['Inter',sans-serif] text-[#6c798b] text-[11px] truncate">
              {field.fieldType.label} • {field.fieldType.type === 'dropdown' || field.fieldType.type === 'checkbox' ? `${(field.options || []).length} options` : field.fieldType.type === 'fileUpload' || field.fieldType.type === 'imageUpload' ? `${field.buttonLabel || 'Upload'} (${field.maxFileSize || 10}MB)` : field.placeholder}
            </p>
          </div>
        </div>

        {/* Required Toggle & Delete Button */}
        <div className="flex gap-[16px] items-center shrink-0">
          {/* Required Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(field.id, { required: !field.required });
            }}
            className="flex gap-[10px] items-center"
          >
            <span className="font-['Inter',sans-serif] text-[#131518] text-[16px] leading-[1.4]">
              Required
            </span>
            <div
              className={`${
                field.required ? 'bg-[#151027]' : 'bg-[#9ca3af]'
              } h-[20px] overflow-hidden relative rounded-[19px] shrink-0 w-[40px] transition-colors`}
            >
              <div className="absolute top-1/2 -translate-y-1/2 size-[16px] transition-all" style={{
                right: field.required ? '3px' : 'calc(100% - 19px)'
              }}>
                <div className="absolute inset-[-12.5%_-18.75%_-25%_-18.75%]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
                    <g style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.08)) drop-shadow(0 1px 2px rgba(0,0,0,0.04))' }}>
                      <circle cx="11" cy="10" fill="white" r="8" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(field.id);
            }}
            className="bg-white border border-[#b4bbc5] flex items-center justify-center p-[8px] rounded-[8px] shrink-0 hover:bg-[#fef2f2] hover:border-[#b91d1c] transition-colors"
          >
            <div className="shrink-0 size-[16px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 14.6667">
                <g>
                  <path clipRule="evenodd" d={svgPaths.p38ef9c80} fill="#131518" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgPaths.p3d5ca800} fill="#131518" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgPaths.p732ef00} fill="#131518" fillRule="evenodd" />
                  <path d={svgPaths.p35b9a200} fill="#131518" />
                </g>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
