/* ============================================
   GERENCIADOR DE ANÚNCIOS
   Inclui:
   - Adsterra (banner fixo no rodapé)
   - Monetag Vignette (script inline)
   ============================================ */

const AD_CONFIG = {
  // ================= ANÚNCIO RODAPÉ (ADSTERRA) =================
  bottomAd: {
    enabled: true,                // true = ativa o anúncio de rodapé
    id: 'adBottom',
    type: 'inline',               // script inline (código JavaScript real)
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
    enabled: true,                // true = ativa o Vignette da Monetag
    code: `
      (function(s){s.dataset.zone='11725719',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))
    `
  }
};

/* ============================================
   LÓGICA DE CRIAÇÃO E CARREGAMENTO
   Não precisa alterar abaixo
   ============================================ */

(function() {
  'use strict';

  /**
   * Cria o contêiner fixo do anúncio no rodapé.
   * @param {Object} ad - Configuração do anúncio de rodapé.
   */
  function createBottomAd(ad) {
    // Cria a barra fixa inferior
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
        if (typeof gtag === 'function') {
          gtag('event', 'close_ad', { 'ad_id': ad.id });
        }
      });
      bar.appendChild(btn);
    }

    // Área onde o script do anúncio será inserido
    const content = document.createElement('div');
    content.className = 'ad-bottom-content';
    bar.appendChild(content);

    // Adiciona a barra ao body
    document.body.appendChild(bar);

    // Ajusta o padding do body para o conteúdo não ficar escondido atrás do rodapé
    document.body.style.paddingBottom = '100px'; // valor estimado; ajuste se necessário

    // Carrega o script inline (Adsterra) dentro do contêiner
    if (ad.type === 'inline' && ad.code) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = ad.code;
      content.appendChild(script);
    } else if (ad.type === 'iframe' && ad.src) {
      const iframe = document.createElement('iframe');
      iframe.src = ad.src;
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      iframe.style.width = '100%';
      iframe.style.height = '90px';
      content.appendChild(iframe);
    }
  }

  /**
   * Carrega o Vignette da Monetag.
   * @param {Object} vignette - Configuração do Vignette.
   */
  function loadVignette(vignette) {
    if (!vignette.enabled) {
      console.log('[WhatsLink Ads] Vignette desativado.');
      return;
    }

    // Cria um script inline com o código fornecido
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = vignette.code;
    document.body.appendChild(script);

    console.log('[WhatsLink Ads] Vignette Monetag carregado.');
  }

  /**
   * Inicializa os anúncios.
   */
  function init() {
    // Anúncio de rodapé (Adsterra)
    if (AD_CONFIG.bottomAd && AD_CONFIG.bottomAd.enabled) {
      createBottomAd(AD_CONFIG.bottomAd);
    }

    // Vignette (Monetag)
    if (AD_CONFIG.vignette && AD_CONFIG.vignette.enabled) {
      loadVignette(AD_CONFIG.vignette);
    }
  }

  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
