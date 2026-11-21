Welcome to my channal.

[GitHub：@yyu-jx](https://github.com/yyu-jx)

## 导入笔记

将 `.md` 文件复制到对应栏目，子文件夹也会自动扫描：

| 目录 | 栏目 |
| --- | --- |
| `backed/` | 疲惫后端 |
| `frontend/` | 快乐前端 |
| `agent/` | All in Agent |
| `life/` | 寥寥几笔 |
| `tool/` | 工具 |

点击栏目会直接打开该栏目根目录的 `前言.md`。请保留 `前言.md` 和用于兼容旧入口的 `index.md`。导入其他 `.md` 文件后，笔记会自动出现在左侧导航，不用逐篇改配置。显示标题优先使用笔记的 `title`，其次是一级标题 (`# 标题`)，再其次是文件名。笔记中的图片使用相对路径时，导入时请保留原来的相对目录结构。

从 Obsidian 导入时，把配图一并复制，并将 `![[图片.png]]` 改成标准 Markdown 图片链接。例如，`backed/MySQL/MySQL的锁/表级锁.md` 引用 `backed/images/` 中的图片时，写作 `![表锁命令](<../../images/Pasted image 20261120181335.png>)`；文件名有空格时用 `<...>` 包住路径。

在站点目录运行 `npm run docs:dev` 本地预览；线上站点需重新部署后才会显示新笔记。

## 添加顶部导航

1. 创建要访问的页面，例如 `notes/index.md`，写上标题和正文。
2. 在 `.vitepress/config.mjs` 的 `themeConfig.nav` 中加一项。数组里的顺序就是顶部标签的显示顺序：

   ```js
   { text: '学习笔记', link: '/notes/', activeMatch: '^/notes/' },
   ```

3. 在站点目录运行 `npm run docs:dev` 预览，不用改 CSS。空间不够时桌面标签可以横向滚动；手机上从菜单按钮打开同一组标签。

`text` 是显示名，`link` 是站内路径：`notes/index.md` 写成 `/notes/`，`about.md` 写成 `/about`，不用手动加 `/Blog/` 或 `.md`。`activeMatch` 可选；上面的写法会让「学习笔记」在访问 `/notes/` 下的文章时继续高亮。
