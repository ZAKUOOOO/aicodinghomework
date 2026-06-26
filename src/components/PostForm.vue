<template>
  <div class="post-form">
    <textarea 
      v-model="content" 
      placeholder="写下你的想法..."
    ></textarea>
    <div class="file-input-wrapper">
      <input 
        type="file" 
        accept="image/*" 
        @change="handleFileChange"
        ref="fileInput"
      >
      <span class="file-name">{{ fileName }}</span>
    </div>
    <button @click="publish">发布</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const content = ref('')
const fileName = ref('选择图片')
const imageBase64 = ref('')
const fileInput = ref(null)

const emit = defineEmits(['publish'])

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    fileName.value = file.name
    const reader = new FileReader()
    reader.onload = (e) => {
      imageBase64.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const publish = () => {
  if (!content.value.trim() && !imageBase64.value) {
    alert('请输入内容或选择图片')
    return
  }
  
  emit('publish', {
    id: Date.now().toString(),
    content: content.value.trim(),
    image: imageBase64.value,
    timestamp: new Date().toISOString()
  })
  
  // 清空表单
  content.value = ''
  imageBase64.value = ''
  fileName.value = '选择图片'
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.post-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.post-form textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
  font-family: inherit;
}

.file-input-wrapper {
  position: relative;
  margin-bottom: 10px;
}

.file-input-wrapper input[type="file"] {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.file-name {
  display: inline-block;
  padding: 8px 12px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
}

.post-form button {
  background: #1da1f2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
}

.post-form button:hover {
  background: #0d8ecf;
}
</style>
