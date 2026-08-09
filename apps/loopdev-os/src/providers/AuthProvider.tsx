'use client';

import { createContext, useEffect, useRef, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { OrganizationMembershipSchema, type OrganizationMembership } from '@loopdev/contracts';

const isE2EAuthBypassEnabled = process.env.NEXT_PUBLIC_E2E_AUTH_BYPASS === 'true';
const e2eUser = {
  id: 'e2e-user',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'e2e@loopdev.test',
} as User;
const e2eSession = {
  access_token: 'e2e-access-token',
  refresh_token: 'e2e-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: e2eUser,
} as Session;
const e2eMembership = {
  organizationId: 'e2e-organization',
  userId: 'e2e-user',
  role: 'owner',
  status: 'active',
  createdAt: '2026-01-01T00:00:00.000Z',
} as OrganizationMembership;

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  memberships: OrganizationMembership[];
  isPlatformAdministrator: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inicializa Supabase solo una vez, fuera del componente
let supabaseInstance: ReturnType<typeof createClient> | null = null;
const getSupabaseInstance = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient();
  }
  return supabaseInstance;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(isE2EAuthBypassEnabled ? e2eUser : null);
  const [session, setSession] = useState<Session | null>(isE2EAuthBypassEnabled ? e2eSession : null);
  const [memberships, setMemberships] = useState<OrganizationMembership[]>(
    isE2EAuthBypassEnabled ? [e2eMembership] : [],
  );
  const [isPlatformAdministrator, setIsPlatformAdministrator] = useState(isE2EAuthBypassEnabled);
  const [isLoading, setIsLoading] = useState(!isE2EAuthBypassEnabled);

  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const supabase = getSupabaseInstance();

  useEffect(() => {
    if (isE2EAuthBypassEnabled) return;

    pathnameRef.current = pathname;
  }, [pathname]);

  const loadMemberships = async (userId: string | undefined) => {
    if (!userId) {
      setMemberships([]);
      return;
    }

    const { data, error } = await supabase
      .from('organization_memberships')
      .select('organization_id, user_id, role, status, created_at')
      .eq('user_id', userId);

    if (error) {
      // The Platform Core migration is deployed through CI first. Until it is
      // applied to the remote project, authentication must remain usable.
      console.warn('Memberships are not available yet:', error.message);
      setMemberships([]);
      return;
    }

    const parsedMemberships = (data ?? [])
      .map((row) =>
        OrganizationMembershipSchema.safeParse({
          organizationId: row.organization_id,
          userId: row.user_id,
          role: row.role,
          status: row.status,
          createdAt: row.created_at,
        }),
      )
      .flatMap((result) => (result.success ? [result.data] : []));

    setMemberships(parsedMemberships);
  };

  const loadPlatformAdministrator = async (userId: string | undefined) => {
    if (!userId) {
      setIsPlatformAdministrator(false);
      return;
    }
    const { data, error } = await supabase.rpc('is_platform_administrator');
    setIsPlatformAdministrator(!error && data === true);
  };

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // Obtener sesión inicial de forma no bloqueante
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          await loadMemberships(initialSession?.user.id);
          await loadPlatformAdministrator(initialSession?.user.id);
          setIsLoading(false);
        }

        const syncSession = async () => {
          const {
            data: { session: currentSession },
          } = await supabase.auth.getSession();
          if (!isMounted) return;

          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          await loadMemberships(currentSession?.user.id);
          await loadPlatformAdministrator(currentSession?.user.id);
          if (!isMounted) return;

          if (currentSession && pathnameRef.current === '/login') {
            router.push('/launchpad');
          }
        };

        // Listener de cambios de auth
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (isMounted) {
            setSession(session);
            setUser(session?.user ?? null);
            await loadMemberships(session?.user.id);
            await loadPlatformAdministrator(session?.user.id);
            if (!isMounted) return;
            setIsLoading(false);

            // Protección de Rutas (Middleware Client-Side Backup)
            if (event === 'SIGNED_OUT') {
              router.push('/login');
            } else if (event === 'SIGNED_IN' && pathnameRef.current === '/login') {
              router.push('/launchpad');
            }
          }
        });

        window.addEventListener('focus', syncSession);
        document.addEventListener('visibilitychange', syncSession);

        return () => {
          subscription?.unsubscribe();
          window.removeEventListener('focus', syncSession);
          document.removeEventListener('visibilitychange', syncSession);
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();

    return () => {
      isMounted = false;
      cleanup?.then((unsub) => unsub?.());
    };
  }, [router, supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const value = {
    user,
    session,
    memberships,
    isPlatformAdministrator,
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
