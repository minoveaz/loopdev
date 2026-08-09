import {
  initialSessionState,
  sessionReducer,
  superdevFixture,
} from '../src/auth/session';

describe('sessionReducer', () => {
  it('starts signed out', () => {
    expect(initialSessionState).toEqual({ status: 'signed-out', user: null });
  });

  it('authenticates superdev', () => {
    expect(sessionReducer(initialSessionState, { type: 'sign-in', user: superdevFixture })).toEqual({
      status: 'authenticated',
      user: superdevFixture,
    });
  });

  it('clears the user when the session expires', () => {
    const authenticated = sessionReducer(initialSessionState, {
      type: 'sign-in',
      user: superdevFixture,
    });

    expect(sessionReducer(authenticated, { type: 'expire' })).toEqual({
      status: 'expired',
      user: null,
    });
  });

  it('returns to signed out after logout', () => {
    const authenticated = sessionReducer(initialSessionState, {
      type: 'sign-in',
      user: superdevFixture,
    });

    expect(sessionReducer(authenticated, { type: 'sign-out' })).toEqual(initialSessionState);
  });
});