const { createClient } = supabase;

const db = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   HELPERS
========================================================= */

const esc = s =>
  String(s ?? '').replace(/[&<>'"]/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[c]));


const dateFmt = s =>
  new Date(s).toLocaleDateString(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
  ).toUpperCase();


/* =========================================================
   NEWS CARD
========================================================= */

function card(news, featured = false) {

  return `

    <article
      class="news-card ${featured ? 'featured' : ''}"
    >

      <div
        class="news-click-area"
        onclick="openNews('${esc(news.id)}')"
        style="cursor:pointer"
      >

        ${
          news.image_url
            ? `
              <img
                src="${esc(news.image_url)}"
                alt="${esc(news.title)}"
                loading="lazy"
              >
            `
            : `
              <div class="pic">
                ${
                  (news.category || '')
                    .toLowerCase()
                    .includes('cricket')
                    ? '🏏'
                    : '⚽'
                }
              </div>
            `
        }

        <div class="pad">

          <label>
            ${esc(news.category || 'SPORTS')}
          </label>

          <h3>
            ${esc(news.title)}
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
          ${esc(news.content || '')}
        </p>


        <small>
          ${dateFmt(news.created_at)}
          • SPORTNEXIA
        </small>


        <!-- REACTIONS -->

        <div
          class="reaction-wrapper"
          id="reactions-${esc(news.id)}"
          data-reaction-news-id="${esc(news.id)}"
        >
          <div class="reaction-loading">
            Loading reactions...
          </div>
        </div>

      </div>

    </article>

  `;

}


/* =========================================================
   OPEN NEWS
========================================================= */

function openNews(id) {

  window.location.href =
    `news.html?id=${encodeURIComponent(id)}`;

}


/* =========================================================
   CONTENT TOGGLE
========================================================= */

function setupContentToggle() {

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


/* =========================================================
   LOAD REACTIONS
========================================================= */

async function setupReactions() {

  if (
    typeof initializeReactions ===
    'function'
  ) {

    await initializeReactions();

  }

}


/* =========================================================
   LOAD NEWS
========================================================= */

async function load() {

  /*
    IMPORTANT:

    Home page uses:
    #latestNews

    Older pages may use:
    #newsGrid
  */

  const newsGrid =
    document.getElementById('latestNews') ||
    document.getElementById('newsGrid');


  /*
    If this page has no news container,
    don't continue.
  */

  if (!newsGrid) return;


  /* =====================================================
     GET NEWS FROM SUPABASE
  ====================================================== */

  const {
    data,
    error
  } = await db

    .from('news')

    .select('*')

    .order(
      'created_at',
      {
        ascending: false
      }
    );


  /* =====================================================
     ERROR
  ====================================================== */

  if (error) {

    console.error(
      'SPORTNEXIA news error:',
      error
    );


    newsGrid.innerHTML = `
      <p class="error">
        News could not be loaded right now.
      </p>
    `;

    return;

  }


  const rows =
    data || [];


  /* =====================================================
     LATEST NEWS
  ====================================================== */

  newsGrid.innerHTML =

    rows.length

      ? rows
          .slice(0, 9)
          .map(
            (news, index) =>
              card(
                news,
                index === 0
              )
          )
          .join('')

      : `
        <div class="empty">
          No news published yet.
          New SPORTNEXIA stories will appear here.
        </div>
      `;


  /* =====================================================
     FOOTBALL NEWS
  ====================================================== */

  const footballGrid =
    document.getElementById(
      'footballGrid'
    );


  if (footballGrid) {

    const football =
      rows.filter(news =>
        (news.category || '')
          .toLowerCase()
          .includes('football')
      );


    footballGrid.innerHTML =

      football.length

        ? football
            .slice(0, 6)
            .map(news =>
              card(news)
            )
            .join('')

        : `
          <p class="empty">
            Football news will appear here.
          </p>
        `;

  }


  /* =====================================================
     CRICKET NEWS
  ====================================================== */

  const cricketGrid =
    document.getElementById(
      'cricketGrid'
    );


  if (cricketGrid) {

    const cricket =
      rows.filter(news =>
        (news.category || '')
          .toLowerCase()
          .includes('cricket')
      );


    cricketGrid.innerHTML =

      cricket.length

        ? cricket
            .slice(0, 6)
            .map(news =>
              card(news)
            )
            .join('')

        : `
          <p class="empty">
            Cricket news will appear here.
          </p>
        `;

  }


  /* =====================================================
     BREAKING NEWS
  ====================================================== */

  const breakingText =
    document.getElementById(
      'breakingText'
    );


  if (
    breakingText &&
    rows[0]
  ) {

    breakingText.textContent =
      rows[0].title;

  }


  /* =====================================================
     CONTENT EXPAND
  ====================================================== */

  setupContentToggle();


  /* =====================================================
     REACTIONS
  ====================================================== */

  await setupReactions();

}


/* =========================================================
   START
========================================================= */

load();
