const AWS = require("aws-sdk");

// Configurando o cliente DynamoDB para usar o localhost
const ddb = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000",
});

module.exports = ddb;
