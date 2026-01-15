# 📊 Guia: Scripts de Banco de Dados

Este documento explica como usar os scripts de gerenciamento do banco de dados do sistema de votação.

## 🎯 Resumo Rápido

| Tarefa             | Comando            | Quando Usar                |
| ------------------ | ------------------ | -------------------------- |
| **Setup Completo** | `npm run setup:db` | Primeira vez (init + seed) |
| **Só Inicializar** | `npm run init:db`  | Criar banco vazio          |
| **Só Popular**     | `npm run seed:db`  | Adicionar dados de teste   |
| **Resetar Tudo**   | `npm run reset:db` | Deletar todos os dados     |

---

## 📋 Fluxo de Primeira Configuração

### Passo 1: Instalar Dependências

```bash
cd backend
npm install
```

### Passo 2: Configurar `.env`

```bash
# Crie o arquivo .env com:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=sistema_votacao
DB_PORT=3306
PORT=5000
```

### Passo 3: Setup Automático

```bash
npm run setup:db
```

Isso faz tudo em um comando:

1. ✅ Cria o banco de dados
2. ✅ Cria as tabelas
3. ✅ Popula com dados de teste

### Passo 4: Iniciar Servidor

```bash
npm start
# Pronto! Servidor rodando em http://localhost:5000
```

---

## 🚀 Cenários de Uso

### Cenário 1: Começando do Zero

```bash
npm run setup:db    # Faz tudo automaticamente
npm start           # Inicia servidor
```

### Cenário 2: Limpar e Recomeçar

```bash
npm run reset:db    # Deleta dados (pede confirmação)
npm run seed:db     # Adiciona dados de teste
npm start           # Reinicia
```

### Cenário 3: Só Inicializar (Banco Vazio)

```bash
npm run init:db     # Cria estrutura vazia
npm start           # Servidor inicia sem dados
```

### Cenário 4: Adicionar Dados Depois

```bash
npm run seed:db     # Popula com dados de teste
# Agora tem dados para trabalhar
```

---

## 📝 Descrição Detalhada de Cada Script

### 1. `npm run init:db` - Inicializar Banco

**Arquivo:** `backend/scripts/init-db.js`

**O que faz:**

```
1. Conecta ao MySQL
2. Cria banco 'sistema_votacao' (se não existir)
3. Define relações entre tabelas
4. Cria as tabelas:
   - polls (enquetes)
   - options (opções)
   - votes (votos)
```

**Quando usar:**

- ✅ Na primeira configuração
- ✅ Quando deletou o banco por acidente
- ✅ Para restaurar estrutura vazia

**Exemplo:**

```bash
$ npm run init:db

🔧 Iniciando preparação do banco de dados...

📦 Criando banco de dados...
✓ Banco de dados 'sistema_votacao' criado/verificado com sucesso

🔗 Conectando ao banco de dados...
✓ Conexão com MySQL estabelecida com sucesso

🔗 Definindo associações entre modelos...
✓ Associações definidas com sucesso

📊 Criando tabelas...
✓ Tabelas sincronizadas com sucesso

✅ Banco de dados inicializado com sucesso!
```

---

### 2. `npm run reset:db` - Resetar Banco

**Arquivo:** `backend/scripts/reset-db.js`

**O que faz:**

```
1. Pede confirmação (segurança)
2. Deleta TODAS as tabelas
3. Recria as tabelas vazias
```

**⚠️ AVISO:** Deleta TODOS os dados! Não tem volta!

**Quando usar:**

- ✅ Para limpar tudo e começar novamente
- ✅ Quando dados ficam corrompidos
- ✅ Entre testes automatizados
- ❌ NUNCA em produção!

**Exemplo:**

```bash
$ npm run reset:db

⚠️  AVISO: Este comando irá DELETAR TODOS os dados do banco!

Digite 'sim' para confirmar o reset do banco: sim

🔧 Resetando banco de dados...

🔗 Conectando ao banco de dados...
✓ Conexão estabelecida

🗑️  Removendo tabelas antigas...
✓ Tabelas removidas

📊 Criando novas tabelas...
✓ Novas tabelas criadas

✅ Banco de dados resetado com sucesso!
```

---

### 3. `npm run seed:db` - Popular com Dados

**Arquivo:** `backend/scripts/seed-db.js`

**O que faz:**

```
1. Conecta ao banco
2. Limpa dados anteriores
3. Cria 3 enquetes de exemplo
4. Adiciona votos nas enquetes
```

**Dados criados:**

**Enquete 1:** "Qual é sua linguagem de programação favorita?" (Em andamento)

- JavaScript / TypeScript
- Python
- Java
- C / C++

**Enquete 2:** "Qual sistema operacional você usa?" (Não iniciada)

- Windows
- macOS
- Linux
- Outro

**Enquete 3:** "Qual é o melhor framework web?" (Finalizada)

- React (10 votos) ✓
- Vue.js (7 votos) ✓
- Angular (5 votos) ✓
- Svelte (3 votos) ✓

**Quando usar:**

- ✅ Para ter dados para testar
- ✅ Depois de inicializar banco vazio
- ✅ Após resetar o banco

**Exemplo:**

