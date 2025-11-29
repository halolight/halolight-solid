import { JSX, createSignal, onMount, For } from 'solid-js'

interface AuthShellProps {
  left?: JSX.Element
  right: JSX.Element
  showLeft?: boolean
  leftGradientClassName?: string
  rightPaddingClassName?: string
  class?: string
}

// 浮动点配置，与 Next.js 版本一致
const floatingDots = [
  { left: '20%', top: '30%', delay: 0 },
  { left: '35%', top: '50%', delay: 0.5 },
  { left: '50%', top: '70%', delay: 1 },
  { left: '65%', top: '40%', delay: 1.5 },
  { left: '80%', top: '60%', delay: 2 },
  { left: '95%', top: '35%', delay: 2.5 },
]

export function AuthShell(props: AuthShellProps) {
  const showLeft = props.showLeft ?? true
  const leftGradientClassName =
    props.leftGradientClassName ?? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700'
  const rightPaddingClassName = props.rightPaddingClassName ?? 'px-3 sm:px-5 lg:px-10 py-2 sm:py-3 lg:py-6'

  const [mousePos, setMousePos] = createSignal({ x: 0, y: 0 })
  const [mounted, setMounted] = createSignal(false)

  let leftRef: HTMLDivElement | undefined

  const handleMouseMove = (e: MouseEvent) => {
    if (!leftRef) return
    const rect = leftRef.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  onMount(() => {
    // 使用 requestAnimationFrame 确保动画更流畅
    requestAnimationFrame(() => {
      setMounted(true)
    })
  })

  return (
    <div
      class={`relative min-h-screen lg:h-dvh overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 ${props.class || ''}`}
    >
      {/* 网格背景 */}
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ 'pointer-events': 'none' }}
      />

      {/* 动画光晕 - 与 Next.js framer-motion 效果一致 */}
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/30 to-cyan-400/30 blur-3xl animate-halo-1" />
        <div class="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/30 to-purple-400/30 blur-3xl animate-halo-2" />
        <div class="absolute -bottom-32 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-violet-400/20 to-pink-400/20 blur-3xl animate-halo-3" />
      </div>

      <div
        class={`relative flex min-h-screen lg:h-full flex-col lg:flex-row ${mounted() ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
      >
        {showLeft && (
          <div
            ref={leftRef}
            onMouseMove={handleMouseMove}
            class={`hidden lg:flex lg:w-1/2 relative overflow-hidden ${mounted() ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
          >
            {/* 主背景渐变 */}
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
            <div class={`absolute inset-0 ${leftGradientClassName}`} />

            {/* 网格叠加 */}
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />

            {/* 鼠标跟随光晕 */}
            <div
              class="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(600px circle at ${mousePos().x}px ${mousePos().y}px, rgba(255,255,255,0.1), transparent 40%)`,
              }}
            />

            {/* 内容区域 */}
            <div class="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">{props.left}</div>

            {/* 浮动装饰点 - 与 Next.js 版本位置和动画一致 */}
            <For each={floatingDots}>
              {(dot, index) => (
                <div
                  class="absolute w-2 h-2 rounded-full bg-white/20 animate-float-dot"
                  style={{
                    left: dot.left,
                    top: dot.top,
                    'animation-delay': `${dot.delay}s`,
                    'animation-duration': `${3 + index() * 0.5}s`,
                  }}
                />
              )}
            </For>
          </div>
        )}

        <div class={`flex-1 flex items-center justify-center ${rightPaddingClassName}`}>{props.right}</div>
      </div>

      <style>{`
        /* 光晕动画 - 模拟 framer-motion 的 scale 和 opacity 动画 */
        @keyframes halo-1 {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }

        @keyframes halo-2 {
          0%, 100% { transform: scale(1.2); opacity: 0.4; }
          50% { transform: scale(1); opacity: 0.6; }
        }

        @keyframes halo-3 {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.3); opacity: 0.5; }
        }

        /* 浮动点动画 - 与 Next.js 一致 */
        @keyframes float-dot {
          0%, 100% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.5; }
        }

        .animate-halo-1 {
          animation: halo-1 8s ease-in-out infinite;
        }

        .animate-halo-2 {
          animation: halo-2 10s ease-in-out infinite;
        }

        .animate-halo-3 {
          animation: halo-3 12s ease-in-out infinite;
        }

        .animate-float-dot {
          animation: float-dot 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
