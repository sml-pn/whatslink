/* ============================================================
   LÓGICA DOS ANÚNCIOS LATERAIS (fechar)
   Sem persistência – o anúncio reaparece a cada recarregamento
   ============================================================ */

(function() {
  'use strict';

  // ---------- CONFIGURAÇÕES ----------
  const CONFIG = {
    AD_SIDE_SELECTOR: '.ad-side',          // contêiner dos anúncios laterais
    CLOSE_BUTTON_SELECTOR: '.ad-close',    // botão de fechar
    TARGET_ATTR: 'data-target'             // atributo que indica o ID do anúncio a fechar
  };

  /**
   * Fecha o anúncio lateral, adiciona a classe 'closed' (ou oculta com display:none).
   * Como não usamos persistência, ao recarregar a página o anúncio estará visível novamente.
   */
  function closeAd(adElement) {
    if (!adElement) return;
    adElement.classList.add('closed'); // requer CSS: .closed { display: none; }
  }

  /**
   * Dispara evento de fechamento no Google Analytics (se disponível).
   */
  function trackCloseEvent(adId) {
    if (typeof gtag === 'function') {
      gtag('event', 'close_ad', { 'ad_side': adId });
    }
  }

  // ---------- INICIALIZAÇÃO ----------
  function init() {
    const adElements = document.querySelectorAll(CONFIG.AD_SIDE_SELECTOR);

    if (adElements.length === 0) {
      console.warn('[WhatsLink Ads] Nenhum elemento .ad-side encontrado.');
      return;
    }

    adElements.forEach(adElement => {
      const adId = adElement.id || null;

      // Configura os botões de fechar dentro de cada anúncio
      const closeButtons = adElement.querySelectorAll(CONFIG.CLOSE_BUTTON_SELECTOR);

      closeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();

          // Obtém o ID do anúncio: prioriza o atributo data-target; senão usa o id do próprio .ad-side
          const targetId = this.dataset[CONFIG.TARGET_ATTR] || adId;

          if (targetId) {
            closeAd(adElement);
            trackCloseEvent(targetId);
            console.log(`[WhatsLink Ads] Anúncio ${targetId} fechado (temporário).`);
          } else {
            console.warn('[WhatsLink Ads] Não foi possível identificar o anúncio para fechar.');
          }
        });
      });
    });

    // (Opcional) Funções globais para reabrir manualmente, se necessário
    window.reopenAds = function() {
      document.querySelectorAll(CONFIG.AD_SIDE_SELECTOR).forEach(el => {
        el.classList.remove('closed');
      });
    };

    window.reopenAd = function(adId) {
      const el = document.getElementById(adId);
      if (el) el.classList.remove('closed');
    };
  }

  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
