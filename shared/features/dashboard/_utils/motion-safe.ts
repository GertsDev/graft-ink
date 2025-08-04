"use client";

export function createMotionSafeVariants(
  variants: Record<string, any>,
  prefersReducedMotion: boolean
): Record<string, any> {
  if (prefersReducedMotion) {
    // Return simplified variants with minimal motion
    return Object.keys(variants).reduce((acc, key) => {
      const variant = variants[key];
      acc[key] = {
        opacity: (typeof variant === 'object' && variant.opacity) || 1,
        // Remove scale, rotate, and position animations
        scale: 1,
        rotate: 0,
        x: 0,
        y: 0,
        transition: { duration: 0.01 } // Nearly instant
      };
      return acc;
    }, {} as Record<string, any>);
  }
  return variants;
}

export function getMotionSafeDuration(
  duration: number,
  prefersReducedMotion: boolean
): number {
  return prefersReducedMotion ? 0.01 : duration;
}