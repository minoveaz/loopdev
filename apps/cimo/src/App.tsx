import React, { useMemo, useState } from 'react';
import { PublicAuthModal, PublicCookieBanner, PublicRuntime, PublicTopBar } from '@loopdev/public-shell';
import { Button } from '@loopdev/ui';
import { LogIn, Plus } from 'lucide-react';
import { CIMO_FEED_COMPOSITION, cimoBrandTheme, cimoNavigation, cimoSeoConfig } from './config/cimo.config';
import { INITIAL_ACTIVITIES, INITIAL_CREW_CHATS } from './data/mockData';
import { CimoSportFilters } from './components/CimoSportFilters';
import { CimoFeedView } from './components/CimoFeedView';
import { CimoCrewDetailInspector } from './components/CimoCrewDetailInspector';
import { CimoAuthModalContent } from './components/CimoAuthModalContent';

export function App() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(INITIAL_ACTIVITIES[0].id);
  const [chats, setChats] = useState(INITIAL_CREW_CHATS);
  const [selectedSport, setSelectedSport] = useState('Todos');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRoute, setCurrentRoute] = useState('feed');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (selectedSport !== 'Todos' && act.sport !== selectedSport) return false;
      if (selectedLevel !== 'Todos' && act.level !== selectedLevel) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          act.title.toLowerCase().includes(q) ||
          act.location.toLowerCase().includes(q) ||
          act.sport.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activities, selectedSport, selectedLevel, searchQuery]);

  const selectedActivity = useMemo(() => {
    return activities.find((act) => act.id === selectedActivityId) ?? activities[0] ?? null;
  }, [activities, selectedActivityId]);

  const currentMessages = useMemo(() => {
    return chats[selectedActivityId] ?? [];
  }, [chats, selectedActivityId]);

  const handleJoinActivity = (activityId: string) => {
    if (!isAuthenticated) {
      setIsAuthOpen(true);
      return;
    }
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          const isJoined = !act.isJoined;
          const currentMembers = isJoined
            ? [...act.currentMembers, { id: 'current-user', name: currentUser?.name ?? 'Tú' }]
            : act.currentMembers.filter((m) => m.id !== 'current-user');
          return { ...act, isJoined, currentMembers };
        }
        return act;
      }),
    );
  };

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: currentUser?.name ?? 'Tú',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };

    setChats((prev) => ({
      ...prev,
      [selectedActivityId]: [...(prev[selectedActivityId] ?? []), newMessage],
    }));
  };

  const handleAuthSuccess = (email: string) => {
    const name = email.split('@')[0];
    setCurrentUser({ name, email });
    setIsAuthenticated(true);
    setIsAuthOpen(false);
  };

  return (
    <PublicRuntime
      brandTheme={cimoBrandTheme}
      navigation={cimoNavigation}
      composition={CIMO_FEED_COMPOSITION}
      seo={cimoSeoConfig}
      activeRouteId={currentRoute}
      onNavigate={setCurrentRoute}
      isAuthenticated={isAuthenticated}
      currentUser={currentUser ? { name: currentUser.name } : undefined}
      renderers={{
        topBar: (
          <PublicTopBar
            navigation={cimoNavigation}
            activeRouteId={currentRoute}
            onNavigate={setCurrentRoute}
            rightSlot={
              isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                    {currentUser?.name}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[var(--lpd-brand-primary)] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {currentUser?.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[var(--lpd-brand-primary)] hover:bg-[var(--lpd-brand-primary-hover)] rounded-xl transition-all shadow-sm flex items-center gap-1.5 min-h-[38px] active:scale-95"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Entrar</span>
                </button>
              )
            }
          />
        ),
        sidebarFilters: (
          <CimoSportFilters
            selectedSport={selectedSport}
            onSelectSport={setSelectedSport}
            selectedLevel={selectedLevel}
            onSelectLevel={setSelectedLevel}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        ),
        mainFeed: (
          <CimoFeedView
            activities={filteredActivities}
            selectedActivityId={selectedActivityId}
            onSelectActivity={setSelectedActivityId}
            onJoinActivity={handleJoinActivity}
          />
        ),
        contextInspector: (
          <CimoCrewDetailInspector
            activity={selectedActivity}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            onJoin={handleJoinActivity}
          />
        ),
        drawer: (
          <div className="flex flex-col gap-5 p-2">
            <CimoSportFilters
              selectedSport={selectedSport}
              onSelectSport={setSelectedSport}
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        ),
        authModal: (
          <PublicAuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            title="Conéctate a CIMO"
            subtitle="Únete a planes deportivos grupales y conoce gente entrenando."
          >
            <CimoAuthModalContent onSuccess={handleAuthSuccess} />
          </PublicAuthModal>
        ),
        cookieBanner: <PublicCookieBanner />,
      }}
    />
  );
}

export default App;
