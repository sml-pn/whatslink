# 🔗 WhatsLink

Plataforma gratuita para criar páginas de recepção profissionais para WhatsApp.

## 📋 Sobre o Projeto

O WhatsLink permite que empresas e profissionais criem links personalizados que direcionam para uma página de recepção elegante, com informações da empresa, botão de WhatsApp, redes sociais, localização e muito mais.

## ✨ Funcionalidades

- ✅ Criação de links sem cadastro
- ✅ Página de recepção personalizada
- ✅ 5 temas profissionais (Verde, Azul, Roxo, Laranja, Preto)
- ✅ Suporte a logo e banner
- ✅ Mensagem automática para WhatsApp
- ✅ Localização com Google Maps
- ✅ Redes sociais (Instagram, Facebook, Site)
- ✅ Horário de funcionamento
- ✅ Login com Google para gerenciar links
- ✅ Edição limitada (5x por dia)
- ✅ Criptografia de dados sensíveis
- ✅ Contador de cliques
- ✅ Design responsivo
- ✅ 100% gratuito

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilos e animações |
| JavaScript | Lógica e validações |
| Google Apps Script | API backend |
| Google Sheets | Banco de dados |
| Google OAuth | Autenticação |
| Render | Hospedagem |
| GitHub | Versionamento |

## 📁 Estrutura do Projeto
whatslink/
├── index.html → Página principal (criação de links)
├── redirect.html → Página de recepção
├── edit.html → Página de gerenciamento (login Google)
├── style.css → Estilos completos
├── script.js → Lógica do formulário
├── Código.gs → Google Apps Script (backend)
├── README.md → Documentação
└── .gitignore → Arquivos ignorados


## 🚀 Como Funciona

### Fluxo do Usuário
Usuário → Acessa o site → Preenche formulário → Gera link → Compartilha


### Fluxo do Visitante
Visitante → Clica no link → Vê página personalizada → Clica no WhatsApp → Conversa


### Fluxo de Edição
Usuário → Login Google → Vê seus links → Edita (5x/dia) → Salva


## 📊 Estrutura da Planilha

### Sheet1 (Links) - 18 colunas

| Coluna | Campo | Criptografado |
|--------|-------|---------------|
| A | id | Não |
| B | empresa | Não |
| C | whatsapp | ✅ Sim |
| D | slug | Não |
| E | mensagem | ✅ Sim |
| F | logo_url | Não |
| G | banner_url | Não |
| H | descricao | Não |
| I | localizacao | Não |
| J | instagram | Não |
| K | facebook | Não |
| L | site | Não |
| M | horario | Não |
| N | tema | Não |
| O | cliques | Não |
| P | created_at | Não |
| Q | user_email | ✅ Sim |
| R | edit_token | Não |

### Users (Usuários) - 7 colunas

| Coluna | Campo |
|--------|-------|
| A | id |
| B | email |
| C | nome |
| D | foto |
| E | created_at |
| F | edit_count |
| G | last_edit_date |

## 🔒 Segurança

- **Criptografia XOR** para dados sensíveis (WhatsApp, mensagem, email)
- **Token de edição** único por link
- **Limite de edições** (5 por dia)
- **Planilhas protegidas** contra edição manual
- **Chave secreta** armazenada no Properties Service
- **Login OAuth 2.0** do Google

## 🎨 Temas Disponíveis

| Tema | Cor Principal | Descrição |
|------|---------------|-----------|
| Verde WhatsApp | #25D366 | Clássico e profissional |
| Azul Corporate | #3b82f6 | Moderno e confiável |
| Roxo Premium | #8b5cf6 | Elegante e criativo |
| Laranja Energia | #f97316 | Vibrante e acolhedor |
| Preto Luxo | #18181b | Sofisticado e minimalista |

## 📝 Como Configurar

### 1. Google Cloud Console

1. Crie um projeto no Google Cloud Console
2. Configure a tela de consentimento OAuth
3. Crie um Client ID OAuth (Aplicativo da Web)
4. Adicione os domínios autorizados

### 2. Google Sheets

1. Crie uma planilha com a aba `Sheet1`
2. Crie a aba `Users`
3. Adicione os cabeçalhos conforme documentado

### 3. Google Apps Script

1. Abra o Apps Script pela planilha
2. Cole o código do `Código.gs`
3. Execute `guardarChaveSecreta()` uma vez
4. Implante como Aplicativo da Web

### 4. Render

1. Conecte o repositório GitHub
2. Configure como Static Site
3. Deploy

## 🌐 Domínio
https://whatslink-48tc.onrender.com


## 📈 Limitações

| Recurso | Limite |
|---------|--------|
| Edições por dia | 5 |
| Google Sheets | 10M células |
| Apps Script | 20K requisições/dia |
| Render Free | Dorme após 15min |

## 🛡️ Licença

MIT License - Livre para uso e modificação.

## 👨‍💻 Autor

WhatsLink © 2026

---

**Feito com ❤️ no Brasil**
