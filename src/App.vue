<template>
  <div class="container">
    <header>
      <h1>微语</h1>
      <p>分享你的瞬间</p>
    </header>
    
    <nav class="nav">
      <button 
        class="nav-btn" 
        :class="{ active: currentView === 'home' }"
        @click="currentView = 'home'"
      >
        首页
      </button>
      <button 
        class="nav-btn" 
        :class="{ active: currentView === 'favorites' }"
        @click="currentView = 'favorites'"
      >
        收藏
      </button>
    </nav>
    
    <div v-if="currentView === 'home'">
      <PostForm @publish="handlePublish" />
      <PostList />
    </div>
    
    <div v-else-if="currentView === 'favorites'">
      <Favorites />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePostStore } from './stores/postStore'
import PostForm from './components/PostForm.vue'
import PostList from './components/PostList.vue'
import Favorites from './components/Favorites.vue'

const store = usePostStore()
const currentView = ref('home')

const handlePublish = async (post) => {
  await store.addPost(post)
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f5f5f5;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  color: #333;
  font-size: 2em;
}

header p {
  color: #666;
  margin-top: 5px;
}

.nav {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #e0e0e0;
}

.nav-btn.active {
  background: #1da1f2;
  color: white;
}
</style>
