/* ============================================================
   LÓGICA DOS ANÚNCIOS LATERAIS (fechar)
   Versão melhorada e robusta
   ============================================================ */

(function() {
  'use strict';

  // ---------- CONFIGURAÇÕES ----------
  const CONFIG = {
    // Armazenamento local para lembrar quais anúncios o usuário fechou
    STORAGE_KEY: 'whatslink_closed_ads',
    // Tempo (em dias) que a escolha deve ser lembrada
    REMEMBER_DAYS: 7,
    // Seletor dos contêineres laterais
    AD_SIDE_SELECTOR: '.ad-side',
    // Seletor dos botões de fechar
    CLOSE_BUTTON_SELECTOR: '.ad-close',
    // Atributo data-target nos botões
    TARGET_ATTR: 'data-target'
  };

  // ---------- FUNÇÕES AUXILIARES ----------
  /**
   * Obtém a lista de anúncios fechados do localStorage.
   * @returns {Object} Objeto mapeando ID do anúncio -> timestamp
   */
  function getClosedAds() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn('[WhatsLink Ads] Erro ao ler localStorage:', e);
      return {};
    }
  }

  /**
   * Salva a lista de anúncios fechados no localStorage.
   * @param {Object} closedAds - Objeto mapeando ID do anúncio -> timestamp
   */
  function setClosedAds(closedAds) {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(closedAds));
    } catch (e) {
      console.warn('[WhatsLink Ads] Erro ao salvar localStorage:', e);
    }
  }

  /**
   * Verifica se um anúncio deve permanecer fechado.
   * @param {string} adId - ID do contêiner do anúncio
   * @returns {boolean} True se o anúncio deve ficar fechado, False caso contrário
   */
  function isAdClosed(adId) {
    const closedAds = getClosedAds();
    if (!closedAds[adId]) return false;

    const closedAt = new Date(closedAds[adId]);
    const now = new Date();
    const daysDiff = (now - closedAt) / (1000 * 60 * 60 * 24);

    return daysDiff < CONFIG.REMEMBER_DAYS;
  }

  /**
   * Fecha um anúncio lateral, adiciona a classe CSS e registra no localStorage.
   * @param {HTMLElement} adElement - Elemento do anúncio a ser fechado
   * @param {string} adId - ID do contêiner
   */
  function closeAd(adElement, adId) {
    if (!adElement) return;

    adElement.classList.add('closed');

    const closedAds = getClosedAds();
    closedAds[adId] = new Date().toISOString();
    setClosedAds(closedAds);

    console.log(`[WhatsLink Ads] Anúncio ${adId} fechado.`);
  }

  /**
   * Reabre um anúncio lateral.
   * @param {string} adId - ID do contêiner
   */
  function reopenAd(adId) {
    const adElement = document.getElementById(adId);
    if (adElement) {
      adElement.classList.remove('closed');

      const closedAds = getClosedAds();
      delete closedAds[adId];
      setClosedAds(closedAds);

      console.log(`[WhatsLink Ads] Anúncio ${adId} reaberto.`);
    } else {
      console.warn(`[WhatsLink Ads] Anúncio ${adId} não encontrado.`);
    }
  }

  /**
   * Dispara evento de fechamento para Google Analytics (se disponível).
   * @param {string} adId - ID do anúncio fechado
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
      const adId = adElement.id;

      // Se o usuário já fechou este anúncio recentemente, oculta imediatamente
      if (adId && isAdClosed(adId)) {
        adElement.classList.add('closed');
      }

      // Configura botões de fechar dentro do anúncio
      const closeButtons = adElement.querySelectorAll(CONFIG.CLOSE_BUTTON_SELECTOR);
      closeButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();

          // Obtém o ID do anúncio: primeiro tenta data-target, depois o id do pai mais próximo .ad-side
          const targetId = this.dataset[CONFIG.TARGET_ATTR] || adElement.id;

          if (targetId) {
            closeAd(adElement, targetId);
            trackCloseEvent(targetId);
          } else {
            console.warn('[WhatsLink Ads] Botão de fechar sem data-target e sem contêiner .ad-side próximo.');
          }
        });
      });
    });

    // Expor função global para reabrir todos os anúncios (opcional)
    window.reopenAds = function() {
      document.querySelectorAll(CONFIG.AD_SIDE_SELECTOR).forEach(el => {
        const id = el.id;
        if (id) reopenAd(id);
        else el.classList.remove('closed');
      });
    };

    // Expor função para reabrir um anúncio específico
    window.reopenAd = reopenAd;
  }

  // Aguarda o DOM estar pronto e o possível carregamento do anúncio
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
