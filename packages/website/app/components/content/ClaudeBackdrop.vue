<!--
  ClaudeBackdrop.vue —— Claude 品牌浅色暖调装饰底图

  设计语言（参考 Anthropic Engineering Blog）：
  · 奶油色底 #F5F2ED
  · Pastel 色块：赤陶橙、鼠尾草绿、灰蓝、裸粉
  · 大圆角、柔和 blur、低透明度
  · 手绘感 SVG 线条：有机曲线、不规则圆点
  · 极度 subtle，不干扰文字阅读
-->
<template>
  <div
    class="absolute inset-0 pointer-events-none overflow-hidden"
    aria-hidden="true"
  >
    <svg
      class="absolute inset-0 w-full h-full"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 奶油色底 -->
      <rect width="100%" height="100%" fill="#F5F2ED" />

      <!-- Pastel 装饰色块 —— 大圆角矩形，半透明 -->
      <!-- 右上：赤陶橙圆角块 -->
      <rect
        x="780"
        y="-40"
        width="380"
        height="280"
        rx="120"
        fill="#D4A574"
        fill-opacity="0.18"
      />

      <!-- 左上：裸粉色块 -->
      <rect
        x="-60"
        y="60"
        width="260"
        height="200"
        rx="80"
        fill="#E8C4B8"
        fill-opacity="0.22"
      />

      <!-- 左下：鼠尾草绿有机 blob（用 path 模拟） -->
      <path
        d="M -40 420 Q 80 380 160 440 Q 240 500 120 560 Q 0 600 -40 520 Z"
        fill="#A8B5A0"
        fill-opacity="0.16"
      />

      <!-- 右下：灰蓝小圆 -->
      <circle
        cx="1080"
        cy="480"
        r="90"
        fill="#9BAFB8"
        fill-opacity="0.14"
      />

      <!-- 中央偏右：暖橙小椭圆 -->
      <ellipse
        cx="680"
        cy="320"
        rx="70"
        ry="50"
        fill="#C9A882"
        fill-opacity="0.12"
      />

      <!-- 手绘风格线条 —— 有机、不规则、温暖 -->
      <!-- 主曲线：从左上到右下的柔和弧线 -->
      <path
        d="M 80 180 Q 300 120 520 200 T 920 160"
        fill="none"
        stroke="#C4A882"
        stroke-width="1.2"
        stroke-opacity="0.25"
        stroke-linecap="round"
      />

      <!-- 第二条曲线：更随意的波浪 -->
      <path
        d="M 200 380 Q 400 340 600 400 Q 800 460 1000 380"
        fill="none"
        stroke="#A8B5A0"
        stroke-width="1"
        stroke-opacity="0.20"
        stroke-linecap="round"
      />

      <!-- 小装饰圆点 —— 散布的 pastel 点 -->
      <g>
        <circle cx="180" cy="140" r="4" fill="#D4A574" fill-opacity="0.30" />
        <circle cx="220" cy="160" r="2.5" fill="#A8B5A0" fill-opacity="0.25" />
        <circle cx="320" cy="120" r="3" fill="#9BAFB8" fill-opacity="0.20" />
        <circle cx="420" cy="180" r="5" fill="#E8C4B8" fill-opacity="0.22" />
        <circle cx="580" cy="140" r="3.5" fill="#D4A574" fill-opacity="0.18" />
        <circle cx="720" cy="200" r="2" fill="#A8B5A0" fill-opacity="0.28" />
        <circle cx="820" cy="160" r="4" fill="#9BAFB8" fill-opacity="0.15" />
        <circle cx="980" cy="130" r="3" fill="#E8C4B8" fill-opacity="0.20" />

        <circle cx="140" cy="320" r="3" fill="#A8B5A0" fill-opacity="0.18" />
        <circle cx="280" cy="360" r="4.5" fill="#D4A574" fill-opacity="0.14" />
        <circle cx="440" cy="340" r="2.5" fill="#9BAFB8" fill-opacity="0.22" />
        <circle cx="560" cy="380" r="3.5" fill="#E8C4B8" fill-opacity="0.16" />
        <circle cx="680" cy="350" r="2" fill="#A8B5A0" fill-opacity="0.25" />
        <circle cx="840" cy="390" r="4" fill="#D4A574" fill-opacity="0.12" />
        <circle cx="960" cy="340" r="3" fill="#9BAFB8" fill-opacity="0.18" />
        <circle cx="1080" cy="370" r="2.5" fill="#E8C4B8" fill-opacity="0.20" />

        <circle cx="200" cy="480" r="3" fill="#D4A574" fill-opacity="0.16" />
        <circle cx="360" cy="520" r="4" fill="#A8B5A0" fill-opacity="0.14" />
        <circle cx="480" cy="460" r="2.5" fill="#9BAFB8" fill-opacity="0.20" />
        <circle cx="620" cy="500" r="3.5" fill="#E8C4B8" fill-opacity="0.18" />
        <circle cx="780" cy="470" r="2" fill="#A8B5A0" fill-opacity="0.22" />
        <circle cx="920" cy="510" r="4" fill="#D4A574" fill-opacity="0.12" />
        <circle cx="1040" cy="460" r="3" fill="#9BAFB8" fill-opacity="0.16" />
      </g>

      <!-- 手绘风格小弧线 —— 点缀 -->
      <path
        d="M 340 260 Q 360 240 380 265"
        fill="none"
        stroke="#C4A882"
        stroke-width="1.5"
        stroke-opacity="0.20"
        stroke-linecap="round"
      />
      <path
        d="M 760 280 Q 780 300 800 275"
        fill="none"
        stroke="#A8B5A0"
        stroke-width="1.5"
        stroke-opacity="0.18"
        stroke-linecap="round"
      />
      <path
        d="M 480 440 Q 500 460 520 435"
        fill="none"
        stroke="#9BAFB8"
        stroke-width="1.5"
        stroke-opacity="0.16"
        stroke-linecap="round"
      />

      <!-- 底部渐隐遮罩 —— 与下方白色 section 平滑衔接 -->
      <defs>
        <linearGradient id="bd-fade-bottom-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F5F2ED" stop-opacity="0" />
          <stop offset="100%" stop-color="#F5F2ED" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect y="520" width="100%" height="80" fill="url(#bd-fade-bottom-light)" />
    </svg>
  </div>
</template>
