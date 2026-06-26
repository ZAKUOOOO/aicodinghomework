import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_BASE_URL = 'http://localhost:3000'

export const usePostStore = defineStore('posts', () => {
  const posts = ref([])
  const favorites = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPosts = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await fetch(`${API_BASE_URL}/api/posts`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      posts.value = await response.json()
    } catch (err) {
      error.value = err.message
      console.error('Error fetching posts:', err)
    } finally {
      loading.value = false
    }
  }

  const addPost = async (post) => {
    try {
      loading.value = true
      error.value = null
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })
      if (!response.ok) throw new Error('Failed to add post')
      const newPost = await response.json()
      posts.value.unshift(newPost)
      return newPost
    } catch (err) {
      error.value = err.message
      console.error('Error adding post:', err)
    } finally {
      loading.value = false
    }
  }

  const deletePost = async (id) => {
    try {
      loading.value = true
      error.value = null
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete post')
      posts.value = posts.value.filter(post => post.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting post:', err)
    } finally {
      loading.value = false
    }
  }

  const likePost = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/like`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to like post')
      const result = await response.json()
      const post = posts.value.find(p => p.id === id)
      if (post) {
        post.likes = result.likes
      }
      const favoritePost = favorites.value.find(p => p.id === id)
      if (favoritePost) {
        favoritePost.likes = result.likes
      }
    } catch (err) {
      console.error('Error liking post:', err)
    }
  }

  const favoritePost = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}/favorite`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to favorite post')
      const result = await response.json()
      const post = posts.value.find(p => p.id === id)
      if (post) {
        post.isFavorite = result.isFavorite
      }
      if (result.isFavorite) {
        const postToAdd = posts.value.find(p => p.id === id)
        if (postToAdd && !favorites.value.find(p => p.id === id)) {
          favorites.value.push(postToAdd)
        }
      } else {
        favorites.value = favorites.value.filter(p => p.id !== id)
      }
    } catch (err) {
      console.error('Error favoriting post:', err)
    }
  }

  const fetchFavorites = async () => {
    try {
      loading.value = true
      error.value = null
      const response = await fetch(`${API_BASE_URL}/api/posts/favorites`)
      if (!response.ok) throw new Error('Failed to fetch favorites')
      favorites.value = await response.json()
      return favorites.value
    } catch (err) {
      error.value = err.message
      console.error('Error fetching favorites:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const sortedPosts = computed(() => {
    return [...posts.value].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
  })

  const sortedFavorites = computed(() => {
    return [...favorites.value].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
  })

  return {
    posts,
    favorites,
    loading,
    error,
    sortedPosts,
    sortedFavorites,
    fetchPosts,
    addPost,
    deletePost,
    likePost,
    favoritePost,
    fetchFavorites
  }
})
