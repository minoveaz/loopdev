import { promises as fs } from 'node:fs';
import { getTrackFiles } from './track-utils.mjs';

const replacements = new Map([
  ['Ã¡', 'á'], ['Ã©', 'é'], ['Ã­', 'í'], ['Ã³', 'ó'], ['Ãº', 'ú'], ['Ã±', 'ñ'],
  ['Ã', 'Á'], ['Ã‰', 'É'], ['Ã', 'Í'], ['Ã“', 'Ó'], ['Ãš', 'Ú'], ['Ã‘', 'Ñ'],
  ['Â¿', '¿'], ['Â¡', '¡'], ['Â·', '·'], ['â€”', '—'], ['â€“', '–'], ['â€˜', '‘'], ['â€™', '’'],
]);

let repairedFiles = 0;
for (const filePath of await getTrackFiles()) {
  const content = await fs.readFile(filePath, 'utf8');
  let repaired = content;
  for (const [incorrect, correct] of replacements) repaired = repaired.replaceAll(incorrect, correct);
  if (repaired !== content) {
    await fs.writeFile(filePath, repaired, 'utf8');
    repairedFiles += 1;
  }
}

console.log(`Repaired encoding in ${repairedFiles} track files.`);
