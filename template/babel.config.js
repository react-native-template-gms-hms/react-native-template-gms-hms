module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'module-resolver',
      {
        alias: {
          // This needs to be mirrored in tsconfig.json
          '@library': './src',
          '@app': './App/src',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
