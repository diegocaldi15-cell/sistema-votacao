# 🗳️ Sistema de Votação

## ✨ Características

### 🎯 Funcionalidades Principais

- ✅ **Criar Enquetes** - Formulário intuitivo com opções dinâmicas
- ✅ **Votar em Tempo Real** - Resultados atualizados instantaneamente via WebSocket
- ✅ **Gerenciar Enquetes** - Editar e deletar enquetes facilmente
- ✅ **Filtrar por Status** - Não iniciada, Em andamento, Finalizada
- ✅ **Contar Votos** - Visualizar número de votos ao lado de cada opção
- ✅ **Reordenar Opções** - Drag-and-drop para reorganizar opções
- ✅ **Suporte Unicode** - Emojis e caracteres especiais funcionam perfeitamente

### 🎨 Design

- 🌈 Interface moderna com gradientes e sombras
- 📱 Totalmente responsivo (Desktop, Tablet, Mobile)
- ⚡ Animações suaves e transições elegantes
- 🎯 Componentes bem estruturados e reutilizáveis
- ♿ Acessibilidade focada (focus states, keyboard navigation)

### 🔧 Tecnologias

**Backend:**

- Node.js com Express.js
- Sequelize ORM
- MySQL Database
- Socket.io para comunicação em tempo real
- CORS habilitado
- UTF-8 completo

**Frontend:**

- React 19.2.0
- Vite 7.3.1 (build tool)
- CSS Modules com Flexbox
- Axios para requisições HTTP
- Socket.io-client para WebSocket

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- MySQL 5.7+

### Instalação Rápida

```bash
# 1. Ir para backend e instalar
cd backend
npm install

# 2. Configurar .env com credenciais MySQL
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=sua_senha
# DB_NAME=voting_system
# DB_PORT=3306
# PORT=5000

# 3. Inicializar e popular banco de dados
npm run setup:db

# 4. Iniciar servidor
npm start

# Em outro terminal - Frontend
cd frontend
npm install
npm run dev

# 5. Abrir navegador
# http://localhost:5173
```

### Configuração Detalhada

Veja [SETUP.md](./SETUP.md) para instruções completas de configuração.

---

## 📁 Estrutura do Projeto

```
root/
│
├── 📦 backend/
│   ├── 📂 config/
│   │   └── database.js          # Configuração Sequelize
│   ├── 📂 models/
│   │   ├── Poll.js              # Modelo de enquete
│   │   ├── Option.js            # Modelo de opção
│   │   └── Vote.js              # Modelo de voto
│   ├── 📂 scripts/              # Scripts utilitários
│   │   ├── check-db.js          # Verifica o BD
│   │   ├── init-db.js           # Inicializar BD
│   │   ├── reset-db.js          # Resetar BD
│   │   ├── seed-db.js           # Popular BD
│   │   ├── GUIDE.md             # Guia de Instalação
│   │   └── README.md            # Documentação
│   ├── app.js                   # Servidor Express
│   ├── package.json
│   └── .env                     # Variáveis de ambiente
│
├── 🎨 frontend/
│   ├── 📂 assets/
│   ├── 📂 public/
│   │   ├── Favicon.svg
│   ├── 📂 src/
│   │   ├── App.jsx              # Componente principal
│   │   ├── main.jsx
│   │   ├── 📂 components/
│   │   │   ├── PollList.jsx     # Lista de enquetes
│   │   │   ├── PollDetail.jsx   # Detalhes e votação
│   │   │   └── PollForm.jsx     # Criar/editar enquete
│   │   ├── 📂 styles/
│   │   │   ├── global.css
│   │   │   ├── App.module.css
│   │   │   ├── PollList.module.css
│   │   │   ├── PollDetail.module.css
│   │   │   └── PollForm.module.css
│   │   └── 📂 utils/
│   │       └── dateUtils.js
│   ├── .env.local               # Env para testes
│   ├── .env.production          # Env para produção
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── SETUP.md                     # Guia de configuração
├── README.md                    # Este arquivo
├── INDEX.md                     # Índice
├── QUICK-START.md               # Guia rápido
├── SYSTEM-MAP.md                # Diagrama visual
├── DATABASE-SETUP.md            # Resumo do BD
├── index.html                   # Índice visual
└── .gitignore
```

---

## 🔌 API Endpoints

