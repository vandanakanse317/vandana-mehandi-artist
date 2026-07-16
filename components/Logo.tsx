type LogoProps = {
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizeClasses = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl md:text-4xl',
};

const markSizes = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export function Logo({ variant = 'horizontal', size = 'md', className = '' }: LogoProps) {
  const isVertical = variant === 'vertical';

  return (
    <div
      className={`inline-flex ${isVertical ? 'flex-col text-center' : 'flex-row text-left'} items-center gap-3 ${className}`}
      aria-label="Vandana Mehandi Artist"
    >
      <svg
        viewBox="0 0 64 64"
        className={`${markSizes[size]} shrink-0 text-[#D4AF37]`}
        role="img"
        aria-hidden="true"
      >
        <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M32 51c-8-8-15-15-15-25 7 1 12 4 15 10 3-6 8-9 15-10 0 10-7 17-15 25Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path d="M32 14v37M23 20c4 2 7 5 9 9M41 20c-4 2-7 5-9 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className={`${sizeClasses[size]} font-serif font-bold leading-tight tracking-wide text-white`}>
        Vandana Mehandi Artist
      </span>
    </div>
  );
}
