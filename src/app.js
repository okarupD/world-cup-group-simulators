import { DATA_CHECKED_AT, GROUPS } from "./data/worldCup2026.js";
import {
  calculateStandings,
  calculateTournamentProjection,
  countCompleteMatches,
  createAllFixtures,
  createFixtures,
  isCompleteScore
} from "./standings.js";

const storageKey = "world-cup-2026-group-simulator";
const allFixtures = createAllFixtures(GROUPS);
const state = {
  selectedGroupId: GROUPS[0].id,
  results: loadResults()
};

const elements = {
  completionCount: document.querySelector("#completion-count"),
  fixturesPanel: document.querySelector("#fixtures-panel"),
  groupTabs: document.querySelector("#group-tabs"),
  overviewGrid: document.querySelector("#overview-grid"),
  resetAll: document.querySelector("#reset-all"),
  selectedGroup: document.querySelector("#selected-group"),
  standingsPanel: document.querySelector("#standings-panel"),
  thirdPlaceTable: document.querySelector("#third-place-table")
};

elements.groupTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-group-id]");
  if (!button) {
    return;
  }

  state.selectedGroupId = button.dataset.groupId;
  render();
});

elements.fixturesPanel.addEventListener("change", (event) => {
  const input = event.target.closest("input[data-match-id]");
  if (!input) {
    return;
  }

  const matchId = input.dataset.matchId;
  const side = input.dataset.side;
  const value = input.value === "" ? null : Number(input.value);
  state.results[matchId] = {
    ...state.results[matchId],
    [side]: Number.isInteger(value) && value >= 0 ? value : null
  };

  if (!isCompleteScore(state.results[matchId])) {
    state.results[matchId] = {
      home: state.results[matchId].home ?? null,
      away: state.results[matchId].away ?? null
    };
  }

  saveResults();
  render();
});

elements.selectedGroup.addEventListener("click", (event) => {
  const action = event.target.closest("button[data-action]")?.dataset.action;
  if (!action) {
    return;
  }

  const group = getSelectedGroup();

  if (action === "clear-group") {
    for (const fixture of createFixtures(group)) {
      delete state.results[fixture.id];
    }
  }

  if (action === "randomize-group") {
    for (const fixture of createFixtures(group)) {
      state.results[fixture.id] = randomScore();
    }
  }

  saveResults();
  render();
});

elements.resetAll.addEventListener("click", () => {
  state.results = {};
  saveResults();
  render();
});

render();

function render() {
  const selectedGroup = getSelectedGroup();
  const projection = calculateTournamentProjection(GROUPS, state.results);
  const completeMatches = countCompleteMatches(allFixtures, state.results);

  elements.completionCount.textContent = `${completeMatches} / ${allFixtures.length}`;
  renderGroupTabs();
  renderSelectedGroup(selectedGroup);
  renderFixtures(selectedGroup);
  renderStandings(selectedGroup);
  renderOverview(projection);
  renderThirdPlaces(projection.thirdPlaces);
}

function renderGroupTabs() {
  elements.groupTabs.innerHTML = GROUPS.map((group) => {
    const complete = countCompleteMatches(createFixtures(group), state.results);
    const selected = group.id === state.selectedGroupId;

    return `
      <button class="group-tab" type="button" data-group-id="${group.id}" aria-selected="${selected}">
        <span>Group ${group.id}</span>
        <small>${complete}/6</small>
      </button>
    `;
  }).join("");
}

function renderSelectedGroup(group) {
  elements.selectedGroup.innerHTML = `
    <div class="group-banner">
      <div>
        <p class="eyebrow">Checked ${DATA_CHECKED_AT}</p>
        <h2>Group ${group.id}</h2>
      </div>
      <div class="group-actions">
        <button class="ghost-button" type="button" data-action="clear-group">クリア</button>
        <button class="solid-button" type="button" data-action="randomize-group">ランダム</button>
      </div>
    </div>
    <div class="team-strip">
      ${group.teams.map(renderTeamTile).join("")}
    </div>
  `;
}

function renderTeamTile(team) {
  return `
    <article class="team-tile">
      <span class="flag" aria-hidden="true">${team.flag}</span>
      <span class="team-name">${team.name}</span>
      <span class="team-meta">${team.drawPosition} · ${team.confederation}</span>
    </article>
  `;
}

