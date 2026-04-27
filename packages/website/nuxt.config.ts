// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/'
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxtjs/mcp-toolkit'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    }
  },

  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'iconify'
  },

  llms: {
    domain: 'https://claude-from-zero.dev',
    title: 'Claude From Zero',
    description: '从零开始掌握 Claude Code：AI 编程完全指南（中文）。',
    full: {
      title: 'Claude From Zero — 完整文档',
      description: '面向中文开发者的 Claude Code 实战手册，覆盖认识、安装、上手、核心功能、进阶配置、实战开发与心法层。'
    },
    sections: [
      {
        title: '第 1 章：认识 Claude Code',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/intro%' }
        ]
      },
      {
        title: '第 2 章：安装与配置',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/setup%' }
        ]
      },
      {
        title: '第 3 章：快速上手',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/quickstart%' }
        ]
      },
      {
        title: '第 4 章：核心功能',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/core-features%' }
        ]
      },
      {
        title: '第 5 章：进阶配置',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/advanced%' }
        ]
      },
      {
        title: '第 6 章：实战开发',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/practice%' }
        ]
      },
      {
        title: '第 7 章：心法层',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/mindset%' }
        ]
      },
      {
        title: '附录',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/appendix%' }
        ]
      }
    ]
  },

  mcp: {
    name: 'Claude From Zero'
  }
})
