const sportDB = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const FOOTBALL_API =
  "https://pxnnzucxekcmwanqnjhf.supabase.co/functions/v1/football-api";

const CRICKET_API =
  "https://pxnnzucxekcmwanqnjhf.supabase.co/functions/v1/cricket-api";


/* =========================
   LANGUAGE
========================= */

let currentLanguage =
  localStorage.getItem("sportnexiaLanguage") || "bn";


function t(bn, en) {
  return currentLanguage === "en"
    ? en
    : bn;
}


/* =========================
   LANGUAGE BUTTONS
========================= */

function updateLanguageButtons() {

  const banglaButton =
    document.getElementById("banglaButton");

  const englishButton =
    document.getElementById("englishButton");


  if (banglaButton) {

    banglaButton.classList.toggle(
      "active",
      currentLanguage === "bn"
    );

  }


  if (englishButton) {

    englishButton.classList.toggle(
      "active",
      currentLanguage === "en"
    );

  }

}


function setupLanguageButtons() {

  const banglaButton =
    document.getElementById("banglaButton");

  const englishButton =
    document.getElementById("englishButton");


  if (banglaButton) {

    banglaButton.addEventListener(
      "click",
      () => {

        currentLanguage = "bn";

        localStorage.setItem(
          "sportnexiaLanguage",
          "bn"
        );

        updateLanguageButtons();
        updatePageLanguage();
        reloadNews();

      }
    );

  }


  if (englishButton) {

    englishButton.addEventListener(
      "click",
      () => {

        currentLanguage = "en";

        localStorage.setItem(
          "sportnexiaLanguage",
          "en"
        );

        updateLanguageButtons();
        updatePageLanguage();
        reloadNews();

      }
    );

  }

}


/* =========================
   PAGE LANGUAGE
========================= */

function updatePageLanguage() {

  const heroTitle =
    document.querySelector(
      ".sport-hero h1"
    );

  const heroDescription =
    document.querySelector(
      ".sport-hero p"
    );

  const liveTitle =
    document.querySelector(
      ".matches-section h2"
    );

  const liveDescription =
    document.querySelector(
      ".matches-section .section-heading p"
    );

  const newsKicker =
    document.querySelector(
      ".football-news .hero-kicker"
    );

  const newsTitle =
    document.querySelector(
      ".football-news h2"
    );


  const cricketNewsKicker =
    document.querySelector(
      ".cricket-news .hero-kicker"
    );

  const cricketNewsTitle =
    document.querySelector(
      ".cricket-news h2"
    );


  const isCricketPage =
    document.getElementById(
      "cricketNews"
    ) ||
    document.getElementById(
      "cricketMatches"
    );


  const isFootballPage =
    document.getElementById(
      "footballNews"
    ) ||
    document.getElementById(
      "footballMatches"
    );


  /* =========================
     HERO
  ========================= */

  if (heroTitle) {

    heroTitle.textContent =
      isCricketPage
        ? t(
            "ক্রিকেট",
            "Cricket"
          )
        : t(
            "ফুটবল",
            "Football"
          );

  }


  if (heroDescription) {

    heroDescription.textContent =
      isCricketPage
        ? t(
            "সারা বিশ্বের সর্বশেষ ক্রিকেট খবর, লাইভ স্কোর, ম্যাচ ও ফলাফল অনুসরণ করুন।",
            "Follow the latest cricket news, live scores, fixtures and results from around the world."
          )
        : t(
            "সারা বিশ্বের সর্বশেষ ফুটবল খবর, লাইভ স্কোর, ম্যাচ ও ফলাফল অনুসরণ করুন।",
            "Follow the latest football news, live scores, fixtures and results from around the world."
          );

  }


  /* =========================
     LIVE
  ========================= */

  if (liveTitle) {

    liveTitle.textContent =
      isCricketPage
        ? t(
            "ক্রিকেট লাইভ",
            "Cricket Live"
          )
        : t(
            "ফুটবল লাইভ",
            "Football Live"
          );

  }


  if (liveDescription) {

    liveDescription.textContent =
      "LIVE • UPCOMING • RESULTS";

  }


  /* =========================
     FOOTBALL NEWS
  ========================= */

  if (newsKicker) {

    newsKicker.textContent =
      t(
        "সর্বশেষ খবর",
        "LATEST STORIES"
      );

  }


  if (newsTitle) {

    newsTitle.textContent =
      t(
        "ফুটবল সংবাদ",
        "Football News"
      );

  }


  /* =========================
     CRICKET NEWS
  ========================= */

  if (cricketNewsKicker) {

    cricketNewsKicker.textContent =
      t(
        "সর্বশেষ খবর",
        "LATEST STORIES"
      );

  }


  if (cricketNewsTitle) {

    cricketNewsTitle.textContent =
      t(
        "ক্রিকেট সংবাদ",
        "Cricket News"
      );

  }


  /* =========================
     BREAKING
  ========================= */

  setupBreakingTicker();

}


