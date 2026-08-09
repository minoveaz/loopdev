import { StatusBar } from 'expo-status-bar';
import { useReducer, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { initialSessionState, sessionReducer, superdevFixture } from '../auth/session';
import { useHomeData } from '../data/home-data';
import { ActivityScreen } from '../features/activity/screens/ActivityScreen';
import { LoginScreen } from '../features/auth/screens/LoginScreen';
import { HomeScreen } from '../features/home/screens/HomeScreen';
import { NotificationsScreen } from '../features/notifications/screens/NotificationsScreen';
import { OrganizationsScreen } from '../features/organizations/screens/OrganizationsScreen';
import { ProfileScreen } from '../features/profile/screens/ProfileScreen';
import { colors } from '../theme/colors';

type Tab = 'home' | 'activity' | 'notifications' | 'organizations' | 'profile';
const tabs: { key: Tab; label: string }[] = [{ key: 'home', label: 'Inicio' }, { key: 'activity', label: 'Actividad' }, { key: 'notifications', label: 'Avisos' }, { key: 'organizations', label: 'Organizaciones' }, { key: 'profile', label: 'Perfil' }];

export default function AppRoot() {
  const [session, dispatch] = useReducer(sessionReducer, initialSessionState);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const homeData = useHomeData();
  if (session.status !== 'authenticated' || !session.user) return <LoginScreen expired={session.status === 'expired'} onSignIn={() => { dispatch({ type: 'start' }); dispatch({ type: 'sign-in', user: superdevFixture }); }} />;
  return <View style={styles.shell}><ScrollView contentContainerStyle={styles.content}><Text style={styles.eyebrow}>LOOPDEV MOBILE / SUPERDEV</Text>{activeTab === 'home' && <HomeScreen data={homeData} onNavigate={setActiveTab} />}{activeTab === 'activity' && <ActivityScreen data={homeData} />}{activeTab === 'notifications' && <NotificationsScreen data={homeData} />}{activeTab === 'organizations' && <OrganizationsScreen data={homeData} />}{activeTab === 'profile' && <ProfileScreen displayName={session.user.displayName} onSignOut={() => dispatch({ type: 'sign-out' })} />}</ScrollView><View style={styles.tabBar} accessibilityRole="tablist">{tabs.map(({ key, label }) => <Pressable key={key} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: activeTab === key }} onPress={() => setActiveTab(key)} style={[styles.tab, activeTab === key && styles.activeTab]}><Text style={[styles.tabLabel, activeTab === key && styles.activeTabLabel]}>{label}</Text></Pressable>)}</View><StatusBar style="auto" /></View>;
}

const styles = StyleSheet.create({ shell: { backgroundColor: colors.canvas, flex: 1 }, content: { flexGrow: 1, padding: 32, paddingTop: 64 }, eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 }, tabBar: { backgroundColor: colors.white, borderTopColor: colors.line, borderTopWidth: 1, flexDirection: 'row', paddingBottom: 12, paddingHorizontal: 4, paddingTop: 8 }, tab: { alignItems: 'center', flex: 1, justifyContent: 'center', minHeight: 44, paddingHorizontal: 2 }, activeTab: { borderTopColor: colors.accent, borderTopWidth: 2 }, tabLabel: { color: colors.muted, fontSize: 11, fontWeight: '600', textAlign: 'center' }, activeTabLabel: { color: colors.accent } });