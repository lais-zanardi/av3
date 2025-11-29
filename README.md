# ✈️ Aerocode

API RESTful desenvolvida em **Node.js** com **TypeScript** para gerenciamento do ciclo de vida de montagem e manutenção de aeronaves. O sistema controla desde o cadastro de peças e aeronaves até a gestão de etapas, testes de qualidade e emissão de relatórios finais.

## 📋 Sobre o Projeto

O Aerocode foi projetado para garantir a integridade e rastreabilidade no processo de engenharia aeronáutica. O sistema implementa regras de negócio estritas para transição de estados de peças e validação de requisitos antes da aprovação final de uma aeronave.

### Principais Funcionalidades

* **Autenticação JWT:** Acesso seguro baseado em tokens para funcionários.
* **Gestão de Aeronaves:** Cadastro e controle de modelos comerciais e militares.
* **Máquina de Estados de Peças:** Controle rigoroso do fluxo de peças (`EM_PRODUCAO` ➔ `EM_TRANSPORTE` ➔ `PRONTA`).
* **Controle de Etapas:** Associação de peças e funcionários a etapas específicas de montagem.
* **Geração de Relatórios:** Sistema inteligente que impede a geração de relatórios se houverem etapas pendentes, testes reprovados ou peças não finalizadas.
* **Monitoramento de Performance:** Middleware customizado para medição de tempo de resposta da API.

## 🚀 Tecnologias Utilizadas

* [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [Prisma ORM](https://www.prisma.io/)
* [MySQL](https://www.mysql.com/)
* [JWT (JSON Web Tokens)](https://jwt.io/) & [BcryptJS](https://www.npmjs.com/package/bcryptjs)
* [Axios](https://axios-http.com/) (para testes de carga)

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (v18 ou superior)
* [MySQL](https://dev.mysql.com/downloads/installer/)

## 🔧 Instalação e Configuração

1. **Clone o repositório**
```
   git clone [https://github.com/lais-zanardi/av3.git](https://github.com/lais-zanardi/av3.git)
   cd av3
```


2.  **Instale as dependências**

```
    npm install
```

3.  **Configure as Variáveis de Ambiente**
    Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:

```
    # Configuração do Banco de Dados (Usuário, Senha, Host, Porta e Nome do Banco)
    DATABASE_URL="mysql://root:sua_senha@localhost:3306/aerocode"

    # Segredo para assinatura do JWT
    JWT_SECRET="seu_segredo_super_seguro"

    # Porta do Servidor
    PORT=3000
    NODE_ENV="development"
```

4.  **Prepare o Banco de Dados**
    O script de desenvolvimento já cuida das migrações e do seed inicial:

```
    npm run dev
```


*Este comando irá:*

* Gerar o cliente Prisma.
* Resetar e aplicar as migrações no banco.
* Rodar o `seed` (popular o banco com dados iniciais).
* Iniciar o servidor.

## 👤 Acesso Inicial (Seed)

Ao rodar o projeto pela primeira vez, um usuário administrador é criado automaticamente:

  * **Usuário:** `admin`
  * **Senha:** `123`

## 🧪 Testes de Carga

O projeto inclui um script dedicado para testar a resiliência e performance da API sob concorrência.

Para executar o teste de carga:

```
node load-test.js
```

*O script simula cenários com 1, 5 e 10 usuários simultâneos e exibe métricas de latência e tempo de processamento.*

-----

Desenvolvido como parte da avaliação acadêmica AV3.