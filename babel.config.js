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

module.exports = (api) => {
  api.cache(true)

  return {
    ...baseConfig,
    plugins: [...baseConfig.plugins, 'react-native-reanimated/plugin'],
  }
}
