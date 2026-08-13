import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const roots = ['docs', 'tracks', '.github'];
const ignoredDirectories = new Set(['node_modules', '.git', '.next', 'dist', 'coverage']);
const markdownFiles = [];

function collectMarkdownFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectMarkdownFiles(fullPath);
    } else if (entry.name.endsWith('.md')) {
      markdownFiles.push(fullPath);
    }
  }
}

for (const relativeRoot of roots) {
  collectMarkdownFiles(path.join(root, relativeRoot));
}

const brokenLinks = [];
const localLinkPattern = /\]\(([^)]+)\)/g;

for (const filePath of markdownFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  for (const match of content.matchAll(localLinkPattern)) {
    const target = match[1];
    if (/^(https?:|mailto:|#)/i.test(target)) continue;
    const cleanTarget = target.split('#')[0];
    if (!cleanTarget) continue;

    const resolvedTarget = path.resolve(path.dirname(filePath), cleanTarget);
    if (!fs.existsSync(resolvedTarget)) {
      brokenLinks.push(`${path.relative(root, filePath)} -> ${target}`);
    }
  }
}

if (brokenLinks.length > 0) {
  console.error(`Found ${brokenLinks.length} broken local Markdown link(s):`);
  for (const brokenLink of brokenLinks) console.error(`- ${brokenLink}`);
  process.exit(1);
}

console.log(`Markdown link validation passed: ${markdownFiles.length} files scanned.`);
