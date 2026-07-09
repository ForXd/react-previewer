# ReactPreview internal notes

The user-facing documentation is the repository [README](../../../README.md). This directory contains the library implementation only; demo and product UI belong under `src/demo/`.

The main flow is:

1. `ReactPreviewer` accepts files, compiler configuration, callbacks and presentation slots.
2. `PreviewFrame` schedules compilation and owns the current compile result.
3. A compiler adapter returns entry and module blob URLs.
4. `HTMLGenerator` writes the isolated iframe document and resource runtime.
5. iframe messages update status, errors, routes and source selection.

Keep these seams narrow:

- Public behavior is added to `ReactPreviewerProps`, not by exporting internal views.
- Compiler variability belongs to `PreviewCompiler` adapters.
- Product-specific controls and visual chrome belong to the caller.
- Tests should observe the public component or a real compiler interface, not internal state.

Useful verification commands:

```bash
npm test
npm run lint
npm run build:lib
npm run build:page
```
