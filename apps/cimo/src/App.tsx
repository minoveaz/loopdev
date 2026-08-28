import React, { useMemo, useState } from 'react';
import { PublicAuthModal, PublicCookieBanner, PublicRuntime, PublicTopBar } from '@loopdev/public-shell';
import { LogIn, Plus } from 'lucide-react';
import type { ActivityCardData } from '@loopdev/public-blocks';
import { CIMO_FEED_COMPOSITION, cimoBrandTheme, cimoNavigation, cimoSeoConfig } from './config/cimo.config';
import { INITIAL_ACTIVITIES, INITIAL_CREW_CHATS } from './data/mockData';
import { CimoFloatingSearchBar } from './components/CimoFloatingSearchBar';
import { CimoSportCategoryBar } from './components/CimoSportCategoryBar';
import { CimoAthleteProfileCard } from './components/CimoAthleteProfileCard';
import { CimoCuratedFeed } from './components/CimoCuratedFeed';
import { CimoCommunityWidgets } from './components/CimoCommunityWidgets';
import { CimoAuthModalContent } from './components/CimoAuthModalContent';
import { CimoActivityDetailModal } from './components/CimoActivityDetailModal';
import { CimoCreateActivityModal } from './components/CimoCreateActivityModal';
import { CimoChatListView } from './components/CimoChatListView';
import { CimoProfileView } from './components/CimoProfileView';

