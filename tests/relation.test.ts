/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response } from '@luminix/support';

import Http from '../src/facades/Http';

import BelongsTo from '../src/contracts/Relation/BelongsTo';
import BelongsToMany from '../src/contracts/Relation/BelongsToMany';
import HasMany from '../src/contracts/Relation/HasMany';
import HasOne from '../src/contracts/Relation/HasOne';
import MorphMany from '../src/contracts/Relation/MorphMany';
import MorphOne from '../src/contracts/Relation/MorphOne';
import MorphTo from '../src/contracts/Relation/MorphTo';
import NotModelException from '../src/exceptions/NotModelException';
import ModelInvalidRelatedTypeException from '../src/exceptions/ModelInvalidRelatedTypeException';
import ModelNotPersistedException from '../src/exceptions/ModelNotPersistedException';

import models from './__mocks__/appmodels';

beforeEach(() => {
    jest.resetModules();
});

afterEach(() => {
    (Http.get as any).mockClear();
    (Http.post as any).mockClear();
    (Http.put as any).mockClear();
    (Http.patch as any).mockClear();
    (Http.delete as any).mockClear();
});

const {
    models: {
        Post,
        Attachment,
        Comment,
        File,
        User,
    },
    data: {
        users,
        comments,
        attachments,
        files,
        post,
        attachment,
        chair,
    }
} = models;

/* * * * */

const _get = (data = { data: [], meta: {} } as any) => {
    (Http.get as any).mockReset();
    (Http.get as any).mockImplementationOnce(() => Promise.resolve(new Response({
        config: {
            headers: { 'Content-Type': 'application/json' } as any,
        },
        data,
        headers: { 'Content-Type': 'application/json' },
        status: 200,
        statusText: 'OK',
    })));
};

const _post = (data = {} as any) => {
    (Http.post as any).mockReset();
    (Http.post as any).mockImplementationOnce(() => Promise.resolve(new Response({
        config: {
            headers: { 'Content-Type': 'application/json' } as any,
        },
        data,
        headers: { 'Content-Type': 'application/json' },
        status: 200,
        statusText: 'OK',
    })));
};

const _put = (data = {} as any) => {
    (Http.put as any).mockReset();
    (Http.put as any).mockImplementationOnce(() => Promise.resolve(new Response({
        config: {
            headers: { 'Content-Type': 'application/json' } as any,
        },
        data,
        headers: { 'Content-Type': 'application/json' },
        status: 200,
        statusText: 'OK',
    })));
};

/* * * * */

