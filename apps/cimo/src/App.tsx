import React, { useMemo, useState } from 'react';
import { PublicAuthModal, PublicCookieBanner, PublicRuntime, PublicTopBar } from '@loopdev/public-shell';
import { LogIn, Plus } from 'lucide-react';
import type { ActivityCardData, ChatMessage } from '@loopdev/public-blocks';
import { CIMO_FEED_COMPOSITION, cimoBrandTheme, cimoNavigation, cimoSeoConfig } from './config/cimo.config';
import { INITIAL_ACTIVITIES, INITIAL_CREW_CHATS } from './data/mockData';
import { CimoFloatingSearchBar } from './components/CimoFloatingSearchBar';
import { CimoAthleteProfileCard } from './components/CimoAthleteProfileCard';
import { CimoCuratedFeed } from './components/CimoCuratedFeed';
import { CimoCommunityWidgets } from './components/CimoCommunityWidgets';
import { CimoAuthModalContent } from './components/CimoAuthModalContent';
import { CimoActivityDetailView } from './components/CimoActivityDetailView';
import { CimoCreatePlanView } from './components/CimoCreatePlanView';
import { CimoChatListView } from './components/CimoChatListView';
import { CimoProfileView } from './components/CimoProfileView';
import { CimoEditProfileView, type ExtendedUserProfileData } from './components/CimoEditProfileView';

