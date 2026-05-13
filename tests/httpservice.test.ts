/* eslint-disable @typescript-eslint/no-explicit-any */

const mockClientInstance = {
    baseUrl: jest.fn().mockReturnThis(),
    asForm: jest.fn().mockReturnThis(),
    accept: jest.fn().mockReturnThis(),
    acceptJson: jest.fn().mockReturnThis(),
    withHeaders: jest.fn().mockReturnThis(),
    withOptions: jest.fn().mockReturnThis(),
    withData: jest.fn().mockReturnThis(),
    withQueryParameters: jest.fn().mockReturnThis(),
    withBasicAuth: jest.fn().mockReturnThis(),
    withToken: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
    put: jest.fn().mockResolvedValue({}),
    patch: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
};

jest.mock('@luminix/support', () => {
    const actual = jest.requireActual('@luminix/support');
    return {
        ...actual,
        Client: jest.fn(() => mockClientInstance),
    };
});

import { HttpService } from '../src/services/HttpService';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('HttpService', () => {

    let service: HttpService;

    beforeEach(() => {
        service = new HttpService();
    });

    test('getClient() returns a Client instance', () => {
        const client = service.getClient();
        expect(client).toBe(mockClientInstance);
    });

    test('baseUrl() delegates to Client.baseUrl()', () => {
        const result = service.baseUrl('https://example.com');
        expect(mockClientInstance.baseUrl).toHaveBeenCalledWith('https://example.com');
        expect(result).toBe(mockClientInstance);
    });

    test('asForm() delegates to Client.asForm()', () => {
        const result = service.asForm();
        expect(mockClientInstance.asForm).toHaveBeenCalled();
        expect(result).toBe(mockClientInstance);
    });

    test('accept() delegates to Client.accept()', () => {
        const result = service.accept('application/json');
        expect(mockClientInstance.accept).toHaveBeenCalledWith('application/json');
        expect(result).toBe(mockClientInstance);
    });

    test('acceptJson() delegates to Client.acceptJson()', () => {
        const result = service.acceptJson();
        expect(mockClientInstance.acceptJson).toHaveBeenCalled();
        expect(result).toBe(mockClientInstance);
    });

    test('withHeaders() delegates to Client.withHeaders()', () => {
        const headers = { 'X-Custom': 'value' };
        const result = service.withHeaders(headers);
        expect(mockClientInstance.withHeaders).toHaveBeenCalledWith(headers);
        expect(result).toBe(mockClientInstance);
    });

    test('withOptions() delegates to Client.withOptions()', () => {
        const options = { timeout: 5000 } as any;
        const result = service.withOptions(options);
        expect(mockClientInstance.withOptions).toHaveBeenCalledWith(options);
        expect(result).toBe(mockClientInstance);
    });

    test('withData() delegates to Client.withData()', () => {
        const data = { key: 'value' };
        const result = service.withData(data);
        expect(mockClientInstance.withData).toHaveBeenCalledWith(data);
        expect(result).toBe(mockClientInstance);
    });

    test('withQueryParameters() delegates to Client.withQueryParameters()', () => {
        const params = { page: 1, per_page: 15 };
        const result = service.withQueryParameters(params);
        expect(mockClientInstance.withQueryParameters).toHaveBeenCalledWith(params);
        expect(result).toBe(mockClientInstance);
    });

    test('withBasicAuth() delegates to Client.withBasicAuth()', () => {
        const result = service.withBasicAuth('user', 'pass');
        expect(mockClientInstance.withBasicAuth).toHaveBeenCalledWith('user', 'pass');
        expect(result).toBe(mockClientInstance);
    });

    test('withToken() delegates to Client.withToken()', () => {
        const result = service.withToken('my-bearer-token');
        expect(mockClientInstance.withToken).toHaveBeenCalledWith('my-bearer-token');
        expect(result).toBe(mockClientInstance);
    });

    test('get() delegates to Client.get()', async () => {
        await service.get('/api/users');
        expect(mockClientInstance.get).toHaveBeenCalledWith('/api/users', undefined);
    });

    test('post() delegates to Client.post()', async () => {
        await service.post('/api/users', { name: 'John' });
        expect(mockClientInstance.post).toHaveBeenCalledWith('/api/users', { name: 'John' });
    });

    test('put() delegates to Client.put()', async () => {
        await service.put('/api/users/1', { name: 'Jane' });
        expect(mockClientInstance.put).toHaveBeenCalledWith('/api/users/1', { name: 'Jane' });
    });

    test('patch() delegates to Client.patch()', async () => {
        await service.patch('/api/users/1', { name: 'Jane' });
        expect(mockClientInstance.patch).toHaveBeenCalledWith('/api/users/1', { name: 'Jane' });
    });

    test('delete() delegates to Client.delete()', async () => {
        await service.delete('/api/users/1');
        expect(mockClientInstance.delete).toHaveBeenCalledWith('/api/users/1', undefined);
    });

    test('each method creates a new Client instance', () => {
        const { Client } = require('@luminix/support');
        (Client as jest.Mock).mockClear();

        service.baseUrl('https://a.com');
        service.withData({ x: 1 });
        service.get('/test');

        expect(Client).toHaveBeenCalledTimes(3);
    });

});
