// ============================================================
// WHATSLINK API - VERSÃO COMPLETA COM 21 COLUNAS
// ============================================================

const SHEET_NAME = 'Sheet1';
const USERS_SHEET = 'Users';
const CHAVE_CRIPTO = 'WhatsLink_Secure_Key_2026';
const MAX_EDICOES_POR_DIA = 5;

// ========== GUARDAR CHAVE SECRETA ==========
function guardarChaveSecreta() {
  PropertiesService.getScriptProperties().setProperty(
    'GOOGLE_CLIENT_SECRET',
    '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'
  );
  Logger.log('Chave secreta guardada com sucesso!');
}

// ========== OBTER CHAVE SECRETA ==========
function obterChaveSecreta() {
  return PropertiesService.getScriptProperties().getProperty('GOOGLE_CLIENT_SECRET');
}

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

// ========== GERAR ID ==========
function gerarId() {
  return new Date().getTime().toString(36) + Math.random().toString(36).substr(2, 8);
}

// ========== INICIALIZAR PLANILHAS ==========
function inicializarPlanilhas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss.getSheetByName(SHEET_NAME)) {
    const sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'id', 'empresa', 'whatsapp', 'whatsapp2', 'slug', 'mensagem',
      'logo_url', 'banner_url', 'descricao', 'localizacao',
      'instagram', 'facebook', 'site', 'horario', 'tema',
      'botao_whatsapp', 'botao_whatsapp2', 'cliques', 'created_at', 'user_email', 'edit_token'
    ]);
    sheet.protect().setDescription('Protegido - Acesso via API');
  }
  
  if (!ss.getSheetByName(USERS_SHEET)) {
    const usersSheet = ss.insertSheet(USERS_SHEET);
    usersSheet.appendRow([
      'id', 'email', 'nome', 'foto', 'created_at', 'edit_count', 'last_edit_date'
    ]);
    usersSheet.protect().setDescription('Usuários - Acesso via API');
  }
}

// ========== FUNÇÃO PRINCIPAL - POST ==========
function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return response({ error: 'Requisição inválida' });
  }

  try {
    inicializarPlanilhas();
    const data = JSON.parse(e.postData.contents);
    const action = data.action || 'criar';

    switch (action) {
      case 'login_google':
        return loginGoogle(data);
      case 'criar':
        return criarLink(data);
      case 'editar':
        return editarLink(data);
      case 'buscar_meus_links':
        return buscarMeusLinks(data);
      case 'buscar_link':
        return buscarLinkPorId(data);
      case 'verificar_token':
        return verificarToken(data);
      default:
        return response({ error: 'Ação inválida' });
    }

  } catch (error) {
    return response({ error: 'Erro: ' + error.message });
  }
}

// ========== LOGIN COM GOOGLE ==========
function loginGoogle(data) {
  try {
    const usersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET);
    const lastRow = usersSheet.getLastRow();
    
    let userData = null;
    
    if (lastRow > 1) {
      const users = usersSheet.getRange(2, 1, lastRow - 1, 7).getValues();
      for (let i = 0; i < users.length; i++) {
        if (users[i][1] === data.email) {
          userData = {
            id: users[i][0],
            email: users[i][1],
            nome: users[i][2],
            foto: users[i][3],
            edit_count: parseInt(users[i][5]) || 0,
            last_edit_date: users[i][6] || ''
          };
          break;
        }
      }
    }

    if (!userData) {
      const novoId = gerarId();
      const now = new Date().toISOString();
      usersSheet.appendRow([novoId, data.email, data.nome, data.foto || '', now, 0, '']);
      userData = {
        id: novoId,
        email: data.email,
        nome: data.nome,
        foto: data.foto || '',
        edit_count: 0,
        last_edit_date: ''
      };
    }

    return response({ success: true, user: userData, message: 'Login realizado com sucesso!' });

  } catch (error) {
    return response({ error: 'Erro no login: ' + error.message });
  }
}