### Enquetes (Polls)

| Método | Endpoint         | Descrição                 |
| ------ | ---------------- | ------------------------- |
| GET    | `/api/polls`     | Listar todas as enquetes  |
| POST   | `/api/polls`     | Criar nova enquete        |
| GET    | `/api/polls/:id` | Obter detalhes da enquete |
| PUT    | `/api/polls/:id` | Atualizar enquete         |
| DELETE | `/api/polls/:id` | Deletar enquete           |

### Votação

| Método | Endpoint                 | Descrição                   |
| ------ | ------------------------ | --------------------------- |
| POST   | `/api/polls/:id/vote`    | Votar em uma opção          |
| GET    | `/api/polls/:id/results` | Obter resultados da enquete |

---

## 🗄️ Modelo de Dados

### Poll (Enquete)

```javascript
{
  id: Integer (Primary Key),
  title: String,
  description: String,
  startDate: DateTime,
  endDate: DateTime,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Option (Opção)

```javascript
{
  id: Integer (Primary Key),
  text: String,
  pollId: Integer (Foreign Key),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Vote (Voto)

```javascript
{
  id: Integer (Primary Key),
  optionId: Integer (Foreign Key),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 📊 Scripts de Banco de Dados

### Inicializar

```bash
npm run init:db
```

Cria o banco de dados e as tabelas necessárias.

### Resetar

```bash
npm run reset:db
```

⚠️ Deleta TODOS os dados e recria as tabelas vazias.

### Popular

```bash
npm run seed:db
```

Popula com 3 enquetes de exemplo (uma em andamento, uma não iniciada, uma finalizada com votos).

### Configurar Tudo

```bash
npm run setup:db
```

Executa init + seed automaticamente (recomendado para primeira vez).

---

## 🎨 Paleta de Cores

```
--primary:        #6366f1    (Indigo)
--primary-light:  #818cf8    (Indigo Light)
--primary-dark:   #4f46e5    (Indigo Dark)
--secondary:      #ec4899    (Pink)
--success:        #10b981    (Green)
--warning:        #f59e0b    (Amber)
--danger:         #ef4444    (Red)
--bg:             #f8fafc    (Slate Light)
--surface:        #ffffff    (White)
--text-primary:   #1e293b    (Slate Dark)
--text-secondary: #64748b    (Slate)
--border:         #e2e8f0    (Slate Light)
```

---

## 📱 Responsividade

| Breakpoint | Resolução      | Dispositivos       |
| ---------- | -------------- | ------------------ |
| Desktop    | > 1200px       | Monitores, Laptops |
| Tablet     | 768px - 1200px | iPads, Tablets     |
| Mobile     | < 768px        | Smartphones        |

---

## 🔄 Fluxo de Votação em Tempo Real

1. **Usuário vota** na opção
2. **Frontend envia** POST para `/api/polls/:id/vote`
3. **Backend cria** registro de Vote
4. **Socket.io emite** evento `updateVotes`
5. **Todos clientes** recebem atualização
6. **Interface atualiza** badges de contagem instantaneamente

---

## 🧪 Dados de Teste

Quando você executa `npm run seed:db`, são criadas:

### Enquete 1: Em Andamento

**Qual é sua linguagem de programação favorita?**

- JavaScript / TypeScript
- Python
- Java
- C / C++

### Enquete 2: Não Iniciada

**Qual sistema operacional você usa?**

- Windows
- macOS
- Linux
- Outro

### Enquete 3: Finalizada

**Qual é o melhor framework web?**

- React (10 votos)
- Vue.js (7 votos)
- Angular (5 votos)
- Svelte (3 votos)

---

## 🐛 Troubleshooting

### "Cannot connect to MySQL"

1. Verifique se MySQL está rodando
2. Confirme credenciais em `.env`
3. Execute `npm run init:db` novamente

### "Port already in use"

Mude a porta em `.env` ou mate o processo:

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dados não aparecem

1. Verifique se backend está rodando
2. Abra F12 no navegador e veja console
3. Execute `npm run seed:db` para popular

---

## 📚 Documentação Adicional

- [SETUP.md](./SETUP.md) - Instruções completas de configuração
- [backend/scripts/README.md](./backend/scripts/README.md) - Documentação dos scripts de BD
- [backend/config/database.js](./backend/config/database.js) - Configuração do banco
