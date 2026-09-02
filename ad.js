/* ============================================
   CONFIGURAÇÃO DOS ANÚNCIOS LATERAIS
   Duas fontes: Profitablerate e HilltopAds
   ============================================ */

const AD_CONFIG = {
  ads: [
    {
      id: 'adLeft',
      type: 'iframe', // Profitablerate via iframe
      src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
      width: 300,
      height: 250,
      position: 'left',
      closeable: true
    },
    {
      id: 'adRight',
      type: 'hilltop', // HilltopAds via script programático (tipo especial)
      src: '//conventionalresponse.com/btX.V/sSdhG/lD0/YtWGcS/mesmH9qu_ZHUglukwPQT/cFzoNGzyUxz/MDTQMftLNyzUMC3yNxTVMKxENawS',
      width: 300,
      height: 250,
      position: 'right',
      closeable: true
    }
  ]
};

/* ============================================
   LÓGICA DE CRIAÇÃO E CARREGAMENTO
   Não precisa alterar abaixo
   ============================================ */

(function() {
  'use strict';

  /**
   * Cria o contêiner <aside> do anúncio lateral com cabeçalho, área de conteúdo e rodapé.
   * @param {Object} ad - Configuração do anúncio.
   * @returns {HTMLElement} Elemento <aside> pronto para inserir no DOM.
   */
  function createAdContainer(ad) {
    const aside = document.createElement('aside');
    aside.className = `ad-side ad-${ad.position}`;
    aside.id = ad.id;

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

    // Área do anúncio (inicialmente com "Carregando...")
    const content = document.createElement('div');
    content.className = 'ad-content';
    const loading = document.createElement('span');
    loading.className = 'ad-loading';
    loading.textContent = 'Carregando...';
    content.appendChild(loading);
    card.appendChild(content);

    // Rodapé
    const footer = document.createElement('div');
    footer.className = 'ad-footer';
    footer.textContent = 'Feche o anúncio no X';
    card.appendChild(footer);

    aside.appendChild(card);
    return aside;
  }

  /**
   * Carrega o conteúdo do anúncio conforme o tipo.
   * @param {HTMLElement} aside - Elemento <aside> do anúncio.
   * @param {Object} ad - Configuração do anúncio.
   */
  function loadAdContent(aside, ad) {
    const content = aside.querySelector('.ad-content');
    if (!content) return;

    // Remove o indicador de carregamento
    const loading = content.querySelector('.ad-loading');
    if (loading) loading.remove();

    switch (ad.type) {
      case 'script':
        loadScriptAd(content, ad.src);
        break;

      case 'iframe':
        loadIframeAd(content, ad.src);
        break;

      case 'hilltop':
        loadHilltopAd(content, ad.src);
        break;

      case 'custom':
        // Somente para HTML puro (sem script)
        content.innerHTML = ad.html;
        break;

      default:
        content.innerHTML = '<span class="ad-fallback">Tipo de anúncio não suportado</span>';
    }
  }

  /**
   * Carrega anúncio via script comum.
   */
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
   * Carrega anúncio via iframe.
   */
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

  /**
   * Carrega anúncio da HilltopAds.
   * Reproduz exatamente o comportamento do código original da rede.
   */
  function loadHilltopAd(parent, src) {
    const script = document.createElement('script');

    // Configuração que a HilltopAds espera
    script.settings = {};

    // URL fornecida pela HilltopAds (pode ser protocolo relativo)
    script.src = src;
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';

    script.onerror = function() {
      console.error('[WhatsLink Ads] HilltopAds não carregou.');
      // Opcional: exibir fallback visual
      // parent.innerHTML = '<span class="ad-fallback">Falha ao carregar anúncio</span>';
    };

    // Adiciona o script ao contêiner do anúncio
    parent.appendChild(script);

    console.log('[WhatsLink Ads] Script HilltopAds adicionado.');
  }

  /**
   * Inicializa a criação e posicionamento dos anúncios.
   */
  function init() {
    const wrapper = document.querySelector('.ad-wrapper');

    AD_CONFIG.ads.forEach(ad => {
      const aside = createAdContainer(ad);

      if (wrapper) {
        // Se houver wrapper, insere na ordem correta (esquerda primeiro, direita por último)
        if (ad.position === 'right') {
          wrapper.appendChild(aside);
        } else {
          wrapper.insertBefore(aside, wrapper.firstChild);
        }
      } else {
        // Fallback: posição fixa na tela
        aside.classList.add('ad-fixed');
        document.body.appendChild(aside);
      }

      loadAdContent(aside, ad);
    });

    console.log('[WhatsLink Ads] Anúncios laterais criados.');
  }

  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