// ========== VERIFICAR TOKEN ==========
function verificarToken(data) {
  try {
    const usersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET);
    const lastRow = usersSheet.getLastRow();
    
    if (lastRow > 1) {
      const users = usersSheet.getRange(2, 1, lastRow - 1, 7).getValues();
      for (let i = 0; i < users.length; i++) {
        if (users[i][1] === data.email) {
          return response({
            success: true,
            user: {
              id: users[i][0],
              email: users[i][1],
              nome: users[i][2],
              foto: users[i][3]
            }
          });
        }
      }
    }
    
    return response({ error: 'Usuário não encontrado' });

  } catch (error) {
    return response({ error: 'Erro: ' + error.message });
  }
}

// ========== CRIAR LINK (21 COLUNAS) ==========
function criarLink(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    const slug = String(data.slug || '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const whatsapp = String(data.whatsapp || '').replace(/\D/g, '');

    if (!data.empresa || !whatsapp || !slug) {
      return response({ error: 'Campos obrigatórios faltando' });
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

    const whatsappCripto = criptografar(whatsapp);
    const whatsapp2Cripto = criptografar(String(data.whatsapp2 || '').replace(/\D/g, ''));
    const mensagemCripto = criptografar(data.mensagem || '');
    const emailCripto = criptografar(data.user_email || '');

    const row = [
      id,                                                    // A - id
      String(data.empresa || ''),                            // B - empresa
      whatsappCripto,                                        // C - whatsapp (CRIPTOGRAFADO)
      whatsapp2Cripto,                                       // D - whatsapp2 (CRIPTOGRAFADO)
      slug,                                                  // E - slug
      mensagemCripto,                                        // F - mensagem (CRIPTOGRAFADA)
      String(data.logo_url || ''),                           // G - logo_url
      String(data.banner_url || ''),                         // H - banner_url
      String(data.descricao || ''),                          // I - descricao
      String(data.localizacao || ''),                        // J - localizacao
      String(data.instagram || ''),                          // K - instagram
      String(data.facebook || ''),                           // L - facebook
      String(data.site || ''),                               // M - site
      String(data.horario || ''),                            // N - horario
      String(data.tema || 'verde'),                          // O - tema
      String(data.botao_whatsapp || 'Chamar no WhatsApp'),   // P - botao_whatsapp
      String(data.botao_whatsapp2 || ''),                    // Q - botao_whatsapp2
      0,                                                     // R - cliques
      now,                                                   // S - created_at
      emailCripto,                                           // T - user_email (CRIPTOGRAFADO)
      editToken                                              // U - edit_token
    ];

    sheet.getRange(lastRow + 1, 1, 1, 21).setValues([row]);
    sheet.getRange(lastRow + 1, 3).setNumberFormat('@');
    sheet.getRange(lastRow + 1, 4).setNumberFormat('@');

    return response({
      success: true,
      slug: slug,
      id: id,
      edit_token: editToken,
      message: 'Link criado com sucesso!'
    });

  } catch (error) {
    return response({ error: 'Erro ao criar: ' + error.message });
  }
}

// ========== BUSCAR LINK POR ID (NOVA FUNÇÃO) ==========
function buscarLinkPorId(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();
    
    if (lastRow < 2) return response({ error: 'Nenhum link encontrado' });
    
    for (let i = 2; i <= lastRow; i++) {
      const rowData = sheet.getRange(i, 1, 1, 21).getValues()[0];
      if (rowData[0] === data.id && rowData[20] === data.edit_token) {
        const link = {
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
          created_at: String(rowData[18]),
          user_email: descriptografar(String(rowData[19])),
          edit_token: String(rowData[20])
        };
        return response(link);
      }
    }
    return response({ error: 'Link não encontrado ou token inválido' });
  } catch (error) {
    return response({ error: error.message });
  }
}

