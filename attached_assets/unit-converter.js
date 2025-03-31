const conversionType = document.getElementById('conversion-type');
   const fromUnit = document.getElementById('from-unit');
   const toUnit = document.getElementById('to-unit');
   const inputValue = document.getElementById('input-value');
   const result = document.getElementById('result');
   
   const units = {
       length: ['meters', 'feet', 'inches'],
       weight: ['kilograms', 'pounds'],
       temperature: ['celsius', 'fahrenheit'],
       data: ['bytes', 'kilobytes', 'megabytes', 'gigabytes'],
       volume: ['liters', 'milliliters', 'gallons', 'cubic feet'],
       energy: ['joules', 'kilojoules', 'calories']
   };
   
   const conversionFactors = {
       length: {
           meters: { feet: 3.28084, inches: 39.3701 },
           feet: { meters: 0.3048, inches: 12 },
           inches: { meters: 0.0254, feet: 0.0833333 }
       },
       weight: {
           kilograms: { pounds: 2.20462 },
           pounds: { kilograms: 0.453592 }
       },
       temperature: {
           celsius: { fahrenheit: (c) => (c * 9/5) + 32 },
           fahrenheit: { celsius: (f) => (f - 32) * 5/9 }
       },
       data: {
           bytes: { kilobytes: 1/1024, megabytes: 1/(1024**2), gigabytes: 1/(1024**3) },
           kilobytes: { bytes: 1024, megabytes: 1/1024, gigabytes: 1/(1024**2) },
           megabytes: { bytes: 1024**2, kilobytes: 1024, gigabytes: 1/1024 },
           gigabytes: { bytes: 1024**3, kilobytes: 1024**2, megabytes: 1024 }
       },
       volume: {
           liters: { milliliters: 1000, gallons: 0.264172, 'cubic feet': 0.0353147 },
           milliliters: { liters: 1/1000, gallons: 0.000264172, 'cubic feet': 3.53147e-5 },
           gallons: { liters: 3.78541, milliliters: 3785.41, 'cubic feet': 0.133681 },
           'cubic feet': { liters: 28.3168, milliliters: 28316.8, gallons: 7.48052 }
       },
       energy: {
           joules: { kilojoules: 1/1000, calories: 0.239006 },
           kilojoules: { joules: 1000, calories: 239.006 },
           calories: { joules: 4.1868, kilojoules: 0.0041868 }
       }
   };
   
   function updateUnits() {
       const type = conversionType.value;
       fromUnit.innerHTML = '';
       toUnit.innerHTML = '';
       units[type].forEach(unit => {
           const option1 = document.createElement('option');
           option1.value = unit;
           option1.text = unit;
           fromUnit.add(option1);
           const option2 = document.createElement('option');
           option2.value = unit;
           option2.text = unit;
           toUnit.add(option2);
       });
   }
   
   function convert() {
       const type = conversionType.value;
       const from = fromUnit.value;
       const to = toUnit.value;
       const value = parseFloat(inputValue.value);
       if (isNaN(value)) {
           result.textContent = 'Please enter a valid number.';
           return;
       }
       if (from === to) {
           result.textContent = value;
           return;
       }
       if (type === 'temperature') {
           const conversionFunc = conversionFactors[type][from][to];
           result.textContent = conversionFunc(value).toFixed(2);
       } else {
           const factor = conversionFactors[type][from][to];
           result.textContent = (value * factor).toFixed(2);
       }
   }
   
   conversionType.addEventListener('change', updateUnits);
   updateUnits();