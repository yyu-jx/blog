import {defineConfig} from 'vitepress'
import timeline from "vitepress-markdown-timeline";
import {withMermaid} from 'vitepress-plugin-mermaid';
import mathjax3 from 'markdown-it-mathjax3';
import {noteSections} from './note-sections.mjs';

const REPO_NAME = '/Blog/'

// 你的 MathJax 自定义元素列表
const customElements = [
    'mjx-container', 'mjx-assistive-mml', 'math', 'maction', 'maligngroup', 'malignmark', 'menclose', 'merror', 'mfenced', 'mfrac', 'mi', 'mlongdiv', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mscarries', 'mscarry', 'mscarries', 'msgroup', 'mstack', 'mlongdiv', 'msline', 'mstack', 'mspace', 'msqrt', 'msrow', 'mstack', 'mstack', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'semantics', 'math', 'mi', 'mn', 'mo', 'ms', 'mspace', 'mtext', 'menclose', 'merror', 'mfenced', 'mfrac', 'mpadded', 'mphantom', 'mroot', 'mrow', 'msqrt', 'mstyle', 'mmultiscripts', 'mover', 'mprescripts', 'msub', 'msubsup', 'msup', 'munder', 'munderover', 'none', 'maligngroup', 'malignmark', 'mtable', 'mtd', 'mtr', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'msline', 'msrow', 'mstack', 'maction', 'semantics', 'annotation', 'annotation-xml',
];

// https://vitepress.dev/reference/site-config
const baseVitePressConfig = {
    base: REPO_NAME,
    title: "07的发呆",
    description: "111",
    head: [
        ['link', {rel: 'icon', type: 'image/png', sizes: '64x64', href: `${REPO_NAME}favicon.png`}]
    ],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        siteTitle: "07的发，呆",
        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: "烧烤",
                        buttonAriaLabel: "烧烤中ing",
                    },
                    modal: {
                        noResultsText: "没有找到结果",
                        resetButtonTitle: "清除搜索条件",
                        footer: {
                            selectText: "选择",
                            navigateText: "切换",
                            closeText: "关闭",
                        },
                    }
                }
            }
        },
        nav: [
            ...noteSections.map(({directory, text}) => ({
                text,
                link: `/${directory}/前言`,
                activeMatch: `^/${directory}/`,
            })),
            {text: '关于我', link: '/about'},
            {text: '主页', link: '/'},
        ],

        socialLinks: [
            {icon: 'github', link: 'https://github.com/yyu-jx'}
        ],
    },
    vue: {
        template: {
            compilerOptions: {
                isCustomElement: (tag) => customElements.includes(tag),
            },
        },
    },
    markdown: {
        config: (md) => {
            // 在这里全局应用 markdown-it 插件
            md.use(timeline);
            md.use(mathjax3);

            // 你的自定义 heading_close 规则，并保留原始规则
            const originalHeadingCloseRule = md.renderer.rules.heading_close;
            md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
                let htmlResult = originalHeadingCloseRule
                    ? originalHeadingCloseRule(tokens, idx, options, env, slf)
                    : slf.renderToken(tokens, idx, options);
                if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`;
                return htmlResult;
            };
        }
    },
};

export default defineConfig(
    withMermaid({
        ...baseVitePressConfig,

        // 添加 mermaid 特定的配置
        mermaid: {
            // refer https://mermaid.js.org/config/setup/modules/mermaidAPI.html#mermaidapi-configuration-defaults for options
            // 你的 Mermaid 配置...
        },
        mermaidPlugin: {
            class: "mermaid my-class", // set additional css classes for parent container
            // 你的 Mermaid 插件配置...
        },
    })
);
