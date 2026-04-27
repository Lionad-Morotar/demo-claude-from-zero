export default defineAppConfig({
  ui: {
    colors: {
      // 主品牌色：Claude 橙（#D97757，贴 Anthropic 官方调性）
      primary: 'orange',
      neutral: 'slate'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    }
  },
  seo: {
    siteName: 'Claude From Zero'
  },
  header: {
    title: 'Claude From Zero',
    to: '/',
    logo: {
      alt: 'Claude From Zero',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/Lionad-Morotar/claude-from-zero',
      'target': '_blank',
      'aria-label': '在 GitHub 查看本书源码'
    }]
  },
  footer: {
    credits: `用 Nuxt UI 构建 · © ${new Date().getFullYear()} Claude From Zero`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/Lionad-Morotar/claude-from-zero',
      'target': '_blank',
      'aria-label': '本书 GitHub 仓库'
    }, {
      'icon': 'i-simple-icons-anthropic',
      'to': 'https://www.anthropic.com/claude-code',
      'target': '_blank',
      'aria-label': 'Claude Code 官网'
    }]
  },
  toc: {
    title: '本页目录',
    bottom: {
      title: '相关资源',
      // 「编辑此页」按钮指向项目仓库的 content 目录
      edit: 'https://github.com/Lionad-Morotar/claude-from-zero/edit/main/packages/website/content',
      links: [{
        icon: 'i-lucide-star',
        label: '在 GitHub 给本书加 Star',
        to: 'https://github.com/Lionad-Morotar/claude-from-zero',
        target: '_blank'
      }, {
        icon: 'i-lucide-book-open',
        label: 'Claude Code 官方文档',
        to: 'https://docs.claude.com/en/docs/claude-code',
        target: '_blank'
      }]
    }
  }
})
