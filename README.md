# 微语 (Whisper) - Vue 3 + Pinia 版本

一个简单的社交媒体平台，使用 Vue 3 + Pinia 实现，数据存储在 Local Storage 中。

## 功能特性

- 发布文字内容
- 发布带图片的内容（图片转为 Base64 存储）
- 查看所有已发布的内容
- 删除已发布的内容
- 数据持久化（Local Storage）

## 技术栈

- Vue 3 (Composition API)
- Pinia (状态管理)
- Vite (构建工具)
- Vitest (测试框架)
- Express (Node.js 服务器)
- Local Storage

## 使用说明

### 开发模式
```bash
npm install
npm run dev
```

### 运行测试
```bash
npm test
```

### 生产模式
```bash
npm run build
npm start
```

## 项目结构

```
whisper-vue/
├── src/
│   ├── components/
│   │   ├── PostForm.vue    # 发布表单组件
│   │   └── PostList.vue    # 内容列表组件
│   ├── stores/
│   │   └── postStore.js    # Pinia 状态管理
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── tests/
│   ├── postStore.spec.js   # Store 单元测试
│   └── components.spec.js  # 组件单元测试
├── server.js               # Express 服务器
├── index.html
└── package.json
```

## TDD 开发流程

本项目采用测试驱动开发 (TDD)：
1. 编写测试用例
2. 运行测试（失败）
3. 实现功能代码
4. 运行测试（通过）
5. 重构优化

## 注意事项

- 图片使用 Base64 编码存储，受 Local Storage 大小限制（约 5-10MB）
- 建议不要上传过大的图片
- 数据仅存储在本地浏览器中，清除浏览器数据会丢失

## 作者

ZAKUOOOO
