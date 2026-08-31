/* ============================================================
   GERENCIADOR DE ANÚNCIOS LATERAIS
   - Suporta iframe, script, adsterra, ezoic
   - Fallback visual se o anúncio não carregar
   - Fechamento temporário (reaparece ao recarregar)
   ============================================================ */

(function() {
  'use strict';

  const AD_CONFIG = {
    ads: [
      {
        id: 'adLeft',
        type: 'iframe',   // mude para 'iframe' para teste; se preferir script, troque
        src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
        closeable: true,
        position: 'left',
        async: true       // para script, true = carrega assíncrono, false = síncrono
      },
      {
        id: 'adRight',
        type: 'iframe',
        src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
        closeable: true,
        position: 'right',
        async: true
      }
    ],
    WRAPPER_SELECTOR: '.ad-wrapper',
    AD_SIDE_SELECTOR: '.ad-side',
    CLOSE_BUTTON_SELECTOR: '.ad-close'
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
    // Mensagem de carregando
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

  function clearLoading(content) {
    const load = content.querySelector('.ad-loading');
    if (load) load.remove();
  }

  function showFallback(content, msg = 'Anúncio indisponível') {
    clearLoading(content);
    const fallback = document.createElement('span');
    fallback.className = 'ad-fallback';
    fallback.textContent = msg;
    content.appendChild(fallback);
  }

  function loadAdContent(container, ad) {
    const content = container.querySelector('.ad-content');
    if (!content) return;

    switch (ad.type) {
      case 'iframe':
        loadIframeAd(content, ad.src);
        break;
      case 'script':
        loadScriptAd(content, ad.src, ad.async !== false);
        break;
      case 'adsterra':
        // Adsterra pode ser script; use script síncrono por padrão
        loadScriptAd(content, ad.src, false);
        break;
      case 'ezoic':
        loadEzoicAd(content, ad);
        break;
      default:
        showFallback(content, 'Tipo desconhecido');
    }
  }

  function loadIframeAd(parent, src) {
    clearLoading(parent);

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
    iframe.setAttribute('loading', 'lazy');

    iframe.onload = () => {
      log('Iframe carregado com sucesso.');
    };
    iframe.onerror = () => {
      showFallback(parent, 'Falha ao carregar anúncio');
    };

    parent.appendChild(iframe);
  }

  function loadScriptAd(parent, src, async = false) {
    clearLoading(parent);

    const script = document.createElement('script');
    script.src = src;
    script.async = async; // se async false, carrega síncrono (pode bloquear, mas necessário para algumas redes)
    script.onload = () => {
      log('Script carregado.');
    };
    script.onerror = () => {
      showFallback(parent, 'Falha ao carregar script');
    };

    parent.appendChild(script);
  }

  function loadEzoicAd(parent, ad) {
    clearLoading(parent);
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
      log(`Anúncio ${container.id} fechado.`);
    });
  }

  function init() {
    if (!AD_CONFIG.ads || AD_CONFIG.ads.length === 0) {
      log('Nenhum anúncio configurado.', 'warn');
      return;
    }

    const wrapper = document.querySelector(AD_CONFIG.WRAPPER_SELECTOR);

    if (wrapper) {
      // Se já existirem anúncios, não duplicar
      const existing = wrapper.querySelectorAll(AD_CONFIG.AD_SIDE_SELECTOR).length;
      if (existing >= AD_CONFIG.ads.length) {
        log('Anúncios já existem no wrapper; ignorando criação.', 'warn');
        return;
      }

      AD_CONFIG.ads.forEach(ad => {
        const container = createAdContainer(ad);
        if (ad.position === 'right') {
          wrapper.appendChild(container);
        } else {
          wrapper.insertBefore(container, wrapper.firstChild);
        }
        loadAdContent(container, ad);
        setupCloseButton(container);
      });
    } else {
      log('Wrapper .ad-wrapper não encontrado. Usando posição fixa.', 'warn');
      AD_CONFIG.ads.forEach(ad => {
        const container = createAdContainer(ad);
        container.classList.add('ad-fixed');
        document.body.appendChild(container);
        loadAdContent(container, ad);
        setupCloseButton(container);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
