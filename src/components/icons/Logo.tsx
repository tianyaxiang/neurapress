import { SVGProps } from 'react'

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2563eb' }} />
          <stop offset="100%" style={{ stopColor: '#22d3ee' }} />
        </linearGradient>
      </defs>

      {/* Message bubble */}
      <path
        d="M4 6c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5l-2.5 3-2.5-3H6a2 2 0 0 1-2-2V6z"
        fill="url(#logo-gradient)"
      />

      {/* AI Processor Symbol */}
      <path
        d="M8 8h8v6H8V8z"
        stroke="white"
        strokeWidth="1.25"
        fill="none"
      />
      <path
        d="M10 10h4M10 12h4"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M16 10v2"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}
