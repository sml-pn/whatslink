/* ============================================
   GERENCIADOR DE ANÚNCIOS
   Inclui:
   - Adsterra (banner fixo no rodapé)
   - Monetag Vignette (após a página carregar)
   ============================================ */

const AD_CONFIG = {
  // ================= ANÚNCIO RODAPÉ (ADSTERRA) =================
  bottomAd: {
    enabled: true,
    id: 'adBottom',
    type: 'inline', // script inline (código real Adsterra)
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
    closeable: true
  },

  // ================= MONETAG VIGNETTE =================
  vignette: {
    enabled: true,
    // Usamos "load" para carregar após a página inteira estar pronta
    // e um pequeno atraso de 1,5s para não segurar o render.
    delayAfterLoad: 1500,
    code: `
      (function(s){s.dataset.zone='11725719',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
    `
  }
};

/* ============================================
   LÓGICA DE CRIAÇÃO E CARREGAMENTO
   ============================================ */

(function() {
  'use strict';

  /**
   * Cria o banner fixo no rodapé.
   */
  function createBottomAd(ad) {
    const bar = document.createElement('div');
    bar.id = ad.id;
    bar.className = 'ad-bottom-bar';

    // Botão de fechar
    if (ad.closeable !== false) {
      const btn = document.createElement('button');
      btn.className = 'ad-bottom-close';
      btn.innerHTML = '✕';
      btn.setAttribute('aria-label', 'Fechar anúncio');
      btn.addEventListener('click', function() {
        bar.remove();
        document.body.style.paddingBottom = '';
        if (typeof gtag === 'function') {
          gtag('event', 'close_ad', { 'ad_id': ad.id });
        }
      });
      bar.appendChild(btn);
    }

    const content = document.createElement('div');
    content.className = 'ad-bottom-content';

    if (ad.type === 'inline' && ad.code) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = ad.code;
      content.appendChild(script);
    }

    bar.appendChild(content);
    document.body.appendChild(bar);
    document.body.style.paddingBottom = '100px';
  }

  /**
   * Carrega o Vignette Monetag depois que a página carregou,
   * com um pequeno atraso para não atrapalhar a renderização.
   */
  function loadVignette(vignette) {
    if (!vignette.enabled) return;

    const carregar = () => {
      setTimeout(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.textContent = vignette.code;
        document.body.appendChild(script);
        console.log('[WhatsLink Ads] Vignette Monetag carregado.');
      }, vignette.delayAfterLoad || 1500);
    };

    // Se a página já estiver carregada, chama imediatamente
    if (document.readyState === 'complete') {
      carregar();
    } else {
      window.addEventListener('load', carregar);
    }
  }

  /**
   * Inicializa os anúncios.
   */
  function init() {
    if (AD_CONFIG.bottomAd.enabled) {
      createBottomAd(AD_CONFIG.bottomAd);
    }

    if (AD_CONFIG.vignette.enabled) {
      loadVignette(AD_CONFIG.vignette);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
