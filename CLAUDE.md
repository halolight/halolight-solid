# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Halolight Solid 是一个基于 Solid.js + SolidStart 的现代化中文后台管理系统，使用 TypeScript 和 Tailwind CSS 构建。

- **在线预览**: https://halolight-solid.h7ml.cn
- **GitHub**: https://github.com/halolight/halolight-solid

## 技术栈速览

- **核心框架**: Solid.js 1.9 + SolidStart 1.0 + TypeScript 5.9
- **构建工具**: Vinxi (基于 Vite)
- **路由**: @solidjs/router (文件路由系统)
- **Meta 管理**: @solidjs/meta
- **样式**: Tailwind CSS 4
- **Mock**: Mock.js

## 常用命令

```bash
pnpm dev          # 启动开发服务器 (http://localhost:3000)
pnpm build        # 生产构建
pnpm start        # 启动生产服务器
```

## 架构

### 应用入口

SolidStart 使用 Vinxi 作为底层构建工具，入口文件：

- `src/app.tsx` - 应用根组件
- `src/entry-client.tsx` - 客户端入口
- `src/entry-server.tsx` - 服务端入口
- `app.config.ts` - Vinxi 配置

### 核心目录结构

```
src/
├── routes/           # 文件路由（自动路由）
│   ├── index.tsx     # / 路由
│   └── [...404].tsx  # 404 页面
├── components/       # 可复用组件
├── lib/              # 工具函数
├── app.tsx           # 应用根组件
├── app.css           # 全局样式 (Tailwind)
├── entry-client.tsx  # 客户端入口
└── entry-server.tsx  # 服务端入口
```

### Solid.js 响应式原语

```tsx
import { createSignal, createMemo, createEffect } from "solid-js";

// Signal - 响应式状态
const [count, setCount] = createSignal(0);

// Memo - 派生计算
const double = createMemo(() => count() * 2);

// Effect - 副作用
createEffect(() => {
  console.log("count changed:", count());
});
```

### 代码规范

- **响应式访问**: Signal 必须调用 `()` 才能读取值，如 `count()` 而非 `count`
- **JSX 语法**: 使用标准 JSX，但更接近原生 DOM
- **组件风格**: 函数式组件，无需 memo 优化
- **路径别名**: 使用 `~/` 指向 `src/`

### 与 React 的主要区别

| 特性 | Solid.js | React |
|------|----------|-------|
| 响应式 | 细粒度 Signal | 虚拟 DOM diff |
| 组件执行 | 只执行一次 | 每次更新重新执行 |
| 状态读取 | `count()` | `count` |
| Hooks 规则 | 无限制 | 严格顺序 |

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_URL` | API 基础 URL | `/api` |
| `VITE_MOCK` | 启用 Mock 数据 | `true` |
| `VITE_APP_TITLE` | 应用标题 | `Admin Pro` |
| `VITE_BRAND_NAME` | 品牌名称 | `Halolight` |

## 新增功能开发指南

### 添加新页面

1. 在 `src/routes/` 下创建 `.tsx` 文件
2. 文件名即路由路径（如 `dashboard.tsx` → `/dashboard`）
3. 导出默认组件

```tsx
// src/routes/dashboard.tsx
import { Title } from "@solidjs/meta";

export default function Dashboard() {
  return (
    <>
      <Title>Dashboard</Title>
      <main>Dashboard Content</main>
    </>
  );
}
```

### 添加新组件

```tsx
// src/components/Button.tsx
import { JSX } from "solid-js";

interface ButtonProps {
  children: JSX.Element;
  onClick?: () => void;
}

export function Button(props: ButtonProps) {
  return (
    <button
      class="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
```

## 注意事项

- **Signal 解构**: 不要解构 Signal，会失去响应性
- **Props 解构**: 不要解构 Props，使用 `props.xxx` 访问
- **响应式边界**: JSX 中的表达式自动追踪依赖

## 与其他 Halolight 项目的对照

| 功能 | Solid 版本 | Vue 版本 | React 版本 |
|------|-----------|----------|------------|
| 响应式 | Signal | Ref/Reactive | useState |
| 状态管理 | createStore | Pinia | Zustand |
| 路由 | @solidjs/router | Vue Router | React Router |
| 构建工具 | Vinxi | Vite | Next.js |
