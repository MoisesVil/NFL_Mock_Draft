/** Small shared helpers. Grows as the app does. */

/** e.g. overall 33 -> { round: 2, pickInRound: 1 } for a 32-team draft. */
export function roundForOverall(overall: number, teamsPerRound = 32) {
  const round = Math.floor((overall - 1) / teamsPerRound) + 1;
  const pickInRound = ((overall - 1) % teamsPerRound) + 1;
  return { round, pickInRound };
}
