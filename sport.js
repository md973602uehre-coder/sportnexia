const sportDB = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const FOOTBALL_API =
  "https://pxnnzucxekcmwanqnjhf.supabase.co/functions/v1/football-api";

const CRICKET_API =
  "https://pxnnzucxekcmwanqnjhf.supabase.co/functions/v1/cricket-api";


/* =========================
   HELPERS
========================= */

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[char]));
}


function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}


/* =========================
   FOOTBALL MATCH CARD
========================= */

function createFootballMatch(match) {

  const fixture = match.fixture || {};
  const teams = match.teams || {};
  const goals = match.goals || {};
  const league = match.league || {};
  const status = fixture.status || {};

  const home = teams.home || {};
  const away = teams.away || {};

  const homeScore =
    goals.home !== null &&
    goals.home !== undefined
      ? goals.home
      : "-";

  const awayScore =
    goals.away !== null &&
    goals.away !== undefined
      ? goals.away
      : "-";

  const statusShort =
    status.short || "";

  const liveStatuses = [
    "1H",
    "2H",
    "ET",
    "P",
    "LIVE"
  ];

  const isLive =
    status.live === true ||
    liveStatuses.includes(statusShort);

  let statusText = "";

  if (isLive) {
    statusText =
      status.elapsed
        ? `LIVE ${status.elapsed}'`
        : "LIVE";
  } else if (statusShort === "FT") {
    statusText = "FULL TIME";
  } else if (statusShort === "HT") {
    statusText = "HALF TIME";
  } else {
    statusText =
      status.long ||
      formatDate(fixture.date) ||
      "UPCOMING";
  }

  return `
    <article class="match-card">

      <div class="match-league">
        ${escapeHTML(league.name || "Football")}
      </div>

      <div class="match-status ${isLive ? "live" : ""}">
        ${escapeHTML(statusText)}
      </div>

      <div class="teams">

        <div class="team">
          ${
            home.logo
              ? `<img
                  class="team-logo"
                  src="${escapeHTML(home.logo)}"
                  alt="${escapeHTML(home.name || "Home")}"
                >`
              : ""
          }

          <strong>
            ${escapeHTML(home.name || "Home")}
          </strong>
        </div>

        <div class="score">
          <span>${escapeHTML(homeScore)}</span>
          <span>:</span>
          <span>${escapeHTML(awayScore)}</span>
        </div>

        <div class="team">
          ${
            away.logo
              ? `<img
                  class="team-logo"
                  src="${escapeHTML(away.logo)}"
                  alt="${escapeHTML(away.name || "Away")}"
                >`
              : ""
          }

          <strong>
            ${escapeHTML(away.name || "Away")}
          </strong>
        </div>

      </div>

    </article>
  `;
}


/* =========================
   CRICKET MATCH CARD
========================= */

function createCricketMatch(match) {

  const home = match.home || {};
  const away = match.away || {};

  const status =
    String(match.status || "").toLowerCase();

  const isLive =
    status === "live" ||
    status === "in_progress" ||
    status === "in-play" ||
    status === "inplay";

  let statusText = "";

  if (isLive) {
    statusText = "LIVE";
  } else if (status === "completed") {
    statusText = "COMPLETED";
  } else {
    statusText =
      formatDate(match.kickoff_utc) ||
      "UPCOMING";
  }

  const homeScore =
    match.score?.home ??
    match.home_score ??
    "-";

  const awayScore =
    match.score?.away ??
    match.away_score ??
    "-";

  return `
    <article class="match-card cricket-match-card">

      <div class="match-league">
        ${escapeHTML(
          match.league?.name ||
          match.league_name ||
          "Cricket"
        )}
      </div>

      <div class="match-status ${isLive ? "live" : ""}">
        ${escapeHTML(statusText)}
      </div>

      <div class="teams">

        <div class="team">

          ${
            home.logo_url
              ? `<img
                  class="team-logo"
                  src="${escapeHTML(home.logo_url)}"
                  alt="${escapeHTML(home.name || "Home")}"
                >`
              : ""
          }

          <strong>
            ${escapeHTML(
              home.short_name ||
              home.name ||
              "Home"
            )}
          </strong>

        </div>

        <div class="score">

          <span>
            ${escapeHTML(homeScore)}
          </span>

          <span>:</span>

          <span>
            ${escapeHTML(awayScore)}
          </span>

        </div>

        <div class="team">

          ${
            away.logo_url
              ? `<img
                  class="team-logo"
                  src="${escapeHTML(away.logo_url)}"
                  alt="${escapeHTML(away.name || "Away")}"
                >`
              : ""
          }

          <strong>
            ${escapeHTML(
              away.short_name ||
              away.name ||
              "Away"
            )}
          </strong>

        </div>

      </div>

    </article>
  `;
}


