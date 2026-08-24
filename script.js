// ============================================================
// CONFIGURAÇÃO - URL DA API E DOMÍNIO
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

// ========== FUNÇÃO PARA FORMATAR WHATSAPP ==========
function formatarWhatsApp(valor) {
  // Remove tudo que não é número
  let numeros = valor.replace(/\D/g, '');
  
  // Limita a 13 dígitos (2 do país + 2 do DDD + 9 do número)
  numeros = numeros.slice(0, 13);
  
  // Se tiver código do país (55)
  if (numeros.length > 11) {
    // Formato: +55 (85) 99999-9999
    if (numeros.length >= 13) {
      return `+${numeros.slice(0, 2)} (${numeros.slice(2, 4)}) ${numeros.slice(4, 9)}-${numeros.slice(9, 13)}`;
    }
    // Formato parcial
    if (numeros.length >= 12) {
      return `+${numeros.slice(0, 2)} (${numeros.slice(2, 4)}) ${numeros.slice(4, 9)}-${numeros.slice(9)}`;
    }
  }
  
  // Formato: (85) 99999-9999
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

// ========== FUNÇÃO PARA VALIDAR WHATSAPP ==========
function validarWhatsApp(valor) {
  // Remove formatação
  const numeros = valor.replace(/\D/g, '');
  
  // Verifica se está vazio
  if (!numeros) {
    return {
      valido: false,
      mensagem: 'Digite o número do WhatsApp'
    };
  }
  
  // Verifica quantidade mínima de dígitos
  if (numeros.length < 10) {
    return {
      valido: false,
      mensagem: 'Número incompleto. Digite o DDD + número (ex: 85 99999-9999)'
    };
  }
  
  // Se tiver 10 ou 11 dígitos, é formato brasileiro
  if (numeros.length === 10 || numeros.length === 11) {
    // Verifica se o DDD é válido (11-99)
    const ddd = parseInt(numeros.slice(0, 2));
    if (ddd < 11 || ddd > 99) {
      return {
        valido: false,
        mensagem: 'DDD inválido. Use um DDD entre 11 e 99'
      };
    }
    
    // Verifica se o número começa com 9 (celular)
    if (numeros.length === 11 && numeros[2] !== '9') {
      return {
        valido: false,
        mensagem: 'Número de celular deve começar com 9 (ex: 85 99999-9999)'
      };
    }
  }
  
  // Se tiver 12 ou 13 dígitos, verifica código do país
  if (numeros.length === 12 || numeros.length === 13) {
    const codigoPais = numeros.slice(0, 2);
    if (codigoPais !== '55') {
      return {
        valido: false,
        mensagem: 'Use o código do Brasil (55) ou remova o código do país'
      };
    }
  }
  
  // Se tiver mais de 13 dígitos, está errado
  if (numeros.length > 13) {
    return {
      valido: false,
      mensagem: 'Número muito longo. Verifique se digitou corretamente'
    };
  }
  
  // Se passou por todas as validações, é válido
  // Remove o código do país se tiver 12 ou 13 dígitos
  let numeroLimpo = numeros;
  if (numeros.length === 12 || numeros.length === 13) {
    numeroLimpo = numeros.slice(2); // Remove o 55
  }
  
  return {
    valido: true,
    mensagem: 'Número válido',
    numeroLimpo: numeroLimpo
  };
}

// ========== FUNÇÃO PARA MOSTRAR ERRO ==========
function mostrarErro(campo, mensagem) {
  // Remove erro anterior
  limparErro(campo);
  
  const field = campo.closest('.field');
  const div = document.createElement('div');
  div.className = 'error-message';
  div.textContent = '⚠️ ' + mensagem;
  
  campo.style.borderColor = '#ef4444';
  campo.style.backgroundColor = '#fef2f2';
  campo.classList.add('error');
  
  field.appendChild(div);
}

// ========== FUNÇÃO PARA LIMPAR ERRO ==========
function limparErro(campo) {
  const field = campo.closest('.field');
  const erroDiv = field.querySelector('.error-message');
  
  if (erroDiv) {
    erroDiv.remove();
  }
  
  campo.style.borderColor = '';
  campo.style.backgroundColor = '';
  campo.classList.remove('error');
}

// ========== FUNÇÃO PARA ATUALIZAR PREVIEW ==========
function atualizarPreview(whatsapp) {
  const preview = document.getElementById('whatsappPreview');
  const previewNumber = document.getElementById('previewNumber');
  const numeros = whatsapp.value.replace(/\D/g, '');
  
  if (numeros.length >= 10) {
    preview.style.display = 'flex';
    if (numeros.length === 12 || numeros.length === 13) {
      previewNumber.textContent = numeros.slice(2);
    } else {
      previewNumber.textContent = numeros;
    }
  } else {
    preview.style.display = 'none';
  }
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

  // ========== MÁSCARA DO WHATSAPP ==========
  whatsapp.addEventListener('input', (e) => {
    const valorFormatado = formatarWhatsApp(whatsapp.value);
    whatsapp.value = valorFormatado;
    
    // Limpar erro se existir
    limparErro(whatsapp);
    
    // Atualizar preview
    atualizarPreview(whatsapp);
  });

  // ========== VALIDAÇÃO EM TEMPO REAL ==========
  whatsapp.addEventListener('blur', () => {
    const validacao = validarWhatsApp(whatsapp.value);
    
    if (!validacao.valido && whatsapp.value.trim() !== '') {
      mostrarErro(whatsapp, validacao.mensagem);
    } else if (validacao.valido) {
      limparErro(whatsapp);
    }
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
    if (!payload.empresa) {
      alert('⚠️ Digite o nome da empresa.');
      empresa.focus();
      return;
    }

    if (!payload.whatsapp) {
      mostrarErro(whatsapp, 'Digite o número do WhatsApp');
      whatsapp.focus();
      return;
    }

    if (!payload.slug) {
      alert('⚠️ Digite um nome para o link.');
      slug.focus();
      return;
    }

    // Validar WhatsApp
    const validacaoWhatsApp = validarWhatsApp(payload.whatsapp);
    if (!validacaoWhatsApp.valido) {
      mostrarErro(whatsapp, validacaoWhatsApp.mensagem);
      whatsapp.focus();
      return;
    }

    // Limpar número do WhatsApp para salvar
    payload.whatsapp = validacaoWhatsApp.numeroLimpo;

    mostrarLoading(submitBtn);

    try {
      const data = await criarLink(payload);
      const fullUrl = `${DOMINIO}/redirect.html?slug=${data.slug}`;
      
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
      generatedUrl.select();
      document.execCommand('copy');
      copyBtn.textContent = '✅ Copiado!';
      setTimeout(() => copyBtn.textContent = '📋 Copiar', 2000);
    }
  });
});
