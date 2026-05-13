
import App from '../src/facades/App';

import makeConfig from './config';

App.withConfiguration(makeConfig());
App.create();

beforeEach(() => {
    jest.resetModules();
});

describe('testing reducers', () => {

    afterEach(() => {
        App.make('model').clearReducer('modelUserGetNameAttribute');
    });

    test('reducer registration and execution', () => {
        const model = App.make('model');

        model.reducer('modelUserGetNameAttribute', (name: string) => {
            return `${name} (macro2)`;
        }, 20);

        model.reducer('modelUserGetNameAttribute', (name: string) => {
            return `${name} (macro)`;
        });

        expect(model.getReducer('modelUserGetNameAttribute').count()).toBe(2);

        const User = model.make('user');
        const user = new User({ id: 1, name: 'John Doe' });

        expect(user.name).toBe('John Doe (macro) (macro2)');
    });

    test('reducer removal', () => {
        const model = App.make('model');

        model.reducer('modelUserGetNameAttribute', (name: string) => {
            return `${name} (macro2)`;
        }, 20);

        model.reducer('modelUserGetNameAttribute', (name: string) => {
            return `${name} (macro)`;
        });

        const reducers = model.getReducer('modelUserGetNameAttribute');
        const [filter1, filter2] = reducers;

        model.removeReducer('modelUserGetNameAttribute', filter1.callback);

        expect(model.getReducer('modelUserGetNameAttribute').count()).toBe(1);
        expect(model.hasReducer('modelUserGetNameAttribute')).toBe(true);
        expect(model.getReducer('modelUserGetNameAttribute').all()).toEqual([filter2]);
    });

    test('reducer clear', () => {
        const model = App.make('model');

        model.reducer('modelUserGetNameAttribute', (name: string) => {
            return `${name} (macro)`;
        });

        const User = model.make('user');
        const user = new User({ id: 1, name: 'John Doe' });

        expect(user.name).toBe('John Doe (macro)');

        model.clearReducer('modelUserGetNameAttribute');

        expect(model.hasReducer('modelUserGetNameAttribute')).toBe(false);
        expect(user.name).toBe('John Doe');
    });

});
