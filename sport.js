const { createClient } = supabase;

const sportDB = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const FOOTBALL_API_URL =
  'https://pxnnzucxekcmwanqnjhf.supabase.co/functions/v1/football-api';


/* =========================
   HELPERS
========================= */

function sportEsc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}


function formatDate(value) {
  if (!value) return '';

  return new Date(value).toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  ).toUpperCase();
}


function formatTime(value) {
  if (!value) return '';

  return new Date(value).toLocaleTimeString(
    [],
    {
      hour: '2-digit',
      minute: '2-digit'
    }
  );
}


/* =========================
   NEWS
========================= */

function createNewsCard(news, sport) {

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
              <div class="pic">
                ${icon}
              </div>
            `
        }

        <div class="pad">

          <label>
            ${sportEsc(
              news.category ||
              sport.toUpperCase()
            )}
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
        >
          ${sportEsc(news.content || '')}
        </p>

        <small>
          ${formatDate(news.created_at)}
          • SPORTNEXIA
        </small>

      </div>

    </article>
  `;
}


function sportOpenNews(id) {

  window.location.href =
    `news.html?id=${encodeURIComponent(id)}`;

}


function setupNewsToggle() {

  document
    .querySelectorAll('.news-content')
    .forEach(element => {

      const toggle = () => {

        element.classList.toggle(
          'expanded'
        );

        element.setAttribute(
          'aria-expanded',
          element.classList.contains(
            'expanded'
          )
            ? 'true'
            : 'false'
        );

      };


      element.addEventListener(
        'click',
        event => {

          event.stopPropagation();

          toggle();

        }
      );


      element.addEventListener(
        'keydown',
        event => {

          if (
            event.key === 'Enter' ||
            event.key === ' '
          ) {

            event.preventDefault();

            event.stopPropagation();

            toggle();

          }

        }
      );

    });

}


/* =========================
   LOAD SPORT NEWS
========================= */

async function loadSportNews(sport) {

  const container =
    document.getElementById(
      `${sport}News`
    );

  if (!container) return;


  container.innerHTML = `
    <div class="loading">
      Loading ${sport} news...
    </div>
  `;


  const {
    data,
    error
  } = await sportDB
    .from('news')
    .select('*')
    .ilike(
      'category',
      `%${sport}%`
    )
    .order(
      'created_at',
      {
        ascending: false
      }
    );


  if (error) {

    console.error(
      'SPORTNEXIA News Error:',
      error
    );

    container.innerHTML = `
      <div class="error">
        ${sportEsc(sport)}
        news could not be loaded.
      </div>
    `;

    return;

  }


  const news =
    data || [];


  if (!news.length) {

    container.innerHTML = `
      <div class="empty">
        No ${sportEsc(sport)}
        news published yet.
      </div>
    `;

    return;

  }


  container.innerHTML =
    news
      .slice(0, 9)
      .map(
        item =>
          createNewsCard(
            item,
            sport
          )
      )
      .join('');


  setupNewsToggle();


  const breakingText =
    document.getElementById(
      'breakingText'
    );


  if (
    breakingText &&
    news[0]
  ) {

    breakingText.textContent =
      news[0].title;

  }

}


/* =========================
   FOOTBALL MATCH CARD
========================= */

