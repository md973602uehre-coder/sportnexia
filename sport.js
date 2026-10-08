const { createClient } = supabase;

const sportDB = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const FOOTBALL_API_URL =
  'https://pxnnzucxekcmwanqnjhf.supabase.co/functions/v1/football-api';

function sportEsc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]);
}

function sportDate(value) {
  if (!value) return '';

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
}

function sportTime(value) {
  if (!value) return '';

  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function sportNewsCard(news, sport) {
  const icon =
    sport === 'cricket'
      ? '🏏'
      : '⚽';

  return `
    <article class="news-card">

      <div
        class="news-click-area"
        onclick="sportOpenNews('${sportEsc(news.id)}')"
        style="cursor:pointer"
      >

        ${
          news.image_url
            ? `
              <img
                src="${sportEsc(news.image_url)}"
                alt="${sportEsc(news.title)}"
                loading="lazy"
              >
            `
            : `
              <div class="pic">${icon}</div>
            `
        }

        <div class="pad">
          <label>
            ${sportEsc(news.category || sport.toUpperCase())}
          </label>

          <h3>
            ${sportEsc(news.title)}
          </h3>
        </div>

      </div>

      <div class="pad news-text-area">

        <p
          class="news-content"
          role="button"
          tabindex="0"
          aria-expanded="false"
          title="Click to read more"
        >
          ${sportEsc(news.content || '')}
        </p>

        <small>
          ${sportDate(news.created_at)} • SPORTNEXIA
        </small>

      </div>

    </article>
  `;
}

function sportOpenNews(id) {
  window.location.href =
    `news.html?id=${encodeURIComponent(id)}`;
}

function sportSetupContentToggle() {
  document
    .querySelectorAll('.news-content')
    .forEach(element => {

      const toggle = () => {
        element.classList.toggle('expanded');

        element.setAttribute(
          'aria-expanded',
          element.classList.contains('expanded')
            ? 'true'
            : 'false'
        );
      };

      element.addEventListener('click', event => {
        event.stopPropagation();
        toggle();
      });

      element.addEventListener('keydown', event => {

        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault();
          event.stopPropagation();
          toggle();
        }

      });

    });
}

/* =========================
   SPORT NEWS
========================= */

async function loadSportNews(sport) {

  const newsContainer =
    document.getElementById(`${sport}News`);

  if (!newsContainer) return;

  newsContainer.innerHTML =
    `<div class="loading">
      Loading ${sport} news...
    </div>`;

  const {
    data,
    error
  } = await sportDB
    .from('news')
    .select('*')
    .ilike('category', `%${sport}%`)
    .order('created_at', {
      ascending: false
    });

  if (error) {

    console.error(
      'SPORTNEXIA news error:',
      error
    );

    newsContainer.innerHTML =
      `<div class="error">
        ${sportEsc(sport)}
        news could not be loaded right now.
      </div>`;

    return;
  }

  const news = data || [];

  if (!news.length) {

    newsContainer.innerHTML =
      `<div class="empty">
        No ${sportEsc(sport)}
        news published yet.
      </div>`;

    return;
  }

  newsContainer.innerHTML =
    news
      .slice(0, 9)
      .map(item =>
        sportNewsCard(item, sport)
      )
      .join('');

  sportSetupContentToggle();

  const breakingText =
    document.getElementById('breakingText');

  if (
    breakingText &&
    news[0]
  ) {
    breakingText.textContent =
      news[0].title;
  }
}

/* =========================
   FOOTBALL LIVE MATCHES
========================= */

