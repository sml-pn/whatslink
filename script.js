// ============================================================
// CONFIGURAÇÃO
// ============================================================
const API_URL = 'https://script.google.com/macros/s/AKfycbwdPWLdfJuzb_gr3vWqn6HAGc1vb-trUWzvIZlIOC6RMmvWRxB6qbNI15gPkWnyzxoSfQ/exec';
const DOMINIO = 'https://whatslink-48tc.onrender.com';

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

// ========== FORMATAR WHATSAPP ==========
function formatarWhatsApp(valor) {
  let numeros = valor.replace(/\D/g, '');
  numeros = numeros.slice(0, 13);
  
  if (numeros.length > 11) {
    if (numeros.length >= 13) {
      return `+${numeros.slice(0, 2)} (${numeros.slice(2, 4)}) ${numeros.slice(4, 9)}-${numeros.slice(9, 13)}`;
    }
    if (numeros.length >= 12) {
      return `+${numeros.slice(0, 2)} (${numeros.slice(2, 4)}) ${numeros.slice(4, 9)}-${numeros.slice(9)}`;
    }
  }
  
  if (numeros.length >= 11) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
  }
  if (numeros.length >= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6, 10)}`;
  }
  if (numeros.length >= 7) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }
  if (numeros.length >= 3) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  }
  if (numeros.length >= 1) {
    return `(${numeros}`;
  }
  
  return numeros;
}

// ========== VALIDAR WHATSAPP ==========
function validarWhatsApp(valor) {
  const numeros = valor.replace(/\D/g, '');
  
  if (!numeros) {
    return { valido: false, mensagem: 'Digite o número do WhatsApp' };
  }
  
  if (numeros.length < 10) {
    return { valido: false, mensagem: 'Número incompleto. Ex: (85) 99999-9999' };
  }
  
  if (numeros.length === 10 || numeros.length === 11) {
    const ddd = parseInt(numeros.slice(0, 2));
    if (ddd < 11 || ddd > 99) {
      return { valido: false, mensagem: 'DDD inválido' };
    }
    
    if (numeros.length === 11 && numeros[2] !== '9') {
      return { valido: false, mensagem: 'Celular deve começar com 9' };
    }
  }
  
  if (numeros.length === 12 || numeros.length === 13) {
    if (numeros.slice(0, 2) !== '55') {
      return { valido: false, mensagem: 'Use código do Brasil (55)' };
    }
  }
  
  if (numeros.length > 13) {
    return { valido: false, mensagem: 'Número muito longo' };
  }
  
  let numeroLimpo = numeros;
  if (numeros.length === 12 || numeros.length === 13) {
    numeroLimpo = numeros.slice(2);
  }
  
  return { valido: true, numeroLimpo: numeroLimpo };
}

// ========== GERAR SLUG ==========
function gerarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 40);
}

// ========== MOSTRAR ERRO ==========
function mostrarErro(campo, mensagem) {
  limparErro(campo);
  const field = campo.closest('.field');
  const div = document.createElement('div');
  div.className = 'error-message';
  div.innerHTML = `<span class="material-icons" style="font-size:14px;">error</span> ${mensagem}`;
  campo.style.borderColor = '#ef4444';
  campo.style.backgroundColor = '#fef2f2';
  field.appendChild(div);
}

// ========== LIMPAR ERRO ==========
function limparErro(campo) {
  const field = campo.closest('.field');
  const erroDiv = field.querySelector('.error-message');
  if (erroDiv) erroDiv.remove();
  campo.style.borderColor = '';
  campo.style.backgroundColor = '';
}

// ========== PREVIEW DA LOGO ==========
function atualizarPreviewLogo(url) {
  const preview = document.getElementById('logoPreview');
  const img = document.getElementById('logoPreviewImage');
  
  if (url && url.trim() !== '') {
    img.src = url;
    img.onerror = () => {
      preview.style.display = 'none';
    };
    img.onload = () => {
      preview.style.display = 'block';
      limparErro(document.getElementById('logoUrl'));
    };
  } else {
    preview.style.display = 'none';
  }
}

// ========== PREVIEW DO BANNER ==========
function atualizarPreviewBanner(url) {
  const preview = document.getElementById('bannerPreview');
  const img = document.getElementById('bannerPreviewImage');
  
  if (url && url.trim() !== '') {
    img.src = url;
    img.onerror = () => {
      preview.style.display = 'none';
    };
    img.onload = () => {
      preview.style.display = 'block';
      limparErro(document.getElementById('bannerUrl'));
    };
  } else {
    preview.style.display = 'none';
  }
}

// ========== EXECUTAR QUANDO A PÁGINA CARREGAR ==========
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('linkForm');
  const empresa = document.getElementById('empresa');
  const whatsapp = document.getElementById('whatsapp');
  const mensagem = document.getElementById('mensagem');
  const slug = document.getElementById('slug');
  const logoUrl = document.getElementById('logoUrl');
  const bannerUrl = document.getElementById('bannerUrl');
  const descricao = document.getElementById('descricao');
  const localizacao = document.getElementById('localizacao');
  const instagram = document.getElementById('instagram');
  const facebook = document.getElementById('facebook');
  const site = document.getElementById('site');
  const horario = document.getElementById('horario');
  const resultDiv = document.getElementById('result');
  const generatedUrl = document.getElementById('generatedUrl');
  const copyBtn = document.getElementById('copyBtn');
  const previewBtn = document.getElementById('previewBtn');
  const submitBtn = document.getElementById('submitBtn');

  let slugManuallyEdited = false;

  // Slug automático
  empresa.addEventListener('input', () => {
    if (!slugManuallyEdited) {
      slug.value = gerarSlug(empresa.value);
    }
  });

  slug.addEventListener('input', () => {
    slugManuallyEdited = true;
    slug.value = gerarSlug(slug.value);
  });

  // Máscara WhatsApp
  whatsapp.addEventListener('input', () => {
    whatsapp.value = formatarWhatsApp(whatsapp.value);
    limparErro(whatsapp);
  });

  // Preview logo
  logoUrl.addEventListener('input', () => {
    atualizarPreviewLogo(logoUrl.value);
  });

  logoUrl.addEventListener('blur', () => {
    if (logoUrl.value.trim() !== '') {
      atualizarPreviewLogo(logoUrl.value);
    }
  });

  // Preview banner
  bannerUrl.addEventListener('input', () => {
    atualizarPreviewBanner(bannerUrl.value);
  });

  bannerUrl.addEventListener('blur', () => {
    if (bannerUrl.value.trim() !== '') {
      atualizarPreviewBanner(bannerUrl.value);
    }
  });

  // Enviar formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      empresa: empresa.value.trim(),
      whatsapp: whatsapp.value.trim(),
      slug: slug.value.trim(),
      mensagem: mensagem.value.trim(),
      logo_url: logoUrl.value.trim(),
      banner_url: bannerUrl.value.trim(),
      descricao: descricao.value.trim(),
      localizacao: localizacao.value.trim(),
      instagram: instagram.value.trim(),
      facebook: facebook.value.trim(),
      site: site.value.trim(),
      horario: horario.value.trim(),
    };

    if (!payload.empresa) {
      alert('Digite o nome da empresa.');
      empresa.focus();
      return;
    }

    if (!payload.whatsapp) {
      mostrarErro(whatsapp, 'Digite o número do WhatsApp');
      whatsapp.focus();
      return;
    }

    if (!payload.slug) {
      alert('Digite um nome para o link.');
      slug.focus();
      return;
    }

    const validacao = validarWhatsApp(payload.whatsapp);
    if (!validacao.valido) {
      mostrarErro(whatsapp, validacao.mensagem);
      whatsapp.focus();
      return;
    }

    payload.whatsapp = validacao.numeroLimpo;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="material-icons" style="animation:spin 1s linear infinite;">sync</span> Gerando...';

    try {
      const data = await criarLink(payload);
      const fullUrl = `${DOMINIO}/redirect.html?slug=${data.slug}`;
      
      generatedUrl.value = fullUrl;
      resultDiv.style.display = 'block';
      resultDiv.scrollIntoView({ behavior: 'smooth' });

      previewBtn.onclick = () => {
        window.open(fullUrl, '_blank');
      };

      submitBtn.innerHTML = '<span class="material-icons">check_circle</span> Link gerado!';
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="material-icons">send</span> Gerar link grátis';
      }, 3000);

    } catch (err) {
      alert(err.message);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="material-icons">send</span> Gerar link grátis';
    }
  });

  // Copiar link
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl.value);
      copyBtn.innerHTML = '<span class="material-icons">check</span> Copiado!';
      setTimeout(() => {
        copyBtn.innerHTML = '<span class="material-icons">content_copy</span> Copiar';
      }, 2000);
    } catch (err) {
      generatedUrl.select();
      document.execCommand('copy');
      copyBtn.innerHTML = '<span class="material-icons">check</span> Copiado!';
      setTimeout(() => {
        copyBtn.innerHTML = '<span class="material-icons">content_copy</span> Copiar';
      }, 2000);
    }
  });
});
