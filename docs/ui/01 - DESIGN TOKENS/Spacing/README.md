# Spacing System

## Table of Contents
- [Overview](#overview)
- [Base Unit](#base-unit)
- [Spacing Scale](#spacing-scale)
- [Usage Guidelines](#usage-guidelines)
- [Layout Patterns](#layout-patterns)
- [Component Spacing](#component-spacing)
- [Responsive Spacing](#responsive-spacing)
- [Implementation](#implementation)

## Overview

Our spacing system is built on a consistent 4px base unit, creating a harmonious visual rhythm throughout the platform. This system ensures:
- Consistent spacing between elements
- Responsive layouts that scale well
- Easy-to-maintain spacing relationships
- Clear visual hierarchy

## Base Unit

The foundation of our spacing system is 4 pixels (0.25rem).

```css
:root {
    --spacing-unit: 4px;
}
```

## Spacing Scale

Our spacing scale multiplies the base unit (4px) to create consistent increments:

```css
:root {
    /* Core Spacing Scale */
    --space-0: 0;                    /* 0px    - No spacing */
    --space-1: calc(var(--spacing-unit) * 1);    /* 4px    - Micro spacing */
    --space-2: calc(var(--spacing-unit) * 2);    /* 8px    - Tiny spacing */
    --space-3: calc(var(--spacing-unit) * 3);    /* 12px   - Small spacing */
    --space-4: calc(var(--spacing-unit) * 4);    /* 16px   - Default spacing */
    --space-5: calc(var(--spacing-unit) * 5);    /* 20px   - Medium spacing */
    --space-6: calc(var(--spacing-unit) * 6);    /* 24px   - Large spacing */
    --space-8: calc(var(--spacing-unit) * 8);    /* 32px   - Extra large spacing */
    --space-10: calc(var(--spacing-unit) * 10);  /* 40px   - 2x large spacing */
    --space-12: calc(var(--spacing-unit) * 12);  /* 48px   - 3x large spacing */
    --space-16: calc(var(--spacing-unit) * 16);  /* 64px   - 4x large spacing */
    --space-20: calc(var(--spacing-unit) * 20);  /* 80px   - Section spacing */
    --space-24: calc(var(--spacing-unit) * 24);  /* 96px   - Container spacing */
}
```

### Usage Contexts

#### Micro Spacing (4px - 8px)
- Icon padding
- Small button padding
- Minimal element separation
- Badge padding

```css
.badge {
    padding: var(--space-1) var(--space-2);
}

.icon-button {
    padding: var(--space-2);
}
```

#### Small Spacing (12px - 16px)
- Form element padding
- List item spacing
- Button padding
- Card content padding

```css
.form-input {
    padding: var(--space-3);
    margin-bottom: var(--space-4);
}

.list-item {
    margin-bottom: var(--space-3);
}
```

#### Medium Spacing (20px - 32px)
- Section padding
- Component spacing
- Grid gaps
- Card padding

```css
.card {
    padding: var(--space-6);
    margin-bottom: var(--space-8);
}

.grid {
    gap: var(--space-5);
}
```

#### Large Spacing (40px - 96px)
- Page sections
- Major layout divisions
- Hero sections
- Large component separation

```css
.section {
    padding: var(--space-16) 0;
}

.hero {
    margin-bottom: var(--space-24);
}
```

## Layout Patterns

### Grid System
```css
.grid-container {
    display: grid;
    gap: var(--space-4);
    padding: var(--space-6);
}

/* Common grid patterns */
.grid-2-columns {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
}

.grid-3-columns {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
}
```

### Flexbox Layouts
```css
.flex-container {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-6);
}

.flex-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}
```

## Component Spacing

### Game Cards
```css
.game-card {
    padding: var(--space-6);
    margin-bottom: var(--space-8);
}

.game-card__header {
    margin-bottom: var(--space-4);
}

.game-card__content {
    margin-bottom: var(--space-6);
}

.game-card__footer {
    padding-top: var(--space-4);
}
```

### Navigation
```css
.nav {
    padding: var(--space-4) var(--space-6);
}

.nav-item {
    padding: var(--space-2) var(--space-4);
    margin-right: var(--space-4);
}
```

### Forms
```css
.form-group {
    margin-bottom: var(--space-6);
}

.form-label {
    margin-bottom: var(--space-2);
}

.form-input {
    padding: var(--space-3);
    margin-bottom: var(--space-4);
}

.form-helper {
    margin-top: var(--space-2);
}
```

## Responsive Spacing

### Breakpoint-Specific Spacing
```css
/* Mobile First Approach */
.section {
    padding: var(--space-6);
}

/* Tablet (640px and up) */
@media (min-width: 40em) {
    .section {
        padding: var(--space-8);
    }
}

/* Desktop (1024px and up) */
@media (min-width: 64em) {
    .section {
        padding: var(--space-16);
    }
}
```

## Implementation

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },
    },
  },
};
```

### Component Examples

#### Game Interface
```jsx
<div className="game-interface">
    {/* Header with large spacing */}
    <header className="mb-16 p-6">
        <h1 className="mb-4">Game Title</h1>
        <nav className="space-x-4">
            {/* Navigation items */}
        </nav>
    </header>

    {/* Main game area with medium spacing */}
    <main className="p-8">
        <div className="game-container mb-8">
            {/* Game content */}
        </div>

        {/* Controls with consistent spacing */}
        <div className="controls space-y-4">
            <button className="p-4">Action</button>
            <button className="p-4">Settings</button>
        </div>
    </main>

    {/* Footer with standardized spacing */}
    <footer className="mt-12 p-6">
        {/* Footer content */}
    </footer>
</div>
```

#### Game Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
    <div className="game-card p-6">
        <h3 className="mb-4">Game Title</h3>
        <p className="mb-6">Description</p>
        <button className="p-4">Play Now</button>
    </div>
    {/* Additional cards */}
</div>
```

## Best Practices

1. **Consistency**
   - Always use the spacing scale variables
   - Maintain consistent spacing patterns within similar components
   - Use appropriate spacing for different screen sizes

2. **Hierarchy**
   - Use larger spacing for major sections
   - Use smaller spacing for related elements
   - Maintain clear visual grouping through spacing

3. **Responsiveness**
   - Adjust spacing based on screen size
   - Use relative units when appropriate
   - Test spacing across all breakpoints

4. **Component Structure**
   - Use consistent padding within components
   - Maintain consistent margins between components
   - Follow established spacing patterns for similar components

---

For additional guidance or specific use cases, please refer to the design system documentation or contact the design team.