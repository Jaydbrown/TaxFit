/**
 * Nigerian Tax Calculator
 * Implements 15% VAT and other tax calculations
 */

export interface TaxCalculationInput {
  amount: number;
  taxRate?: number; // Default is 15% (0.15)
  includesTax?: boolean; // Whether the amount already includes tax
}

export interface TaxCalculationResult {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  breakdown: {
    description: string;
    amount: number;
  }[];
}

export interface IncomeTaxBracket {
  min: number;
  max: number | null;
  rate: number;
  name: string;
}

/**
 * Nigerian Personal Income Tax Brackets (2024)
 * Based on consolidated relief allowance and tax-free allowances
 */
export const NIGERIAN_INCOME_TAX_BRACKETS: IncomeTaxBracket[] = [
  { min: 0, max: 300000, rate: 0.07, name: 'First ₦300,000' },
  { min: 300000, max: 600000, rate: 0.11, name: 'Next ₦300,000' },
  { min: 600000, max: 1100000, rate: 0.15, name: 'Next ₦500,000' },
  { min: 1100000, max: 1600000, rate: 0.19, name: 'Next ₦500,000' },
  { min: 1600000, max: 3200000, rate: 0.21, name: 'Next ₦1,600,000' },
  { min: 3200000, max: null, rate: 0.24, name: 'Above ₦3,200,000' },
];

/**
 * Standard Nigerian VAT rate (15%)
 */
export const NIGERIAN_VAT_RATE = 0.15;

/**
 * Minimum wage in Nigeria (as of 2024)
 */
export const MINIMUM_WAGE = 70000;

/**
 * Calculate VAT (Value Added Tax) - 15%
 */
export function calculateVAT(input: TaxCalculationInput): TaxCalculationResult {
  const taxRate = input.taxRate || NIGERIAN_VAT_RATE;
  let subtotal: number;
  let taxAmount: number;
  let total: number;

  if (input.includesTax) {
    // Amount includes tax, need to extract it
    total = input.amount;
    subtotal = input.amount / (1 + taxRate);
    taxAmount = total - subtotal;
  } else {
    // Amount excludes tax, need to add it
    subtotal = input.amount;
    taxAmount = input.amount * taxRate;
    total = subtotal + taxAmount;
  }

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxRate,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
    breakdown: [
      { description: 'Subtotal', amount: Math.round(subtotal * 100) / 100 },
      { description: `VAT (${(taxRate * 100).toFixed(0)}%)`, amount: Math.round(taxAmount * 100) / 100 },
      { description: 'Total', amount: Math.round(total * 100) / 100 },
    ],
  };
}

/**
 * Calculate Personal Income Tax using Nigerian tax brackets
 */
export function calculateIncomeTax(annualIncome: number): {
  grossIncome: number;
  consolidatedReliefAllowance: number;
  taxableIncome: number;
  taxByBracket: { bracket: string; income: number; rate: number; tax: number }[];
  totalTax: number;
  netIncome: number;
  effectiveRate: number;
} {
  // Consolidated Relief Allowance: Higher of 1% of gross income or ₦200,000 + 20% of gross income
  const reliefOption1 = annualIncome * 0.01;
  const reliefOption2 = 200000 + (annualIncome * 0.20);
  const consolidatedReliefAllowance = Math.max(reliefOption1, reliefOption2);

  // Taxable income after relief
  const taxableIncome = Math.max(0, annualIncome - consolidatedReliefAllowance);

  // Calculate tax for each bracket
  const taxByBracket: { bracket: string; income: number; rate: number; tax: number }[] = [];
  let totalTax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of NIGERIAN_INCOME_TAX_BRACKETS) {
    if (remainingIncome <= 0) break;

    const bracketMin = bracket.min;
    const bracketMax = bracket.max || Infinity;
    const bracketSize = bracketMax - bracketMin;

    // Income in this bracket
    const incomeInBracket = Math.min(remainingIncome, bracketSize);
    const taxForBracket = incomeInBracket * bracket.rate;

    taxByBracket.push({
      bracket: bracket.name,
      income: incomeInBracket,
      rate: bracket.rate,
      tax: Math.round(taxForBracket * 100) / 100,
    });

    totalTax += taxForBracket;
    remainingIncome -= incomeInBracket;
  }

  const netIncome = annualIncome - totalTax;
  const effectiveRate = annualIncome > 0 ? (totalTax / annualIncome) : 0;

  return {
    grossIncome: annualIncome,
    consolidatedReliefAllowance: Math.round(consolidatedReliefAllowance * 100) / 100,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    taxByBracket,
    totalTax: Math.round(totalTax * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 10000) / 100, // Percentage
  };
}

/**
 * Calculate monthly tax deduction from salary
 */
export function calculateMonthlyTax(monthlyGrossSalary: number): {
  monthlyGross: number;
  annualGross: number;
  monthlyTax: number;
  annualTax: number;
  monthlyNet: number;
  annualNet: number;
} {
  const annualGross = monthlyGrossSalary * 12;
  const annualTaxCalculation = calculateIncomeTax(annualGross);

  return {
    monthlyGross: monthlyGrossSalary,
    annualGross,
    monthlyTax: Math.round((annualTaxCalculation.totalTax / 12) * 100) / 100,
    annualTax: annualTaxCalculation.totalTax,
    monthlyNet: Math.round((annualTaxCalculation.netIncome / 12) * 100) / 100,
    annualNet: annualTaxCalculation.netIncome,
  };
}

