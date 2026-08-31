/* ============================================
   CONFIGURAÇÃO DO ANÚNCIO FLUTUANTE (opcional)
   Altere aqui se quiser manter o flutuante.
   ============================================ */

const AD_CONFIG = {
  AD_TYPE: 'iframe',      // 'script' ou 'iframe'
  AD_SRC: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
  AD_WIDTH: 300,
  AD_HEIGHT: 250,
  MINIMIZED_COLOR: '#25D366'
};

/* ============================================
   LÓGICA DOS ANÚNCIOS LATERAIS (fechar)
   ============================================ */

(function() {
  // Seleciona todos os botões de fechar dos anúncios laterais
  const closeButtons = document.querySelectorAll('.ad-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const targetId = this.dataset.target; // 'adLeft' ou 'adRight'
      const side = document.getElementById(targetId);
      if (side) {
        side.classList.add('closed'); // Oculta o anúncio
        // Opcional: dispara evento para Google Analytics
        if (typeof gtag === 'function') {
          gtag('event', 'close_ad', { 'ad_side': targetId });
        }
      }
    });
  });

  // (Opcional) Função para reabrir todos os anúncios – descomente se quiser:
  // window.reopenAds = function() {
  //   document.querySelectorAll('.ad-side').forEach(el => el.classList.remove('closed'));
  // };
})();

/* ============================================
   LÓGICA DO ANÚNCIO FLUTUANTE (mantido)
   ============================================ */

(function() {
  // Cria o contêiner da aba flutuante
  const adFloat = document.createElement('div');
  adFloat.className = 'ad-float';
  adFloat.id = 'adFloat';

  // Cabeçalho
  const header = document.createElement('div');
  header.className = 'ad-float-header';
  header.innerHTML = `
    <span>Anúncio</span>
    <button id="adMinimizeBtn" title="Minimizar">Fechar</button>
  `;

  // Contêiner do anúncio
  const adContainer = document.createElement('div');
  adContainer.id = 'adContainer';

  // Ícone mini (quando minimizado)
  const miniIcon = document.createElement('div');
  miniIcon.className = 'ad-float-mini-icon';
  miniIcon.id = 'adMiniIcon';
  miniIcon.textContent = '+';

  // Monta estrutura
  adFloat.appendChild(header);
  adFloat.appendChild(adContainer);
  adFloat.appendChild(miniIcon);

  // Adiciona ao body
  document.body.appendChild(adFloat);

  // Função para carregar o anúncio flutuante conforme configuração
  function loadAd() {
    if (AD_CONFIG.AD_TYPE === 'script') {
      const s = document.createElement('script');
      s.src = AD_CONFIG.AD_SRC;
      s.async = true;
      adContainer.appendChild(s);
    } else if (AD_CONFIG.AD_TYPE === 'iframe') {
      const iframe = document.createElement('iframe');
      iframe.src = AD_CONFIG.AD_SRC;
      iframe.className = 'ad-float-content';
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      iframe.style.width = AD_CONFIG.AD_WIDTH + 'px';
      iframe.style.height = AD_CONFIG.AD_HEIGHT + 'px';
      adContainer.appendChild(iframe);
    }
  }

  // Controles de minimizar/expandir
  const minimizeBtn = document.getElementById('adMinimizeBtn');
  const mini = document.getElementById('adMiniIcon');

  minimizeBtn.addEventListener('click', () => {
    adFloat.classList.add('minimized');
  });

  mini.addEventListener('click', () => {
    adFloat.classList.remove('minimized');
  });

  // Aguarda a página carregar para carregar o anúncio
  window.addEventListener('load', loadAd);
})();
