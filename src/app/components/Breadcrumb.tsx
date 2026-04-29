import svgPaths from "../../imports/svg-4o201vrq4p";

interface BreadcrumbProps {
  wizardName: string;
}

export function Breadcrumb({ wizardName }: BreadcrumbProps) {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="bg-[#edeef1] border border-[#b4bbc5] content-stretch flex items-center justify-center pl-[12px] pr-[16px] py-[8px] relative rounded-[8px] shrink-0">
        <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0">
          <div className="overflow-clip relative shrink-0 size-[20px]">
            <div className="absolute inset-[4.17%]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 18.3333">
                <g>
                  <path clipRule="evenodd" d={svgPaths.p65eb700} fill="#3D444F" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgPaths.p39867c80} fill="#3D444F" fillRule="evenodd" />
                  <path clipRule="evenodd" d={svgPaths.p1fdc0100} fill="#3D444F" fillRule="evenodd" />
                </g>
              </svg>
            </div>
          </div>
          <div className="flex flex-col font-['Inter',sans-serif] font-semibold justify-end leading-[0] relative shrink-0 text-[#3d444f] text-[14px] text-right whitespace-nowrap">
            <p className="leading-[1.4]">Back to Wizards List</p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex items-center overflow-clip relative shrink-0">
        <div className="content-stretch flex items-center relative shrink-0">
          <div className="flex flex-col font-['Inter',sans-serif] justify-center leading-[0] relative shrink-0 text-[#6c798b] text-[14px] whitespace-nowrap">
            <p className="leading-[1.4]">Home</p>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center overflow-clip px-[8px] relative shrink-0">
          <div className="flex flex-col font-['Roboto',sans-serif] justify-center leading-[0] relative shrink-0 text-[#6c798b] text-[14px] whitespace-nowrap">
            <p className="leading-[22px]">/</p>
          </div>
        </div>
        <div className="content-stretch flex items-center relative shrink-0">
          <div className="flex flex-col font-['Inter',sans-serif] justify-center leading-[0] relative shrink-0 text-[#6c798b] text-[14px] whitespace-nowrap">
            <p className="leading-[1.4]">Wizards List</p>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center overflow-clip px-[8px] relative shrink-0">
          <div className="flex flex-col font-['Roboto',sans-serif] justify-center leading-[0] relative shrink-0 text-[#6c798b] text-[14px] whitespace-nowrap">
            <p className="leading-[22px]">/</p>
          </div>
        </div>
        <div className="content-stretch flex items-center relative shrink-0">
          <div className="flex flex-col font-['Inter',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#131518] text-[14px] whitespace-nowrap">
            <p className="leading-[1.4]">{wizardName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
