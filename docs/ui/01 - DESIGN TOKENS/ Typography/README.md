# Typography System

## Table of Contents
- [Overview](#overview)
- [Font Families](#font-families)
- [Type Scale](#type-scale)
- [Components](#components)
- [Usage Guidelines](#usage-guidelines)
- [Implementation](#implementation)
- [Responsive Design](#responsive-design)
- [Examples](#examples)

## Overview

This typography system is designed specifically for our gaming platform, balancing gaming aesthetics with clear readability and usability. It combines the modern, clean Outfit font for UI elements with the distinctive Audiowide font for gaming-specific displays.

## Font Families

### Primary Font: Outfit
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
font-family: 'Outfit', sans-serif;
```

**Usage:**
- Body text
- UI elements
- Navigation
- Form elements
- Buttons
- Descriptions

**Available Weights:**
- Regular (400): Primary body text
- Medium (500): Emphasized content, navigation
- Semibold (600): Sub-headers, important content
- Bold (700): Strong emphasis, crucial information

### Display Font: Audiowide
```css
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
font-family: 'Audiowide', cursive;
```

**Usage:**
- Headers
- Game scores
- Timers
- Player names
- Game-specific displays

## Type Scale

### Headers (Audiowide)

```css
/* H1: Main Game Titles, Welcome Screens */
.h1 {
    font-family: 'Audiowide', cursive;
    font-size: 48px;
    line-height: 60px;
    letter-spacing: 0.02em;
}

/* H2: Section Titles, Game Mode Headers */
.h2 {
    font-family: 'Audiowide', cursive;
    font-size: 40px;
    line-height: 52px;
    letter-spacing: 0.01em;
}

/* H3: Feature Headers, Modal Titles */
.h3 {
    font-family: 'Audiowide', cursive;
    font-size: 32px;
    line-height: 44px;
}

/* H4: Card Headers, Secondary Titles */
.h4 {
    font-family: 'Audiowide', cursive;
    font-size: 24px;
    line-height: 36px;
}

/* H5: Widget Titles */
.h5 {
    font-family: 'Audiowide', cursive;
    font-size: 20px;
    line-height: 32px;
}

/* H6: Small Titles */
.h6 {
    font-family: 'Audiowide', cursive;
    font-size: 16px;
    line-height: 28px;
}
```

### Body Text (Outfit)

```css
/* Body Large */
.body-large {
    font-family: 'Outfit', sans-serif;
    font-size: 18px;
    line-height: 28px;
    font-weight: 400;
}

/* Body Default */
.body-default {
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
}

/* Body Small */
.body-small {
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
}

/* Body XSmall */
.body-xsmall {
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
}
```

## Gaming-Specific Elements

```css
/* Score Display */
.score-display {
    font-family: 'Audiowide', cursive;
    font-size: 64px;
    line-height: 72px;
    letter-spacing: 0.04em;
}

/* Game Timer */
.game-timer {
    font-family: 'Audiowide', cursive;
    font-size: 32px;
    line-height: 40px;
    letter-spacing: 0.03em;
}

/* Player Names */
.player-name {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    line-height: 28px;
    font-weight: 600;
    letter-spacing: 0.02em;
}

/* Game Stats */
.game-stats {
    font-family: 'Audiowide', cursive;
    font-size: 24px;
    line-height: 32px;
    letter-spacing: 0.03em;
}
```

## Interactive Elements

```css
/* Button Text */
.button-text {
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
}

/* Navigation Links */
.nav-link {
    font-family: 'Outfit', sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
}

/* Status Labels */
.status-label {
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
```

## Usage Guidelines

### Best Practices

1. **Hierarchy**
   - Use proper heading levels (H1-H6) sequentially
   - Don't skip heading levels
   - Maintain consistent spacing between elements

2. **Readability**
   - Ensure sufficient contrast with backgrounds
   - Maintain proper line length (45-75 characters)
   - Use appropriate line height for content length

3. **Gaming Elements**
   - Use Audiowide for game-specific displays
   - Ensure scores and timers are highly visible
   - Maintain consistent styling across similar elements

4. **Responsiveness**
   - Scale text appropriately for different screen sizes
   - Maintain minimum font sizes for readability
   - Adjust line heights as needed

### Common Combinations

```css
/* Game Section Header */
.game-section {
    /* Title */
    h2 {
        font-family: 'Audiowide', cursive;
        font-size: 40px;
        line-height: 52px;
        margin-bottom: 16px;
    }
    
    /* Description */
    p {
        font-family: 'Outfit', sans-serif;
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 24px;
    }
}

/* Game Card */
.game-card {
    /* Card Title */
    h3 {
        font-family: 'Audiowide', cursive;
        font-size: 24px;
        line-height: 36px;
        margin-bottom: 8px;
    }
    
    /* Stats */
    .stats {
        font-family: 'Outfit', sans-serif;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
    }
}
```

## Implementation

### CSS Integration

1. Import fonts in your main CSS file:
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Audiowide&display=swap');
```

2. Set up CSS variables for consistent usage:
```css
:root {
    --font-primary: 'Outfit', sans-serif;
    --font-display: 'Audiowide', cursive;
    
    --h1-size: 48px;
    --h2-size: 40px;
    --h3-size: 32px;
    --h4-size: 24px;
    --h5-size: 20px;
    --h6-size: 16px;
    
    --body-large: 18px;
    --body-default: 16px;
    --body-small: 14px;
    --body-xsmall: 12px;
}
```

### React Component Example

```jsx
// Typography components
const H1 = ({ children, className = '' }) => (
    <h1 className={`font-audiowide text-5xl leading-tight ${className}`}>
        {children}
    </h1>
);

const BodyText = ({ children, className = '' }) => (
    <p className={`font-outfit text-base leading-normal ${className}`}>
        {children}
    </p>
);

const GameScore = ({ score, className = '' }) => (
    <div className={`font-audiowide text-6xl leading-none ${className}`}>
        {score}
    </div>
);
```

## Responsive Design

### Breakpoints

```css
/* Mobile (320px - 639px) */
@media (max-width: 639px) {
    :root {
        --h1-size: 32px;
        --h2-size: 28px;
        --h3-size: 24px;
        --h4-size: 20px;
        --h5-size: 18px;
        --h6-size: 16px;
    }
}

/* Tablet (640px - 1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
    :root {
        --h1-size: 40px;
        --h2-size: 32px;
        --h3-size: 28px;
        --h4-size: 24px;
        --h5-size: 20px;
        --h6-size: 16px;
    }
}
```

### Performance Considerations

1. **Font Loading**
   - Use font-display: swap
   - Consider preloading critical fonts
   - Implement progressive font loading

2. **Optimization**
   - Use subset fonts when possible
   - Implement proper caching
   - Consider local font fallbacks

## Examples

### Game Interface
```jsx
<div className="game-interface">
    <h1 className="game-title">Pong Masters</h1>
    <div className="score-board">
        <div className="player-score">1234</div>
        <div className="timer">02:45</div>
        <div className="opponent-score">0987</div>
    </div>
    <div className="game-status">
        <span className="status-label">Current Level</span>
        <span className="level-display">05</span>
    </div>
</div>
```

### Menu Screen
```jsx
<div className="menu-screen">
    <h2 className="menu-title">Game Modes</h2>
    <div className="mode-list">
        <div className="mode-item">
            <h3 className="mode-name">Classic Mode</h3>
            <p className="mode-description">
                Experience the original gameplay
            </p>
        </div>
    </div>
</div>
```