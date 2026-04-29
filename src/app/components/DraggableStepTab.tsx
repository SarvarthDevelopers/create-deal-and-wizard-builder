import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import svgPaths from "../../imports/svg-4o201vrq4p";
import { Step } from './DealWizardBuilder';

interface DraggableStepTabProps {
  step: Step;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const ITEM_TYPE = 'STEP_TAB';

export function DraggableStepTab({ step, index, isActive, onClick, onReorder }: DraggableStepTabProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      onReorder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="shrink-0" style={{ opacity: isDragging ? 0.5 : 1 }}>
      <button
        onClick={onClick}
        className={`
          ${isActive ? 'bg-[#17142b]' : 'bg-white border border-[#b4bbc5]'}
          rounded-[8px] h-[40px] px-[16px] transition-colors flex items-center gap-[8px] cursor-move shrink-0 whitespace-nowrap
        `}
      >
        <span 
          className={`font-['Inter',sans-serif] font-semibold text-[14px] whitespace-nowrap shrink-0 leading-[1.2] ${isActive ? 'text-white' : 'text-[#131518]'}`}
        >
          {step.name}
        </span>
        <svg 
          width="10" 
          height="14" 
          viewBox="0 0 8.33333 11.6667" 
          fill="none"
          className="shrink-0"
        >
          <path d={svgPaths.pec0fb80} fill="#6C798B" />
        </svg>
      </button>
    </div>
  );
}