function createFootballMatch(match) {

  const fixture =
    match.fixture || {};

  const teams =
    match.teams || {};

  const home =
    teams.home || {};

  const away =
    teams.away || {};

  const goals =
    match.goals || {};

  const league =
    match.league || {};

  const status =
    fixture.status || {};


  const isLive =
    status.live === true ||
    [
      '1H',
      '2H',
      'ET',
      'P',
      'LIVE'
    ].includes(
      status.short
    );


  let statusText =
    status.long ||
    'Match';


  if (isLive) {

    statusText =
      status.elapsed
        ? `LIVE ${status.elapsed}'`
        : 'LIVE';

  }


  const homeScore =
    goals.home === null ||
    goals.home === undefined
      ? '-'
      : goals.home;


  const awayScore =
    goals.away === null ||
    goals.away === undefined
      ? '-'
      : goals.away;


  return `
    <article class="match-card">

      <div class="match-top">

        <span class="league-name">

          ${
            league.logo
              ? `
                <img
                  src="${sportEsc(
                    league.logo
                  )}"
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
            league.name ||
            'Football'
          )}

        </span>


        <span
          class="match-status ${
            isLive
              ? 'live'
              : ''
          }"
        >
          ${sportEsc(
            statusText
          )}
        </span>

      </div>


      <div class="teams">


        <div class="team">

          ${
            home.logo
              ? `
                <img
                  class="team-logo"
                  src="${sportEsc(
                    home.logo
                  )}"
                  alt="${sportEsc(
                    home.name
                  )}"
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
              home.name ||
              'Home Team'
            )}
          </span>

        </div>


        <div class="vs">

          <strong>
            ${sportEsc(
              homeScore
            )}
          </strong>

          <span>
            -
          </span>

          <strong>
            ${sportEsc(
              awayScore
            )}
          </strong>

        </div>


        <div class="team">

          ${
            away.logo
              ? `
                <img
                  class="team-logo"
                  src="${sportEsc(
                    away.logo
                  )}"
                  alt="${sportEsc(
                    away.name
                  )}"
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
              away.name ||
              'Away Team'
            )}
          </span>

        </div>


      </div>


      <div class="match-time">

        ${
          isLive
            ? '🔴 LIVE NOW'
            : `
              ${formatDate(
                fixture.date
              )}
              •
              ${formatTime(
                fixture.date
              )}
            `
        }

      </div>

    </article>
  `;
}


/* =========================
   LOAD REAL FOOTBALL API
========================= */

async function loadFootballMatches() {

  const container =
    document.getElementById(
      'footballMatches'
    );

  if (!container) return;


  container.innerHTML = `
    <div class="loading">
      ⚽ Loading live football...
    </div>
  `;


  try {

    const response =
      await fetch(
        FOOTBALL_API_URL,
        {
          method: 'GET',
          cache: 'no-store'
        }
      );


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const data =
      await response.json();


    console.log(
      'SPORTNEXIA FOOTBALL DATA:',
      data
    );


    if (
      data.error ||
      data.errors
    ) {

      console.error(
        'Football API error:',
        data.error ||
        data.errors
      );

      throw new Error(
        'Football API returned an error'
      );

    }


    const matches =
      Array.isArray(
        data.response
      )
        ? data.response
        : [];


    /* NO LIVE MATCH */

    if (!matches.length) {

      container.innerHTML = `
        <div class="empty">
          ⚽ No live football
          matches right now.
        </div>
      `;

      return;

    }


    /* REAL MATCHES */

    container.innerHTML =
      matches
        .slice(0, 12)
        .map(
          match =>
            createFootballMatch(
              match
            )
        )
        .join('');


  } catch (error) {

    console.error(
      'SPORTNEXIA Football Error:',
      error
    );


    container.innerHTML = `
      <div class="error">

        ⚠️ Live football
        could not be loaded.

        <br><br>

        Please refresh
        the page and try again.

      </div>
    `;

  }

}


/* =========================
   CRICKET
========================= */

function loadCricketMatches() {

  const container =
    document.getElementById(
      'cricketMatches'
    );

  if (!container) return;


  container.innerHTML = `
    <div class="empty">

      🏏 Cricket live scores
      will be added soon.

    </div>
  `;

}


/* =========================
   INITIALIZE PAGE
========================= */

async function initSportPage(
  sport
) {

  console.log(
    `SPORTNEXIA ${sport} page started`
  );


  await loadSportNews(
    sport
  );


  if (
    sport === 'football'
  ) {

    await loadFootballMatches();

    return;

  }


  if (
    sport === 'cricket'
  ) {

    loadCricketMatches();

  }

}


/* =========================
   PAGE DETECTION
========================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const path =
      window.location.pathname
        .toLowerCase();


    if (
      path.includes(
        'football'
      )
    ) {

      initSportPage(
        'football'
      );

      return;

    }


    if (
      path.includes(
        'cricket'
      )
    ) {

      initSportPage(
        'cricket'
      );

    }

  }
);


/* =========================
   GLOBAL
========================= */

window.sportOpenNews =
  sportOpenNews;

window.loadSportNews =
  loadSportNews;

window.loadFootballMatches =
  loadFootballMatches;

window.initSportPage =
  initSportPage;
