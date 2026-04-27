<!--
  ChapterPath.vue —— 滚动驱动的章节路径图谱

  核心机制：
  1. 8 张章节卡片按 S 型 zigzag 布局（奇数偏左，偶数偏右）
  2. SVG path 用三次贝塞尔曲线串联所有卡片中心
  3. window scroll 计算 section 进入视口的 progress (0~1)，绑定 SVG path 的 stroke-dashoffset
  4. IntersectionObserver 监听卡片入视，触发 .is-visible 弹簧进场
  5. ResizeObserver 处理窗口尺寸变化，重新计算 path 坐标
-->
<script setup lang="ts">
interface Chapter {
  number: string
  title: string
  description: string
  icon: string
  to: string
}

// 全书章节，硬编码以保证一致性
const chapters: Chapter[] = [
  { number: '第 1 章', title: '认识 Claude Code', description: 'Claude Code 是什么、与竞品的本质区别、生态全景、底层概率模型与 Agentic Loop。', icon: 'i-lucide-rocket', to: '/intro/what-is-claude-code' },
  { number: '第 2 章', title: '安装与配置', description: '系统要求、登录认证、选择适合自己的交互界面（CLI / IDE / Web）。', icon: 'i-lucide-settings', to: '/setup/system-requirements' },
  { number: '第 3 章', title: '快速上手', description: '从启动到读懂代码库，再到完成第一个有意义的修改 —— 三步建立信心。', icon: 'i-lucide-hand', to: '/quickstart/startup' },
  { number: '第 4 章', title: '核心功能', description: '代码扫描、编辑与生成、测试与调试、Git 工作流、工具链整合。', icon: 'i-lucide-laptop', to: '/core-features/codebase-scan' },
  { number: '第 5 章', title: '进阶配置', description: '深度定制 CLAUDE.md、Skills 体系、MCP 协议、Hooks 编排。', icon: 'i-lucide-wrench', to: '/advanced/claude-md' },
  { number: '第 6 章', title: '实战开发', description: '需求架构、脚手架、核心功能、测试质量、部署上线 —— 真实项目全流程。', icon: 'i-lucide-hammer', to: '/practice/requirements-architecture' },
  { number: '第 7 章', title: '心法层', description: 'Prompt 设计、上下文管理、安全边界、Boris Cherny 实战经验。', icon: 'i-lucide-brain', to: '/mindset/prompt-design' },
  { number: '附录', title: '速查与术语', description: '常用命令速查表、AI 核心术语汇编、资源链接与延伸阅读。', icon: 'i-lucide-paperclip', to: '/appendix/a.command-cheatsheet' }
]

const sectionRef = ref<HTMLElement | null>(null)
const cardEls = ref<HTMLElement[]>([])
const containerWidth = ref(800)
const containerHeight = ref(800)
const pathD = ref('')
const scrollProgress = ref(0)

// 用模板 ref 函数式收集卡片 DOM
function collectCard(el: any, index: number) {
  if (el) {
    // NuxtLink 在 SSR 下解析为 <a>，直接是 HTMLElement
    const dom = (el?.$el || el) as HTMLElement
    cardEls.value[index] = dom
  }
}

// 重算 SVG path —— 用 cubic Bézier 把相邻卡片中心串成 S 型平滑曲线
function recomputePath() {
  if (!sectionRef.value || cardEls.value.length < 2) return
  const sectRect = sectionRef.value.getBoundingClientRect()
  containerWidth.value = sectRect.width
  containerHeight.value = sectRect.height

  const points = cardEls.value
    .filter(Boolean)
    .map((card) => {
      const r = card.getBoundingClientRect()
      return {
        x: r.left - sectRect.left + r.width / 2,
        y: r.top - sectRect.top + r.height / 2
      }
    })

  if (points.length < 2) return

  // 起点
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  // 用相邻两点的中点 y 作为控制点 → 自然 S 型曲线
  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1]
    const p1 = points[i]
    const cy = (p0.y + p1.y) / 2
    d += ` C ${p0.x.toFixed(1)} ${cy.toFixed(1)}, ${p1.x.toFixed(1)} ${cy.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`
  }
  pathD.value = d
}

