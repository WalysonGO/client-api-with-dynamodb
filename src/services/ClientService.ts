import { Client } from "../models/client";
import { DBManager } from "../utils/DBManager";

class ClientNotFoundError extends Error {
  constructor(id: string) {
    super(`Client with id ${id} not found`);
    this.name = "ClientNotFoundError";
  }
}

export class ClientService {
  private readonly DB: DBManager;

  constructor(dbManager?: DBManager) {
    this.DB = dbManager || new DBManager(process.env.DYNAMODB_CLIENT_TABLE!);
  }

  async findAll(): Promise<Client[]> {
    try {
      const clients = await this.DB.getAll();
      return clients;
    } catch (error) {
      console.error("Error retrieving clients:", error);
      throw new Error("Failed to retrieve clients");
    }
  }

  async findById(id: string): Promise<Client> {
    if (!id) throw new Error("Client ID is required");

    const client = await this.DB.getById(id);
    if (!client) {
      throw new ClientNotFoundError(id);
    }
    return client;
  }

  async create(body: Client): Promise<Client> {
    if (!body || !body.fullName) throw new Error("Client data is required");

    try {
      const createdClient = await this.DB.insert(body);
      return createdClient;
    } catch (error) {
      throw new Error("Failed to create client");
    }
  }

  async update(id: string, body: Client): Promise<Client> {
    if (!id) throw new Error("Client ID is required");
    if (!body) throw new Error("Updated client data is required");

    const updatedClient = await this.DB.update(id, body);
    if (!updatedClient) {
      throw new ClientNotFoundError(id);
    }
    return updatedClient;
  }

  async delete(id: string): Promise<boolean> {
    if (!id) throw new Error("Client ID is required");

    try {
      await this.DB.deleteItem(id);

      return true;
    } catch (error) {
      throw new Error("Failed to delete client");
    }
  }
}
