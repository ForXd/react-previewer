# Architecture

## Design goal

React Previewer is a deep module: callers learn one small interface while the module owns compilation, dependency resolution, iframe lifecycle, resource loading, error mapping, routing and source inspection.

The external seam is `ReactPreviewerProps`. UI chrome is deliberately outside that seam.

```text
Demo / product UI
  toolbar · viewport · address bar · theme · inspector panel
                         │
                         ▼
                  ReactPreviewer
     files · compiler · callbacks · presentation slots
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
     compiler adapter  iframe runtime  feedback surface
      Babel / Rspack   HTML + messages  loading / error
```

## Module responsibilities

- `preview/ReactPreviewer.tsx` defines the public seam, applies caller-owned styling slots and contains failures in an error boundary.
- `preview/components/PreviewFrame.tsx` owns preview state and the iframe lifecycle. It is internal implementation, not a second public interface.
- `preview/compilers/` contains the real compiler seam. Babel and Rspack Browser are two adapters; custom compilers satisfy the same interface.
- `compiler/` implements the default Babel transformation path, dependency ordering and source metadata injection.
- `preview/DependencyResolver.ts` converts package declarations into stable CDN resources and import maps.
- `preview/utils/HTMLGenerator.ts` creates the isolated document and its resource, routing and inspection runtime.
- `src/demo/` is an application that consumes the library. It must not be included in library declarations or library CSS.

## Presentation contract

The runtime ships only functional default styles. Product styling is exposed through:

- conventional `className` and `style` for the root;
- `classNames` and `styles` for `root`, `loading`, `error`, and `iframe` slots;
- `renderLoading` and `renderError` when styling alone is insufficient.

The slot names are part of the public interface. Internal CSS selectors and component names are not.

## Invariants

- `files` and `entryFile` are the source of truth for compilation.
- Recompilation depends on source content, dependency declarations, compiler configuration and source attribute configuration—not callback identity.
- A compile result owns its blob URLs and must release them before replacement or unmount.
- Only messages from the current iframe window are accepted.
- Resource loading does not report `ready` until critical JS and CSS complete or fail through the defined timeout path.
- `onElementClick` fires only while controlled inspection mode is enabled.
- Demo UI never imports private presentation modules from the library.

## Verification

- Public interface behavior is tested through `ReactPreviewer` rather than private view modules.
- Compiler and dependency behavior is tested through their real seams.
- `npm run build:lib` verifies distributable JS, CSS and declarations.
- `npm run build:page` verifies the demo and generated GitHub Pages output.
- Browser smoke tests must confirm iframe content renders without an error overlay in both Babel and Rspack modes.
