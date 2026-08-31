/* ============================================================
   GERENCIADOR DE ANÚNCIOS (Ezoic, Adsterra, Script, Iframe)
   Versão modular e robusta
   ============================================================ */

(function() {
  'use strict';

  // ================= CONFIGURAÇÃO GERAL =================
  const AD_CONFIG = {
    // Lista de anúncios a serem criados automaticamente
    ads: [
      {
        id: 'adLeft',                       // ID do contêiner
        type: 'script',                     // 'script', 'iframe', 'ezoic', 'adsterra'
        src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
        position: 'left',                   // 'left', 'right', 'bottom', 'top' (para CSS)
        width: 160,
        height: 600,
        closeable: true,                    // exibe botão de fechar
        storageKey: 'adLeft'                // chave para controle de fechamento (apenas memória, sem persistência)
      },
      {
        id: 'adRight',
        type: 'adsterra',                   // rede Adsterra
        src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5', // substitua pelo código real da Adsterra
        position: 'right',
        width: 160,
        height: 600,
        closeable: true,
        storageKey: 'adRight'
      }
    ],

    // Classes e seletores
    AD_SIDE_SELECTOR: '.ad-side',           // classe base dos contêineres
    CLOSE_BUTTON_SELECTOR: '.ad-close',
    TARGET_ATTR: 'data-target',

    // Para Ezoic, normalmente o código é um <script> com placeholder
    EZOIC_PLACEHOLDER_ID: 'ezoic-pub-ad-placeholder-101', // exemplo; substitua pelo seu placeholder
    EZOIC_SCRIPT_SRC: 'https://www.ezojs.com/ez.min.js'   // script genérico (não use sem conta real)
  };

  // ================= FUNÇÕES AUXILIARES =================
  function log(msg, type = 'info') {
    if (type === 'warn') console.warn(`[WhatsLink Ads] ${msg}`);
    else if (type === 'error') console.error(`[WhatsLink Ads] ${msg}`);
    else console.log(`[WhatsLink Ads] ${msg}`);
  }

  function sanitizeId(id) {
    return String(id).replace(/[^a-zA-Z0-9_-]/g, '');
  }

  /**
   * Cria o elemento contêiner do anúncio lateral (ou flutuante).
   * @param {Object} ad - Configuração do anúncio
   * @returns {HTMLElement} O contêiner pronto para inserir no body
   */
  function createAdContainer(ad) {
    const div = document.createElement('div');
    div.className = `ad-side ad-${ad.position || 'left'}`;
    div.id = sanitizeId(ad.id || `ad-${Math.random().toString(36).substr(2, 6)}`);

    if (ad.width) div.style.width = `${ad.width}px`;
    if (ad.height) div.style.height = `${ad.height}px`;

    // Botão de fechar
    if (ad.closeable !== false) {
      const btn = document.createElement('button');
      btn.className = 'ad-close';
      btn.setAttribute('aria-label', 'Fechar anúncio');
      btn.setAttribute('data-target', div.id);
      btn.innerHTML = '&times;';
      div.appendChild(btn);
    }

    // Área onde o conteúdo do anúncio será inserido
    const content = document.createElement('div');
    content.className = 'ad-content';
    div.appendChild(content);

    return div;
  }

  /**
   * Carrega o anúncio de acordo com o tipo.
   * @param {HTMLElement} container - O contêiner onde o anúncio será renderizado
   * @param {Object} ad - Configuração do anúncio
   */
  function loadAdContent(container, ad) {
    const content = container.querySelector('.ad-content');
    if (!content) return;

    switch (ad.type) {
      case 'script':
        loadScriptAd(content, ad);
        break;

      case 'iframe':
        loadIframeAd(content, ad);
        break;

      case 'adsterra':
        loadAdsterraAd(content, ad);
        break;

      case 'ezoic':
        loadEzoicAd(content, ad);
        break;

      default:
        log(`Tipo de anúncio desconhecido: ${ad.type}`, 'warn');
    }
  }

  function loadScriptAd(parent, ad) {
    const script = document.createElement('script');
    script.src = ad.src;
    script.async = true;
    parent.appendChild(script);
  }

  function loadIframeAd(parent, ad) {
    const iframe = document.createElement('iframe');
    iframe.src = ad.src;
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    parent.appendChild(iframe);
  }

  function loadAdsterraAd(parent, ad) {
    // A Adsterra normalmente fornece um script com um contêiner próprio.
    // Exemplo: <script type="text/javascript" src="//www.highperformanceformat.com/..."></script>
    // Para simplificar, usamos o campo src como script.
    loadScriptAd(parent, ad);
    log('Adsterra carregado via script.', 'info');
  }

  function loadEzoicAd(parent, ad) {
    // Ezoic usa placeholders com ID e um script global. Normalmente você insere:
    // <div id="ezoic-pub-ad-placeholder-101"></div>
    // E o script da Ezoic é carregado uma vez no <head>.
    // Aqui, criamos o placeholder dinamicamente.
    const placeholder = document.createElement('div');
    placeholder.id = ad.placeholderId || AD_CONFIG.EZOIC_PLACEHOLDER_ID;
    parent.appendChild(placeholder);

    // O script da Ezoic geralmente é adicionado no <head>, mas pode ser carregado sob demanda.
    // Recomenda-se incluir o script oficial no HTML, mas deixamos uma opção para carregar dinamicamente.
    if (ad.scriptSrc && !document.querySelector(`script[src="${ad.scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = ad.scriptSrc;
      script.async = true;
      document.head.appendChild(script);
      log('Script Ezoic carregado dinamicamente.', 'info');
    } else {
      log('Ezoic placeholder criado; certifique-se de ter o script da Ezoic no head.', 'info');
    }
  }

  /**
   * Configura os eventos de fechar e rastreamento.
   * @param {HTMLElement} container - O contêiner do anúncio
   * @param {Object} ad - Configuração do anúncio
   */
  function setupCloseButton(container, ad) {
    const closeBtn = container.querySelector(AD_CONFIG.CLOSE_BUTTON_SELECTOR);
    if (!closeBtn) return;

    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      // Remove o contêiner do DOM (sem persistência, reaparece ao recarregar)
      container.remove();

      // Rastreia evento de fechamento
      if (typeof gtag === 'function') {
        gtag('event', 'close_ad', { 'ad_id': container.id });
      }

      log(`Anúncio ${container.id} fechado.`, 'info');
    });
  }

  // ================= INICIALIZAÇÃO =================
  function init() {
    if (!AD_CONFIG.ads || AD_CONFIG.ads.length === 0) {
      log('Nenhum anúncio configurado em AD_CONFIG.ads.', 'warn');
      return;
    }

    AD_CONFIG.ads.forEach(ad => {
      const container = createAdContainer(ad);
      document.body.appendChild(container);

      loadAdContent(container, ad);
      setupCloseButton(container, ad);
    });

    log('Gerenciador de anúncios iniciado.', 'info');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
