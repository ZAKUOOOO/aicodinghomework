import { Hono } from 'hono';
import { serve } from '@hono/node-server';

const app = new Hono();

// In-memory storage
app.posts = new Map();
app.nextId = 1;

// GET /api/posts - Get all posts
app.get('/api/posts', (c) => {
  const posts = Array.from(app.posts.values());
  return c.json(posts);
});

// POST /api/posts - Create a new post
app.post('/api/posts', async (c) => {
  const body = await c.req.json();
  
  if (!body.content) {
    return c.json({ error: 'Content is required' }, 400);
  }

  const post = {
    id: app.nextId++,
    content: body.content,
    image: body.image || null,
    timestamp: new Date().toISOString(),
    likes: 0,
    favorited: false,
  };

  app.posts.set(post.id, post);
  return c.json(post, 201);
});

// DELETE /api/posts/:id - Delete a post
app.delete('/api/posts/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  
  if (!app.posts.has(id)) {
    return c.json({ error: 'Post not found' }, 404);
  }

  app.posts.delete(id);
  return c.body(null, 204);
});

// POST /api/posts/:id/like - Like a post
app.post('/api/posts/:id/like', (c) => {
  const id = parseInt(c.req.param('id'));
  
  if (!app.posts.has(id)) {
    return c.json({ error: 'Post not found' }, 404);
  }

  const post = app.posts.get(id);
  post.likes++;
  app.posts.set(id, post);
  
  return c.json(post);
});

// POST /api/posts/:id/favorite - Toggle favorite
app.post('/api/posts/:id/favorite', (c) => {
  const id = parseInt(c.req.param('id'));
  
  if (!app.posts.has(id)) {
    return c.json({ error: 'Post not found' }, 404);
  }

  const post = app.posts.get(id);
  post.favorited = !post.favorited;
  app.posts.set(id, post);
  
  return c.json(post);
});

// GET /api/posts/favorites - Get favorited posts
app.get('/api/posts/favorites', (c) => {
  const favorites = Array.from(app.posts.values()).filter(post => post.favorited);
  return c.json(favorites);
});

// Create a server for testing
const server = serve({ fetch: app.fetch, port: 0 });
app.server = server;

// Start server if run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` || process.argv[1].includes('src\\index.js');
if (isMainModule) {
  const mainServer = serve({ fetch: app.fetch, port: 3000 });
  console.log('Server is running on port 3000');
}

export default app;