function renderFixtures(group) {
  const fixtures = createFixtures(group);

  elements.fixturesPanel.innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">Fixtures</p>
      <h2>試合結果</h2>
    </div>
    <div class="fixture-list">
      ${fixtures.map(renderFixture).join("")}
    </div>
  `;
}

function renderFixture(fixture) {
  const score = state.results[fixture.id] || {};

  return `
    <div class="fixture-row">
      <div class="fixture-team">
        <span class="flag" aria-hidden="true">${fixture.home.flag}</span>
        <span>${fixture.home.name}</span>
      </div>
      <input
        class="score-input"
        data-match-id="${fixture.id}"
        data-side="home"
        inputmode="numeric"
        min="0"
        max="99"
        type="number"
        value="${score.home ?? ""}"
        aria-label="${fixture.home.name} score"
      />
      <span class="versus">vs</span>
      <input
        class="score-input"
        data-match-id="${fixture.id}"
        data-side="away"
        inputmode="numeric"
        min="0"
        max="99"
        type="number"
        value="${score.away ?? ""}"
        aria-label="${fixture.away.name} score"
      />
      <div class="fixture-team away">
        <span>${fixture.away.name}</span>
        <span class="flag" aria-hidden="true">${fixture.away.flag}</span>
      </div>
    </div>
  `;
}

function renderStandings(group) {
  const standings = calculateStandings(group, state.results);

  elements.standingsPanel.innerHTML = `
    <div class="section-heading">
      <p class="eyebrow">Table</p>
      <h2>順位表</h2>
    </div>
    ${renderStandingsTable(standings)}
    <p class="note">同勝点は得失点差、得点、チーム名の順で並べています。</p>
  `;
}

function renderOverview(projection) {
  elements.overviewGrid.innerHTML = projection.groupTables.map(({ group, standings, completeMatches }) => {
    const third = projection.thirdPlaces.find((row) => row.groupId === group.id);

    return `
      <article class="overview-card">
        <div class="overview-card-header">
          <span>Group ${group.id}</span>
          <span>${completeMatches}/6</span>
        </div>
        <div class="overview-list">
          ${standings.slice(0, 2).map((row) => renderQualifiedRow(row, "Top 2")).join("")}
          ${third ? renderQualifiedRow(third, third.advances ? "Best 3rd" : "3rd") : ""}
        </div>
      </article>
    `;
  }).join("");
}

function renderQualifiedRow(row, status) {
  const pending = row.played === 0;
  return `
    <div class="qualified-row">
      <span>${row.team.flag} ${row.team.name}</span>
      <span class="status-chip ${pending ? "pending" : ""}">${pending ? "未入力" : status}</span>
    </div>
  `;
}

function renderThirdPlaces(thirdPlaces) {
  elements.thirdPlaceTable.innerHTML = renderStandingsTable(
    thirdPlaces.map((row) => ({
      ...row,
      team: {
        ...row.team,
        name: `${row.team.name} · Group ${row.groupId}`
      }
    })),
    thirdPlaces.map((row) => row.advances)
  );
}

function renderStandingsTable(standings, advances = null) {
  const hasAdvanceProjection = Array.isArray(advances);

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          ${standings
            .map((row, index) =>
              renderStandingRow(
                row,
                index,
                hasAdvanceProjection ? advances[index] : index < 2,
                hasAdvanceProjection
              )
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderStandingRow(row, index, advances, useProjectionLabel) {
  const rankLabel = useProjectionLabel && !advances ? "·" : index + 1;
  return `
    <tr class="${advances ? "advancing" : ""}">
      <td>
        <span class="rank-badge">${rankLabel}</span>
        <span class="team-cell">${row.team.flag} ${row.team.name}</span>
      </td>
      <td>${row.played}</td>
      <td>${row.won}</td>
      <td>${row.drawn}</td>
      <td>${row.lost}</td>
      <td>${row.goalsFor}</td>
      <td>${row.goalsAgainst}</td>
      <td>${formatSigned(row.goalDifference)}</td>
      <td><strong>${row.points}</strong></td>
    </tr>
  `;
}

function getSelectedGroup() {
  return GROUPS.find((group) => group.id === state.selectedGroupId) || GROUPS[0];
}

function loadResults() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch {
    return {};
  }
}

function saveResults() {
  localStorage.setItem(storageKey, JSON.stringify(state.results));
}

function randomScore() {
  const home = weightedGoal();
  const away = weightedGoal();
  return { home, away };
}

function weightedGoal() {
  const roll = Math.random();
  if (roll < 0.16) return 0;
  if (roll < 0.42) return 1;
  if (roll < 0.68) return 2;
  if (roll < 0.86) return 3;
  if (roll < 0.96) return 4;
  return 5;
}

function formatSigned(value) {
  return value > 0 ? `+${value}` : String(value);
}