// ========== EDITAR LINK (5 EDIÇÕES POR DIA) ==========
function editarLink(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const usersSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(USERS_SHEET);
    
    if (!data.id || !data.edit_token) {
      return response({ error: 'ID e token de edição são necessários' });
    }

    const lastRow = sheet.getLastRow();
    let linkRow = -1;
    let userEmail = '';
    
    for (let i = 2; i <= lastRow; i++) {
      const rowData = sheet.getRange(i, 1, 1, 21).getValues()[0];
      if (rowData[0] === data.id && rowData[20] === data.edit_token) {
        linkRow = i;
        userEmail = descriptografar(rowData[19]);
        break;
      }
    }

    if (linkRow === -1) {
      return response({ error: 'Link não encontrado ou token inválido' });
    }

    const today = new Date().toISOString().split('T')[0];
    const usersLastRow = usersSheet.getLastRow();
    let userRow = -1;
    let editCount = 0;
    let lastEditDate = '';
    
    if (usersLastRow > 1) {
      const users = usersSheet.getRange(2, 1, usersLastRow - 1, 7).getValues();
      for (let i = 0; i < users.length; i++) {
        if (users[i][1] === userEmail) {
          userRow = i + 2;
          editCount = parseInt(users[i][5]) || 0;
          lastEditDate = users[i][6] || '';
          break;
        }
      }
    }

    if (userRow === -1) {
      return response({ error: 'Usuário não encontrado' });
    }

    if (lastEditDate !== today) {
      editCount = 0;
    }

    if (editCount >= MAX_EDICOES_POR_DIA) {
      return response({ 
        error: `Você atingiu o limite de ${MAX_EDICOES_POR_DIA} edições hoje. Volte amanhã!`,
        edit_count: editCount,
        max_edicoes: MAX_EDICOES_POR_DIA
      });
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

    editCount++;
    usersSheet.getRange(userRow, 6).setValue(editCount);
    usersSheet.getRange(userRow, 7).setValue(today);

    const edicoesRestantes = MAX_EDICOES_POR_DIA - editCount;

    return response({ 
      success: true, 
      message: `Link atualizado! Você ainda tem ${edicoesRestantes} edições hoje.`,
      edit_count: editCount,
      edicoes_restantes: edicoesRestantes
    });

  } catch (error) {
    return response({ error: 'Erro ao editar: ' + error.message });
  }
}

// ========== BUSCAR LINKS DO USUÁRIO ==========
function buscarMeusLinks(data) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();
    
    if (lastRow < 2) return response({ links: [] });

    const emailCripto = criptografar(data.email || '');
    const links = [];

    for (let i = 2; i <= lastRow; i++) {
      const rowData = sheet.getRange(i, 1, 1, 21).getValues()[0];
      if (rowData[19] === emailCripto) {
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

// ========== BUSCAR LINK (GET - PÁGINA DE RECEPÇÃO) ==========
function doGet(e) {
  try {
    inicializarPlanilhas();
    
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const slug = e.parameter && e.parameter.slug ? e.parameter.slug : '';
    
    if (!slug) return response({ error: 'Slug não informado' });

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return response({ error: 'Link não encontrado' });

    const data = sheet.getRange(1, 1, lastRow, 21).getValues();

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][4]) === slug) {
        const link = {
          id: String(data[i][0] || ''),
          empresa: String(data[i][1] || ''),
          whatsapp: descriptografar(String(data[i][2] || '')),
          whatsapp2: descriptografar(String(data[i][3] || '')),
          slug: String(data[i][4] || ''),
          mensagem: descriptografar(String(data[i][5] || '')),
          logo_url: String(data[i][6] || ''),
          banner_url: String(data[i][7] || ''),
          descricao: String(data[i][8] || ''),
          localizacao: String(data[i][9] || ''),
          instagram: String(data[i][10] || ''),
          facebook: String(data[i][11] || ''),
          site: String(data[i][12] || ''),
          horario: String(data[i][13] || ''),
          tema: String(data[i][14] || 'verde'),
          botao_whatsapp: String(data[i][15] || 'Chamar no WhatsApp'),
          botao_whatsapp2: String(data[i][16] || ''),
          cliques: parseInt(data[i][17]) || 0,
          created_at: String(data[i][18] || '')
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

// ========== FUNÇÃO AUXILIAR DE RESPOSTA ==========
function response(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
