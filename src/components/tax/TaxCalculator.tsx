import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Info } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import {
  calculateVAT,
  calculateIncomeTax,
  calculateMonthlyTax,
  formatNaira,
  NIGERIAN_VAT_RATE,
} from '@/lib/tax-calculator';

type CalculatorMode = 'vat' | 'income' | 'monthly';

export default function TaxCalculator() {
  const [mode, setMode] = useState<CalculatorMode>('vat');
  const [amount, setAmount] = useState<string>('');
  const [includesTax, setIncludesTax] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    let calculation;
    
    switch (mode) {
      case 'vat':
        calculation = calculateVAT({ 
          amount: numericAmount, 
          includesTax 
        });
        break;
      case 'income':
        calculation = calculateIncomeTax(numericAmount);
        break;
      case 'monthly':
        calculation = calculateMonthlyTax(numericAmount);
        break;
      default:
        calculation = null;
    }

    setResult(calculation);
  };

  const handleClear = () => {
    setAmount('');
    setResult(null);
  };

  return (
    <Card>
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-light text-gray-900 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary-600" />
          Nigerian Tax Calculator
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Calculate VAT, income tax, and other taxes
        </p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => setMode('vat')}
          className={`p-4 border rounded-lg transition-all ${
            mode === 'vat'
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <DollarSign className="w-5 h-5 mx-auto mb-2" />
          <div className="text-sm font-medium">VAT (15%)</div>
        </button>

        <button
          onClick={() => setMode('income')}
          className={`p-4 border rounded-lg transition-all ${
            mode === 'income'
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <TrendingUp className="w-5 h-5 mx-auto mb-2" />
          <div className="text-sm font-medium">Annual Income Tax</div>
        </button>

        <button
          onClick={() => setMode('monthly')}
          className={`p-4 border rounded-lg transition-all ${
            mode === 'monthly'
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Calculator className="w-5 h-5 mx-auto mb-2" />
          <div className="text-sm font-medium">Monthly Salary Tax</div>
        </button>
      </div>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === 'vat' && 'Amount'}
            {mode === 'income' && 'Annual Income'}
            {mode === 'monthly' && 'Monthly Gross Salary'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {mode === 'vat' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="includesTax"
              checked={includesTax}
              onChange={(e) => setIncludesTax(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="includesTax" className="text-sm text-gray-700">
              Amount already includes VAT (15%)
            </label>
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleCalculate} className="flex-1">
            Calculate Tax
          </Button>
          <Button onClick={handleClear} variant="outline">
            Clear
          </Button>
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Calculation Results</h3>

          {/* VAT Results */}
          {mode === 'vat' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Subtotal</span>
                <span className="text-lg font-medium text-gray-900">
                  {formatNaira(result.subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg">
                <span className="text-gray-700">VAT ({(result.taxRate * 100).toFixed(0)}%)</span>
                <span className="text-lg font-medium text-primary-700">
                  {formatNaira(result.taxAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-secondary-50 rounded-lg border-2 border-secondary-200">
                <span className="text-gray-900 font-medium">Total</span>
                <span className="text-2xl font-bold text-secondary-900">
                  {formatNaira(result.total)}
                </span>
              </div>
            </div>
          )}

          {/* Income Tax Results */}
          {mode === 'income' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Gross Income</div>
                  <div className="text-lg font-medium text-gray-900">
                    {formatNaira(result.grossIncome)}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Relief Allowance</div>
                  <div className="text-lg font-medium text-blue-700">
                    {formatNaira(result.consolidatedReliefAllowance)}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Taxable Income</div>
                <div className="text-lg font-medium text-gray-900">
                  {formatNaira(result.taxableIncome)}
                </div>
              </div>

              {/* Tax Breakdown by Bracket */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700">Tax Breakdown</h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {result.taxByBracket.map((bracket: any, index: number) => (
                    <div key={index} className="px-4 py-3 flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-900">{bracket.bracket}</div>
                        <div className="text-xs text-gray-500">
                          {formatNaira(bracket.income)} @ {(bracket.rate * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatNaira(bracket.tax)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <div className="text-sm text-gray-600 mb-1">Total Tax</div>
                  <div className="text-xl font-bold text-red-700">
                    {formatNaira(result.totalTax)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.effectiveRate.toFixed(2)}% effective rate
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-sm text-gray-600 mb-1">Net Income</div>
                  <div className="text-xl font-bold text-green-700">
                    {formatNaira(result.netIncome)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">After tax</div>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Tax Results */}
          {mode === 'monthly' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Monthly Gross</div>
                  <div className="text-lg font-medium text-gray-900">
                    {formatNaira(result.monthlyGross)}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Annual Gross</div>
                  <div className="text-lg font-medium text-gray-900">
                    {formatNaira(result.annualGross)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Monthly Tax</div>
                  <div className="text-lg font-bold text-red-700">
                    {formatNaira(result.monthlyTax)}
                  </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Annual Tax</div>
                  <div className="text-lg font-bold text-red-700">
                    {formatNaira(result.annualTax)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-sm text-gray-600 mb-1">Monthly Net</div>
                  <div className="text-xl font-bold text-green-700">
                    {formatNaira(result.monthlyNet)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Take-home pay</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-sm text-gray-600 mb-1">Annual Net</div>
                  <div className="text-xl font-bold text-green-700">
                    {formatNaira(result.annualNet)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">After tax</div>
                </div>
              </div>
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Tax Information</p>
                <p>
                  {mode === 'vat' && `Nigeria's VAT rate is ${(NIGERIAN_VAT_RATE * 100).toFixed(0)}%. Some goods and services may be exempt.`}
                  {mode === 'income' && 'Personal income tax rates are progressive, ranging from 7% to 24% based on income brackets.'}
                  {mode === 'monthly' && 'This calculation is based on annual income tax divided by 12 months.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}