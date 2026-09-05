/* ============================================
   GERENCIADOR DE ANÚNCIOS
   ============================================
   Inclui:
   - Adsterra (banner fixo no rodapé)
   - Monetag Vignette (após carregamento total)

   FLUXO:
   1. Página carrega normalmente
   2. Dados do link são obtidos via API
   3. Data de criação é armazenada em
      window.__whatslinkCreatedAt
   4. Evento 'ads:init' é disparado (opcional)
   5. Verifica se já passaram 10 dias desde a criação
   6. Se sim:
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
    type: 'inline', // script inline (código original Adsterra)

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
  /**
   * Verifica se o link já tem a idade mínima.
   * @param {string} createdAt - Data de criação no formato ISO.
   * @returns {boolean} True se os anúncios podem ser exibidos.
   */
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
  /**
   * Cria o banner fixo no rodapé.
   * @param {Object} ad - Configuração do anúncio.
   */
  function createBottomAd(ad) {
    // Segurança contra duplicação
    if (document.getElementById(ad.id)) {
      console.log('[WhatsLink Ads] Adsterra já existe.');
      return;
    }

    const bar = document.createElement('div');
    bar.id = ad.id;
    bar.className = 'ad-bottom-bar';

    /* ----------------------------------------
       BOTÃO FECHAR
       ---------------------------------------- */
    if (ad.closeable !== false) {
      const btn = document.createElement('button');
      btn.className = 'ad-bottom-close';
      btn.innerHTML = '✕';
      btn.setAttribute('aria-label', 'Fechar anúncio');

      btn.addEventListener('click', function() {
        bar.remove();
        document.body.style.paddingBottom = '';

        // Google Analytics
        if (typeof gtag === 'function') {
          gtag('event', 'close_ad', {
            ad_id: ad.id
          });
        }
      });

      bar.appendChild(btn);
    }

    /* ----------------------------------------
       ÁREA DO ANÚNCIO
       ---------------------------------------- */
    const content = document.createElement('div');
    content.className = 'ad-bottom-content';

    /* ----------------------------------------
       INSERE O SCRIPT DO ADSTERRA
       ---------------------------------------- */
    if (ad.type === 'inline' && ad.code) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = ad.code;
      content.appendChild(script);
    }

    bar.appendChild(content);

    /* ----------------------------------------
       ADICIONA O BANNER À PÁGINA
       ---------------------------------------- */
    document.body.appendChild(bar);

    /* ----------------------------------------
       ESPAÇO PARA O BANNER
       ---------------------------------------- */
    document.body.style.paddingBottom = '100px';

    console.log('[WhatsLink Ads] Adsterra iniciado após window.load.');
  }

  /* ==========================================
     MONETAG VIGNETTE
     ========================================== */
  /**
   * Carrega o Vignette Monetag com atraso.
   * @param {Object} vignette - Configuração do Vignette.
   */
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
          delay +
          'ms.'
        );
      } catch (error) {
        console.error(
          '[WhatsLink Ads] Erro ao carregar Monetag:',
          error
        );
      }
    }, delay);
  }

  /* ==========================================
     INICIALIZAÇÃO DOS ANÚNCIOS
     ========================================== */
  /**
   * Inicializa os anúncios se a idade do link permitir.
   * @param {string} createdAt - Data de criação do link.
   */
  function init(createdAt) {
    // Segurança contra execução duplicada
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

    /* ----------------------------------------
       1. ADSTERRA
       ---------------------------------------- */
    if (AD_CONFIG.bottomAd.enabled) {
      createBottomAd(AD_CONFIG.bottomAd);
    }

    /* ----------------------------------------
       2. MONETAG
       ---------------------------------------- */
    if (AD_CONFIG.vignette.enabled) {
      loadVignette(AD_CONFIG.vignette);
    }
  }

  /* ==========================================
     ESCUTA O EVENTO DE DADOS DO LINK
     ========================================== */
  /**
   * Tenta inicializar os anúncios a partir da
   * variável global (se já estiver definida).
   */
  function tryInitFromGlobal() {
    const createdAt = window.__whatslinkCreatedAt;
    if (createdAt) {
      // Se a página já estiver carregada, inicia; senão aguarda load
      if (document.readyState === 'complete') {
        init(createdAt);
      } else {
        window.addEventListener('load', function() {
          init(createdAt);
        }, { once: true });
      }
    }
  }

  // Escuta o evento ads:init (caso seja disparado depois)
  window.addEventListener('ads:init', function(event) {
    const detail = event.detail || {};
    const createdAt = detail.created_at || window.__whatslinkCreatedAt;

    if (document.readyState === 'complete') {
      init(createdAt);
    } else {
      window.addEventListener('load', function() {
        init(createdAt);
      }, { once: true });
    }
  });

  // Tenta iniciar imediatamente caso a variável global já exista
  tryInitFromGlobal();
})();