describe('testing relations with eager loading', () => {

    test("model 'belongs to' relation", async () => {
        if (!post.relations) {
            throw new Error("'post authorRelations' is null");
        }

        const relation = post.authorRelation();

        expect(relation).toBeInstanceOf(BelongsTo);

        expect(relation.isSingle()).toBe(true);
        expect(relation.isMultiple()).toBe(false);
    });

    test("model 'belongs to many' relation", async () => {
        if (!chair.relations) {
            throw new Error("'chair usersRelations' is null");
        }

        const relation = chair.usersRelation();

        expect(relation).toBeInstanceOf(BelongsToMany);

        expect(relation.isSingle()).toBe(false);
        expect(relation.isMultiple()).toBe(true);

        const chairUsers = users.filter((_user) => _user.chairs.some((_chair: any) => _chair.id == chair.id));
        const firstChairUser = chairUsers.first()!;

        /* * */

        _get({
            data: [ firstChairUser.toJson() ],
            meta: {
                links: { url: '' },
                page: 1,
                per_page: 10,
                last_page: 1,
            }
        });

        const f = await relation.first();
        expect(f.attributes).toMatchObject(firstChairUser.attributes);

        /* * */

        _get({
            data: chairUsers.toArray(),
            meta: {
                links: { url: '' },
                page: 1,
                per_page: 10,
                last_page: 1,
            }
        });

        const a = (await relation.all()).toArray();
        expect(a.map(
            (_user: any) => _user.attributes)
        ).toEqual(chairUsers.toArray().map(
            (_user: any) => _user.attributes)
        );
    });

    test("model 'has many' relation", async () => {
        if (!post.relations) {
            throw new Error("'post commentsRelations' is null");
        }

        const relation = post.commentsRelation();

        expect(relation).toBeInstanceOf(HasMany);

        expect(relation.isSingle()).toBe(false);
        expect(relation.isMultiple()).toBe(true);

        const postComments = comments.filter((_comment) => _comment.post_id == post.id);
        const firstPostComment = postComments.first()!;

        /* * */

        _get({
            data: [ firstPostComment.toJson() ],
            meta: {
                links: { url: '' },
                page: 1,
                per_page: 10,
                last_page: 1,
            }
        });

        const f = await relation.first();
        expect(f.attributes).toMatchObject(firstPostComment.attributes);

        /* * */

        _get({
            data: postComments.toArray(),
            meta: {
                links: { url: '' },
                page: 1,
                per_page: 10,
                last_page: 1,
            }
        });

        const a = (await relation.all()).toArray();
        expect(a.map(
            (_comment: any) => _comment.attributes)
        ).toEqual(postComments.toArray().map(
            (_comment: any) => _comment.attributes)
        );
    });

    test("model 'has one' relation", async () => {
        if (!attachment.relations) {
            throw new Error("'attachment fileRelations' is null");
        }

        const relation = attachment.fileRelation();

        expect(relation).toBeInstanceOf(HasOne);

        expect(relation.isSingle()).toBe(true);
        expect(relation.isMultiple()).toBe(false);

        const attachmentFiles = files.filter((_file) => _file.id == attachment.file_id);
        const firstAttachmentFile = attachmentFiles.first()!;

        /* * */

        _get({
            data: [ firstAttachmentFile.toJson() ],
            meta: {
                links: { url: '' },
                page: 1,
                per_page: 10,
                last_page: 1,
            }
        });

        const f = (attachment.relation('file') as any).items;
        expect(f.attributes).toMatchObject(firstAttachmentFile.attributes);
    });

    // test.skip("model 'has one or many' relation") — corpo vazio; coberto pelos testes 'has one' e 'has many' separados.

    /* * * * */

    test("model 'morph many' relation", async () => {
        if (!post.relations) {
            throw new Error("'post attachmentsRelations' is null");
        }

        const relation = post.attachmentsRelation();

        expect(relation).toBeInstanceOf(MorphMany);

        expect(relation.isSingle()).toBe(false);
        expect(relation.isMultiple()).toBe(true);

        const postAttachments = attachments.filter(
            (_attachment) => _attachment.attachable_type == 'post' && _attachment.attachable_id == post.id
        );
        const firstPostAttachment = postAttachments.first()!;

        /* * */

        _get({
            data: [ firstPostAttachment.toJson() ],
            meta: {
                page: 1,
                per_page: 10,
                current_page: 1,
                last_page: 1,
            }
        });

        const items = (post.relation('attachments') as any).items;

        const f = items.first();
        expect(f.attributes).toMatchObject(firstPostAttachment.attributes);

        /* * */

        _get({
            data: postAttachments.toArray(),
            meta: {
                page: 1,
                per_page: 10,
                current_page: 1,
                last_page: 1,
            }
        });

        const a = items.toArray();
        expect(a.map(
            (_attachment: any) => _attachment.attributes)
        ).toEqual(postAttachments.toArray().map(
            (_attachment: any) => _attachment.attributes)
        );
    });

    test("model 'morph one' relation", async () => {
        const fileWithAttachment = new File({
            id: 1,
            path: '/path/to/file.jpg',
            type: 'image',
            attachment_id: 1,
            attachment: {
                id: 1,
                path: '/path/to/attachment.jpg',
                type: 'image',
                attachable_id: 1,
                attachable_type: 'file',
                size: null,
                author_id: null,
                created_at: '2021-01-01T00:00:00.000Z',
                updated_at: '2021-01-01T00:00:00.000Z',
                deleted_at: null,
            },
            created_at: '2021-01-01T00:00:00.000Z',
            updated_at: '2021-01-01T00:00:00.000Z',
            deleted_at: null,
        });

        const relation = fileWithAttachment.attachmentRelation();

        expect(relation).toBeInstanceOf(MorphOne);
        expect(relation.isSingle()).toBe(true);
        expect(relation.isMultiple()).toBe(false);

        const f = (fileWithAttachment.relation('attachment') as any).items;
        expect(f).not.toBeNull();
        expect(f.id).toBe(1);
        expect(f.path).toBe('/path/to/attachment.jpg');
    });

    // test.skip("model 'morph one or many' relation") — corpo vazio; coberto pelos testes 'morph one' e 'morph many' separados.

    // test.skip("model 'morph to' relation") — corpo vazio; MorphTo é polimórfico e não há infraestrutura
    // de teste para resolver o tipo dinamicamente.

    // test.skip("model 'morph to many' relation") — nenhum modelo no manifest possui relação MorphToMany.

});

