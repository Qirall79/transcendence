# Color System

## Table of Contents
- [Overview](#overview)
- [Color Palette](#color-palette)
  - [Primary Colors](#primary-colors)
  - [Secondary Colors](#secondary-colors)
  - [Neutral Colors](#neutral-colors)
  - [Semantic Colors](#semantic-colors)
- [Usage Guidelines](#usage-guidelines)
- [Implementation](#implementation)
- [Dark Mode](#dark-mode)
- [Accessibility](#accessibility)
- [Examples](#examples)

## Overview

Our color system is designed to create engaging, accessible gaming experiences while maintaining professional UI standards. The palette combines vibrant gaming aesthetics with practical interface colors.

## Color Palette

### Primary Colors

Primary colors form the core of our brand identity and are used for main UI elements.

```css
:root {
    /* Primary Colors */
    --primary-900: #0A2540;
    --primary-800: #1A365D;
    --primary-700: #2A4A7F;
    --primary-600: #3B5EA0;
    --primary-500: #4C72C2; /* Main Brand Color */
    --primary-400: #6D8ACE;
    --primary-300: #8EA2DA;
    --primary-200: #AFBAE6;
    --primary-100: #D0D2F2;
    --primary-50:  #F0F2FF;
}
```

**Usage Guidelines:**

- **Primary-900 (#0A2540)**
  - Main dark backgrounds
  - Deep shadows
  - Highest contrast text
  - Primary navigation in dark mode
  - Header backgrounds

- **Primary-800 (#1A365D)**
  - Secondary dark backgrounds
  - Hover states in dark mode
  - Deep accents in the interface

- **Primary-700 (#2A4A7F)**
  - Active states
  - Important UI elements
  - Section headers

- **Primary-600 (#3B5EA0)**
  - Primary buttons
  - Key interactive elements
  - Focus states

- **Primary-500 (#4C72C2)**
  - Primary accent color
  - Call-to-action buttons
  - Primary links

- **Primary-400 to 50**
  - Supporting UI elements
  - Background variations
  - Hover and disabled states

### Secondary Colors (Accent)

Secondary colors provide accent and emphasis to complement the primary palette.

```css
:root {
    /* Secondary Colors */
    --secondary-900: #2D0A40;
    --secondary-800: #421A5D;
    --secondary-700: #572A7F;
    --secondary-600: #6C3BA0;
    --secondary-500: #814CC2; /* Secondary Brand */
    --secondary-400: #976DCE;
    --secondary-300: #AD8EDA;
    --secondary-200: #C3AFE6;
    --secondary-100: #D9D0F2;
    --secondary-50:  #F4F0FF;
}
```

**Usage Guidelines:**

- **Secondary-900 (#2D0A40)**
  - Deep accent backgrounds
  - Secondary navigation in dark mode
  - Modal overlays

- **Secondary-500 (#814CC2)**
  - Main accent color
  - Secondary CTAs
  - Decorative elements

### Neutral Colors

Neutral colors provide balance and structure to the interface.

```css
:root {
    /* Neutral Colors */
    --neutral-900: #1A1A1A;
    --neutral-800: #333333;
    --neutral-700: #4D4D4D;
    --neutral-600: #666666;
    --neutral-500: #808080;
    --neutral-400: #999999;
    --neutral-300: #B3B3B3;
    --neutral-200: #CCCCCC;
    --neutral-100: #E6E6E6;
    --neutral-50:  #F5F5F5;
}
```

**Usage Guidelines:**

- **Text Hierarchy:**
  - Primary text: Neutral-900
  - Secondary text: Neutral-800
  - Body text: Neutral-700
  - Disabled text: Neutral-500

- **UI Elements:**
  - Borders: Neutral-500
  - Dividers: Neutral-200
  - Backgrounds: Neutral-50 to 100

### Semantic Colors

Colors that convey specific meanings and states.

```css
:root {
    /* Semantic Colors */
    --success: #10B981;
    --error: #EF4444;
    --warning: #F59E0B;
    --info: #3B82F6;
}
```

**Usage:**
- Success (#10B981): Positive actions, completion states
- Error (#EF4444): Error messages, destructive actions
- Warning (#F59E0B): Cautionary states, important notices
- Info (#3B82F6): Information messages, help text

## Implementation

### CSS Variables Setup

```css
/* Root Variables */
:root {
    /* Primary Colors */
    --primary-900: #0A2540;
    --primary-800: #1A365D;
    /* ... other primary colors ... */

    /* Secondary Colors */
    --secondary-900: #2D0A40;
    --secondary-800: #421A5D;
    /* ... other secondary colors ... */

    /* Neutral Colors */
    --neutral-900: #1A1A1A;
    --neutral-800: #333333;
    /* ... other neutral colors ... */

    /* Semantic Colors */
    --success: #10B981;
    --error: #EF4444;
    --warning: #F59E0B;
    --info: #3B82F6;
}
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0A2540',
          800: '#1A365D',
          700: '#2A4A7F',
          600: '#3B5EA0',
          500: '#4C72C2',
          400: '#6D8ACE',
          300: '#8EA2DA',
          200: '#AFBAE6',
          100: '#D0D2F2',
          50: '#F0F2FF',
        },
        secondary: {
          900: '#2D0A40',
          800: '#421A5D',
          700: '#572A7F',
          600: '#6C3BA0',
          500: '#814CC2',
          400: '#976DCE',
          300: '#AD8EDA',
          200: '#C3AFE6',
          100: '#D9D0F2',
          50: '#F4F0FF',
        },
        neutral: {
          900: '#1A1A1A',
          800: '#333333',
          700: '#4D4D4D',
          600: '#666666',
          500: '#808080',
          400: '#999999',
          300: '#B3B3B3',
          200: '#CCCCCC',
          100: '#E6E6E6',
          50: '#F5F5F5',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
    },
  },
};
```

## Dark Mode

### Dark Mode Color Mappings

```css
/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    /* Background colors */
    --background-primary: var(--primary-900);
    --background-secondary: var(--primary-800);
    
    /* Text colors */
    --text-primary: var(--neutral-50);
    --text-secondary: var(--neutral-200);
    
    /* Interactive elements */
    --button-primary: var(--primary-600);
    --button-hover: var(--primary-700);
  }
}
```

## Accessibility

### Color Contrast Guidelines

- All text colors must maintain a minimum contrast ratio of:
  - 4.5:1 for normal text
  - 3:1 for large text (18px+ or 14px+ bold)
  - 3:1 for UI components and graphical objects

### Recommended Combinations

```css
/* High-contrast text combinations */
.text-high-contrast {
    background-color: var(--primary-900);
    color: var(--neutral-50);
}

/* Button combinations */
.button-primary {
    background-color: var(--primary-500);
    color: white;
}

.button-secondary {
    background-color: var(--secondary-500);
    color: white;
}
```