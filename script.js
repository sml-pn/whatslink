const API_URL = 'https://script.google.com/macros/s/AKfycbwdPWLdfJuzb_gr3vWqn6HAGc1vb-trUWzvIZlIOC6RMmvWRxB6qbNI15gPkWnyzxoSfQ/exec';
const DOMINIO = 'https://whatslink-48tc.onrender.com';

// Funções auxiliares
function gerarSlug(texto) {
  return texto.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 40);
}

function formatarWhatsApp(valor) {
  let nums = valor.replace(/\D/g, '').slice(0, 13);
  if (nums.length > 11) {
    if (nums.length >= 13) return `+${nums.slice(0,2)} (${nums.slice(2,4)}) ${nums.slice(4,9)}-${nums.slice(9,13)}`;
    if (nums.length >= 12) return `+${nums.slice(0,2)} (${nums.slice(2,4)}) ${nums.slice(4,9)}-${nums.slice(9)}`;
  }
  if (nums.length >= 11) return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7,11)}`;
  if (nums.length >= 10) return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6,10)}`;
  if (nums.length >= 7) return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
  if (nums.length >= 3) return `(${nums.slice(0,2)}) ${nums.slice(2)}`;
  if (nums.length >= 1) return `(${nums}`;
  return nums;
}

function validarWhatsApp(valor) {
  const nums = valor.replace(/\D/g, '');
  if (!nums) return { valido: false, mensagem: 'Digite o número' };
  if (nums.length < 10) return { valido: false, mensagem: 'Número incompleto' };
  let numeroLimpo = nums;
  if (nums.length === 12 || nums.length === 13) numeroLimpo = nums.slice(2);
  return { valido: true, numeroLimpo };
}

document.addEventListener('DOMContentLoaded', function() {
  // Obter referências
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
  const submitBtn = document.getElementById('submitBtn');
  const resultDiv = document.getElementById('result');
  const generatedUrl = document.getElementById('generatedUrl');
  const copyBtn = document.getElementById('copyBtn');
  const previewBtn = document.getElementById('previewBtn');

  let slugManuallyEdited = false;

  // Slug automático
  empresa.addEventListener('input', function() {
    if (!slugManuallyEdited) slug.value = gerarSlug(empresa.value);
  });
  slug.addEventListener('input', function() {
    slugManuallyEdited = true;
    slug.value = gerarSlug(slug.value);
  });

  // Máscara WhatsApp
  whatsapp.addEventListener('input', function() {
    whatsapp.value = formatarWhatsApp(whatsapp.value);
  });

  // Envio do formulário
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Construir objeto com TODOS os campos
    const payload = {
      empresa: empresa.value.trim(),
      whatsapp: whatsapp.value.trim(),
      slug: slug.value.trim(),
      mensagem: mensagem.value.trim() || '',
      logo_url: logoUrl.value.trim() || '',
      banner_url: bannerUrl.value.trim() || '',
      descricao: descricao.value.trim() || '',
      localizacao: localizacao.value.trim() || '',
      instagram: instagram.value.trim() || '',
      facebook: facebook.value.trim() || '',
      site: site.value.trim() || '',
      horario: horario.value.trim() || ''
    };

    // Validações
    if (!payload.empresa) { alert('Informe o nome da empresa'); return; }
    if (!payload.whatsapp) { alert('Informe o WhatsApp'); return; }
    if (!payload.slug) { alert('Informe o nome do link'); return; }

    const validacao = validarWhatsApp(payload.whatsapp);
    if (!validacao.valido) { alert(validacao.mensagem); return; }
    payload.whatsapp = validacao.numeroLimpo;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Gerando...';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const fullUrl = `${DOMINIO}/redirect.html?slug=${data.slug}`;
      generatedUrl.value = fullUrl;
      resultDiv.style.display = 'block';
      previewBtn.onclick = () => window.open(fullUrl, '_blank');

      submitBtn.textContent = '✅ Link gerado!';
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gerar link grátis';
      }, 3000);
    } catch (err) {
      alert('Erro: ' + err.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Gerar link grátis';
    }
  });

  // Copiar link
  copyBtn.addEventListener('click', async function() {
    try {
      await navigator.clipboard.writeText(generatedUrl.value);
      copyBtn.textContent = 'Copiado!';
      setTimeout(() => copyBtn.textContent = 'Copiar', 2000);
    } catch {
      generatedUrl.select();
      document.execCommand('copy');
      copyBtn.textContent = 'Copiado!';
      setTimeout(() => copyBtn.textContent = 'Copiar', 2000);
    }
  });
});
