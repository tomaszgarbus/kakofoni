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

type PredefinedConfigs = {
  [name: string]: UserConfig
}

const predefinedConfigs = {
  'Fibonacci': fibonacciUserConfig,
  'Tribonacci': tribonacciUserConfig,
}

export { fibonacciUserConfig, predefinedConfigs };
export type { PredefinedConfigs };
