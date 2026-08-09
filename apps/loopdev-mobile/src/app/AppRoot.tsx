import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { initialSessionState, mobileUserFromSupabase, sessionReducer } from '../auth/session';
import { createSupabaseMobileClient } from '../data/adapters/supabase/client';
import { signInWithSupabase, signOutFromSupabase } from '../data/adapters/supabase/home';
import { createHomeDataSource } from '../data/data-source';
import { clearActiveOrganizationId, loadActiveOrganizationId, saveActiveOrganizationId } from '../data/organization-context';
import { useHomeData } from '../data/home-data';
import { ActivityScreen } from '../features/activity/screens/ActivityScreen';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { NotificationsScreen } from '../features/notifications/screens/NotificationsScreen';
import { OrganizationsScreen } from '../features/organizations/screens/OrganizationsScreen';
import { OrganizationSwitcher } from '../features/organizations/components/OrganizationSwitcher';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { ThemeProvider, useTheme } from '../theme/ThemeProvider';

type Tab = 'home' | 'activity' | 'notifications' | 'organizations' | 'profile';
const tabs: { key: Tab; label: string }[] = [
  { key: 'home', label: 'Inicio' },
  { key: 'activity', label: 'Actividad' },
  { key: 'notifications', label: 'Avisos' },
  { key: 'organizations', label: 'Organizaciones' },
  { key: 'profile', label: 'Perfil' },
];

export default function AppRoot() {
  const [fontsLoaded] = useFonts({
    Inter: Inter_400Regular,
    'JetBrains Mono': JetBrainsMono_400Regular,
  });
  if (!fontsLoaded) return null;
  return <ThemeProvider><ThemedAppRoot /></ThemeProvider>;
}

function ThemedAppRoot() {
  const { colors: themeColors, mode, toggleMode } = useTheme();
  const [session, dispatch] = useReducer(sessionReducer, initialSessionState);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [activeOrganizationId, setActiveOrganizationId] = useState<string | null>(null);
  const dataSource = useMemo(
    () => (session.status === 'authenticated' ? createHomeDataSource('supabase') : undefined),
    [session.status],
  );
  const homeData = useHomeData(dataSource, activeOrganizationId ?? undefined);
  useEffect(() => {
    if (session.status !== 'authenticated' || homeData.status !== 'success' || homeData.organizations.length === 0) return;
    let active = true;
    loadActiveOrganizationId().then((storedId) => {
      if (!active) return;
      const storedOrganization = homeData.organizations.find(({ id }) => id === storedId);
      const nextId = storedOrganization?.id ?? homeData.organizations[0].id;
      setActiveOrganizationId(nextId);
      void saveActiveOrganizationId(nextId);
    });
    return () => { active = false; };
  }, [homeData.organizations, homeData.status, session.status]);
  const selectOrganization = (organizationId: string) => {
    setActiveOrganizationId(organizationId);
    void saveActiveOrganizationId(organizationId);
  };
  useEffect(() => {
    let active = true;
    dispatch({ type: 'start' });
    createSupabaseMobileClient()
      .auth.getUser()
      .then(({ data, error }) => {
        if (!active) return;
        if (error || !data.user) dispatch({ type: 'sign-out' });
        else dispatch({ type: 'sign-in', user: mobileUserFromSupabase(data.user) });
      })
      .catch((error: unknown) => {
        if (active) {
          setAuthError(error instanceof Error ? error : new Error('Unable to restore session'));
          dispatch({ type: 'sign-out' });
        }
      });
    return () => {
      active = false;
    };
  }, []);
  if (session.status !== 'authenticated' || !session.user)
    return (
      <LoginScreen
        error={authError}
        expired={session.status === 'expired'}
        onSignIn={(email, password) => {
          setAuthError(null);
          dispatch({ type: 'start' });
          signInWithSupabase(email, password)
            .then((user) => dispatch({ type: 'sign-in', user: mobileUserFromSupabase(user) }))
            .catch((error: unknown) => {
              setAuthError(error instanceof Error ? error : new Error('Unable to sign in'));
              dispatch({ type: 'sign-out' });
            });
        }}
      />
    );
  return (
    <View style={[styles.shell, { backgroundColor: themeColors.canvas }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.eyebrow, { color: themeColors.accent }]}>
          LOOPDEV MOBILE / {session.user.displayName.toUpperCase()}
        </Text>
        <OrganizationSwitcher organizations={homeData.organizations} activeOrganizationId={activeOrganizationId} onSelect={selectOrganization} />
        {activeTab === 'home' && <HomeScreen data={homeData} onNavigate={setActiveTab} />}
        {activeTab === 'activity' && <ActivityScreen data={homeData} />}
        {activeTab === 'notifications' && <NotificationsScreen data={homeData} />}
        {activeTab === 'organizations' && <OrganizationsScreen data={homeData} activeOrganizationId={activeOrganizationId} onSelectOrganization={selectOrganization} />}
        {activeTab === 'profile' && (
          <ProfileScreen
            displayName={session.user.displayName}
            themeMode={mode}
            onToggleTheme={toggleMode}
            onSignOut={() => {
              signOutFromSupabase().catch(() => undefined);
              setActiveOrganizationId(null);
              void clearActiveOrganizationId();
              dispatch({ type: 'sign-out' });
            }}
          />
        )}
      </ScrollView>
      <View style={[styles.tabBar, { backgroundColor: themeColors.surface, borderTopColor: themeColors.line }]} accessibilityRole="tablist">
        {tabs.map(({ key, label }) => (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: activeTab === key }}
            onPress={() => setActiveTab(key)}
            style={[styles.tab, activeTab === key && { borderTopColor: themeColors.accent, borderTopWidth: 2 }]}
          >
            <Text style={[styles.tabLabel, { color: activeTab === key ? themeColors.accent : themeColors.muted }]}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  content: { flexGrow: 1, padding: 32, paddingTop: 64 },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  tabBar: {
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingBottom: 12,
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 2,
  },
  tabLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
});
