// ============================================================
// WHATSLINK API - VERSÃO FINAL COMPLETA E ROBUSTA
// 26 COLUNAS • EMAIL PURO • TODAS AS FUNÇÕES
// ============================================================

const SHEET_NAME = 'Sheet1';
const CHAVE_CRIPTO = 'WhatsLink_Secure_Key_2026';

// ========== CRIPTOGRAFIA ==========
function criptografar(texto) {
  if (!texto) return '';
  const textoStr = String(texto);
  let resultado = '';
  for (let i = 0; i < textoStr.length; i++) {
    const charCode = textoStr.charCodeAt(i) ^ CHAVE_CRIPTO.charCodeAt(i % CHAVE_CRIPTO.length);
    resultado += String.fromCharCode(charCode);
  }
  return Utilities.base64Encode(resultado);
}

// ========== DESCRIPTOGRAFIA ==========
function descriptografar(textoCriptografado) {
  if (!textoCriptografado) return '';
  try {
    const texto = Utilities.base64Decode(textoCriptografado);
    let resultado = '';
    for (let i = 0; i < texto.length; i++) {
      const charCode = texto[i] ^ CHAVE_CRIPTO.charCodeAt(i % CHAVE_CRIPTO.length);
      resultado += String.fromCharCode(charCode);
    }
    return resultado;
  } catch (e) {
    return '';
  }
}

// ========== NORMALIZAR EMAIL ==========
function normalizarEmail(email) {
  return String(email || '').toLowerCase().trim();
}

// ========== GERAR ID ==========
function gerarId() {
  return new Date().getTime().toString(36) + Math.random().toString(36).substr(2, 8);
}

// ========== POST PRINCIPAL ==========
function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return response({ error: 'Requisição inválida' });
  }

  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'criar';

    switch (action) {
      case 'criar':
        return criarLink(data);
      case 'editar':
        return editarLink(data);
      case 'buscar_meus_links':
        return buscarMeusLinks(data);
      case 'buscar_link':
        return buscarLinkPorId(data);
      default:
        return response({ error: 'Ação inválida' });
    }
  } catch (error) {
    return response({ error: 'Erro: ' + error.message });
  }
}

// ========== CRIAR LINK ==========
function criarLink(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return response({ error: 'Planilha não encontrada' });

    const slug = String(data.slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const whatsapp = String(data.whatsapp || '').replace(/\D/g, '');
    const userEmail = normalizarEmail(data.user_email || '');

    if (!data.empresa || !whatsapp || !slug) {
      return response({ error: 'Campos obrigatórios faltando' });
    }

    if (!userEmail) {
      return response({ error: 'Email do usuário não fornecido' });
    }

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const slugs = sheet.getRange(2, 5, lastRow - 1, 1).getValues().flat();
      if (slugs.includes(slug)) {
        return response({ error: 'Este link já existe' });
      }
    }

    const id = gerarId();
    const now = new Date().toISOString();
    const editToken = gerarId();

    const row = [
      id,
      String(data.empresa || ''),
      criptografar(whatsapp),
      criptografar(String(data.whatsapp2 || '').replace(/\D/g, '')),
      slug,
      criptografar(data.mensagem || ''),
      String(data.logo_url || ''),
      String(data.banner_url || ''),
      String(data.descricao || ''),
      String(data.localizacao || ''),
      String(data.instagram || ''),
      String(data.facebook || ''),
      String(data.site || ''),
      String(data.horario || ''),
      String(data.tema || 'verde'),
      String(data.botao_whatsapp || 'Chamar no WhatsApp'),
      String(data.botao_whatsapp2 || ''),
      0,
      now,
      userEmail,
      editToken,
      String(data.urgencia || ''),
      String(data.urgencia_tempo || ''),
      String(data.depoimentos || ''),
      String(data.precos || ''),
      String(data.diferenciais || '')
    ];

    sheet.getRange(lastRow + 1, 1, 1, 26).setValues([row]);
    sheet.getRange(lastRow + 1, 3).setNumberFormat('@');
    sheet.getRange(lastRow + 1, 4).setNumberFormat('@');

    return response({
      success: true,
      slug: slug,
      id: id,
      edit_token: editToken,
      email: userEmail
    });
  } catch (error) {
    return response({ error: 'Erro ao criar: ' + error.message });
  }
}

