import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import PostForm from '../src/components/PostForm.vue'
import PostList from '../src/components/PostList.vue'
import { usePostStore } from '../src/stores/postStore'

describe('PostForm Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
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
    localStorage.clear()
  })

  it('should render empty message when no posts', () => {
    const wrapper = mount(PostList)
    expect(wrapper.text()).toContain('还没有发布任何内容')
  })

  it('should render posts from store', () => {
    const store = usePostStore()
    store.addPost({
      id: '1',
      content: 'Test post',
      image: '',
      timestamp: '2024-01-01 12:00:00'
    })
    const wrapper = mount(PostList)
    expect(wrapper.text()).toContain('Test post')
  })
})
