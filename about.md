---
aside: false
outline: false
pageClass: about-page
---

<!-- 
  VitePress 允许在 Markdown 文件中直接使用 HTML 和 Vue 组件。
  我们用 HTML 和 CSS 来构建一个自定义的布局。
-->

<script setup>
import { imageUrl } from './.vitepress/image-host.mjs'

// 技术栈清单：增删技术只需增删对应的一行，顺序就是页面上的显示顺序。
// name 是显示名称；icon 是图床中的 SVG 文件名（不含 .svg）。
// 临时隐藏某项，可以在对应行的最前面加 //。
const techGroups = [
  {
    title: '常用语言',
    items: [
      { name: 'Java', icon: 'java' }, // Java：常用后端开发语言
      { name: 'Python', icon: 'python' }, // Python：脚本与 AI 开发语言
    ],
  },
  {
    title: '后端技术',
    items: [
      { name: 'Spring', icon: 'spring' }, // Spring：Java 后端框架
      { name: 'MySQL', icon: 'mysql' }, // MySQL：关系型数据库
      { name: 'Redis', icon: 'redis' }, // Redis：内存数据存储与缓存
      { name: 'Cassandra', icon: 'cassandra' }, // Cassandra：分布式宽列数据库
      { name: 'Neo4j', icon: 'neo4j' }, // Neo4j：图数据库
      { name: 'RocketMQ', icon: 'rocketmq' }, // RocketMQ：分布式消息队列
      { name: 'Elasticsearch', icon: 'elasticsearch' }, // Elasticsearch：搜索与分析引擎
      { name: 'MinIO', icon: 'minio' }, // MinIO：对象存储
      { name: 'Docker', icon: 'docker' }, // Docker：后端服务的容器化部署
      { name: 'Nginx', icon: 'nginx' }, // Nginx：Web 服务器与反向代理
    ],
  },
  {
    title: '前端技术',
    items: [
      { name: 'Node.js', icon: 'nodejs' }, // Node.js：JavaScript 运行时
      { name: 'Vue.js', icon: 'vuejs' }, // Vue.js：前端框架
    ],
  },
  {
    title: '工具 & 环境',
    items: [
      { name: 'Git', icon: 'git' }, // Git：版本控制工具
      { name: 'Linux', icon: 'linux' }, // Linux：操作系统环境
      { name: 'Docker', icon: 'docker' }, // Docker：容器工具
    ],
  },
]
</script>

<!-- 1. 样式定义 (CSS) -->
<style>
.about-page .VPDoc:not(.has-sidebar) > .container > .content {
  max-width: none;
}

/* 页面整体居中，并设置最大宽度 */
.custom-layout {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
/* 顶部个人信息区域 */
.profile-section {
  display: flex;
  align-items: center;
  gap: 2rem; /* 头像和文字的间距 */
  margin-bottom: 4rem;
}

/* 头像样式 (已设为圆角方形) */
.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  object-fit: cover;
  border: 3px solid var(--vp-c-brand-1);
}

/* 个人信息文本区域 */
.profile-info h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  border-bottom: none;
}
.profile-info p {
  color: var(--vp-c-text-2);
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 0.5rem;
}

/* 各个内容区块的标题样式 */
.content-section h2 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-top: 3rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 0.5rem;
}
.content-section p, .content-section ul {
  color: var(--vp-c-text-1);
}
.content-section ul {
  padding-left: 1.5rem;
}

/* 技术栈分类样式 */
.tech-stack .skill-category {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  align-items: start;
  gap: 0.75rem;
}
.tech-stack .skill-category + .skill-category {
  margin-top: 1.5rem;
}
.vp-doc .tech-stack .skill-title {
  margin: 0;
  padding-top: 0.5rem;
  font-size: 1.125rem;
  line-height: 1.5;
}
.vp-doc .tech-stack .tech-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.vp-doc .tech-stack .tech-icons > li {
  display: grid;
  justify-items: center;
  align-content: start;
  gap: 0.5rem;
  min-width: 4rem;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  line-height: 1.4;
  text-align: center;
}
.tech-stack .tech-icons img {
  display: block;
  width: 42px;
  height: 42px;
  object-fit: contain;
}
:root.dark .tech-stack img[src$="/mysql.svg"] {
  filter: brightness(1.4);
}
@media (max-width: 540px) {
  .tech-stack .skill-category {
    grid-template-columns: minmax(0, 1fr);
  }
  .vp-doc .tech-stack .skill-title {
    padding-top: 0;
  }
}
</style>

<!-- 2. 页面内容 (HTML) -->
<div class="custom-layout">

  <!-- 顶部个人信息 -->
  <div class="profile-section">
    <!-- 头像 -->
    <img :src="imageUrl('logo.png')" alt="Lizzy的头像" class="profile-avatar">
<!-- 个人介绍 -->
    <div class="profile-info">
      <h1>Gnsan</h1>
      <p>大二在读</p>
      <p>主攻方向: 全栈，agent</p>
    </div>
  </div>

  <!-- 技术栈部分 -->
  <section class="content-section tech-stack" aria-labelledby="tech-stack-title">
    <h2 id="tech-stack-title">技术栈</h2>
    <div v-for="group in techGroups" :key="group.title" class="skill-category">
      <h3 class="skill-title">{{ group.title }}：</h3>
      <ul class="tech-icons" role="list">
        <li v-for="tech in group.items" :key="tech.name">
          <img :src="imageUrl(`${tech.icon}.svg`)" alt="" width="42" height="42">
          <span>{{ tech.name }}</span>
        </li>
      </ul>
    </div>
  </section>

 <!-- 我的兴趣 -->
  <div class="content-section">
    <h2>我的兴趣</h2>
    <ul>
      <li>探索前沿技术。</li>
      <li>倾听。</li>
      <li><strong>音乐、咖啡、茶 和 偶尔的摄影</strong>。</li>
    </ul>
  </div>


  <!-- 联系我 -->
  <div class="content-section">
    <h2>联系我</h2>
    <p>如果你想与我交流，或者对网站内容有任何建议，可以通过以下方式找到我：</p>
    <ul>
      <li><strong>GitHub</strong>: <a href="https://github.com/yyu-jx" target="_blank">@yyu-jx</a></li>
      <li><strong>Email</strong>: <a href="mailto:283237647@qq.com">283237647@qq.com</a></li>
    </ul>
  </div>


  <br>
  <p style="text-align: center; color: var(--vp-c-text-2);">--- 再次感谢你的来访！ ---</p>

</div>