export function App() {
  const [activities, setActivities] = useState<ActivityCardData[]>(INITIAL_ACTIVITIES);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(INITIAL_ACTIVITIES[0].id);
  const [chats, setChats] = useState(INITIAL_CREW_CHATS);
  const [selectedSport, setSelectedSport] = useState('Todos');
  const [selectedDay, setSelectedDay] = useState('Cualquier día');
  const [selectedZone, setSelectedZone] = useState('Toda la ciudad');
  const [selectedLevel, setSelectedLevel] = useState('Cualquier nivel');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRoute, setCurrentRoute] = useState('feed');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatarUrl?: string }>({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  });

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (selectedSport !== 'Todos' && act.sport.toLowerCase() !== selectedSport.toLowerCase()) return false;
      if (selectedLevel !== 'Cualquier nivel' && act.level !== selectedLevel && act.level !== 'Todos los niveles') return false;
      if (selectedDay === 'Hoy' && !act.date.toLowerCase().includes('hoy')) return false;
      if (selectedDay === 'Mañana' && !act.date.toLowerCase().includes('mañana')) return false;
      if (selectedDay === 'Este fin de semana' && !act.date.toLowerCase().includes('sábado') && !act.date.toLowerCase().includes('domingo')) return false;
      if (selectedZone !== 'Toda la ciudad' && !act.location.toLowerCase().includes(selectedZone.toLowerCase())) return false;
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
  }, [activities, selectedSport, selectedLevel, selectedDay, selectedZone, searchQuery]);

  const selectedActivity = useMemo(() => {
    return activities.find((act) => act.id === selectedActivityId) ?? activities[0] ?? null;
  }, [activities, selectedActivityId]);

  const joinedActivities = useMemo(() => {
    return activities.filter((act) => act.isJoined);
  }, [activities]);

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
            ? [...act.currentMembers, { id: 'user_me', name: currentUser.name, avatarUrl: currentUser.avatarUrl }]
            : act.currentMembers.filter((m) => m.id !== 'user_me');
          return { ...act, isJoined, currentMembers };
        }
        return act;
      }),
    );
  };

  const handleSelectActivity = (id: string) => {
    setSelectedActivityId(id);
    setIsDetailModalOpen(true);
  };

  const handleCreateActivity = (newPlan: Partial<ActivityCardData>) => {
    const created: ActivityCardData = {
      id: `act_${Date.now()}`,
      title: newPlan.title ?? 'Nuevo Plan',
      sport: newPlan.sport ?? 'running',
      location: newPlan.location ?? 'Madrid',
      date: newPlan.date ?? 'Hoy',
      time: newPlan.time ?? '19:00',
      level: newPlan.level ?? 'Intermedio',
      paceOrDetails: newPlan.paceOrDetails,
      maxMembers: newPlan.maxMembers ?? 5,
      captain: {
        id: 'user_me',
        name: currentUser.name,
        avatarUrl: currentUser.avatarUrl,
        isCaptain: true,
      },
      currentMembers: [
        { id: 'user_me', name: currentUser.name, avatarUrl: currentUser.avatarUrl, isCaptain: true },
      ],
      isJoined: true,
    };

    setActivities((prev) => [created, ...prev]);
    setSelectedActivityId(created.id);
  };

  const handleAuthSuccess = (email: string) => {
    const name = email.split('@')[0];
    setCurrentUser({ name, email });
    setIsAuthenticated(true);
    setIsAuthOpen(false);
  };

  // Main Feed content renderer
  const renderMainContent = () => {
    switch (currentRoute) {
      case 'chats':
        return (
          <CimoChatListView
            activities={activities}
            chats={chats}
            selectedActivityId={selectedActivityId}
            onSelectChat={(id) => {
              setSelectedActivityId(id);
              setIsDetailModalOpen(true);
            }}
          />
        );
      case 'profile':
        return <CimoProfileView user={currentUser} />;
      case 'explore':
      case 'feed':
      default:
        return (
          <div className="flex flex-col gap-6">
            {/* Airbnb Experiences Style Floating Search Bar */}
            <CimoFloatingSearchBar
              selectedSport={selectedSport}
              onSelectSport={setSelectedSport}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              selectedZone={selectedZone}
              onSelectZone={setSelectedZone}
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
            />

            {/* Sports Category Bar with Clean Icons */}
            <CimoSportCategoryBar
              selectedSport={selectedSport}
              onSelectSport={setSelectedSport}
            />

            {/* Curated Feed with 2-Col Activity Cards Grid */}
            <CimoCuratedFeed
              activities={filteredActivities}
              selectedActivityId={selectedActivityId}
              onSelectActivity={handleSelectActivity}
              onJoinActivity={handleJoinActivity}
            />
          </div>
        );
    }
  };

  return (
    <>
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
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        setIsAuthOpen(true);
                        return;
                      }
                      setIsCreateOpen(true);
                    }}
                    className="px-4 py-2 text-xs font-extrabold text-white bg-[#1F4E5F] hover:bg-[#183e4c] rounded-full transition-all shadow-xs flex items-center gap-1.5 min-h-[38px] cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-[#00B894] stroke-[3]" />
                    <span className="hidden sm:inline">Crear Plan</span>
                    <span className="sm:hidden">Crear</span>
                  </button>

                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => setCurrentRoute('profile')}
                      aria-label="Ver mi perfil"
                      className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#1F4E5F]/20 cursor-pointer hover:border-[#1F4E5F] transition-colors shadow-xs"
                    >
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#1F4E5F] text-white font-extrabold text-xs flex items-center justify-center">
                          {currentUser.name.charAt(0)}
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAuthOpen(true)}
                      className="px-4 py-2 text-xs font-bold text-[#1F4E5F] bg-[#F7F7F7] border border-[#1F4E5F]/15 hover:bg-white rounded-full transition-all min-h-[38px] cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Entrar</span>
                    </button>
                  )}
                </div>
              }
            />
          ),
          sidebarFilters: (
            <CimoAthleteProfileCard
              user={currentUser}
              onCreateClick={() => setIsCreateOpen(true)}
              onProfileClick={() => setCurrentRoute('profile')}
            />
          ),
          mainFeed: renderMainContent(),
          contextInspector: (
            <CimoCommunityWidgets
              joinedActivities={joinedActivities}
              chats={chats}
              onSelectActivity={handleSelectActivity}
              onOpenChatTab={() => setCurrentRoute('chats')}
            />
          ),
          drawer: (
            <div className="flex flex-col gap-5 p-2">
              <CimoAthleteProfileCard
                user={currentUser}
                onCreateClick={() => setIsCreateOpen(true)}
                onProfileClick={() => setCurrentRoute('profile')}
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

      {/* Global In-App Modals */}
      <CimoActivityDetailModal
        activity={selectedActivity}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onJoin={handleJoinActivity}
      />

      <CimoCreateActivityModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateActivity}
      />
    </>
  );
}

export default App;
