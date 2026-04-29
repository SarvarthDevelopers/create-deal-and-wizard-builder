import { useState } from 'react';
import svgPaths from "../../imports/svg-4o201vrq4p";
import { WizardState, Field, Step } from './DealWizardBuilder';
import { DraggableFieldItem } from './DraggableFieldItem';
import { DraggableStepTab } from './DraggableStepTab';
import { Breadcrumb } from './Breadcrumb';
import { InlineEdit } from './InlineEdit';

interface MainContentProps {
  wizardState: WizardState;
  onRemoveField: (fieldId: string) => void;
  onUpdateField: (fieldId: string, updates: Partial<Field>) => void;
  onAddStep: () => void;
  onUpdateStep: (stepId: string, updates: Partial<Step>) => void;
  onRemoveStep: (stepId: string) => void;
  onSetCurrentStep: (stepId: string) => void;
  onToggleActive: () => void;
  onReorderSteps: (dragIndex: number, hoverIndex: number) => void;
  onReorderFields: (dragIndex: number, hoverIndex: number, stepId: string) => void;
  onUpdateWizardName: (name: string) => void;
}

export function MainContent({
  wizardState,
  onRemoveField,
  onUpdateField,
  onAddStep,
  onUpdateStep,
  onRemoveStep,
  onSetCurrentStep,
  onToggleActive,
  onReorderSteps,
  onReorderFields,
  onUpdateWizardName
}: MainContentProps) {
  const currentStepFields = wizardState.fields.filter(f => f.stepId === wizardState.currentStep);
  const currentStep = wizardState.steps.find(s => s.id === wizardState.currentStep);
  const [lastSelectedFieldId, setLastSelectedFieldId] = useState<string | null>(null);

  const hasExpandedFields = currentStepFields.some(field => field.expanded);

  const handleCollapseAll = () => {
    currentStepFields.forEach(field => {
      if (field.expanded) {
        onUpdateField(field.id, { expanded: false });
      }
    });
  };

  return (
    <div className="content-stretch flex flex-col gap-[10px] h-full relative flex-1 min-w-0 overflow-hidden">
      {/* Breadcrumb */}
      <div className="shrink-0">
        <Breadcrumb wizardName={wizardState.name} />
      </div>
      
      {/* Wizard Header */}
      <div className="bg-white relative rounded-[8px] shrink-0 w-full">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center justify-between p-[24px] relative w-full">
            <InlineEdit
              value={wizardState.name}
              onSave={onUpdateWizardName}
              textClassName="font-['Inter',sans-serif] font-semibold text-[24px] text-black"
              containerClassName="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 hover:bg-gray-50 rounded-[4px] px-2 py-1 -ml-2 transition-colors"
              iconNode={
                <div className="absolute inset-[7.83%_8.33%_12.5%_8.33%]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 15.9345">
                    <g>
                      <path clipRule="evenodd" d={svgPaths.p3fd37dc0} fill="#1B1D20" fillRule="evenodd" />
                      <path clipRule="evenodd" d={svgPaths.p1a7edd00} fill="#1B1D20" fillRule="evenodd" />
                    </g>
                  </svg>
                </div>
              }
            />
            <button
              onClick={onToggleActive}
              className="content-stretch flex gap-[10px] items-center py-[2px] relative shrink-0"
            >
              <div className="flex flex-col font-['Inter',sans-serif] justify-center leading-[0] relative shrink-0 text-[#131518] text-[16px] whitespace-nowrap">
                <p className="leading-[1.4]">{wizardState.active ? 'Active' : 'Inactive'}</p>
              </div>
              <div
                className={`${
                  wizardState.active ? 'bg-[#16a34a]' : 'bg-[#9ca3af]'
                } h-[20px] overflow-clip relative rounded-[19px] shrink-0 w-[40px] transition-colors`}
              >
                <div className="absolute top-1/2 -translate-y-1/2 size-[16px] transition-all" style={{
                  right: wizardState.active ? '3px' : 'calc(100% - 19px)'
                }}>
                  <div className="absolute inset-[-12.5%_-18.75%_-25%_-18.75%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
                      <g filter="url(#filter0_dd)" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.08)) drop-shadow(0 1px 2px rgba(0,0,0,0.04))' }}>
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

      {/* Main Body */}
      <div className="bg-white relative rounded-[8px] w-full flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Fixed Header Area (Tabs + Divider) */}
        <div className="flex flex-col gap-[24px] items-stretch pt-[24px] px-[24px] relative w-full shrink-0 z-10 bg-white rounded-t-[8px]">
          {/* Step Tabs */}
          <div className="flex gap-[12px] items-center w-full flex-nowrap overflow-x-auto pb-[4px] slick-scrollbar">
            {wizardState.steps.map((step, index) => (
              <DraggableStepTab
                key={step.id}
                step={step}
                index={index}
                isActive={step.id === wizardState.currentStep}
                onClick={() => onSetCurrentStep(step.id)}
                onReorder={onReorderSteps}
              />
            ))}
            <button
              onClick={onAddStep}
              className="bg-[#edeef1] border border-[#b4bbc5] hover:bg-[#e0e2e6] transition-colors rounded-[8px] flex h-[40px] items-center justify-center gap-[8px] px-[16px] shrink-0"
            >
              <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0">
                <div className="overflow-clip relative shrink-0 size-[20px]">
                  <div className="absolute inset-[16.67%]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
                      <g>
                        <path clipRule="evenodd" d={svgPaths.p1fe19500} fill="#3D444F" fillRule="evenodd" />
                        <path d={svgPaths.p1c76ed00} fill="#3D444F" />
                      </g>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col font-['Inter',sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[#3d444f] text-[14px] text-right whitespace-nowrap">
                  <p className="leading-[1.4]">Add Step</p>
                </div>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="h-0 relative shrink-0 w-full">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1280 1">
                <line stroke="#D7DBE0" x2="1280" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Scrollable Step Content */}
        <div className="flex-1 overflow-y-auto slick-scrollbar">
          <div className="flex flex-col gap-[24px] items-stretch p-[24px] relative w-full min-h-[500px]">
            <div className="content-stretch flex h-[40px] items-center justify-between relative shrink-0 w-full">
              <InlineEdit
                value={currentStep?.name || ''}
                onSave={(name) => currentStep && onUpdateStep(currentStep.id, { name })}
                textClassName="font-['Inter',sans-serif] font-semibold text-[24px] text-black"
                containerClassName="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 hover:bg-gray-50 rounded-[4px] px-2 py-1 -ml-2 transition-colors"
                iconNode={
                  <div className="absolute inset-[7.83%_8.33%_12.5%_8.33%]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 15.9345">
                      <g>
                        <path clipRule="evenodd" d={svgPaths.p3fd37dc0} fill="#1B1D20" fillRule="evenodd" />
                        <path clipRule="evenodd" d={svgPaths.p1a7edd00} fill="#1B1D20" fillRule="evenodd" />
                      </g>
                    </svg>
                  </div>
                }
              />
              <div className="content-stretch flex gap-[12px] items-center justify-end relative shrink-0">
                {hasExpandedFields && (
                  <button
                    onClick={handleCollapseAll}
                    className="bg-white border border-[#b4bbc5] hover:bg-[#edeef1] transition-colors content-stretch flex items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0"
                  >
                    <div className="content-stretch flex items-center justify-center relative shrink-0">
                      <div className="flex flex-col font-['Inter',sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[#3d444f] text-[14px] whitespace-nowrap">
                        <p className="leading-[1.4]">Collapse All</p>
                      </div>
                    </div>
                  </button>
                )}
                <button
                  onClick={() => wizardState.currentStep && onRemoveStep(wizardState.currentStep)}
                  className="bg-[#fef2f2] content-stretch flex items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0 hover:bg-[#fee2e2] transition-colors"
                >
                  <div className="content-stretch flex items-center justify-center relative shrink-0">
                    <div className="flex flex-col font-['Inter',sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[#b91d1c] text-[14px] whitespace-nowrap">
                      <p className="leading-[1.4]">Remove Step</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Field List */}
            <div className="flex flex-col gap-[12px] items-stretch relative shrink-0 w-full">
              {currentStepFields.map((field, index) => (
                <DraggableFieldItem
                  key={field.id}
                  field={field}
                  index={index}
                  onRemove={onRemoveField}
                  onUpdate={onUpdateField}
                  onReorder={onReorderFields}
                  stepId={wizardState.currentStep}
                  isSelected={lastSelectedFieldId === field.id}
                  onSelect={() => setLastSelectedFieldId(field.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}