export type SessionStatus = 'signed-out' | 'loading' | 'authenticated' | 'expired';

export type MobileUser = {
  id: string;
  username: 'superdev';
  displayName: string;
  isGlobalAdmin: true;
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