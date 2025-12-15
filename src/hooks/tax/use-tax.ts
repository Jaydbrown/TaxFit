import { useMutation, useQuery } from '@tanstack/react-query';
import {
  calculateVAT,
  calculateIncomeTax,
  calculateMonthlyTax,
  calculateCompanyIncomeTax,
  calculateWithholdingTax,
  calculatePurchaseTax,
  calculateCapitalGainsTax,
  calculateTaxSavings,
  calculateQuarterlyTax,
  TaxCalculationInput,
} from '@/lib/tax-calculator';

export default {}

/**
 * Hook to calculate VAT
 */
export function useCalculateVAT() {
  return useMutation({
    mutationFn: (input: TaxCalculationInput) => {
      return Promise.resolve(calculateVAT(input));
    },
  });
}

/**
 * Hook to calculate income tax
 */
export function useCalculateIncomeTax() {
  return useMutation({
    mutationFn: (annualIncome: number) => {
      return Promise.resolve(calculateIncomeTax(annualIncome));
    },
  });
}

/**
 * Hook to calculate monthly tax
 */
export function useCalculateMonthlyTax() {
  return useMutation({
    mutationFn: (monthlyGrossSalary: number) => {
      return Promise.resolve(calculateMonthlyTax(monthlyGrossSalary));
    },
  });
}

/**
 * Hook to calculate company income tax
 */
export function useCalculateCompanyTax() {
  return useMutation({
    mutationFn: ({ annualProfit, isSmallCompany }: { annualProfit: number; isSmallCompany?: boolean }) => {
      return Promise.resolve(calculateCompanyIncomeTax(annualProfit, isSmallCompany));
    },
  });
}

/**
 * Hook to calculate withholding tax
 */
export function useCalculateWithholdingTax() {
  return useMutation({
    mutationFn: ({ amount, rate }: { amount: number; rate?: number }) => {
      return Promise.resolve(calculateWithholdingTax(amount, rate));
    },
  });
}

/**
 * Hook to calculate purchase tax
 */
export function useCalculatePurchaseTax() {
  return useMutation({
    mutationFn: ({ itemPrice, quantity, vatRate }: { itemPrice: number; quantity?: number; vatRate?: number }) => {
      return Promise.resolve(calculatePurchaseTax(itemPrice, quantity, vatRate));
    },
  });
}

/**
 * Hook to calculate capital gains tax
 */
export function useCalculateCapitalGainsTax() {
  return useMutation({
    mutationFn: ({ purchasePrice, sellingPrice }: { purchasePrice: number; sellingPrice: number }) => {
      return Promise.resolve(calculateCapitalGainsTax(purchasePrice, sellingPrice));
    },
  });
}

/**
 * Hook to calculate tax savings
 */
export function useCalculateTaxSavings() {
  return useMutation({
    mutationFn: ({ grossIncome, deductions }: { grossIncome: number; deductions: number }) => {
      return Promise.resolve(calculateTaxSavings(grossIncome, deductions));
    },
  });
}

/**
 * Hook to calculate quarterly tax payments
 */
export function useCalculateQuarterlyTax() {
  return useMutation({
    mutationFn: (annualIncome: number) => {
      return Promise.resolve(calculateQuarterlyTax(annualIncome));
    },
  });
}

/**
 * Hook to get tax estimate for a given income
 */
export function useTaxEstimate(annualIncome: number | null) {
  return useQuery({
    queryKey: ['taxEstimate', annualIncome],
    queryFn: () => {
      if (!annualIncome || annualIncome <= 0) {
        return null;
      }
      return calculateIncomeTax(annualIncome);
    },
    enabled: !!annualIncome && annualIncome > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get monthly tax estimate
 */
export function useMonthlyTaxEstimate(monthlyGrossSalary: number | null) {
  return useQuery({
    queryKey: ['monthlyTaxEstimate', monthlyGrossSalary],
    queryFn: () => {
      if (!monthlyGrossSalary || monthlyGrossSalary <= 0) {
        return null;
      }
      return calculateMonthlyTax(monthlyGrossSalary);
    },
    enabled: !!monthlyGrossSalary && monthlyGrossSalary > 0,
    staleTime: 5 * 60 * 1000,
  });
}