/* eslint-disable @typescript-eslint/no-explicit-any */

import App from '../src/facades/App';
import ErrorService from '../src/services/ErrorService';

import makeConfig from './config';

App.withConfiguration(makeConfig()).create();

beforeEach(() => {
    jest.resetModules();
});

describe('testing error service', () => {

    let error: ErrorService;

    beforeEach(() => {
        error = new ErrorService();
    });

    test('add and get single error', () => {
        error.add('name', 'required');
        expect(error.get('name')).toBe('required');
    });

    test('get returns null for missing key', () => {
        expect(error.get('nonexistent')).toBeNull();
    });

    test('all returns the full error bag', () => {
        error.add('name', 'required');
        error.add('email', 'invalid email');
        expect(error.all()).toEqual({ name: 'required', email: 'invalid email' });
    });

    test('set replaces entire bag', () => {
        error.add('name', 'required');
        error.set({ name: 'too short', email: 'invalid' });
        expect(error.all()).toEqual({ name: 'too short', email: 'invalid' });
    });

    test('set then add stacks errors', () => {
        error.set({ name: 'required' });
        error.add('email', 'invalid');
        expect(error.get('name')).toBe('required');
        expect(error.get('email')).toBe('invalid');
    });

    test('clear empties the default bag', () => {
        error.set({ name: 'required', email: 'invalid' });
        error.clear();
        expect(error.all()).toEqual({});
        expect(error.get('name')).toBeNull();
    });

    test('named bags are independent', () => {
        error.add('name', 'required', 'form1');
        error.add('email', 'invalid', 'form2');

        expect(error.get('name', 'form1')).toBe('required');
        expect(error.get('email', 'form2')).toBe('invalid');

        expect(error.get('name', 'form2')).toBeNull();
        expect(error.get('email', 'form1')).toBeNull();
    });

    test('clear only empties the specified bag', () => {
        error.add('name', 'required', 'form1');
        error.add('email', 'invalid', 'form2');

        error.clear('form1');

        expect(error.all('form1')).toEqual({});
        expect(error.get('email', 'form2')).toBe('invalid');
    });

    test('bag() auto-creates new named bags', () => {
        const bag = error.bag('fresh');
        expect(bag).toBeDefined();
        expect(error.all('fresh')).toEqual({});
    });

    test('default bag is accessible via App facade', () => {
        const appError = App.make('error');
        appError.add('key', 'value');
        expect(appError.get('key')).toBe('value');
        appError.clear();
    });

});
