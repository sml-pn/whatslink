const API_URL = 'https://script.google.com/macros/s/AKfycbwdPWLdfJuzb_gr3vWqn6HAGc1vb-trUWzvIZlIOC6RMmvWRxB6qbNI15gPkWnyzxoSfQ/exec';
const BASE_URL = 'https://whatslink-48tc.onrender.com/redirect.html?slug=';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function showToast(msg, icon = 'check_circle') {
  const t = $('#toast');
  if (!t) return;
  t.innerHTML = `<span class="material-icons-round">${icon}</span> ${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

function slugify(text) {
  return text.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '');
}

function extrairUrlEmbed(html) {
  if (!html) return '';
  if (html.trim().startsWith('http') && !html.includes('<')) return html.trim();
  const srcMatch = html.match(/src=["']([^"']+)["']/);
  if (srcMatch && srcMatch[1]) return srcMatch[1];
  const urlMatch = html.match(/https?:\/\/[^\s"']+/);
  if (urlMatch && urlMatch[0]) return urlMatch[0];
  return html.trim();
}

// CARROSSEL
(function carousel() {
  const track = $('#carouselTrack');
  if (!track) return;
  const cards = $$('.theme-card');
  const prev = $('#prevBtn');
  const next = $('#nextBtn');
  const dotsWrap = $('#carouselDots');
  let index = 0;
  const visible = () => window.innerWidth < 720 ? 1 : 4;
  const maxIndex = () => Math.max(0, cards.length - visible());

  cards.forEach((_, i) => {
    const d = document.createElement('span');
    if (i === 0) d.classList.add('active');
    d.addEventListener('click', () => goTo(i));
    dotsWrap?.appendChild(d);
  });
  const dots = dotsWrap ? [...dotsWrap.children] : [];

  function update() {
    const cardW = cards[0].offsetWidth + 18;
    track.style.transform = `translateX(-${index * cardW}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }
  function goTo(i) { index = Math.min(Math.max(i, 0), maxIndex()); update(); }

  prev?.addEventListener('click', () => goTo(index - 1));
  next?.addEventListener('click', () => goTo(index + 1));

  function setTheme(theme) {
    $('#tema').value = theme;
    $$('.theme-option').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
    cards.forEach(c => c.classList.toggle('active', c.dataset.theme === theme));
  }

  cards.forEach(card => {
    card.addEventListener('click', () => setTheme(card.dataset.theme));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') setTheme(card.dataset.theme); });
  });
  $$('.theme-option').forEach(btn => btn.addEventListener('click', () => setTheme(btn.dataset.theme)));

  window.addEventListener('resize', update);
  update();
})();

// MASCARA WHATSAPP
(function mask() {
  const input = $('#whatsapp');
  if (!input) return;
  input.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
      if (v.length === 11) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      else v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (v.length > 2) { v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2'); }
    else if (v.length > 0) { v = v.replace(/(\d*)/, '($1'); }
    e.target.value = v;
  });
})();

// SLUG AUTOMÁTICO
(function autoSlug() {
  const empresa = $('#empresa');
  const slug = $('#slug');
  if (!empresa || !slug) return;
  let touched = false;
  slug.addEventListener('input', () => touched = true);
  empresa.addEventListener('input', () => { if (!touched || slug.value === '') slug.value = slugify(empresa.value); });
})();

// LOCALIZAÇÃO - EXTRAÇÃO AUTOMÁTICA
(function localizacao() {
  const input = $('#localizacao');
  if (!input) return;
  input.addEventListener('paste', (e) => {
    setTimeout(() => {
      const valor = input.value;
      const urlExtraida = extrairUrlEmbed(valor);
      if (urlExtraida !== valor) { input.value = urlExtraida; showToast('Link extraído automaticamente!'); }
    }, 100);
  });
  input.addEventListener('blur', () => {
    const valor = input.value;
    const urlExtraida = extrairUrlEmbed(valor);
    if (urlExtraida !== valor) { input.value = urlExtraida; showToast('Link extraído automaticamente!'); }
  });
})();

// FORM SUBMIT
(function form() {
  const form = $('#linkForm');
  if (!form) return;
  const submitBtn = $('#submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const loader = submitBtn.querySelector('.btn-loader');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { showToast('Preencha os campos obrigatórios', 'error'); form.reportValidity(); return; }

    const localizacaoBruta = $('#localizacao').value.trim();
    const localizacao = extrairUrlEmbed(localizacaoBruta);

    const data = {
      empresa: $('#empresa').value.trim(),
      whatsapp: $('#whatsapp').value.trim().replace(/\D/g, ''),
      logo_url: $('#logoUrl').value.trim(),
      banner_url: $('#bannerUrl').value.trim(),
      mensagem: $('#mensagem').value.trim(),
      descricao: $('#descricao').value.trim(),
      localizacao: localizacao,
      instagram: $('#instagram').value.trim().replace('@', ''),
      facebook: $('#facebook').value.trim(),
      site: $('#site').value.trim(),
      horario: $('#horario').value.trim(),
      tema: $('#tema').value,
      slug: slugify($('#slug').value.trim())
    };

    submitBtn.disabled = true;
    btnText.style.opacity = '0';
    loader.style.display = 'grid';

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);

      const finalUrl = BASE_URL + data.slug;
      $('#generatedUrl').value = finalUrl;
      $('#result').style.display = 'block';
      $('#result').scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast('Link criado com sucesso!');

      $('#copyBtn').onclick = async () => {
        try { await navigator.clipboard.writeText(finalUrl); showToast('Link copiado!'); }
        catch { $('#generatedUrl').select(); document.execCommand('copy'); showToast('Link copiado!'); }
      };
      $('#previewBtn').onclick = () => window.open(finalUrl, '_blank');
      $('#shareBtn')?.addEventListener('click', async () => {
        if (navigator.share) { try { await navigator.share({ title: data.empresa, url: finalUrl }); } catch {} }
        else { $('#copyBtn').click(); }
      });

      localStorage.setItem('whatslink_last', JSON.stringify(data));

    } catch (err) {
      showToast('Erro ao criar link: ' + err.message, 'error');
    } finally {
      submitBtn.disabled = false;
      btnText.style.opacity = '1';
      loader.style.display = 'none';
    }
  });
})();
