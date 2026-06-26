// 数据管理
const Storage = {
    getPosts() {
        const posts = localStorage.getItem('whisper_posts');
        return posts ? JSON.parse(posts) : [];
    },
    
    savePosts(posts) {
        localStorage.setItem('whisper_posts', JSON.stringify(posts));
    },
    
    addPost(post) {
        const posts = this.getPosts();
        posts.unshift(post);
        this.savePosts(posts);
    },
    
    deletePost(id) {
        const posts = this.getPosts();
        const filtered = posts.filter(post => post.id !== id);
        this.savePosts(filtered);
    }
};

// 图片处理
const ImageHandler = {
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
};

// 时间格式化
const TimeFormatter = {
    format(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        const second = String(d.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }
};

// 渲染帖子
const Renderer = {
    renderPosts() {
        const posts = Storage.getPosts();
        const container = document.getElementById('posts');
        container.innerHTML = '';
        
        if (posts.length === 0) {
            container.innerHTML = '<div class="empty-message">还没有发布任何内容，快来发布第一条吧！</div>';
            return;
        }
        
        posts.forEach(post => {
            const postEl = document.createElement('div');
            postEl.className = 'post';
            postEl.innerHTML = `
                <div class="post-header">
                    <span class="post-time">${TimeFormatter.format(post.timestamp)}</span>
                    <button class="delete-btn" onclick="deletePost('${post.id}')">删除</button>
                </div>
                <div class="post-content">${post.content || ''}</div>
                ${post.image ? `<img src="${post.image}" class="post-image" alt="图片">` : ''}
            `;
            container.appendChild(postEl);
        });
    }
};

// 发布功能
async function publishPost() {
    const content = document.getElementById('content').value.trim();
    const imageInput = document.getElementById('image');
    const imageFile = imageInput.files[0];
    
    if (!content && !imageFile) {
        alert('请输入内容或选择图片');
        return;
    }
    
    let imageBase64 = '';
    if (imageFile) {
        imageBase64 = await ImageHandler.fileToBase64(imageFile);
    }
    
    const post = {
        id: Date.now().toString(),
        content: content,
        image: imageBase64,
        timestamp: new Date().toISOString()
    };
    
    Storage.addPost(post);
    Renderer.renderPosts();
    
    // 清空表单
    document.getElementById('content').value = '';
    imageInput.value = '';
    document.querySelector('.file-name').textContent = '选择图片';
}

// 删除功能
function deletePost(id) {
    if (confirm('确定要删除这条内容吗？')) {
        Storage.deletePost(id);
        Renderer.renderPosts();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    Renderer.renderPosts();
    
    document.getElementById('submit').addEventListener('click', publishPost);
    
    // 文件选择显示文件名
    document.getElementById('image').addEventListener('change', function() {
        const fileName = this.files[0] ? this.files[0].name : '选择图片';
        document.querySelector('.file-name').textContent = fileName;
    });
});