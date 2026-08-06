/**
 * @foundation MotionTokens
 * @description Curvas y duraciones oficiales del sistema Loop Momentum.
 * @category Foundations
 */

export const MOTION = {
  duration: {
    instant: '100ms',
    quick: '150ms',
    standard: '300ms',
    emphasized: '500ms',
    slow: '800ms',
    ai_loop: '4000ms'
  },
  easing: {
    standard: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
    entrance: 'cubic-bezier(0.0, 0.0, 0.2, 1.0)',
    exit: 'cubic-bezier(0.4, 0.0, 1.0, 1.0)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
} as const;