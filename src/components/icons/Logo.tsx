import { SVGProps } from 'react'

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* Neural network nodes */}
      <circle cx="6" cy="12" r="2" fill="currentColor" />
      <circle cx="18" cy="8" r="2" fill="currentColor" />
      <circle cx="18" cy="16" r="2" fill="currentColor" />
      <circle cx="12" cy="6" r="2" fill="currentColor" />
      <circle cx="12" cy="18" r="2" fill="currentColor" />
      
      {/* Connections */}
      <line x1="8" y1="12" x2="16" y2="8" />
      <line x1="8" y1="12" x2="16" y2="16" />
      <line x1="8" y1="12" x2="10" y2="6" />
      <line x1="8" y1="12" x2="10" y2="18" />
      
      {/* Pen tip overlay */}
      <path
        d="M16 6l2 2-8 8-2-2z"
        fill="currentColor"
        strokeWidth="1"
      />
    </svg>
  )
}
