const { createClient } = supabase;

const adminDB = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

const ADMIN_UID =
  "081ddd42-e9c0-4419-abd1-01d57c04dcf2";


/* =========================
   LOGIN SCREEN
========================= */

function showLoginScreen() {

  document.body.innerHTML = `

    <div style="
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      background:#071426;
      font-family:Arial,sans-serif;
    ">

      <div style="
        width:100%;
        max-width:430px;
        background:#fff;
        border-radius:20px;
        padding:30px;
        box-shadow:0 20px 60px rgba(0,0,0,.25);
      ">

        <h1 style="
          margin:0 0 8px;
          font-size:28px;
        ">
          SPORT<span style="color:#238cff">NEXIA</span>
        </h1>

        <p style="
          color:#6b7280;
          margin-bottom:25px;
        ">
          Admin Login
        </p>

        <label style="
          display:block;
          font-weight:700;
          margin-bottom:7px;
        ">
          Email
        </label>

        <input
          id="loginEmail"
          type="email"
          placeholder="Admin email"
          style="
            width:100%;
            padding:13px;
            border:1px solid #d8dee8;
            border-radius:10px;
            font-size:15px;
            margin-bottom:15px;
            box-sizing:border-box;
          "
        >

        <label style="
          display:block;
          font-weight:700;
          margin-bottom:7px;
        ">
          Password
        </label>

        <input
          id="loginPassword"
          type="password"
          placeholder="Password"
          style="
            width:100%;
            padding:13px;
            border:1px solid #d8dee8;
            border-radius:10px;
            font-size:15px;
            margin-bottom:18px;
            box-sizing:border-box;
          "
        >

        <button
          id="loginButton"
          style="
            width:100%;
            padding:14px;
            border:0;
            border-radius:10px;
            background:#238cff;
            color:white;
            font-size:16px;
            font-weight:800;
            cursor:pointer;
          "
        >
          Login
        </button>

        <div
          id="loginMessage"
          style="
            margin-top:15px;
            font-weight:700;
          "
        ></div>

      </div>

    </div>
  `;

  document
    .getElementById("loginButton")
    .addEventListener("click", loginAdmin);

  document
    .getElementById("loginPassword")
    .addEventListener("keydown", event => {

      if (event.key === "Enter") {
        loginAdmin();
      }

    });
}


/* =========================
   LOGIN
========================= */

async function loginAdmin() {

  const email =
    document
      .getElementById("loginEmail")
      .value
      .trim();

  const password =
    document
      .getElementById("loginPassword")
      .value;

  const message =
    document.getElementById("loginMessage");

  const button =
    document.getElementById("loginButton");

  if (!email || !password) {

    message.style.color = "#dc2626";

    message.textContent =
      "Please enter email and password.";

    return;
  }

  button.disabled = true;
  button.textContent = "Logging in...";

  const {
    data,
    error
  } =
    await adminDB.auth.signInWithPassword({
      email,
      password
    });

  if (error) {

    message.style.color = "#dc2626";

    message.textContent =
      error.message;

    button.disabled = false;
    button.textContent = "Login";

    return;
  }

  if (
    !data.user ||
    data.user.id !== ADMIN_UID
  ) {

    await adminDB.auth.signOut();

    message.style.color = "#dc2626";

    message.textContent =
      "This account is not authorized.";

    button.disabled = false;
    button.textContent = "Login";

    return;
  }

  location.reload();
}


/* =========================
   AUTH CHECK
========================= */

async function checkAdmin() {

  const {
    data: {
      session
    }
  } =
    await adminDB.auth.getSession();

  if (
    !session ||
    !session.user ||
    session.user.id !== ADMIN_UID
  ) {

    showLoginScreen();

    return false;
  }

  return true;
}


/* =========================
   LOGOUT
========================= */

async function logoutAdmin() {

  await adminDB.auth.signOut();

  location.reload();
}


/* =========================
   STATUS
========================= */

function showStatus(
  message,
  type = "success"
) {

  const box =
    document.getElementById(
      "statusMessage"
    );

  if (!box) return;

  box.textContent = message;

  box.className =
    `status-message ${
      type === "success"
        ? "status-success"
        : "status-error"
    }`;
}


/* =========================
   IMAGE PREVIEW
========================= */

