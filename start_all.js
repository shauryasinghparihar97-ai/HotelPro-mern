const { spawn } = require('child_process');
const path = require('path');

const rootDir = __dirname;
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

// Ensure OpenSSH and Node are in PATH
const sshDir = 'C:\\Windows\\System32\\OpenSSH';
const nodeDir = 'C:\\Users\\shaur\\.gemini\\antigravity\\scratch\\tools\\node-v20.18.0-win-x64';
process.env.PATH = `${nodeDir};${sshDir};${process.env.PATH || ''}`;

console.log('[HotelPro] Starting Backend API...');
const serverProc = spawn(process.execPath, ['server.js'], {
  cwd: serverDir,
  stdio: 'inherit',
  env: { ...process.env },
});

console.log('[HotelPro] Starting Frontend Client (Vite)...');
const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';
const clientProc = spawn(npxCmd, ['vite', '--host'], {
  cwd: clientDir,
  stdio: 'inherit',
  env: { ...process.env },
  shell: isWin,
});

console.log('[HotelPro] Launching public sharing tunnel (localhost.run)...');
const sshProc = spawn('ssh', [
  '-R', '80:localhost:5173',
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'ServerAliveInterval=30',
  '-o', 'ExitOnForwardFailure=yes',
  'nokey@localhost.run',
], {
  env: { ...process.env },
});

sshProc.stdout.on('data', (data) => {
  const text = data.toString();
  const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.lhr\.life/);
  if (match) {
    console.log('\n======================================================');
    console.log(`🌐 GENERAL SHARING LINK (Worldwide Public Access):`);
    console.log(`👉 ${match[0]}`);
    console.log('======================================================\n');
  }
});

sshProc.stderr.on('data', (data) => {
  // Diagnostic
});

const cleanup = () => {
  console.log('\n[HotelPro] Stopping all services...');
  try { serverProc.kill(); } catch (e) {}
  try { clientProc.kill(); } catch (e) {}
  try { sshProc.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
