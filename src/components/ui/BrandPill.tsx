export function BrandPill({ isDark = true }: { isDark?: boolean }) {
  return (
    <div
      tabIndex={0}
      className={`group absolute top-4 left-4 z-40 flex h-9 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 cursor-pointer backdrop-blur-md border shadow-xs px-2 py-1 transition-all duration-300 ${
        isDark
          ? 'bg-white/80 border-neutral-200/70 hover:bg-white/95 text-neutral-900'
          : 'bg-neutral-900/75 border-white/15 hover:bg-neutral-900/90 text-white'
      }`}
    >
      <span className="relative size-6 shrink-0 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Free Mockup Tool"
          className="size-6 rounded-md object-contain"
        />
      </span>
      <span className="overflow-hidden text-[13px] font-medium tracking-tight whitespace-nowrap transition-all duration-300 max-w-0 opacity-0 group-hover:max-w-44 group-hover:opacity-100 group-focus-visible:max-w-44 group-focus-visible:opacity-100">
        <span className="pl-2">Free Mockup Tool</span>
      </span>
    </div>
  );
}
