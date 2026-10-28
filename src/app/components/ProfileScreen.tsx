import { Home, BookOpen, TrendingUp, Target, User, Settings, Award, Star, Trophy, Flame } from 'lucide-react';
import { useUserOverview } from '../hooks/useUserOverview';
import OverviewNotice from './OverviewNotice';

interface ProfileScreenProps {
  userData: {
    name: string;
    email: string;
    investorProfile: string;
    xp: number;
    level: number;
    completedCourses: number;
    streak: number;
  };
  onNavigate: (screen: string) => void;
}

export default function ProfileScreen({ userData, onNavigate }: ProfileScreenProps) {
  const overview = useUserOverview();
  const user = overview.user.data ?? userData;
  const trails = overview.trails.data;
  const goals = overview.goals.data;
  const completedCourses = trails?.filter(trail => trail.status === 'COMPLETED') ?? [];
  const completedLessons = trails?.reduce((sum, trail) => sum + trail.completedLessons, 0) ?? 0;
  const answeredQuestions = trails?.reduce((sum, trail) => sum + trail.answeredQuestions, 0) ?? 0;
  const correctQuestions = trails?.reduce((sum, trail) => sum + trail.correctQuestions, 0) ?? 0;
  const finishedQuizzes = trails?.filter(trail => trail.hasFinalQuiz && trail.totalQuestions > 0 && trail.answeredQuestions >= trail.totalQuestions).length ?? 0;

  // Indicadores derivados da situação atual. Não criam recompensas ou históricos de conquistas.
  const milestones = [
    { title: 'Primeira aula', description: 'Pelo menos uma aula concluída', icon: '🎓', met: trails === null ? null : completedLessons > 0 },
    { title: 'Meta cadastrada', description: 'Pelo menos uma meta no cadastro atual', icon: '🎯', met: goals === null ? null : goals.length > 0 },
    { title: 'Primeira trilha', description: 'Pelo menos uma trilha concluída', icon: '📚', met: trails === null ? null : completedCourses.length > 0 },
    { title: 'Todas as trilhas', description: 'Todas as trilhas disponíveis concluídas', icon: '👑', met: trails === null ? null : trails.length > 0 && completedCourses.length === trails.length },
  ];
  const reached = milestones.filter(item => item.met === true).length;
  const indicatorsAvailable = trails !== null && goals !== null;
  const profile = user.investorProfile?.toLowerCase();
  const profileLabel = profile && profile !== 'não definido' ? `Perfil ${profile}` : 'Perfil de investidor não definido';
  const stats = [
    ['Aulas concluídas', String(completedLessons)],
    ['Questionários com todas as perguntas respondidas', String(finishedQuizzes)],
    ['Perguntas respondidas', String(answeredQuestions)],
    ['Perguntas já acertadas', String(correctQuestions)],
  ];
  const navigation = [
    { screen: 'dashboard', label: 'Home', icon: Home },
    { screen: 'courses', label: 'Cursos', icon: BookOpen },
    { screen: 'simulator', label: 'Investir', icon: TrendingUp },
    { screen: 'goals', label: 'Metas', icon: Target },
    { screen: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#101E35] text-white pb-28">
      <header className="bg-gradient-to-b from-[#172B43] to-[#101E35] px-6 pt-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Perfil</h1>
            <button type="button" aria-label="Abrir configurações" onClick={() => onNavigate('settings')} className="p-3 rounded-full bg-[#172B43] border border-white/10"><Settings className="w-5 h-5" /></button>
          </div>
          <OverviewNotice loading={overview.user.loading} error={overview.user.error} onRetry={overview.reload} />
          <section className="bg-[#172B43] border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-16 h-16 shrink-0 bg-[#E6BB66] rounded-full flex items-center justify-center text-black text-2xl font-bold">{user.name.trim().charAt(0).toUpperCase() || 'F'}</div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold break-words">{user.name}</h2>
                <p className="text-sm text-[#ADBFCC] break-all">{user.email}</p>
                <p className="text-xs text-[#E6BB66] mt-2">{profileLabel}</p>
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-6 text-sm">
              <span>Nível {user.level}</span><span className="text-[#E6BB66] font-semibold">{user.xp} XP acumulados</span>
            </div>
          </section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Dias seguidos registrados', value: String(user.streak), icon: Flame },
              { label: 'Marcos atuais atingidos', value: indicatorsAvailable ? `${reached}/${milestones.length}` : '—', icon: Trophy },
              { label: 'Trilhas concluídas', value: trails === null ? '—' : String(completedCourses.length), icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-[#172B43] border border-white/10 rounded-2xl p-4 text-center">
                <Icon className="w-5 h-5 text-[#E6BB66] mx-auto mb-2" /><p className="text-2xl font-bold">{value}</p><p className="text-xs text-[#ADBFCC] mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 space-y-6">
        <OverviewNotice loading={overview.trails.loading} error={overview.trails.error} onRetry={overview.reload} />
        <OverviewNotice loading={overview.goals.loading} error={overview.goals.error} onRetry={overview.reload} />
        <section>
          <h2 className="font-semibold mb-2">Marcos do seu aprendizado</h2>
          <p className="text-xs text-[#ADBFCC] mb-4">Calculados pelos registros atuais de aulas, trilhas e metas. Não representam um histórico de conquistas emitidas.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {milestones.map(item => (
              <div key={item.title} className={`rounded-2xl p-4 border bg-[#172B43] ${item.met === true ? 'border-[#E6BB66]' : 'border-white/10'}`}>
                <span className="text-2xl" aria-hidden="true">{item.icon}</span><h3 className="font-medium mt-2">{item.title}</h3>
                <p className="text-xs text-[#ADBFCC] mt-1">{item.description}</p>
                <p className={`text-xs mt-2 ${item.met === true ? 'text-[#E6BB66]' : 'text-[#ADBFCC]'}`}>{item.met === null ? 'Dados não disponíveis' : item.met ? 'Atingido' : 'Ainda não atingido'}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <div className="flex items-center justify-between mb-4 gap-3"><h2 className="font-semibold">Trilhas concluídas</h2><button type="button" onClick={() => onNavigate('courses')} className="text-sm text-[#E6BB66]">Ver cursos</button></div>
          {trails !== null && completedCourses.length === 0 && <p className="text-sm text-[#ADBFCC]">Nenhuma trilha concluída ainda.</p>}
          <div className="space-y-3">
            {completedCourses.map(course => (
              <div key={course.id} className="flex items-center gap-3 bg-[#172B43] border border-white/10 rounded-2xl p-4"><Award className="w-6 h-6 shrink-0 text-[#E6BB66]" /><div><h3 className="font-medium">{course.title}</h3><p className="text-xs text-[#ADBFCC] mt-1">Conclusão registrada · {course.completedLessons} aulas concluídas</p></div></div>
            ))}
          </div>
        </section>
        <section className="bg-[#172B43] border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold mb-4">Estatísticas de aprendizagem</h2>
          <dl className="space-y-4">
            {stats.map(([label, value]) => <div key={label} className="flex justify-between gap-4 text-sm"><dt className="text-[#ADBFCC]">{label}</dt><dd className="font-semibold">{trails === null ? '—' : value}</dd></div>)}
          </dl>
          <p className="text-xs text-[#ADBFCC] mt-5">Perguntas já acertadas podem incluir novas tentativas. Esses números não são uma taxa de acerto por tentativa. Tempo de estudo e emissão de certificados ainda não são fornecidos pela API.</p>
        </section>
      </main>
      <nav aria-label="Navegação principal" className="fixed bottom-0 left-0 right-0 bg-[#172B43] border-t border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-5 px-3 py-3">
          {navigation.map(({ screen, label, icon: Icon }) => <button key={screen} type="button" aria-current={screen === 'profile' ? 'page' : undefined} onClick={() => onNavigate(screen)} className={`flex flex-col items-center gap-1 ${screen === 'profile' ? 'text-[#E6BB66]' : 'text-[#ADBFCC]'}`}><Icon className="w-5 h-5" /><span className="text-xs">{label}</span></button>)}
        </div>
      </nav>
    </div>
  );
}
