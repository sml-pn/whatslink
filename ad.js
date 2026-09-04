/* ============================================
   GERENCIADOR DE ANÚNCIOS
   Inclui:
   - Adsterra (banner fixo no rodapé)
   - Profitablerate (pop-up centralizado)
   - TrafficStars (push in-page)
   - Monetag (script global)
   ============================================ */

const AD_CONFIG = {
  // ================= ANÚNCIO POP-UP (PROFITABLERATE) =================
  popup: {
    id: 'adPopup',
    type: 'iframe',
    src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
    width: 300,
    height: 250,
    closeable: true
  },

  // ================= ANÚNCIO RODAPÉ (ADSTERRA) =================
  bottom: {
    id: 'adBottom',
    type: 'script',
    src: 'https://www.ads-terra.com/script.js', // ⚠️ substitua pelo código real da Adsterra
    height: 90,                // altura do banner de rodapé
    closeable: true
  },

  // ================= PUSH IN-PAGE (TRAFFICSTARS) =================
  push: {
    enabled: true,
    spot: '6eb53a7be15a452c8d40dda758e9b473',
    verticalPosition: 'bottom',
    keywords: '',
    subid: ''
  },

  // ================= MONETAG =================
  monetag: {
    enabled: true,
    src: 'https://quge5.com/88/tag.min.js',
    zone: '276271',
    cfasync: 'false',
    async: true
  }
};

/* ============================================
   LÓGICA DE CRIAÇÃO E CARREGAMENTO
   ============================================ */

(function() {
  'use strict';

  /**
   * Cria o contêiner do pop-up (Profitablerate).
   */
  function createPopup(ad) {
    const overlay = document.createElement('div');
    overlay.id = ad.id;
    overlay.className = 'ad-popup-overlay';

    const box = document.createElement('div');
    box.className = 'ad-popup-box';

    if (ad.closeable !== false) {
      const btn = document.createElement('button');
      btn.className = 'ad-popup-close';
      btn.innerHTML = '✕';
      btn.setAttribute('aria-label', 'Fechar anúncio');
      btn.addEventListener('click', function() {
        overlay.remove();
        if (typeof gtag === 'function') gtag('event', 'close_ad', { 'ad_id': ad.id });
      });
      box.appendChild(btn);
    }

    const content = document.createElement('div');
    content.className = 'ad-popup-content';

    if (ad.type === 'iframe') {
      const iframe = document.createElement('iframe');
      iframe.src = ad.src;
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      iframe.style.width = ad.width + 'px';
      iframe.style.height = ad.height + 'px';
      content.appendChild(iframe);
    } else if (ad.type === 'script') {
      const script = document.createElement('script');
      script.src = ad.src;
      script.async = true;
      content.appendChild(script);
    }

    box.appendChild(content);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  /**
   * Cria o contêiner do banner de rodapé (Adsterra).
   */
  function createBottom(ad) {
    const bar = document.createElement('div');
    bar.id = ad.id;
    bar.className = 'ad-bottom-bar';

    if (ad.closeable !== false) {
      const btn = document.createElement('button');
      btn.className = 'ad-bottom-close';
      btn.innerHTML = '✕';
      btn.setAttribute('aria-label', 'Fechar anúncio');
      btn.addEventListener('click', function() {
        bar.remove();
        if (typeof gtag === 'function') gtag('event', 'close_ad', { 'ad_id': ad.id });
      });
      bar.appendChild(btn);
    }

    const content = document.createElement('div');
    content.className = 'ad-bottom-content';

    if (ad.type === 'script') {
      const script = document.createElement('script');
      script.src = ad.src;
      script.async = true;
      content.appendChild(script);
    } else if (ad.type === 'iframe') {
      const iframe = document.createElement('iframe');
      iframe.src = ad.src;
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      iframe.style.width = '100%';
      iframe.style.height = ad.height + 'px';
      content.appendChild(iframe);
    }

    bar.appendChild(content);
    document.body.appendChild(bar);

    // Adiciona padding ao body para o conteúdo não ficar escondido atrás do rodapé
    document.body.style.paddingBottom = (ad.height + 20) + 'px';
  }

  /**
   * Inicializa o push in-page da TrafficStars.
   */
  function initPush() {
    if (!AD_CONFIG.push.enabled) return;

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
        console.log('[WhatsLink Ads] Push in-page iniciado.');
      }
    };
    sdk.onerror = function() {
      console.error('[WhatsLink Ads] Falha ao carregar SDK do push.');
    };
    document.head.appendChild(sdk);
  }

  /**
   * Inicializa o Monetag (script global).
   */
  function initMonetag() {
    if (!AD_CONFIG.monetag.enabled) return;

    const script = document.createElement('script');
    script.src = AD_CONFIG.monetag.src;
    script.setAttribute('data-zone', AD_CONFIG.monetag.zone);
    if (AD_CONFIG.monetag.cfasync) {
      script.setAttribute('data-cfasync', AD_CONFIG.monetag.cfasync);
    }
    if (AD_CONFIG.monetag.async !== false) {
      script.async = true;
    }
    script.onload = () => console.log('[WhatsLink Ads] Monetag carregado.');
    script.onerror = () => console.error('[WhatsLink Ads] Falha ao carregar Monetag.');
    document.head.appendChild(script);
  }

  /**
   * Inicializa todos os anúncios.
   */
  function init() {
    // Pop-up Profitablerate (aparece uma vez por carregamento)
    createPopup(AD_CONFIG.popup);

    // Banner rodapé Adsterra
    createBottom(AD_CONFIG.bottom);

    // Push in-page
    initPush();

    // Monetag
    initMonetag();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
