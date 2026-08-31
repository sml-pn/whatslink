/* ============================================================
   GERENCIADOR DE ANÚNCIOS LATERAIS (Ezoic, Adsterra, Script, Iframe)
   - Cria um anúncio para cada item em AD_CONFIG.ads
   - Posiciona automaticamente: left/right
   - Sem persistência: o anúncio reaparece ao recarregar a página
   - Suporte a fechamento pelo usuário (classe 'closed')
   ============================================================ */

(function() {
  'use strict';

  const AD_CONFIG = {
    ads: [
      {
        id: 'adLeft',
        type: 'script',
        src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
        closeable: true,
        position: 'left'   // posição: 'left' ou 'right'
      },
      {
        id: 'adRight',
        type: 'adsterra',
        src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
        closeable: true,
        position: 'right'
      }
    ],

    AD_SIDE_SELECTOR: '.ad-side',
    CLOSE_BUTTON_SELECTOR: '.ad-close',
    TARGET_ATTR: 'data-target',
    WRAPPER_SELECTOR: '.ad-wrapper'   // onde os anúncios devem ser inseridos
  };

  function log(msg, type = 'info') {
    if (type === 'warn') console.warn(`[WhatsLink Ads] ${msg}`);
    else if (type === 'error') console.error(`[WhatsLink Ads] ${msg}`);
    else console.log(`[WhatsLink Ads] ${msg}`);
  }

  function sanitizeId(id) {
    return String(id).replace(/[^a-zA-Z0-9_-]/g, '');
  }

  function createAdContainer(ad) {
    const aside = document.createElement('aside');
    aside.className = `ad-side ad-${ad.position || 'left'}`;
    aside.id = sanitizeId(ad.id || `ad-${Math.random().toString(36).substr(2, 6)}`);

    const card = document.createElement('div');
    card.className = 'ad-card';

    const header = document.createElement('div');
    header.className = 'ad-header';
    header.innerHTML = '<span>Publicidade</span>';

    if (ad.closeable !== false) {
      const btn = document.createElement('button');
      btn.className = 'ad-close';
      btn.setAttribute('aria-label', 'Fechar anúncio');
      btn.setAttribute('data-target', aside.id);
      btn.innerHTML = '✕';
      header.appendChild(btn);
    }
    card.appendChild(header);

    const content = document.createElement('div');
    content.className = 'ad-content';
    card.appendChild(content);

    const footer = document.createElement('div');
    footer.className = 'ad-footer';
    footer.textContent = 'Visível só no desktop • X fecha este lado';
    card.appendChild(footer);

    aside.appendChild(card);
    return aside;
  }

  function loadAdContent(container, ad) {
    const content = container.querySelector('.ad-content');
    if (!content) return;

    switch (ad.type) {
      case 'script': loadScriptAd(content, ad.src); break;
      case 'iframe': loadIframeAd(content, ad.src); break;
      case 'adsterra': loadAdsterraAd(content, ad.src); break;
      case 'ezoic': loadEzoicAd(content, ad); break;
      default: log(`Tipo de anúncio desconhecido: ${ad.type}`, 'warn');
    }
  }

  function loadScriptAd(parent, src) {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    parent.appendChild(s);
  }

  function loadIframeAd(parent, src) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    parent.appendChild(iframe);
  }

  function loadAdsterraAd(parent, src) {
    loadScriptAd(parent, src);
    log('Adsterra carregado via script.');
  }

  function loadEzoicAd(parent, ad) {
    const placeholder = document.createElement('div');
    placeholder.id = ad.placeholderId || 'ezoic-pub-ad-placeholder-101';
    parent.appendChild(placeholder);

    if (ad.scriptSrc && !document.querySelector(`script[src="${ad.scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = ad.scriptSrc;
      script.async = true;
      document.head.appendChild(script);
    }
  }

  function setupCloseButton(container) {
    const btn = container.querySelector(AD_CONFIG.CLOSE_BUTTON_SELECTOR);
    if (!btn) return;
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      container.classList.add('closed');
      if (typeof gtag === 'function') gtag('event', 'close_ad', { 'ad_id': container.id });
      log(`Anúncio ${container.id} fechado (temporário).`);
    });
  }

  function init() {
    if (!AD_CONFIG.ads || AD_CONFIG.ads.length === 0) return;

    const wrapper = document.querySelector(AD_CONFIG.WRAPPER_SELECTOR);
    if (!wrapper) {
      log('Wrapper .ad-wrapper não encontrado. Anúncios serão adicionados ao body.', 'warn');
      // fallback: adiciona ao body
      AD_CONFIG.ads.forEach(ad => {
        const container = createAdContainer(ad);
        document.body.appendChild(container);
        loadAdContent(container, ad);
        setupCloseButton(container);
      });
      return;
    }

    // Verifica se já existem anúncios para não duplicar
    const existing = wrapper.querySelectorAll(AD_CONFIG.AD_SIDE_SELECTOR).length;
    if (existing >= AD_CONFIG.ads.length) {
      log('Anúncios já existem no wrapper; ignorando criação.', 'warn');
      return;
    }

    AD_CONFIG.ads.forEach(ad => {
      const container = createAdContainer(ad);

      if (ad.position === 'right') {
        wrapper.appendChild(container); // último filho (direita)
      } else {
        wrapper.insertBefore(container, wrapper.firstChild); // primeiro filho (esquerda)
      }

      loadAdContent(container, ad);
      setupCloseButton(container);
    });

    log('Anúncios laterais posicionados no wrapper.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
