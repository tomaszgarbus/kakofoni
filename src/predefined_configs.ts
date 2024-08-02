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
    'c1': 'c1+12',
    'c2': 'c2+1',
    'c3': 'c3+12',
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

type PredefinedConfigs = {
  [name: string]: UserConfig
}

const predefinedConfigs = {
  'Fibonacci': fibonacciUserConfig,
  'Tribonacci': tribonacciUserConfig,
  'Chromatic Chaos': chromaticChaos,
  'Prime Powers': primePowers,
}

export { fibonacciUserConfig, predefinedConfigs };
export type { PredefinedConfigs };
