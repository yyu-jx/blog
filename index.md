---
# "---" 这两行之间的内容是 YAML Frontmatter，用于配置页面
# 它不是 Markdown 正文，不会直接显示出来

layout: home # 指定使用 VitePress 的特殊首页布局

# ----------------- 首页主要内容配置 -----------------
hero:
  name: "07的发呆" # 你的网站主标题
  text: "随机存档一些错觉" # 主标题下的副标题
  tagline: 无论云泥意贯一 # 标语
  # 注意 actions 的缩进，它必须和 name, text, image 等对齐
# --- END: 这是为您新增的样式配置 ---
  actions:
    - theme: brand # 主按钮 (颜色更突出)
      text: 开始阅读 # 按钮文字
      link: /frontend/前言
    - theme: alt # 次要按钮
      text: 关于我
      link: ./about # 指向 about.md 页面 (需要你自己创建)

# ----------------- 特色卡片配置 -----------------
features:
  - title: 日常学习
    icon: 📝
    details: <strong>平日里学习做的笔记都会同步在这里，用于以后复习使用</strong>
  - title: 决胜面试
    icon: 😡
    details: <strong>从java到收废品的一生</strong>
  - title: 生活杂文
    icon: 🥤
    details: <strong>人生有梦</strong> <br> <strong>各自精彩</strong>
---

<!-- 
上面的 Frontmatter 配置会自动生成一个漂亮的首页。
你不需要在这里写任何 Markdown 正文内容。
当然，如果你想在特色卡片下方添加更多内容，可以直接在这里用 Markdown 语法写。
-->
