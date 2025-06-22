// constants/index.ts
export const COMPONENT_LIBRARY_STYLE: Record<string, string> = {
  '@arco-design/web-react':
    'https://esm.sh/@arco-design/web-react@2.62.1/dist/css/arco.min.css',

};

export const DEFAULT_DEPENDENCIES = {
  react: '18.2.0',
  'react-dom': '18.2.0',
  '@arco-design/web-react': '2.66.1',
  '@arco-design/web-react/icon': '2.66.1',
};

export const TRANSFORM_OPTIONS = {
  target: 'es2022' as const,
  bundle: false,
  external: ['react', 'react-dom'],
};