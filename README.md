# Client API

Este é um serviço de **API REST** para realizar operações CRUD em clientes. O projeto foi desenvolvido utilizando **Node.js**, **TypeScript**, **Jest** para testes e **Serverless Framework** para deploy.

## Requisitos

- **Node.js**: O projeto requer a versão `>=20.x`.
- **Docker**: Para rodar o DynamoDB localmente.
- **Serverless Framework**: Para deploy e execução offline.

## Configuração do Ambiente

### Usando Docker para DynamoDB Local

1. **Clonar o repositório**:
   Primeiro, clone o repositório para o seu ambiente local.

   ```bash
   git clone https://github.com/seu-usuario/client-api.git
   cd client-api
   ```

2. **Rodando DynamoDB Local com Docker Compose**:
   O Docker Compose é usado para rodar o DynamoDB localmente. Para iniciar o serviço, execute:

   ```bash
   docker compose up -d
   ```

   Isso iniciará o DynamoDB Local e configurará o banco de dados para ser utilizado pelo seu serviço.

3. **Verificando os containers em execução**:

   Para verificar se os containers estão ativos, execute:

   ```bash
   docker ps
   ```

   Você deve ver o DynamoDB Local rodando no seu ambiente.

### Usando NVM (Node Version Manager)

1. **Instalar a versão correta do Node.js**:

   O projeto utiliza a versão do Node.js especificada no arquivo `.nvmrc`. Para garantir que você está usando a versão correta do Node.js, execute:

   ```bash
   nvm install
   ```

2. **Usar a versão do Node.js**:

   Para configurar o Node.js para a versão correta, execute:

   ```bash
   nvm use
   ```

   Isso definirá a versão do Node.js para a especificada no arquivo `.nvmrc`.

## Instalando as Dependências

Com o ambiente configurado, instale as dependências do projeto:

```bash
npm install
```

## Comandos

### Iniciar o Ambiente de Desenvolvimento

Para iniciar o serviço localmente utilizando o **Serverless Offline**, execute:

```bash
npm run dev
```

Isso iniciará o servidor offline, permitindo que você faça chamadas HTTP para o seu serviço localmente.

### Compilação do TypeScript

Para compilar o código TypeScript, execute:

```bash
npm run compile
```

### Rodar os Testes

#### Rodar todos os testes:

Para executar todos os testes do projeto, incluindo compilação e execução do Jest, execute:

```bash
npm run test
```

#### Rodar apenas os testes unitários:

Se você quiser rodar apenas os testes unitários, execute:

```bash
npm run unit
```

#### Rodar os testes com cobertura:

Para rodar os testes e gerar um relatório de cobertura de código, execute:

```bash
npm run test:coverage
```

#### Rodar os testes em modo de observação:

Para rodar os testes em modo de observação (quando você modifica o código, os testes são executados automaticamente), execute:

```bash
npm run test:watch
```

### Deploy

Para realizar o deploy do serviço para a AWS, utilize o comando:

```bash
npm run deploy
```

Isso irá fazer o deploy utilizando o **Serverless Framework**, considerando as configurações do arquivo `serverless.yml`.

## Estrutura do Projeto

- **src/models**: Contém as definições dos modelos (ex. `Client`).
- **src/services**: Contém a lógica de negócios (ex. `ClientService`).
- **src/utils**: Contém utilitários como o `DBManager`.
- **tests**: Contém os testes do projeto.

## Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

### Resumo dos Pontos Importantes:

- **Docker**: Para rodar o DynamoDB localmente, basta executar `docker compose up -d`.
- **NVM**: Para garantir que você está utilizando a versão correta do Node.js, use `nvm install` e `nvm use`.
- **Comandos**:
  - `npm run dev`: Inicia o servidor local com o Serverless Offline.
  - `npm run test`: Executa os testes com Jest.
  - `npm run deploy`: Realiza o deploy para a AWS com o Serverless Framework.

Esse `README.md` agora cobre a configuração do ambiente, os comandos para rodar o serviço, os testes e o deploy.