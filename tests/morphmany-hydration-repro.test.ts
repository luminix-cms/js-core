/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Reproduction attempt for consumer-reported bug:
 * Task hasMany comments via MorphMany (commentable). Eager-loaded response
 * hydrates other relations, but `task.comments` is inaccessible and
 * `task.dump()` does not show the comments relation.
 *
 * Manifest entry reported by consumer:
 *   task.relations.comments = {
 *     foreignKey: "commentable_id",
 *     model: "comment",
 *     ownerKey: null,
 *     type: "MorphMany",
 *   }
 */

import { Response } from '@luminix/support';

import App from '../src/facades/App';
import Http from '../src/facades/Http';

import MorphMany from '../src/contracts/Relation/MorphMany';

import { HttpServiceProvider } from './__mocks__/httpservice';

import appConfig from './config/app';

const attribute = (name: string, overrides: any = {}) => ({
    name,
    phpType: 'string',
    type: 'varchar(255)',
    increments: false,
    nullable: true,
    default: null,
    primary: false,
    unique: false,
    fillable: true,
    appended: null,
    cast: null,
    virtual: false,
    hidden: false,
    ...overrides,
});

const idAttribute = () => attribute('id', {
    phpType: 'int',
    type: 'bigint unsigned',
    increments: true,
    nullable: false,
    primary: true,
    unique: true,
    fillable: false,
    cast: 'int',
});

const manifest = {
    models: {
        task: {
            fillable: ['name', 'user_id'],
            softDeletes: false,
            importable: false,
            exportable: false,
            primaryKey: 'id',
            timestamps: true,
            labeledBy: 'name',
            displayName: { singular: 'Task', plural: 'Tasks' },
            attributes: [
                idAttribute(),
                attribute('name'),
                attribute('user_id', { phpType: 'int', type: 'bigint', cast: 'int' }),
            ],
            casts: { id: 'int' },
            relations: {
                comments: {
                    type: 'MorphMany',
                    model: 'comment',
                    foreignKey: 'commentable_id',
                    ownerKey: null,
                },
                user: {
                    type: 'BelongsTo',
                    model: 'user',
                    foreignKey: 'user_id',
                },
            },
        },
        comment: {
            fillable: ['body', 'commentable_id', 'commentable_type'],
            softDeletes: false,
            importable: false,
            exportable: false,
            primaryKey: 'id',
            timestamps: true,
            labeledBy: 'body',
            displayName: { singular: 'Comment', plural: 'Comments' },
            attributes: [
                idAttribute(),
                attribute('body'),
                attribute('commentable_id', { phpType: 'int', type: 'bigint', cast: 'int' }),
                attribute('commentable_type'),
            ],
            casts: { id: 'int' },
            relations: {
                commentable: {
                    type: 'MorphTo',
                    model: 'comment',
                    foreignKey: 'commentable_id',
                    ownerKey: null,
                },
            },
        },
        user: {
            fillable: ['name'],
            softDeletes: false,
            importable: false,
            exportable: false,
            primaryKey: 'id',
            timestamps: true,
            labeledBy: 'name',
            displayName: { singular: 'User', plural: 'Users' },
            attributes: [
                idAttribute(),
                attribute('name'),
            ],
            casts: { id: 'int' },
            relations: {
                tasks: {
                    type: 'HasMany',
                    model: 'task',
                    foreignKey: 'user_id',
                },
            },
        },
    },
    routes: {
        luminix: {
            task: {
                index: ['api/luminix/tasks', 'get'],
                show: ['api/luminix/tasks/{id}', 'get'],
                store: ['api/luminix/tasks', 'post'],
                update: ['api/luminix/tasks/{id}', 'put'],
                destroy: ['api/luminix/tasks/{id}', 'delete'],
            },
            comment: {
                index: ['api/luminix/comments', 'get'],
                show: ['api/luminix/comments/{id}', 'get'],
                store: ['api/luminix/comments', 'post'],
                update: ['api/luminix/comments/{id}', 'put'],
                destroy: ['api/luminix/comments/{id}', 'delete'],
            },
        },
    },
};

App.withProviders([HttpServiceProvider])
    .withConfiguration({ app: appConfig, manifest } as any)
    .create();

const baseModel = App.make('model');

const Task = baseModel.make('task');

describe('MorphMany eager hydration (consumer repro)', () => {

    const taskPayload = {
        id: 1,
        name: 'My Task',
        user_id: 1,
        user: {
            id: 1,
            name: 'John Doe',
        },
        comments: [
            {
                id: 10,
                body: 'first comment',
                commentable_id: 1,
                commentable_type: 'task',
            },
            {
                id: 11,
                body: 'second comment',
                commentable_id: 1,
                commentable_type: 'task',
            },
        ],
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
    };

    test('comments relation resolves to MorphMany class', () => {
        const task = new Task(taskPayload);
        expect(task.relation('comments')).toBeInstanceOf(MorphMany);
    });

    test('comments relation is loaded after hydration', () => {
        const task = new Task(taskPayload);
        expect(task.relation('comments')!.isLoaded()).toBe(true);
        expect(task.relation('user')!.isLoaded()).toBe(true);
    });

    test('task.comments is accessible', () => {
        const task = new Task(taskPayload);
        expect(task.comments).not.toBeNull();
        expect(task.comments).not.toBeUndefined();
        expect(task.comments.count()).toBe(2);
        expect(task.comments.first().body).toBe('first comment');
    });

    test('toJson includes comments', () => {
        const task = new Task(taskPayload);
        const json = task.toJson() as any;
        expect(json.user).toBeDefined();
        expect(json.comments).toBeDefined();
        expect(json.comments).toHaveLength(2);
    });

    test('hydration when comments include nested commentable (MorphTo) payload', () => {
        const task = new Task({
            ...taskPayload,
            comments: taskPayload.comments.map((comment) => ({
                ...comment,
                commentable: { id: 1, name: 'My Task' },
            })),
        });

        expect(task.relation('comments')!.isLoaded()).toBe(true);
        expect(task.comments.count()).toBe(2);

        const commentable = task.comments.first().commentable;
        expect(commentable).not.toBeNull();
        expect(commentable.getType()).toBe('task');
        expect(commentable.id).toBe(1);
    });

    test('eager loading via query builder hydrates comments', async () => {
        (Http.get as any).mockImplementationOnce(() => Promise.resolve(new Response({
            config: {
                headers: { 'Content-Type': 'application/json' } as any,
            },
            data: {
                data: [taskPayload],
                links: { first: '', last: '', next: null, prev: null },
                meta: {
                    current_page: 1,
                    last_page: 1,
                    per_page: 15,
                    total: 1,
                    links: [],
                },
            },
            headers: { 'Content-Type': 'application/json' },
            status: 200,
            statusText: 'OK',
        })));

        const result = await Task.query().with(['comments', 'user']).get();
        const task = result.data.first()!;

        expect(task.relation('comments')!.isLoaded()).toBe(true);
        expect(task.comments).not.toBeNull();
        expect(task.comments.count()).toBe(2);

        const json = task.toJson() as any;
        expect(json.comments).toHaveLength(2);
        expect(json.user).toBeDefined();
    });
});
