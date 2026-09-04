/* ============================================
   GERENCIADOR DE ANÚNCIOS
   Inclui:
   - Adsterra (banner fixo no rodapé)
   - Monetag Vignette (após carregamento total)
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
    // Atraso após window.load (em milissegundos)
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
   * Cria o banner fixo no rodapé (Adsterra).
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

    // Insere o script (Adsterra) dentro do contêiner
    if (ad.type === 'inline' && ad.code) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = ad.code;
      content.appendChild(script);
    }

    bar.appendChild(content);
    document.body.appendChild(bar);

    // Adiciona padding no body para o conteúdo não ficar atrás do banner
    document.body.style.paddingBottom = '100px';
  }

  /**
   * Carrega o Vignette Monetag após o carregamento total da página
   * e um pequeno atraso para não segurar a renderização.
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

    // Aguarda o evento load (página totalmente carregada)
    window.addEventListener('load', carregar);
  }

  /**
   * Inicializa os anúncios.
   * Agora chamado somente após window.load.
   */
  function init() {
    // Adsterra (rodapé)
    if (AD_CONFIG.bottomAd.enabled) {
      createBottomAd(AD_CONFIG.bottomAd);
    }

    // Monetag Vignette (com atraso pós-load)
    if (AD_CONFIG.vignette.enabled) {
      loadVignette(AD_CONFIG.vignette);
    }
  }

  // Aguarda a página inteira carregar (load) antes de iniciar os anúncios
  window.addEventListener('load', init);
})();