function footballMatchCard(match) {

  const home =
    match.teams?.home || {};

  const away =
    match.teams?.away || {};

  const goals =
    match.goals || {};

  const fixture =
    match.fixture || {};

  const league =
    match.league || {};

  const status =
    match.fixture?.status || {};

  const isLive =
    status.live === true ||
    [
      '1H',
      '2H',
      'ET',
      'P',
      'LIVE'
    ].includes(status.short);

  let statusText =
    status.long ||
    'Upcoming';

  if (isLive) {

    statusText =
      status.elapsed
        ? `LIVE ${status.elapsed}'`
        : 'LIVE';

  }

  const statusClass =
    isLive
      ? 'live'
      : '';

  const homeScore =
    goals.home ?? '-';

  const awayScore =
    goals.away ?? '-';

  return `
    <article class="match-card">

      <div class="match-top">

        <span class="league-name">
          ${
            league.logo
              ? `
                <img
                  src="${sportEsc(league.logo)}"
                  alt=""
                  style="
                    width:20px;
                    height:20px;
                    object-fit:contain;
                    vertical-align:middle;
                    margin-right:6px;
                  "
                >
              `
              : ''
          }

          ${sportEsc(
            league.name || 'Football'
          )}
        </span>

        <span
          class="match-status ${statusClass}"
        >
          ${sportEsc(statusText)}
        </span>

      </div>

      <div class="teams">

        <div class="team">

          ${
            home.logo
              ? `
                <img
                  class="team-logo"
                  src="${sportEsc(home.logo)}"
                  alt="${sportEsc(home.name)}"
                  loading="lazy"
                >
              `
              : `
                <div class="team-logo">
                  ⚽
                </div>
              `
          }

          <span>
            ${sportEsc(
              home.name || 'Home'
            )}
          </span>

        </div>

        <div class="vs">

          <strong>
            ${sportEsc(homeScore)}
          </strong>

          <span style="margin:0 5px;">
            -
          </span>

          <strong>
            ${sportEsc(awayScore)}
          </strong>

        </div>

        <div class="team">

          ${
            away.logo
              ? `
                <img
                  class="team-logo"
                  src="${sportEsc(away.logo)}"
                  alt="${sportEsc(away.name)}"
                  loading="lazy"
                >
              `
              : `
                <div class="team-logo">
                  ⚽
                </div>
              `
          }

          <span>
            ${sportEsc(
              away.name || 'Away'
            )}
          </span>

        </div>

      </div>

      <div class="match-time">

        ${
          isLive
            ? '🔴 Live now'
            : `
              ${sportDate(fixture.date)}
              •
              ${sportTime(fixture.date)}
            `
        }

      </div>

    </article>
  `;
}

async function loadFootballMatches() {

  const container =
    document.getElementById(
      'footballMatches'
    );

  if (!container) return;

  container.innerHTML =
    `<div class="loading">
      Loading live football...
    </div>`;

  try {

    const response =
      await fetch(
        FOOTBALL_API_URL
      );

    if (!response.ok) {
      throw new Error(
        `API error: ${response.status}`
      );
    }

    const data =
      await response.json();

    console.log(
      'SPORTNEXIA Football API:',
      data
    );

    if (data.error) {
      throw new Error(
        data.error
      );
    }

    const matches =
      Array.isArray(data.response)
        ? data.response
        : [];

    if (!matches.length) {

      container.innerHTML =
        `
        <div class="empty">
          ⚽ No live football matches right now.
        </div>
        `;

      return;
    }

    container.innerHTML =
      matches
        .slice(0, 12)
        .map(match =>
          footballMatchCard(match)
        )
        .join('');

  } catch (error) {

    console.error(
      'Football API error:',
      error
    );

    container.innerHTML =
      `
      <div class="error">
        ⚠️ Live football could not be loaded.
        Please try again later.
      </div>
      `;
  }
}

/* =========================
   CRICKET TEMPORARY
========================= */

function loadTemporaryCricketMatches() {

  const container =
    document.getElementById(
      'cricketMatches'
    );

  if (!container) return;

  container.innerHTML =
    `
    <div class="empty">
      🏏 Cricket live scores will appear here.
    </div>
    `;
}

/* =========================
   PAGE INITIALIZATION
========================= */

async function initSportPage(sport) {

  console.log(
    `SPORTNEXIA ${sport} page loaded`
  );

  await loadSportNews(sport);

  if (sport === 'football') {

    await loadFootballMatches();

  } else if (sport === 'cricket') {

    loadTemporaryCricketMatches();

  }
}

/* =========================
   START
========================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const path =
      window.location.pathname.toLowerCase();

    if (path.includes('football')) {

      initSportPage('football');

      return;
    }

    if (path.includes('cricket')) {

      initSportPage('cricket');

      return;
    }

  }
);

/* =========================
   GLOBAL FUNCTIONS
========================= */

window.sportOpenNews =
  sportOpenNews;

window.loadSportNews =
  loadSportNews;

window.loadFootballMatches =
  loadFootballMatches;

window.initSportPage =
  initSportPage;
