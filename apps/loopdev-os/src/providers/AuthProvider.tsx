'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
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
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();
  const supabase = getSupabaseInstance();

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // Obtener sesión inicial de forma no bloqueante
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setIsLoading(false);
        }

        // Listener de cambios de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (isMounted) {
              setSession(session);
              setUser(session?.user ?? null);

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
    isLoading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
