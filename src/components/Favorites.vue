
<template>
  <div class="favorites-page">
    <div class="page-header">
      <h2>
        <span class="header-icon">⭐</span>
        <span>我的收藏</span>
      </h2>
      <span class="header-count" v-if="favorites.length > 0">
        共 {{ favorites.length }} 条
      </span>
    </div>
    
    <div v-if="loading" class="loading-message">
      <div class="spinner"></div>
      <span>加载中...</span>
    </div>
    
    <div v-else-if="favorites.length === 0" class="empty-message">
      <div class="empty-icon">📭</div>
      <div class="empty-text">还没有收藏任何内容</div>
      <div class="empty-subtext">看到喜欢的微博，点击收藏按钮即可收藏</div>
      <button class="go-home-btn" @click="goHome">去首页看看</button>
    </div>
    
    <div v-else class="posts-container">
      <div v-for="post in favorites" :key="post.id" class="post-card">
        <div class="post-header">
          <div class="user-info">
            <div class="avatar">👤</div>
            <div class="user-meta">
              <div class="username">访客用户</div>
              <div class="post-time">{{ formatTime(post.timestamp) }}</div>
            </div>
          </div>
          <button class="delete-btn" @click="deletePost(post.id)" title="删除">
            ✕
          </button>
        </div>
        
        <div class="post-content">{{ post.content }}</div>
        
        <div v-if="post.image" class="post-image-wrapper">
          <img :src="post.image" class="post-image" alt="图片">
        </div>
        
        <div class="post-actions">
          <button class="action-btn like" @click="likePost(post.id)" :class="{ 'active': post.likes > 0 }">
            <span class="action-icon">❤️</span>
            <span class="action-count">{{ post.likes || 0 }}</span>
          </button>
          
          <button class="action-btn favorite" @click="favoritePost(post.id)" :class="{ 'active': post.isFavorite }">
            <span class="action-icon">⭐</span>
            <span class="action-text">已收藏</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePostStore } from '../stores/postStore'

const store = usePostStore()
const favorites = computed(() => store.sortedFavorites)
const loading = computed(() => store.loading)

const emit = defineEmits(['navigate'])

onMounted(() => {
  store.fetchFavorites()
})

const goHome = () => {
  emit('navigate', 'home')
}

const formatTime = (timestamp) => {
  const d = new Date(timestamp)
  const now = new Date()
  const diff = now - d
  
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return minutes < 1 ? '刚刚' : `${minutes}分钟前`
  }
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}`
}

const deletePost = (id) => {
  if (confirm('确定要删除这条微博吗？')) {
    store.deletePost(id)
  }
}

const likePost = (id) => {
  store.likePost(id)
}

const favoritePost = (id) => {
  store.favoritePost(id)
}
</script>

<style scoped>
.favorites-page {
  margin-top: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.page-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #333;
}

.header-icon {
  font-size: 24px;
}

.header-count {
  font-size: 14px;
  color: #999;
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
  gap: 12px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #fa7d3c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-message {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #999;
  margin-bottom: 20px;
}

.go-home-btn {
  padding: 10px 32px;
  background: linear-gradient(135deg, #fa7d3c 0%, #ff6b6b 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(250, 125, 60, 0.3);
}

.go-home-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(250, 125, 60, 0.4);
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.post-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fa7d3c 0%, #ff6b6b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.username {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.post-time {
  font-size: 13px;
  color: #999;
}

.delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #ccc;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: #ffebee;
  color: #ff4444;
}

.post-content {
  font-size: 15px;
  line-height: 1.7;
  color: #333;
  margin-bottom: 12px;
  word-wrap: break-word;
}

.post-image-wrapper {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
}

.post-actions {
  display: flex;
  gap: 0;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
  border-radius: 6px;
}

.action-btn:hover {
  background: #f5f5f5;
}

.action-btn.like.active {
  color: #ff6b6b;
}

.action-btn.favorite.active {
  color: #ffa502;
}

.action-icon {
  font-size: 18px;
}

.action-count,
.action-text {
  font-size: 13px;
}
</style>
