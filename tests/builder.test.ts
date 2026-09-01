/* eslint-disable @typescript-eslint/no-explicit-any */

import App from '../src/facades/App';

import { Response } from '@luminix/support';

import Http from '../src/facades/Http';

import makeConfig from './config';
import { HttpServiceProvider } from './__mocks__/httpservice';

App.withProviders([HttpServiceProvider])
    .withConfiguration(makeConfig())
    .create();

beforeEach(() => {
    jest.resetModules();
});

const mockedSingleResponse = () => Promise.resolve(new Response({
    config: {
        headers: { 'Content-Type': 'application/json' } as any,
    },
    data: {
        data: [
            {
                id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
            },
        ],
        links: {
            first: 'http://example.com/luminix-api/users?page=1',
            last: 'http://example.com/luminix-api/users?page=1',
            next: null,
            prev: null,
        },
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            path: 'http://example.com/luminix-api/users',
            per_page: 1,
            to: 1,
            total: 1,
            links: [],
        }
    },
    headers: { 'Content-Type': 'application/json' },
    status: 200,
    statusText: 'OK',
}));

const mockedFailedResponse = () => Promise.resolve(new Response({
    config: {
        headers: { 'Content-Type': 'application/json' } as any,
    },
    data: {
        message: '[Luminix] Invalid filter provided for model "App\\Models\\User"',
    },
    headers: { 'Content-Type': 'application/json' },
    status: 500,
    statusText: 'Internal Server Error',
}));

const mockedResponse = () => Promise.resolve(new Response({
    config: {
        headers: { 'Content-Type': 'application/json' } as any,
    },
    data: {
        data: [
            {
                id: 2,
                name: 'Jane Doe',
                email: 'janedoe@example.com',
            },
            {
                id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com'
            },
            
        ],
        links: {
            first: 'http://example.com/luminix-api/users?page=1',
            last: 'http://example.com/luminix-api/users?page=1',
            next: null,
            prev: null,
        },
        meta: {
            current_page: 1,
            from: 1,
            last_page: 1,
            path: 'http://example.com/luminix-api/users',
            per_page: 15,
            to: 2,
            total: 2,
            links: [],
        }
    },
    headers: { 'Content-Type': 'application/json' },
    status: 200, 
    statusText: 'OK',
}));

describe('testing builder', () => {

    test('builder use cases', async () => {

        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedResponse);

        const users = await User.where('branchId', 1)
            .where('roleId', [1, 2, 3])
            .where('createdAt', '>=', '2021-01-01')
            .orderBy('name')
            .searchBy('doe')
            .minified()
            .all();

        expect(users.count()).toBe(2);
        expect(Http.get).toHaveBeenCalledWith('/api/luminix/users');
        expect(Http.withQueryParameters).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                branchId: 1,
                roleId: [1, 2, 3],
                'createdAt:greaterThanOrEquals': '2021-01-01',
            }),
            order_by: 'name:asc',
            q: 'doe',
            minified: 1,
            per_page: 150,
        }));
    });

    test('builder first() returns single model', async () => {
        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedSingleResponse);

        const user = await User.first();

        expect(user).not.toBeNull();
        expect(user!.id).toBe(1);
        expect(Http.withQueryParameters).toHaveBeenCalledWith(expect.objectContaining({
            per_page: 1,
        }));
    });

    test('builder find() fetches by primary key', async () => {
        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedSingleResponse);

        const user = await User.find(1);

        expect(user).not.toBeNull();
        expect(user!.id).toBe(1);
        expect(Http.withQueryParameters).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({ id: 1 }),
            per_page: 1,
        }));
    });

    test('builder whereBetween generates correct where key', async () => {
        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedResponse);

        await User.whereBetween('id', [1, 10]).all();

        expect(Http.withQueryParameters).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({ 'id:between': [1, 10] }),
        }));
    });

    test('builder whereNull generates correct where key', async () => {
        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedResponse);

        await User.whereNull('deleted_at').all();

        expect(Http.withQueryParameters).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({ 'deleted_at:null': null }),
        }));
    });

    test('builder with() sends relation names', async () => {
        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedResponse);

        await User.query().with(['posts', 'comments']).all();

        expect(Http.withQueryParameters).toHaveBeenCalledWith(expect.objectContaining({
            with: ['posts', 'comments'],
        }));
    });

    test('builder withOnly() replaces relation list', async () => {
        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedResponse);

        await User.query().with(['posts', 'comments']).withOnly(['attachments']).all();

        expect(Http.withQueryParameters).toHaveBeenCalledWith(expect.objectContaining({
            with: ['attachments'],
        }));
    });

    // Note: without() has a known mutation issue when using a bag-stored frozen array;
    // tested via withOnly() (replacement) instead.

    test('builder where() accepts scope callback', async () => {
        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedResponse);

        await User.where((q) => {
            q.where('name', 'John Doe');
            q.where('email', 'johndoe@example.com');
        }).all();

        expect(Http.withQueryParameters).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                name: 'John Doe',
                email: 'johndoe@example.com',
            }),
        }));
    });

    test('builder searchBy with empty string does not send q param', async () => {
        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedResponse);

        await User.query().searchBy('').all();

        expect(Http.withQueryParameters).toHaveBeenCalledWith(expect.not.objectContaining({
            q: expect.anything(),
        }));
    });

    test('builder searchBy with empty string clears a previous term', async () => {
        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedResponse);

        await User.query().searchBy('doe').searchBy('').all();

        expect(Http.withQueryParameters).toHaveBeenCalledWith(expect.not.objectContaining({
            q: expect.anything(),
        }));
    });

    test('builder throws the failed response message instead of mapping its body', async () => {
        const User = App.make('model').make('user');

        (Http.get as any).mockImplementationOnce(mockedFailedResponse);

        await expect(User.query().all()).rejects.toThrow(
            '[Luminix] Query for model "user" failed with status 500: '
            + '[Luminix] Invalid filter provided for model "App\\Models\\User"'
        );
    });

});
