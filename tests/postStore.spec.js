import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePostStore } from '../src/stores/postStore'

describe('Post Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with empty posts', () => {
    const store = usePostStore()
    expect(store.posts).toEqual([])
  })

  it('should fetch posts from API', async () => {
    const mockPosts = [
      { id: '1', content: 'Test post', image: '', timestamp: '2024-01-01 12:00:00', likes: 0, isFavorite: false }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts
    })

    const store = usePostStore()
    await store.fetchPosts()

    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].content).toBe('Test post')
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/posts')
  })

  it('should add a post via API', async () => {
    const newPost = { id: '2', content: 'New post', image: '', timestamp: '2024-01-01 12:00:00', likes: 0, isFavorite: false }
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newPost
    })

    const store = usePostStore()
    const result = await store.addPost({
      content: 'New post',
      image: ''
    })

    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].content).toBe('New post')
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'New post', image: '' })
    })
  })

  it('should delete a post via API', async () => {
    const store = usePostStore()
    store.posts = [{ id: '3', content: 'To delete', image: '', timestamp: '2024-01-01 12:00:00', likes: 0, isFavorite: false }]

    global.fetch.mockResolvedValueOnce({
      ok: true
    })

    await store.deletePost('3')

    expect(store.posts).toHaveLength(0)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/posts/3', {
      method: 'DELETE'
    })
  })

  it('should like a post via API', async () => {
    const store = usePostStore()
    store.posts = [{ id: '4', content: 'Test post', image: '', timestamp: '2024-01-01 12:00:00', likes: 0, isFavorite: false }]

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '4', likes: 1 })
    })

    await store.likePost('4')

    expect(store.posts[0].likes).toBe(1)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/posts/4/like', {
      method: 'POST'
    })
  })

  it('should favorite a post via API', async () => {
    const store = usePostStore()
    store.posts = [{ id: '5', content: 'Test post', image: '', timestamp: '2024-01-01 12:00:00', likes: 0, isFavorite: false }]

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '5', isFavorite: true })
    })

    await store.favoritePost('5')

    expect(store.posts[0].isFavorite).toBe(true)
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/posts/5/favorite', {
      method: 'POST'
    })
  })

  it('should fetch favorite posts', async () => {
    const mockFavorites = [
      { id: '6', content: 'Favorite post', image: '', timestamp: '2024-01-01 12:00:00', likes: 5, isFavorite: true }
    ]
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockFavorites
    })

    const store = usePostStore()
    const favorites = await store.fetchFavorites()

    expect(favorites).toHaveLength(1)
    expect(favorites[0].content).toBe('Favorite post')
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/posts/favorites')
  })

  it('should handle API errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    const store = usePostStore()
    await store.fetchPosts()

    expect(store.posts).toEqual([])
  })
})
