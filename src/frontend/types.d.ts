// ----------------------------------------------------------- //
// --------------------- User types -------------------------- //
// ----------------------------------------------------------- //

export interface IUser {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  picture: string;
  picture_last_updated: string | null;
  username_last_updated: string | null;
  password_last_updated: string | null;
  provider: "google" | "42" | null;
  two_factor_enabled: boolean;
  otp_url: string;
  unseen_notifications_count: number;
  friends: IUser[];
  blocked_by: IUser[];
  blocked_users: IUser[];
  invited_users: IUser[];
  invited_by: IUser[];
  wins: number;
  games_played: number;
  total_score: number;
}

export interface IProfile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  picture: string;
  is_friend: boolean;
  is_blocked: boolean;
  invite: number;
  error?: string;
  game_invite: number;
}

export interface INotification {
  id: number;
  message: string;
  created_at: Date;
  seen: boolean;
  link: string;
}

