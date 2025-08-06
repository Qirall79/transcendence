import React from 'react';

interface NotificationBadgeProps {
  count: number;
}

export function NotificationBadge({ count }: NotificationBadgeProps) {
  return (
    <div className="absolute -top-1 -right-1 w-5 h-5">
      <div className="absolute inset-0 animate-ping rounded-full bg-gaming-accent/50" />
      <div className="relative flex items-center justify-center w-full h-full rounded-full bg-gaming-accent text-xs font-medium text-white">
        {count}
      </div>
    </div>
  );
}