import { Client } from "../models/client";
import { APIGatewayProxyResult } from "aws-lambda";
import { ClientService } from "../services/ClientService";

export class ClientFunctions {
  constructor(private readonly _service: ClientService) {}

  private initiResp(): APIGatewayProxyResult {
    return { statusCode: 200, body: "" };
  }

  create = async (event): Promise<APIGatewayProxyResult> => {
    const response = this.initiResp();

    try {
      const body = JSON.parse(event.body);

      const createResult = await this._service.create(body || {});

      response.body = JSON.stringify({
        message: "Successfully created client.",
        data: createResult,
      });
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "Failed to create client.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };

  findAll = async (): Promise<APIGatewayProxyResult> => {
    const response = this.initiResp();

    try {
      const Items: Client[] = await this._service.findAll();

      response.body = JSON.stringify({
        message: "Successfully retrieved all clients !",
        data: Items,
      });
    } catch (e) {
      console.error(e);

      response.statusCode = 500;

      response.body = JSON.stringify({
        message: "Failed to retrieve clients.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };

  findById = async (event): Promise<APIGatewayProxyResult> => {
    const response = this.initiResp();
    const id = event.pathParameters.id;

    try {
      const Item = await this._service.findById(id);

      if (Item) {
        response.body = JSON.stringify({
          data: Item,
          message: "Successfully retrieved client.",
        });
      } else {
        response.statusCode = 404;

        response.body = JSON.stringify({
          message: "Client not found.",
        });
      }
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "Failed to get client.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };

  update = async (event): Promise<APIGatewayProxyResult> => {
    const response = this.initiResp();
    const id = event.pathParameters.id;

    try {
      const body = JSON.parse(event.body);

      const updated = await this._service.update(id, body);

      response.body = JSON.stringify({
        message: "Successfully client updated.",
        data: updated,
      });
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "Failed to client updated.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };

  deleteById = async (event): Promise<APIGatewayProxyResult> => {
    const response = this.initiResp();
    const id = event.pathParameters.id;

    try {
      const deleteResult = await this._service.delete(id);

      response.body = JSON.stringify({
        message: "Successfully deleted client.",
        deleteResult,
      });
    } catch (e) {
      console.error(e);
      response.statusCode = 500;
      response.body = JSON.stringify({
        message: "Failed to delete client.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
    }

    return response;
  };
}

const funcs = new ClientFunctions(new ClientService());

export const create = funcs.create;
export const update = funcs.update;
export const findAll = funcs.findAll;
export const findById = funcs.findById;
export const deleteById = funcs.deleteById;
