const API_URL = 'https://script.google.com/macros/s/AKfycbwdPWLdfJuzb_gr3vWqn6HAGc1vb-trUWzvIZlIOC6RMmvWRxB6qbNI15gPkWnyzxoSfQ/exec';
const DOMINIO = 'https://whatslink-48tc.onrender.com';

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

function formatarWhatsApp(valor) {
  let numeros = valor.replace(/\D/g, '');
  numeros = numeros.slice(0, 13);
  
  if (numeros.length > 11) {
    if (numeros.length >= 13) {
      return '+' + numeros.slice(0, 2) + ' (' + numeros.slice(2, 4) + ') ' + numeros.slice(4, 9) + '-' + numeros.slice(9, 13);
    }
    if (numeros.length >= 12) {
      return '+' + numeros.slice(0, 2) + ' (' + numeros.slice(2, 4) + ') ' + numeros.slice(4, 9) + '-' + numeros.slice(9);
    }
  }
  
  if (numeros.length >= 11) {
    return '(' + numeros.slice(0, 2) + ') ' + numeros.slice(2, 7) + '-' + numeros.slice(7, 11);
  }
  if (numeros.length >= 10) {
    return '(' + numeros.slice(0, 2) + ') ' + numeros.slice(2, 6) + '-' + numeros.slice(6, 10);
  }
  if (numeros.length >= 7) {
    return '(' + numeros.slice(0, 2) + ') ' + numeros.slice(2, 7) + '-' + numeros.slice(7);
  }
  if (numeros.length >= 3) {
    return '(' + numeros.slice(0, 2) + ') ' + numeros.slice(2);
  }
  if (numeros.length >= 1) {
    return '(' + numeros;
  }
  
  return numeros;
}

function validarWhatsApp(valor) {
  const numeros = valor.replace(/\D/g, '');
  
  if (!numeros) {
    return { valido: false, mensagem: 'Digite o número do WhatsApp' };
  }
  
  if (numeros.length < 10) {
    return { valido: false, mensagem: 'Número incompleto. Ex: (85) 99999-9999' };
  }
  
  let numeroLimpo = numeros;
  if (numeros.length === 12 || numeros.length === 13) {
    numeroLimpo = numeros.slice(2);
  }
  
  return { valido: true, numeroLimpo: numeroLimpo };
}

function gerarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 40);
}

function mostrarErro(campo, mensagem) {
  limparErro(campo);
  const field = campo.closest('.field');
  const div = document.createElement('div');
  div.className = 'error-message';
  div.textContent = mensagem;
  campo.style.borderColor = '#ef4444';
  campo.style.backgroundColor = '#fef2f2';
  field.appendChild(div);
}

function limparErro(campo) {
  const field = campo.closest('.field');
  const erroDiv = field.querySelector('.error-message');
  if (erroDiv) erroDiv.remove();
  campo.style.borderColor = '';
  campo.style.backgroundColor = '';
}

document.addEventListener('DOMContentLoaded', function() {
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

  empresa.addEventListener('input', function() {
    if (!slugManuallyEdited) {
      slug.value = gerarSlug(empresa.value);
    }
  });

  slug.addEventListener('input', function() {
    slugManuallyEdited = true;
    slug.value = gerarSlug(slug.value);
  });

  whatsapp.addEventListener('input', function() {
    whatsapp.value = formatarWhatsApp(whatsapp.value);
    limparErro(whatsapp);
  });

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Coletar TODOS os dados
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
      horario: horario.value.trim()
    };

    console.log('Payload:', payload); // Debug

    if (!payload.empresa) {
      alert('Digite o nome da empresa');
      return;
    }

    if (!payload.whatsapp) {
      mostrarErro(whatsapp, 'Digite o WhatsApp');
      return;
    }

    if (!payload.slug) {
      alert('Digite o nome do link');
      return;
    }

    const validacao = validarWhatsApp(payload.whatsapp);
    if (!validacao.valido) {
      mostrarErro(whatsapp, validacao.mensagem);
      return;
    }

    payload.whatsapp = validacao.numeroLimpo;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Gerando...';

    try {
      const data = await criarLink(payload);
      const fullUrl = DOMINIO + '/redirect.html?slug=' + data.slug;
      
      generatedUrl.value = fullUrl;
      resultDiv.style.display = 'block';

      previewBtn.onclick = function() {
        window.open(fullUrl, '_blank');
      };

      submitBtn.textContent = 'Link gerado!';
      setTimeout(function() {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gerar link grátis';
      }, 3000);

    } catch (err) {
      alert(err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Gerar link grátis';
    }
  });

  copyBtn.addEventListener('click', async function() {
    try {
      await navigator.clipboard.writeText(generatedUrl.value);
      copyBtn.textContent = 'Copiado!';
      setTimeout(function() {
        copyBtn.textContent = 'Copiar';
      }, 2000);
    } catch (err) {
      generatedUrl.select();
      document.execCommand('copy');
      copyBtn.textContent = 'Copiado!';
      setTimeout(function() {
        copyBtn.textContent = 'Copiar';
      }, 2000);
    }
  });
});