/* =========================
   FOOTBALL MATCHES
========================= */

async function loadFootballMatches() {

  const container =
    document.getElementById("footballMatches");

  if (!container) return;

  container.innerHTML =
    `<div class="loading">Loading football matches...</div>`;

  try {

    const response =
      await fetch(FOOTBALL_API);

    const data =
      await response.json();

    const apiErrors =
      data.errors;

    const hasApiErrors =
      Array.isArray(apiErrors)
        ? apiErrors.length > 0
        : apiErrors &&
          typeof apiErrors === "object"
            ? Object.keys(apiErrors).length > 0
            : Boolean(apiErrors);

    if (data.error || hasApiErrors) {
      throw new Error(
        data.error ||
        JSON.stringify(data.errors)
      );
    }

    const matches =
      Array.isArray(data.response)
        ? data.response
        : [];

    if (!matches.length) {

      container.innerHTML =
        `<div class="empty">
          No live football matches right now.
        </div>`;

      return;
    }

    container.innerHTML =
      matches
        .map(createFootballMatch)
        .join("");

  } catch (error) {

    console.error(
      "Football API error:",
      error
    );

    container.innerHTML =
      `<div class="error">
        Football matches could not be loaded.
      </div>`;
  }
}


/* =========================
   CRICKET MATCHES
========================= */

async function loadCricketMatches() {

  const container =
    document.getElementById("cricketMatches");

  if (!container) return;

  container.innerHTML =
    `<div class="loading">Loading cricket matches...</div>`;

  try {

    const response =
      await fetch(CRICKET_API);

    const data =
      await response.json();

    if (!response.ok || data.error) {
      throw new Error(
        data.error ||
        "Cricket API request failed"
      );
    }

    const matches =
      Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

    if (!matches.length) {

      container.innerHTML =
        `<div class="empty">
          No cricket matches available.
        </div>`;

      return;
    }

    /*
      Live matches first,
      then upcoming matches.
    */

    matches.sort((a, b) => {

      const aLive =
        ["live", "in_progress", "in-play", "inplay"]
          .includes(
            String(a.status || "").toLowerCase()
          );

      const bLive =
        ["live", "in_progress", "in-play", "inplay"]
          .includes(
            String(b.status || "").toLowerCase()
          );

      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;

      return (
        new Date(a.kickoff_utc || 0) -
        new Date(b.kickoff_utc || 0)
      );
    });

    container.innerHTML =
      matches
        .slice(0, 20)
        .map(createCricketMatch)
        .join("");

  } catch (error) {

    console.error(
      "Cricket API error:",
      error
    );

    container.innerHTML =
      `<div class="error">
        Cricket matches could not be loaded.
      </div>`;
  }
}


/* =========================
   SPORT NEWS
========================= */

function createSportNews(news) {

  return `
    <article class="news-card">

      ${
        news.image_url
          ? `
            <img
              src="${escapeHTML(news.image_url)}"
              alt="${escapeHTML(news.title)}"
              loading="lazy"
            >
          `
          : `
            <div class="pic">
              ${
                (news.category || "")
                  .toLowerCase()
                  .includes("cricket")
                  ? "🏏"
                  : "⚽"
              }
            </div>
          `
      }

      <div class="pad">

        <label>
          ${escapeHTML(
            news.category || "SPORTS"
          )}
        </label>

        <h3>
          ${escapeHTML(news.title)}
        </h3>

        <p>
          ${escapeHTML(news.content || "")}
        </p>

        <small>
          ${formatDate(news.created_at)}
          • SPORTNEXIA
        </small>

      </div>

    </article>
  `;
}


async function loadSportNews(
  category,
  elementId
) {

  const container =
    document.getElementById(elementId);

  if (!container) return;

  const {
    data,
    error
  } = await sportDB
    .from("news")
    .select("*")
    .ilike("category", `%${category}%`)
    .order(
      "created_at",
      { ascending: false }
    )
    .limit(6);

  if (error) {

    console.error(
      "News loading error:",
      error
    );

    container.innerHTML =
      `<div class="error">
        News could not be loaded.
      </div>`;

    return;
  }

  const news =
    data || [];

  if (!news.length) {

    container.innerHTML =
      `<div class="empty">
        ${category} news will appear here.
      </div>`;

    return;
  }

  container.innerHTML =
    news
      .map(createSportNews)
      .join("");
}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadFootballMatches();

    loadCricketMatches();

    loadSportNews(
      "Football",
      "footballNews"
    );

    loadSportNews(
      "Cricket",
      "cricketNews"
    );

  }
);
