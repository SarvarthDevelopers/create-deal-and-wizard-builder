// ============================================================================
// Mock Deals Data Generator
// Generates 100 rows matching the Cashy deal schema with all distribution rules
// ============================================================================

export interface DealCustomer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface DealItem {
  itemId: string;
  title: string;
  category: string;
  variant: string;
  marketValue: number;
  requestedPayout: number;
}

export interface Deal {
  dealId: string;
  mode: 'deal' | 'custom_deal';
  status: 'DRAFT' | 'BOOKED' | 'IN_PROGRESS' | 'REVIEWING' | 'COUNTEROFFER' | 'ACCEPTED' | 'DECLINED' | 'ARCHIVED';
  company: 'CASHY_AUT' | 'CASHY_DE';
  branch: string;
  shop: string;
  businessUnit: 'AUTOMOTIVE' | 'GENERAL' | 'LUXURY' | 'ELECTRONICS';
  businessArea: 'Automotive' | 'Electronics' | 'Luxury' | 'Mixed';
  primaryCustomer: DealCustomer;
  items: DealItem[];
  totalMarketValue: number;
  totalRequestedPayout: number;
  suggestedPayout: number;
  durationDays: number;
  dueDate: string;
  createdAt: string;
  labels: string[];
  priority: 'Low' | 'Medium' | 'High';
  isExtension: boolean;
  pickupType: 'SHOP' | 'STANDARD_SHIPMENT' | 'STOREBOX' | 'EXTENSION';
  hasMissingDocs: boolean;
  assignedTo: string;
  column: string;
  lastColumnLabelAssignedAt: string;
  notes: string;
}

// ---- Helpers ----

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

