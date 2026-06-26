import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import PostForm from '../src/components/PostForm.vue'
import PostList from '../src/components/PostList.vue'
import Favorites from '../src/components/Favorites.vue'
import { usePostStore } from '../src/stores/postStore'

describe('PostForm Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render form elements', () => {
    const wrapper = mount(PostForm)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should emit publish event with content', async () => {
    const wrapper = mount(PostForm)
    const textarea = wrapper.find('textarea')
    await textarea.setValue('Test content')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('publish')
  })
})

describe('PostList Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render empty message when no posts', () => {
    const wrapper = mount(PostList)
    expect(wrapper.text()).toContain('还没有发布任何内容')
  })

  it('should render posts from store', async () => {
    const store = usePostStore()
    store.posts = [{
      id: '1',
      content: 'Test post',
      image: '',
      timestamp: '2024-01-01 12:00:00',
      likes: 0,
      isFavorite: false
    }]
    store.loading = false
    
    const wrapper = mount(PostList)
    await flushPromises()
    
    expect(wrapper.text()).toContain('Test post')
  })

  it('should render like button with count', async () => {
    const store = usePostStore()
    store.posts = [{
      id: '1',
      content: 'Test post',
      image: '',
      timestamp: '2024-01-01 12:00:00',
      likes: 5,
      isFavorite: false
    }]
    store.loading = false
    
    const wrapper = mount(PostList)
    await flushPromises()
    
    expect(wrapper.text()).toContain('5')
    expect(wrapper.find('.like-btn').exists()).toBe(true)
  })

  it('should render favorite button', async () => {
    const store = usePostStore()
    store.posts = [{
      id: '1',
      content: 'Test post',
      image: '',
      timestamp: '2024-01-01 12:00:00',
      likes: 0,
      isFavorite: false
    }]
    store.loading = false
    
    const wrapper = mount(PostList)
    await flushPromises()
    
    expect(wrapper.find('.favorite-btn').exists()).toBe(true)
  })

  it('should call likePost when like button clicked', async () => {
    const store = usePostStore()
    store.posts = [{
      id: '1',
      content: 'Test post',
      image: '',
      timestamp: '2024-01-01 12:00:00',
      likes: 0,
      isFavorite: false
    }]
    store.loading = false
    store.likePost = vi.fn()
    
    const wrapper = mount(PostList)
    await flushPromises()
    
    await wrapper.find('.like-btn').trigger('click')
    expect(store.likePost).toHaveBeenCalledWith('1')
  })

  it('should call favoritePost when favorite button clicked', async () => {
    const store = usePostStore()
    store.posts = [{
      id: '1',
      content: 'Test post',
      image: '',
      timestamp: '2024-01-01 12:00:00',
      likes: 0,
      isFavorite: false
    }]
    store.loading = false
    store.favoritePost = vi.fn()
    
    const wrapper = mount(PostList)
    await flushPromises()
    
    await wrapper.find('.favorite-btn').trigger('click')
    expect(store.favoritePost).toHaveBeenCalledWith('1')
  })
})

describe('Favorites Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render empty message when no favorites', () => {
    const wrapper = mount(Favorites)
    expect(wrapper.text()).toContain('还没有收藏任何内容')
  })

  it('should render favorite posts', async () => {
    const store = usePostStore()
    store.favorites = [{
      id: '1',
      content: 'Favorite post',
      image: '',
      timestamp: '2024-01-01 12:00:00',
      likes: 5,
      isFavorite: true
    }]
    store.loading = false
    
    const wrapper = mount(Favorites)
    await flushPromises()
    
    expect(wrapper.text()).toContain('Favorite post')
  })

  it('should render like and favorite buttons', async () => {
    const store = usePostStore()
    store.favorites = [{
      id: '1',
      content: 'Favorite post',
      image: '',
      timestamp: '2024-01-01 12:00:00',
      likes: 5,
      isFavorite: true
    }]
    store.loading = false
    
    const wrapper = mount(Favorites)
    await flushPromises()
    
    expect(wrapper.find('.like-btn').exists()).toBe(true)
    expect(wrapper.find('.favorite-btn').exists()).toBe(true)
  })
})