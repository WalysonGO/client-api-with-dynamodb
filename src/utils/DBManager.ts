import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand,
  ScanCommand,
  CreateTableCommand,
  DeleteTableCommand
} from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { Client } from "../models/client";

export class DBManager {
  private readonly tableName: string;
  private readonly client: DynamoDBClient;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.client = new DynamoDBClient({});

    if (process.env.PROD !== "true") {
      this.client = new DynamoDBClient({
        endpoint: "http://localhost:8000",
        tls: false,
      });
    }
  }
  
  async createTable(): Promise<void> {
    const params: any = {
      TableName: this.tableName,
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

    await this.client.send(new CreateTableCommand(params));
  }

  async deleteTable(): Promise<void> {
    const params = {
      TableName: this.tableName,
    };

    try {
      await this.client.send(new DeleteTableCommand(params));
    } catch (error) {
      throw new Error(`Unable to delete table ${this.tableName}`);
    }
  }

  async getAll(): Promise<Client[]> {
    const params = {
      TableName: this.tableName,
    };

    const { Items } = await this.client.send(new ScanCommand(params));

    return Items ? Items.map(item => unmarshall(item) as Client) : [];
  }

  async insert(client: Client): Promise<Client> {
    const newClient = { ...client, id: uuidv4() };
    const params = {
      Item: marshall(newClient),
      TableName: this.tableName,
    };

    await this.client.send(new PutItemCommand(params));
    return newClient;
  }

  async insertAll(clients: Client[]): Promise<Client[]> {
    const insertPromises = clients.map(client => this.insert(client));
    return await Promise.all(insertPromises);
  }

  async getById(id: string): Promise<Client | null> {
    const params = {
      Key: marshall({ id }),
      TableName: this.tableName,
    };

    const { Item } = await this.client.send(new GetItemCommand(params));

    return Item ? unmarshall(Item) as Client : null;
  }

  async deleteItem(id: string): Promise<void> {
    const params = {
      Key: marshall({ id }),
      TableName: this.tableName,
    };

    await this.client.send(new DeleteItemCommand(params));
  }

  async update(id: string, updates: Partial<Client>): Promise<Client | null> {
    const objKeys = Object.keys(updates);

    if (objKeys.length === 0) return null;

    const params = {
      Key: marshall({ id }),
      TableName: this.tableName,
      UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
      ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
        ...acc,
        [`#key${index}`]: key,
      }), {}),
      ExpressionAttributeValues: marshall(
        objKeys.reduce((acc, key, index) => ({
          ...acc,
          [`:value${index}`]: updates[key],
        }), {})
      ),
    };

    await this.client.send(new UpdateItemCommand(params));

    return { ...updates, id } as Client;
  }
}
