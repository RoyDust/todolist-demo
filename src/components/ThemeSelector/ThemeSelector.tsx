// src/components/ThemeSelector/ThemeSelector.tsx

import { useState, useEffect, useRef, useCallback } from 'react'
import { THEMES, DEFAULT_THEME, type ThemeId } from '../../types/theme'
import './ThemeSelector.css'

const THEME_KEY = 'todolist-demo-theme'

interface ThemeSelectorProps {
  currentTheme: ThemeId
  onThemeChange: (themeId: ThemeId) => void
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭面板
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // 键盘导航
  const handleKeyDown = useCallback((e: React.KeyboardEvent, themeId: ThemeId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onThemeChange(themeId)
      setIsOpen(false)
    }
  }, [onThemeChange])

  const currentThemeData = THEMES.find(t => t.id === currentTheme) || THEMES[0]

  return (
    <div className="theme-selector" ref={panelRef}>
      <button
        className="theme-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="切换主题"
        aria-expanded={isOpen}
        title="切换主题"
      >
        <span
          className="theme-color-preview"
          style={{ background: `linear-gradient(135deg, ${currentThemeData.colors.bgGradientFrom}, ${currentThemeData.colors.bgGradientTo})` }}
        />
      </button>

      {isOpen && (
        <div className="theme-panel" role="dialog" aria-label="选择主题">
          <div className="theme-panel-header">
            <span className="theme-panel-title">选择主题</span>
          </div>
          <div className="theme-grid">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                className={`theme-item ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => {
                  onThemeChange(theme.id)
                  setIsOpen(false)
                }}
                onKeyDown={(e) => handleKeyDown(e, theme.id)}
                title={theme.name}
                aria-label={`选择 ${theme.name} 主题`}
                aria-pressed={currentTheme === theme.id}
              >
                <span
                  className="theme-item-color"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.bgGradientFrom}, ${theme.colors.bgGradientTo})` }}
                />
                <span className="theme-item-name">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for theme management
export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(THEME_KEY)
    return (saved as ThemeId) || DEFAULT_THEME
  })

  // 应用主题到 CSS 变量
  useEffect(() => {
    const themeData = THEMES.find(t => t.id === theme) || THEMES[0]
    const root = document.documentElement

    root.style.setProperty('--bg-gradient-from', themeData.colors.bgGradientFrom)
    root.style.setProperty('--bg-gradient-to', themeData.colors.bgGradientTo)
    root.style.setProperty('--accent', themeData.colors.accent)
    root.style.setProperty('--accent-hover', themeData.colors.accentHover)
    root.style.setProperty('--card-shadow', themeData.colors.cardShadow)
    root.style.setProperty('--cta', themeData.colors.accent)
    root.style.setProperty('--cta-hover', themeData.colors.accentHover)
    root.style.setProperty('--checkbox-checked', themeData.colors.accent)
    root.style.setProperty('--progress-fill', themeData.colors.accent)

    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return { theme, setTheme }
}