```bash
$ npm run seed:db

🌱 Populando banco de dados com dados de teste...

🔗 Conectando ao banco de dados...
✓ Conexão estabelecida

📊 Sincronizando tabelas...
✓ Tabelas sincronizadas

🗑️  Limpando dados antigos...
✓ Dados antigos removidos

📝 Criando enquetes de exemplo...
✓ Enquetes criadas com sucesso

✅ Banco de dados populado com sucesso!
```

---

### 4. `npm run setup:db` - Fazer Tudo

**Equivalente a:**

```bash
npm run init:db && npm run seed:db
```

**O que faz:**

1. Executa `init:db` (cria estrutura)
2. Executa `seed:db` (popula com dados)

**Quando usar:**

- ✅ Na primeira vez (recomendado!)
- ✅ Para setup rápido
- ✅ Em novos computadores

**Exemplo:**

```bash
$ npm run setup:db

# Executa init:db...
✅ Banco de dados inicializado com sucesso!

# Executa seed:db...
✅ Banco de dados populado com sucesso!

# Pronto! Pode começar a usar
```

---

## 🔄 Fluxos Completos

### Fluxo 1: Primeira Configuração

```bash
# 1. Instalar
cd backend
npm install

# 2. Configurar .env (editar arquivo manualmente)

# 3. Setup automático
npm run setup:db

# 4. Iniciar
npm start

# 5. Abrir navegador
# http://localhost:5173 (se frontend também está rodando)
```

### Fluxo 2: Desenvolvimento Diário

```bash
# Iniciar servidor
npm run dev

# Se precisar limpar dados:
npm run reset:db
npm run seed:db
npm run dev
```

### Fluxo 3: Testes Automatizados

```bash
# Antes de cada teste
npm run reset:db
npm run seed:db

# Rodar testes
npm test
```

---

## 🛠️ Troubleshooting

### Erro: "Cannot find module"

```bash
npm install
```

### Erro: "Connection refused"

```bash
# Verifique se MySQL está rodando:
mysql -u root    # Windows
mysql -u root -p # macOS/Linux
```

### Erro: "Access denied for user"

```bash
# Verifique arquivo .env
# Corrija DB_PASSWORD e tente novamente
npm run init:db
```

### Erro: "Database already exists"

```bash
# Isso é NORMAL!
# O script init-db.js verifica se existe e continua
# Se quiser limpar, use:
npm run reset:db
```

### Script não encontrado / Erro "not found"

```bash
# Certifique-se de estar na pasta backend
cd backend

# Verifique se package.json tem os scripts:
cat package.json | grep "npm run"
```

---

## 📊 Estrutura do Banco Criado

```sql
-- Banco de dados
DATABASE: sistema_votacao

-- Tabelas criadas
TABLE: polls (enquetes)
├── id (Primary Key)
├── title (VARCHAR)
├── description (TEXT)
├── startDate (DATETIME)
├── endDate (DATETIME)
├── createdAt (DATETIME)
└── updatedAt (DATETIME)

TABLE: options (opções)
├── id (Primary Key)
├── text (VARCHAR)
├── pollId (Foreign Key → polls.id)
├── createdAt (DATETIME)
└── updatedAt (DATETIME)

TABLE: votes (votos)
├── id (Primary Key)
├── optionId (Foreign Key → options.id)
├── createdAt (DATETIME)
└── updatedAt (DATETIME)
```

---

## 📱 Dados de Teste Explicados

Quando você roda `npm run seed:db`, são criadas enquetes em diferentes **estados**:

### Status de Enquete

```
NOT_STARTED:  Data início ainda não chegou → Você não pode votar
ACTIVE:       Dentro do período → Você PODE votar
FINISHED:     Data fim passou → Você não pode votar (mostra resultados)
```

### Por que 3 enquetes diferentes?

Para testar todos os estados e funcionalidades:

- ✅ Testar filtragem por status
- ✅ Testar votação (só na ativa)
- ✅ Testar visualização de resultados (na finalizada)
- ✅ Testar que não pode votar em finalizada

---

## 🔐 Segurança

### Importante sobre `reset:db`

```bash
# Antes de executar, confirme:
✓ Seus dados foram salvos em outro lugar?
✓ Você realmente quer deletar TUDO?
✓ Você digitou 'sim' com convicção?

# O script pede confirmação digitando 'sim'
# Qualquer outra resposta cancela
```

### Em Produção

```bash
# NUNCA execute reset:db em produção!
# Use backups regulares do MySQL
```

---

## ❓ FAQ

**P: Posso modificar os dados de teste?**  
R: Sim! Edite `backend/scripts/seed-db.js` e customize as enquetes/opções.

**P: Como adiciono mais dados sem resetar?**  
R: Crie um novo script baseado em `seed-db.js` e execute separadamente.

**P: Perdí meus dados, como recupero?**  
R: Infelizmente, após `reset:db` é irreversível. Sempre mantenha backups!

**P: Como faço backup do banco?**  
R: Use `mysqldump` ou tools de backup do MySQL.

**P: Posso usar em outro banco de dados?**  
R: Sim! Modifique `.env` para PostgreSQL, SQLite, etc.

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique se MySQL está rodando
2. Confirme credenciais em `.env`
3. Leia os logs de erro completamente
4. Tente `npm run reset:db` + `npm run setup:db`
5. Procure por similar issue no README.md
