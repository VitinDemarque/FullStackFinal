export const theme = {
  colors: {
    primary: '#667eea',
    primaryDark: '#764ba2',
    secondary: '#fbbf24',
    secondaryDark: '#f59e0b',
    
    white: '#ffffff',
    black: '#000000',
    
    accentBlue: '#3b82f6',
    accentYellow: '#fbbf24',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textLight: '#6b7280',
    gray900: '#111827',
    gray700: '#374151',
    yellow400: '#fbbf24',
    
    // Dark mode colors
    dark: {
      background: '#0f172a',
      surface: '#1e293b',
      surfaceHover: '#334155',
      textPrimary: '#f8fafc',
      textSecondary: '#cbd5e1',
      textLight: '#94a3b8',
      border: '#334155',
      accent: '#3b82f6',
    },
    
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#3b82f6',
      500: '#2563eb',
      600: '#1d4ed8',
    },
    
    yellow: {
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
    },
    
    green: {
      400: '#10b981',
      500: '#059669',
    },
    
    red: {
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
    },
    
    success: {
      bg: '#d1fae5',
      text: '#065f46',
    },
    
    warning: {
      bg: '#fed7aa',
      text: '#92400e',
    },
    
    danger: {
      bg: '#fecaca',
      text: '#991b1b',
    },
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    blue: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    green: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    yellow: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  
  shadows: {
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    primary: '0 20px 60px rgba(102, 126, 234, 0.4)',
    yellow: '0 10px 30px rgba(251, 191, 36, 0.3)',
  },
  
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1024px',
    wide: '1280px',
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.75rem',
    '4xl': '2rem',
    '5xl': '3rem',
  },
  
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  transitions: {
    fast: '0.15s ease',
    base: '0.2s ease',
    slow: '0.3s ease',
    all: 'all 0.3s ease',
  },
}

export type Theme = typeof theme

