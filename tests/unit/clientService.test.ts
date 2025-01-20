import { Client } from '../../src/models/client';
import { ClientService } from '../../src/services/ClientService';
import { DBManager } from '../../src/utils/DBManager';

jest.mock('../../src/utils/DBManager', () => {
  return {
    DBManager: jest.fn().mockImplementation(() => ({
      getAll: jest.fn(),
      getById: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      deleteItem: jest.fn(),
    })),
  };
});

describe('ClientService', () => {
  let clientService: ClientService;
  let mockDB: jest.Mocked<DBManager>;

  beforeEach(() => {
    mockDB = new DBManager(process.env.DYNAMODB_CLIENT_TABLE!) as jest.Mocked<DBManager>;
    clientService = new ClientService(mockDB);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve all clients successfully', async () => {
    const mockClients = [
      { id: '1', fullName: 'John Doe' },
      { id: '2', fullName: 'Jane Doe' },
    ];

    mockDB.getAll.mockResolvedValue(mockClients);

    const clients = await clientService.findAll();

    expect(clients).toEqual(mockClients);
    expect(mockDB.getAll).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if client data is not provided', async () => {
    await expect(clientService.create(null as unknown as Client)).rejects.toThrowError(
      'Client data is required'
    );

    const invalidClient = { id: '1' };
    await expect(clientService.create(invalidClient)).rejects.toThrowError(
      'Client data is required'
    );
  });

  it('should throw an error if no client ID is provided', async () => {
    await expect(clientService.findById('')).rejects.toThrowError('Client ID is required');
    expect(mockDB.getById).not.toHaveBeenCalled();
  });

  it('should throw ClientNotFoundError if client is not found by ID', async () => {
    const nonExistentId = '999';
    mockDB.getById.mockResolvedValue(null);

    await expect(clientService.findById(nonExistentId)).rejects.toThrowError(
      `Client with id ${nonExistentId} not found`
    );

    expect(mockDB.getById).toHaveBeenCalledWith(nonExistentId);
  });

  it('should return a client if found by ID', async () => {
    const clientId = '1';
    const mockClient = { id: clientId, fullName: 'John Doe' };
    mockDB.getById.mockResolvedValue(mockClient);

    const client = await clientService.findById(clientId);

    expect(client).toEqual(mockClient);
    expect(mockDB.getById).toHaveBeenCalledWith(clientId);
  });

  it('should create a client successfully', async () => {
    const clientData = {
      fullName: 'John Doe',
      dateOfBirth: '1990-01-01',
      isActive: true,
    };

    mockDB.insert.mockResolvedValue({ id: '1', ...clientData });

    const createdClient = await clientService.create(clientData);

    expect(createdClient).toEqual({ id: '1', ...clientData });
    expect(mockDB.insert).toHaveBeenCalledWith(clientData);
  });

  it('should update a client successfully', async () => {
    const clientId = '1';
    const updatedClientData = { id: clientId, fullName: 'Updated Name' };
    mockDB.update.mockResolvedValue(updatedClientData);

    const updatedClient = await clientService.update(clientId, updatedClientData);

    expect(updatedClient).toEqual(updatedClientData);
    expect(mockDB.update).toHaveBeenCalledWith(clientId, updatedClientData);
  });

  it('should throw ClientNotFoundError if client is not found during update', async () => {
    const clientId = '999';
    const updatedClientData = { id: clientId, fullName: 'Non-existent' };
    mockDB.update.mockResolvedValue(null);

    await expect(clientService.update(clientId, updatedClientData)).rejects.toThrowError(
      `Client with id ${clientId} not found`
    );

    expect(mockDB.update).toHaveBeenCalledWith(clientId, updatedClientData);
  });

  it('should throw an error if ID is not provided during update', async () => {
    const updatedClientData = { id: '1', fullName: 'No ID' };

    await expect(clientService.update('', updatedClientData)).rejects.toThrowError(
      'Client ID is required'
    );

    expect(mockDB.update).not.toHaveBeenCalled();
  });

  it('should throw an error if updated client data is not provided', async () => {
    const clientId = '1';

    await expect(clientService.update(clientId, null as unknown as Client)).rejects.toThrowError(
      'Updated client data is required'
    );

    expect(mockDB.update).not.toHaveBeenCalled();
  });

  it('should delete a client successfully', async () => {
    const clientId = '1';
    mockDB.deleteItem.mockResolvedValue(undefined);

    const result = await clientService.delete(clientId);

    expect(result).toBe(true);
    expect(mockDB.deleteItem).toHaveBeenCalledWith(clientId);
  });

  it('should throw an error if ID is not provided for delete', async () => {
    await expect(clientService.delete('')).rejects.toThrowError('Client ID is required');

    expect(mockDB.deleteItem).not.toHaveBeenCalled();
  });

  it('should throw an error if an issue occurs during delete', async () => {
    const clientId = '1';
    mockDB.deleteItem.mockRejectedValue(new Error('Delete failed'));

    await expect(clientService.delete(clientId)).rejects.toThrowError('Failed to delete client');

    expect(mockDB.deleteItem).toHaveBeenCalledWith(clientId);
  });


  it('should throw an error when retrieving a client by ID that does not exist', async () => {
    const nonExistentId = '999';

    mockDB.getById.mockResolvedValue(null);

    await expect(clientService.findById(nonExistentId)).rejects.toThrowError(
      `Client with id ${nonExistentId} not found`
    );

    expect(mockDB.getById).toHaveBeenCalledWith(nonExistentId);
  });
});
