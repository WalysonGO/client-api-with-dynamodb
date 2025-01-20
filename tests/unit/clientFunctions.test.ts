import { ClientFunctions } from '../../src/functions/ClientFunctions';
import { ClientService } from '../../src/services/ClientService';

jest.mock('../../src/services/ClientService');

describe('ClientFunctions', () => {
  let clientFunctions;
  let mockService;

  beforeEach(() => {
    mockService = new ClientService();
    clientFunctions = new ClientFunctions(mockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a client successfully', async () => {
    const event = {
      body: JSON.stringify({ fullName: 'Alice Smith', dateOfBirth: '1985-05-15', isActive: true }),
    };

    mockService.create = jest.fn().mockResolvedValue({ id: '1', fullName: 'Alice Smith' });

    const response = await clientFunctions.create(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: "Successfully created client.",
      data: { id: '1', fullName: 'Alice Smith' },
    });
    expect(mockService.create).toHaveBeenCalledWith(JSON.parse(event.body));
  });

  it('should retrieve all clients successfully', async () => {
    mockService.findAll = jest.fn().mockResolvedValue([{ id: '1', fullName: 'Alice Smith' }]);

    const response = await clientFunctions.findAll();

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: "Successfully retrieved all clients !",
      data: [{ id: '1', fullName: 'Alice Smith' }],
    });
  });

  it('should retrieve a client by ID successfully', async () => {
    const event = { pathParameters: { id: '1' } };

    mockService.findById = jest.fn().mockResolvedValue({ id: '1', fullName: 'Alice Smith' });

    const response = await clientFunctions.findById(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      data: { id: '1', fullName: 'Alice Smith' },
      message: "Successfully retrieved client.",
    });
  });

  it('should return a 404 when the client is not found', async () => {
    const event = { pathParameters: { id: '999' } };

    mockService.findById = jest.fn().mockResolvedValue(null);

    const response = await clientFunctions.findById(event);

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.body)).toEqual({
      message: "Client not found.",
    });
  });

  it('should update a client successfully', async () => {
    const event = {
      pathParameters: { id: '1' },
      body: JSON.stringify({ fullName: 'Alice Johnson' }),
    };

    mockService.update = jest.fn().mockResolvedValue({ id: '1', fullName: 'Alice Johnson' });

    const response = await clientFunctions.update(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: "Successfully client updated.",
      data: { id: '1', fullName: 'Alice Johnson' },
    });
  });

  it('should delete a client by ID successfully', async () => {
    const event = { pathParameters: { id: '1' } };

    mockService.delete = jest.fn().mockResolvedValue(true);

    const response = await clientFunctions.deleteById(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: "Successfully deleted client.",
      deleteResult: true,
    });
  });
});
