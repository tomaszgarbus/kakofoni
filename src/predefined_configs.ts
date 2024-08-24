import UserConfig from "./user_config";

const fibonacciUserConfig = new UserConfig(
    /*variables=*/['f0', 'f1'],
    /*startState=*/{
      'f0': 1,
      'f1': 1,
    },
    /*unparsedVarTransforms=*/{
      'f0': 'f1',
      'f1': 'f0+f1',
    },
    /*playVariable=*/{
      'f0': true,
      'f1': true,
    },
    /*variableOctaves=*/{
      'f0': 2,
      'f1': 4,
    }
);

const tribonacciUserConfig = new UserConfig(
  /*variables=*/['f0', 'f1', 'f2'],
  /*startState=*/{
    'f0': 1,
    'f1': 1,
    'f2': 1,
  },
  /*unparsedVarTransforms=*/{
    'f0': 'f1',
    'f1': 'f2',
    'f2': 'f0+f1+f2',
  },
  /*playVariable=*/{
    'f0': true,
    'f1': true,
    'f2': true,
  },
  /*variableOctaves=*/{
    'f0': 2,
    'f1': 3,
    'f2': 4
  }
);

const chromaticChaos = new UserConfig(
  /*variables=*/['c0', 'c1', 'c2', 'c3', 'c4'],
  /*startState=*/{
    'c0': 0,
    'c1': 12,
    'c2': 3,
    'c3': 6,
    'c4': 9
  },
  /*unparsedVarTransforms=*/{
    'c0': 'c0+1',
    'c1': 'c1-1',
    'c2': 'c2+1',
    'c3': 'c3-1',
    'c4': 'c4+1',
  },
  /*playVariable=*/{
    'c0': true,
    'c1': true,
    'c2': true,
    'c3': true,
    'c4': true,
  },
  /*variableOctaves=*/{
    'c0': 2,
    'c1': 3,
    'c2': 4,
    'c3': 5,
    'c4': 6,
  }
)

const primePowers = new UserConfig(
  /*variables=*/['p2', 'p3', 'p5', 'p7'],
  /*startState=*/{
    'p2': 2,
    'p3': 3,
    'p5': 5,
    'p7': 7,
  },
  /*unparsedVarTransforms=*/{
    'p2': 'p2*2',
    'p3': 'p3*3',
    'p5': 'p5*5',
    'p7': 'p7*7',
  },
  /*playVariable=*/{
    'p2': true,
    'p3': true,
    'p5': true,
    'p7': true,
  },
  /*variableOctaves=*/{
    'p2': 2,
    'p3': 3,
    'p5': 4,
    'p7': 5,
  }
)

