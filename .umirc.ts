import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  locale: {
    default: 'zh-CN',
    antd: false,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },
  alias: {
    '@': '/src',
    '@@': '/src/.umi',
  },
  extraBabelPresets: ['@emotion/babel-preset-css-prop'],
});
