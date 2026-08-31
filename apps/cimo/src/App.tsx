import React, { useMemo, useState } from 'react';
import { PublicAuthModal, PublicCookieBanner, PublicRuntime, PublicTopBar } from '@loopdev/public-shell';
import { LogIn, MessageSquare, Plus, Users } from 'lucide-react';
import type { ActivityCardData, ChatMessage } from '@loopdev/public-blocks';
import { CIMO_FEED_COMPOSITION, CIMO_ACTIVITY_DETAIL_COMPOSITION, CIMO_CREATE_PLAN_COMPOSITION, cimoBrandTheme, cimoNavigation, cimoSeoConfig } from './config/cimo.config';
import { createActivitySemanticSlug, extractActivityIdFromSlug } from '@loopdev/contracts';
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
import { CimoCrewNetworkView } from './components/CimoCrewNetworkView';
import { CimoSquadHubView } from './components/CimoSquadHubView';
import { CimoCaptainBadgeInspector } from './components/CimoCaptainBadgeInspector';
import { CimoActivityRsvpTicketWidget } from './components/CimoActivityRsvpTicketWidget';
import { CimoCaptainGuideTipsWidget } from './components/CimoCaptainGuideTipsWidget';
import { CimoLivePlanPreviewWidget } from './components/CimoLivePlanPreviewWidget';
import { CimoAthleteMetricsWidget } from './components/CimoAthleteMetricsWidget';
import { CimoBadgesShowcaseWidget } from './components/CimoBadgesShowcaseWidget';
import { CimoCrewNetworkStatsWidget } from './components/CimoCrewNetworkStatsWidget';
import { CimoSuggestedAthletesWidget } from './components/CimoSuggestedAthletesWidget';
import { CimoChatChannelsWidget } from './components/CimoChatChannelsWidget';
import { CimoChatContextInspectorWidget } from './components/CimoChatContextInspectorWidget';
import { getAthleteProfileById } from './data/mockAthletes';

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

  // Standard Navigation & URL Deep Linking (/app/home, /app/activity/:id, /app/create, etc.)
  // Parametric ID routing state
  const [activeProfileUserId, setActiveProfileUserId] = useState<string | null>(null);
  const [planDraft, setPlanDraft] = useState<any>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeSquadId, setActiveSquadId] = useState<string | null>(null);

  // Standard Dynamic Navigation & URL Deep Linking (/app/profile/:id, /app/chats/:id, /app/squad/:id, /app/activity/:id)
  const parseCurrentUrl = () => {
    const raw = window.location.hash.replace(/^#\/?/, '');
    const clean = raw.startsWith('app/') ? raw.slice(4) : raw;

    // 1. Activity Detail: /app/activity/:semanticSlugOrId
    if (clean.startsWith('activity/')) {
      const rawSlugOrId = clean.split('/')[1];
      const canonicalId = extractActivityIdFromSlug(rawSlugOrId);
      return { route: 'activity-detail', paramId: canonicalId, type: 'activity' };
    }

    // 2. Squad Hub: /app/squad/:squadId
    if (clean.startsWith('squad/')) {
      const id = clean.split('/')[1];
      return { route: 'squad', paramId: id, type: 'squad' };
    }

    // 3. Specific Chat or Inbox: /app/chats/:chatId or /app/chats
    if (clean.startsWith('chats/')) {
      const id = clean.split('/')[1];
      return { route: 'chats', paramId: id, type: 'chat' };
    }
    if (clean === 'chats') return { route: 'chats', paramId: null, type: 'chat' };

    // 4. Specific Athlete Profile or My Profile: /app/profile/:userId or /app/profile
    if (clean.startsWith('profile/') && clean !== 'profile/edit') {
      const id = clean.split('/')[1];
      return { route: 'profile', paramId: id, type: 'profile' };
    }
    if (clean === 'profile/edit') return { route: 'profile-edit', paramId: null, type: 'profile' };
    if (clean === 'profile') return { route: 'profile', paramId: null, type: 'profile' };

    // 5. Other App Views
    if (clean === 'create') return { route: 'create', paramId: null, type: 'create' };
    if (clean === 'crew') return { route: 'crew', paramId: null, type: 'crew' };
    if (clean === 'home' || clean === 'feed' || clean === '' || clean === 'app') {
      return { route: 'feed', paramId: null, type: 'feed' };
    }
    return { route: 'feed', paramId: null, type: 'feed' };
  };

  React.useEffect(() => {
    const handleLocationChange = () => {
      const parsed = parseCurrentUrl();
      setCurrentRoute(parsed.route);

      if (parsed.type === 'activity' && parsed.paramId) {
        setSelectedActivityId(parsed.paramId);
      } else if (parsed.type === 'profile') {
        const handle = parsed.paramId || currentUser.handle?.replace('@', '') || 'alexrivera';
        setActiveProfileUserId(parsed.paramId);
        if (!parsed.paramId && window.location.hash.includes('profile') && !window.location.hash.includes('edit')) {
          window.history.replaceState(null, '', `#/app/profile/${handle}`);
        }
      } else if (parsed.type === 'chat') {
        setActiveChatId(parsed.paramId);
      } else if (parsed.type === 'squad') {
        setActiveSquadId(parsed.paramId);
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

  const navigateTo = (route: string, paramId?: string) => {
    setCurrentRoute(route);
    if (route === 'activity-detail' || (paramId && route.includes('activity'))) {
      const rawId = paramId ?? selectedActivityId;
      const canonicalId = extractActivityIdFromSlug(rawId);
      setSelectedActivityId(canonicalId);
      const act = activities.find((a) => a.id === canonicalId);
      const semanticSlug = act ? createActivitySemanticSlug(act.title, act.id) : canonicalId;
      window.location.hash = `#/app/activity/${semanticSlug}`;
    } else if (route === 'squad') {
      setActiveSquadId(paramId ?? 'squad_1');
      window.location.hash = `#/app/squad/${paramId ?? 'squad_1'}`;
    } else if (route === 'chats') {
      setActiveChatId(paramId ?? null);
      window.location.hash = paramId ? `#/app/chats/${paramId}` : '#/app/chats';
    } else if (route === 'profile') {
      const myHandle = currentUser.handle?.replace('@', '') || 'alexrivera';
      const target = paramId || myHandle;
      setActiveProfileUserId(paramId ?? null);
      window.location.hash = `#/app/profile/${target}`;
    } else if (route === 'profile-edit') {
      window.location.hash = '#/app/profile/edit';
    } else if (route === 'create') {
      window.location.hash = '#/app/create';
    } else if (route === 'crew') {
      window.location.hash = '#/app/crew';
    } else {
      window.location.hash = '#/app/home';
    }
  };

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (selectedSport !== 'Todos' && act.sport.toLowerCase() !== selectedSport.toLowerCase()) return false;
      if (selectedLevel !== 'Cualquier nivel' && act.level !== selectedLevel && act.level !== 'Todos los niveles') return false;

      // Day filtering with calendar and quick options
      if (selectedDay !== 'Cualquier día') {
        const d = selectedDay.toLowerCase();
        const actD = act.date.toLowerCase();
        if (d === 'hoy' && !actD.includes('hoy')) return false;
        if (d === 'mañana' && !actD.includes('mañana')) return false;
        if (d === 'este fin de semana' && !actD.includes('sábado') && !actD.includes('domingo') && !actD.includes('sab') && !actD.includes('dom')) return false;
        if (!['hoy', 'mañana', 'este fin de semana', 'esta semana'].includes(d)) {
          // Custom specific day match (e.g. "Mar 1 Sep", "1 Sep", "Sábado", etc.)
          const cleanToken = d.split(' ')[0] ?? d;
          if (!actD.includes(cleanToken) && !actD.includes(d)) return false;
        }
      }

      // City / Zone filtering
      if (selectedZone !== 'Toda la ciudad' && selectedZone !== 'Toda España' && selectedZone !== 'Todas') {
        const z = selectedZone.toLowerCase();
        const loc = act.location.toLowerCase();
        const tit = act.title.toLowerCase();
        if (!loc.includes(z) && !tit.includes(z)) return false;
      }

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
      instructions: newPlan.instructions,
      thirdHalf: newPlan.thirdHalf,
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
            onDraftChange={setPlanDraft}
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
            onNavigateToProfile={(athleteId) => navigateTo('profile', athleteId)}
          />
        );
      case 'squad':
        return (
          <CimoSquadHubView
            squadId={activeSquadId ?? 'sq_1'}
            onBackToCrew={() => navigateTo('crew')}
            onNavigateToProfile={(athleteId) => navigateTo('profile', athleteId)}
            onSelectActivity={handleSelectActivity}
            onCreateWorkout={() => navigateTo('create')}
          />
        );
      case 'crew':
        return (
          <CimoCrewNetworkView
            onBackToExplore={() => navigateTo('feed')}
            onNavigateToProfile={(athleteId) => navigateTo('profile', athleteId)}
            onNavigateToSquad={(squadId) => navigateTo('squad', squadId)}
            onOpenChat={(chatId) => navigateTo('chats', chatId)}
            onCreateWorkout={() => navigateTo('create')}
          />
        );
      case 'chats':
        return (
          <CimoChatListView
            activities={activities}
            chats={chats}
            selectedActivityId={activeChatId ?? selectedActivityId}
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
      case 'profile': {
        const isOwn = !activeProfileUserId || activeProfileUserId === 'usr_me' || activeProfileUserId === 'alexrivera';
        const profileUserToDisplay = isOwn ? currentUser : getAthleteProfileById(activeProfileUserId);

        return (
          <CimoProfileView
            user={profileUserToDisplay}
            isOwnProfile={isOwn}
            userActivities={activities}
            onSelectActivity={handleSelectActivity}
            onCreatePlan={() => navigateTo('create')}
            onEditProfile={() => navigateTo('profile-edit')}
            onNavigateToCrew={() => navigateTo('crew')}
            onUpdateUser={(updated) => {
              if (isOwn) {
                setCurrentUser((prev) => ({ ...prev, ...updated }));
              }
            }}
          />
        );
      }
      case 'explore':
      case 'feed':
      default:
        return (
          <CimoCuratedFeed
            activities={filteredActivities}
            selectedActivityId={selectedActivityId}
            onSelectActivity={handleSelectActivity}
            onJoinActivity={handleJoinActivity}
            onNavigateToProfile={(athleteId) => navigateTo('profile', athleteId)}
          />
        );
    }
  };

  const renderLeftSupportZone = () => {
    switch (currentRoute) {
      case 'activity-detail':
      case 'create':
        return null;
      case 'crew':
      case 'squad':
        return <CimoCrewNetworkStatsWidget />;
      case 'profile':
      case 'profile-edit':
        return (
          <CimoAthleteMetricsWidget
            user={activeProfileUserId ? (getAthleteProfileById(activeProfileUserId) ?? currentUser) : currentUser}
            isOwnProfile={!activeProfileUserId || activeProfileUserId === (currentUser.handle?.replace('@', '') || 'alexrivera')}
          />
        );
      case 'chats':
        return (
          <CimoChatChannelsWidget
            activities={activities}
            chats={chats}
            selectedActivityId={activeChatId ?? selectedActivityId}
            onSelectChat={(id) => {
              setActiveChatId(id);
              setSelectedActivityId(id);
            }}
          />
        );
      case 'explore':
      case 'feed':
      default:
        return (
          <CimoAthleteProfileCard
            user={currentUser}
            onCreateClick={() => navigateTo('create')}
            onProfileClick={() => navigateTo('profile')}
          />
        );
    }
  };

  const renderRightSupportZone = () => {
    switch (currentRoute) {
      case 'activity-detail':
        return selectedActivity ? (
          <CimoActivityRsvpTicketWidget
            activity={selectedActivity}
            onJoin={handleJoinActivity}
            onNavigateToProfile={(athleteId) => navigateTo('profile', athleteId)}
          />
        ) : null;
      case 'create':
        return (
          <CimoLivePlanPreviewWidget
            formData={
              planDraft ?? {
                sport: selectedSport === 'Todos' ? 'Running' : selectedSport,
                title: 'Running 8K • Parque del Retiro',
                description: 'Rodaje dinámico en grupo por los senderos arbolados del Retiro. Mantendremos un ritmo intermedio con buen ambiente.',
                date: 'Hoy',
                time: '19:30',
                location: selectedZone === 'Toda la ciudad' ? 'Parque del Retiro (Puerta de Alcalá)' : selectedZone,
                capacity: 5,
                level: selectedLevel === 'Cualquier nivel' ? 'Intermedio (5:00 - 5:30 min/km)' : selectedLevel,
                thirdHalfType: 'cafe',
                thirdHalfTitle: 'Café & Desayuno',
                thirdHalfLocation: 'Café Murillo (Retiro)',
                image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200',
                price: 'Gratis',
              }
            }
            currentUser={currentUser}
          />
        );
      case 'crew':
      case 'squad':
        return (
          <CimoSuggestedAthletesWidget
            onNavigateToProfile={(athleteId) => navigateTo('profile', athleteId)}
          />
        );
      case 'profile':
      case 'profile-edit':
        return <CimoBadgesShowcaseWidget />;
      case 'chats':
        return (
          <CimoChatContextInspectorWidget
            activity={activities.find((a) => a.id === (activeChatId ?? selectedActivityId)) ?? activities[0]}
            onNavigateToProfile={(athleteId) => navigateTo('profile', athleteId)}
          />
        );
      case 'feed':
      case 'explore':
      default:
        return (
          <CimoCommunityWidgets
            joinedActivities={joinedActivities}
            chats={chats}
            onSelectActivity={handleSelectActivity}
            onOpenChatTab={() => navigateTo('chats')}
            onNavigateToProfile={(athleteId) => navigateTo('profile', athleteId)}
          />
        );
    }
  };

  return (
    <>
      <PublicRuntime
        brandTheme={cimoBrandTheme}
        navigation={cimoNavigation}
        composition={
          currentRoute === 'activity-detail'
            ? CIMO_ACTIVITY_DETAIL_COMPOSITION
            : currentRoute === 'create'
            ? CIMO_CREATE_PLAN_COMPOSITION
            : CIMO_FEED_COMPOSITION
        }
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
              showDrawerTrigger={false}
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
                  {/* Mi Crew Button (Desktop/Tablet only, since it is in BottomNav on Mobile) */}
                  <button
                    type="button"
                    onClick={() => navigateTo('crew')}
                    aria-label="Abrir mi red de Crew"
                    className={`hidden md:flex px-3 py-2 text-xs font-black rounded-full transition-all items-center gap-1.5 min-h-[38px] cursor-pointer active:scale-95 shrink-0 ${
                      currentRoute === 'crew'
                        ? 'bg-[#1F4E5F] text-white shadow-xs'
                        : 'bg-white/90 hover:bg-white text-[#1F4E5F] border border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <Users className={`w-3.5 h-3.5 ${currentRoute === 'crew' ? 'text-[#7FB77E]' : 'text-[#1F4E5F]'}`} />
                    <span>Mi Crew</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${currentRoute === 'crew' ? 'bg-[#7FB77E] text-[#1F4E5F]' : 'bg-[#7FB77E]/20 text-[#1F4E5F]'}`}>
                      7
                    </span>
                  </button>

                  {/* Crear Plan Button (Always Prominently Visible) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        setIsAuthOpen(true);
                        return;
                      }
                      navigateTo('create');
                    }}
                    className={`px-3.5 py-2 text-xs font-black rounded-full transition-all flex items-center gap-1.5 min-h-[38px] cursor-pointer active:scale-95 shrink-0 shadow-xs ${
                      currentRoute === 'create'
                        ? 'bg-[#7FB77E] text-[#1F4E5F]'
                        : 'bg-[#1F4E5F] hover:bg-[#163a47] text-white'
                    }`}
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span className="hidden sm:inline">Crear Plan</span>
                    <span className="sm:hidden">Crear</span>
                  </button>

                  {/* Chats button (Desktop/Tablet only, since it is in BottomNav on Mobile) */}
                  <button
                    type="button"
                    onClick={() => navigateTo('chats')}
                    aria-label="Abrir chats"
                    className={`hidden md:flex relative p-2.5 rounded-full border transition-all cursor-pointer min-h-[38px] min-w-[38px] items-center justify-center shrink-0 ${
                      currentRoute === 'chats'
                        ? 'bg-[#1F4E5F] text-white border-[#1F4E5F] shadow-xs'
                        : 'bg-white/90 border-slate-200/90 text-[#1F4E5F] hover:bg-white shadow-2xs'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#7FB77E] text-[#1F4E5F] text-[9px] font-black flex items-center justify-center border-2 border-white shadow-2xs">
                      3
                    </span>
                  </button>

                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => navigateTo('profile')}
                      aria-label="Ver mi perfil"
                      className="hidden sm:flex w-9 h-9 rounded-full overflow-hidden border-2 border-[#1F4E5F]/20 cursor-pointer hover:border-[#1F4E5F] transition-colors shadow-xs shrink-0"
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
          sidebarFilters: () => renderLeftSupportZone(),
          mainFeed: () => renderMainContent(),
          contextInspector: () => renderRightSupportZone(),
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