export function App() {
  const [activities, setActivities] = useState<ActivityCardData[]>(INITIAL_ACTIVITIES);
  const [selectedActivityId, setSelectedActivityId] = useState<string>(INITIAL_ACTIVITIES[0].id);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(INITIAL_CREW_CHATS);
  const [selectedSport, setSelectedSport] = useState('Todos');
  const [selectedDay, setSelectedDay] = useState('Cualquier día');
  const [selectedZone, setSelectedZone] = useState('Toda la ciudad');
  const [selectedLevel, setSelectedLevel] = useState('Cualquier nivel');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRoute, setCurrentRoute] = useState('feed');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState<ExtendedUserProfileData>({
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    handle: '@alexrivera',
    city: 'Madrid, España',
    neighborhood: 'Retiro / Chamberí',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    coverUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1400',
    bio: 'Apasionado del running matutino y las partidas de pádel. ¡Siempre dispuesto a sumar nuevos kilómetros y conectar con gente activa!',
    sports: [
      { sport: 'Running', level: 'Intermedio (5-10K)', pace: '5:15 min/km' },
      { sport: 'Pádel', level: 'Nivel 3.5 (Intermedio)', pace: 'Drive / Revés' },
      { sport: 'Hiking', level: 'Rutas 10-15 km', pace: '10-15 km • +600m desnivel' },
    ],
    weeklySchedule: {
      Lunes: ['afternoon'],
      Martes: ['morning'],
      Miércoles: ['afternoon'],
      Jueves: ['afternoon'],
      Viernes: [],
      Sábado: ['morning'],
      Domingo: ['morning'],
    },
    groupSizePreference: 'micro',
    goals: [
      '🤝 Conocer deportistas activos',
      '☕ Café / Caña post-entreno (Tercer Tiempo)',
      '🔥 Mantener constancia semanal',
    ],
    isCaptainAvailable: true,
    defaultCaptainNotes: '💧 Traer agua • ⏰ Llegar 5 min antes • 🧘 Estiramientos al terminar',
    phoneWhatsapp: '+34 612 345 678',
    phonePrivacy: true,
    linkedinUrl: 'https://linkedin.com/in/alexrivera-sport',
    stravaUrl: 'https://strava.com/athletes/alexrivera',
    instagramHandle: '@alex_rivera_cimo',
  });

  // Standard Navigation & URL Deep Linking
  const parseCurrentUrl = () => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash.startsWith('activity/')) {
      const id = hash.split('/')[1];
      return { route: 'activity-detail', activityId: id };
    }
    if (hash === 'create') return { route: 'create', activityId: null };
    if (hash === 'chats') return { route: 'chats', activityId: null };
    if (hash === 'profile/edit') return { route: 'profile-edit', activityId: null };
    if (hash === 'profile') return { route: 'profile', activityId: null };
    return { route: 'feed', activityId: null };
  };

  React.useEffect(() => {
    const handleLocationChange = () => {
      const { route, activityId } = parseCurrentUrl();
      setCurrentRoute(route);
      if (activityId) {
        setSelectedActivityId(activityId);
      }
    };

    handleLocationChange();

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigateTo = (route: string, activityId?: string) => {
    setCurrentRoute(route);
    if (activityId) {
      setSelectedActivityId(activityId);
      window.location.hash = `#/activity/${activityId}`;
    } else if (route === 'create') {
      window.location.hash = '#/create';
    } else if (route === 'chats') {
      window.location.hash = '#/chats';
    } else if (route === 'profile-edit') {
      window.location.hash = '#/profile/edit';
    } else if (route === 'profile') {
      window.location.hash = '#/profile';
    } else {
      window.location.hash = '#/';
    }
  };

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
    navigateTo('activity-detail', id);
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
      image: newPlan.image,
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
    navigateTo('activity-detail', created.id);
  };

  const handleSendMessage = (activityId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'user_me',
      senderName: currentUser.name,
      senderAvatar: currentUser.avatarUrl,
      text,
      timestamp: 'Ahora',
      isOwn: true,
    };
    setChats((prev) => ({
      ...prev,
      [activityId]: [...(prev[activityId] ?? []), newMsg],
    }));
  };

  const handleAuthSuccess = (email: string) => {
    const name = email.split('@')[0];
    setCurrentUser({ name, email });
    setIsAuthenticated(true);
    setIsAuthOpen(false);
  };

  // Main Feed content renderer with dedicated views (No Modals)
  const renderMainContent = () => {
    switch (currentRoute) {
      case 'create':
        return (
          <CimoCreatePlanView
            onBack={() => navigateTo('feed')}
            onCreate={handleCreateActivity}
          />
        );
      case 'activity-detail':
        return (
          <CimoActivityDetailView
            activity={selectedActivity}
            chatMessages={chats[selectedActivity.id] ?? []}
            onBack={() => navigateTo('feed')}
            onJoin={handleJoinActivity}
            onSendMessage={handleSendMessage}
          />
        );
      case 'chats':
        return (
          <CimoChatListView
            activities={activities}
            chats={chats}
            selectedActivityId={selectedActivityId}
            onSelectChat={(id) => {
              navigateTo('activity-detail', id);
            }}
          />
        );
      case 'profile-edit':
        return (
          <CimoEditProfileView
            user={currentUser}
            onBack={() => navigateTo('profile')}
            onSave={(updated) => {
              setCurrentUser((prev) => ({ ...prev, ...updated }));
            }}
          />
        );
      case 'profile':
        return (
          <CimoProfileView
            user={currentUser}
            userActivities={activities}
            onSelectActivity={handleSelectActivity}
            onCreatePlan={() => navigateTo('create')}
            onEditProfile={() => navigateTo('profile-edit')}
            onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
          />
        );
      case 'explore':
      case 'feed':
      default:
        return (
          <CimoCuratedFeed
            activities={filteredActivities}
            selectedActivityId={selectedActivityId}
            onSelectActivity={handleSelectActivity}
            onJoinActivity={handleJoinActivity}
          />
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
        onNavigate={navigateTo}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser ? { name: currentUser.name } : undefined}
        renderers={{
          topBar: (
            <PublicTopBar
              navigation={cimoNavigation}
              activeRouteId={currentRoute}
              onNavigate={navigateTo}
              centerSlot={
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
              }
              rightSlot={
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        setIsAuthOpen(true);
                        return;
                      }
                      navigateTo('create');
                    }}
                    className={`px-3.5 py-2 text-xs font-extrabold rounded-full transition-all shadow-xs flex items-center gap-1.5 min-h-[38px] cursor-pointer active:scale-95 shrink-0 ${
                      currentRoute === 'create'
                        ? 'bg-[#00B894] text-white'
                        : 'bg-[#1F4E5F] hover:bg-[#183e4c] text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4 text-white stroke-[3]" />
                    <span className="hidden sm:inline">Crear Plan</span>
                    <span className="sm:hidden">Crear</span>
                  </button>

                  {/* Chats button with badge */}
                  <button
                    type="button"
                    onClick={() => navigateTo('chats')}
                    aria-label="Abrir chats"
                    className={`relative p-2.5 rounded-full border transition-all cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center shrink-0 ${
                      currentRoute === 'chats'
                        ? 'bg-[#1F4E5F] text-white border-[#1F4E5F]'
                        : 'bg-[#F7F7F7] border-[#1F4E5F]/10 text-[#1F4E5F] hover:bg-[#1F4E5F]/5'
                    }`}
                  >
                    <span className="text-sm">💬</span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00B894] text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                      3
                    </span>
                  </button>

                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => navigateTo('profile')}
                      aria-label="Ver mi perfil"
                      className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#1F4E5F]/20 cursor-pointer hover:border-[#1F4E5F] transition-colors shadow-xs shrink-0"
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
              onCreateClick={() => navigateTo('create')}
              onProfileClick={() => navigateTo('profile')}
            />
          ),
          mainFeed: renderMainContent(),
          contextInspector: (
            <CimoCommunityWidgets
              joinedActivities={joinedActivities}
              chats={chats}
              onSelectActivity={handleSelectActivity}
              onOpenChatTab={() => navigateTo('chats')}
            />
          ),
          drawer: (
            <div className="flex flex-col gap-5 p-2">
              <CimoAthleteProfileCard
                user={currentUser}
                onCreateClick={() => navigateTo('create')}
                onProfileClick={() => navigateTo('profile')}
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
    </>
  );
}

export default App;
