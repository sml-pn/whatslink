# 🔗 WhatsLink

Plataforma gratuita para criar páginas de recepção profissionais para WhatsApp.

## 📋 Sobre o Projeto

O WhatsLink permite que empresas e profissionais criem links personalizados que direcionam para uma página de recepção elegante, com informações da empresa, múltiplos botões de WhatsApp, redes sociais, localização e muito mais.

## ✨ Funcionalidades

- ✅ Login obrigatório com Google para criar links
- ✅ Página de recepção personalizada
- ✅ 6 temas profissionais (Verde, Azul, Roxo, Laranja, Preto, Cardápio)
- ✅ Múltiplos números de WhatsApp
- ✅ Botões personalizados (nome de cada botão)
- ✅ Suporte a logo e banner
- ✅ Mensagem automática para WhatsApp
- ✅ Localização com Google Maps
- ✅ Redes sociais (Instagram, Facebook, Site)
- ✅ Horário de funcionamento
- ✅ Login com Google para gerenciar links
- ✅ Edição limitada (5x por dia)
- ✅ Criptografia de dados sensíveis (WhatsApp, mensagem, email)
- ✅ Contador de cliques
- ✅ Design responsivo
- ✅ Menu hambúrguer animado no mobile
- ✅ Carrossel de temas
- ✅ SEO completo (Open Graph, Twitter Cards, Schema.org)
- ✅ Favicon SVG embutido
- ✅ 100% gratuito

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| HTML5 | Estrutura das páginas |
| CSS3 | Estilos e animações |
| JavaScript | Lógica e validações |
| Google Apps Script | API backend |
| Google Sheets | Banco de dados |
| Google OAuth 2.0 | Autenticação |
| Material Icons | Ícones |
| Font Awesome | Ícones de redes sociais |
| Render | Hospedagem |
| GitHub | Versionamento |

## 📁 Estrutura do Projeto
whatslink/
├── index.html → Página principal (apresentação)
├── criar.html → Página de criação (login obrigatório)
├── redirect.html → Página de recepção (pública)
├── edit.html → Página "Meus Links" (login Google)
├── script.js → Lógica do carrossel e menu
├── Código.gs → Google Apps Script (backend)
├── README.md → Documentação
├── .gitignore → Arquivos ignorados
├── robots.txt → SEO
├── sitemap.xml → SEO
├── og-image.svg → Imagem para redes sociais
└── css/
├── base.css → Estilos comuns
├── index.css → Página inicial
├── edit.css → Páginas criar/editar
└── redirect/
├── verde.css → Tema Verde Glass
├── azul.css → Tema Azul Corporate
├── roxo.css → Tema Roxo Gradient
├── laranja.css → Tema Laranja Energia
├── preto.css → Tema Preto Luxury
└── cardapio.css → Tema Cardápio Digital


## 🚀 Como Funciona

### Fluxo de Criação
Usuário → Acessa index.html → Clica "Criar link" → Faz login Google → Preenche formulário → Gera link → Compartilha


### Fluxo do Visitante
Visitante → Clica no link → Vê página personalizada → Clica no botão WhatsApp → Conversa


### Fluxo de Edição
Usuário → Acessa "Meus Links" → Login Google → Vê seus links → Edita (5x/dia) → Salva


## 📊 Estrutura da Planilha

### Sheet1 (Links) - 21 colunas

| Coluna | Campo | Criptografado |
|--------|-------|---------------|
| A | id | Não |
| B | empresa | Não |
| C | whatsapp | ✅ Sim |
| D | whatsapp2 | ✅ Sim |
| E | slug | Não |
| F | mensagem | ✅ Sim |
| G | logo_url | Não |
| H | banner_url | Não |
| I | descricao | Não |
| J | localizacao | Não |
| K | instagram | Não |
| L | facebook | Não |
| M | site | Não |
| N | horario | Não |
| O | tema | Não |
| P | botao_whatsapp | Não |
| Q | botao_whatsapp2 | Não |
| R | cliques | Não |
| S | created_at | Não |
| T | user_email | ✅ Sim |
| U | edit_token | Não |

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
- **Email vinculado automaticamente** ao criar link

## 🎨 Temas Disponíveis

| Tema | Cor Principal | Descrição |
|------|---------------|-----------|
| Verde Glass | #25D366 | Vidro translúcido • WhatsApp |
| Azul Corporate | #3b82f6 | Dark • Profissional |
| Roxo Gradient | #8b5cf6 | Gradiente animado • Premium |
| Laranja Energia | #f97316 | Vibrante • Acolhedor |
| Preto Luxury | #d4af37 | Dourado • Sofisticado |
| Cardápio Digital | #ff8f00 | Restaurantes • Delivery |

## 📝 Como Configurar

### 1. Google Cloud Console

1. Crie um projeto no Google Cloud Console
2. Configure a tela de consentimento OAuth
3. Crie um Client ID OAuth (Aplicativo da Web)
4. Adicione os domínios autorizados:
   - `https://whatslink-48tc.onrender.com`
   - `https://whatslink-48tc.onrender.com/criar.html`
   - `https://whatslink-48tc.onrender.com/edit.html`

### 2. Google Sheets

1. Crie uma planilha com a aba `Sheet1` (21 colunas)
2. Crie a aba `Users` (7 colunas)
3. Adicione os cabeçalhos conforme documentado acima

### 3. Google Apps Script

1. Abra o Apps Script pela planilha
2. Cole o código do `Código.gs`
3. Execute `guardarChaveSecreta()` uma vez
4. Implante como Aplicativo da Web (nova versão)
5. Copie a URL `/exec` e use nos arquivos HTML

### 4. Render

1. Conecte o repositório GitHub
2. Configure como Static Site
3. Publish Directory: `.`
4. Deploy

## 🌐 Domínio
https://whatslink-48tc.onrender.com


## 📈 Limitações

| Recurso | Limite |
|---------|--------|
| Edições por dia | 5 |
| Google Sheets | 10M células |
| Apps Script | 20K requisições/dia |
| Render Free | Dorme após 15min sem uso |

## 🛡️ Licença

MIT License - Livre para uso e modificação.

## 👨‍💻 Autor

WhatsLink © 2026

---

**Feito com ❤️ no Brasil**
