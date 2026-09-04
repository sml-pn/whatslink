/* ============================================
   GERENCIADOR DE ANÚNCIOS
   Inclui:
   - Anúncio lateral Adsterra (script inline original)
   - Push in-page TrafficStars
   ============================================ */

const AD_CONFIG = {
  // ================= ANÚNCIO LATERAL (ADSTERRA) =================
  ads: [
    {
      id: 'adLeft',
      type: 'inline', // script inline (executado diretamente)
      code: `
        (function(vldbts){
          var d = document,
              s = d.createElement('script'),
              l = d.scripts[d.scripts.length - 1];
          s.settings = vldbts || {};
          s.src = "\\/\\/conventionalresponse.com\\/bPXNV.s\\/diGNlJ0HYTWDcK\\/Qejmu9Mu\\/ZIUOl-kWP\\/TEcFzBNWzKUDzgMbT\\/MZtiNUzjMV3\\/NPTqMWxhNpwZ";
          s.async = true;
          s.referrerPolicy = 'no-referrer-when-downgrade';
          l.parentNode.insertBefore(s, l);
        })({})
      `,
      width: 300,
      height: 250,
      position: 'left',
      closeable: true
    }
  ],

  // ================= PUSH IN-PAGE (TRAFFICSTARS) =================
  push: {
    enabled: true,
    spot: '6eb53a7be15a452c8d40dda758e9b473',
    verticalPosition: 'bottom',
    keywords: '',
    subid: ''
  }
};

/* ============================================
   LÓGICA DE CRIAÇÃO E CARREGAMENTO
   ============================================ */

(function() {
  'use strict';

  /**
   * Cria o contêiner <aside> do anúncio lateral.
   */
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
        if (typeof gtag === 'function') {
          gtag('event', 'close_ad', { 'ad_id': ad.id });
        }
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

  /**
   * Carrega o conteúdo do anúncio lateral.
   */
  function loadAdContent(aside, ad) {
    const content = aside.querySelector('.ad-content');
    if (!content) return;

    const loading = content.querySelector('.ad-loading');
    if (loading) loading.remove();

    switch (ad.type) {
      case 'iframe':
        loadIframeAd(content, ad.src);
        break;
      case 'script':
        loadScriptAd(content, ad.src);
        break;
      case 'inline':
        loadInlineAd(content, ad.code);
        break;
      default:
        content.innerHTML = '<span class="ad-fallback">Tipo de anúncio não suportado</span>';
    }
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

  function loadScriptAd(parent, src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onerror = () => {
      parent.innerHTML = '<span class="ad-fallback">Falha ao carregar anúncio</span>';
    };
    parent.appendChild(script);
  }

  /**
   * Executa código JavaScript inline (ex.: Adsterra).
   */
  function loadInlineAd(parent, code) {
    if (!code) {
      parent.innerHTML = '<span class="ad-fallback">Código não fornecido</span>';
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = code; // conteúdo do script inline

    // Captura erros de execução (opcional)
    script.onerror = () => {
      parent.innerHTML = '<span class="ad-fallback">Falha ao executar anúncio</span>';
    };

    parent.appendChild(script);
  }

  /**
   * Inicializa os anúncios laterais.
   */
  function initSideAds() {
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

    console.log('[WhatsLink Ads] Anúncio lateral Adsterra criado.');
  }

  /**
   * Inicializa o push in-page da TrafficStars.
   */
  function initPush() {
    if (!AD_CONFIG.push.enabled) {
      console.log('[WhatsLink Ads] Push in-page desativado.');
      return;
    }

    const sdk = document.createElement('script');
    sdk.src = '//cdn.runative-syndicate.com/sdk/v1/inpage.push.js';
    sdk.async = true;
    sdk.onload = function() {
      if (typeof RnInPagePush === 'function') {
        RnInPagePush({
          spot: AD_CONFIG.push.spot,
          verticalPosition: AD_CONFIG.push.verticalPosition,
          keywords: AD_CONFIG.push.keywords || '',
          subid: AD_CONFIG.push.subid || ''
        });
        console.log('[WhatsLink Ads] Push in-page TrafficStars iniciado.');
      } else {
        console.warn('[WhatsLink Ads] RnInPagePush não está disponível.');
      }
    };
    sdk.onerror = function() {
      console.error('[WhatsLink Ads] Falha ao carregar SDK do push.');
    };

    document.head.appendChild(sdk);
  }

  /**
   * Inicializa todos os anúncios.
   */
  function init() {
    initSideAds();
    initPush();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
