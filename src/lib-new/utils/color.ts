'use client'

/**
 * RGB color interface
 */
export interface RGB {
  r: number
  g: number
  b: number
}

/**
 * HSL color interface
 */
export interface HSL {
  h: number
  s: number
  l: number
}

/**
 * Convert a hex color string to RGB
 * 
 * @param hex - Hex color string (e.g., #FF0000 or #F00)
 * @returns RGB color object or null if invalid hex
 */
export function hexToRgb(hex: string): RGB | null {
  // Remove # if present
  hex = hex.replace(/^#/, '')
  
  // Handle shorthand hex (e.g., #F00)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }
  
  // Parse hex values
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  }
}

/**
 * Convert RGB to hex color string
 * 
 * @param rgb - RGB color object
 * @returns Hex color string
 */
export function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    })
    .join('')
}

/**
 * Convert RGB to HSL
 * 
 * @param rgb - RGB color object
 * @returns HSL color object
 */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  // Convert RGB to [0, 1] range
  r /= 255
  g /= 255
  b /= 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    
    h /= 6
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Convert HSL to RGB
 * 
 * @param hsl - HSL color object
 * @returns RGB color object
 */
export function hslToRgb({ h, s, l }: HSL): RGB {
  // Convert to [0, 1] range
  h /= 360
  s /= 100
  l /= 100
  
  let r = 0
  let g = 0
  let b = 0
  
  if (s === 0) {
    // Achromatic (gray)
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  }
}

/**
 * Adjusts the brightness of a color
 * 
 * @param hex - Hex color string
 * @param percent - Percentage to lighten (positive) or darken (negative)
 * @returns Modified hex color string
 */
export function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const hsl = rgbToHsl(rgb)
  hsl.l = Math.max(0, Math.min(100, hsl.l + percent))
  
  return rgbToHex(hslToRgb(hsl))
}

/**
 * Get a contrasting color (black or white) for text over a given background
 * 
 * @param backgroundColor - Hex color string
 * @returns '#000000' for light backgrounds or '#FFFFFF' for dark backgrounds
 */
export function getContrastColor(backgroundColor: string): string {
  const rgb = hexToRgb(backgroundColor)
  if (!rgb) return '#000000'
  
  // Calculate relative luminance
  const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b
  
  return luminance > 128 ? '#000000' : '#FFFFFF'
}
