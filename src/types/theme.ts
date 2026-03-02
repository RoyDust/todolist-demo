// src/types/theme.ts

export type ThemeId = 'teal' | 'indigo' | 'violet' | 'coral' | 'rose' | 'emerald'

export interface ThemeColors {
  bgGradientFrom: string
  bgGradientTo: string
  accent: string
  accentHover: string
  cardShadow: string
}

export interface Theme {
  id: ThemeId
  name: string
  colors: ThemeColors
}

export const THEMES: Theme[] = [
  {
    id: 'teal',
    name: '青绿',
    colors: {
      bgGradientFrom: '#0D9488',
      bgGradientTo: '#14B8A6',
      accent: '#0D9488',
      accentHover: '#0f766e',
      cardShadow: 'rgba(13,148,136,0.12)',
    },
  },
  {
    id: 'indigo',
    name: '靛蓝',
    colors: {
      bgGradientFrom: '#4338CA',
      bgGradientTo: '#6366F1',
      accent: '#6366F1',
      accentHover: '#4f46e5',
      cardShadow: 'rgba(99,102,241,0.12)',
    },
  },
  {
    id: 'violet',
    name: '紫罗兰',
    colors: {
      bgGradientFrom: '#7C3AED',
      bgGradientTo: '#8B5CF6',
      accent: '#8B5CF6',
      accentHover: '#7c3aed',
      cardShadow: 'rgba(139,92,246,0.12)',
    },
  },
  {
    id: 'coral',
    name: '珊瑚',
    colors: {
      bgGradientFrom: '#EA580C',
      bgGradientTo: '#F97316',
      accent: '#F97316',
      accentHover: '#ea580c',
      cardShadow: 'rgba(249,115,22,0.12)',
    },
  },
  {
    id: 'rose',
    name: '玫瑰',
    colors: {
      bgGradientFrom: '#DB2777',
      bgGradientTo: '#EC4899',
      accent: '#EC4899',
      accentHover: '#db2777',
      cardShadow: 'rgba(236,72,153,0.12)',
    },
  },
  {
    id: 'emerald',
    name: '翠绿',
    colors: {
      bgGradientFrom: '#059669',
      bgGradientTo: '#10B981',
      accent: '#10B981',
      accentHover: '#059669',
      cardShadow: 'rgba(16,185,129,0.12)',
    },
  },
]

export const DEFAULT_THEME: ThemeId = 'teal'
