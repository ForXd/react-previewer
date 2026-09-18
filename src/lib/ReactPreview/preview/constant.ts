export const COMPONENT_LIBRARY_STYLE: Record<string, string> = {
  '@arco-design/web-react':
    'https://esm.sh/@arco-design/web-react@2.66.16/dist/css/arco.min.css',
  antd: 'https://esm.sh/antd@6.6.2/dist/reset.css',
};

export const DEFAULT_DEPENDENCIES = {
  react: '19.2.8',
  'react-dom': '19.2.8',
};

export const TRANSFORM_OPTIONS = {
  target: 'es2022' as const,
  bundle: false,
  external: ['react', 'react-dom'],
};

/** Keep React entry points on one version, including caller overrides. */
export function getPreviewDependencies(depsInfo: Record<string, string> = {}): Record<string, string> {
  const reactVersion = depsInfo.react ?? depsInfo['react-dom'] ?? DEFAULT_DEPENDENCIES.react;
  const reactDomVersion = depsInfo['react-dom'] ?? reactVersion;
  return {
    react: reactVersion,
    'react-dom': reactDomVersion,
    'react-dom/client': reactDomVersion,
    'react/jsx-runtime': reactVersion,
    'react/jsx-dev-runtime': reactVersion,
    ...depsInfo
  };
}
