import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { MainContent } from './MainContent';
import { AssignmentsPanel } from './AssignmentsPanel';
import { CreateDealModal } from './CreateDealModal';

export interface FieldType {
  id: string;
  type: 'text' | 'textarea' | 'url' | 'fileUpload' | 'imageUpload' | 'datePicker' | 'dropdown' | 'toggle' | 'checkbox';
  label: string;
  icon: string;
}

export interface Step {
  id: string;
  name: string;
  order: number;
}

export interface Field {
  id: string;
  fieldType: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  stepId: string;
  order?: number;
  expanded?: boolean;
  options?: string[]; // For dropdown/checkbox
  buttonLabel?: string; // For file/image upload
  helpText?: string; // Sub-label/Tooltip
  defaultValue?: string; // Default value for text/date
  maxFileSize?: number; // In MB
  allowedFormats?: string; // e.g. .pdf, .jpg
  defaultChecked?: boolean; // For toggle/checkbox
}

export interface WizardState {
  name: string;
  active: boolean;
  category: string;
  shop: string;
  steps: Step[];
  fields: Field[];
  currentStep: string;
}

export function DealWizardBuilder() {
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);
  const [wizardState, setWizardState] = useState<WizardState>({
    name: 'Car Wizard',
    active: true,
    category: 'Automotive > Car',
    shop: 'Global',
    steps: [
      { id: 'research', name: 'Research', order: 1 },
      { id: 'verification', name: 'Verification', order: 2 },
      { id: 'research2', name: 'Research', order: 3 },
    ],
    fields: [
      {
        id: 'field-1',
        fieldType: {
          id: 'text',
          type: 'text',
          label: 'Text',
          icon: 'text'
        },
        label: 'VIN Number',
        placeholder: 'Enter VIN',
        required: true,
        stepId: 'verification',
        expanded: true
      },
      {
        id: 'field-2',
        fieldType: {
          id: 'dropdown',
          type: 'dropdown',
          label: 'Drop Down',
          icon: 'dropdown'
        },
        label: 'Roadworthiness',
        placeholder: 'Select',
        required: true,
        stepId: 'verification'
      },
      {
        id: 'field-3',
        fieldType: {
          id: 'fileUpload',
          type: 'fileUpload',
          label: 'File Upload',
          icon: 'upload'
        },
        label: 'Car Photos',
        placeholder: 'Upload',
        required: true,
        stepId: 'verification'
      },
    ],
    currentStep: 'verification'
  });

  const addField = (fieldType: FieldType) => {
    const newField: Field = {
      id: `field-${Date.now()}`,
      fieldType,
      label: fieldType.label,
      placeholder: fieldType.type === 'fileUpload' || fieldType.type === 'imageUpload' ? 'Upload' : 'Enter value',
      required: false,
      stepId: wizardState.currentStep,
      expanded: false, // Collapsed by default when added as requested
      options: fieldType.type === 'dropdown' || fieldType.type === 'checkbox' ? ['Option 1', 'Option 2'] : undefined,
      buttonLabel: (fieldType.type === 'fileUpload' || fieldType.type === 'imageUpload') ? 'Upload' : undefined,
      helpText: '',
      defaultValue: '',
      maxFileSize: (fieldType.type === 'fileUpload' || fieldType.type === 'imageUpload') ? 10 : undefined,
      allowedFormats: (fieldType.type === 'fileUpload' || fieldType.type === 'imageUpload') ? '.pdf, .png, .jpg' : undefined,
      defaultChecked: fieldType.type === 'toggle' ? false : undefined,
    };

    setWizardState(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const removeField = (fieldId: string) => {
    setWizardState(prev => ({
      ...prev,
      fields: prev.fields.filter(f => f.id !== fieldId)
    }));
  };

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    setWizardState(prev => ({
      ...prev,
      fields: prev.fields.map(f => 
        f.id === fieldId ? { ...f, ...updates } : f
      )
    }));
  };

  const addStep = () => {
    const newStep: Step = {
      id: `step-${Date.now()}`,
      name: 'New Step',
      order: wizardState.steps.length + 1
    };

    setWizardState(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const removeStep = (stepId: string) => {
    setWizardState(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.id !== stepId),
      fields: prev.fields.filter(f => f.stepId !== stepId),
      currentStep: prev.currentStep === stepId ? prev.steps[0]?.id : prev.currentStep
    }));
  };

  const updateStep = (stepId: string, updates: Partial<Step>) => {
    setWizardState(prev => ({
      ...prev,
      steps: prev.steps.map(s => 
        s.id === stepId ? { ...s, ...updates } : s
      )
    }));
  };

  const updateWizardName = (name: string) => {
    setWizardState(prev => ({
      ...prev,
      name
    }));
  };

  const setCurrentStep = (stepId: string) => {
    setWizardState(prev => ({
      ...prev,
      currentStep: stepId
    }));
  };

  const toggleWizardActive = () => {
    setWizardState(prev => ({
      ...prev,
      active: !prev.active
    }));
  };

  const updateCategory = (category: string) => {
    setWizardState(prev => ({
      ...prev,
      category
    }));
  };

  const updateShop = (shop: string) => {
    setWizardState(prev => ({
      ...prev,
      shop
    }));
  };

  const reorderSteps = (dragIndex: number, hoverIndex: number) => {
    setWizardState(prev => {
      const newSteps = [...prev.steps];
      const [removed] = newSteps.splice(dragIndex, 1);
      newSteps.splice(hoverIndex, 0, removed);
      
      return {
        ...prev,
        steps: newSteps.map((step, index) => ({ ...step, order: index + 1 }))
      };
    });
  };

  const reorderFields = (dragIndex: number, hoverIndex: number, stepId: string) => {
    setWizardState(prev => {
      const stepFields = prev.fields.filter(f => f.stepId === stepId);
      const otherFields = prev.fields.filter(f => f.stepId !== stepId);
      
      const [removed] = stepFields.splice(dragIndex, 1);
      stepFields.splice(hoverIndex, 0, removed);
      
      return {
        ...prev,
        fields: [...otherFields, ...stepFields.map((field, index) => ({ ...field, order: index }))]
      };
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-[#edeef1] h-screen w-full overflow-hidden flex flex-col">
        <Header onCreateDealClick={() => setIsCreateDealOpen(true)} />
        <div className="px-[24px] py-[16px] flex-1 min-h-0 min-w-0">
          <div className="flex gap-[24px] items-start h-full min-w-[1200px]">
            <Sidebar onAddField={addField} />
            <MainContent
              wizardState={wizardState}
              onRemoveField={removeField}
              onUpdateField={updateField}
              onAddStep={addStep}
              onUpdateStep={updateStep}
              onRemoveStep={removeStep}
              onSetCurrentStep={setCurrentStep}
              onToggleActive={toggleWizardActive}
              onReorderSteps={reorderSteps}
              onReorderFields={reorderFields}
              onUpdateWizardName={updateWizardName}
            />
            <AssignmentsPanel
              category={wizardState.category}
              shop={wizardState.shop}
              onUpdateCategory={updateCategory}
              onUpdateShop={updateShop}
            />
          </div>
        </div>
        {isCreateDealOpen && (
          <CreateDealModal onClose={() => setIsCreateDealOpen(false)} />
        )}
      </div>
    </DndProvider>
  );
}
