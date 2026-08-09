const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.extraNodeModules = {
  '@babel/runtime': path.resolve(projectRoot, 'node_modules/@babel/runtime'),
  'ansi-styles': path.resolve(projectRoot, 'node_modules/ansi-styles'),
  '@expo/metro': path.resolve(projectRoot, 'node_modules/@expo/metro'),
  '@expo/log-box': path.resolve(projectRoot, 'node_modules/@expo/log-box'),
  'expo-modules-core': path.resolve(projectRoot, 'node_modules/expo-modules-core'),
  '@react-native/normalize-colors': path.resolve(projectRoot, 'node_modules/@react-native/normalize-colors'),
  'css-in-js-utils': path.resolve(projectRoot, 'node_modules/css-in-js-utils'),
  fbjs: path.resolve(projectRoot, 'node_modules/fbjs'),
  invariant: path.resolve(projectRoot, 'node_modules/invariant'),
  'inline-style-prefixer': path.resolve(projectRoot, 'node_modules/inline-style-prefixer'),
  'iceberg-js': path.resolve(projectRoot, 'node_modules/iceberg-js'),
  'hyphenate-style-name': path.resolve(projectRoot, 'node_modules/hyphenate-style-name'),
  'memoize-one': path.resolve(projectRoot, 'node_modules/memoize-one'),
  'metro-runtime': path.resolve(projectRoot, 'node_modules/metro-runtime'),
  nullthrows: path.resolve(projectRoot, 'node_modules/nullthrows'),
  'postcss-value-parser': path.resolve(projectRoot, 'node_modules/postcss-value-parser'),
  'pretty-format': path.resolve(projectRoot, 'node_modules/pretty-format'),
  'react-refresh': path.resolve(projectRoot, 'node_modules/react-refresh'),
  'react-is-18': path.resolve(workspaceRoot, 'node_modules/.pnpm/react-is@18.3.1/node_modules/react-is'),
  'react-is-19': path.resolve(workspaceRoot, 'node_modules/.pnpm/react-is@19.2.8/node_modules/react-is'),
  '@supabase/functions-js': path.resolve(projectRoot, 'node_modules/@supabase/functions-js'),
  '@supabase/auth-js': path.resolve(projectRoot, 'node_modules/@supabase/auth-js'),
  '@supabase/postgrest-js': path.resolve(projectRoot, 'node_modules/@supabase/postgrest-js'),
  '@supabase/realtime-js': path.resolve(projectRoot, 'node_modules/@supabase/realtime-js'),
  '@supabase/storage-js': path.resolve(projectRoot, 'node_modules/@supabase/storage-js'),
  styleq: path.resolve(projectRoot, 'node_modules/styleq'),
  tslib: path.resolve(projectRoot, 'node_modules/tslib'),
};
module.exports = config;