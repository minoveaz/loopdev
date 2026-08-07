import { spawn } from 'node:child_process';
import process from 'node:process';

const isWindows = process.platform === 'win32';
const packageManager = isWindows ? 'pnpm.cmd' : 'pnpm';
const args = new Set(process.argv.slice(2));
const withSupabase = args.has('--with-supabase') || args.has('--full');

const children = [];

function start(label, command, commandArgs) {
  console.log(`[loopdev] iniciando ${label}: ${command} ${commandArgs.join(' ')}`);
  const child = spawn(command, commandArgs, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    shell: isWindows,
    windowsHide: false,
  });

  child.on('error', (error) => {
    console.error(`[loopdev] no se pudo iniciar ${label}: ${error.message}`);
  });

  child.on('exit', (code, signal) => {
    if (code && code !== 0) {
      console.error(`[loopdev] ${label} terminó con código ${code}${signal ? ` (${signal})` : ''}`);
    }
  });

  children.push(child);
}

// Next resolves workspace packages through their compiled entry points. Keep
// contracts rebuilt during development so newly added exports are immediately
// available to LoopDev OS instead of serving a stale dist bundle.
start('LoopDev contracts', packageManager, ['--filter', '@loopdev/contracts', 'dev']);
start('LoopDev OS', packageManager, ['--filter', 'loopdev-os', 'dev']);

if (withSupabase) {
  start('Supabase local', 'supabase', ['start']);
}

console.log('');
console.log('[loopdev] LoopDev OS: http://localhost:3000');
if (withSupabase) console.log('[loopdev] Supabase local: http://127.0.0.1:54323');
console.log('[loopdev] Pulsa Ctrl+C para detener los servicios iniciados.');

function shutdown(signal) {
  console.log(`\n[loopdev] deteniendo servicios (${signal})...`);
  for (const child of children) {
    if (child.killed) continue;

    if (isWindows && child.pid) {
      spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], {
        stdio: 'ignore',
        windowsHide: true,
      });
    } else {
      child.kill('SIGTERM');
    }
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
