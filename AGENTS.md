# Repository Instructions

- Develop feature and fix work on a new branch, using the `codex/` prefix unless the task asks for a different branch name.
- Target merge requests / pull requests at `main`.
- Before editing, check the current branch and worktree with `git status --short --branch` and avoid reverting unrelated local changes.
- For source changes, run `npm run build` and `npm run build:page` before submitting. `npm run build` is the library build alias.
- When changes affect the ReactPreview demo or GitHub preview page, run `npm run build:page` and commit the generated `page/` output.
- For library changes, run `npm run build:lib` before submitting.
- Keep generated preview artifacts in sync with the source changes so GitHub Pages reflects the latest behavior.
- Include generated `dist/` output for library changes and generated `page/` output for demo or GitHub Pages changes when those files are produced by the build.
- After validation, commit the complete source and generated artifact changes, push the branch, and open an MR/PR to `main`.
