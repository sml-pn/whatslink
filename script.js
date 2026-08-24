// ============================================================
// CONFIGURAÇÃO - COLOQUE SUA URL AQUI
// ============================================================
const API_URL = 'https://script.google.com/macros/s/SEU_ID_AQUI/exec';
// ↑↑↑ SUBSTITUA "SEU_ID_AQUI" pela URL completa do seu Apps Script

// ========== FUNÇÃO PARA CRIAR LINK ==========
async function criarLink(payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data;
}

// ========== FUNÇÃO PARA GERAR SLUG AUTOMÁTICO ==========
function gerarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 40);
}

// ========== FUNÇÕES DE LOADING ==========
function mostrarLoading(button) {
  button.disabled = true;
  button.innerHTML = '⏳ Gerando link...';
}

function esconderLoading(button) {
  button.disabled = false;
  button.innerHTML = 'Gerar meu link →';
}

// ========== EXECUTAR QUANDO A PÁGINA CARREGAR ==========
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('linkForm');
  const empresa = document.getElementById('empresa');
  const whatsapp = document.getElementById('whatsapp');
  const mensagem = document.getElementById('mensagem');
  const slug = document.getElementById('slug');
  const resultDiv = document.getElementById('result');
  const generatedUrl = document.getElementById('generatedUrl');
  const copyBtn = document.getElementById('copyBtn');
  const previewBtn = document.getElementById('previewBtn');
  const submitBtn = document.getElementById('submitBtn');

  let slugManuallyEdited = false;

  // ========== SLUG AUTOMÁTICO ==========
  empresa.addEventListener('input', () => {
    if (!slugManuallyEdited) {
      slug.value = gerarSlug(empresa.value);
    }
  });

  slug.addEventListener('input', () => {
    slugManuallyEdited = true;
    slug.value = gerarSlug(slug.value);
  });

  // ========== FORMATAR WHATSAPP ==========
  whatsapp.addEventListener('input', () => {
    let valor = whatsapp.value.replace(/\D/g, '');
    if (valor.length > 13) {
      valor = valor.slice(0, 13);
    }
    whatsapp.value = valor;
  });

  // ========== ENVIAR FORMULÁRIO ==========
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      empresa: empresa.value.trim(),
      whatsapp: whatsapp.value.trim(),
      slug: slug.value.trim(),
      mensagem: mensagem.value.trim(),
    };

    // Validações
    if (!payload.empresa || !payload.whatsapp || !payload.slug) {
      alert('⚠️ Preencha todos os campos obrigatórios.');
      return;
    }

    // Validar WhatsApp
    if (payload.whatsapp.length < 10) {
      alert('⚠️ Número de WhatsApp inválido. Inclua o DDD.');
      return;
    }

    mostrarLoading(submitBtn);

    try {
      const data = await criarLink(payload);
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/redirect.html?slug=${data.slug}`;
      
      generatedUrl.value = fullUrl;
      resultDiv.style.display = 'block';
      resultDiv.scrollIntoView({ behavior: 'smooth' });

      previewBtn.onclick = () => {
        window.open(fullUrl, '_blank');
      };

      // Feedback do botão
      submitBtn.innerHTML = '✅ Link gerado!';
      setTimeout(() => {
        esconderLoading(submitBtn);
      }, 3000);

    } catch (err) {
      alert('❌ ' + err.message);
      esconderLoading(submitBtn);
    }
  });

  // ========== COPIAR LINK ==========
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl.value);
      copyBtn.textContent = '✅ Copiado!';
      setTimeout(() => copyBtn.textContent = '📋 Copiar', 2000);
    } catch (err) {
      // Fallback para navegadores antigos
      generatedUrl.select();
      document.execCommand('copy');
      copyBtn.textContent = '✅ Copiado!';
      setTimeout(() => copyBtn.textContent = '📋 Copiar', 2000);
    }
  });
});
