import { defineLoader } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import { generateSidebar } from 'vitepress-sidebar'
import { noteSections } from '../note-sections.mjs'

type NoteSidebar = Record<string, { base: string; items: DefaultTheme.SidebarItem[] }>

declare const data: NoteSidebar
export { data }

export default defineLoader({
  watch: noteSections.map(({ directory }) => `../../${directory}/**/*.md`),
  load() {
    return generateSidebar(noteSections.map(({ directory }) => ({
      scanStartPath: directory,
      resolvePath: `/${directory}/`,
      includeFolderIndexFile: true,
      useTitleFromFrontmatter: true,
      useTitleFromFileHeading: true,
      manualSortFileNameByPriority: ['前言.md'],
      collapsed: true,
      collapseDepth: 2,
    }))) as NoteSidebar
  },
})
