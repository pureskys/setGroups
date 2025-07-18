# setGroups

基于 Vue 3 和 Vite 构建的小组管理设置平台

## 项目简介
本项目是一个基于 Vue 3 和 Vite 构建的小组管理设置平台，主要用于管理和配置用户组信息。项目使用了现代化的前端技术栈，提供了良好的开发体验和性能表现。

## 技术栈
- Vue 3
- Vite
- Pinia (状态管理)
- Vue Router

## 主要功能
- 用户组管理
- 座位配置
- 数据导出功能
- 用户信息管理

## 项目结构
├── src/
│   ├── components/        # 可复用的Vue组件
│   ├── store/             # Pinia状态管理
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   ├── api/               # 接口请求
│   ├── style.css          # 全局样式
│   └── main.js            # 入口文件
├── public/                # 静态资源
├── .env.*                 # 环境变量配置
└── README.md              # 项目说明

## 安装指南
1. 克隆仓库: `git clone https://gitee.com/pureskys/setGroups`
2. 进入项目目录: `cd setGroups`
3. 安装依赖: `npm install`
4. 启动开发服务器: `npm run dev`

## 使用说明
- 在开发环境使用 `.env.development` 文件配置开发环境变量
- 在生产环境使用 `.env.production` 文件配置生产环境变量
- 使用 `src/utils/export-*.js` 文件中的函数导出小组数据

## 贡献指南
欢迎贡献代码！请遵循以下步骤：
1. Fork 仓库
2. 创建新分支
3. 提交代码更改
4. 创建 Pull Request

## 许可证
本项目采用 MIT 许可证