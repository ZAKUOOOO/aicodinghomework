import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePostStore } from '../src/stores/postStore'

describe('Post Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with empty posts', () => {
    const store = usePostStore()
    expect(store.posts).toEqual([])
  })

  it('should add a post with content only', () => {
    const store = usePostStore()
    store.addPost({
      id: '1',
      content: 'Test content',
      image: '',
      timestamp: '2024-01-01 12:00:00'
    })
    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].content).toBe('Test content')
  })

  it('should add a post with image', () => {
    const store = usePostStore()
    store.addPost({
      id: '2',
      content: 'Test with image',
      image: 'data:image/png;base64,abc123',
      timestamp: '2024-01-01 12:00:00'
    })
    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].image).toBe('data:image/png;base64,abc123')
  })

  it('should delete a post by id', () => {
    const store = usePostStore()
    store.addPost({
      id: '3',
      content: 'To be deleted',
      image: '',
      timestamp: '2024-01-01 12:00:00'
    })
    store.deletePost('3')
    expect(store.posts).toHaveLength(0)
  })

  it('should persist posts to localStorage', () => {
    const store = usePostStore()
    store.addPost({
      id: '4',
      content: 'Persisted post',
      image: '',
      timestamp: '2024-01-01 12:00:00'
    })
    const stored = JSON.parse(localStorage.getItem('whisper_posts'))
    expect(stored).toHaveLength(1)
    expect(stored[0].content).toBe('Persisted post')
  })

  it('should load posts from localStorage', () => {
    localStorage.setItem('whisper_posts', JSON.stringify([{
      id: '5',
      content: 'Loaded post',
      image: '',
      timestamp: '2024-01-01 12:00:00'
    }]))
    const store = usePostStore()
    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].content).toBe('Loaded post')
  })
})
