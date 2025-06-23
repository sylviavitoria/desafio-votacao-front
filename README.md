# 🗳️ Sistema de Votação VotaFácil

## 🔍 Visão Geral

O **VotaFácil** é uma aplicação web completa para gerenciamento de pautas e votações em assembleias.  
A plataforma permite **cadastrar associados, criar pautas, iniciar sessões de votação, registrar votos e visualizar resultados** de forma simples e intuitiva.

---

## 🧠 Tecnologias Utilizadas

### Frontend

- **React 18:** Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript:** Linguagem de programação tipada que compila para JavaScript
- **Vite:** Ferramenta de build moderna e rápida para projetos frontend
- **React Router Dom:** Gerenciamento de rotas e navegação
- **Axios:** Cliente HTTP para realizar requisições à API
- **CSS Puro:** Estilização sem dependências externas

### Padrões e Arquitetura

- **Custom Hooks:** Reutilização de lógica de estado e efeitos
- **Componentes Genéricos:** Padrões de design para reutilização de componentes
- **Design Responsivo:** Layout adaptável para diferentes dispositivos
- **Componentização:** Divisão da interface em componentes reutilizáveis

---

## 🎨 Imagens do layout:
### Abaixo estão algumas imagens que ilustram o layout e o funcionamento da aplicação.

