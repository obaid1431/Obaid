import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ConvertIcon } from "@/lib/icons";
import {
  convert,
  getUnits,
  getConversionTypes,
  getUnitDisplay,
  type ConversionType,
  type ConversionResult
} from "@/lib/conversion-utils";

export default function UnitConverter() {
  const [conversionType, setConversionType] = useState<ConversionType>("length");
  const [fromUnit, setFromUnit] = useState<string>("");
  const [toUnit, setToUnit] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [availableUnits, setAvailableUnits] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize available units and default units when conversion type changes
  useEffect(() => {
    try {
      const units = getUnits(conversionType);
      setAvailableUnits(units);
      
      if (units.length > 0) {
        setFromUnit(units[0]);
        setToUnit(units.length > 1 ? units[1] : units[0]);
      }
    } catch (error) {
      console.error("Error getting units:", error);
      setError("Failed to load conversion units");
    }
  }, [conversionType]);

  // Perform conversion
  const handleConvert = () => {
    setError(null);
    
    if (!inputValue) {
      setError("Please enter a value to convert");
      return;
    }
    
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setError("Please enter a valid number");
      return;
    }
    
    try {
      const conversionResult = convert(conversionType, fromUnit, toUnit, value);
      setResult(conversionResult);
    } catch (error) {
      console.error("Conversion error:", error);
      setError(error instanceof Error ? error.message : "Conversion failed");
    }
  };

  // Swap from and to units
  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    
    // If there's a result, recalculate
    if (result && inputValue) {
      try {
        const value = parseFloat(inputValue);
        if (!isNaN(value)) {
          const conversionResult = convert(conversionType, toUnit, fromUnit, value);
          setResult(conversionResult);
        }
      } catch (error) {
        console.error("Conversion error after swap:", error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Enhanced Unit Converter</h2>
      <p className="text-gray-600 mb-8">
        Convert between different units of measurement including length, weight, temperature, area, time, pressure, and more.
      </p>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Conversion Type and Units */}
            <div>
              <div className="mb-4">
                <Label htmlFor="conversion-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Conversion Type
                </Label>
                <Select
                  value={conversionType}
                  onValueChange={(value) => setConversionType(value as ConversionType)}
                >
                  <SelectTrigger id="conversion-type">
                    <SelectValue placeholder="Select conversion type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getConversionTypes().map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="from-unit" className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </Label>
                  <Select
                    value={fromUnit}
                    onValueChange={setFromUnit}
                  >
                    <SelectTrigger id="from-unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUnits.map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="relative">
                  <Label htmlFor="to-unit" className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full border-gray-300"
                      onClick={handleSwapUnits}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </Button>
                    <Select
                      value={toUnit}
                      onValueChange={setToUnit}
                    >
                      <SelectTrigger id="to-unit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <Label htmlFor="input-value" className="block text-sm font-medium text-gray-700 mb-1">
                  Value
                </Label>
                <div className="relative rounded-md shadow-sm">
                  <Input
                    type="number"
                    id="input-value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="pr-12"
                    placeholder="0.00"
                  />
                  {fromUnit && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm" id="unit-display">
                        {getUnitDisplay(fromUnit)}
                      </span>
                    </div>
                  )}
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>
              
              <div className="mt-4">
                <Button
                  type="button"
                  onClick={handleConvert}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Convert
                </Button>
              </div>
            </div>
            
            {/* Right Column - Results and Common Conversions */}
            <div>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Result</h4>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="text-center">
                    <span className="text-2xl font-semibold text-purple-700" id="result">
                      {result ? result.formattedValue : "0.00"}
                    </span>
                    <span className="text-gray-500 ml-2" id="to-unit-display">
                      {toUnit ? getUnitDisplay(toUnit) : ""}
                    </span>
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-2">
                    <span id="conversion-formula">
                      {result ? result.formula : fromUnit && toUnit ? `1 ${fromUnit} = ? ${toUnit}` : ""}
                    </span>
                  </div>
                </div>
              </div>
              
              {result && result.commonConversions && result.commonConversions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Common Conversions</h4>
                  <div className="bg-white rounded border border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {result.commonConversions.map((conversion, index) => (
                        <li key={index} className="p-3 flex justify-between">
                          <span className="text-sm text-gray-600">
                            {conversion.from.value} {getUnitDisplay(conversion.from.unit)}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {conversion.to.value.toFixed(2)} {getUnitDisplay(conversion.to.unit)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit Information */}
      <div className="mt-10">
        <h3 className="text-lg font-medium text-gray-900 mb-4">About {conversionType.charAt(0).toUpperCase() + conversionType.slice(1)} Units</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conversionType === "length" && (
            <>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Metric System</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Kilometer (km):</strong> 1,000 meters</li>
                    <li><strong>Meter (m):</strong> Base unit</li>
                    <li><strong>Centimeter (cm):</strong> 1/100 of a meter</li>
                    <li><strong>Millimeter (mm):</strong> 1/1,000 of a meter</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Imperial/US System</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Mile (mi):</strong> 5,280 feet</li>
                    <li><strong>Yard (yd):</strong> 3 feet</li>
                    <li><strong>Foot (ft):</strong> 12 inches</li>
                    <li><strong>Inch (in):</strong> 1/12 of a foot</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Common Conversions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>1 meter ≈ 3.28 feet</li>
                    <li>1 kilometer ≈ 0.62 miles</li>
                    <li>1 inch = 2.54 centimeters</li>
                    <li>1 foot = 30.48 centimeters</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {conversionType === "weight" && (
            <>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Metric System</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Tonne (t):</strong> 1,000 kilograms</li>
                    <li><strong>Kilogram (kg):</strong> Base unit</li>
                    <li><strong>Gram (g):</strong> 1/1,000 of a kilogram</li>
                    <li><strong>Milligram (mg):</strong> 1/1,000,000 of a kilogram</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Imperial/US System</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Ton:</strong> 2,000 pounds</li>
                    <li><strong>Pound (lb):</strong> 16 ounces</li>
                    <li><strong>Ounce (oz):</strong> 1/16 of a pound</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Common Conversions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>1 kilogram ≈ 2.20462 pounds</li>
                    <li>1 pound ≈ 0.453592 kilograms</li>
                    <li>1 ounce ≈ 28.3495 grams</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {conversionType === "temperature" && (
            <>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Celsius (°C)</h4>
                  <p className="text-sm text-gray-600">
                    The Celsius scale sets 0°C as the freezing point of water and 100°C as the boiling point of water at standard atmospheric pressure.
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>Water freezes: 0°C</li>
                    <li>Room temperature: ~20-25°C</li>
                    <li>Body temperature: ~37°C</li>
                    <li>Water boils: 100°C</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Fahrenheit (°F)</h4>
                  <p className="text-sm text-gray-600">
                    In the Fahrenheit scale, water freezes at 32°F and boils at 212°F at standard atmospheric pressure.
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>Water freezes: 32°F</li>
                    <li>Room temperature: ~68-77°F</li>
                    <li>Body temperature: ~98.6°F</li>
                    <li>Water boils: 212°F</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Kelvin (K)</h4>
                  <p className="text-sm text-gray-600">
                    The Kelvin scale is an absolute temperature scale with 0K at absolute zero, the theoretical absence of all thermal energy.
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>Absolute zero: 0K</li>
                    <li>Water freezes: 273.15K</li>
                    <li>Room temperature: ~293-298K</li>
                    <li>Water boils: 373.15K</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {conversionType === "area" && (
            <>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Metric Area Units</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Square kilometer (km²):</strong> 1,000,000 m²</li>
                    <li><strong>Hectare (ha):</strong> 10,000 m²</li>
                    <li><strong>Square meter (m²):</strong> Base unit</li>
                    <li><strong>Square centimeter (cm²):</strong> 1/10,000 m²</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Imperial/US Area Units</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Square mile (mi²):</strong> 640 acres</li>
                    <li><strong>Acre:</strong> 43,560 square feet</li>
                    <li><strong>Square yard (yd²):</strong> 9 square feet</li>
                    <li><strong>Square foot (ft²):</strong> 144 square inches</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Common Conversions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>1 square meter ≈ 10.764 square feet</li>
                    <li>1 hectare ≈ 2.471 acres</li>
                    <li>1 square kilometer ≈ 0.386 square miles</li>
                    <li>1 acre ≈ 4,047 square meters</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}

          {conversionType === "time" && (
            <>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Standard Time Units</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Second (s):</strong> Base SI unit of time</li>
                    <li><strong>Minute (min):</strong> 60 seconds</li>
                    <li><strong>Hour (h):</strong> 60 minutes (3,600 seconds)</li>
                    <li><strong>Day (d):</strong> 24 hours (86,400 seconds)</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Longer Time Periods</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Week:</strong> 7 days</li>
                    <li><strong>Month:</strong> ~30 days (varies)</li>
                    <li><strong>Year:</strong> 365 or 366 days</li>
                    <li><strong>Decade:</strong> 10 years</li>
                    <li><strong>Century:</strong> 100 years</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium text-purple-600 mb-2">Scientific Time Units</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Millisecond (ms):</strong> 1/1,000 of a second</li>
                    <li><strong>Microsecond (μs):</strong> 1/1,000,000 of a second</li>
                    <li><strong>Nanosecond (ns):</strong> 1/1,000,000,000 of a second</li>
                  </ul>
                </CardContent>
              </Card>
            </>
          )}
          
          {/* Add similar information cards for other conversion types as needed */}
        </div>
      </div>
    </div>
  );
}