// ========== BUSCAR LINK POR ID ==========
function buscarLinkPorId(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return response({ error: 'Planilha não encontrada' });

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return response({ error: 'Nenhum link encontrado' });

    const allData = sheet.getRange(1, 1, lastRow, 26).getValues();

    for (let i = 1; i < allData.length; i++) {
      const rowData = allData[i];
      if (rowData[0] === data.id && rowData[20] === data.edit_token) {
        return response({
          id: String(rowData[0]),
          empresa: String(rowData[1]),
          whatsapp: descriptografar(String(rowData[2])),
          whatsapp2: descriptografar(String(rowData[3])),
          slug: String(rowData[4]),
          mensagem: descriptografar(String(rowData[5])),
          logo_url: String(rowData[6]),
          banner_url: String(rowData[7]),
          descricao: String(rowData[8]),
          localizacao: String(rowData[9]),
          instagram: String(rowData[10]),
          facebook: String(rowData[11]),
          site: String(rowData[12]),
          horario: String(rowData[13]),
          tema: String(rowData[14]),
          botao_whatsapp: String(rowData[15]),
          botao_whatsapp2: String(rowData[16]),
          cliques: parseInt(rowData[17]) || 0,
          user_email: String(rowData[19]),
          edit_token: String(rowData[20]),
          urgencia: String(rowData[21] || ''),
          urgencia_tempo: String(rowData[22] || ''),
          depoimentos: String(rowData[23] || ''),
          precos: String(rowData[24] || ''),
          diferenciais: String(rowData[25] || '')
        });
      }
    }
    return response({ error: 'Link não encontrado ou token inválido' });
  } catch (error) {
    return response({ error: error.message });
  }
}

// ========== EDITAR LINK ==========
function editarLink(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return response({ error: 'Planilha não encontrada' });

    if (!data.id || !data.edit_token) {
      return response({ error: 'ID e token são necessários' });
    }

    const lastRow = sheet.getLastRow();
    let linkRow = -1;

    const allData = sheet.getRange(1, 1, lastRow, 26).getValues();

    for (let i = 1; i < allData.length; i++) {
      if (allData[i][0] === data.id && allData[i][20] === data.edit_token) {
        linkRow = i + 1;
        break;
      }
    }

    if (linkRow === -1) {
      return response({ error: 'Link não encontrado ou token inválido' });
    }

    if (data.empresa !== undefined) sheet.getRange(linkRow, 2).setValue(String(data.empresa));
    if (data.whatsapp !== undefined) sheet.getRange(linkRow, 3).setValue(criptografar(String(data.whatsapp).replace(/\D/g, '')));
    if (data.whatsapp2 !== undefined) sheet.getRange(linkRow, 4).setValue(criptografar(String(data.whatsapp2).replace(/\D/g, '')));
    if (data.mensagem !== undefined) sheet.getRange(linkRow, 6).setValue(criptografar(String(data.mensagem)));
    if (data.logo_url !== undefined) sheet.getRange(linkRow, 7).setValue(String(data.logo_url));
    if (data.banner_url !== undefined) sheet.getRange(linkRow, 8).setValue(String(data.banner_url));
    if (data.descricao !== undefined) sheet.getRange(linkRow, 9).setValue(String(data.descricao));
    if (data.localizacao !== undefined) sheet.getRange(linkRow, 10).setValue(String(data.localizacao));
    if (data.instagram !== undefined) sheet.getRange(linkRow, 11).setValue(String(data.instagram));
    if (data.facebook !== undefined) sheet.getRange(linkRow, 12).setValue(String(data.facebook));
    if (data.site !== undefined) sheet.getRange(linkRow, 13).setValue(String(data.site));
    if (data.horario !== undefined) sheet.getRange(linkRow, 14).setValue(String(data.horario));
    if (data.tema !== undefined) sheet.getRange(linkRow, 15).setValue(String(data.tema));
    if (data.botao_whatsapp !== undefined) sheet.getRange(linkRow, 16).setValue(String(data.botao_whatsapp));
    if (data.botao_whatsapp2 !== undefined) sheet.getRange(linkRow, 17).setValue(String(data.botao_whatsapp2));
    if (data.urgencia !== undefined) sheet.getRange(linkRow, 22).setValue(String(data.urgencia));
    if (data.urgencia_tempo !== undefined) sheet.getRange(linkRow, 23).setValue(String(data.urgencia_tempo));
    if (data.depoimentos !== undefined) sheet.getRange(linkRow, 24).setValue(String(data.depoimentos));
    if (data.precos !== undefined) sheet.getRange(linkRow, 25).setValue(String(data.precos));
    if (data.diferenciais !== undefined) sheet.getRange(linkRow, 26).setValue(String(data.diferenciais));

    return response({ success: true, message: 'Link atualizado com sucesso!' });
  } catch (error) {
    return response({ error: 'Erro ao editar: ' + error.message });
  }
}