const somebodyOnceToldMe = new UserConfig(
  /*variables=*/["x", "ydelta", "y", "z"],
  /*startState=*/{"x": 0, "ydelta": 0, "y": 0, "z": 5},
  /*unparsedVarTransforms=*/{
    "x": "x + 1",
    "ydelta": "(7 * x + 3 * x^2 + 5 * x^3 + 4 * x^4 + 11 * x^5 + 1 * x^6 + 6 * x^7 + 10 * x^8 + 8 * x^9 + 9 * x^10 + 2 * x^11 + 12 * x^12)",
    "y": "y + ydelta",
    "z": "5 * x^0 * y^0 + 3 * x^1 * y^0 + 8 * x^2 * y^0 + 9 * x^3 * y^0 + 8 * x^4 * y^0 + 10 * x^5 * y^0 + 2 * x^6 * y^0 + 7 * x^7 * y^0 + 11 * x^8 * y^0 + 5 * x^9 * y^0 + 10 * x^10 * y^0 + 1 * x^11 * y^0 + 11 * x^12 * y^0 + 6 * x^0 * y^1 + 8 * x^1 * y^1 + 4 * x^2 * y^1 + 4 * x^3 * y^1 + 5 * x^4 * y^1 + 1 * x^5 * y^1 + 3 * x^6 * y^1 + 8 * x^7 * y^1 + 6 * x^8 * y^1 + 2 * x^9 * y^1 + 3 * x^10 * y^1 + 6 * x^11 * y^1 + 2 * x^12 * y^1 + 11 * x^0 * y^2 + 7 * x^1 * y^2 + 3 * x^2 * y^2 + 8 * x^3 * y^2 + 2 * x^4 * y^2 + 3 * x^5 * y^2 + 10 * x^6 * y^2 + 8 * x^7 * y^2 + 11 * x^8 * y^2 + 0 * x^9 * y^2 + 6 * x^10 * y^2 + 3 * x^11 * y^2 + 6 * x^12 * y^2 + 0 * x^0 * y^3 + 4 * x^1 * y^3 + 2 * x^2 * y^3 + 2 * x^3 * y^3 + 2 * x^4 * y^3 + 0 * x^5 * y^3 + 4 * x^6 * y^3 + 3 * x^7 * y^3 + 3 * x^8 * y^3 + 3 * x^9 * y^3 + 7 * x^10 * y^3 + 8 * x^11 * y^3 + 2 * x^12 * y^3 + 3 * x^0 * y^4 + 2 * x^1 * y^4 + 0 * x^2 * y^4 + 2 * x^3 * y^4 + 0 * x^4 * y^4 + 9 * x^5 * y^4 + 5 * x^6 * y^4 + 8 * x^7 * y^4 + 6 * x^8 * y^4 + 8 * x^9 * y^4 + 11 * x^10 * y^4 + 4 * x^11 * y^4 + 2 * x^12 * y^4 + 9 * x^0 * y^5 + 4 * x^1 * y^5 + 12 * x^2 * y^5 + 7 * x^3 * y^5 + 8 * x^4 * y^5 + 11 * x^5 * y^5 + 6 * x^6 * y^5 + 0 * x^7 * y^5 + 10 * x^8 * y^5 + 0 * x^9 * y^5 + 2 * x^10 * y^5 + 0 * x^11 * y^5 + 8 * x^12 * y^5 + 10 * x^0 * y^6 + 1 * x^1 * y^6 + 1 * x^2 * y^6 + 4 * x^3 * y^6 + 10 * x^4 * y^6 + 8 * x^5 * y^6 + 4 * x^6 * y^6 + 3 * x^7 * y^6 + 9 * x^8 * y^6 + 0 * x^9 * y^6 + 9 * x^10 * y^6 + 11 * x^11 * y^6 + 1 * x^12 * y^6 + 0 * x^0 * y^7 + 0 * x^1 * y^7 + 3 * x^2 * y^7 + 11 * x^3 * y^7 + 2 * x^4 * y^7 + 8 * x^5 * y^7 + 11 * x^6 * y^7 + 6 * x^7 * y^7 + 10 * x^8 * y^7 + 8 * x^9 * y^7 + 10 * x^10 * y^7 + 2 * x^11 * y^7 + 11 * x^12 * y^7 + 3 * x^0 * y^8 + 5 * x^1 * y^8 + 10 * x^2 * y^8 + 9 * x^3 * y^8 + 12 * x^4 * y^8 + 4 * x^5 * y^8 + 9 * x^6 * y^8 + 0 * x^7 * y^8 + 10 * x^8 * y^8 + 10 * x^9 * y^8 + 10 * x^10 * y^8 + 9 * x^11 * y^8 + 11 * x^12 * y^8 + 7 * x^0 * y^9 + 0 * x^1 * y^9 + 8 * x^2 * y^9 + 8 * x^3 * y^9 + 0 * x^4 * y^9 + 9 * x^5 * y^9 + 9 * x^6 * y^9 + 3 * x^7 * y^9 + 3 * x^8 * y^9 + 10 * x^9 * y^9 + 0 * x^10 * y^9 + 11 * x^11 * y^9 + 1 * x^12 * y^9 + 11 * x^0 * y^10 + 11 * x^1 * y^10 + 3 * x^2 * y^10 + 5 * x^3 * y^10 + 10 * x^4 * y^10 + 9 * x^5 * y^10 + 8 * x^6 * y^10 + 5 * x^7 * y^10 + 2 * x^8 * y^10 + 4 * x^9 * y^10 + 3 * x^10 * y^10 + 4 * x^11 * y^10 + 0 * x^12 * y^10 + 1 * x^0 * y^11 + 9 * x^1 * y^11 + 12 * x^2 * y^11 + 11 * x^3 * y^11 + 8 * x^4 * y^11 + 2 * x^5 * y^11 + 2 * x^6 * y^11 + 12 * x^7 * y^11 + 10 * x^8 * y^11 + 3 * x^9 * y^11 + 0 * x^10 * y^11 + 2 * x^11 * y^11 + 1 * x^12 * y^11 + 6 * x^0 * y^12 + 9 * x^1 * y^12 + 3 * x^2 * y^12 + 6 * x^3 * y^12 + 9 * x^4 * y^12 + 1 * x^5 * y^12 + 10 * x^6 * y^12 + 1 * x^7 * y^12 + 6 * x^8 * y^12 + 12 * x^9 * y^12 + 12 * x^10 * y^12 + 10 * x^11 * y^12 + 7 * x^12 * y^12"
  },
  /*playVariable=*/{
    "x": false,
    "ydelta": false,
    "y": false,
    "z": true
  },
  /*variableOctaves=*/{
    "x": 2, "y": 2, "ydelta": 2, "z": 3
  },
  /*bpm=*/105
)

type PredefinedConfigs = {
  [name: string]: UserConfig
}

const predefinedConfigs = {
  'Fibonacci': fibonacciUserConfig,
  'Tribonacci': tribonacciUserConfig,
  'Chromatic Chaos': chromaticChaos,
  'Prime Powers': primePowers,
  'Somebody Once Told Me': somebodyOnceToldMe
}

export { fibonacciUserConfig, predefinedConfigs };
export type { PredefinedConfigs };
