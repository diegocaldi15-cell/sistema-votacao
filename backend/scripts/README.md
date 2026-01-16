# Scripts de Gerenciamento do Banco de Dados

Este diretório contém scripts para inicializar, resetar e popular o banco de dados do sistema de votação.

## 📜 Scripts Disponíveis

### 1. **init-db.js** - Inicializar o Banco

Cria o banco de dados e as tabelas se ainda não existirem.

```bash
npm run init:db
# ou
node scripts/init-db.js
```

**O que faz:**

- ✅ Cria o banco de dados `system_voting` (se não existir)
- ✅ Conecta ao banco via Sequelize
- ✅ Define as associações entre modelos
- ✅ Cria as tabelas (Poll, Option, Vote)

**Quando usar:**

- Na primeira vez que você configura o projeto
- Quando o banco de dados foi deletado
- Para restaurar a estrutura das tabelas

---

### 2. **reset-db.js** - Resetar o Banco

Remove todas as tabelas e as recria do zero.

```bash
npm run reset:db
# ou
node scripts/reset-db.js
```

**⚠️ AVISO:** Este script **deleta TODOS os dados** do banco!

**O que faz:**

- 🗑️ Remove todas as tabelas (Poll, Option, Vote)
- 📊 Recria as tabelas vazias
- Pede confirmação antes de executar

**Quando usar:**

- Quando você quer limpar todos os dados
- Durante desenvolvimento/testes
- Para recomeçar do zero

**Exemplo de uso:**

```
$ node scripts/reset-db.js
⚠️  AVISO: Este comando irá DELETAR TODOS os dados do banco!

Digite 'sim' para confirmar o reset do banco: sim
```

---

### 3. **seed-db.js** - Popular com Dados de Teste

Popula o banco com exemplos de enquetes, opções e votos.

```bash
npm run seed:db
# ou
node scripts/seed-db.js
```

**O que faz:**

- 📝 Cria 3 enquetes de exemplo:
  - Uma **em andamento** (programação favorita)
  - Uma **não iniciada** (sistema operacional)
  - Uma **finalizada** (melhor framework) com votos
- 🗳️ Adiciona votos na enquete finalizada

**Quando usar:**

- Depois de inicializar um banco vazio
- Para ter dados para testar a interface
- Para demonstrar o sistema em funcionamento

**Dados de Exemplo:**

```
Enquete 1: Em andamento
├── JavaScript / TypeScript
├── Python
├── Java
└── C / C++

Enquete 2: Não iniciada
├── Windows
├── macOS
├── Linux
└── Outro

Enquete 3: Finalizada (com votos)
├── React (10 votos)
├── Vue.js (7 votos)
├── Angular (5 votos)
└── Svelte (3 votos)
```

---

## 🚀 Fluxo Recomendado

### Primeira Vez Usando o Projeto:

```bash
# 1. Inicializar o banco de dados
npm run init:db

# 2. Popular com dados de teste
npm run seed:db

# 3. Iniciar o servidor
npm start
```

### Começar do Zero:

```bash
# 1. Resetar o banco (remove todos os dados)
npm run reset:db

# 2. Popular com novos dados de teste
npm run seed:db

# 3. Reiniciar o servidor
npm start
```

### Apenas Limpar Dados Mantendo Estrutura:

```bash
# 1. Resetar
npm run reset:db

# 2. Iniciar servidor vazio (sem dados)
npm start
```

---

## 📋 Scripts no package.json

Adicione estas linhas ao seu `package.json`:

```json
{
  "scripts": {
    "init:db": "node scripts/init-db.js",
    "reset:db": "node scripts/reset-db.js",
    "seed:db": "node scripts/seed-db.js",
    "setup:db": "npm run init:db && npm run seed:db"
  }
}
```

---

## 🔧 Variáveis de Ambiente

Os scripts usam as variáveis do arquivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha_aqui
DB_NAME=voting_system
DB_PORT=3306

PORT=5000
```

---

## ❓ Troubleshooting

### Erro: "Cannot find module"

```bash
npm install
```

### Erro: "Connection refused"

Verifique se MySQL está rodando:

```bash
# Windows
mysql -u root

# macOS/Linux
mysql -u root -p
```

### Erro: "Access denied for user"

Verifique as credenciais no `.env` e se coincidem com suas configurações de MySQL.

### Erro: "Database already exists"

Isso é normal! O script `init-db.js` verifica se o banco já existe e continua mesmo que exista.

---

## ℹ️ Informações Adicionais

- Todos os scripts incluem **confirmação antes de deletar dados**
- Os scripts **loggam todas as operações** para você acompanhar o progresso
- Os scripts são **idempotentes** onde possível (seguro rodar várias vezes)
