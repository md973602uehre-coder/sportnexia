/* =========================================================
   SPORTNEXIA SPORTS ENGINE
   Football + Cricket
========================================================= */

const { createClient } = supabase;

const sportDB = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   HELPERS
========================================================= */

function sportEsc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}


function sportDate(value) {
  if (!value) return '';

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
}


/* =========================================================
   NEWS CARD
========================================================= */

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
              <div class="pic">
                ${icon}
              </div>
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


/* =========================================================
   OPEN NEWS
========================================================= */

function sportOpenNews(id) {

  window.location.href =
    `news.html?id=${encodeURIComponent(id)}`;

}


/* =========================================================
   CONTENT EXPAND / COLLAPSE
========================================================= */

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


/* =========================================================
   LOAD SPORTS NEWS
========================================================= */

async function loadSportNews(sport) {

  const newsContainer =
    document.getElementById(`${sport}News`);

  if (!newsContainer) return;


  newsContainer.innerHTML = `
    <div class="loading">
      Loading ${sport} news...
    </div>
  `;


  const { data, error } = await sportDB

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
      'SPORTNEXIA news error:',
      error
    );


    newsContainer.innerHTML = `
      <div class="error">
        ${sportEsc(sport)} news could not be loaded right now.
      </div>
    `;

    return;

  }


  const news = data || [];


  if (!news.length) {

    newsContainer.innerHTML = `
      <div class="empty">
        No ${sportEsc(sport)} news published yet.
      </div>
    `;

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


  /* Breaking news */

  const breakingText =
    document.getElementById('breakingText');


  if (breakingText && news[0]) {

    breakingText.textContent =
      news[0].title;

  }

}


/* =========================================================
   MATCH CARD
========================================================= */

function sportMatchCard(match, sport) {

  const icon =
    sport === 'cricket'
      ? '🏏'
      : '⚽';


  const statusClass =
    String(match.status || '')
      .toLowerCase()
      .includes('live')
        ? 'live'
        : '';


  return `

    <article class="match-card">

      <div class="match-top">

        <span class="league-name">
          ${sportEsc(match.league || sport.toUpperCase())}
        </span>

        <span class="match-status ${statusClass}">
          ${sportEsc(match.status || 'Upcoming')}
        </span>

      </div>


      <div class="teams">

        <div class="team">

          <div class="team-logo">
            ${icon}
          </div>

          ${sportEsc(match.home || 'Team A')}

        </div>


        <div class="vs">

          ${
            match.score
              ? sportEsc(match.score)
              : 'VS'
          }

        </div>


        <div class="team">

          <div class="team-logo">
            ${icon}
          </div>

          ${sportEsc(match.away || 'Team B')}

        </div>

      </div>


      <div class="match-time">

        ${sportEsc(match.time || 'Match information')}

      </div>

    </article>

  `;

}


/* =========================================================
   RENDER MATCHES
========================================================= */

function renderSportMatches(
  sport,
  matches = []
) {

  const container =
    document.getElementById(`${sport}Matches`);

  if (!container) return;


  if (!matches.length) {

    container.innerHTML = `

      <div class="empty">

        No ${sportEsc(sport)}
        matches available right now.

      </div>

    `;

    return;

  }


  container.innerHTML =
    matches
      .map(match =>
        sportMatchCard(match, sport)
      )
      .join('');

}


/* =========================================================
   EMPTY MATCH DATA
   Temporary until API is connected
========================================================= */

function loadTemporaryMatches(sport) {

  const matches = [

    {
      league:
        sport === 'football'
          ? 'Football'
          : 'Cricket',

      status:
        'Upcoming',

      home:
        'Team A',

      away:
        'Team B',

      score:
        '',

      time:
        'Match information will appear here'
    },


    {
      league:
        sport === 'football'
          ? 'Football'
          : 'Cricket',

      status:
        'Upcoming',

      home:
        'Team C',

      away:
        'Team D',

      score:
        '',

      time:
        'Match information will appear here'
    },


    {
      league:
        sport === 'football'
          ? 'Football'
          : 'Cricket',

      status:
        'Upcoming',

      home:
        'Team E',

      away:
        'Team F',

      score:
        '',

      time:
        'Match information will appear here'
    }

  ];


  renderSportMatches(
    sport,
    matches
  );

}


/* =========================================================
   PAGE INITIALIZER
========================================================= */

async function initSportPage(sport) {

  console.log(
    `SPORTNEXIA ${sport} page loaded`
  );


  /* News */

  await loadSportNews(sport);


  /* Temporary matches */

  loadTemporaryMatches(sport);

}


/* =========================================================
   AUTO DETECT PAGE
========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const path =
      window.location.pathname
        .toLowerCase();


    if (
      path.includes('football')
    ) {

      initSportPage(
        'football'
      );

      return;

    }


    if (
      path.includes('cricket')
    ) {

      initSportPage(
        'cricket'
      );

      return;

    }

  }
);


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.sportOpenNews =
  sportOpenNews;

window.renderSportMatches =
  renderSportMatches;

window.loadSportNews =
  loadSportNews;

window.initSportPage =
  initSportPage;
