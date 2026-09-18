export interface DemoDefinition {
  id: string;
  title: string;
  category: string;
  group: 'examples' | 'diagnostics';
  description: string;
  entryFile: string;
  files: Record<string, string>;
  depsInfo?: Record<string, string>;
  dependencyStyles?: Record<string, string | string[]>;
}
