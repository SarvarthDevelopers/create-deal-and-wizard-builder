import { useState } from 'react';
import svgPaths from "../../imports/svg-4o201vrq4p";

interface AssignmentsPanelProps {
  category: string;
  shop: string;
  onUpdateCategory: (category: string) => void;
  onUpdateShop: (shop: string) => void;
}

const categories = [
  'Automotive > Car',
  'Automotive > Motorcycle',
  'Electronics > Laptop',
  'Electronics > Phone',
  'Jewelry > Gold',
  'Jewelry > Silver',
];

const shops = [
  'Global',
  'Downtown Branch',
  'Uptown Branch',
  'West Side Branch',
  'East Side Branch',
];

export function AssignmentsPanel({ category, shop, onUpdateCategory, onUpdateShop }: AssignmentsPanelProps) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);

  return (
    <div className="bg-white h-full relative rounded-[8px] shrink-0 w-[260px] overflow-hidden">
      <div className="content-stretch flex flex-col gap-[24px] items-start py-[8px] relative w-full h-full overflow-y-auto slick-scrollbar">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
          {/* Header */}
          <div className="grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full">
            <div className="col-1 content-stretch flex gap-[10px] h-[30.476px] items-center ml-0 mt-0 px-[16px] py-[8px] relative rounded-[4px] row-1 w-full">
              <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
                <div className="flex flex-col font-['Inter',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#3d444f] text-[14px] whitespace-nowrap">
                  <p className="leading-[1.4]">ASSIGNMENTS</p>
                </div>
              </div>
            </div>
            <div className="col-1 h-0 ml-0 mt-[38.48px] relative row-1 w-full">
              <div className="absolute inset-[-1px_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 260 1">
                  <line stroke="#D7DBE0" x2="260" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dropdowns */}
          <div className="relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[24px] items-start px-[16px] py-[8px] relative w-full">
              {/* Category Dropdown */}
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                  <p className="font-['Inter',sans-serif] font-medium leading-[1.4] relative shrink-0 text-[#3d444f] text-[14px] whitespace-nowrap">
                    Apply to Category
                  </p>
                  <div className="relative w-full">
                    <button
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full border border-[#b4bbc5] hover:border-[#6c798b] transition-colors"
                    >
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
                          <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
                            <p className="font-['Inter',sans-serif] leading-[1.4] relative shrink-0 text-[#131518] text-[16px] whitespace-nowrap">
                              {category}
                            </p>
                          </div>
                          <div className="overflow-clip relative shrink-0 size-[20px]">
                            <div className="absolute inset-[33.33%_20.83%]">
                              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 6.66667">
                                <path clipRule="evenodd" d={svgPaths.p2a5900} fill="#3D444F" fillRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                    {showCategoryDropdown && (
                      <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#b4bbc5] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              onUpdateCategory(cat);
                              setShowCategoryDropdown(false);
                            }}
                            className="w-full text-left px-[12px] py-[8px] hover:bg-[#f9fafb] transition-colors font-['Inter',sans-serif] text-[14px] text-[#131518]"
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shop Dropdown */}
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                  <p className="font-['Inter',sans-serif] font-medium leading-[1.4] relative shrink-0 text-[#3d444f] text-[14px] whitespace-nowrap">
                    Apply to Shop / Branch
                  </p>
                  <div className="relative w-full">
                    <button
                      onClick={() => setShowShopDropdown(!showShopDropdown)}
                      className="bg-white h-[40px] relative rounded-[8px] shrink-0 w-full border border-[#b4bbc5] hover:border-[#6c798b] transition-colors"
                    >
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
                          <div className="content-stretch flex flex-[1_0_0] gap-[8px] items-center min-h-px min-w-px relative">
                            <div className="overflow-clip relative shrink-0 size-[20px]">
                              <div className="absolute inset-[4.17%]">
                                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 18.3333">
                                  <g>
                                    <path d={svgPaths.p358c3400} fill="#151027" />
                                    <path clipRule="evenodd" d={svgPaths.p39b61e40} fill="#151027" fillRule="evenodd" />
                                    <path d={svgPaths.p210dae00} fill="#151027" />
                                  </g>
                                </svg>
                              </div>
                            </div>
                            <p className="font-['Inter',sans-serif] leading-[1.4] relative shrink-0 text-[#131518] text-[16px] whitespace-nowrap">
                              {shop}
                            </p>
                          </div>
                          <div className="overflow-clip relative shrink-0 size-[20px]">
                            <div className="absolute inset-[33.33%_20.83%]">
                              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 6.66667">
                                <path clipRule="evenodd" d={svgPaths.p2a5900} fill="#3D444F" fillRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                    {showShopDropdown && (
                      <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#b4bbc5] rounded-[8px] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                        {shops.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              onUpdateShop(s);
                              setShowShopDropdown(false);
                            }}
                            className="w-full text-left px-[12px] py-[8px] hover:bg-[#f9fafb] transition-colors flex items-center gap-[8px]"
                          >
                            {s === 'Global' && (
                              <div className="overflow-clip relative shrink-0 size-[20px]">
                                <div className="absolute inset-[4.17%]">
                                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.3333 18.3333">
                                    <g>
                                      <path d={svgPaths.p358c3400} fill="#151027" />
                                      <path clipRule="evenodd" d={svgPaths.p39b61e40} fill="#151027" fillRule="evenodd" />
                                      <path d={svgPaths.p210dae00} fill="#151027" />
                                    </g>
                                  </svg>
                                </div>
                              </div>
                            )}
                            <span className="font-['Inter',sans-serif] text-[14px] text-[#131518]">
                              {s}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-[16px] w-full">
          <button className="bg-[#17142b] w-full h-[40px] rounded-[8px] flex items-center justify-center hover:bg-[#252135] transition-colors">
            <span className="font-['Inter',sans-serif] font-semibold text-[14px] text-white">
              Save and Close
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
