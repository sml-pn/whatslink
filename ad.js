/* ============================================
   GERENCIADOR DE ANÚNCIOS
   Inclui:
   - Anúncio lateral esquerdo (Profitablerate via iframe)
   - Anúncio lateral direito (Adsterra via script)
   - Push in-page (TrafficStars)
   - Monetag (script com data-zone e data-cfasync)
   ============================================ */

const AD_CONFIG = {
  // ================= ANÚNCIOS LATERAIS =================
  ads: [
    {
      id: 'adLeft',
      type: 'iframe', // Profitablerate funciona bem via iframe
      src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
      width: 300,
      height: 250,
      position: 'left',
      closeable: true
    },
    {
      id: 'adRight',
      type: 'script', // Adsterra geralmente usa script
      // ⚠️ Substitua o src abaixo pelo código real fornecido pela Adsterra
      src: 'https://www.ads-terra.com/script.js', // PLACEHOLDER – troque pelo seu código
      width: 300,
      height: 250,
      position: 'right',
      closeable: true
    }
  ],

  // ================= PUSH IN-PAGE (TRAFFICSTARS) =================
  push: {
    enabled: true,                // true = ativa o push; false = desativa
    spot: '6eb53a7be15a452c8d40dda758e9b473',
    verticalPosition: 'bottom',   // bottom | top
    keywords: '',                 // deixe vazio ou preencha com palavras-chave
    subid: ''                     // deixe vazio ou gere dinamicamente
  },

  // ================= MONETAG =================
  monetag: {
    enabled: true,                // true = ativa o Monetag; false = desativa
    src: 'https://quge5.com/88/tag.min.js',
    zone: '276271',               // data-zone
    cfasync: 'false',             // data-cfasync
    async: true                   // atributo async
  }
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
   * Carrega o conteúdo do anúncio lateral conforme o tipo.
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
      case 'iframe':
        loadIframeAd(content, ad.src);
        break;

      case 'script':
        loadScriptAd(content, ad.src);
        break;

      default:
        content.innerHTML = '<span class="ad-fallback">Tipo de anúncio não suportado</span>';
    }
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
   * Carrega anúncio via script.
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
   * Inicializa os anúncios laterais.
   */
  function initSideAds() {
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

  /**
   * Inicializa o push in-page da TrafficStars.
   */
  function initPush() {
    // Verifica se o push está habilitado
    if (!AD_CONFIG.push.enabled) {
      console.log('[WhatsLink Ads] Push in-page desativado.');
      return;
    }

    // Carrega o SDK do push da Runative
    const sdk = document.createElement('script');
    sdk.src = '//cdn.runative-syndicate.com/sdk/v1/inpage.push.js';
    sdk.async = true;
    sdk.onload = function() {
      // Após carregar o SDK, verifica se a função RnInPagePush está disponível
      if (typeof RnInPagePush === 'function') {
        RnInPagePush({
          spot: AD_CONFIG.push.spot,
          verticalPosition: AD_CONFIG.push.verticalPosition,
          keywords: AD_CONFIG.push.keywords || '',
          subid: AD_CONFIG.push.subid || ''
        });
        console.log('[WhatsLink Ads] Push in-page iniciado.');
      } else {
        console.warn('[WhatsLink Ads] RnInPagePush não está disponível.');
      }
    };
    sdk.onerror = function() {
      console.error('[WhatsLink Ads] Falha ao carregar SDK do push.');
    };

    // Adiciona o SDK ao head
    document.head.appendChild(sdk);
  }

  /**
   * Inicializa o Monetag (script com data-zone e data-cfasync).
   */
  function initMonetag() {
    // Verifica se o Monetag está habilitado
    if (!AD_CONFIG.monetag.enabled) {
      console.log('[WhatsLink Ads] Monetag desativado.');
      return;
    }

    // Cria o elemento <script>
    const script = document.createElement('script');
    script.src = AD_CONFIG.monetag.src;

    // Define data-zone (obrigatório para Monetag)
    script.setAttribute('data-zone', AD_CONFIG.monetag.zone);

    // Define data-cfasync (opcional, mas recomendado)
    if (AD_CONFIG.monetag.cfasync) {
      script.setAttribute('data-cfasync', AD_CONFIG.monetag.cfasync);
    }

    // Async
    if (AD_CONFIG.monetag.async !== false) {
      script.async = true;
    }

    // Eventos
    script.onload = function() {
      console.log('[WhatsLink Ads] Monetag carregado.');
    };
    script.onerror = function() {
      console.error('[WhatsLink Ads] Falha ao carregar Monetag.');
    };

    // Adiciona ao head (recomendado para Monetag)
    document.head.appendChild(script);
  }

  /**
   * Inicializa todos os anúncios.
   */
  function init() {
    initSideAds();
    initPush();
    initMonetag();
  }

  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
