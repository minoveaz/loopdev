export type SessionStatus = 'signed-out' | 'loading' | 'authenticated' | 'expired';

export type MobileUser = {
  id: string;
  username: string;
  displayName: string;
  isGlobalAdmin: boolean;
};

export type SessionState = {
  status: SessionStatus;
  user: MobileUser | null;
};

export type SessionAction =
  | { type: 'start' }
  | { type: 'sign-in'; user: MobileUser }
  | { type: 'expire' }
  | { type: 'sign-out' };

export const initialSessionState: SessionState = {
  status: 'signed-out',
  user: null,
};

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'start':
      return { status: 'loading', user: null };
    case 'sign-in':
      return { status: 'authenticated', user: action.user };
    case 'expire':
      return { status: 'expired', user: null };
    case 'sign-out':
      return initialSessionState;
    default:
      return state;
  }
}

export const superdevFixture: MobileUser = {
  id: 'user-superdev',
  username: 'superdev',
  displayName: 'SuperDev',
  isGlobalAdmin: true,
};

export function mobileUserFromSupabase(user: {
  id: string;
  email?: string | null;
  user_metadata?: { display_name?: string; full_name?: string; username?: string };
  app_metadata?: Record<string, unknown>;
}): MobileUser {
  const displayName =
    user.user_metadata?.display_name ??
    user.user_metadata?.full_name ??
    user.email ??
    'Usuario LoopDev';
  const username = user.user_metadata?.username ?? user.email?.split('@')[0] ?? user.id;
  return { id: user.id, username, displayName, isGlobalAdmin: user.app_metadata?.is_global_admin === true };
}
