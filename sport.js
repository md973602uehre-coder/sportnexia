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


/* =========================
   LANGUAGE BUTTONS
========================= */

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
   PAGE TEXT
========================= */

function updatePageLanguage() {

  const heroTitle =
    document.querySelector(".sport-hero h1");

  const heroDescription =
    document.querySelector(".sport-hero p");

  const liveTitle =
    document.querySelector(".matches-section h2");

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

  const breakingText =
    document.getElementById(
      "breakingText"
    );


  /* =========================
     DETECT SPORT PAGE
  ========================= */

  const isCricketPage =
    document.getElementById("cricketNews") ||
    document.getElementById("cricketMatches");

  const isFootballPage =
    document.getElementById("footballNews") ||
    document.getElementById("footballMatches");


  /* =========================
     HERO
  ========================= */

  if (heroTitle) {

    if (isCricketPage) {

      heroTitle.textContent =
        t(
          "ক্রিকেট",
          "Cricket"
        );

    } else {

      heroTitle.textContent =
        t(
          "ফুটবল",
          "Football"
        );

    }

  }


  if (heroDescription) {

    if (isCricketPage) {

      heroDescription.textContent =
        t(
          "সারা বিশ্বের সর্বশেষ ক্রিকেট খবর, লাইভ স্কোর, ম্যাচ ও ফলাফল অনুসরণ করুন।",
          "Follow the latest cricket news, live scores, fixtures and results from around the world."
        );

    } else {

      heroDescription.textContent =
        t(
          "সারা বিশ্বের সর্বশেষ ফুটবল খবর, লাইভ স্কোর, ম্যাচ ও ফলাফল অনুসরণ করুন।",
          "Follow the latest football news, live scores, fixtures and results from around the world."
        );

    }

  }


  /* =========================
     LIVE TITLE
  ========================= */

  if (liveTitle) {

    if (isCricketPage) {

      liveTitle.textContent =
        t(
          "ক্রিকেট লাইভ",
          "Cricket Live"
        );

    } else {

      liveTitle.textContent =
        t(
          "ফুটবল লাইভ",
          "Football Live"
        );

    }

  }


  if (liveDescription) {

    liveDescription.textContent =
      "LIVE • UPCOMING • RESULTS";

  }


  /* =========================
     NEWS TITLE
  ========================= */

  if (newsKicker) {

    newsKicker.textContent =
      t(
        "সর্বশেষ খবর",
        "LATEST STORIES"
      );

  }


  if (newsTitle) {

    if (isCricketPage) {

      newsTitle.textContent =
        t(
          "ক্রিকেট সংবাদ",
          "Cricket News"
        );

    } else {

      newsTitle.textContent =
        t(
          "ফুটবল সংবাদ",
          "Football News"
        );

    }

  }


  /* =========================
     BREAKING DEFAULT
  ========================= */

  if (breakingText) {

    if (!breakingText.dataset.newsTitle) {

      if (isCricketPage) {

        breakingText.textContent =
          t(
            "সর্বশেষ ক্রিকেট আপডেট",
            "Latest cricket updates"
          );

      } else {

        breakingText.textContent =
          t(
            "সর্বশেষ ফুটবল আপডেট",
            "Latest football updates"
          );

      }

    }

  }

}


/* =========================
   HELPERS
========================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/[&<>'"]/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[char]));

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
        isLive ? "live" : ""
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
        isLive ? "live" : ""
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


  if (!container) return;


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
      Array.isArray(apiErrors)
        ? apiErrors.length > 0
        : apiErrors &&
          typeof apiErrors === "object"
            ? Object.keys(
                apiErrors
              ).length > 0
            : Boolean(apiErrors);


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


  if (!container) return;


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
        ) return -1;


        if (
          !aLive &&
          bLive
        ) return 1;


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
        .slice(0, 20)
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
   SPORT NEWS
========================= */

function createSportNews(news) {

  let title = "";
  let content = "";
  let image = "";


  /* =========================
     BANGLA VERSION
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
     ENGLISH VERSION
  ========================= */

  else {

    /*
      IMPORTANT:
      English version will NEVER
      fall back to Bangla text.
    */

    title =
      news.title_en ||
      "English version is not available yet.";

    content =
      news.content_en ||
      "This news is currently available in Bangla only.";

    /*
      image_url is the general/old image.
      We do NOT use image_bn here.
    */

    image =
      news.image_en ||
      news.image_url ||
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


  const isEnglishMissing =
    currentLanguage === "en" &&
    !news.title_en &&
    !news.content_en;


  return `

    <a
      href="${escapeHTML(newsLink)}"
      class="news-card news-card-link"
      aria-label="${escapeHTML(title)}"
    >

      ${
        image
          ? `

            <img
              src="${escapeHTML(image)}"
              alt="${escapeHTML(title)}"
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
            news.category ||
            "SPORTS"
          )}

        </label>


        <h3>

          ${escapeHTML(title)}

        </h3>


        <p
          ${
            isEnglishMissing
              ? 'class="english-unavailable"'
              : ""
          }
        >

          ${escapeHTML(content)}

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


  if (!container) return;


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
    .limit(6);


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


  const news =
    data || [];


  if (!news.length) {

    container.innerHTML =
      `<div class="empty">

        ${escapeHTML(
          category
        )}

        ${t(
          "সংবাদ এখানে দেখা যাবে।",
          "news will appear here."
        )}

      </div>`;

    return;

  }


  container.innerHTML =
    news
      .map(
        createSportNews
      )
      .join("");


  /* =========================
     BREAKING NEWS
  ========================= */

  const breakingText =
    document.getElementById(
      "breakingText"
    );


  if (
    breakingText &&
    news[0]
  ) {

    let breakingTitle = "";


    if (
      currentLanguage === "en"
    ) {

      breakingTitle =
        news[0].title_en ||
        "English version is not available yet.";

    } else {

      breakingTitle =
        news[0].title_bn ||
        news[0].title ||
        "";

    }


    /*
      Football and Cricket can
      both update the breaking bar.
    */

    breakingText.textContent =
      breakingTitle;

    breakingText.dataset.newsTitle =
      "true";

  }

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

    updateLanguageButtons();

    setupLanguageButtons();

    updatePageLanguage();

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
