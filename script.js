<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WhatsLink – Página profissional para WhatsApp</title>
  <meta name="description" content="Crie uma página de recepção personalizada para o seu WhatsApp com logo, banner, localização e redes sociais. Grátis e sem cadastro." />
  <meta name="keywords" content="link whatsapp, página de recepção, whatsapp profissional, bio whatsapp, link personalizado" />
  <meta property="og:title" content="WhatsLink – Página profissional para WhatsApp" />
  <meta property="og:description" content="Link personalizado com logo, banner, localização e redes sociais." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://whatslink-48tc.onrender.com" />
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="page-wrapper">
    <header class="main-header">
      <div class="container header-content">
        <a href="/" class="brand">
          <span class="material-icons brand-icon">link</span>
          <span class="brand-name">Whats<span>Link</span></span>
          <span class="badge-gratis">GRÁTIS</span>
        </a>
        <nav class="main-nav">
          <a href="#recursos">Recursos</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#faq">FAQ</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero-section">
        <div class="container hero-content">
          <h1>Crie uma <span class="highlight">página profissional</span> para o seu WhatsApp</h1>
          <p>Em menos de 1 minuto, tenha um link personalizado com logo, banner, localização e todos os seus contatos.</p>
          <a href="#criar" class="btn-primary">Criar meu link agora</a>
          <div class="hero-trust">
            <span><i class="fas fa-check-circle"></i> 100% gratuito</span>
            <span><i class="fas fa-check-circle"></i> Sem cadastro</span>
            <span><i class="fas fa-check-circle"></i> Links ilimitados</span>
          </div>
        </div>
      </section>

      <section id="criar" class="form-section">
        <div class="container">
          <div class="form-card">
            <h2><span class="material-icons">rocket_launch</span> Crie seu link agora</h2>
            <p class="form-subtitle">Campos com * são obrigatórios</p>

            <form id="linkForm" novalidate>
              <div class="form-grid">
                <div class="field">
                  <label for="empresa"><span class="material-icons">business</span> Nome da empresa *</label>
                  <input type="text" id="empresa" placeholder="Ex: Academia Top Fit" required />
                </div>
                <div class="field">
                  <label for="whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp *</label>
                  <input type="tel" id="whatsapp" placeholder="(85) 99999-9999" required maxlength="18" />
                </div>
                <div class="field">
                  <label for="logoUrl"><span class="material-icons">image</span> Logo (URL) <span class="optional">opcional</span></label>
                  <input type="url" id="logoUrl" placeholder="https://exemplo.com/logo.png" />
                </div>
                <div class="field">
                  <label for="bannerUrl"><span class="material-icons">panorama</span> Banner (URL) <span class="optional">opcional</span></label>
                  <input type="url" id="bannerUrl" placeholder="https://exemplo.com/banner.png" />
                </div>
                <div class="field full-width">
                  <label for="mensagem"><span class="material-icons">chat</span> Mensagem automática <span class="optional">opcional</span></label>
                  <textarea id="mensagem" rows="3" placeholder="Olá! Gostaria de mais informações..."></textarea>
                </div>
                <div class="field full-width">
                  <label for="descricao"><span class="material-icons">description</span> Descrição <span class="optional">opcional</span></label>
                  <textarea id="descricao" rows="3" placeholder="Descreva seus serviços, horários, diferenciais..."></textarea>
                </div>
                <div class="field">
                  <label for="localizacao"><span class="material-icons">location_on</span> Localização (Google Maps) <span class="optional">opcional</span></label>
                  <input type="url" id="localizacao" placeholder="https://maps.google.com/?q=..." />
                </div>
                <div class="field">
                  <label for="instagram"><i class="fab fa-instagram"></i> Instagram <span class="optional">opcional</span></label>
                  <input type="text" id="instagram" placeholder="@suaempresa" />
                </div>
                <div class="field">
                  <label for="facebook"><i class="fab fa-facebook"></i> Facebook <span class="optional">opcional</span></label>
                  <input type="url" id="facebook" placeholder="https://facebook.com/suaempresa" />
                </div>
                <div class="field">
                  <label for="site"><span class="material-icons">public</span> Site <span class="optional">opcional</span></label>
                  <input type="url" id="site" placeholder="https://suaempresa.com" />
                </div>
                <div class="field">
                  <label for="horario"><span class="material-icons">schedule</span> Horário <span class="optional">opcional</span></label>
                  <input type="text" id="horario" placeholder="Seg a Sex: 8h às 18h" />
                </div>
                <div class="field full-width">
                  <label for="slug"><span class="material-icons">tag</span> Nome do link *</label>
                  <div class="slug-group">
                    <span>whatslink-48tc.onrender.com/</span>
                    <input type="text" id="slug" placeholder="academia-top-fit" required />
                  </div>
                </div>
              </div>
              <button type="submit" id="submitBtn" class="btn-primary btn-submit">
                <span class="material-icons">send</span> Gerar link grátis
              </button>
            </form>

            <div id="result" class="result-box" style="display:none;">
              <p><span class="material-icons">check_circle</span> Link criado com sucesso!</p>
              <div class="link-row">
                <input type="text" id="generatedUrl" readonly />
                <button id="copyBtn"><span class="material-icons">content_copy</span> Copiar</button>
              </div>
              <button id="openPageBtn" class="btn-primary" style="width:100%; justify-content:center; margin-top:10px;">
                <span class="material-icons">visibility</span> Abrir página
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" class="features-section">
        <div class="container">
          <h2>Recursos incríveis</h2>
          <div class="features-grid">
            <div class="feature-item"><span class="material-icons">flash_on</span><h3>Rápido</h3><p>Crie em segundos</p></div>
            <div class="feature-item"><span class="material-icons">devices</span><h3>Responsivo</h3><p>Funciona em qualquer tela</p></div>
            <div class="feature-item"><span class="material-icons">palette</span><h3>Personalizável</h3><p>Logo, banner e cores</p></div>
            <div class="feature-item"><span class="material-icons">share</span><h3>Compartilhável</h3><p>Link único para divulgar</p></div>
          </div>
        </div>
      </section>

      <section id="como-funciona" class="how-section">
        <div class="container">
          <h2>Como funciona</h2>
          <div class="steps">
            <div class="step"><div class="step-number">1</div><h3>Preencha</h3><p>Dados da empresa</p></div>
            <div class="step"><div class="step-number">2</div><h3>Gere o link</h3><p>Clique em gerar</p></div>
            <div class="step"><div class="step-number">3</div><h3>Compartilhe</h3><p>Divulgue onde quiser</p></div>
          </div>
        </div>
      </section>

      <section id="faq" class="faq-section">
        <div class="container">
          <h2>Perguntas frequentes</h2>
          <details><summary>É realmente grátis?</summary><p>Sim, 100% gratuito.</p></details>
          <details><summary>Preciso me cadastrar?</summary><p>Não, crie sem cadastro.</p></details>
          <details><summary>Posso personalizar?</summary><p>Sim, com logo, banner, etc.</p></details>
        </div>
      </section>
    </main>

    <footer class="main-footer">
      <div class="container"><p>WhatsLink © 2024 • Feito com <span class="heart">❤</span></p></div>
    </footer>
  </div>
  <script src="script.js"></script>
</body>
</html>  
