# 微语 (Whisper)

一个简单的社交媒体平台，使用纯 HTML + CSS + JavaScript 实现，数据存储在 Local Storage 中。

## 功能特性

- 发布文字内容
- 发布带图片的内容（图片转为 Base64 存储）
- 查看所有已发布的内容
- 删除已发布的内容
- 数据持久化（Local Storage）

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- Local Storage

## 使用说明

1. 打开 `index.html` 文件
2. 在输入框中输入文字内容
3. 可选择上传图片
4. 点击"发布"按钮
5. 内容将显示在下方的内容流中
6. 点击"删除"按钮可删除内容

## 项目结构

```
aicodinghomework/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 核心逻辑
└── README.md           # 项目说明
```

## 注意事项

- 图片使用 Base64 编码存储，受 Local Storage 大小限制（约 5-10MB）
- 建议不要上传过大的图片
- 数据仅存储在本地浏览器中，清除浏览器数据会丢失

## 作者

ZAKUOOOO
