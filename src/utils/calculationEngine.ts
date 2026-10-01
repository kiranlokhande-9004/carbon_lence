import { EmissionFactor, EmissionRecord, DataQuality, ScopeType } from '../types';

export interface CalculationResult {
  co2eKg: number;
  co2eTonne: number;
  formula: string;
  breakdown: string;
  confidenceScore: number;
}

/**
 * Deterministic greenhouse gas calculation engine adhering to GHG Protocol principles.
 * Activity Data * Emission Factor = kg CO2e
 * 1 tonne = 1,000 kg CO2e
 */
export function calculateEmissions(
  quantity: number,
  factorValue: number,
  unit: string,
  factorUnit: string
): CalculationResult {
  const cleanQuantity = Number(quantity) || 0;
  const cleanFactor = Number(factorValue) || 0;

  const co2eKg = Math.round((cleanQuantity * cleanFactor) * 100) / 100;
  const co2eTonne = Math.round((co2eKg / 1000) * 1000) / 1000;

  const formula = `${cleanQuantity.toLocaleString()} ${unit} × ${cleanFactor} ${factorUnit}`;
  const breakdown = `${formula} = ${co2eKg.toLocaleString()} kgCO₂e (${co2eTonne.toFixed(3)} tCO₂e)`;

  return {
    co2eKg,
    co2eTonne,
    formula,
    breakdown,
    confidenceScore: 100,
  };
}

export function formatTonne(value: number, decimals: number = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '0.0 tCO₂e';
  return `${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} tCO₂e`;
}

export function formatKg(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return '0 kgCO₂e';
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })} kgCO₂e`;
}

export function formatPercent(value: number, decimals: number = 1): string {
  if (value === undefined || value === null || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

export function getDataQualityBadgeColor(quality: DataQuality): { bg: string; text: string; border: string } {
  switch (quality) {
    case 'High':
      return {
        bg: 'bg-emerald-50 text-emerald-700',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50 text-amber-700',
        text: 'text-amber-700',
        border: 'border-amber-200',
      };
    case 'Low':
      return {
        bg: 'bg-rose-50 text-rose-700',
        text: 'text-rose-700',
        border: 'border-rose-200',
      };
  }
}

export function getScopeBadgeColor(scope: ScopeType): { bg: string; text: string; dot: string } {
  switch (scope) {
    case 'Scope 1':
      return {
        bg: 'bg-orange-50 text-orange-700 border-orange-200',
        text: 'text-orange-700',
        dot: 'bg-orange-500',
      };
    case 'Scope 2':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        text: 'text-blue-700',
        dot: 'bg-blue-500',
      };
    case 'Scope 3':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        text: 'text-emerald-700',
        dot: 'bg-emerald-500',
      };
  }
}
