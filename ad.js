/* ============================================
   GERENCIADOR DE ANÚNCIOS
   ============================================
   Inclui:
   - Adsterra (banner fixo no rodapé)
   - Monetag Vignette (após carregamento total)

   FLUXO:
   1. Página carrega normalmente
   2. window.load acontece
   3. Adsterra é iniciado
   4. Aguarda 1,5 segundo
   5. Monetag Vignette é iniciado

   IMPORTANTE:
   Nenhum anúncio é inserido antes do
   carregamento completo da página.
   ============================================ */

const AD_CONFIG = {

  // ================= ANÚNCIO RODAPÉ (ADSTERRA) =================
  bottomAd: {

    enabled: true,

    id: 'adBottom',

    type: 'inline',

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


  // ================= MONETAG VIGNETTE =================
  vignette: {

    enabled: true,

    // Tempo após window.load
    // 1500 = 1,5 segundo
    delayAfterLoad: 1500,

    // Código original da zona Monetag
    code: `
      (function(s){
        s.dataset.zone='11725719',
        s.src='https://n6wxm.com/vignette.min.js'
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


  /* ==========================================
     ADSTERRA
     ========================================== */

  function createBottomAd(ad) {

    // Segurança contra duplicação
    if (document.getElementById(ad.id)) {
      console.log('[WhatsLink Ads] Adsterra já existe.');
      return;
    }


    const bar = document.createElement('div');

    bar.id = ad.id;

    bar.className = 'ad-bottom-bar';


    /* ------------------------------------------
       BOTÃO FECHAR
       ------------------------------------------ */

    if (ad.closeable !== false) {

      const btn = document.createElement('button');

      btn.className = 'ad-bottom-close';

      btn.innerHTML = '✕';

      btn.setAttribute(
        'aria-label',
        'Fechar anúncio'
      );


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


    /* ------------------------------------------
       ÁREA DO ANÚNCIO
       ------------------------------------------ */

    const content = document.createElement('div');

    content.className = 'ad-bottom-content';


    /* ------------------------------------------
       INSERE O SCRIPT DO ADSTERRA
       ------------------------------------------ */

    if (ad.type === 'inline' && ad.code) {

      const script = document.createElement('script');

      script.type = 'text/javascript';

      script.textContent = ad.code;

      content.appendChild(script);
    }


    bar.appendChild(content);


    /* ------------------------------------------
       ADICIONA O BANNER À PÁGINA
       ------------------------------------------ */

    document.body.appendChild(bar);


    /* ------------------------------------------
       ESPAÇO PARA O BANNER
       ------------------------------------------ */

    document.body.style.paddingBottom = '100px';


    console.log(
      '[WhatsLink Ads] Adsterra iniciado após window.load.'
    );
  }



  /* ==========================================
     MONETAG VIGNETTE
     ========================================== */

  function loadVignette(vignette) {

    if (!vignette.enabled) {

      console.log(
        '[WhatsLink Ads] Monetag desativado.'
      );

      return;
    }


    /*
     * IMPORTANTE:
     *
     * Esta função NÃO registra outro
     * window.addEventListener('load').
     *
     * Ela já é chamada depois do load.
     *
     * Portanto, basta aguardar o delay.
     */

    const delay =
      Number(vignette.delayAfterLoad) || 1500;


    setTimeout(function() {

      try {

        const script =
          document.createElement('script');


        script.type =
          'text/javascript';


        script.textContent =
          vignette.code;


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

  function init() {

    // Segurança contra execução duplicada
    if (adsInitialized) {

      console.log(
        '[WhatsLink Ads] Já inicializado.'
      );

      return;
    }


    adsInitialized = true;


    console.log(
      '[WhatsLink Ads] Página totalmente carregada.'
    );


    /* ------------------------------------------
       1. ADSTERRA
       ------------------------------------------ */

    if (AD_CONFIG.bottomAd.enabled) {

      createBottomAd(
        AD_CONFIG.bottomAd
      );
    }


    /* ------------------------------------------
       2. MONETAG
       ------------------------------------------ */

    if (AD_CONFIG.vignette.enabled) {

      loadVignette(
        AD_CONFIG.vignette
      );
    }

  }



  /* ==========================================
     INÍCIO DO GERENCIADOR
     ========================================== */

  /*
   * Se o ADS.js for carregado normalmente antes
   * do carregamento terminar:
   *
   *     espera window.load
   *
   * Se o ADS.js for carregado depois que a página
   * já terminou:
   *
   *     inicializa imediatamente.
   */

  if (document.readyState === 'complete') {

    // A página já terminou de carregar
    init();

  } else {

    // Aguarda o carregamento completo
    window.addEventListener(
      'load',
      init,
      {
        once: true
      }
    );

  }


})();
