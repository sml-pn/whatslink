/* ============================================
   CONFIGURAÇÃO DOS ANÚNCIOS LATERAIS
   Duas fontes: Profitablerate e HilltopAds
   ============================================ */

const AD_CONFIG = {
  ads: [
    {
      id: 'adLeft',
      type: 'iframe', // Usando iframe para Profitablerate
      src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
      width: 300,
      height: 250,
      position: 'left',
      closeable: true
    },
    {
      id: 'adRight',
      type: 'custom', // Usando script personalizado para HilltopAds
      html: `
        <script>
(function(scelg){
var d = document,
    s = d.createElement('script'),
    l = d.scripts[d.scripts.length - 1];
s.settings = scelg || {};
s.src = "\/\/conventionalresponse.com\/b\/X.VNs\/dwGJlI0\/YJWCci\/_egmh9\/uuZdUklxkCPuTBc_zxN\/zlU\/zAMWT-MPtCNFzWMj3fNcTuMfx\/Nuwm";
s.async = true;
s.referrerPolicy = 'no-referrer-when-downgrade';
l.parentNode.insertBefore(s, l);
})({})
</script>
      `,
      width: 300,
      height: 250,
      position: 'right',
      closeable: true
    }
  ]
};

/* ============================================
   LÓGICA DE CRIAÇÃO E CARREGAMENTO
   Não precisa alterar abaixo
   ============================================ */

(function() {
  'use strict';

  function createAdContainer(ad) {
    const aside = document.createElement('aside');
    aside.className = `ad-side ad-${ad.position}`;
    aside.id = ad.id;

    const card = document.createElement('div');
    card.className = 'ad-card';

    const header = document.createElement('div');
    header.className = 'ad-header';
    header.innerHTML = '<span>Publicidade</span>';

    if (ad.closeable !== false) {
      const btn = document.createElement('button');
      btn.className = 'ad-close';
      btn.setAttribute('aria-label', 'Fechar anúncio');
      btn.innerHTML = '✕';
      btn.addEventListener('click', function() {
        aside.classList.add('closed');
        if (typeof gtag === 'function') gtag('event', 'close_ad', { 'ad_id': ad.id });
      });
      header.appendChild(btn);
    }

    card.appendChild(header);

    const content = document.createElement('div');
    content.className = 'ad-content';
    const loading = document.createElement('span');
    loading.className = 'ad-loading';
    loading.textContent = 'Carregando...';
    content.appendChild(loading);
    card.appendChild(content);

    const footer = document.createElement('div');
    footer.className = 'ad-footer';
    footer.textContent = 'Feche o anúncio no X';
    card.appendChild(footer);

    aside.appendChild(card);
    return aside;
  }

  function loadAdContent(aside, ad) {
    const content = aside.querySelector('.ad-content');
    if (!content) return;

    const loading = content.querySelector('.ad-loading');
    if (loading) loading.remove();

    switch (ad.type) {
      case 'script':
        loadScriptAd(content, ad.src);
        break;
      case 'iframe':
        loadIframeAd(content, ad.src);
        break;
      case 'custom':
        content.innerHTML = ad.html;
        break;
      default:
        content.innerHTML = '<span class="ad-fallback">Tipo de anúncio não suportado</span>';
    }
  }

  function loadScriptAd(parent, src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onerror = () => {
      parent.innerHTML = '<span class="ad-fallback">Falha ao carregar anúncio</span>';
    };
    parent.appendChild(script);
  }

  function loadIframeAd(parent, src) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.onerror = () => {
      parent.innerHTML = '<span class="ad-fallback">Falha ao carregar anúncio</span>';
    };
    parent.appendChild(iframe);
  }

  function init() {
    const wrapper = document.querySelector('.ad-wrapper');

    AD_CONFIG.ads.forEach(ad => {
      const aside = createAdContainer(ad);

      if (wrapper) {
        if (ad.position === 'right') {
          wrapper.appendChild(aside);
        } else {
          wrapper.insertBefore(aside, wrapper.firstChild);
        }
      } else {
        aside.classList.add('ad-fixed');
        document.body.appendChild(aside);
      }

      loadAdContent(aside, ad);
    });

    console.log('[WhatsLink Ads] Anúncios laterais criados.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
