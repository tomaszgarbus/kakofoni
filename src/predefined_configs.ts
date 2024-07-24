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
  
export { fibonacciUserConfig };