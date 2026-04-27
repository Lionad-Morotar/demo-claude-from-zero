<!--
  StarField.vue —— Canvas 粒子星空
  替代原 StarsBg（CSS DOM 实现），增加：
  · 多层 parallax（远 / 中 / 近）
  · 鼠标视差：移动时星空反向偏移
  · 流星：每 5-10s 一颗轨迹掠过
  · IntersectionObserver pause when out of view（CPU 友好）
  · prefers-reduced-motion 退化为静态星点
-->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  density?: number
}>(), {
  density: 1
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

interface Star {
  x: number
  y: number
  z: number // 深度，决定视差和大小
  r: number
  baseAlpha: number
  twinkle: number
}

interface Meteor {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

let stars: Star[] = []
let meteors: Meteor[] = []
let rafId: number | null = null
let isVisible = true
let mouseX = 0
let mouseY = 0
let targetMouseX = 0
let targetMouseY = 0
let lastMeteorAt = 0

const prefersReducedMotion = computed(() => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

function resize(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const { width, height } = canvas.getBoundingClientRect()
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function initStars(canvas: HTMLCanvasElement) {
  const { width, height } = canvas.getBoundingClientRect()
  const count = Math.floor(width * height * 0.0009 * props.density)
  stars = Array.from({ length: count }, () => {
    const z = Math.random()
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      z,
      r: 0.4 + z * 1.6,
      baseAlpha: 0.25 + z * 0.65,
      twinkle: Math.random() * Math.PI * 2
    }
  })
}

function spawnMeteor(canvas: HTMLCanvasElement) {
  const { width } = canvas.getBoundingClientRect()
  const startX = Math.random() * width * 0.6 + width * 0.2
  meteors.push({
    x: startX,
    y: -10,
    vx: (Math.random() - 0.5) * 1.2,
    vy: 4 + Math.random() * 3,
    life: 0,
    maxLife: 100 + Math.random() * 60
  })
}

function tick(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, t: number) {
  if (!isVisible) {
    rafId = requestAnimationFrame((nt) => tick(canvas, ctx, nt))
    return
  }
  const { width, height } = canvas.getBoundingClientRect()

  // 平滑追随鼠标
  mouseX += (targetMouseX - mouseX) * 0.06
  mouseY += (targetMouseY - mouseY) * 0.06

  ctx.clearRect(0, 0, width, height)

  // 渲染恒星
  for (const s of stars) {
    s.twinkle += 0.018 + s.z * 0.025
    const flicker = 0.6 + 0.4 * Math.sin(s.twinkle)
    const parallaxX = -mouseX * (s.z * 14)
    const parallaxY = -mouseY * (s.z * 14)
    const x = s.x + parallaxX
    const y = s.y + parallaxY

    // 远星：单像素亮点；近星：带 glow
    if (s.z > 0.7) {
      ctx.fillStyle = `rgba(255, 220, 180, ${s.baseAlpha * flicker * 0.4})`
      ctx.beginPath()
      ctx.arc(x, y, s.r * 2.6, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = `rgba(255, 240, 220, ${s.baseAlpha * flicker})`
    ctx.beginPath()
    ctx.arc(x, y, s.r, 0, Math.PI * 2)
    ctx.fill()
  }

  // 流星：每 ~6s 触发一颗
  if (t - lastMeteorAt > 4000 + Math.random() * 5000) {
    spawnMeteor(canvas)
    lastMeteorAt = t
  }

  // 渲染流星
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i]
    if (!m) continue
    m.x += m.vx
    m.y += m.vy
    m.life++
    const alpha = Math.max(0, 1 - m.life / m.maxLife)
    const tailLen = 80
    const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tailLen / 5, m.y - m.vy * tailLen / 5)
    grad.addColorStop(0, `rgba(255, 200, 150, ${alpha})`)
    grad.addColorStop(1, 'rgba(255, 200, 150, 0)')
    ctx.strokeStyle = grad
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(m.x, m.y)
    ctx.lineTo(m.x - m.vx * tailLen / 5, m.y - m.vy * tailLen / 5)
    ctx.stroke()
    if (m.life > m.maxLife || m.y > height + 100) {
      meteors.splice(i, 1)
    }
  }

  rafId = requestAnimationFrame((nt) => tick(canvas, ctx, nt))
}

function onMouseMove(e: MouseEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  // 归一化到 -1 ~ 1，作为视差因子
  targetMouseX = (e.clientX - rect.left - rect.width / 2) / rect.width
  targetMouseY = (e.clientY - rect.top - rect.height / 2) / rect.height
}

let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null

onMounted(() => {
  if (!canvasRef.value || !containerRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  resize(canvas)
  initStars(canvas)

  // prefers-reduced-motion：渲染一帧静态星空，不启动循环
  if (prefersReducedMotion.value) {
    tick(canvas, ctx, 0)
    if (rafId) cancelAnimationFrame(rafId)
    rafId = null
    return
  }

  rafId = requestAnimationFrame((t) => tick(canvas, ctx, t))

  ro = new ResizeObserver(() => {
    resize(canvas)
    initStars(canvas)
  })
  ro.observe(containerRef.value)

  io = new IntersectionObserver(
    (entries) => {
      const e = entries[0]
      if (e) isVisible = e.isIntersecting
    },
    { rootMargin: '50px' }
  )
  io.observe(containerRef.value)

  containerRef.value.addEventListener('mousemove', onMouseMove)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  io?.disconnect()
  ro?.disconnect()
  if (containerRef.value) containerRef.value.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <div
    ref="containerRef"
    class="absolute inset-0 pointer-events-auto z-[1] overflow-hidden"
    aria-hidden="true"
  >
    <canvas
      ref="canvasRef"
      class="starfield-canvas"
    />
  </div>
</template>
