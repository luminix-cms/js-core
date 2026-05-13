
// import { Application } from '@luminix/support';

import App from '../src/facades/App';
import makeConfig from './config';

App.create();

beforeEach(() => {
    App.down();
    jest.resetModules();
});

describe('testing application', () => {

    test('use app by facade', async () => {

        App.bind('test', () => ({ foo: () => 1 }));

        expect(App.make('test').foo()).toBe(1);
    });

    test('app rebooted by facade method, after flush', async () => {

        App.bind('foo', () => 'bar');
        expect(App.make('foo')).toBe('bar');

        App.down();
        App.getFacadeAccessor();

        App.bind('foo', () => 'bar');
        expect(App.make('foo')).toBe('bar');
    });

});

describe('testing LuminixServiceProvider macros', () => {

    beforeEach(() => {
        App.withConfiguration(makeConfig()).create();
    });

    afterEach(() => {
        App.down();
    });

    test('environment() returns current env string', () => {
        expect((App as any).environment()).toBe('test');
    });

    test('environment(name) returns true when env matches', () => {
        expect((App as any).environment('test')).toBe(true);
    });

    test('environment(name) returns false when env does not match', () => {
        expect((App as any).environment('local')).toBe(false);
        expect((App as any).environment('production')).toBe(false);
    });

    test('environment() accepts multiple args and returns true if any matches', () => {
        expect((App as any).environment('local', 'test')).toBe(true);
        expect((App as any).environment('local', 'production')).toBe(false);
    });

    test('getLocale() returns locale from config', () => {
        expect((App as any).getLocale()).toBe('en');
    });

    test('hasDebugModeEnabled() returns debug flag from config', () => {
        expect((App as any).hasDebugModeEnabled()).toBe(false);
    });

    test('isLocal() returns false when env is not local', () => {
        expect((App as any).isLocal()).toBe(false);
    });

    test('isProduction() returns false when env is not production', () => {
        expect((App as any).isProduction()).toBe(false);
    });

});
