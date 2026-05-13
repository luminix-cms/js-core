/* eslint-disable @typescript-eslint/no-explicit-any */

import App from '../src/facades/App';

import makeConfig from './config';

import AuthService from '../src/services/AuthService';

App.withConfiguration(makeConfig());
App.create();

beforeEach(() => {
    jest.resetModules();
});

const auth = App.make('auth');

describe('testing authentication', () => {

    test('auth check works', () => {
        const config = { get: (key: string) => key === 'auth.user' ? { id: 1 } : undefined } as any;
        const freshAuth = new AuthService(config, App.make('model'), App.make('route'));

        expect(freshAuth).toBeInstanceOf(AuthService);
        expect(freshAuth.check()).toBe(true);
        expect(freshAuth.id()).toBe(1);
    });

    test('auth check fails', () => {
        const config = { get: () => null } as any;
        const freshAuth = new AuthService(config, App.make('model'), App.make('route'));

        expect(freshAuth).toBeInstanceOf(AuthService);
        expect(freshAuth.check()).toBe(false);
        expect(freshAuth.id()).toBeNull();
    });

    test('auth user works', () => {
        const config = { get: (key: string) => key === 'auth.user' ? { id: 1, name: 'John Doe' } : undefined } as any;
        const freshAuth = new AuthService(config, App.make('model'), App.make('route'));

        expect(freshAuth).toBeInstanceOf(AuthService);
        expect(freshAuth.check()).toBe(true);

        const user = freshAuth.user();

        if (!user) {
            throw new Error('User not found');
        }

        expect(user.id).toBe(1);
        expect(user.name).toBe('John Doe');
    });

    test('auth attempt works', async () => {
        expect(auth).toBeInstanceOf(AuthService);

        const onSubmit = jest.fn((e) => e.preventDefault());

        auth.attempt({
            email: 'test@foo.com',
            password: 'password'
        }, true, onSubmit);

        // a form should exist with the login route in the DOM
        const form = document.querySelector('form');

        expect(form).toBeInstanceOf(HTMLFormElement);
        expect(form?.getAttribute('action')).toBe('/login');
        expect(onSubmit).toHaveBeenCalled();

        form?.remove();
    });

    test('auth logout works', async () => {
        expect(auth).toBeInstanceOf(AuthService);

        auth.logout(jest.fn((e) => e.preventDefault()));

        // a form should exist with the logout route in the DOM
        const form = document.querySelector('form');

        expect(form).toBeInstanceOf(HTMLFormElement);
        expect(form?.getAttribute('action')).toBe('/logout');

        form?.remove();
    });

});
