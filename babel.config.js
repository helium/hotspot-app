function getAliasesFromTsConfig() {
  const tsConfig = require('./tsconfig.json')
  const paths = tsConfig.compilerOptions.paths
  let alias = {}
  Object.keys(paths).forEach((key) => {
    alias[key] = `./${paths[key][0]}`
  })

  return alias
}

const baseConfig = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: getAliasesFromTsConfig(),
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        root: ['./src'],
      },
    ],
  ],
}

// this is a temporary hack to fix reanimated2 causing tests to fail
// https://github.com/software-mansion/react-native-reanimated/pull/1230#issuecomment-700656294
module.exports = (api) => {
  const babelEnv = api.env()

  const isInTesting = babelEnv === 'test'

  if (isInTesting) return baseConfig

  return Object.assign(baseConfig, {
    plugins: [].concat(baseConfig.plugins, 'react-native-reanimated/plugin'),
  })
}
