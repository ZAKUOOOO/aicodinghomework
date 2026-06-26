<template>
  <div class="container">
    <header>
      <h1>微语</h1>
      <p>分享你的瞬间</p>
    </header>
    
    <PostForm @publish="handlePublish" />
    <PostList />
  </div>
</template>

<script setup>
import { usePostStore } from './stores/postStore'
import PostForm from './components/PostForm.vue'
import PostList from './components/PostList.vue'

const store = usePostStore()

const handlePublish = (post) => {
  store.addPost(post)
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
</style>
