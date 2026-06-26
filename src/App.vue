<template>
  <div class="app-wrapper">
    <!-- 顶部导航栏 -->
    <nav class="top-nav">
      <div class="nav-content">
        <div class="logo">
          <span class="logo-icon">🐦</span>
          <span class="logo-text">微语</span>
        </div>
        <div class="nav-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: currentView === 'home' }"
            @click="currentView = 'home'"
          >
            <span class="tab-icon">🏠</span>
            <span>首页</span>
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: currentView === 'favorites' }"
            @click="currentView = 'favorites'"
          >
            <span class="tab-icon">⭐</span>
            <span>收藏</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 左侧边栏 -->
      <aside class="left-sidebar">
        <div class="user-card">
          <div class="avatar">👤</div>
          <div class="username">访客用户</div>
        </div>
      </aside>

      <!-- 中间内容区 -->
      <main class="content-area">
        <div v-if="currentView === 'home'">
          <PostForm @publish="handlePublish" />
          <PostList />
        </div>
    <div v-else-if="currentView === 'favorites'">
      <Favorites @navigate="currentView = 'home'" />
    </div>
      </main>

      <!-- 右侧边栏 -->
      <aside class="right-sidebar">
        <div class="sidebar-card">
          <h3>热门话题</h3>
          <div class="trending-item" v-for="i in 5" :key="i">
            <span class="trending-rank">{{ i }}</span>
            <span class="trending-text">话题 {{ i }}</span>
          </div>
        </div>
      </aside>
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
  background-color: #f0f2f5;
}

.app-wrapper {
  min-height: 100vh;
}

/* 顶部导航栏 */
.top-nav {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: bold;
  color: #fa7d3c;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  background: linear-gradient(135deg, #fa7d3c 0%, #ff6b6b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-tabs {
  display: flex;
  gap: 4px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border: none;
  background: transparent;
  border-radius: 20px;
  cursor: pointer;
  font-size: 15px;
  color: #666;
  transition: all 0.3s;
  font-weight: 500;
}

.tab-btn:hover {
  background: #f0f2f5;
  color: #333;
}

.tab-btn.active {
  background: linear-gradient(135deg, #fa7d3c 0%, #ff6b6b 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(250, 125, 60, 0.3);
}

.tab-icon {
  font-size: 18px;
}

/* 主内容区 */
.main-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 200px 1fr 280px;
  gap: 20px;
}

/* 左侧边栏 */
.left-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.user-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fa7d3c 0%, #ff6b6b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 12px;
}

.username {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/* 中间内容区 */
.content-area {
  min-height: 500px;
}

/* 右侧边栏 */
.right-sidebar {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.sidebar-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.sidebar-card h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.trending-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.trending-item:last-child {
  border-bottom: none;
}

.trending-item:hover {
  background: #f9f9f9;
  margin: 0 -16px;
  padding: 10px 16px;
}

.trending-rank {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.trending-item:nth-child(1) .trending-rank {
  background: #ff6b6b;
  color: white;
}

.trending-item:nth-child(2) .trending-rank {
  background: #ffa502;
  color: white;
}

.trending-item:nth-child(3) .trending-rank {
  background: #7bed9f;
  color: white;
}

.trending-text {
  font-size: 14px;
  color: #333;
}

/* 响应式 */
@media (max-width: 1024px) {
  .main-container {
    grid-template-columns: 1fr;
  }
  
  .left-sidebar,
  .right-sidebar {
    display: none;
  }
}
</style>