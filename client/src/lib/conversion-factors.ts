type ConversionFunction = (value: number) => number;
type ConversionMap = Record<string, Record<string, number | ConversionFunction>>;

export const conversionFactors: Record<string, ConversionMap> = {
  length: {
    meters: {
      feet: 3.28084,
      inches: 39.3701,
      kilometers: 0.001,
      miles: 0.000621371,
      yards: 1.09361,
      centimeters: 100
    },
    feet: {
      meters: 0.3048,
      inches: 12,
      kilometers: 0.0003048,
      miles: 0.000189394,
      yards: 0.333333,
      centimeters: 30.48
    },
    inches: {
      meters: 0.0254,
      feet: 0.0833333,
      kilometers: 0.0000254,
      miles: 0.0000157828,
      yards: 0.0277778,
      centimeters: 2.54
    },
    kilometers: {
      meters: 1000,
      feet: 3280.84,
      inches: 39370.1,
      miles: 0.621371,
      yards: 1093.61,
      centimeters: 100000
    },
    miles: {
      meters: 1609.34,
      feet: 5280,
      inches: 63360,
      kilometers: 1.60934,
      yards: 1760,
      centimeters: 160934
    },
    yards: {
      meters: 0.9144,
      feet: 3,
      inches: 36,
      kilometers: 0.0009144,
      miles: 0.000568182,
      centimeters: 91.44
    },
    centimeters: {
      meters: 0.01,
      feet: 0.0328084,
      inches: 0.393701,
      kilometers: 0.00001,
      miles: 0.00000621371,
      yards: 0.0109361
    }
  },
  weight: {
    kilograms: {
      pounds: 2.20462,
      ounces: 35.274,
      grams: 1000,
      tons: 0.001
    },
    pounds: {
      kilograms: 0.453592,
      ounces: 16,
      grams: 453.592,
      tons: 0.0005
    },
    ounces: {
      kilograms: 0.0283495,
      pounds: 0.0625,
      grams: 28.3495,
      tons: 0.00003125
    },
    grams: {
      kilograms: 0.001,
      pounds: 0.00220462,
      ounces: 0.035274,
      tons: 0.000001
    },
    tons: {
      kilograms: 1000,
      pounds: 2204.62,
      ounces: 35274,
      grams: 1000000
    }
  },
  temperature: {
    celsius: {
      fahrenheit: (c: number) => (c * 9/5) + 32,
      kelvin: (c: number) => c + 273.15
    },
    fahrenheit: {
      celsius: (f: number) => (f - 32) * 5/9,
      kelvin: (f: number) => ((f - 32) * 5/9) + 273.15
    },
    kelvin: {
      celsius: (k: number) => k - 273.15,
      fahrenheit: (k: number) => ((k - 273.15) * 9/5) + 32
    }
  },
  data: {
    bytes: {
      kilobytes: 1/1024,
      megabytes: 1/(1024**2),
      gigabytes: 1/(1024**3),
      terabytes: 1/(1024**4)
    },
    kilobytes: {
      bytes: 1024,
      megabytes: 1/1024,
      gigabytes: 1/(1024**2),
      terabytes: 1/(1024**3)
    },
    megabytes: {
      bytes: 1024**2,
      kilobytes: 1024,
      gigabytes: 1/1024,
      terabytes: 1/(1024**2)
    },
    gigabytes: {
      bytes: 1024**3,
      kilobytes: 1024**2,
      megabytes: 1024,
      terabytes: 1/1024
    },
    terabytes: {
      bytes: 1024**4,
      kilobytes: 1024**3,
      megabytes: 1024**2,
      gigabytes: 1024
    }
  },
  volume: {
    liters: {
      milliliters: 1000,
      gallons: 0.264172,
      'cubic feet': 0.0353147,
      'cubic meters': 0.001,
      cups: 4.22675,
      'fluid ounces': 33.814
    },
    milliliters: {
      liters: 1/1000,
      gallons: 0.000264172,
      'cubic feet': 3.53147e-5,
      'cubic meters': 0.000001,
      cups: 0.00422675,
      'fluid ounces': 0.033814
    },
    gallons: {
      liters: 3.78541,
      milliliters: 3785.41,
      'cubic feet': 0.133681,
      'cubic meters': 0.00378541,
      cups: 16,
      'fluid ounces': 128
    },
    'cubic feet': {
      liters: 28.3168,
      milliliters: 28316.8,
      gallons: 7.48052,
      'cubic meters': 0.0283168,
      cups: 119.688,
      'fluid ounces': 957.506
    },
    'cubic meters': {
      liters: 1000,
      milliliters: 1000000,
      gallons: 264.172,
      'cubic feet': 35.3147,
      cups: 4226.75,
      'fluid ounces': 33814
    },
    cups: {
      liters: 0.236588,
      milliliters: 236.588,
      gallons: 0.0625,
      'cubic feet': 0.00835486,
      'cubic meters': 0.000236588,
      'fluid ounces': 8
    },
    'fluid ounces': {
      liters: 0.0295735,
      milliliters: 29.5735,
      gallons: 0.0078125,
      'cubic feet': 0.00104436,
      'cubic meters': 0.0000295735,
      cups: 0.125
    }
  },
  energy: {
    joules: {
      kilojoules: 0.001,
      calories: 0.239006,
      kilocalories: 0.000239006,
      'watt-hours': 0.000277778
    },
    kilojoules: {
      joules: 1000,
      calories: 239.006,
      kilocalories: 0.239006,
      'watt-hours': 0.277778
    },
    calories: {
      joules: 4.1868,
      kilojoules: 0.0041868,
      kilocalories: 0.001,
      'watt-hours': 0.00116222
    },
    kilocalories: {
      joules: 4186.8,
      kilojoules: 4.1868,
      calories: 1000,
      'watt-hours': 1.16222
    },
    'watt-hours': {
      joules: 3600,
      kilojoules: 3.6,
      calories: 860.421,
      kilocalories: 0.860421
    }
  },
  area: {
    'square meters': {
      'square feet': 10.7639,
      acres: 0.000247105,
      hectares: 0.0001,
      'square kilometers': 0.000001,
      'square miles': 3.861e-7
    },
    'square feet': {
      'square meters': 0.092903,
      acres: 0.0000229568,
      hectares: 0.00000929030,
      'square kilometers': 9.2903e-8,
      'square miles': 3.587e-8
    },
    acres: {
      'square meters': 4046.86,
      'square feet': 43560,
      hectares: 0.404686,
      'square kilometers': 0.00404686,
      'square miles': 0.0015625
    },
    hectares: {
      'square meters': 10000,
      'square feet': 107639,
      acres: 2.47105,
      'square kilometers': 0.01,
      'square miles': 0.00386102
    },
    'square kilometers': {
      'square meters': 1000000,
      'square feet': 10763910.4,
      acres: 247.105,
      hectares: 100,
      'square miles': 0.386102
    },
    'square miles': {
      'square meters': 2590000,
      'square feet': 27878400,
      acres: 640,
      hectares: 259,
      'square kilometers': 2.59
    }
  },
  time: {
    seconds: {
      minutes: 1/60,
      hours: 1/3600,
      days: 1/86400,
      weeks: 1/604800,
      months: 1/2629746,
      years: 1/31556952
    },
    minutes: {
      seconds: 60,
      hours: 1/60,
      days: 1/1440,
      weeks: 1/10080,
      months: 1/43829.1,
      years: 1/525949.2
    },
    hours: {
      seconds: 3600,
      minutes: 60,
      days: 1/24,
      weeks: 1/168,
      months: 1/730.485,
      years: 1/8765.82
    },
    days: {
      seconds: 86400,
      minutes: 1440,
      hours: 24,
      weeks: 1/7,
      months: 1/30.4369,
      years: 1/365.242
    },
    weeks: {
      seconds: 604800,
      minutes: 10080,
      hours: 168,
      days: 7,
      months: 0.229984,
      years: 0.0191781
    },
    months: {
      seconds: 2629746,
      minutes: 43829.1,
      hours: 730.485,
      days: 30.4369,
      weeks: 4.34812,
      years: 1/12
    },
    years: {
      seconds: 31556952,
      minutes: 525949.2,
      hours: 8765.82,
      days: 365.242,
      weeks: 52.1775,
      months: 12
    }
  },
  pressure: {
    pascal: {
      kilopascal: 0.001,
      bar: 0.00001,
      psi: 0.000145038,
      atmosphere: 0.00000986923
    },
    kilopascal: {
      pascal: 1000,
      bar: 0.01,
      psi: 0.145038,
      atmosphere: 0.00986923
    },
    bar: {
      pascal: 100000,
      kilopascal: 100,
      psi: 14.5038,
      atmosphere: 0.986923
    },
    psi: {
      pascal: 6894.76,
      kilopascal: 6.89476,
      bar: 0.0689476,
      atmosphere: 0.068046
    },
    atmosphere: {
      pascal: 101325,
      kilopascal: 101.325,
      bar: 1.01325,
      psi: 14.6959
    }
  },
  currency: {
    USD: {
      EUR: 0.85,
      GBP: 0.75,
      JPY: 110.0,
      CAD: 1.25,
      AUD: 1.35,
      CNY: 6.45,
      INR: 73.0
    },
    EUR: {
      USD: 1.18,
      GBP: 0.88,
      JPY: 130.0,
      CAD: 1.48,
      AUD: 1.59,
      CNY: 7.60,
      INR: 86.0
    },
    GBP: {
      USD: 1.33,
      EUR: 1.14,
      JPY: 147.0,
      CAD: 1.67,
      AUD: 1.80,
      CNY: 8.60,
      INR: 97.0
    },
    JPY: {
      USD: 0.0091,
      EUR: 0.0077,
      GBP: 0.0068,
      CAD: 0.0114,
      AUD: 0.0123,
      CNY: 0.059,
      INR: 0.66
    },
    CAD: {
      USD: 0.80,
      EUR: 0.68,
      GBP: 0.60,
      JPY: 88.0,
      AUD: 1.08,
      CNY: 5.16,
      INR: 58.4
    },
    AUD: {
      USD: 0.74,
      EUR: 0.63,
      GBP: 0.56,
      JPY: 81.5,
      CAD: 0.93,
      CNY: 4.78,
      INR: 54.1
    },
    CNY: {
      USD: 0.155,
      EUR: 0.132,
      GBP: 0.116,
      JPY: 17.05,
      CAD: 0.194,
      AUD: 0.209,
      INR: 11.3
    },
    INR: {
      USD: 0.0137,
      EUR: 0.0116,
      GBP: 0.0103,
      JPY: 1.51,
      CAD: 0.0171,
      AUD: 0.0185,
      CNY: 0.0885
    }
  }
};
