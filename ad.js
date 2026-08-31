/* ============================================
   CONFIGURAÇÃO DO ANÚNCIO
   Altere aqui: URL, tipo, dimensões, etc.
   ============================================ */

const AD_CONFIG = {
  AD_TYPE: 'iframe', // 'script' ou 'iframe'
  AD_SRC: 'https://www.profitableratecpmnetwork.com/tex5g0tvv?key=78443d7dfd48583d7fe38644e80f7ad5',
  AD_WIDTH: 300,
  AD_HEIGHT: 250,
  MINIMIZED_COLOR: '#25D366' // cor do botão minimizado
};

/* ============================================
   NÃO PRECISA ALTERAR ABAIXO DISSO
   ============================================ */

(function() {
  // Cria o contêiner da aba
  const adFloat = document.createElement('div');
  adFloat.className = 'ad-float';
  adFloat.id = 'adFloat';

  // Cabeçalho
  const header = document.createElement('div');
  header.className = 'ad-float-header';
  header.innerHTML = `
    <span>Anúncio</span>
    <button id="adMinimizeBtn" title="Minimizar">−</button>
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

  // Função para carregar o anúncio
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
