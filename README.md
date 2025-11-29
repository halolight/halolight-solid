# Halolight Solid | Admin Pro

[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/halolight/halolight-solid/blob/main/LICENSE)
[![Solid](https://img.shields.io/badge/Solid-1.9-%232C4F7C.svg)](https://www.solidjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-%233178C6.svg)](https://www.typescriptlang.org/)
[![SolidStart](https://img.shields.io/badge/SolidStart-1.0-%232C4F7C.svg)](https://start.solidjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4.svg)](https://tailwindcss.com/)

基于 Solid.js + SolidStart 的现代化中文后台管理系统，具备细粒度响应式更新、极致性能和类 React 开发体验。

- 在线预览：<https://halolight-solid.h7ml.cn>
- GitHub：<https://github.com/halolight/halolight-solid>

## 功能亮点

- **Solid.js 细粒度响应式**：无虚拟 DOM，编译时优化，极致性能
- **SolidStart 全栈框架**：基于 Vinxi，支持 SSR/SSG/SPA 多种渲染模式
- **TypeScript 全覆盖**：完整的类型安全支持
- **Tailwind CSS 4**：原子化样式，快速开发
- **文件路由系统**：约定式路由，自动代码分割
- **Signal 响应式原语**：`createSignal`、`createMemo`、`createEffect` 等
- **Mock.js 集成**：环境变量一键启用，无后端快速演示

## 目录结构

```
src/
├── routes/           # 文件路由（自动路由）
│   └── index.tsx     # 首页
├── components/       # 可复用组件
├── lib/              # 工具函数
├── app.tsx           # 应用入口
├── app.css           # 全局样式
├── entry-client.tsx  # 客户端入口
└── entry-server.tsx  # 服务端入口
```

## 快速开始

环境要求：Node.js >= 18、pnpm >= 8

```bash
pnpm install
pnpm dev         # 本地开发，默认 http://localhost:3000
```

生产构建

```bash
pnpm build
pnpm start       # 启动生产服务器
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_URL` | API 基础地址 | `/api` |
| `VITE_MOCK` | 启用 Mock 数据 | `true` |
| `VITE_APP_TITLE` | 应用标题 | `Admin Pro` |
| `VITE_BRAND_NAME` | 品牌名称 | `Halolight` |

## 常用脚本

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm start        # 启动生产服务器
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 核心框架 | Solid.js 1.9 + SolidStart 1.0 |
| 构建工具 | Vinxi + Vite |
| 类型系统 | TypeScript 5.9 |
| 样式 | Tailwind CSS 4 |
| 路由 | @solidjs/router |
| Meta 管理 | @solidjs/meta |

## 为什么选择 Solid.js

- **无虚拟 DOM**：直接编译为原生 DOM 操作
- **细粒度响应式**：只更新变化的部分，无需 diff
- **类 React 语法**：JSX + Hooks 风格，学习成本低
- **极小体积**：核心库仅 ~7KB gzip

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

[MIT](LICENSE)