/* =========================
   HELPERS
========================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(
      /[&<>'"]/g,
      char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[char])
    );

}


function formatDate(dateString) {

  if (!dateString) return "";

  const date =
    new Date(dateString);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }


  return date.toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }
  );

}


/* =========================
   BREAKING TICKER STYLE
========================= */

function addBreakingTickerStyle() {

  if (
    document.getElementById(
      "sportnexiaBreakingStyle"
    )
  ) {
    return;
  }


  const style =
    document.createElement(
      "style"
    );


  style.id =
    "sportnexiaBreakingStyle";


  style.textContent = `

    .breaking-bar {
      display: flex !important;
      align-items: center !important;
      width: 100% !important;
      overflow: hidden !important;
      background: #f5f6fa !important;
      border-bottom: 1px solid #e2e5eb !important;
      height: 48px !important;
      box-sizing: border-box !important;
    }


    .breaking-label {
      flex: 0 0 auto !important;
      background: #e50914 !important;
      color: #ffffff !important;
      font-weight: 800 !important;
      font-size: 14px !important;
      padding: 14px 16px !important;
      height: 100% !important;
      display: flex !important;
      align-items: center !important;
      box-sizing: border-box !important;
      position: relative !important;
      z-index: 2 !important;
    }


    .breaking-window {
      flex: 1 !important;
      min-width: 0 !important;
      overflow: hidden !important;
      white-space: nowrap !important;
      position: relative !important;
    }


    .breaking-track {
      display: inline-flex !important;
      width: max-content !important;
      min-width: 100% !important;
      animation: sportnexiaBreakingMove 24s linear infinite !important;
      will-change: transform !important;
    }


    .breaking-track span {
      display: inline-block !important;
      padding-left: 28px !important;
      padding-right: 80px !important;
      color: #111827 !important;
      font-size: 15px !important;
      font-weight: 600 !important;
    }


    @keyframes sportnexiaBreakingMove {

      0% {
        transform: translateX(100%);
      }

      100% {
        transform: translateX(-100%);
      }

    }


    @media (max-width: 600px) {

      .breaking-bar {
        height: 44px !important;
      }


      .breaking-label {
        font-size: 12px !important;
        padding: 12px 12px !important;
      }


      .breaking-track span {
        font-size: 14px !important;
      }

    }

  `;


  document.head.appendChild(
    style
  );

}


/* =========================
   BREAKING TICKER
========================= */

function setupBreakingTicker(
  headline = ""
) {

  const breakingBar =
    document.querySelector(
      ".breaking-bar"
    );


  if (!breakingBar) {
    return;
  }


  addBreakingTickerStyle();


  let isCricket =
    Boolean(
      document.getElementById(
        "cricketNews"
      ) ||
      document.getElementById(
        "cricketMatches"
      )
    );


  let defaultText =
    isCricket
      ? t(
          "সর্বশেষ ক্রিকেট আপডেট",
          "Latest cricket updates"
        )
      : t(
          "সর্বশেষ ফুটবল আপডেট",
          "Latest football updates"
        );


  const finalHeadline =
    headline ||
    defaultText;


  breakingBar.innerHTML = `

    <div class="breaking-label">
      BREAKING
    </div>

    <div class="breaking-window">

      <div
        class="breaking-track"
        id="breakingTrack"
      >

        <span>
          ${escapeHTML(
            finalHeadline
          )}
        </span>

        <span>
          ${escapeHTML(
            finalHeadline
          )}
        </span>

      </div>

    </div>

  `;

}


/* =========================
   FOOTBALL MATCH CARD
========================= */

