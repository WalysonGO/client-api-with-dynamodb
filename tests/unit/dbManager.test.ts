import { Client } from '../../src/models/client';
import { DBManager } from '../../src/utils/DBManager';

describe('DBManager', () => {
  const tableName = 'client-tests';
  let dbManager;

  beforeAll(async () => {
    dbManager = new DBManager(tableName);
    await dbManager.createTable();
  });

  afterAll(async () => {
    await dbManager.deleteTable(tableName);
  });

  it('should return an empty array when there are no clients', async () => {
    const clients = await dbManager.getAll() as Client[];

    expect(clients).toEqual([]);
    expect(clients.length).toBe(0);

  });


  it('should insert a client', async () => {
    const clientData = { fullName: 'Alice Smith', dateOfBirth: '1985-05-15', isActive: true };

    const insertedClient = await dbManager.insert(clientData);

    expect(insertedClient).toHaveProperty('id');
    expect(insertedClient.fullName).toBe(clientData.fullName);
  });

  it('should retrieve all clients', async () => {
    await dbManager.insert({ fullName: 'Bob Johnson', dateOfBirth: '1978-09-20', isActive: true });

    const clients = await dbManager.getAll();

    expect(clients.length).toBeGreaterThan(0);
    expect(clients[0]).toHaveProperty('fullName');
  });

  it('should retrieve a client by ID', async () => {
    const clientData = { fullName: 'Charlie Brown', dateOfBirth: '1990-01-01', isActive: true };

    const insertedClient = await dbManager.insert(clientData);

    const retrievedClient = await dbManager.getById(insertedClient.id);

    expect(retrievedClient).toEqual(expect.objectContaining(clientData));
  });

  it('should update a client', async () => {
    const clientData = { fullName: 'Dave White', dateOfBirth: '1988-04-04', isActive: true };

    const insertedClient = await dbManager.insert(clientData);

    const updates = { fullName: 'David White' };

    const updatedClient = await dbManager.update(insertedClient.id, updates);

    expect(updatedClient.fullName).toBe(updates.fullName);
  });

  it('should update a client and return null if object is empty', async () => {
    const clientData = { fullName: 'Eve Black', dateOfBirth: '1995-07-07', isActive: true };

    const insertedClient = await dbManager.insert(clientData);

    const updatedClient = await dbManager.update(insertedClient.id, {});

    expect(updatedClient).toBeNull();

    const retrievedClient = await dbManager.getById(insertedClient.id);

    expect(retrievedClient).toEqual(expect.objectContaining(clientData));
  })

  it('should delete a client by ID', async () => {
    const clientData = { fullName: 'Eve Black', dateOfBirth: '1995-07-07', isActive: true };

    const insertedClient = await dbManager.insert(clientData);

    await dbManager.deleteItem(insertedClient.id);

    const deletedClient = await dbManager.getById(insertedClient.id);

    expect(deletedClient).toBeNull();
  });

  it('should insert multiple clients', async () => {
    const clientsToInsert = [
      { fullName: 'Alice Smith', dateOfBirth: '1985-05-15', isActive: true },
      { fullName: 'Bob Johnson', dateOfBirth: '1978-09-20', isActive: true },
      { fullName: 'Charlie Brown', dateOfBirth: '1990-01-01', isActive: true },
    ];

    const insertedClients = await dbManager.insertAll(clientsToInsert);

    expect(insertedClients).toHaveLength(clientsToInsert.length);
    expect(insertedClients[0]).toHaveProperty('id');
    expect(insertedClients[0].fullName).toBe(clientsToInsert[0].fullName);
    expect(insertedClients[1].fullName).toBe(clientsToInsert[1].fullName);
    expect(insertedClients[2].fullName).toBe(clientsToInsert[2].fullName);
  });

});
