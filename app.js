const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const esc = s => String(s ?? '').replace(/[&<>'"]/g,c=>({
  '&':'&amp;',
  '<':'&lt;',
  '>':'&gt;',
  "'":'&#39;',
  '"':'&quot;'
}[c]));

const dateFmt = s => new Date(s).toLocaleDateString('en-GB',{
  day:'2-digit',
  month:'short',
  year:'numeric'
}).toUpperCase();

function card(n, featured=false){
  return `
    <article class="news-card ${featured ? 'featured' : ''}">
      ${
        n.image_url
          ? `<img src="${esc(n.image_url)}" alt="${esc(n.title)}" loading="lazy">`
          : `<div class="pic">${
              n.category?.toLowerCase().includes('cricket') ? '🏏' : '⚽'
            }</div>`
      }

      <div class="pad">
        <label>${esc(n.category || 'SPORTS')}</label>

        <h3>${esc(n.title)}</h3>

        <p
          class="news-content"
          role="button"
          tabindex="0"
          aria-expanded="false"
          title="Click to read more"
        >${esc(n.content || '')}</p>

        <small>
          ${dateFmt(n.created_at)} • SPORTNEXIA
        </small>
      </div>
    </article>
  `;
}

function setupContentToggle(){

  document.querySelectorAll('.news-content').forEach(el => {

    const toggle = () => {

      el.classList.toggle('expanded');

      el.setAttribute(
        'aria-expanded',
        el.classList.contains('expanded') ? 'true' : 'false'
      );

    };

    el.addEventListener('click', toggle);

    el.addEventListener('keydown', e => {

      if(e.key === 'Enter' || e.key === ' '){

        e.preventDefault();

        toggle();

      }

    });

  });

}

async function load(){

  const { data, error } = await db
    .from('news')
    .select('*')
    .order('created_at', { ascending:false });

  if(error){

    document.getElementById('newsGrid').innerHTML =
      '<p class="error">News could not be loaded right now.</p>';

    return;

  }

  const rows = data || [];

  document.getElementById('newsGrid').innerHTML =
    rows.length
      ? rows.slice(0,9).map((n,i) => card(n,i === 0)).join('')
      : `<div class="empty">
          No news published yet.
          New SPORTNEXIA stories will appear here.
        </div>`;

  const football = rows.filter(n =>
    (n.category || '').toLowerCase().includes('football')
  );

  const cricket = rows.filter(n =>
    (n.category || '').toLowerCase().includes('cricket')
  );

  document.getElementById('footballGrid').innerHTML =
    football.length
      ? football.slice(0,6).map(n => card(n)).join('')
      : '<p class="empty">Football news will appear here.</p>';

  document.getElementById('cricketGrid').innerHTML =
    cricket.length
      ? cricket.slice(0,6).map(n => card(n)).join('')
      : '<p class="empty">Cricket news will appear here.</p>';

  if(rows[0]){
    document.getElementById('breakingText').textContent = rows[0].title;
  }

  setupContentToggle();

}

load();
