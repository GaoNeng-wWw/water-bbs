<script setup lang="ts">
import ProfilePublishedTopicCard, { type ProfilePublishedTopicCardProps } from './profile-published-topic-card.vue';

const data: ProfilePublishedTopicCardProps[] = [
  { id: 't001', title: '如何用 Vue 3 + TypeScript 搭建一个企业级中后台项目？', categories: [{ id: 'c1', label: '前端', color: '#3b82f6' }, { id: 'c2', label: 'Vue', color: '#10b981' }], createdAt: '2026-08-03T10:30:00Z', repliesTotal: 42 },
  { id: 't002', title: 'NestJS 微服务架构实践经验分享', categories: [{ id: 'c3', label: '后端', color: '#f59e0b' }, { id: 'c4', label: 'Node.js', color: '#22c55e' }], createdAt: '2026-08-02T15:20:00Z', repliesTotal: 18 },
  { id: 't003', title: '从零开始写一个 BBS 论坛——技术选型与踩坑记录', categories: [{ id: 'c5', label: '全栈', color: '#8b5cf6' }, { id: 'c1', label: '前端', color: '#3b82f6' }], createdAt: '2026-08-02T09:00:00Z', repliesTotal: 67 },
  { id: 't004', title: 'Docker Compose 编排多容器应用的最佳实践', categories: [{ id: 'c6', label: 'DevOps', color: '#ef4444' }], createdAt: '2026-08-01T22:10:00Z', repliesTotal: 31 },
  { id: 't005', title: 'TypeScript 5.5 新特性一览：类型体操又变简单了？', categories: [{ id: 'c1', label: '前端', color: '#3b82f6' }, { id: 'c7', label: 'TypeScript', color: '#3178c6' }], createdAt: '2026-08-01T14:45:00Z', repliesTotal: 55 },
  { id: 't006', title: 'MySQL 索引优化实战：从 3 秒到 0.01 秒的查询优化之旅', categories: [{ id: 'c3', label: '后端', color: '#f59e0b' }, { id: 'c8', label: '数据库', color: '#06b6d4' }], createdAt: '2026-07-31T18:30:00Z', repliesTotal: 89 },
  { id: 't007', title: '2026 年还值得学 Rust 吗？聊聊 Rust 的生态现状', categories: [{ id: 'c9', label: 'Rust', color: '#f97316' }, { id: 'c10', label: '讨论', color: '#a855f7' }], createdAt: '2026-07-31T11:00:00Z', repliesTotal: 124 },
  { id: 't008', title: '前端性能优化——从 Lighthouse 80 分到 100 分的实操指南', categories: [{ id: 'c1', label: '前端', color: '#3b82f6' }, { id: 'c11', label: '性能', color: '#eab308' }], createdAt: '2026-07-30T20:15:00Z', repliesTotal: 37 },
  { id: 't009', title: 'Git 工作流之 Trunk-Based Development 实践总结', categories: [{ id: 'c6', label: 'DevOps', color: '#ef4444' }, { id: 'c12', label: 'Git', color: '#f05032' }], createdAt: '2026-07-30T08:50:00Z', repliesTotal: 23 },
  { id: 't010', title: '手写一个 Promise：从简易版到符合 A+ 规范', categories: [{ id: 'c1', label: '前端', color: '#3b82f6' }, { id: 'c4', label: 'Node.js', color: '#22c55e' }], createdAt: '2026-07-29T16:40:00Z', repliesTotal: 71 },
  { id: 't011', title: 'Redis 缓存在高并发场景下的常见问题及解决方案', categories: [{ id: 'c3', label: '后端', color: '#f59e0b' }, { id: 'c8', label: '数据库', color: '#06b6d4' }], createdAt: '2026-07-29T10:20:00Z', repliesTotal: 56 },
  { id: 't012', title: 'CSS Container Queries 终于可以用了！响应式布局的新范式', categories: [{ id: 'c1', label: '前端', color: '#3b82f6' }, { id: 'c13', label: 'CSS', color: '#2563eb' }], createdAt: '2026-07-28T21:00:00Z', repliesTotal: 44 },
  { id: 't013', title: 'Go 语言并发编程：goroutine 与 channel 设计模式', categories: [{ id: 'c3', label: '后端', color: '#f59e0b' }, { id: 'c14', label: 'Go', color: '#00add8' }], createdAt: '2026-07-28T13:15:00Z', repliesTotal: 33 },
  { id: 't014', title: 'Monorepo 方案对比：Turborepo vs Nx vs pnpm workspace', categories: [{ id: 'c6', label: 'DevOps', color: '#ef4444' }, { id: 'c15', label: '工程化', color: '#6366f1' }], createdAt: '2026-07-27T17:30:00Z', repliesTotal: 98 },
  { id: 't015', title: 'Vite 插件开发入门：从零写一个自动生成路由的插件', categories: [{ id: 'c1', label: '前端', color: '#3b82f6' }, { id: 'c15', label: '工程化', color: '#6366f1' }], createdAt: '2026-07-27T09:45:00Z', repliesTotal: 29 },
  { id: 't016', title: '后端接口设计规范——RESTful API 的最佳实践', categories: [{ id: 'c3', label: '后端', color: '#f59e0b' }, { id: 'c16', label: 'API', color: '#14b8a6' }], createdAt: '2026-07-26T14:00:00Z', repliesTotal: 63 },
  { id: 't017', title: 'WebAssembly 在浏览器端的应用场景与性能对比', categories: [{ id: 'c1', label: '前端', color: '#3b82f6' }, { id: 'c11', label: '性能', color: '#eab308' }], createdAt: '2026-07-26T08:30:00Z', repliesTotal: 15 },
  { id: 't018', title: 'Linux 服务器安全加固 checklist（2026 版）', categories: [{ id: 'c6', label: 'DevOps', color: '#ef4444' }, { id: 'c17', label: '安全', color: '#dc2626' }], createdAt: '2026-07-25T19:00:00Z', repliesTotal: 77 },
  { id: 't019', title: 'Electron vs Tauri：桌面应用开发框架怎么选？', categories: [{ id: 'c1', label: '前端', color: '#3b82f6' }, { id: 'c10', label: '讨论', color: '#a855f7' }], createdAt: '2026-07-25T11:20:00Z', repliesTotal: 136 },
  { id: 't020', title: 'Kubernetes 入门指南：从 Pod 到 Deployment 的完整示例', categories: [{ id: 'c6', label: 'DevOps', color: '#ef4444' }, { id: 'c18', label: 'K8s', color: '#326ce5' }], createdAt: '2026-07-24T16:10:00Z', repliesTotal: 52 },
];
</script>

<template>
  <div class="w-full space-y-5">
    <profile-published-topic-card
      v-for="item in data"
      :id="item.id"
      :key="item.id"
      :title="item.title"
      :created-at="item.createdAt"
      :replies-total="item.repliesTotal"
      :categories="item.categories"
    />
  </div>
</template>
