/**
 * Runs the komfort smoke test in a visible fullscreen Chromium window.
 */
const { spawn } = require('child_process');

const child = spawn(
  process.execPath,
  [
    './node_modules/@playwright/test/cli.js',
    'test',
    'tests/specs/komfort-smoke.spec.ts',
    '--project=chromium',
    '--headed',
  ],
  {
    stdio: 'inherit',
    env: { ...process.env, HEADED_FULLSCREEN: '1' },
  },
);

child.on('exit', code => {
  process.exit(code === null ? 1 : code);
});
