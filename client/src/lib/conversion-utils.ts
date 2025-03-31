import { conversionFactors } from "./conversion-factors";

export type ConversionType = 
  | "length" 
  | "weight" 
  | "temperature" 
  | "data" 
  | "volume" 
  | "energy"
  | "area"
  | "time"
  | "pressure"
  | "currency";

export interface ConversionResult {
  value: number;
  formattedValue: string;
  formula?: string;
  commonConversions?: Array<{
    from: { value: number; unit: string };
    to: { value: number; unit: string };
  }>;
}

export function convert(
  type: ConversionType,
  fromUnit: string,
  toUnit: string,
  value: number
): ConversionResult {
  if (isNaN(value)) {
    throw new Error("Invalid number provided");
  }

  if (fromUnit === toUnit) {
    return {
      value: value,
      formattedValue: value.toFixed(2),
      formula: `1 ${fromUnit} = 1 ${toUnit}`,
      commonConversions: generateCommonConversions(type, fromUnit, toUnit),
    };
  }

  if (!conversionFactors[type]) {
    throw new Error(`Conversion type '${type}' is not supported`);
  }

  if (!conversionFactors[type][fromUnit]) {
    throw new Error(`Unit '${fromUnit}' is not supported for ${type} conversion`);
  }

  if (!conversionFactors[type][fromUnit][toUnit]) {
    throw new Error(`Conversion from ${fromUnit} to ${toUnit} is not supported`);
  }

  let result: number;
  let formula: string;

  if (type === "temperature") {
    const conversionFunc = conversionFactors[type][fromUnit][toUnit] as (v: number) => number;
    result = conversionFunc(value);
    
    // Special formula for temperature
    if (fromUnit === "celsius" && toUnit === "fahrenheit") {
      formula = `°C to °F: (°C × 9/5) + 32`;
    } else if (fromUnit === "fahrenheit" && toUnit === "celsius") {
      formula = `°F to °C: (°F - 32) × 5/9`;
    } else if (fromUnit === "celsius" && toUnit === "kelvin") {
      formula = `°C to K: °C + 273.15`;
    } else if (fromUnit === "kelvin" && toUnit === "celsius") {
      formula = `K to °C: K - 273.15`;
    } else if (fromUnit === "fahrenheit" && toUnit === "kelvin") {
      formula = `°F to K: (°F - 32) × 5/9 + 273.15`;
    } else if (fromUnit === "kelvin" && toUnit === "fahrenheit") {
      formula = `K to °F: (K - 273.15) × 9/5 + 32`;
    } else {
      formula = `1 ${fromUnit} = ? ${toUnit} (special conversion)`;
    }
  } else {
    const factor = conversionFactors[type][fromUnit][toUnit] as number;
    result = value * factor;
    formula = `1 ${fromUnit} = ${factor} ${toUnit}`;
  }

  return {
    value: result,
    formattedValue: result.toFixed(2),
    formula,
    commonConversions: generateCommonConversions(type, fromUnit, toUnit),
  };
}

function generateCommonConversions(
  type: ConversionType,
  fromUnit: string,
  toUnit: string
): Array<{
  from: { value: number; unit: string };
  to: { value: number; unit: string };
}> {
  // Generate some common conversions for quick reference
  const commonValues = type === "currency" ? [1, 10, 100, 1000] : [1, 10, 100];
  
  return commonValues.map(val => {
    let convertedValue: number;
    
    if (type === "temperature") {
      const conversionFunc = conversionFactors[type][fromUnit][toUnit] as (v: number) => number;
      convertedValue = conversionFunc(val);
    } else {
      const factor = conversionFactors[type][fromUnit][toUnit] as number;
      convertedValue = val * factor;
    }
    
    return {
      from: { value: val, unit: fromUnit },
      to: { value: convertedValue, unit: toUnit }
    };
  });
}

// Get units for a specific conversion type
export function getUnits(type: ConversionType): string[] {
  return Object.keys(conversionFactors[type] || {});
}

// Get all conversion types
export function getConversionTypes(): Array<{ value: ConversionType; label: string }> {
  return [
    { value: "length", label: "Length" },
    { value: "weight", label: "Weight" },
    { value: "temperature", label: "Temperature" },
    { value: "data", label: "Data" },
    { value: "volume", label: "Volume" },
    { value: "energy", label: "Energy" },
    { value: "area", label: "Area" },
    { value: "time", label: "Time" },
    { value: "pressure", label: "Pressure" },
    { value: "currency", label: "Currency" }
  ];
}

// Format unit display
export function getUnitDisplay(unit: string): string {
  // Get first character or abbreviation for display
  const unitAbbreviations: Record<string, string> = {
    meters: "m",
    feet: "ft",
    inches: "in",
    kilometers: "km",
    miles: "mi",
    kilograms: "kg",
    pounds: "lb",
    celsius: "°C",
    fahrenheit: "°F",
    kelvin: "K",
    bytes: "B",
    kilobytes: "KB",
    megabytes: "MB",
    gigabytes: "GB",
    terabytes: "TB",
    liters: "L",
    milliliters: "mL",
    gallons: "gal",
    joules: "J",
    kilojoules: "kJ",
    calories: "cal",
    "square meters": "m²",
    "square feet": "ft²",
    acres: "ac",
    hectares: "ha",
    seconds: "s",
    minutes: "min",
    hours: "hr",
    days: "d",
    pascal: "Pa",
    kilopascal: "kPa",
    bar: "bar",
    psi: "psi",
  };

  return unitAbbreviations[unit] || unit;
}
