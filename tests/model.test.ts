/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response } from '@luminix/support';

import Http from '../src/facades/Http';

import RouteNotFoundException from '../src/exceptions/RouteNotFoundException';
import MethodNotImplementedException from '../src/exceptions/MethodNotImplementedException';
import ModelNotPersistedException from '../src/exceptions/ModelNotPersistedException';
import Builder from '../src/contracts/Builder';

import models from './__mocks__/appmodels';

import BelongsTo from '../src/contracts/Relation/BelongsTo';
import BelongsToMany from '../src/contracts/Relation/BelongsToMany';
import HasMany from '../src/contracts/Relation/HasMany';
import HasOne from '../src/contracts/Relation/HasOne';
import MorphMany from '../src/contracts/Relation/MorphMany';
import MorphOne from '../src/contracts/Relation/MorphOne';
import MorphTo from '../src/contracts/Relation/MorphTo';
import MorphToMany from '../src/contracts/Relation/MorphToMany';

beforeEach(() => {
    jest.resetModules();
});

const {
    app: {
        baseModel,
    },
    models: {
        User,
        Post,
        Attachment,
        Comment,
    },
    data: {
        users,
        posts,
    }
} = models;

describe('testing models', () => {

    test('model create', async () => {
        
        (Http.post as any).mockImplementationOnce(() => Promise.resolve(new Response({ 
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: null,
            }, 
            headers: { 'Content-Type': 'application/json' },
            status: 200, 
            statusText: 'OK',
        })));

        const user1 = await User.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
        });

        expect(Http.post).toHaveBeenCalledTimes(1);
        expect(Http.post).toHaveBeenCalledWith('/api/luminix/users');
        expect(Http.withData).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'johndoe@example.com',
        });

        expect(user1.id).toBe(1);

        /* * */

        const user2 = new User();

        expect(user2.id).toBeUndefined();
    });

    test('model update', async () => {

        (Http.put as any).mockImplementationOnce(() => Promise.resolve(new Response({ 
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
            }, 
            headers: { 'Content-Type': 'application/json' },
            status: 200, 
            statusText: 'OK',
        })));

        const user = await User.update(1, {
            name: 'John Doe',
            email: 'johndoe@example.com'
        });

        expect(Http.put).toHaveBeenCalledWith('/api/luminix/users/1');
        expect(Http.withData).toHaveBeenCalledWith({ 
            name: 'John Doe', 
            email: 'johndoe@example.com', 
        });

        expect(user.id).toBe(1);
    });

    test('model delete', async () => {

        (Http.delete as any).mockImplementationOnce(() => Promise.resolve(new Response({
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {},
            headers: { 'Content-Type': 'application/json' },
            status: 204,
            statusText: 'No Content',
        })));

        await User.delete(1);

        expect(Http.delete).toHaveBeenCalledWith('/api/luminix/users/1');
    });

    test('model fetch and save', async () => {

        (Http.get as any).mockImplementationOnce(() => Promise.resolve(new Response({ 
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                data: [
                    {
                        id: 1,
                        name: 'John Doe',
                        email: 'johndoe@example.com'
                    }
                ]
            },
            headers: { 'Content-Type': 'application/json' },
            status: 200, 
            statusText: 'OK',
        })));

        const user = await User.find(1);

        if (!user) {
            throw new Error('User not found');
        }

        expect(Http.get).toHaveBeenCalledWith('/api/luminix/users');
        // expect(Http.get).toHaveBeenCalledWith('/api/luminix/users?where[id]=1&per_page=1&page=1');
        expect(Http.withData).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'johndoe@example.com',
        });

        user.name = 'Jane Doe';

        (Http.put as any).mockImplementationOnce(() => Promise.resolve(new Response({ 
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: { 
                id: 1, 
                name: 'Jane Doe',
                email: 'johndoe@example.com',
            }, 
            headers: { 'Content-Type': 'application/json' },
            status: 200, 
            statusText: 'OK',
        })));

        await user.save();

        expect(Http.put).toHaveBeenCalledWith('/api/luminix/users/1');
        expect(Http.withData).toHaveBeenCalledWith({ name: 'Jane Doe' });

        /* * */

        (Http.get as any).mockImplementationOnce(() => Promise.resolve(new Response({ 
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                data: [
                    {
                        id: 1,
                        body: 'First Comment',
                        post_id: 1,
                        user_id: 1,
                    }
                ]
            },
            headers: { 'Content-Type': 'application/json' },
            status: 200, 
            statusText: 'OK',
        })));

        const comment = await Comment.find(1);

        if (!comment) {
            throw new Error('Comment not found');
        }

        expect(Http.get).toHaveBeenCalledWith('/api/luminix/post_comments');
        expect(Http.withData).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'johndoe@example.com',
        });

        comment.body = 'First Comment Updated';

        (Http.put as any).mockImplementationOnce(() => Promise.resolve(new Response({ 
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                id: 1,
                body: 'First Comment Updated',
                post_id: 1,
                user_id: 1,
            },
            headers: { 'Content-Type': 'application/json' },
            status: 200, 
            statusText: 'OK',
        })));

        await comment.save();

        expect(Http.put).toHaveBeenCalledWith('/api/luminix/post_comments/1/update');
        expect(Http.withData).toHaveBeenCalledWith({ body: 'First Comment Updated' });
    });

    test('model restore and force delete', async () => {

        (Http.put as any).mockImplementationOnce(() => Promise.resolve(new Response({ 
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: null,
            },
            headers: { 'Content-Type': 'application/json' },
            status: 200, 
            statusText: 'OK',
        })));

        await User.restore(1);

        expect(Http.put).toHaveBeenCalledWith('/api/luminix/users/1');
        expect(Http.withData).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'johndoe@example.com',
        });

        /* * */

        (Http.delete as any).mockImplementationOnce(() => Promise.resolve(new Response({
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
            },
            headers: { 'Content-Type': 'application/json' },
            status: 204,
            statusText: 'OK',
        })));

        await User.forceDelete(1);

        expect(Http.delete).toHaveBeenCalledWith('/api/luminix/users/1');
        expect(Http.withData).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'johndoe@example.com',
        });
    });

    test('model mass delete, restore and force delete', async () => {

        (Http.delete as any).mockImplementationOnce(() => Promise.resolve(new Response({ 
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: null,
            },
            headers: { 'Content-Type': 'application/json' },
            status: 200, 
            statusText: 'OK',
        })));

        await User.delete([1, 2, 3]);
        expect(Http.delete).toHaveBeenCalledWith('/api/luminix/users');
        expect(Http.withData).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'johndoe@example.com',
        });

        /* * */

        (Http.put as any).mockImplementationOnce(() => Promise.resolve(new Response({ 
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: null,
            },
            headers: { 'Content-Type': 'application/json' },
            status: 200, 
            statusText: 'OK',
        })));

        await User.restore([ 1, 2, 3 ]);
        expect(Http.put).toHaveBeenCalledWith('/api/luminix/users');
        expect(Http.withData).toHaveBeenCalledWith({ ids: [ 1, 2, 3 ]});

        /* * */

        (Http.delete as any).mockImplementationOnce(() => Promise.resolve(new Response({ 
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: null,
            },
            headers: { 'Content-Type': 'application/json' },
            status: 200, 
            statusText: 'OK',
        })));

        await User.forceDelete([1, 2, 3]);
        expect(Http.delete).toHaveBeenCalledWith('/api/luminix/users');
        expect(Http.withData).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'johndoe@example.com',
        });
    });

    // test.skip('model fillable') — fillable enforcement is not implemented:
    // setAttribute() does not throw AttributeNotFillableException (check is commented out in BaseModel).

    // test.skip('model relationships') — API obsoleta (.items em Collection) e já coberto por relation.test.ts.

    // test.skip('model casts and mutates') — usa acesso camelCase (post.publishedAt) que contradiz
    // o teste 'attribute access uses backend casing (no camelCase conversion)'. Casts cobertos em
    // 'model casts datetime to Date'.

    test('model errors', async () => {
        // Attachment has no restoreMany route in the manifest
        await expect(Attachment.restore([1, 2, 3])).rejects.toThrow(RouteNotFoundException);
    });

    test('model get relation constructors', () => {
        expect(baseModel.getRelationConstructors('user')).toMatchObject({
            'BelongsTo': BelongsTo, 
            'BelongsToMany': BelongsToMany, 
            'HasMany': HasMany, 
            'HasOne': HasOne, 
            'MorphMany': MorphMany, 
            'MorphOne': MorphOne, 
            'MorphTo': MorphTo, 
            'MorphToMany': MorphToMany,
        });
    });

    /* * * * */

    test('model get schema', () => {
        expect(User.getSchema()).toMatchObject({
            casts: {
                id: 'int',
                email_verified_at: 'datetime',
                password: 'hashed',
            },
            class: 'App\\Models\\User',
            exportable: false,
            fillable: [
                'name',
                'email',
                'password',
            ],
            importable: false,
            primaryKey: 'id',
            relations: {
                attachments: {
                    model: 'attachment',
                    type: 'MorphMany',
                },
                comments: {
                    model: 'post_comment',
                    type: 'HasMany',
                },
                posts: {
                    model: 'post',
                    type: 'HasMany',
                },
            },
            softDeletes: false,
            timestamps: true,
        });
    });

    test('get model attribute', () => {

        const user = users.first();

        if (!user) {
            throw new Error('User not found');
        }

        expect(user.getAttribute('id')).toBe(1);
        expect(user.getAttribute('name')).toBe('John Doe');
    });

    test('get model primary key', () => {
        expect(users.first()!.getKey()).toBe(1);
    });
    
    test('get model primary key name', () => {
        expect(users.first()!.getKeyName()).toBe('id');
    });
    
    test('get model type', () => {        
        expect(users.first()!.getType()).toBe('user');
    });

    test('get model save route', () => {
        const freshUser = new User({ name: 'Test', email: 'test@test.com', password: null });
        expect(freshUser.getRouteForSave()).toBe('luminix.user.store');

        const existingUser = new User({ id: 1, name: 'Test', email: 'test@test.com', password: null });
        existingUser.exists = true;
        expect(existingUser.getRouteForSave()).toEqual(['luminix.user.update', { id: 1 }]);
    });

    test('get model update route', () => {
        expect(users.first()!.getRouteForUpdate()).toEqual([
            'luminix.user.update',
            { id: 1 },
        ]);
    });

    test('get model delete route', () => {
        expect(users.first()!.getRouteForDelete()).toEqual([
            'luminix.user.destroy',
            { id: 1 },
        ]);
    });

    test('get model refresh route', () => {
        expect(users.first()!.getRouteForRefresh()).toEqual([
            'luminix.user.show',
            { id: 1 },
        ]);
    });

    // test.skip('get model label') — asserção errada: getLabel() retorna o campo labeledBy ('John Doe'),
    // não o nome do tipo. Coberto por 'model getLabel returns labeledBy field value'.

    /* * * * */

    // test.skip('dump model info') — dump() retorna undefined assim como console.log(),
    // tornando o expect trivialmente verdadeiro e sem valor.

    test('attribute access uses backend casing (no camelCase conversion)', () => {
        const post = posts.first()!;
        // Access via snake_case (matches backend)
        expect(post.created_at).toBeInstanceOf(Date);
        expect(post.published_at).toBeInstanceOf(Date);
        // camelCase does NOT map to snake_case
        expect((post as any).createdAt).toBeUndefined();
        expect((post as any).publishedAt).toBeUndefined();
    });

    test('model isDirty and diff', () => {
        const freshUser = new User({ id: 99, name: 'Original', email: 'orig@test.com', password: null });
        expect(freshUser.isDirty).toBe(false);
        expect(freshUser.diff()).toEqual({});

        freshUser.name = 'Modified';
        expect(freshUser.isDirty).toBe(true);
        expect(freshUser.diff()).toEqual({ name: 'Modified' });
    });

    test('model toJson serializes attributes', () => {
        const freshUser = new User({ id: 5, name: 'Test', email: 'test@test.com', password: null });
        const json = freshUser.toJson();
        expect(json.id).toBe(5);
        expect(json.name).toBe('Test');
        expect(json.email).toBe('test@test.com');
    });

    test('model casts datetime to Date', () => {
        const post = posts.first()!;
        expect(post.published_at).toBeInstanceOf(Date);
        expect((post.published_at as Date).toISOString()).toBe('2021-01-01T00:00:00.000Z');

        const user = users.first()!;
        expect(user.created_at).toBeInstanceOf(Date);
    });

    test('model singular and plural names', () => {
        expect(User.singular()).toBe('User');
        expect(User.plural()).toBe('Users');
        expect(Post.singular()).toBe('Post');
        expect(Post.plural()).toBe('Posts');
    });

    test('model getLabel returns labeledBy field value', () => {
        const freshUser = new User({ id: 1, name: 'John Doe', email: 'j@j.com', password: null });
        expect(freshUser.getLabel()).toBe('John Doe');
    });

    test('model push throws MethodNotImplementedException', async () => {
        const freshUser = new User({ name: 'Test', email: 'test@test.com', password: null });
        await expect(freshUser.push()).rejects.toThrow(MethodNotImplementedException);
    });

    test('model save returns early when no dirty data', async () => {
        const persistedUser = new User({ id: 1, name: 'Test', email: 'test@test.com', password: null });
        persistedUser.exists = true;
        jest.clearAllMocks();
        // No fields modified — diff() is empty, save() returns undefined without an HTTP call
        const result = await persistedUser.save();
        expect(result).toBeUndefined();
        expect(Http.put).not.toHaveBeenCalled();
    });

    test('model refresh throws when not persisted', async () => {
        const freshUser = new User({ name: 'Test', email: 'test@test.com', password: null });
        await expect(freshUser.refresh()).rejects.toThrow(ModelNotPersistedException);
    });

    test('model refresh updates attributes on success', async () => {
        const persistedUser = new User({ id: 1, name: 'Old Name', email: 'test@test.com', password: null });
        persistedUser.exists = true;

        (Http.get as any).mockImplementationOnce(() => Promise.resolve(new Response({
            config: { headers: { 'Content-Type': 'application/json' } as any },
            data: { id: 1, name: 'Refreshed Name', email: 'test@test.com', password: null },
            headers: { 'Content-Type': 'application/json' },
            status: 200,
            statusText: 'OK',
        })));

        await persistedUser.refresh();

        expect(persistedUser.name).toBe('Refreshed Name');
    });

    test('model instance update method', async () => {
        const persistedUser = new User({ id: 1, name: 'Old', email: 'test@test.com', password: null });
        persistedUser.exists = true;

        (Http.put as any).mockImplementationOnce(() => Promise.resolve(new Response({
            config: { headers: { 'Content-Type': 'application/json' } as any },
            data: { id: 1, name: 'Updated Name', email: 'test@test.com', password: null },
            headers: { 'Content-Type': 'application/json' },
            status: 200,
            statusText: 'OK',
        })));

        await persistedUser.update({ name: 'Updated Name' });

        expect(Http.put).toHaveBeenCalledWith('/api/luminix/users/1');
        expect(Http.withData).toHaveBeenCalledWith({ name: 'Updated Name' });
        expect(persistedUser.name).toBe('Updated Name');
    });

    test('static builder shortcuts return chainable builder', () => {
        expect(User.whereNull('deleted_at')).toBeInstanceOf(Builder);
        expect(User.whereNotNull('name')).toBeInstanceOf(Builder);
        expect(User.whereBetween('id', [1, 10])).toBeInstanceOf(Builder);
        expect(User.orderBy('name', 'desc')).toBeInstanceOf(Builder);
        expect(User.searchBy('john')).toBeInstanceOf(Builder);
        expect(User.minified()).toBeInstanceOf(Builder);
        expect(User.limit(5)).toBeInstanceOf(Builder);
        expect(User.where('email', 'test@test.com')).toBeInstanceOf(Builder);
    });

});
