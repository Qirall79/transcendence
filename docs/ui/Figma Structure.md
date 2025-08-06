# Figma Structure for ft_transcendence

## 1. Style Guide & Components
### 1.1 Design Tokens
- Colors
  - Primary Colors
  - Secondary Colors
  - Accent Colors
  - Neutral Colors
  - Success/Error/Warning Colors
- Typography
  - Headings (H1-H6)
  - Body Text
  - Button Text
  - Links
- Spacing System
- Shadows & Effects

### 1.2 Component Library
#### Basic Components
- Buttons
  - Primary Button
  - Secondary Button
  - Ghost Button
  - Icon Button
  - Loading State
  - Disabled State
- Input Fields
  - Text Input
  - Password Input
  - Search Bar
  - Dropdown
  - Checkbox
  - Radio Button
- Cards
  - User Card
  - Match Card
  - Tournament Card
  - Game Stats Card
- Navigation
  - Header
  - Footer
  - Sidebar
  - Navigation Bar
  - Breadcrumbs
- Modals & Popups
  - Alert Modal
  - Confirmation Modal
  - Settings Modal
  - Game Invitation Modal

#### Game-Specific Components
- Pong Game Elements
  - Paddles
  - Ball
  - Score Display
  - Game Controls
- Tournament Brackets
- Leaderboard
- Chat Components
  - Message Bubble
  - Chat Input
  - User Status Indicator

## 2. Page Layouts

### 2.1 Authentication Pages
#### Login Page
- 42 OAuth Login
- Email/Password Login
- 2FA Verification
- Password Recovery

#### Registration Page
- Sign Up Form
- Terms & Conditions
- Email Verification

### 2.2 Main Application Pages
#### Home (Public Landing Page)
- Hero Section
  - Welcome Message
  - Call-to-Action Buttons (Login/Register)
  - Feature Highlights
- About Section
  - Game Description
  - How to Play
  - Features Overview
- Tournament Section
  - Public Tournament Schedule
  - Recent Tournament Results
  - Leaderboard Preview
- Social Proof
  - Player Statistics
  - Active Players Count
  - Total Matches Played
- Footer
  - Navigation Links
  - Social Media Links
  - Terms & Privacy Links

#### Dashboard (Authenticated Users)
- Quick Actions Bar
  - Start New Game
  - Join Tournament
  - Challenge Friend
  - View Profile
- Game Statistics Panel
  - Win/Loss Ratio
  - Recent Performance
  - Rank Information
  - Achievement Progress
- Active Sessions
  - Current Tournaments
  - Live Matches
  - Friend Activities
- Personal Feed
  - Recent Matches
  - Friend Updates
  - Tournament Invitations
- Upcoming Events
  - Scheduled Matches
  - Tournament Deadlines
  - Friend Challenges
- Online Friends List
  - Status Indicators
  - Quick Challenge Options
  - Chat Shortcuts

#### Game Arena
- Game Canvas
  - Classic View
  - 3D View (if implementing Graphics module)
- Score Display
- Player Information
- Game Controls
- Spectator Mode
- Power-ups Display (if implementing Game Customization)

#### Tournament Pages
- Tournament List
  - Active Tournaments
  - Upcoming Tournaments
  - Past Tournaments
- Tournament Creation
- Tournament Bracket View
- Match Schedule
- Player Registration

#### Profile Pages
- User Profile
  - Personal Information
  - Avatar
  - Statistics
  - Achievement Badges
  - Match History
- Profile Edit
- Privacy Settings
- Security Settings

#### Social Features
- Friends List
  - Online/Offline Status
  - Recent Activities
  - Quick Actions
- Chat Interface
  - Direct Messages
  - Group Chats
  - Game Invitations
  - Notifications

### 2.3 Administrative Pages
#### Settings
- Account Settings
- Game Preferences
- Notification Settings
- Language Settings
- Privacy Controls
- 2FA Setup

#### Game History
- Match Details
- Tournament History
- Performance Statistics
- Replay Features

## 3. Responsive Layouts
### 3.1 Desktop (1920px)
- Full layouts for all pages
- Sidebar navigation
- Multi-column layouts

### 3.2 Tablet (768px)
- Adapted layouts
- Collapsed navigation
- Simplified game interface

### 3.3 Mobile (375px)
- Single column layouts
- Mobile navigation
- Touch-optimized controls
- Simplified game view

## 4. States & Interactions
### 4.1 Loading States
- Page loading
- Game loading
- Data fetching
- Tournament creation

### 4.2 Empty States
- No matches
- Empty chat
- No friends
- No tournaments

### 4.3 Error States
- Connection error
- Game error
- Authentication error
- Invalid input

### 4.4 Success States
- Match completion
- Tournament registration
- Friend request accepted
- Settings saved

## 5. Animations & Transitions
- Page transitions
- Game animations
- Loading animations
- Modal transitions
- Button hover states
- Navigation interactions

## 6. Dark/Light Mode
### 6.1 Light Theme
- All components in light mode
- Game interface light version
- Light mode specific assets

### 6.2 Dark Theme
- All components in dark mode
- Game interface dark version
- Dark mode specific assets


## Figma File Structure

```
📁 00 - INFO & DOCUMENTATION
   ├── 🔤 How to use this file
   ├── 🎨 Color reference
   └── 📐 Grid & Spacing guide

📁 01 - DESIGN TOKENS
   ├── 🎨 Colors
   ├── 🔤 Typography
   ├── 📐 Spacing
   ├── 💫 Effects
   └── 🎭 Themes

📁 02 - COMPONENTS
   ├── 🔘 Buttons
   ├── 📝 Inputs
   ├── 🃏 Cards
   └── 🎮 Game Elements

📁 03 - PATTERNS
   ├── 🧩 Navigation
   ├── 📋 Forms
   └── 🎮 Game Patterns

📁 04 - PAGES
   ├── 🏠 Landing
   ├── 🎮 Game
   └── 👤 Profile

📁 05 - PROTOTYPE
   └── 🔄 User Flows
```