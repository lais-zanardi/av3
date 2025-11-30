# ✈️ Aerocode

API RESTful desenvolvida em **Node.js** com **TypeScript** para gerenciamento do ciclo de vida de montagem e manutenção de aeronaves. O sistema controla desde o cadastro de peças e aeronaves até a gestão de etapas, testes de qualidade e emissão de relatórios finais.

## Sobre o Projeto

O Aerocode foi projetado para garantir a integridade e rastreabilidade no processo de engenharia aeronáutica. O sistema implementa regras de negócio estritas para transição de estados de peças e validação de requisitos antes da aprovação final de uma aeronave.

## Tecnologias Utilizadas

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
</div>

## Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:
* [Node.js](https://nodejs.org/en/) (v18 ou superior)
* [MySQL](https://dev.mysql.com/downloads/installer/)

## Instalação e Configuração

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

## Acesso Inicial (Seed)

Ao rodar o projeto pela primeira vez, um usuário administrador é criado automaticamente:

  * **Usuário:** `admin`
  * **Senha:** `123`

## Testes de Carga

### Metodologia de Coleta de Métricas

Para a obtenção das métricas de desempenho, foi desenvolvido um script de teste de carga (`load-test.js`) utilizando a biblioteca `axios` para realizar requisições HTTP simultâneas à API. O teste avaliou três cenários distintos de concorrência: 1, 5 e 10 usuários simultâneos. As métricas foram coletadas da seguinte forma:

1.  **Tempo Total de Resposta:** Mensurado no lado do cliente (script de teste) utilizando a API `performance.now()` do Node.js. O cronômetro é iniciado imediatamente antes do envio da requisição e parado assim que a resposta é recebida, representando o tempo total de *round-trip*.

2.  **Tempo de Processamento do Servidor:** Mensurado no lado do servidor (API Express) através de um *middleware* customizado (`measureProcessingTime`). Este middleware intercepta a entrada da requisição e o evento de finalização da resposta (`res.end`), calculando a diferença com alta precisão utilizando `process.hrtime.bigint()`. O valor calculado é injetado no cabeçalho de resposta `X-Processing-Time-Ms`.

3.  **Latência de Rede:** Calculada pela diferença aritmética entre o *Tempo Total de Resposta* e o *Tempo de Processamento do Servidor*. Este valor representa o tempo gasto na transmissão de dados pela rede e overheads de buffer do sistema operacional.

### Relatórios
O projeto inclui um script dedicado (`load-test.js`) para testar a resiliência e performance da API sob concorrência, e um script Python (`relatorio.py`) para automatizar a extração dos resultados e a geração dos gráficos obrigatórios.

#### Pré-requisitos para Gráficos
Para gerar os gráficos automaticamente, você precisa do Python instalado e das bibliotecas abaixo:
```
pip install matplotlib numpy
```
#### Passo a Passo da Execução
1. Preparar o Ambiente (Seed) É crucial rodar o seed antes do teste. Isso garante que existam Aeronaves e Peças no banco para que o teste de carga possa simular relatórios e atualizações de status sem erros.

```
npm run seed
```

2. Executar o Teste de Carga Execute o script Node.js e direcione a saída para um arquivo de texto. O script simulará acessos concorrentes em rotas mistas.

```
node load-test.js > resultados.txt
```

3. Gerar os Gráficos Execute o script Python para ler o arquivo resultados.txt, processar as métricas e plotar os gráficos.

```
python relatorio.py
```

#### Resultados Gerados
Após a execução, os seguintes arquivos estarão disponíveis na raiz do projeto.

| Arquivo | Descrição | Visualização / Gráfico |
| :--- | :--- | :---: |
| **`resultados.txt`** | Log bruto com as médias de tempo das requisições. | [resultados.txt](assets/resultados.txt) |
| **`grafico_total.png`** | Tempo total de resposta (visão do cliente). | ![Tempo Total](assets/grafico_total.png) |
| **`grafico_processamento.png`** | Tempo de processamento interno da API (visão do servidor). | ![Tempo Processamento](assets/grafico_processamento.png) |
| **`grafico_latencia.png`** | Estimativa de latência de rede. | ![Latência de Rede](assets/grafico_latencia.png) |

-----
_Desenvolvido por Laís Zanardi Inocêncio 🌼_
