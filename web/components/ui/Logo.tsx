export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 22c0-5.5 1.8-9.6 5.5-12.2C15.7 9 12 10.6 12 15c0-4.4-3.7-6-5.5-5.2C10.2 12.4 12 16.5 12 22Z"
        fill="currentColor"
      />
      <path
        d="M12 13c-.6-3.4-2.6-5.7-6-6.6 1 3.6 2.7 5.6 6 6.6Z"
        fill="currentColor"
        opacity=".75"
      />
      <path
        d="M12 13c.6-3.4 2.6-5.7 6-6.6-1 3.6-2.7 5.6-6 6.6Z"
        fill="currentColor"
        opacity=".75"
      />
    </svg>
  );
}

export function Logo({
  className = "",
  markClassName = "text-brand-500",
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={`h-7 w-7 ${markClassName}`} />
      <span className="font-display text-xl font-bold">IvySchool.ai</span>
    </span>
  );
}
