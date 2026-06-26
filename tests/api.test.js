import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/index.js';

describe('Posts API', () => {
  beforeEach(() => {
    // Reset the posts store before each test
    app.posts.clear();
    app.nextId = 1;
  });

  describe('GET /api/posts', () => {
    it('should return empty array when no posts exist', async () => {
      const res = await request(app.server).get('/api/posts');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all posts', async () => {
      // Create a post first
      await request(app.server)
        .post('/api/posts')
        .send({ content: 'Test post', image: 'test.jpg' });

      const res = await request(app.server).get('/api/posts');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].content).toBe('Test post');
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post', async () => {
      const res = await request(app.server)
        .post('/api/posts')
        .send({ content: 'Hello World', image: 'hello.jpg' });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        id: 1,
        content: 'Hello World',
        image: 'hello.jpg',
        likes: 0,
        favorited: false,
      });
      expect(res.body.timestamp).toBeDefined();
    });

    it('should return 400 if content is missing', async () => {
      const res = await request(app.server)
        .post('/api/posts')
        .send({ image: 'hello.jpg' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post', async () => {
      await request(app.server)
        .post('/api/posts')
        .send({ content: 'To delete', image: 'delete.jpg' });

      const res = await request(app.server).delete('/api/posts/1');
      expect(res.status).toBe(204);

      const getRes = await request(app.server).get('/api/posts');
      expect(getRes.body).toHaveLength(0);
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app.server).delete('/api/posts/999');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/posts/:id/like', () => {
    it('should increment likes', async () => {
      await request(app.server)
        .post('/api/posts')
        .send({ content: 'Like me', image: 'like.jpg' });

      const res = await request(app.server).post('/api/posts/1/like');
      expect(res.status).toBe(200);
      expect(res.body.likes).toBe(1);
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app.server).post('/api/posts/999/like');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/posts/:id/favorite', () => {
    it('should toggle favorite status', async () => {
      await request(app.server)
        .post('/api/posts')
        .send({ content: 'Favorite me', image: 'fav.jpg' });

      const res1 = await request(app.server).post('/api/posts/1/favorite');
      expect(res1.status).toBe(200);
      expect(res1.body.favorited).toBe(true);

      const res2 = await request(app.server).post('/api/posts/1/favorite');
      expect(res2.status).toBe(200);
      expect(res2.body.favorited).toBe(false);
    });

    it('should return 404 for non-existent post', async () => {
      const res = await request(app.server).post('/api/posts/999/favorite');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/posts/favorites', () => {
    it('should return only favorited posts', async () => {
      await request(app.server)
        .post('/api/posts')
        .send({ content: 'Post 1', image: '1.jpg' });
      await request(app.server)
        .post('/api/posts')
        .send({ content: 'Post 2', image: '2.jpg' });

      await request(app.server).post('/api/posts/1/favorite');

      const res = await request(app.server).get('/api/posts/favorites');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].content).toBe('Post 1');
    });
  });
});
