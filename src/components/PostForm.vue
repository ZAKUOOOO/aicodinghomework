<template>
  <div class="post-form-card">
    <div class="form-header">
      <div class="avatar-small">👤</div>
      <span class="form-title">有什么新鲜事想告诉大家？</span>
    </div>
    
    <div class="form-body">
      <textarea 
        v-model="content" 
        placeholder="分享你的新鲜事..."
        rows="3"
      ></textarea>
      
      <div v-if="imagePreview" class="image-preview">
        <img :src="imagePreview" alt="预览">
        <button class="remove-image" @click="removeImage">✕</button>
      </div>
    </div>
    
    <div class="form-footer">
      <div class="form-tools">
        <label class="tool-btn" title="添加图片">
          <input 
            type="file" 
            accept="image/*" 
            @change="handleFileChange"
            ref="fileInput"
            hidden
          >
          <span class="tool-icon">📷</span>
          <span class="tool-text">图片</span>
        </label>
      </div>
      
      <button 
        class="publish-btn" 
        @click="publish"
        :disabled="!canPublish"
        :class="{ 'disabled': !canPublish }"
      >
        发布
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const content = ref('')
const imageBase64 = ref('')
const imagePreview = ref('')
const fileInput = ref(null)

const canPublish = computed(() => {
  return content.value.trim().length > 0 || imageBase64.value.length > 0
})

const emit = defineEmits(['publish'])

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imageBase64.value = e.target.result
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imageBase64.value = ''
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const publish = () => {
  if (!canPublish.value) return
  
  emit('publish', {
    id: Date.now().toString(),
    content: content.value.trim(),
    image: imageBase64.value,
    timestamp: new Date().toISOString()
  })
  
  // 清空表单
  content.value = ''
  imageBase64.value = ''
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.post-form-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 16px;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fa7d3c 0%, #ff6b6b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.form-title {
  font-size: 15px;
  color: #999;
  font-weight: 500;
}

.form-body textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.6;
  transition: all 0.3s;
  outline: none;
}

.form-body textarea:focus {
  border-color: #fa7d3c;
  box-shadow: 0 0 0 3px rgba(250, 125, 60, 0.1);
}

.form-body textarea::placeholder {
  color: #bbb;
}

.image-preview {
  position: relative;
  margin-top: 12px;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.form-tools {
  display: flex;
  gap: 16px;
}

.tool-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  font-size: 14px;
}

.tool-btn:hover {
  color: #fa7d3c;
}

.tool-icon {
  font-size: 20px;
}

.tool-text {
  font-size: 14px;
}

.publish-btn {
  padding: 8px 32px;
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

.publish-btn:hover:not(.disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(250, 125, 60, 0.4);
}

.publish-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}
</style>