// 滚动 progress —— section 顶部进入视口底为 0，底部离开视口顶为 1
function onScroll() {
  if (!sectionRef.value) return
  const r = sectionRef.value.getBoundingClientRect()
  const vh = window.innerHeight
  const total = r.height + vh
  const scrolled = vh - r.top
  scrollProgress.value = Math.max(0, Math.min(1, scrolled / total))
}

let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null
let rafId: number | null = null

// prefers-reduced-motion：用户期待静态体验，直接把进度推到底，跳过滚动绑定
const prefersReducedMotion = computed(() => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

function scheduleRecompute() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    recomputePath()
    onScroll()
  })
}

onMounted(async () => {
  await nextTick()
  scheduleRecompute()

  // ResizeObserver 处理窗口/容器尺寸变化
  ro = new ResizeObserver(scheduleRecompute)
  if (sectionRef.value) ro.observe(sectionRef.value)

  // IntersectionObserver 触发卡片弹簧进场
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible')
          io?.unobserve(e.target)
        }
      })
    },
    { threshold: 0.15 }
  )
  cardEls.value.forEach((el) => el && io?.observe(el))

  // reduce-motion：路径直接画完，跳过滚动绑定
  if (prefersReducedMotion.value) {
    scrollProgress.value = 1
    return
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', scheduleRecompute, { passive: true })
})

onUnmounted(() => {
  io?.disconnect()
  ro?.disconnect()
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', scheduleRecompute)
})
</script>

<template>
  <div
    ref="sectionRef"
    class="relative w-full max-w-5xl mx-auto py-8"
  >
    <!-- SVG 路径绘制层：覆盖整个 section，pathLength=1 → dashoffset 直接是 progress -->
    <svg
      class="absolute inset-0 w-full h-full pointer-events-none z-0"
      :viewBox="`0 0 ${containerWidth} ${containerHeight}`"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="chapter-path-grad"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="var(--color-orange-400)"
            stop-opacity="0.4"
          />
          <stop
            offset="50%"
            stop-color="var(--color-orange-500)"
            stop-opacity="0.85"
          />
          <stop
            offset="100%"
            stop-color="var(--color-orange-600)"
            stop-opacity="0.95"
          />
        </linearGradient>

        <!-- 路径终点光晕 -->
        <filter
          id="chapter-path-glow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur
            stdDeviation="3"
            result="blur"
          />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <!-- 静态底层路径（淡淡轮廓，给读者完整路径预告） -->
      <path
        :d="pathD"
        fill="none"
        stroke="var(--color-orange-200)"
        stroke-width="1.5"
        stroke-dasharray="3 6"
        stroke-linecap="round"
        opacity="0.35"
      />

      <!-- 滚动绘制的高亮路径 -->
      <path
        :d="pathD"
        fill="none"
        stroke="url(#chapter-path-grad)"
        stroke-width="2.5"
        stroke-linecap="round"
        pathLength="1"
        stroke-dasharray="1"
        :stroke-dashoffset="(1 - scrollProgress).toFixed(3)"
        filter="url(#chapter-path-glow)"
        style="transition: stroke-dashoffset 0.08s linear;"
      />
    </svg>

    <!-- 章节卡片 zigzag 布局：用 flex 列 + 交替对齐，每张卡片独占一行 -->
    <div class="relative z-10 flex flex-col gap-y-12 md:gap-y-16 lg:gap-y-20">
      <NuxtLink
        v-for="(ch, i) in chapters"
        :key="ch.to"
        :ref="(el) => collectCard(el, i)"
        :to="ch.to"
        :class="[
          'chapter-card chapter-card-tilt group block p-6 lg:p-7 rounded-2xl border border-default bg-default/70 backdrop-blur-sm hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5 transition-colors no-underline',
          'w-full md:w-[60%] lg:w-[55%]',
          i % 2 === 0 ? 'md:self-start' : 'md:self-end'
        ]"
        :style="{ transitionDelay: `${(i % 4) * 80}ms` }"
      >
        <div class="flex items-start gap-4">
          <div class="shrink-0 size-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
            <UIcon
              :name="ch.icon"
              class="size-6 text-primary"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-mono text-muted mb-1.5 tracking-wider uppercase">
              {{ ch.number }}
            </div>
            <div class="text-lg lg:text-xl font-semibold text-default mb-2 group-hover:text-primary transition-colors">
              {{ ch.title }}
            </div>
            <p class="text-sm text-muted leading-relaxed">
              {{ ch.description }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