/**
 * Calculate Company Income Tax (CIT) - 30% for large companies, 20% for small companies
 */
export function calculateCompanyIncomeTax(
  annualProfit: number,
  isSmallCompany: boolean = false
): {
  annualProfit: number;
  taxRate: number;
  taxAmount: number;
  netProfit: number;
} {
  // Small companies (turnover < ₦25 million) pay 20%
  // Large companies pay 30%
  const taxRate = isSmallCompany ? 0.20 : 0.30;
  const taxAmount = annualProfit * taxRate;
  const netProfit = annualProfit - taxAmount;

  return {
    annualProfit,
    taxRate,
    taxAmount: Math.round(taxAmount * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
  };
}

/**
 * Calculate Withholding Tax (WHT) - typically 5% or 10%
 */
export function calculateWithholdingTax(
  amount: number,
  rate: number = 0.05
): {
  amount: number;
  whtRate: number;
  whtAmount: number;
  netAmount: number;
} {
  const whtAmount = amount * rate;
  const netAmount = amount - whtAmount;

  return {
    amount,
    whtRate: rate,
    whtAmount: Math.round(whtAmount * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
  };
}

/**
 * Calculate tax on goods/services with VAT
 */
export function calculatePurchaseTax(
  itemPrice: number,
  quantity: number = 1,
  vatRate: number = NIGERIAN_VAT_RATE
): {
  unitPrice: number;
  quantity: number;
  subtotal: number;
  vat: number;
  total: number;
} {
  const subtotal = itemPrice * quantity;
  const vat = subtotal * vatRate;
  const total = subtotal + vat;

  return {
    unitPrice: itemPrice,
    quantity,
    subtotal: Math.round(subtotal * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Calculate Capital Gains Tax - 10% on gains
 */
export function calculateCapitalGainsTax(
  purchasePrice: number,
  sellingPrice: number
): {
  purchasePrice: number;
  sellingPrice: number;
  capitalGain: number;
  taxRate: number;
  taxAmount: number;
  netProfit: number;
} {
  const capitalGain = Math.max(0, sellingPrice - purchasePrice);
  const taxRate = 0.10; // 10% Capital Gains Tax
  const taxAmount = capitalGain * taxRate;
  const netProfit = capitalGain - taxAmount;

  return {
    purchasePrice,
    sellingPrice,
    capitalGain: Math.round(capitalGain * 100) / 100,
    taxRate,
    taxAmount: Math.round(taxAmount * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
  };
}

/**
 * Format currency in Nigerian Naira
 */
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate tax savings from deductions
 */
export function calculateTaxSavings(
  grossIncome: number,
  deductions: number
): {
  incomeWithoutDeductions: { tax: number; net: number };
  incomeWithDeductions: { tax: number; net: number };
  taxSavings: number;
  savingsPercentage: number;
} {
  const withoutDeductions = calculateIncomeTax(grossIncome);
  const withDeductions = calculateIncomeTax(Math.max(0, grossIncome - deductions));

  const taxSavings = withoutDeductions.totalTax - withDeductions.totalTax;
  const savingsPercentage = withoutDeductions.totalTax > 0 
    ? (taxSavings / withoutDeductions.totalTax) * 100 
    : 0;

  return {
    incomeWithoutDeductions: {
      tax: withoutDeductions.totalTax,
      net: withoutDeductions.netIncome,
    },
    incomeWithDeductions: {
      tax: withDeductions.totalTax,
      net: withDeductions.netIncome,
    },
    taxSavings: Math.round(taxSavings * 100) / 100,
    savingsPercentage: Math.round(savingsPercentage * 100) / 100,
  };
}

/**
 * Estimate quarterly tax payments
 */
export function calculateQuarterlyTax(annualIncome: number): {
  annualTax: number;
  quarterlyPayment: number;
  paymentSchedule: { quarter: string; amount: number; dueDate: string }[];
} {
  const taxCalc = calculateIncomeTax(annualIncome);
  const quarterlyPayment = taxCalc.totalTax / 4;

  const currentYear = new Date().getFullYear();
  const paymentSchedule = [
    { quarter: 'Q1', amount: quarterlyPayment, dueDate: `March 31, ${currentYear}` },
    { quarter: 'Q2', amount: quarterlyPayment, dueDate: `June 30, ${currentYear}` },
    { quarter: 'Q3', amount: quarterlyPayment, dueDate: `September 30, ${currentYear}` },
    { quarter: 'Q4', amount: quarterlyPayment, dueDate: `December 31, ${currentYear}` },
  ];

  return {
    annualTax: taxCalc.totalTax,
    quarterlyPayment: Math.round(quarterlyPayment * 100) / 100,
    paymentSchedule: paymentSchedule.map(q => ({
      ...q,
      amount: Math.round(q.amount * 100) / 100,
    })),
  };
}