// ========== BUSCAR MEUS LINKS ==========
function buscarMeusLinks(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return response({ error: 'Planilha não encontrada' });

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return response({ links: [] });

    const email = normalizarEmail(data.email || '');
    const allData = sheet.getRange(1, 1, lastRow, 26).getValues();
    const links = [];

    for (let i = 1; i < allData.length; i++) {
      const rowData = allData[i];
      const savedEmail = normalizarEmail(String(rowData[19] || ''));
      if (savedEmail === email) {
        links.push({
          id: rowData[0],
          empresa: rowData[1],
          slug: rowData[4],
          tema: rowData[14],
          cliques: rowData[17],
          created_at: rowData[18],
          edit_token: rowData[20]
        });
      }
    }

    return response({ success: true, links: links });
  } catch (error) {
    return response({ error: 'Erro: ' + error.message });
  }
}

// ========== BUSCAR LINK (GET - PÁGINA PÚBLICA) ==========
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) return response({ error: 'Planilha não encontrada' });

    const slug = e.parameter && e.parameter.slug ? e.parameter.slug : '';
    if (!slug) return response({ error: 'Slug não informado' });

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return response({ error: 'Link não encontrado' });

    const allData = sheet.getRange(1, 1, lastRow, 26).getValues();

    for (let i = 1; i < allData.length; i++) {
      if (String(allData[i][4]) === slug) {
        const link = {
          id: String(allData[i][0] || ''),
          empresa: String(allData[i][1] || ''),
          whatsapp: descriptografar(String(allData[i][2] || '')),
          whatsapp2: descriptografar(String(allData[i][3] || '')),
          slug: String(allData[i][4] || ''),
          mensagem: descriptografar(String(allData[i][5] || '')),
          logo_url: String(allData[i][6] || ''),
          banner_url: String(allData[i][7] || ''),
          descricao: String(allData[i][8] || ''),
          localizacao: String(allData[i][9] || ''),
          instagram: String(allData[i][10] || ''),
          facebook: String(allData[i][11] || ''),
          site: String(allData[i][12] || ''),
          horario: String(allData[i][13] || ''),
          tema: String(allData[i][14] || 'verde'),
          botao_whatsapp: String(allData[i][15] || 'Chamar no WhatsApp'),
          botao_whatsapp2: String(allData[i][16] || ''),
          cliques: parseInt(allData[i][17]) || 0,
          created_at: String(allData[i][18] || ''),
          urgencia: String(allData[i][21] || ''),
          urgencia_tempo: String(allData[i][22] || ''),
          depoimentos: String(allData[i][23] || ''),
          precos: String(allData[i][24] || ''),
          diferenciais: String(allData[i][25] || '')
        };

        sheet.getRange(i + 1, 18).setValue(link.cliques + 1);
        return response(link);
      }
    }

    return response({ error: 'Link não encontrado' });
  } catch (error) {
    return response({ error: 'Erro: ' + error.message });
  }
}

// ========== RESPOSTA ==========
function response(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
