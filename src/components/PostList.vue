<template>
  <div class="post-list">
    <div v-if="posts.length === 0" class="empty-message">
      还没有发布任何内容，快来发布第一条吧！
    </div>
    <div v-else>
      <div v-for="post in posts" :key="post.id" class="post">
        <div class="post-header">
          <span class="post-time">{{ formatTime(post.timestamp) }}</span>
          <button class="delete-btn" @click="deletePost(post.id)">删除</button>
        </div>
        <div class="post-content">{{ post.content }}</div>
        <img v-if="post.image" :src="post.image" class="post-image" alt="图片">
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePostStore } from '../stores/postStore'

const store = usePostStore()
const posts = computed(() => store.sortedPosts)

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
</script>

<style scoped>
.post-list {
  margin-top: 20px;
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
</style>
