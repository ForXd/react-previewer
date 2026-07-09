import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReactPreviewer } from '../src/lib/ReactPreview';

describe('ReactPreviewer public interface', () => {
  it('keeps preview chrome caller-owned and exposes style slots', () => {
    const markup = renderToStaticMarkup(
      <ReactPreviewer
        files={{
          'App.tsx': 'export default function App() { return <div>Preview</div>; }'
        }}
        isInspecting
        className="consumer-preview"
        style={{ minHeight: 280 }}
        classNames={{
          root: 'consumer-root',
          loading: 'consumer-loading',
          error: 'consumer-error',
          iframe: 'consumer-iframe'
        }}
        styles={{
          root: { borderRadius: 18 },
          loading: { backgroundColor: 'rgba(15, 23, 42, 0.72)' },
          error: { padding: 24 },
          iframe: { backgroundColor: '#f8fafc' }
        }}
      />
    );

    expect(markup).toContain('react-previewer consumer-preview consumer-root');
    expect(markup).toContain('min-height:280px');
    expect(markup).toContain('border-radius:18px');
    expect(markup).toContain('react-previewer__loading consumer-loading');
    expect(markup).toContain('rgba(15, 23, 42, 0.72)');
    expect(markup).toContain('react-previewer__iframe');
    expect(markup).toContain('consumer-iframe');
    expect(markup).toContain('background-color:#f8fafc');
    expect(markup).not.toContain('preview.local');
    expect(markup).not.toContain('重新编译');
  });
});