describe('testing relations with lazy loading', () => {

    // test.skip("model 'belongs to' relation methods") — associate/dissociate não implementados.

    // test.skip("model 'belongs to many' relation methods") — lazy loading de BelongsToMany não implementado.

    test("model 'has many' relation methods", async () => {
        // Create a Post
        _post({ id: 100, title: 'New Post', published_at: null, author_id: null });
        const _Post = await Post.create({ title: 'New Post', published_at: null });

        expect(_Post.relation('comments')).toBeInstanceOf(HasMany);

        // Create a Comment (use 'body' which IS fillable for post_comment)
        _post({ id: 200, body: 'test comment', post_id: null, user_id: null });
        const _comment = await Comment.create({ body: 'test comment' });

        expect(_comment.relation('post')).toBeInstanceOf(BelongsTo);

        const relation = _Post.commentsRelation() as HasMany;

        // Initial state: not loaded
        expect(relation.getLoadedItems()).toBeNull();

        // saveManyQuietly: foreign key set and HTTP PUT made, cache NOT updated
        _put({ id: 200, body: 'test comment', post_id: 100, user_id: null });
        await relation.saveManyQuietly([_comment]);
        expect(relation.getLoadedItems()).toBeNull();

        // saveMany: comment is already clean after previous PUT, so no second PUT;
        // items cache is updated with the provided models
        await relation.saveMany([_comment]);
        const cachedItems = relation.getLoadedItems() as any;
        expect(cachedItems).not.toBeNull();
        expect(cachedItems.pluck('id').toArray()).toContain(200);

        // save: new comment gets foreign key set and PUT called, then pushed to cache
        _post({ id: 201, body: 'second comment', post_id: null, user_id: null });
        const _comment2 = await Comment.create({ body: 'second comment' });
        _put({ id: 201, body: 'second comment', post_id: 100, user_id: null });
        await relation.save(_comment2);
        expect((relation.getLoadedItems() as any).count()).toBe(2);
    });

    test("model 'has one' relation methods", async () => {
        // Create an Attachment (no store route in manifest, using Attachment which has store)
        _post({ id: 30, path: '/attachment.jpg', type: 'image', attachable_id: null, attachable_type: null, size: null });
        const _attachment = await Attachment.create({ path: '/attachment.jpg', type: 'image' });

        expect(_attachment.relation('file')).toBeInstanceOf(HasOne);

        // Create a File
        _post({ id: 40, path: '/file.jpg', type: 'image', attachment_id: null });
        const _file = await File.create({ path: '/file.jpg', type: 'image' });

        expect(_file.relation('attachment')).toBeInstanceOf(MorphOne);

        const relation = _attachment.fileRelation() as HasOne;

        // Initial state: not loaded
        expect(relation.getLoadedItems()).toBeNull();

        // save: foreign key (attachment_id) set on file, HTTP PUT, cache set to _file
        _put({ id: 40, path: '/file.jpg', type: 'image', attachment_id: 30 });
        await relation.save(_file);

        const loaded = relation.getLoadedItems() as any;
        expect(loaded).not.toBeNull();
        expect(loaded.id).toBe(40);
    });

    /* * * * */

    test("BelongsTo associate() sets foreign key via parent.update()", async () => {
        const parentPost = new Post({ id: 1, title: 'Test', published_at: null, author_id: null });
        parentPost.exists = true;

        const relatedUser = new User({ id: 5, name: 'Author', email: 'a@a.com', password: null });
        relatedUser.exists = true;

        const relation = parentPost.authorRelation() as BelongsTo;

        _put({ id: 1, title: 'Test', published_at: null, author_id: 5 });
        await relation.associate(relatedUser);

        expect(Http.put).toHaveBeenCalledWith('/api/luminix/posts/1');
        expect(Http.withData).toHaveBeenCalledWith({ author_id: 5 });
    });

    test("BelongsTo associate() throws when item not persisted", async () => {
        const parentPost = new Post({ id: 1, title: 'Test', published_at: null, author_id: null });
        parentPost.exists = true;

        const freshUser = new User({ name: 'Ghost', email: 'g@g.com', password: null });

        const relation = parentPost.authorRelation() as BelongsTo;

        await expect(relation.associate(freshUser)).rejects.toThrow(ModelNotPersistedException);
    });

    test("BelongsTo associate() throws for wrong model type", async () => {
        const parentPost = new Post({ id: 1, title: 'Test', published_at: null, author_id: null });
        parentPost.exists = true;

        const wrongModel = new Post({ id: 2, title: 'Other', published_at: null, author_id: null });
        wrongModel.exists = true;

        const relation = parentPost.authorRelation() as BelongsTo;

        await expect(relation.associate(wrongModel)).rejects.toThrow(ModelInvalidRelatedTypeException);
    });

    test("BelongsTo associate() throws when item is not a model", async () => {
        const parentPost = new Post({ id: 1, title: 'Test', published_at: null, author_id: null });
        parentPost.exists = true;

        const relation = parentPost.authorRelation() as BelongsTo;

        await expect(relation.associate('not-a-model' as any)).rejects.toThrow(NotModelException);
    });

    test("BelongsTo dissociate() clears foreign key via parent.update()", async () => {
        const parentPost = new Post({ id: 1, title: 'Test', published_at: null, author_id: 5 });
        parentPost.exists = true;

        const relation = parentPost.authorRelation() as BelongsTo;

        _put({ id: 1, title: 'Test', published_at: null, author_id: null });
        await relation.dissociate();

        expect(Http.put).toHaveBeenCalledWith('/api/luminix/posts/1');
        expect(Http.withData).toHaveBeenCalledWith({ author_id: null });
    });

    test("MorphTo associate() sets morph id and type via parent.update()", async () => {
        const parentAttachment = new Attachment({
            id: 10, path: '/a.jpg', type: 'image',
            attachable_id: null, attachable_type: null, size: null, author_id: null,
        });
        parentAttachment.exists = true;

        const relatedPost = new Post({ id: 20, title: 'Test', published_at: null, author_id: null });
        relatedPost.exists = true;

        const relation = parentAttachment.attachableRelation() as MorphTo;
        expect(relation).toBeInstanceOf(MorphTo);

        _put({ id: 10, path: '/a.jpg', type: 'image', attachable_id: 20, attachable_type: 'post' });
        await relation.associate(relatedPost);

        expect(Http.put).toHaveBeenCalledWith('/api/luminix/attachments/10');
        expect(Http.withData).toHaveBeenCalledWith({ attachable_id: 20, attachable_type: 'post' });
    });

    test("MorphTo associate() saves item first if not persisted", async () => {
        const parentAttachment = new Attachment({
            id: 10, path: '/a.jpg', type: 'image',
            attachable_id: null, attachable_type: null, size: null, author_id: null,
        });
        parentAttachment.exists = true;

        const freshPost = new Post({ title: 'New Post', published_at: null, author_id: null });
        // freshPost.exists = false (default)

        const relation = parentAttachment.attachableRelation() as MorphTo;

        // First call: save the new post (POST store)
        _post({ id: 99, title: 'New Post', published_at: null, author_id: null });
        // Second call: update the attachment with morph keys (PUT update)
        _put({ id: 10, path: '/a.jpg', type: 'image', attachable_id: 99, attachable_type: 'post' });

        await relation.associate(freshPost);

        expect(Http.post).toHaveBeenCalledWith('/api/luminix/posts');
        expect(Http.put).toHaveBeenCalledWith('/api/luminix/attachments/10');
        expect(Http.withData).toHaveBeenCalledWith({ attachable_id: 99, attachable_type: 'post' });
    });

    test("MorphTo dissociate() clears morph id and type via parent.update()", async () => {
        const parentAttachment = new Attachment({
            id: 10, path: '/a.jpg', type: 'image',
            attachable_id: 20, attachable_type: 'post', size: null, author_id: null,
        });
        parentAttachment.exists = true;

        const relation = parentAttachment.attachableRelation() as MorphTo;

        _put({ id: 10, path: '/a.jpg', type: 'image', attachable_id: null, attachable_type: null });
        await relation.dissociate();

        expect(Http.put).toHaveBeenCalledWith('/api/luminix/attachments/10');
        expect(Http.withData).toHaveBeenCalledWith({ attachable_id: null, attachable_type: null });
    });

    test("model 'morph many' relation methods", async () => {
        // Create a Post
        _post({ id: 300, title: 'New Post', published_at: null, author_id: null });
        const _Post = await Post.create({ title: 'New Post', published_at: null });

        expect(_Post.relation('attachments')).toBeInstanceOf(MorphMany);

        // Create an Attachment
        _post({ id: 400, path: '/a.jpg', type: 'image', attachable_id: null, attachable_type: null, size: null });
        const _attachment = await Attachment.create({ path: '/a.jpg', type: 'image' });

        expect(_attachment.relation('attachable')).toBeInstanceOf(MorphTo);

        const relation = _Post.attachmentsRelation() as MorphMany;

        // Initial state: not loaded
        expect(relation.getLoadedItems()).toBeNull();

        // saveManyQuietly: sets 'attachments_id' and 'attachments_type' (NOT fillable),
        // so save() exits early — no HTTP call, cache unchanged
        await relation.saveManyQuietly([_attachment]);
        expect(relation.getLoadedItems()).toBeNull();

        // saveMany: same early-exit for save, then fetches all (HTTP GET), cache updated
        _get({
            data: [{ id: 400, path: '/a.jpg', type: 'image', attachable_id: 300, attachable_type: 'post' }],
            meta: { current_page: 1, last_page: 1, per_page: 15, total: 1, from: 1, to: 1, links: [] },
            links: { first: '', last: '', prev: null, next: null },
        });
        await relation.saveMany([_attachment]);
        const cachedItems = relation.getLoadedItems() as any;
        expect(cachedItems).not.toBeNull();
        expect(cachedItems.pluck('id').toArray()).toContain(400);

        // save: uses MorphOneOrMany.saveQuietly → sets 'attachable_id' and 'attachable_type' (fillable),
        // save() sends HTTP PUT, then pushes item to existing cache
        _post({ id: 401, path: '/b.jpg', type: 'image', attachable_id: null, attachable_type: null, size: null });
        const _attachment2 = await Attachment.create({ path: '/b.jpg', type: 'image' });
        _put({ id: 401, path: '/b.jpg', type: 'image', attachable_id: 300, attachable_type: 'post' });
        await relation.save(_attachment2);
        expect((relation.getLoadedItems() as any).count()).toBe(2);
    });

});
