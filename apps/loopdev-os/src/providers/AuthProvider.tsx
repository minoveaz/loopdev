'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { OrganizationMembershipSchema, type OrganizationMembership } from '@loopdev/contracts';

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([]);
  const [isPlatformAdministrator, setIsPlatformAdministrator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabaseInstance();

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
    if (!userId) { setIsPlatformAdministrator(false); return; }
    const { data, error } = await supabase
      .from('platform_administrators')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    setIsPlatformAdministrator(!error && Boolean(data));
  };

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // Obtener sesión inicial de forma no bloqueante
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          await loadMemberships(initialSession?.user.id);
          await loadPlatformAdministrator(initialSession?.user.id);
          setIsLoading(false);
        }

        // Listener de cambios de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (isMounted) {
              setIsLoading(true);
              setSession(session);
              setUser(session?.user ?? null);
              await loadMemberships(session?.user.id);
              await loadPlatformAdministrator(session?.user.id);
              if (!isMounted) return;
              setIsLoading(false);

              // Protección de Rutas (Middleware Client-Side Backup)
              if (event === 'SIGNED_OUT') {
                router.push('/login');
              } else if (event === 'SIGNED_IN' && pathname === '/login') {
                router.push('/launchpad');
              }
            }
          }
        );

        return () => {
          subscription?.unsubscribe();
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
      cleanup?.then(unsub => unsub?.());
    };
  }, [router, pathname, supabase]);

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