function createFootballMatch(match) {

  const fixture =
    match.fixture || {};

  const teams =
    match.teams || {};

  const goals =
    match.goals || {};

  const league =
    match.league || {};

  const status =
    fixture.status || {};

  const home =
    teams.home || {};

  const away =
    teams.away || {};


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
    liveStatuses.includes(
      statusShort
    );


  let statusText = "";


  if (isLive) {

    statusText =
      status.elapsed
        ? `${t(
            "লাইভ",
            "LIVE"
          )} ${status.elapsed}'`
        : t(
            "লাইভ",
            "LIVE"
          );

  } else if (
    statusShort === "FT"
  ) {

    statusText =
      t(
        "পূর্ণ সময়",
        "FULL TIME"
      );

  } else if (
    statusShort === "HT"
  ) {

    statusText =
      t(
        "হাফ টাইম",
        "HALF TIME"
      );

  } else {

    statusText =
      status.long ||
      formatDate(
        fixture.date
      ) ||
      t(
        "আসন্ন",
        "UPCOMING"
      );

  }


  return `

    <article class="match-card">

      <div class="match-league">

        ${escapeHTML(
          league.name ||
          t(
            "ফুটবল",
            "Football"
          )
        )}

      </div>


      <div class="match-status ${
        isLive
          ? "live"
          : ""
      }">

        ${escapeHTML(
          statusText
        )}

      </div>


      <div class="teams">

        <div class="team">

          ${
            home.logo
              ? `
                <img
                  class="team-logo"
                  src="${escapeHTML(
                    home.logo
                  )}"
                  alt="${escapeHTML(
                    home.name ||
                    "Home"
                  )}"
                >
              `
              : ""
          }


          <strong>

            ${escapeHTML(
              home.name ||
              t(
                "হোম",
                "Home"
              )
            )}

          </strong>

        </div>


        <div class="score">

          <span>
            ${escapeHTML(
              homeScore
            )}
          </span>

          <span>:</span>

          <span>
            ${escapeHTML(
              awayScore
            )}
          </span>

        </div>


        <div class="team">

          ${
            away.logo
              ? `
                <img
                  class="team-logo"
                  src="${escapeHTML(
                    away.logo
                  )}"
                  alt="${escapeHTML(
                    away.name ||
                    "Away"
                  )}"
                >
              `
              : ""
          }


          <strong>

            ${escapeHTML(
              away.name ||
              t(
                "অ্যাওয়ে",
                "Away"
              )
            )}

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

  const home =
    match.home || {};

  const away =
    match.away || {};


  const status =
    String(
      match.status || ""
    ).toLowerCase();


  const isLive =
    status === "live" ||
    status === "in_progress" ||
    status === "in-play" ||
    status === "inplay";


  let statusText = "";


  if (isLive) {

    statusText =
      t(
        "লাইভ",
        "LIVE"
      );

  } else if (
    status === "completed"
  ) {

    statusText =
      t(
        "সম্পন্ন",
        "COMPLETED"
      );

  } else {

    statusText =
      formatDate(
        match.kickoff_utc
      ) ||
      t(
        "আসন্ন",
        "UPCOMING"
      );

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
          t(
            "ক্রিকেট",
            "Cricket"
          )
        )}

      </div>


      <div class="match-status ${
        isLive
          ? "live"
          : ""
      }">

        ${escapeHTML(
          statusText
        )}

      </div>


      <div class="teams">

        <div class="team">

          ${
            home.logo_url
              ? `
                <img
                  class="team-logo"
                  src="${escapeHTML(
                    home.logo_url
                  )}"
                  alt="${escapeHTML(
                    home.name ||
                    "Home"
                  )}"
                >
              `
              : ""
          }


          <strong>

            ${escapeHTML(
              home.short_name ||
              home.name ||
              t(
                "হোম",
                "Home"
              )
            )}

          </strong>

        </div>


        <div class="score">

          <span>
            ${escapeHTML(
              homeScore
            )}
          </span>

          <span>:</span>

          <span>
            ${escapeHTML(
              awayScore
            )}
          </span>

        </div>


        <div class="team">

          ${
            away.logo_url
              ? `
                <img
                  class="team-logo"
                  src="${escapeHTML(
                    away.logo_url
                  )}"
                  alt="${escapeHTML(
                    away.name ||
                    "Away"
                  )}"
                >
              `
              : ""
          }


          <strong>

            ${escapeHTML(
              away.short_name ||
              away.name ||
              t(
                "অ্যাওয়ে",
                "Away"
              )
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
    document.getElementById(
      "footballMatches"
    );


  if (!container) {
    return;
  }


  container.innerHTML =
    `<div class="loading">

      ${t(
        "ফুটবল ম্যাচ লোড হচ্ছে...",
        "Loading football matches..."
      )}

    </div>`;


  try {

    const response =
      await fetch(
        FOOTBALL_API
      );


    const data =
      await response.json();


    const apiErrors =
      data.errors;


    const hasApiErrors =
      Array.isArray(
        apiErrors
      )
        ? apiErrors.length > 0
        : apiErrors &&
          typeof apiErrors === "object"
          ? Object.keys(
              apiErrors
            ).length > 0
          : Boolean(
              apiErrors
            );


    if (
      data.error ||
      hasApiErrors
    ) {

      throw new Error(
        data.error ||
        JSON.stringify(
          data.errors
        )
      );

    }


    const matches =
      Array.isArray(
        data.response
      )
        ? data.response
        : [];


    if (!matches.length) {

      container.innerHTML =
        `<div class="empty">

          ${t(
            "এই মুহূর্তে কোনো লাইভ ফুটবল ম্যাচ নেই।",
            "No live football matches right now."
          )}

        </div>`;

      return;

    }


    container.innerHTML =
      matches
        .map(
          createFootballMatch
        )
        .join("");


  } catch (error) {

    console.error(
      "Football API error:",
      error
    );


    container.innerHTML =
      `<div class="error">

        ${t(
          "ফুটবল ম্যাচ লোড করা যায়নি।",
          "Football matches could not be loaded."
        )}

      </div>`;

  }

}


/* =========================
   CRICKET MATCHES
========================= */

async function loadCricketMatches() {

  const container =
    document.getElementById(
      "cricketMatches"
    );


  if (!container) {
    return;
  }


  container.innerHTML =
    `<div class="loading">

      ${t(
        "ক্রিকেট ম্যাচ লোড হচ্ছে...",
        "Loading cricket matches..."
      )}

    </div>`;


  try {

    const response =
      await fetch(
        CRICKET_API
      );


    const data =
      await response.json();


    if (
      !response.ok ||
      data.error
    ) {

      throw new Error(
        data.error ||
        "Cricket API request failed"
      );

    }


    const matches =
      Array.isArray(
        data.data
      )
        ? data.data
        : Array.isArray(data)
          ? data
          : [];


    if (!matches.length) {

      container.innerHTML =
        `<div class="empty">

          ${t(
            "কোনো ক্রিকেট ম্যাচ পাওয়া যায়নি।",
            "No cricket matches available."
          )}

        </div>`;

      return;

    }


    matches.sort(
      (a, b) => {

        const aLive =
          [
            "live",
            "in_progress",
            "in-play",
            "inplay"
          ].includes(
            String(
              a.status || ""
            ).toLowerCase()
          );


        const bLive =
          [
            "live",
            "in_progress",
            "in-play",
            "inplay"
          ].includes(
            String(
              b.status || ""
            ).toLowerCase()
          );


        if (
          aLive &&
          !bLive
        ) {
          return -1;
        }


        if (
          !aLive &&
          bLive
        ) {
          return 1;
        }


        return (
          new Date(
            a.kickoff_utc || 0
          ) -
          new Date(
            b.kickoff_utc || 0
          )
        );

      }
    );


    container.innerHTML =
      matches
        .slice(
          0,
          20
        )
        .map(
          createCricketMatch
        )
        .join("");


  } catch (error) {

    console.error(
      "Cricket API error:",
      error
    );


    container.innerHTML =
      `<div class="error">

        ${t(
          "ক্রিকেট ম্যাচ লোড করা যায়নি।",
          "Cricket matches could not be loaded."
        )}

      </div>`;

  }

}


/* =========================
   NEWS LANGUAGE CHECK
========================= */

function hasEnglishNews(news) {

  return Boolean(
    String(
      news.title_en || ""
    ).trim() &&
    String(
      news.content_en || ""
    ).trim()
  );

}


/* =========================
   CREATE NEWS CARD
========================= */

function createSportNews(news) {

  let title = "";
  let content = "";
  let image = "";


  /* =========================
     BANGLA
  ========================= */

  if (
    currentLanguage === "bn"
  ) {

    title =
      news.title_bn ||
      news.title ||
      "";

    content =
      news.content_bn ||
      news.content ||
      "";

    image =
      news.image_bn ||
      news.image_url ||
      "";

  }


  /* =========================
     ENGLISH
  ========================= */

  else {

    /*
      IMPORTANT:
      NEVER use Bangla title,
      content or image here.
    */

    title =
      news.title_en ||
      "";

    content =
      news.content_en ||
      "";

    image =
      news.image_en ||
      "";

  }


  const newsId =
    news.id != null
      ? encodeURIComponent(
          news.id
        )
      : "";


  const newsLink =
    newsId
      ? `news.html?id=${newsId}`
      : "#";


  return `

    <a
      href="${escapeHTML(
        newsLink
      )}"
      class="news-card news-card-link"
      aria-label="${escapeHTML(
        title
      )}"
    >

      ${
        image
          ? `

            <img
              src="${escapeHTML(
                image
              )}"
              alt="${escapeHTML(
                title
              )}"
              loading="lazy"
            >

          `
          : `

            <div class="pic">

              ${
                (
                  news.category ||
                  ""
                )
                  .toLowerCase()
                  .includes(
                    "cricket"
                  )
                  ? "🏏"
                  : "⚽"
              }

            </div>

          `
      }


      <div class="pad">

        <label>

          ${escapeHTML(
            news.category ||
            "SPORTS"
          )}

        </label>


        <h3>

          ${escapeHTML(
            title
          )}

        </h3>


        <p>

          ${escapeHTML(
            content
          )}

        </p>


        <small>

          ${formatDate(
            news.created_at
          )}

          • SPORTNEXIA

        </small>

      </div>

    </a>

  `;

}


/* =========================
   LOAD SPORT NEWS
========================= */

async function loadSportNews(
  category,
  elementId
) {

  const container =
    document.getElementById(
      elementId
    );


  if (!container) {
    return;
  }


  container.innerHTML =
    `<div class="loading">

      ${t(
        "খবর লোড হচ্ছে...",
        "Loading news..."
      )}

    </div>`;


  const {
    data,
    error
  } = await sportDB
    .from("news")
    .select("*")
    .ilike(
      "category",
      `%${category}%`
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    )
    .limit(20);


  if (error) {

    console.error(
      "News loading error:",
      error
    );


    container.innerHTML =
      `<div class="error">

        ${t(
          "খবর লোড করা যায়নি।",
          "News could not be loaded."
        )}

      </div>`;

    return;

  }


  let news =
    data || [];


  /* =========================
     ENGLISH ONLY
  ========================= */

  if (
    currentLanguage === "en"
  ) {

    news =
      news.filter(
        hasEnglishNews
      );

  }


  /* =========================
     NO NEWS
  ========================= */

  if (!news.length) {

    container.innerHTML =
      `<div class="empty">

        ${
          currentLanguage === "en"
            ? `
              <strong>
                No English news available yet.
              </strong>
            `
            : `
              ${escapeHTML(
                category
              )}
              ${t(
                "সংবাদ এখানে দেখা যাবে।",
                "news will appear here."
              )}
            `
        }

      </div>`;


    /*
      English mode:
      never show Bangla headline.
    */

    setupBreakingTicker();

    return;

  }


  /* =========================
     SHOW NEWS
  ========================= */

  container.innerHTML =
    news
      .slice(
        0,
        6
      )
      .map(
        createSportNews
      )
      .join("");


  /* =========================
     BREAKING HEADLINE
  ========================= */

  const latestNews =
    news[0];


  let breakingHeadline =
    "";


  if (
    currentLanguage === "en"
  ) {

    breakingHeadline =
      latestNews.title_en ||
      "";

  } else {

    breakingHeadline =
      latestNews.title_bn ||
      latestNews.title ||
      "";

  }


  /*
    Only update breaking from
    the correct language.
  */

  setupBreakingTicker(
    breakingHeadline
  );

}


/* =========================
   RELOAD NEWS
========================= */

function reloadNews() {

  const footballNews =
    document.getElementById(
      "footballNews"
    );

  const cricketNews =
    document.getElementById(
      "cricketNews"
    );


  /*
    Reset breaking first so
    old Bangla headline cannot
    remain after language switch.
  */

  setupBreakingTicker();


  if (footballNews) {

    loadSportNews(
      "Football",
      "footballNews"
    );

  }


  if (cricketNews) {

    loadSportNews(
      "Cricket",
      "cricketNews"
    );

  }


  loadFootballMatches();

  loadCricketMatches();

}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    addBreakingTickerStyle();

    updateLanguageButtons();

    setupLanguageButtons();

    updatePageLanguage();

    setupBreakingTicker();

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
