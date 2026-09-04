/* ============================================
   GERENCIADOR DE ANÚNCIOS
   Inclui:
   - Adsterra (banner fixo no rodapé)
   - Monetag Vignette (com atraso para não travar)
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
    delay: 3000, // atraso em milissegundos antes de carregar (3 segundos)
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
        // Remove o anúncio da tela
        bar.remove();

        // Remove o padding extra do body para não deixar espaço vazio
        document.body.style.paddingBottom = '';

        // Rastreia fechamento (se gtag disponível)
        if (typeof gtag === 'function') {
          gtag('event', 'close_ad', { 'ad_id': ad.id });
        }
      });
      bar.appendChild(btn);
    }

    // Área do anúncio
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
   * Carrega o Vignette Monetag após um atraso (evita travar o carregamento).
   */
  function loadVignette(vignette) {
    if (!vignette.enabled) return;

    // Aguarda o tempo definido (padrão 3 segundos)
    setTimeout(function() {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = vignette.code;
      document.body.appendChild(script);
      console.log('[WhatsLink Ads] Vignette Monetag carregado (atrasado).');
    }, vignette.delay || 3000);
  }

  /**
   * Inicializa os anúncios.
   */
  function init() {
    // Banner de rodapé (Adsterra)
    if (AD_CONFIG.bottomAd.enabled) {
      createBottomAd(AD_CONFIG.bottomAd);
    }

    // Vignette (Monetag) com atraso
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
