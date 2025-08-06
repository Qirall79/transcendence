# **P0000NG** Gaming Platform - Frontend Architecture Document

## 1. Overview

**P0000NG** is a modern web-based gaming platform built with React, TypeScript, and Tailwind CSS. The application provides a social gaming experience with features including user authentication, friend management, real-time communication, and multiple playable games.

### 1.1. Application Architecture Diagram

The following diagram illustrates the high-level architecture of the **P0000NG** frontend application:

![mermaid-diagram-2025-03-18-023715](https://github.com/user-attachments/assets/257a9d4e-ccd6-458f-aad6-892ef379a731)


## 2. Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Context API
- **Real-time Communication**: WebSockets
- **Form Handling**: React Hook Form
- **UI Notifications**: React Hot Toast
- **Data Visualization**: Recharts
- **HTTP Requests**: Custom Fetcher utility

## 3. Application Structure

### 3.1. Core Architecture

The application follows a component-based architecture organized into the following main directories:

```
src/
  ├── actions/       # API communication functions
  ├── assets/        # Static assets
  ├── components/    # Reusable UI components
  ├── contexts/      # React context providers
  ├── hooks/         # Custom React hooks
  ├── lib/           # Utility libraries
  ├── pages/         # Page components
  ├── providers/     # Service providers
  ├── utils/         # Utility functions
  └── App.tsx        # Main application component
```

### 3.3. Component Hierarchy

The application's component hierarchy shows how components are nested and organized:

![mermaid-diagram-2025-03-18-025630](https://github.com/user-attachments/assets/8b144ff1-d1c5-4512-82a0-aaabe01771db)

### 3.4. Routing Structure

The application uses React Router with a nested route structure:

- **Public Routes**:
  - `/` - Landing page
  - `/about` - About the platform
  - `/auth/*` - Authentication routes

- **Protected Routes** (under `/dashboard`):
  - `/dashboard` - User dashboard
  - `/dashboard/profile` - User profile
  - `/dashboard/settings` - User settings
  - `/dashboard/users/:id` - View other users
  - `/dashboard/games/*` - Games hub
  - `/dashboard/games/ping_pong/*` - Ping Pong game variations
  - `/dashboard/games/tictactoe/*` - Tic Tac Toe game variations
  - `/dashboard/chat` - Messaging system
  - `/dashboard/friends` - Friend management

## 4. State Management

### 4.1. State Management Flow

The application uses React Context API and custom hooks for state management:

![mermaid-diagram-2025-03-18-031533](https://github.com/user-attachments/assets/5b45baf3-aac2-4a59-9c53-ee9416d9bff5)

### 4.2. Context API Usage

The application relies heavily on React Context API for state management:

- **AuthContext**: Manages user authentication state
- **NotificationContext**: Handles real-time notifications
- **RequestsContext**: Manages friend requests
- **FriendsContext**: Manages friends list
- **ConversationsContext**: Manages chat conversations

### 4.3. Custom Hooks

Custom hooks encapsulate business logic and provide a clean interface:

- `useUser()`: Access and manage user data
- `useFriends()`: Access and manage friends list
- `useRequests()`: Access and manage friend requests
- `useConversations()`: Access and manage chat conversations
- `useNotifications()`: Access and manage notifications
- `useProfile()`: Access and manage profile data

## 5. Authentication System

### 5.1. Authentication Flow

The authentication flow includes login, registration, and token refresh mechanisms:

![mermaid-diagram-2025-03-18-031816](https://github.com/user-attachments/assets/79aa3ec4-ed70-427b-9aca-efd7d07b552f)

### 5.2. Features

- User registration with email verification
- Login with credentials or OAuth (Google, 42)
- Two-factor authentication
- Password reset functionality
- Session management with refresh tokens

## 6. Real-time Communication

### 6.1. WebSocket Communication Flow

WebSockets enable real-time features in games, chat, and notifications:

![mermaid-diagram-2025-03-18-032012](https://github.com/user-attachments/assets/c489772e-128d-4ac1-a2f3-8132191335d7)

### 6.2. Social Communication

WebSockets also power social features:

- Chat messages
- Friend status updates
- Notifications
- Game invitations

## 7. Game Implementation

### 7.1. Game Components Structure

The application includes multiple games with their component structures:

![mermaid-diagram-2025-03-18-032349](https://github.com/user-attachments/assets/0679ed76-cf61-46b0-8875-55b2110f756e)



### 7.2. Ping Pong

- Canvas-based rendering
- Physics simulation
- Multiple game modes (local, online, tournament)
- Real-time multiplayer
- Score tracking and match history

### 7.3. Tic Tac Toe

- Grid-based game board
- Turn-based gameplay
- Online matchmaking
- Game history and statistics
- Victory detection

## 8. API Communication

### 8.1. Fetcher Utility

A custom `Fetcher` class handles all HTTP communication with automatic token refresh:

- `Fetcher.get()`: HTTP GET requests
- `Fetcher.post()`: HTTP POST requests
- `Fetcher.put()`: HTTP PUT requests
- `Fetcher.delete()`: HTTP DELETE requests
- `Fetcher.refresh()`: Token refresh

### 8.2. Action Functions

Action functions encapsulate API calls for specific domains:

- `userActions.ts`: User-related API calls
- `chatActions.ts`: Chat-related API calls
- `gameActions.ts`: Game-related API calls
- `tournamentActions.ts`: Tournament-related API calls
- `notificationActions.ts`: Notification-related API calls

## 9. UI Design

### 9.1. Design System

The application uses a dark-themed gaming aesthetic with:

- Dark backgrounds (#000000, #090909)
- Accent colors for different games and features
- Consistent border styles and hover effects
- Game-specific color schemes

### 9.2. Responsive Design

The UI is responsive across device sizes:

- Mobile-first approach
- Flexible layouts using Flexbox and Grid
- Responsive navigation with mobile-friendly sidebar
- Adaptive game interfaces

## 10. Key Features

### 10.1. Social Features

- Friend requests and management
- Real-time chat system
- User profiles with game statistics
- Block/unblock users

### 10.2. Game Platform

- Multiple game options:
  - Ping Pong (local, online, tournament modes)
  - Tic Tac Toe (local, online modes)
- Real-time multiplayer using WebSockets
- Game matchmaking and invitations
- Tournament system
- Leaderboards and statistics

## 11. Technical Challenges & Solutions

### 11.1. Real-time Synchronization

- **Challenge**: Maintaining game state across clients
- **Solution**: WebSocket protocol with server-side state management

### 11.2. Authentication & Security

- **Challenge**: Secure user authentication and session management
- **Solution**: JWT authentication with refresh tokens and optional 2FA

### 11.3. Game Physics

- **Challenge**: Implementing realistic game physics
- **Solution**: Canvas-based rendering with custom physics calculations

### 11.4. Error Handling

- **Challenge**: Graceful handling of connection issues
- **Solution**: Reconnection logic, loading states, and user feedback

## 12. Future Enhancements

### 12.1. Potential Improvements

- Additional games (Snake, Rock Paper Scissors)
- Enhanced tournament system
- Advanced matchmaking algorithms
- Spectator mode for games
- Achievement system


## 13. Conclusion

The **P0000NG** gaming platform represents a comprehensive React application that successfully integrates real-time gameplay, social features, and user management. The architecture follows modern React best practices with a clean separation of concerns through contexts, custom hooks, and reusable components. The WebSocket integration enables smooth real-time experiences, while the responsive UI provides a consistent experience across devices.
