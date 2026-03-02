# 预设主题切换功能实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 实现 6 套预设主题配色切换功能，包含主题选择面板，过渡动画，localStorage 持久化

**Architecture:**
- 创建 `src/types/theme.ts` 定义主题类型和主题配置
- 创建 `src/components/ThemeSelector/` 组件目录，包含主题选择器和面板
- 修改 `src/App.tsx` 添加主题状态管理和 UI 集成
- 修改 `src/App.css` 添加主题选择器样式和 CSS 变量

**Tech Stack:** React + TypeScript + CSS

---

## Task 1: 创建主题类型定义

**Files:**
- Create: `src/types/theme.ts`

**Step 1: 创建主题类型文件**

```typescript
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
```

**Step 2: 提交**

```bash
git add src/types/theme.ts
git commit -m "feat: add theme types and configuration"
```

---

## Task 2: 创建主题选择器组件

**Files:**
- Create: `src/components/ThemeSelector/ThemeSelector.tsx`
- Create: `src/components/ThemeSelector/ThemeSelector.css`

**Step 1: 创建组件目录和文件**

```typescript
// src/components/ThemeSelector/ThemeSelector.tsx

import { useState, useEffect, useRef, useCallback } from 'react'
import { THEMES, DEFAULT_THEME, ThemeId } from '../../types/theme'
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
```

**Step 2: 创建样式文件**

```css
/* src/components/ThemeSelector/ThemeSelector.css */

.theme-selector {
  position: relative;
}

.theme-selector-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--input-bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all var(--ease);
  padding: 0;
}

.theme-selector-btn:hover {
  border-color: var(--accent);
  background: var(--accent-light);
}

.theme-selector-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.theme-color-preview {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  transition: transform var(--ease);
}

.theme-selector-btn:hover .theme-color-preview {
  transform: scale(1.1);
}

/* Theme Panel */
.theme-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: var(--card-bg);
  backdrop-filter: var(--backdrop-blur);
  -webkit-backdrop-filter: var(--backdrop-blur);
  border: var(--card-border);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--card-shadow);
  z-index: 100;
  animation: panelFadeIn 0.2s ease;
}

@keyframes panelFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.theme-panel-header {
  margin-bottom: 16px;
}

.theme-panel-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.theme-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;
  background: transparent;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s ease;
}

.theme-item:hover {
  background: var(--hover-bg);
}

.theme-item:hover .theme-item-color {
  transform: scale(1.1);
}

.theme-item:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.theme-item.active .theme-item-color {
  box-shadow: 0 0 0 3px var(--card-solid-bg), 0 0 0 5px currentColor;
}

.theme-item-color {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.theme-item-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--ease);
}

.theme-item:hover .theme-item-name,
.theme-item.active .theme-item-name {
  color: var(--text-primary);
}

/* Responsive */
@media (max-width: 480px) {
  .theme-panel {
    width: 260px;
    right: -60px;
  }

  .theme-item-color {
    width: 36px;
    height: 36px;
  }
}
```

**Step 3: 提交**

```bash
git add src/components/ThemeSelector/ThemeSelector.tsx src/components/ThemeSelector/ThemeSelector.css
git commit -m "feat: add ThemeSelector component with panel UI"
```

---

## Task 3: 集成主题选择器到 App

**Files:**
- Modify: `src/App.tsx:1-10` (imports)
- Modify: `src/App.tsx:171-180` (state)
- Modify: `src/App.tsx:239-245` (useTheme effect)
- Modify: `src/App.tsx:514-532` (header buttons)

**Step 1: 添加 import**

在 `src/App.tsx` 顶部添加：

```typescript
import { ThemeSelector, useTheme } from './components/ThemeSelector/ThemeSelector'
```

**Step 2: 替换主题状态**

找到现有的 dark mode state 附近，添加：

```typescript
// Theme state
const { theme, setTheme } = useTheme()
```

**Step 3: 在 Header 中添加 ThemeSelector**

找到 header-actions 部分，将现有结构替换为：

```tsx
<div className="header-actions">
  <span className="user-greeting">{currentUser?.username}</span>
  <button
    className="logout-btn"
    onClick={handleLogout}
    aria-label="退出登录"
  >
    <IconLogOut />
  </button>
  {/* 主题选择器 */}
  <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
  {/* 暗色模式切换 */}
  <button
    className="theme-toggle"
    onClick={() => setDark(d => !d)}
    aria-label={dark ? '切换到亮色模式' : '切换到暗色模式'}
  >
    {dark ? <IconSun /> : <IconMoon />}
  </button>
</div>
```

**Step 4: 提交**

```bash
git add src/App.tsx
git commit -m "feat: integrate ThemeSelector into App header"
```

---

## Task 4: 添加过渡动画到全局 CSS

**Files:**
- Modify: `src/App.css:1-40` (root variables)

**Step 1: 添加过渡动画**

在 `:root` 的 CSS 变量中添加：

```css
:root {
  /* ... existing variables ... */

  /* Theme transition */
  --theme-transition: 0.4s ease-out;
}

body {
  /* ... existing styles ... */
  transition: background var(--theme-transition);
}

.app {
  /* ... existing styles ... */
  transition: background var(--theme-transition), box-shadow var(--theme-transition), border var(--theme-transition);
}
```

同时更新其他使用 accent 颜色的元素，添加过渡：

```css
.add-btn,
.filter-btn.active,
.custom-checkbox input:checked + .checkbox-box,
.progress-fill {
  transition: background var(--theme-transition), border-color var(--theme-transition), box-shadow var(--theme-transition);
}
```

**Step 2: 提交**

```bash
git add src/App.css
git commit -m "feat: add theme transition animations"
```

---

## Task 5: 测试主题切换功能

**Step 1: 运行开发服务器**

```bash
npm run dev
```

**Step 2: 验证功能**

1. 点击主题选择器按钮，验证面板打开
2. 点击面板外部，验证面板关闭
3. 点击各主题色块，验证主题切换
4. 验证主题切换有过渡动画
5. 刷新页面，验证主题偏好保持
6. 验证暗色模式切换按钮位置不变
7. 验证暗色模式下主题面板显示正确

**Step 3: 运行测试**

```bash
npm run test
```

确保现有测试通过。

**Step 4: 提交**

```bash
git add .
git commit -m "feat: complete theme switcher feature with transitions"
```

---

## Task 6: 代码审查

**Step 1: 使用 code-reviewer agent 进行代码审查**

```bash
# 触发 code-reviewer agent 审查本次改动
```

---

## 执行方式

**Plan complete and saved to `docs/plans/2026-03-02-theme-switcher-implementation.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
