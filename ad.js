/* ============================================
   CONFIGURAÇÃO DOS ANÚNCIOS LATERAIS
   Altere aqui: URL, tipo, dimensões, etc.
   ============================================ */

const AD_CONFIG = {
  // Lista de anúncios (um para cada lado)
  ads: [
    {
      id: 'adLeft',
      type: 'iframe', // use 'iframe' para garantir que apareça; ou 'script' se preferir
      src: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
      width: 300,
      height: 250,
      position: 'left', // 'left' ou 'right'
      closeable: true
    },
    {
      id: 'adRight',
      type: 'iframe',
      src: 'https://elementarywhole.com/8OfdKg',
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

  // Função para criar o contêiner do anúncio
  function createAdContainer(ad) {
    const aside = document.createElement('aside');
    aside.className = `ad-side ad-${ad.position}`;
    aside.id = ad.id;

    // Cartão interno
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
        if (typeof gtag === 'function') gtag('event', 'close_ad', { 'ad_id': ad.id });
      });
      header.appendChild(btn);
    }

    card.appendChild(header);

    // Área do anúncio (inicialmente com mensagem de carregando)
    const content = document.createElement('div');
    content.className = 'ad-content';
    const loading = document.createElement('span');
    loading.className = 'ad-loading';
    loading.textContent = 'Carregando...';
    content.appendChild(loading);
    card.appendChild(content);

    // Rodapé informativo
    const footer = document.createElement('div');
    footer.className = 'ad-footer';
    footer.textContent = 'Feche o anúncio no X';
    card.appendChild(footer);

    aside.appendChild(card);
    return aside;
  }

  // Função para carregar o conteúdo do anúncio
  function loadAdContent(aside, ad) {
    const content = aside.querySelector('.ad-content');
    if (!content) return;

    // Remove a mensagem de carregando
    const loading = content.querySelector('.ad-loading');
    if (loading) loading.remove();

    if (ad.type === 'script') {
      const script = document.createElement('script');
      script.src = ad.src;
      script.async = true;
      script.onerror = () => {
        content.innerHTML = '<span class="ad-fallback">Falha ao carregar anúncio</span>';
      };
      content.appendChild(script);
    } else {
      // Iframe (padrão)
      const iframe = document.createElement('iframe');
      iframe.src = ad.src;
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.onerror = () => {
        content.innerHTML = '<span class="ad-fallback">Falha ao carregar anúncio</span>';
      };
      content.appendChild(iframe);
    }
  }

  // Inicialização
  function init() {
    const wrapper = document.querySelector('.ad-wrapper');

    AD_CONFIG.ads.forEach(ad => {
      const aside = createAdContainer(ad);

      if (wrapper) {
        // Se houver wrapper, insere no lugar certo para ficar nas laterais
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
