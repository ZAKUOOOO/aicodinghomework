<template>
  <div class="favorites">
    <h2>我的收藏</h2>
    
    <div v-if="loading" class="loading-message">加载中...</div>
    
    <div v-else-if="favorites.length === 0" class="empty-message">
      还没有收藏任何内容，快去浏览并收藏吧！
    </div>
    
    <div v-else>
      <div v-for="post in favorites" :key="post.id" class="post">
        <div class="post-header">
          <span class="post-time">{{ formatTime(post.timestamp) }}</span>
          <button class="delete-btn" @click="deletePost(post.id)">删除</button>
        </div>
        <div class="post-content">{{ post.content }}</div>
        <img v-if="post.image" :src="post.image" class="post-image" alt="图片">
        <div class="post-actions">
          <button class="like-btn" @click="likePost(post.id)" :class="{ 'liked': post.likes > 0 }">
            <span class="like-icon">👍</span>
            <span class="like-count">{{ post.likes || 0 }}</span>
          </button>
          <button class="favorite-btn" @click="favoritePost(post.id)" :class="{ 'favorited': post.isFavorite }">
            <span class="favorite-icon">{{ post.isFavorite ? '⭐' : '☆' }}</span>
            <span class="favorite-text">{{ post.isFavorite ? '已收藏' : '收藏' }}</span>
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

onMounted(() => {
  store.fetchFavorites()
})

const formatTime = (timestamp) => {
  const d = new Date(timestamp)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

const deletePost = (id) => {
  if (confirm('确定要删除这条内容吗？')) {
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
.favorites {
  margin-top: 20px;
}

.favorites h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.post {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 15px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.post-time {
  color: #999;
  font-size: 14px;
}

.post-content {
  margin-bottom: 10px;
  line-height: 1.6;
  word-wrap: break-word;
}

.post-image {
  max-width: 100%;
  border-radius: 4px;
  margin-top: 10px;
}

.post-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.like-btn, .favorite-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.like-btn:hover {
  background: #f0f0f0;
}

.like-btn.liked {
  background: #e3f2fd;
  border-color: #2196f3;
  color: #2196f3;
}

.favorite-btn:hover {
  background: #f0f0f0;
}

.favorite-btn.favorited {
  background: #fff3e0;
  border-color: #ff9800;
  color: #ff9800;
}

.like-icon, .favorite-icon {
  font-size: 16px;
}

.delete-btn {
  background: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.delete-btn:hover {
  background: #cc0000;
}

.empty-message {
  text-align: center;
  color: #999;
  padding: 40px;
}

.loading-message {
  text-align: center;
  color: #666;
  padding: 40px;
}
</style>
