#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { getTrackFiles, readTrack } from './tracks/track-utils.mjs';

function getOption(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function changedFiles(base, head) {
  return execFileSync('git', ['diff', '--name-only', `${base}...${head}`], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean)
    .map((file) => file.replaceAll('\\', '/'));
}

function activePlatformTrackForBranch(branch, tracks) {
  return tracks.find(
    (track) =>
      track.status === 'active' &&
      track.owner === 'platform' &&
      (track.branch === branch || track.branches?.includes(branch)),
  );
}

function activeTrackById(id, tracks) {
  return tracks.find((track) => track.status === 'active' && track.id === id);
}

function protectedSurfaceChanges(files, catalog) {
  return catalog.protectedSurfaces.flatMap((surface) => {
    const changed = files.filter((file) =>
      surface.paths.some(
        (protectedPath) => file === protectedPath || file.startsWith(protectedPath),
      ),
    );
    return changed.length === 0 ? [] : [{ surface, changed }];
  });
}

function validateProtectedSurfaceOwnership(files, catalog, branch, tracks) {
  const changes = protectedSurfaceChanges(files, catalog);
  if (changes.length === 0) return [];

  const platformTrack = activePlatformTrackForBranch(branch, tracks);
  return changes.flatMap(({ surface, changed }) => {
    if (
      platformTrack ||
      surface.allowedDuringActiveTracks?.some((id) => activeTrackById(id, tracks))
    ) {
      return [];
    }
    return `protected surface '${surface.id}' changed (${changed.join(', ')}) without an active platform track for branch '${branch}'`;
  });
}

async function loadTracks() {
  const files = await getTrackFiles();
  const tracks = await Promise.all(files.map(readTrack));
  return tracks.map(({ metadata }) => ({
    id: metadata?.id,
    status: metadata?.status,
    owner: metadata?.owner,
    branch: metadata?.branch,
    branches: metadata?.branches
      ? metadata.branches
          .replace(/^\[|\]$/g, '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
  }));
}

async function main() {
  const base = getOption('--base') || process.env.BASE_SHA || 'HEAD^';
  const head = getOption('--head') || process.env.HEAD_SHA || 'HEAD';
  const branch =
    getOption('--branch') ||
    process.env.GITHUB_HEAD_REF ||
    execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim();
  const catalog = JSON.parse(readFileSync('config/validation-domain-catalog.json', 'utf8'));
  const errors = validateProtectedSurfaceOwnership(
    changedFiles(base, head),
    catalog,
    branch,
    await loadTracks(),
  );

  if (errors.length > 0) {
    console.error(`Protected surface ownership validation failed:\n- ${errors.join('\n- ')}`);
    process.exitCode = 1;
    return;
  }
  console.log('Protected surface ownership validation passed.');
}

export {
  activePlatformTrackForBranch,
  activeTrackById,
  protectedSurfaceChanges,
  validateProtectedSurfaceOwnership,
};

if (process.argv[1]?.endsWith('validate-protected-surface-ownership.mjs')) await main();
