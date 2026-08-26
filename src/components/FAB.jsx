/**
 * AI 助理浮动按钮 - 参考截图右下角蓝紫渐变球
 */
export default function FAB({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center tap"
      style={{
        background: 'linear-gradient(135deg, #5B8FF9 0%, #9B7FF5 100%)',
      }}
      aria-label="AI 助理"
    >
      <div className="flex flex-col items-center text-white leading-none">
        <span className="text-[15px] font-bold tracking-tight">AI</span>
        <span className="text-[9px] mt-0.5">助理</span>
      </div>
    </button>
  )
}