![image](https://github.com/user-attachments/assets/2894cb9f-c238-464b-a87f-63987db1299f)

![image](https://github.com/user-attachments/assets/e88e6cf4-204a-4f66-b7e2-5ea2b6862ca6)

![image](https://github.com/user-attachments/assets/bfe822ae-e373-43db-8d58-c856173703b9)

![image](https://github.com/user-attachments/assets/cd7de064-46ee-423d-b03a-878109296270)

![image](https://github.com/user-attachments/assets/e64602c8-06df-43a5-b2d4-c8b5b80bc289)

![image](https://github.com/user-attachments/assets/043f3187-7127-4c58-920a-59ac69f841f2)

![image](https://github.com/user-attachments/assets/c43ab32a-4c1f-472f-b443-579a1ac1e43d)




---

## 📂 Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   ├── __tests__/      # Testes para componentes
│   ├── form/           # Componentes de formulário
│   │   └── __tests__/  # Testes para componentes de formulário
│   ├── generic/        # Componentes genéricos reutilizáveis
│   │   └── __tests__/  # Testes para componentes genéricos
│   └── ...
├── hooks/              # Custom hooks React
│   └── __tests__/      # Testes para hooks
├── pages/              # Páginas/rotas da aplicação
│   └── __tests__/      # Testes para páginas (se houver)
├── service/            # Serviços para comunicação com API
│   └── __tests__/      # Testes para serviços (se houver)
├── types/              # Definições de tipos TypeScript
├── setupTests.ts       # Configuração global para testes
└── index.css           # Estilos globais da aplicação
```
## 🗺️ Páginas Principais

### 🔸 Home
- Exibe todas as pautas disponíveis
- Permite navegar para os detalhes de cada pauta

### 🔸 Pautas
- **Listar Pautas:** Visualização de todas as pautas cadastradas
- **Criar Pauta:** Formulário para cadastrar uma nova pauta
- **Editar Pauta:** Formulário para editar uma pauta existente
- **Detalhe da Pauta:** Visualização detalhada e opções para iniciar votação

### 🔸 Associados
- **Listar Associados:** Visualização de todos os associados cadastrados
- **Criar Associado:** Formulário para cadastro de novos associados
- **Editar Associado:** Formulário para alterar dados de um associado

### 🔸 Sessões de Votação
- **Listar Sessões:** Visualização de todas as sessões de votação
- **Detalhes da Sessão:** Informações sobre período e status da votação
- **Atualizar Sessão:** Opção para estender o período de votação

---

## ⚙️ Funcionalidades Principais

### ✔️ Gestão de Associados
- Cadastro de associados com nome, CPF e email
- Listagem de associados com paginação
- Edição e exclusão de associados

### ✔️ Gestão de Pautas
- Criação de pautas com título, descrição e criador
- Listagem de pautas com paginação e filtros
- Visualização detalhada com status e resultados de votação
- Edição e exclusão de pautas (quando no status **"Criada"**)
- Visualização de status da pauta:  
  **Criada | Em votação | Aprovada | Recusada | Empatada**

### ✔️ Sessões de Votação
- Criação de sessão de votação para uma pauta
- Duas modalidades de abertura:
  - **Abertura Imediata:** Define apenas a duração em minutos
  - **Agendamento:** Define data/hora de início e fim
- Visualização de status da sessão:  
  **Aberta | Fechada | Finalizada**
- Possibilidade de estender período de votação para sessões abertas

### ✔️ Votação
- Interface de votação simples (opções **"Sim"** ou **"Não"**)
- Validação de associado mediante ID
- Confirmação e feedback do voto registrado
- Visualização de resultados após encerramento

---

## 🚦 Estados de Pauta

- **Criada:** Pauta recém-cadastrada
- **Em Votação:** Pauta com sessão de votação aberta
- **Aprovada:** Pauta com maioria de votos **"Sim"**
- **Recusada:** Pauta com maioria de votos **"Não"**
- **Empatada:** Mesmo número de votos **"Sim"** e **"Não"**

---

## 🛑 Validações e Tratamento de Erros

### 📑 Validações de Formulários
- Campos obrigatórios em todos os formulários
- Validação de formato de **CPF** (11 dígitos numéricos)
- Validação de formato de **email**
- Feedback visual para campos com erro
- Mensagens de erro específicas para cada tipo de validação

### 🔗 Tratamento de Erros de API
- **Interceptor Axios** para tratamento uniforme dos erros
- Exibição de mensagens amigáveis para erros de backend
- Feedback visual para:
  - Operações em andamento (**loading**)
  - Operações bem-sucedidas

---

## 🎨 Recursos Visuais

### 🖥️ Interface Responsiva
- Layout adaptável para dispositivos móveis e desktop
- **Cards** para exibição de listagens
- Botões de ação contextuais
- Indicadores de status com cores distintas

### 🧩 Componentes Visuais
- **Card:** Exibição de entidades com ações específicas
- **Banner:** Header para as páginas principais
- **Botões:** Estilização consistente para ações primárias e secundárias
- **Formulários:** Layout padronizado com validação visual
- **Paginação:** Navegação entre páginas de resultados

---

## 🔗 Comunicação com Backend

### 🔥 Endpoints Utilizados
- **Associados:** CRUD completo para gestão de associados
- **Pautas:** CRUD completo para gestão de pautas
- **Sessões de Votação:** Criação, listagem e atualização
- **Votos:** Registro e consulta de resultados

### ⚙️ Tratamento de Respostas
- Tratamento padronizado para paginação
- Formatação de dados para exibição ao usuário
- Manipulação de códigos de status HTTP
---

## 🧪 Testes
O projeto utiliza Jest e Testing Library para testes unitários. Execute os testes com:
```bash
npm run test           # Executa todos os testes
npm run test:coverage  # Gera relatório de cobertura
```
---

# 🌬️ Como Executar

### Pré-requisitos

- Node.js (v18 ou superior)  
- npm ou yarn  
- Clone o repositório do back-end, para que você consiga rodar o projeto. Siga as instruções e configurações do back-end: [desafio-votacao](https://github.com/sylviavitoria/desafio-votacao)

## Passo a passo para Execução

### 1. Clone o repositório do Front e do Back
```bash
# Clone o repositório do FRONT
git clone https://github.com/sylviavitoria/desafio-votacao-front.git
cd desafio-votacao-front

# Siga as instruções do repositório do BACK-END para conseguir rodar a aplicação
Link repositório: https://github.com/sylviavitoria/desafio-votacao
git clone https://github.com/sylviavitoria/desafio-votacao.git
cd desafio-votacao

```

### 2. Instale as dependências
```bash
npm install
```
# Execute o projeto em modo de desenvolvimento
```bash
npm run dev
```

Acesse a aplicação em: [http://localhost:5173](http://localhost:5173)


---
