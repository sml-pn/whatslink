/* ============================================
   GERENCIADOR DE ANÚNCIOS
   ============================================
   Inclui:
   - Adsterra (banner fixo no rodapé)
   - Monetag Vignette (após carregamento total)

   FLUXO:
   1. Página carrega normalmente
   2. Dados do link são obtidos via API
   3. Evento 'ads:init' é disparado
   4. Verifica se já passaram 10 dias desde a criação
   5. Se sim:
      a. window.load acontece (ou já aconteceu)
      b. Adsterra é iniciado
      c. Aguarda 1,5 segundo
      d. Monetag Vignette é iniciado

   IMPORTANTE:
   - Nenhum anúncio é inserido antes de 10 dias da criação.
   - Nenhum anúncio é inserido antes do carregamento completo.
   ============================================ */

const AD_CONFIG = {

  /* ==========================================
     ANÚNCIO RODAPÉ (ADSTERRA)
     ========================================== */
  bottomAd: {
    enabled: true,
    id: 'adBottom',
    type: 'inline',

    // Código original do Adsterra
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

  /* ==========================================
     MONETAG VIGNETTE
     ========================================== */
  vignette: {
    enabled: true,

    // Tempo após window.load
    // 1500 = 1,5 segundo
    delayAfterLoad: 1500,

    // Código original da zona Monetag
    code: `
      (function(s){
        s.dataset.zone = '11725719';
        s.src = 'https://n6wxm.com/vignette.min.js';
      })(
        [document.documentElement, document.body]
          .filter(Boolean)
          .pop()
          .appendChild(
            document.createElement('script')
          )
      )
    `
  }
};

/* ============================================
   GERENCIADOR
   ============================================ */
(function() {
  'use strict';

  // Evita que os anúncios sejam inicializados
  // mais de uma vez.
  let adsInitialized = false;

  // Número de dias que o link deve ter antes de liberar anúncios
  const DIAS_ANTES_DOS_ANUNCIOS = 10;

  /* ==========================================
     VERIFICAÇÃO DE DIAS
     ========================================== */
  function podeExibirAnuncios(createdAt) {
    if (!createdAt) {
      console.warn('[WhatsLink Ads] Data de criação não fornecida.');
      return false;
    }

    const agora = Date.now();
    const criadoEm = new Date(createdAt).getTime();

    if (isNaN(criadoEm)) {
      console.error('[WhatsLink Ads] Data de criação inválida:', createdAt);
      return false;
    }

    const diffDias = (agora - criadoEm) / (1000 * 60 * 60 * 24);

    console.log(
      `[WhatsLink Ads] Link criado há ${diffDias.toFixed(2)} dias.`
    );

    return diffDias >= DIAS_ANTES_DOS_ANUNCIOS;
  }

  /* ==========================================
     ADSTERRA
     ========================================== */
  function createBottomAd(ad) {
    if (document.getElementById(ad.id)) {
      console.log('[WhatsLink Ads] Adsterra já existe.');
      return;
    }

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
        document.body.style.paddingBottom = '';

        if (typeof gtag === 'function') {
          gtag('event', 'close_ad', { ad_id: ad.id });
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

    console.log('[WhatsLink Ads] Adsterra iniciado após window.load.');
  }

  /* ==========================================
     MONETAG VIGNETTE
     ========================================== */
  function loadVignette(vignette) {
    if (!vignette.enabled) {
      console.log('[WhatsLink Ads] Monetag desativado.');
      return;
    }

    const delay = Number(vignette.delayAfterLoad) || 1500;

    setTimeout(function() {
      try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.textContent = vignette.code;
        document.body.appendChild(script);

        console.log(
          '[WhatsLink Ads] Monetag Vignette iniciado após ' +
          delay + 'ms.'
        );
      } catch (error) {
        console.error('[WhatsLink Ads] Erro ao carregar Monetag:', error);
      }
    }, delay);
  }

  /* ==========================================
     INICIALIZAÇÃO DOS ANÚNCIOS
     ========================================== */
  function init(createdAt) {
    if (adsInitialized) {
      console.log('[WhatsLink Ads] Já inicializado.');
      return;
    }

    // Verifica se o link já tem a idade mínima
    if (!podeExibirAnuncios(createdAt)) {
      console.log(
        `[WhatsLink Ads] Anúncios bloqueados (menos de ${DIAS_ANTES_DOS_ANUNCIOS} dias).`
      );
      return;
    }

    adsInitialized = true;
    console.log('[WhatsLink Ads] Anúncios liberados.');

    // Adsterra
    if (AD_CONFIG.bottomAd.enabled) {
      createBottomAd(AD_CONFIG.bottomAd);
    }

    // Monetag
    if (AD_CONFIG.vignette.enabled) {
      loadVignette(AD_CONFIG.vignette);
    }
  }

  /* ==========================================
     ESCUTA O EVENTO DE DADOS DO LINK
     ========================================== */
  window.addEventListener('ads:init', function(event) {
    const detail = event.detail || {};
    const createdAt = detail.created_at;

    // Se a página já estiver carregada, inicia imediatamente
    if (document.readyState === 'complete') {
      init(createdAt);
    } else {
      // Aguarda o carregamento completo
      window.addEventListener(
        'load',
        function() {
          init(createdAt);
        },
        { once: true }
      );
    }
  });

})();
