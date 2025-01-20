const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });


const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB({
  endpoint: "http://localhost:8000",
});

async function createTable() {
  const params = {
    TableName: "clients",
    KeySchema: [
      { AttributeName: "id", KeyType: "HASH" },
    ],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  try {
    await dynamoDB.createTable(params).promise();
    console.log("Tabela criada com sucesso.");
  } catch (error) {
    if (error.code !== "ResourceInUseException") {
      console.error("Erro ao criar tabela:", error);
      throw error;
    }
  }
}

async function clearTable() {
  const params = {
    TableName: "clients",
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    const deletePromises = data.Items.map((item) => {
      return dynamoDB
        .delete({
          TableName: "clients",
          Key: { id: item.id },
        })
        .promise();
    });

    await Promise.all(deletePromises);
    console.log("Tabela limpa com sucesso.");
  } catch (error) {
    console.error("Erro ao limpar tabela:", error);
    throw error;
  }
}

async function setup() {
  await createTable();
}

async function teardown() {
  await clearTable();
}

module.exports = { setup, teardown };
