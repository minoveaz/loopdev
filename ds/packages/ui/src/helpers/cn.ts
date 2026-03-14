import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Extender tailwind-merge para reconocer clases personalizadas del DS
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-lpd-nano',
        'text-lpd-xs', 
        'text-lpd-sm',
        'text-lpd-base',
        'text-lpd-lg',
        'text-lpd-xl',
        'text-lpd-2xl',
        'text-lpd-3xl',
        'text-lpd-4xl',
        'text-lpd-5xl',
        'text-lpd-6xl',
        'text-lpd-7xl',
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
