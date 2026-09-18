import { useState } from 'react';
import { demoCatalog } from '../demoCatalog';
import { Icon } from './Icon';

export function ExampleSidebar({
  selectedId,
  onSelect
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = demoCatalog.filter((demo) =>
    `${demo.title} ${demo.category} ${demo.description}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );
  return (
    <aside className="demo-sidebar">
      <div className="sidebar-heading">
        <span className="demo-eyebrow">PLAYGROUND</span>
        <span className="count-badge">{demoCatalog.length}</span>
      </div>
      <label className="example-search">
        <Icon name="search" />
        <input
          aria-label="搜索示例"
          placeholder="搜索示例…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <nav className="demo-list" aria-label="预览示例">
        {(['examples', 'diagnostics'] as const).map((group) => {
          const items = filtered.filter((demo) => demo.group === group);
          return (
            items.length > 0 && (
              <div className="example-group" key={group}>
                <span className="example-group__label">
                  {group === 'examples' ? '开始探索' : '错误与恢复'}
                </span>
                {items.map((demo) => (
                  <button
                    type="button"
                    key={demo.id}
                    aria-current={selectedId === demo.id ? 'true' : undefined}
                    className={selectedId === demo.id ? 'is-active' : undefined}
                    onClick={() => onSelect(demo.id)}
                  >
                    <span className="example-icon">
                      <Icon name={group === 'examples' ? 'grid' : 'warning'} />
                    </span>
                    <span className="example-name">
                      <strong>{demo.title}</strong>
                      <small>{demo.category}</small>
                    </span>
                    <Icon name="arrow" className="example-arrow" />
                  </button>
                ))}
              </div>
            )
          );
        })}
        {filtered.length === 0 && (
          <p className="search-empty" role="status">
            没有匹配的示例，试试其他关键词。
          </p>
        )}
      </nav>
      <a
        className="sidebar-guide"
        href="https://github.com/ForXd/react-previewer#readme"
        target="_blank"
        rel="noreferrer"
      >
        <span className="guide-icon">
          <Icon name="book" />
        </span>
        <strong>把预览接入你的产品</strong>
        <span>
          查看接入指南与 API 文档 <Icon name="arrow" />
        </span>
      </a>
      <div className="sidebar-footer">
        <span className="status-dot status-dot--ready" />
        浏览器内实时运行
      </div>
    </aside>
  );
}
