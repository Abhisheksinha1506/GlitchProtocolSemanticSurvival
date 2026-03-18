export const wordPairs = [
  { original: 'Open', corrupted: 'Close' },
  { original: 'Lock', corrupted: 'Unlock' },
  { original: 'Forward', corrupted: 'Backward' },
  { original: 'Up', corrupted: 'Down' },
  { original: 'Ignore', corrupted: 'Heed' },
  { original: 'Trust', corrupted: 'Suspect' },
  { original: 'Enter', corrupted: 'Exit' },
  { original: 'Activate', corrupted: 'Deactivate' },
  { original: 'Accept', corrupted: 'Reject' },
  { original: 'Fire', corrupted: 'Water' },
  { original: 'Hot', corrupted: 'Cold' },
  { original: 'Light', corrupted: 'Dark' },
  { original: 'Fast', corrupted: 'Slow' },
  { original: 'Safe', corrupted: 'Dangerous' },
  { original: 'Friend', corrupted: 'Enemy' },
  { original: 'Hide', corrupted: 'Reveal' },
  { original: 'Attack', corrupted: 'Defend' },
  { original: 'Advance', corrupted: 'Retreat' },
  { original: 'Connect', corrupted: 'Disconnect' },
  { original: 'On', corrupted: 'Off' },
  { original: 'Yes', corrupted: 'No' },
  { original: 'Start', corrupted: 'Stop' },
  { original: 'Increase', corrupted: 'Decrease' },
  { original: 'Left', corrupted: 'Right' },
  { original: 'Run', corrupted: 'Walk' },
];

export function getRandomWordPairs(count: number, exclude: typeof wordPairs = []): typeof wordPairs {
  const excludeOriginals = new Set(exclude.map(p => p.original));
  const available = wordPairs.filter(p => !excludeOriginals.has(p.original));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
