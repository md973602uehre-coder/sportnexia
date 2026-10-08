/* =========================================================
   SPORTNEXIA REACTIONS
   LIKE + LOVE
========================================================= */

const reactionDB = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   GET CURRENT USER
========================================================= */

async function getReactionUser() {

  const {
    data: {
      user
    }
  } = await reactionDB.auth.getUser();

  return user || null;

}


/* =========================================================
   LOAD REACTION COUNTS
========================================================= */

async function loadReactionCounts(newsId) {

  const {
    data,
    error
  } = await reactionDB
    .from('reactions')
    .select('reaction')
    .eq('news_id', newsId);


  if (error) {

    console.error(
      'Reaction loading error:',
      error
    );

    return {
      like: 0,
      love: 0
    };

  }


  const counts = {
    like: 0,
    love: 0
  };


  (data || []).forEach(item => {

    if (item.reaction === 'like') {
      counts.like++;
    }

    if (item.reaction === 'love') {
      counts.love++;
    }

  });


  return counts;

}


/* =========================================================
   CHECK USER REACTION
========================================================= */

async function getUserReaction(newsId) {

  const user =
    await getReactionUser();


  if (!user) {
    return null;
  }


  const {
    data,
    error
  } = await reactionDB

    .from('reactions')

    .select('id, reaction')

    .eq('news_id', newsId)

    .eq('user_id', user.id)

    .maybeSingle();


  if (error) {

    console.error(
      'User reaction error:',
      error
    );

    return null;

  }


  return data || null;

}


/* =========================================================
   CREATE REACTION BOX
========================================================= */

async function createReactionBox(newsId) {

  const container =
    document.getElementById(
      `reactions-${newsId}`
    );


  if (!container) return;


  const counts =
    await loadReactionCounts(
      newsId
    );


  const userReaction =
    await getUserReaction(
      newsId
    );


  container.innerHTML = `

    <div class="reaction-box">

      <button
        class="reaction-button ${
          userReaction?.reaction === 'like'
            ? 'active'
            : ''
        }"
        onclick="toggleReaction('${newsId}', 'like')"
      >

        👍

        <span class="like-count">
          ${counts.like}
        </span>

      </button>


      <button
        class="reaction-button ${
          userReaction?.reaction === 'love'
            ? 'active'
            : ''
        }"
        onclick="toggleReaction('${newsId}', 'love')"
      >

        ❤️

        <span class="love-count">
          ${counts.love}
        </span>

      </button>

    </div>

  `;

}


/* =========================================================
   TOGGLE REACTION
========================================================= */

async function toggleReaction(
  newsId,
  reactionType
) {

  const user =
    await getReactionUser();


  /*
    Login required
  */

  if (!user) {

    alert(
      'Please login to react to this post.'
    );

    return;

  }


  /*
    Check existing reaction
  */

  const existing =
    await getUserReaction(
      newsId
    );


  /*
    Same reaction = remove it
  */

  if (
    existing &&
    existing.reaction === reactionType
  ) {

    const {
      error
    } = await reactionDB

      .from('reactions')

      .delete()

      .eq('id', existing.id)

      .eq('user_id', user.id);


    if (error) {

      console.error(
        'Reaction delete error:',
        error
      );

      alert(
        'Could not remove reaction.'
      );

      return;

    }


    await createReactionBox(
      newsId
    );

    return;

  }


  /*
    Different reaction:
    remove old reaction first
  */

  if (existing) {

    const {
      error
    } = await reactionDB

      .from('reactions')

      .delete()

      .eq('id', existing.id)

      .eq('user_id', user.id);


    if (error) {

      console.error(
        'Old reaction delete error:',
        error
      );

      return;

    }

  }


  /*
    Add new reaction
  */

  const {
    error
  } = await reactionDB

    .from('reactions')

    .insert({

      news_id: Number(newsId),

      reaction: reactionType,

      user_id: user.id

    });


  if (error) {

    console.error(
      'Reaction insert error:',
      error
    );

    alert(
      'Could not save reaction.'
    );

    return;

  }


  await createReactionBox(
    newsId
  );

}


/* =========================================================
   INITIALIZE ALL REACTION BOXES
========================================================= */

async function initializeReactions() {

  const boxes =
    document.querySelectorAll(
      '[data-reaction-news-id]'
    );


  if (!boxes.length) {
    return;
  }


  for (const box of boxes) {

    const newsId =
      box.dataset.reactionNewsId;


    if (!newsId) {
      continue;
    }


    if (
      !box.id ||
      !box.id.startsWith('reactions-')
    ) {

      box.id =
        `reactions-${newsId}`;

    }


    await createReactionBox(
      newsId
    );

  }

}


/* =========================================================
   GLOBAL
========================================================= */

window.createReactionBox =
  createReactionBox;

window.toggleReaction =
  toggleReaction;

window.loadReactionCounts =
  loadReactionCounts;

window.initializeReactions =
  initializeReactions;
