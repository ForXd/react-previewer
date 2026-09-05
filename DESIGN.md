# Architecture

React Previewer runs React source inside an iframe. Its public interface is
`ReactPreviewerProps`: source files, compiler configuration, controlled inspection
and routing, callbacks, and presentation slots. Product chrome belongs to the
caller. This refactor preserves the public props and exported types.

## Module map

```text
src/demo/                               Caller application
├── DemoWorkbench.tsx                   Composition and display preferences
├── useDemoWorkspace.ts                 Drafts, active files, routes, source selection
├── workbenchConfig.ts                  Compiler adapters and viewport presets
├── demoCatalog.ts                      Example registry
├── examples/                           Independently editable example definitions
├── components/                         Sidebar, toolbar, editor, preview, status
├── MonacoCodeEditor.tsx                 Monaco workers, markers and source selection
└── styles/                             Tokens, layout, workbench, preview chrome
                    │ public props / exported types
                    ▼
src/lib/ReactPreview/
├── preview/ReactPreviewer.tsx           Root slots and error containment
├── preview/components/                 Document installation and feedback views
├── preview/runtime/
│   ├── usePreviewRuntime.ts            React lifecycle, iframe protocol, one status
│   ├── CompilationSession.ts           Scheduling, adapter lifetime, result ownership
│   └── previewState.ts                 Status and route normalization
├── preview/compilers/                  Babel / Rspack / custom adapter seam
├── compiler/                           Babel transforms and local dependency graph
├── preview/DependencyResolver.ts       Package versions, CDN resources, import maps
└── preview/utils/                      HTML runtime, error maps and source lookup
```

The compiler seam has two real built-in adapters and accepts custom adapters.
`CompilationSession` is an internal module with three operations: `compile`,
`invalidate`, and `dispose`. Views do not configure compilers, initialize workers,
or revoke URLs. `PreviewFrame` only installs the document and renders the status
through the existing loading/error slots.

The HTML generator owns the document-side resource, history and inspection scripts.
The React runtime owns the host-side message listener. Neither knows about Monaco,
example navigation, device frames or demo themes.

## Compilation and resource ownership

1. Source content, entry file, dependency declarations, stylesheet URLs, compiler
   configuration, source attributes or Tailwind settings produce a compilation key.
   Equivalent object literals do not restart compilation. Adapter instances and
   worker factories are compared by identity because they carry behavior.
2. A changed key invalidates pending work immediately and starts the debounce.
   Callback, theme, route and inspection updates do not restart this work.
3. The session serializes compilation, skips obsolete queued requests and discards
   obsolete results. Adapters with mutable state never receive overlapping calls
   within a preview instance.
4. Every result has an owner. Cleanup uses the result's cleanup function, its
   producing adapter, or unique blob URLs, in that order. A replacement releases
   the prior result; an obsolete result releases itself as soon as it resolves.
5. Unmount invalidates the session, releases the active result and terminates the
   adapter. Late results release themselves and cannot publish state. StrictMode
   effect replay creates a fresh session.
6. Babel releases partial module URLs when a later module fails transformation.
   Custom adapters remain responsible for resources they allocate before rejecting.

An adapter shared by multiple preview instances must support independent callers;
serialization is per preview instance. Keep custom adapter and worker-factory
identities stable until their behavior should change. The session cannot forcibly
cancel an arbitrary custom promise; provide adapter cleanup to stop external work.

## Iframe status and protocol

`PreviewStatus` is the single source of truth for loading and errors. Starting a
compile resets progress and diagnostics. Successful compilation installs a new
iframe document and advances to resource loading. JS/CSS progress can advance to
ready, while compile, dependency and runtime failures advance to error.

Only messages from the current iframe window are accepted. Messages from the prior
document are ignored during recompilation; malformed and foreign messages are
ignored. An error is terminal for its document: late ready/resource messages cannot
hide it. Editing the source starts a new lifecycle and allows recovery.

Routing and inspection use the latest callback and controlled prop values without
recompiling. Source positions retain one-based coordinates. Frame installation uses
`document.write` in a fresh iframe to preserve the existing origin, import-map and
history behavior. The existing iframe sandbox policy is unchanged.

## Presentation and extension points

The four stable library slots are `root`, `loading`, `error`, and `iframe`.
`className` / `style` style the root, `classNames` / `styles` style slots, and
`renderLoading` / `renderError` replace their contents. The library stylesheet is
scoped to `.react-previewer`; demo styles and Monaco never enter the library build.

To extend the project:

- **Add an example:** create a `DemoDefinition` in `demo/examples/` and register it in
  `demoCatalog.ts`. The sidebar, search, file tabs and draft handling read the registry.
- **Add a compiler:** implement `PreviewCompiler` and pass a stable instance through
  the `compiler` prop. Implement result cleanup and adapter disposal as appropriate.
- **Add product chrome:** compose the public preview component with caller views.
  Demo view modules take explicit props; no private presentation component is imported.
- **Add a theme:** change the demo tokens and slot variables. Paper/Ink also choose
  Monaco's light/dark theme. User code inside the iframe retains its own styling.
- **Add a viewport:** extend `workbenchConfig.ts` and its toolbar choice. Fixed widths
  are capped to the available stage width; the editor uses an explicit responsive
  height so tab switching cannot collapse Monaco.

The demo keeps independent drafts and active files for each example in a reducer.
Switching examples preserves drafts; reset affects only the current example.
Drafts last for the current page session and are not persisted to storage. Runtime
status is separate from draft state. Both top-level views stay mounted when hidden,
preserving the editor and preview; keyboard tabs use roving focus with arrows,
Home and End. Inspector selections can open the corresponding file and range.

## Verification

- Public-component tests exercise callback stability, adapter replacement, message
  isolation, error recovery and StrictMode replay.
- Session tests exercise async request serialization, stale results, owner-specific
  cleanup, disposal during compilation and recovery from failed initialization.
- Compiler tests cover transforms, source mapping, dependencies and partial cleanup.
- Demo tests cover multi-file editing, reset, independent drafts, search, keyboard
  tabs and preview controls. Monaco is mocked only in these interaction tests;
  real editor/iframe behavior is checked in the browser.
- Run `npm test`, `npm run lint`, `npm run build`, `npm run build:lib`, and
  `npm run build:page`. Commit generated `page/` output for GitHub Pages. Keep `dist/` ignored;
  validate it locally and generate it during npm publishing.
- Browser verification covers Babel and Rspack rendering, an editable error and
  recovery, routing, source inspection, themes and desktop/mobile layouts.
