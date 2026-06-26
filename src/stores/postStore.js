import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePostStore = defineStore('posts', () => {
  const posts = ref([])
  
  const loadPosts = () => {
    const stored = localStorage.getItem('whisper_posts')
    if (stored) {
      posts.value = JSON.parse(stored)
    }
  }
  
  const savePosts = () => {
    localStorage.setItem('whisper_posts', JSON.stringify(posts.value))
  }
  
  const addPost = (post) => {
    posts.value.unshift(post)
    savePosts()
  }
  
  const deletePost = (id) => {
    posts.value = posts.value.filter(post => post.id !== id)
    savePosts()
  }
  
  const sortedPosts = computed(() => {
    return [...posts.value].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
  })
  
  loadPosts()
  
  return {
    posts,
    sortedPosts,
    addPost,
    deletePost
  }
})
