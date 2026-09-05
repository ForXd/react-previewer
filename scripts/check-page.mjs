import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

// Include untracked files: a new hashed chunk must be committed as well.
const changes = execFileSync('git', ['status', '--porcelain', '--untracked-files=all', '--', 'page'], { encoding: 'utf8' });
assert.equal(changes, '', `page/ differs from the committed preview. Run npm run build:page and commit all page/ changes:\n${changes}`);
console.log('Committed page/ matches the production build.');