function randomSubset<T>(arr: T[], min = 0, max = 2): T[] {
  const count = randomInt(min, Math.min(max, arr.length));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// ---- Constants ----

const STATUSES: Deal['status'][] = ['DRAFT', 'BOOKED', 'IN_PROGRESS', 'REVIEWING', 'COUNTEROFFER', 'ACCEPTED', 'DECLINED', 'ARCHIVED'];
const COLUMNS = ['Inbox', 'Research', 'Verification', 'Ready to Payout', 'Ready to Sell', 'Archived'];
const LABELS_POOL = ['vip', 'needs-docs', 'high-value', 'online'];
const ASSIGNEES = ['Thomas Weber', 'Anna Schmidt', 'Lukas Bauer', 'Maria Hoffmann', 'Appraisal Team', 'Unassigned'];
const NOTES_POOL = [
  'VIN pending verification',
  'Photos attached',
  'Appraiser requested physical inspection',
  'Customer contacted for follow-up',
  'Waiting for additional documents',
  'Ready for final review',
  'Price adjustment needed',
  'Customer approved payout',
  'Extension requested by customer',
  'Urgent — high-value item',
];

const BRANCHES_AUT = ['Vienna', 'Graz', 'Linz', 'Salzburg'];
const BRANCHES_DE = ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'];

const SHOPS_AUT: Record<string, string[]> = {
  'Vienna': ['Wien-1', 'Wien-2', 'Wien-3'],
  'Graz': ['Graz-1'],
  'Linz': ['Linz-1'],
  'Salzburg': ['Salzburg-1'],
};

const SHOPS_DE: Record<string, string[]> = {
  'Berlin': ['Berlin-Mitte', 'Berlin-West'],
  'Munich': ['Munich-1', 'Munich-2'],
  'Hamburg': ['Hamburg-1'],
  'Frankfurt': ['Frankfurt-1'],
};

// Car items
const CAR_ITEMS = [
  { title: 'Peugeot 208', variant: 'Peugeot 208 2020', category: 'car' },
  { title: 'BMW 320i', variant: 'BMW 320i 2019', category: 'car' },
  { title: 'VW Golf', variant: 'VW Golf 8 2021', category: 'car' },
  { title: 'Audi A4', variant: 'Audi A4 Avant 2020', category: 'car' },
  { title: 'Mercedes C200', variant: 'Mercedes C200 2018', category: 'car' },
  { title: 'Tesla Model 3', variant: 'Tesla Model 3 LR 2022', category: 'car' },
];

// Electronics items
const ELECTRONICS_ITEMS = [
  { title: 'iPhone 16 Pro', variant: 'iPhone 16 Pro 256GB', category: 'electronics.smartphone' },
  { title: 'iPhone 16', variant: 'iPhone 16 128GB', category: 'electronics.smartphone' },
  { title: 'Samsung Galaxy S25', variant: 'Samsung Galaxy S25 Ultra', category: 'electronics.smartphone' },
  { title: 'MacBook Pro 14"', variant: 'MacBook Pro 14 M3', category: 'electronics.laptop' },
  { title: 'iPad Pro 12.9"', variant: 'iPad Pro 12.9 M2', category: 'electronics.tablet' },
  { title: 'Sony PlayStation 5', variant: 'PS5 Disc Edition', category: 'electronics.console' },
];

// Luxury items
const LUXURY_ITEMS = [
  { title: 'Rolex Submariner', variant: 'Rolex Submariner 40mm', category: 'watches' },
  { title: 'Omega Speedmaster', variant: 'Omega Speedmaster Professional', category: 'watches' },
  { title: 'Louis Vuitton Neverfull', variant: 'LV Neverfull MM Monogram', category: 'bags' },
  { title: 'Cartier Love Bracelet', variant: 'Cartier Love 18K Yellow Gold', category: 'jewelry' },
  { title: 'Hermès Birkin 25', variant: 'Hermès Birkin 25 Togo', category: 'bags' },
  { title: 'Patek Philippe Nautilus', variant: 'Patek Nautilus 5711', category: 'watches' },
];

// Duplicate customer names for search disambiguation edge cases
const DUPLICATE_NAMES: DealCustomer[] = [
  { firstName: 'Thomas', lastName: 'Müller', phone: '+43 660 111111', email: 'thomas.mueller1@example.at' },
  { firstName: 'Thomas', lastName: 'Müller', phone: '+43 660 222222', email: 'thomas.mueller2@example.at' },
  { firstName: 'Thomas', lastName: 'Müller', phone: '+49 30 333333', email: 'thomas.mueller3@example.de' },
  { firstName: 'Anna', lastName: 'Schmidt', phone: '+43 660 444444', email: 'anna.schmidt1@example.at' },
  { firstName: 'Anna', lastName: 'Schmidt', phone: '+49 89 555555', email: 'anna.schmidt2@example.de' },
  { firstName: 'Anna', lastName: 'Schmidt', phone: '+49 40 666666', email: 'anna.schmidt3@example.de' },
];

const FIRST_NAMES = ['Franz', 'Anna', 'Lukas', 'Maria', 'Stefan', 'Julia', 'Michael', 'Laura', 'David', 'Sophie', 'Peter', 'Eva', 'Markus', 'Sandra', 'Johannes', 'Katharina', 'Daniel', 'Lisa', 'Christian', 'Nina'];
const LAST_NAMES_AUT = ['Kürsten', 'Gruber', 'Huber', 'Wagner', 'Bauer', 'Pichler', 'Steiner', 'Moser', 'Mayer', 'Hofer'];
const LAST_NAMES_DE = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch'];

function generateCustomer(company: 'CASHY_AUT' | 'CASHY_DE', index: number): DealCustomer {
  const firstName = randomChoice(FIRST_NAMES);
  const lastNames = company === 'CASHY_AUT' ? LAST_NAMES_AUT : LAST_NAMES_DE;
  const lastName = randomChoice(lastNames);
  const prefix = company === 'CASHY_AUT' ? '+43' : '+49';
  const phone = `${prefix} ${randomInt(100, 999)} ${randomInt(100000, 999999)}`;
  const domain = company === 'CASHY_AUT' ? 'example.at' : 'example.de';
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@${domain}`;
  return { firstName, lastName, phone, email };
}

function getItemsForCategory(businessArea: Deal['businessArea']): { items: DealItem[]; businessUnit: Deal['businessUnit'] } {
  let selectedItems: typeof CAR_ITEMS = [];
  let businessUnit: Deal['businessUnit'] = 'GENERAL';

  switch (businessArea) {
    case 'Automotive': {
      const carItem = randomChoice(CAR_ITEMS);
      const marketValue = randomInt(8000, 120000);
      selectedItems = [{ ...carItem, marketValue, requestedPayout: 0 } as any];
      businessUnit = 'AUTOMOTIVE';
      break;
    }
    case 'Electronics': {
      const count = randomInt(1, 2);
      for (let i = 0; i < count; i++) {
        const item = randomChoice(ELECTRONICS_ITEMS);
        const marketValue = randomInt(50, 3000);
        selectedItems.push({ ...item, marketValue, requestedPayout: 0 } as any);
      }
      businessUnit = randomChoice(['GENERAL', 'ELECTRONICS']);
      break;
    }
    case 'Luxury': {
      const item = randomChoice(LUXURY_ITEMS);
      const marketValue = randomInt(2000, 80000);
      selectedItems.push({ ...item, marketValue, requestedPayout: 0 } as any);
      businessUnit = 'LUXURY';
      break;
    }
    case 'Mixed': {
      // 2-3 items from mixed categories
      const count = randomInt(2, 3);
      const pools = [ELECTRONICS_ITEMS, LUXURY_ITEMS];
      for (let i = 0; i < count; i++) {
        const pool = randomChoice(pools);
        const item = randomChoice(pool);
        const marketValue = pool === LUXURY_ITEMS ? randomInt(2000, 15000) : randomInt(200, 2000);
        selectedItems.push({ ...item, marketValue, requestedPayout: 0 } as any);
      }
      businessUnit = 'GENERAL';
      break;
    }
  }

  const items: DealItem[] = selectedItems.map((item: any, idx: number) => {
    const ltvRange = businessArea === 'Automotive' ? [0.5, 0.7] :
      businessArea === 'Electronics' ? [0.4, 0.6] :
        businessArea === 'Luxury' ? [0.3, 0.5] : [0.35, 0.55];
    const ltv = randomFloat(ltvRange[0], ltvRange[1]);
    const requestedPayout = Math.round(item.marketValue * ltv);
    return {
      itemId: `I-${randomInt(1000, 9999)}`,
      title: item.title,
      category: item.category,
      variant: item.variant,
      marketValue: item.marketValue,
      requestedPayout,
    };
  });

  return { items, businessUnit };
}

// ---- Three sample rows (verbatim from brief) ----

const SAMPLE_ROWS: Deal[] = [
  {
    dealId: 'DEAL-0001',
    mode: 'deal',
    status: 'IN_PROGRESS',
    company: 'CASHY_AUT',
    branch: 'Vienna',
    shop: 'Wien-1',
    businessUnit: 'AUTOMOTIVE',
    businessArea: 'Automotive',
    primaryCustomer: { firstName: 'Franz', lastName: 'Kürsten', phone: '+43 660 123456', email: 'franz@example.at' },
    items: [{ itemId: 'I-1001', title: 'Peugeot 208', category: 'car', variant: 'Peugeot 208 2020', marketValue: 45200, requestedPayout: 30000 }],
    totalMarketValue: 45200,
    totalRequestedPayout: 30000,
    suggestedPayout: 30000,
    durationDays: 180,
    dueDate: '2026-10-01',
    createdAt: '2026-04-01T09:15:00Z',
    labels: ['vip'],
    priority: 'High',
    isExtension: false,
    pickupType: 'SHOP',
    hasMissingDocs: true,
    assignedTo: 'Thomas Weber',
    column: 'Research',
    lastColumnLabelAssignedAt: '2026-04-02T10:00:00Z',
    notes: 'VIN pending verification',
  },
  {
    dealId: 'DEAL-0023',
    mode: 'deal',
    status: 'DRAFT',
    company: 'CASHY_DE',
    branch: 'Berlin',
    shop: 'Berlin-Mitte',
    businessUnit: 'GENERAL',
    businessArea: 'Electronics',
    primaryCustomer: { firstName: 'Anna', lastName: 'Müller', phone: '+49 30 555555', email: 'anna@example.de' },
    items: [{ itemId: 'I-2001', title: 'iPhone 16 Pro', category: 'electronics.smartphone', variant: 'iPhone 16 Pro 256GB', marketValue: 1200, requestedPayout: 800 }],
    totalMarketValue: 1200,
    totalRequestedPayout: 800,
    suggestedPayout: 720,
    durationDays: 30,
    dueDate: '2026-05-01',
    createdAt: '2026-04-03T11:00:00Z',
    labels: ['online'],
    priority: 'Medium',
    isExtension: false,
    pickupType: 'SHOP',
    hasMissingDocs: false,
    assignedTo: 'Unassigned',
    column: 'Inbox',
    lastColumnLabelAssignedAt: '2026-04-03T11:00:00Z',
    notes: 'Photos attached',
  },
  {
    dealId: 'DEAL-0077',
    mode: 'custom_deal',
    status: 'REVIEWING',
    company: 'CASHY_DE',
    branch: 'Munich',
    shop: 'Munich-2',
    businessUnit: 'GENERAL',
    businessArea: 'Mixed',
    primaryCustomer: { firstName: 'Lukas', lastName: 'Weber', phone: '+49 89 111222', email: 'lukas@example.de' },
    items: [
      { itemId: 'I-4001', title: 'Rolex Submariner', category: 'watches', variant: 'Rolex Submariner 40mm', marketValue: 12000, requestedPayout: 7000 },
      { itemId: 'I-4002', title: 'iPhone 16', category: 'electronics.smartphone', variant: 'iPhone 16 128GB', marketValue: 900, requestedPayout: 500 },
    ],
    totalMarketValue: 12900,
    totalRequestedPayout: 7500,
    suggestedPayout: 6500,
    durationDays: 90,
    dueDate: '2026-07-01',
    createdAt: '2026-03-20T10:00:00Z',
    labels: ['high-value'],
    priority: 'High',
    isExtension: false,
    pickupType: 'SHOP',
    hasMissingDocs: false,
    assignedTo: 'Appraisal Team',
    column: 'Verification',
    lastColumnLabelAssignedAt: '2026-03-21T09:00:00Z',
    notes: 'Appraiser requested physical inspection',
  },
];

// ---- Main Generator ----

export function generateMockDeals(count = 100): Deal[] {
  const deals: Deal[] = [...SAMPLE_ROWS];
  const usedIds = new Set(['DEAL-0001', 'DEAL-0023', 'DEAL-0077']);

  // Indices for distribution tracking
  let customDealAccepted = 0;
  let archivedCount = 1; // DEAL-0077 area counts
  let extensionCount = 0;
  let highValueCarCount = 1; // DEAL-0001 already high-value
  let mixedMultiItemCount = 1; // DEAL-0077 already multi-item mixed
  let duplicateNameIdx = 0;

  for (let i = deals.length; i < count; i++) {
    let dealNum = randomInt(2, 9999);
    let dealId = `DEAL-${String(dealNum).padStart(4, '0')}`;
    while (usedIds.has(dealId)) {
      dealNum = randomInt(2, 9999);
      dealId = `DEAL-${String(dealNum).padStart(4, '0')}`;
    }
    usedIds.add(dealId);

    // Company: 60% AUT, 40% DE
    const company: Deal['company'] = i < count * 0.6 ? 'CASHY_AUT' : 'CASHY_DE';

    // Branch and shop
    const branches = company === 'CASHY_AUT' ? BRANCHES_AUT : BRANCHES_DE;
    const shopsMap = company === 'CASHY_AUT' ? SHOPS_AUT : SHOPS_DE;
    const branch = randomChoice(branches);
    const shop = randomChoice(shopsMap[branch]);

    // Mode: 75% deal, 25% custom_deal
    let mode: Deal['mode'] = Math.random() < 0.75 ? 'deal' : 'custom_deal';

    // Status distribution
    let status: Deal['status'];

    // Ensure at least 8 ACCEPTED custom_deals
    if (mode === 'custom_deal' && customDealAccepted < 8 && i > count * 0.5) {
      status = 'ACCEPTED';
      customDealAccepted++;
    }
    // Ensure at least 10 ARCHIVED
    else if (archivedCount < 10 && i > count * 0.7) {
      status = 'ARCHIVED';
      archivedCount++;
    } else {
      status = randomChoice(STATUSES);
      if (status === 'ARCHIVED') archivedCount++;
      if (status === 'ACCEPTED' && mode === 'custom_deal') customDealAccepted++;
    }

    // Business Area distribution: ~20% Mixed, rest spread
    let businessArea: Deal['businessArea'];
    if (mixedMultiItemCount < 5 && i % 5 === 0) {
      businessArea = 'Mixed';
      mixedMultiItemCount++;
    } else if (highValueCarCount < 3 && i % 15 === 0) {
      businessArea = 'Automotive';
    } else if (Math.random() < 0.2) {
      businessArea = 'Mixed';
    } else {
      businessArea = randomChoice(['Automotive', 'Electronics', 'Luxury'] as Deal['businessArea'][]);
    }

    const { items, businessUnit } = getItemsForCategory(businessArea);

    // High-value car override
    if (businessArea === 'Automotive' && highValueCarCount < 3) {
      items[0].marketValue = randomInt(30000, 120000);
      items[0].requestedPayout = Math.round(items[0].marketValue * randomFloat(0.5, 0.7));
      highValueCarCount++;
    }

    // Compute totals
    const totalMarketValue = items.reduce((s, item) => s + item.marketValue, 0);
    const totalRequestedPayout = items.reduce((s, item) => s + item.requestedPayout, 0);

    // Suggested payout calculation
    const ltvRanges: Record<string, [number, number]> = {
      'Automotive': [0.5, 0.7],
      'Electronics': [0.4, 0.6],
      'Luxury': [0.3, 0.5],
      'Mixed': [0.35, 0.55],
    };
    const [ltvMin, ltvMax] = ltvRanges[businessArea];
    const avgLtv = randomFloat(ltvMin, ltvMax);
    const randomFactor = randomFloat(0.95, 1.0);
    const fees = randomInt(10, 200);
    const suggestedPayout = Math.round(totalMarketValue * avgLtv * randomFactor - fees);

    // Duration and dates
    const durationDays = randomChoice([30, 60, 90, 120, 180]);
    const createdDaysAgo = randomInt(1, 90);
    const createdDate = daysAgo(createdDaysAgo);
    const dueDate = addDays(createdDate, durationDays);

    // Customer
    let customer: DealCustomer;
    if (duplicateNameIdx < 6) {
      customer = DUPLICATE_NAMES[duplicateNameIdx];
      duplicateNameIdx++;
    } else {
      customer = generateCustomer(company, i);
    }

    // Missing docs: 12% of car deals
    const isCarDeal = businessArea === 'Automotive';
    const hasMissingDocs = isCarDeal && Math.random() < 0.12;

    // Extension: mark 10 deals
    let isExtension = false;
    let pickupType: Deal['pickupType'] = randomChoice(['SHOP', 'SHOP', 'SHOP', 'STANDARD_SHIPMENT', 'STOREBOX']);
    if (extensionCount < 10 && i % 10 === 0) {
      isExtension = true;
      pickupType = 'EXTENSION';
      extensionCount++;
    }

    // Labels
    const labels = randomSubset(LABELS_POOL, 0, 2);

    // Priority
    const priority: Deal['priority'] = totalMarketValue > 20000 ? 'High' :
      totalMarketValue > 5000 ? 'Medium' : 'Low';

    // Column
    const column = status === 'ARCHIVED' ? 'Archived' : randomChoice(COLUMNS.filter(c => c !== 'Archived'));

    // Last column assigned timestamp
    const columnDaysAgo = randomInt(0, Math.min(createdDaysAgo, 90));
    const lastColumnDate = daysAgo(columnDaysAgo);

    deals.push({
      dealId,
      mode,
      status,
      company,
      branch,
      shop,
      businessUnit,
      businessArea,
      primaryCustomer: customer,
      items,
      totalMarketValue,
      totalRequestedPayout,
      suggestedPayout,
      durationDays,
      dueDate: formatDate(dueDate),
      createdAt: createdDate.toISOString(),
      labels,
      priority,
      isExtension,
      pickupType,
      hasMissingDocs,
      assignedTo: randomChoice(ASSIGNEES),
      column,
      lastColumnLabelAssignedAt: lastColumnDate.toISOString(),
      notes: randomChoice(NOTES_POOL),
    });
  }

  // Sort by dealId for consistent ordering
  return deals.sort((a, b) => a.dealId.localeCompare(b.dealId));
}

export const MOCK_DEALS = generateMockDeals(100);

// Business Area color mapping
export const BUSINESS_AREA_COLORS: Record<string, string> = {
  'Automotive': '#3b82f6',
  'Electronics': '#8b5cf6',
  'Luxury': '#f59e0b',
  'Mixed': '#6b7280',
};

// Status badge styling
export const STATUS_STYLES: Record<Deal['status'], { bg: string; text: string }> = {
  'DRAFT': { bg: '#edeef1', text: '#5e6978' },
  'BOOKED': { bg: '#dbeafe', text: '#2563eb' },
  'IN_PROGRESS': { bg: '#fef3c7', text: '#d97706' },
  'REVIEWING': { bg: '#ede9fe', text: '#7c3aed' },
  'COUNTEROFFER': { bg: '#ffedd5', text: '#ea580c' },
  'ACCEPTED': { bg: '#dcfce7', text: '#16a34a' },
  'DECLINED': { bg: '#fee2e2', text: '#dc2626' },
  'ARCHIVED': { bg: '#e5e7eb', text: '#374151' },
};
