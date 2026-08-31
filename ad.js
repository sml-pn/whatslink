/* ============================================================
   GERENCIADOR DE ANÚNCIOS LATERAIS (Ezoic, Adsterra, Script, Iframe)
   - Suporte a fechamento pelo usuário
   - Sem persistência: o anúncio reaparece ao recarregar
   ============================================================ */

(function() {
  'use strict';

  // ================= CONFIGURAÇÃO =================
  const AD_CONFIG = {
    ads: [
      {
        id: 'adLeft',                           // ID do contêiner
        type: 'script',                         // 'script', 'iframe', 'adsterra', 'ezoic'
        src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5', // substitua pelo seu código
        closeable: true                         // permite fechar
      },
      {
        id: 'adRight',
        type: 'adsterra',                       // tipo para rede Adsterra
        src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5', // substitua pelo código real
        closeable: true
      }
      // Para Ezoic, adicione:
      // { id: 'adEzoic', type: 'ezoic', closeable: true, placeholderId: 'ezoic-pub-ad-placeholder-101', scriptSrc: 'https://www.ezojs.com/ez.min.js' }
    ],

    // Seletores
    AD_SIDE_SELECTOR: '.ad-side',
    CLOSE_BUTTON_SELECTOR: '.ad-close',
    TARGET_ATTR: 'data-target'
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
   * Cria o contêiner do anúncio lateral dinamicamente.
   */
  function createAdContainer(ad) {
    const div = document.createElement('div');
    div.className = 'ad-side';
    div.id = sanitizeId(ad.id || `ad-${Math.random().toString(36).substr(2, 6)}`);

    const card = document.createElement('div');
    card.className = 'ad-card';

    // Cabeçalho com botão de fechar
    const header = document.createElement('div');
    header.className = 'ad-header';
    header.innerHTML = '<span>Publicidade</span>';

    if (ad.closeable !== false) {
      const btn = document.createElement('button');
      btn.className = 'ad-close';
      btn.setAttribute('aria-label', 'Fechar anúncio');
      btn.setAttribute('data-target', div.id);
      btn.innerHTML = '✕';
      header.appendChild(btn);
    }
    card.appendChild(header);

    // Área do anúncio
    const content = document.createElement('div');
    content.className = 'ad-content';
    card.appendChild(content);

    // Rodapé informativo (opcional)
    const footer = document.createElement('div');
    footer.className = 'ad-footer';
    footer.textContent = 'Visível só no desktop • X fecha este lado';
    card.appendChild(footer);

    div.appendChild(card);
    return div;
  }

  /**
   * Carrega o conteúdo do anúncio conforme o tipo.
   */
  function loadAdContent(container, ad) {
    const content = container.querySelector('.ad-content');
    if (!content) return;

    switch (ad.type) {
      case 'script':
        loadScriptAd(content, ad.src);
        break;
      case 'iframe':
        loadIframeAd(content, ad.src);
        break;
      case 'adsterra':
        loadAdsterraAd(content, ad.src);
        break;
      case 'ezoic':
        loadEzoicAd(content, ad);
        break;
      default:
        log(`Tipo de anúncio desconhecido: ${ad.type}`, 'warn');
    }
  }

  function loadScriptAd(parent, src) {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    parent.appendChild(script);
  }

  function loadIframeAd(parent, src) {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    parent.appendChild(iframe);
  }

  function loadAdsterraAd(parent, src) {
    // A Adsterra pode usar script ou iframe; aqui assumimos script.
    loadScriptAd(parent, src);
    log('Adsterra carregado via script.');
  }

  function loadEzoicAd(parent, ad) {
    // Ezoic normalmente requer placeholder + script global no head.
    const placeholder = document.createElement('div');
    placeholder.id = ad.placeholderId || 'ezoic-pub-ad-placeholder-101';
    parent.appendChild(placeholder);

    if (ad.scriptSrc && !document.querySelector(`script[src="${ad.scriptSrc}"]`)) {
      const script = document.createElement('script');
      script.src = ad.scriptSrc;
      script.async = true;
      document.head.appendChild(script);
      log('Script Ezoic carregado dinamicamente.');
    } else {
      log('Ezoic placeholder criado; certifique-se de ter o script da Ezoic no head.');
    }
  }

  /**
   * Configura o botão de fechar (sem persistência).
   */
  function setupCloseButton(container, ad) {
    const closeBtn = container.querySelector(AD_CONFIG.CLOSE_BUTTON_SELECTOR);
    if (!closeBtn) return;

    closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      container.classList.add('closed');

      if (typeof gtag === 'function') {
        gtag('event', 'close_ad', { 'ad_id': container.id });
      }
      log(`Anúncio ${container.id} fechado (temporário).`);
    });
  }

  // ================= INICIALIZAÇÃO =================
  function init() {
    if (!AD_CONFIG.ads || AD_CONFIG.ads.length === 0) {
      log('Nenhum anúncio configurado.', 'warn');
      return;
    }

    AD_CONFIG.ads.forEach(ad => {
      const container = createAdContainer(ad);
      document.body.appendChild(container);

      loadAdContent(container, ad);
      setupCloseButton(container, ad);
    });

    log('Gerenciador de anúncios laterais iniciado.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
