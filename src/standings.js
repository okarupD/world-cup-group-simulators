const FIXTURE_PATTERN = [
  [0, 1],
  [2, 3],
  [0, 2],
  [1, 3],
  [1, 2],
  [3, 0]
];

export function createFixtures(group) {
  return FIXTURE_PATTERN.map(([homeIndex, awayIndex], index) => ({
    id: `${group.id}-${index + 1}`,
    groupId: group.id,
    round: index < 2 ? 1 : index < 4 ? 2 : 3,
    home: group.teams[homeIndex],
    away: group.teams[awayIndex]
  }));
}

export function createAllFixtures(groups) {
  return groups.flatMap(createFixtures);
}

export function isCompleteScore(score) {
  return (
    Number.isInteger(score?.home) &&
    Number.isInteger(score?.away) &&
    score.home >= 0 &&
    score.away >= 0
  );
}

export function calculateStandings(group, results = {}) {
  const rows = new Map(
    group.teams.map((team) => [
      team.id,
      {
        team,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      }
    ])
  );

  for (const fixture of createFixtures(group)) {
    const score = results[fixture.id];
    if (!isCompleteScore(score)) {
      continue;
    }

    const home = rows.get(fixture.home.id);
    const away = rows.get(fixture.away.id);

    home.played += 1;
    away.played += 1;
    home.goalsFor += score.home;
    home.goalsAgainst += score.away;
    away.goalsFor += score.away;
    away.goalsAgainst += score.home;

    if (score.home > score.away) {
      home.won += 1;
      away.lost += 1;
      home.points += 3;
    } else if (score.home < score.away) {
      away.won += 1;
      home.lost += 1;
      away.points += 3;
    } else {
      home.drawn += 1;
      away.drawn += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  return rankRows([...rows.values()].map(withGoalDifference));
}

export function rankRows(rows) {
  return [...rows].sort((a, b) => {
    return (
      b.points - a.points ||
      b.goalDifference - a.goalDifference ||
      b.goalsFor - a.goalsFor ||
      a.team.name.localeCompare(b.team.name)
    );
  });
}

export function calculateTournamentProjection(groups, results = {}) {
  const groupTables = groups.map((group) => ({
    group,
    standings: calculateStandings(group, results),
    completeMatches: createFixtures(group).filter((fixture) => isCompleteScore(results[fixture.id])).length
  }));

  const thirdPlaces = rankRows(
    groupTables
      .map(({ group, standings }) => ({
        ...standings[2],
        groupId: group.id
      }))
      .filter(Boolean)
  );

  const bestThirdIds = new Set(thirdPlaces.slice(0, 8).map((row) => `${row.groupId}-${row.team.id}`));

  return {
    groupTables,
    thirdPlaces: thirdPlaces.map((row) => ({
      ...row,
      advances: bestThirdIds.has(`${row.groupId}-${row.team.id}`)
    }))
  };
}

export function countCompleteMatches(fixtures, results = {}) {
  return fixtures.filter((fixture) => isCompleteScore(results[fixture.id])).length;
}

function withGoalDifference(row) {
  return {
    ...row,
    goalDifference: row.goalsFor - row.goalsAgainst
  };
}
