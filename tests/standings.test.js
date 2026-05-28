import test from "node:test";
import assert from "node:assert/strict";
import { GROUPS } from "../src/data/worldCup2026.js";
import {
  calculateStandings,
  calculateTournamentProjection,
  countCompleteMatches,
  createFixtures
} from "../src/standings.js";

test("creates six fixtures for a four-team group", () => {
  const fixtures = createFixtures(GROUPS[0]);

  assert.equal(fixtures.length, 6);
  assert.deepEqual(
    fixtures.map((fixture) => `${fixture.home.id}-${fixture.away.id}`),
    ["MEX-RSA", "KOR-CZE", "MEX-KOR", "RSA-CZE", "RSA-KOR", "CZE-MEX"]
  );
});

test("calculates points, goal difference, and rank order", () => {
  const group = GROUPS[0];
  const results = {
    "A-1": { home: 2, away: 0 },
    "A-2": { home: 1, away: 1 },
    "A-3": { home: 0, away: 1 },
    "A-4": { home: 3, away: 2 },
    "A-5": { home: 0, away: 0 },
    "A-6": { home: 1, away: 2 }
  };

  const standings = calculateStandings(group, results);

  assert.deepEqual(
    standings.map((row) => [row.team.id, row.points, row.goalDifference, row.goalsFor]),
    [
      ["MEX", 6, 2, 4],
      ["KOR", 5, 1, 2],
      ["RSA", 4, -1, 3],
      ["CZE", 1, -2, 4]
    ]
  );
});

test("counts only completed scorelines", () => {
  const fixtures = createFixtures(GROUPS[0]);
  const results = {
    "A-1": { home: 2, away: 0 },
    "A-2": { home: 1, away: null },
    "A-3": { home: 0, away: 0 }
  };

  assert.equal(countCompleteMatches(fixtures, results), 2);
});

test("marks eight best third-place teams as advancing", () => {
  const results = {};

  for (const group of GROUPS) {
    for (const fixture of createFixtures(group)) {
      results[fixture.id] = { home: 1, away: 0 };
    }
  }

  const projection = calculateTournamentProjection(GROUPS, results);

  assert.equal(projection.thirdPlaces.length, 12);
  assert.equal(projection.thirdPlaces.filter((row) => row.advances).length, 8);
});
