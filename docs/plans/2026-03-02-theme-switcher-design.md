# 预设主题切换功能设计

**日期：** 2026-03-02
**功能：** 自由切换预设主题配色

---

## 概述

为 TodoList 应用添加预设主题切换功能，用户可以从 6 套现代渐变风格的主题中自由选择，每次切换都有平滑的过渡动画。主题偏好持久化到 localStorage。

---

## UI/UX 设计

### 1. 主题选择器入口

- **位置**：Header 区域右侧，在暗色模式切换按钮旁边
- **形态**：圆形按钮，显示当前主题的主色色块
- **尺寸**：40x40px，与暗色模式按钮一致
- **悬停**：显示 tooltip "切换主题"

### 2. 主题选择面板

- **形态**：玻璃拟态悬浮面板，圆角 16px
- **位置**：按钮下方弹出，水平居中
- **尺寸**：宽度 280px，内边距 16px
- **关闭方式**：点击外部区域关闭

#### 面板内容

- 标题："选择主题"（字号 14px，颜色 var(--text-secondary)）
- 6 个主题色块网格（3x2 布局）
- 每个色块：圆形，直径 44px，间距 12px
- 悬停：放大至 1.1 倍，显示主题名称 tooltip
- 选中：外围显示 3px 白色圆环 + 阴影

### 3. 预设主题配色

| 名称 | --bg-gradient-from | --bg-gradient-to | --accent | --accent-hover | --card-shadow |
|------|---------------------|------------------|----------|----------------|---------------|
| 青绿（默认） | #0D9488 | #14B8A6 | #0D9488 | #0f766e | rgba(13,148,136,0.12) |
| 靛蓝 | #4338CA | #6366F1 | #6366F1 | #4f46e5 | rgba(99,102,241,0.12) |
| 紫罗兰 | #7C3AED | #8B5CF6 | #8B5CF6 | #7c3aed | rgba(139,92,246,0.12) |
| 珊瑚 | #EA580C | #F97316 | #F97316 | #ea580c | rgba(249,115,22,0.12) |
| 玫瑰 | #DB2777 | #EC4899 | #EC4899 | #db2777 | rgba(236,72,153,0.12) |
| 翠绿 | #059669 | #10B981 | #10B981 | #059669 | rgba(16,185,129,0.12) |

**注意：** 暗色模式配色保持统一，不随主题变化。

---

## 架构设计

### 数据结构

```typescript
interface Theme {
  id: string;           // 主题唯一标识
  name: string;         // 主题中文名称
  colors: {
    bgGradientFrom: string;
    bgGradientTo: string;
    accent: string;
    accentHover: string;
    cardShadow: string;
  };
}
```

### 状态管理

- **themeState**：当前选中的主题 ID
- **panelOpenState**：主题选择面板是否展开
- **持久化键**：`todolist-demo-theme`

### CSS 变量映射

主题切换通过更新根元素的 CSS 变量实现：

```css
:root[data-theme="teal"] {
  --bg-gradient-from: #0D9488;
  --bg-gradient-to: #14B8A6;
  --accent: #0D9488;
  /* ... */
}
```

---

## 组件设计

### ThemeSelector 组件

```
ThemeSelector
├── ThemeToggleButton (入口按钮)
└── ThemePanel (悬浮面板)
    ├── PanelHeader (标题)
    ├── ThemeGrid (主题色块网格)
    │   └── ThemeItem[] (6个)
    └── PanelBackdrop (点击外部关闭)
```

### Props 接口

```typescript
interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}
```

---

## 交互设计

### 切换流程

1. 用户点击主题选择器按钮
2. 面板淡入动画（200ms）
3. 用户点击主题色块
4. CSS 变量更新，应用新主题
5. 过渡动画（400ms）平滑切换
6. 面板自动关闭
7. 主题 ID 保存到 localStorage

### 过渡效果

- **面板显隐**：opacity + transform（200ms ease）
- **主题切换**：所有 CSS 变量同步过渡（400ms ease-out）
- **色块悬停**：scale 1.0 → 1.1（150ms ease）

### 键盘无障碍

- Tab 键聚焦主题选择器
- Enter/Space 打开面板
- Escape 关闭面板
- 方向键在主题间导航

---

## 验收标准

1. ✅ 点击按钮可打开/关闭主题选择面板
2. ✅ 点击面板外部可关闭面板
3. ✅ 6 个预设主题可正常切换
4. ✅ 主题切换有过渡动画
5. ✅ 刷新页面后主题偏好保持
6. ✅ 暗色模式切换按钮位置不变
7. ✅ 键盘可操作主题选择器
8. ✅ 暗色模式下主题面板显示正确