function setupImagePreview(
  inputId,
  previewId
) {

  const input =
    document.getElementById(inputId);

  const preview =
    document.getElementById(previewId);

  if (!input || !preview) return;

  input.addEventListener(
    "change",
    () => {

      const file =
        input.files?.[0];

      if (!file) {

        preview.src = "";
        preview.style.display = "none";

        return;
      }

      const reader =
        new FileReader();

      reader.onload =
        event => {

          preview.src =
            event.target.result;

          preview.style.display =
            "block";
        };

      reader.readAsDataURL(file);
    }
  );
}


/* =========================
   UPLOAD IMAGE
========================= */

async function uploadImage(
  file,
  folder
) {

  if (!file) return null;

  const extension =
    file.name
      .split(".")
      .pop()
      .toLowerCase();

  const fileName =
    `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const filePath =
    `${folder}/${fileName}`;

  const {
    error
  } =
    await adminDB
      .storage
      .from("news-images")
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false
        }
      );

  if (error) {
    throw error;
  }

  const {
    data
  } =
    adminDB
      .storage
      .from("news-images")
      .getPublicUrl(filePath);

  return data.publicUrl;
}


/* =========================
   PUBLISH NEWS
========================= */

async function publishNews() {

  const button =
    document.getElementById(
      "publishButton"
    );

  const category =
    document.getElementById(
      "category"
    ).value;

  const titleBN =
    document
      .getElementById("title_bn")
      .value
      .trim();

  const contentBN =
    document
      .getElementById("content_bn")
      .value
      .trim();

  const titleEN =
    document
      .getElementById("title_en")
      .value
      .trim();

  const contentEN =
    document
      .getElementById("content_en")
      .value
      .trim();

  const imageBN =
    document.getElementById(
      "image_bn"
    ).files?.[0] || null;

  const imageEN =
    document.getElementById(
      "image_en"
    ).files?.[0] || null;


  /* VALIDATION */

  if (!titleBN) {

    showStatus(
      "বাংলা শিরোনাম লিখুন।",
      "error"
    );

    return;
  }

  if (!contentBN) {

    showStatus(
      "বাংলা নিউজ লিখুন।",
      "error"
    );

    return;
  }

  if (!titleEN) {

    showStatus(
      "English title লিখুন।",
      "error"
    );

    return;
  }

  if (!contentEN) {

    showStatus(
      "English news লিখুন।",
      "error"
    );

    return;
  }


  /* AUTH */

  const {
    data: {
      user
    }
  } =
    await adminDB.auth.getUser();

  if (
    !user ||
    user.id !== ADMIN_UID
  ) {

    showStatus(
      "Admin authentication required.",
      "error"
    );

    return;
  }


  button.disabled = true;
  button.textContent =
    "Publishing...";


  try {

    let imageBNUrl = null;
    let imageENUrl = null;


    /* BANGLA IMAGE */

    if (imageBN) {

      showStatus(
        "Uploading Bangla image...",
        "success"
      );

      imageBNUrl =
        await uploadImage(
          imageBN,
          "bangla"
        );
    }


    /* ENGLISH IMAGE */

    if (imageEN) {

      showStatus(
        "Uploading English image...",
        "success"
      );

      imageENUrl =
        await uploadImage(
          imageEN,
          "english"
        );
    }


    /* DATABASE */

    const {
      error
    } =
      await adminDB
        .from("news")
        .insert({

          category,

          /*
            Old fields are kept
            for compatibility.
          */

          title: titleBN,

          content: contentBN,

          /*
            Bengali
          */

          title_bn: titleBN,

          content_bn: contentBN,

          image_bn: imageBNUrl,

          /*
            English
          */

          title_en: titleEN,

          content_en: contentEN,

          image_en: imageENUrl,

          /*
            Old image field
            keeps Bengali image
            as fallback.
          */

          image_url: imageBNUrl

        });


    if (error) {
      throw error;
    }


    showStatus(
      "✅ বাংলা + English News সফলভাবে Publish হয়েছে!",
      "success"
    );


    /* CLEAR FORM */

    document.getElementById(
      "title_bn"
    ).value = "";

    document.getElementById(
      "content_bn"
    ).value = "";

    document.getElementById(
      "title_en"
    ).value = "";

    document.getElementById(
      "content_en"
    ).value = "";

    document.getElementById(
      "image_bn"
    ).value = "";

    document.getElementById(
      "image_en"
    ).value = "";


    const previewBN =
      document.getElementById(
        "imageBnPreview"
      );

    const previewEN =
      document.getElementById(
        "imageEnPreview"
      );


    if (previewBN) {

      previewBN.src = "";

      previewBN.style.display =
        "none";
    }


    if (previewEN) {

      previewEN.src = "";

      previewEN.style.display =
        "none";
    }


    /* REFRESH LIST */

    await loadPublishedNews();

  } catch (error) {

    console.error(
      "Publish error:",
      error
    );

    showStatus(
      error.message ||
      "News could not be published.",
      "error"
    );

  } finally {

    button.disabled = false;

    button.textContent =
      "🚀 Publish News";
  }
}


/* =========================
   LOAD PUBLISHED NEWS
========================= */

async function loadPublishedNews() {

  const list =
    document.getElementById(
      "newsList"
    );

  if (!list) return;

  list.innerHTML =
    `<div class="loading-news">
      Loading published news...
    </div>`;


  const {
    data,
    error
  } =
    await adminDB
      .from("news")
      .select(
        "id,title,title_bn,title_en,category,created_at"
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      "News list error:",
      error
    );

    list.innerHTML =
      `<div class="empty-news">
        Could not load news.
      </div>`;

    return;
  }


  const news =
    data || [];


  if (!news.length) {

    list.innerHTML =
      `<div class="empty-news">
        No published news yet.
      </div>`;

    return;
  }


  list.innerHTML =
    news
      .map(newsItem => {

        const title =
          newsItem.title_bn ||
          newsItem.title ||
          newsItem.title_en ||
          "Untitled News";


        const date =
          newsItem.created_at
            ? new Date(
                newsItem.created_at
              ).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                }
              )
            : "";


        return `

          <div
            class="admin-news-item"
          >

            <div
              class="admin-news-info"
            >

              <span
                class="admin-news-category"
              >
                ${escapeHTML(
                  newsItem.category ||
                  "SPORTS"
                )}
              </span>

              <h3>
                ${escapeHTML(title)}
              </h3>

              <div
                class="admin-news-date"
              >
                ${escapeHTML(date)}
              </div>

            </div>


            <button
              class="delete-button"
              type="button"
              onclick="deleteNews(${Number(
                newsItem.id
              )})"
            >
              🗑️ Delete
            </button>

          </div>

        `;

      })
      .join("");
}


/* =========================
   DELETE NEWS
========================= */

async function deleteNews(
  newsId
) {

  const confirmed =
    confirm(
      "এই নিউজটি কি সত্যিই Delete করতে চান?"
    );

  if (!confirmed) return;


  const {
    data: {
      user
    }
  } =
    await adminDB.auth.getUser();


  if (
    !user ||
    user.id !== ADMIN_UID
  ) {

    alert(
      "Admin authentication required."
    );

    return;
  }


  const {
    error
  } =
    await adminDB
      .from("news")
      .delete()
      .eq(
        "id",
        newsId
      );


  if (error) {

    console.error(
      "Delete error:",
      error
    );

    alert(
      "News could not be deleted."
    );

    return;
  }


  alert(
    "✅ News deleted successfully."
  );


  await loadPublishedNews();
}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

  return String(
    value ?? ""
  ).replace(
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


/* =========================
   INITIALIZE
========================= */

async function initializeAdmin() {

  const isAdmin =
    await checkAdmin();

  if (!isAdmin) return;


  const publishButton =
    document.getElementById(
      "publishButton"
    );

  const logoutButton =
    document.getElementById(
      "logoutButton"
    );


  if (publishButton) {

    publishButton.addEventListener(
      "click",
      publishNews
    );
  }


  if (logoutButton) {

    logoutButton.addEventListener(
      "click",
      logoutAdmin
    );
  }


  setupImagePreview(
    "image_bn",
    "imageBnPreview"
  );

  setupImagePreview(
    "image_en",
    "imageEnPreview"
  );


  await loadPublishedNews();
}


initializeAdmin();


/* GLOBAL */

window.deleteNews =
  deleteNews;
