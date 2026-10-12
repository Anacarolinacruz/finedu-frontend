import { Home, BookOpen, TrendingUp, Target, User, Settings, Award, Star, Trophy, Flame, ChevronRight } from 'lucide-react';

interface ProfileScreenProps {
  userData: any;
  onNavigate: (screen: string) => void;
}

export default function ProfileScreen({ userData, onNavigate }: ProfileScreenProps) {
  const achievements = [
    { id: 1, title: 'Primeira Aula', description: 'Complete sua primeira aula', icon: '🎓', unlocked: true },
    { id: 2, title: 'Sequência de 7 dias', description: 'Mantenha 7 dias consecutivos', icon: '🔥', unlocked: true },
    { id: 3, title: 'Primeira Meta', description: 'Crie sua primeira meta financeira', icon: '🎯', unlocked: true },
    { id: 4, title: 'Investidor Iniciante', description: 'Complete o curso de investimentos', icon: '📈', unlocked: false },
    { id: 5, title: 'Mestre Financeiro', description: 'Complete todos os cursos', icon: '👑', unlocked: false },
    { id: 6, title: 'Sequência de 30 dias', description: 'Mantenha 30 dias consecutivos', icon: '💯', unlocked: false },
  ];

  const completedCourses = [
    { id: 1, title: 'Educação Financeira Básica', completedAt: '2026-04-15', certificate: true },
    { id: 2, title: 'Reserva de Emergência', completedAt: '2026-05-01', certificate: true },
    { id: 3, title: 'Controle de Gastos', completedAt: '2026-05-10', certificate: true },
  ];

  const levelProgress = ((userData.xp % 500) / 500) * 100;

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-24">
      <div className="bg-gradient-to-b from-[#1E1E1E] to-[#0F0F0F] px-6 pt-8 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Perfil</h1>
          <button onClick={() => onNavigate('settings')} className="w-10 h-10 bg-[#1E1E1E] border border-white/10 rounded-full flex items-center justify-center hover:border-[#4ADE80]/50 transition-colors">
            <Settings className="w-5 h-5 text-[#B3B3B3]" />
          </button>
        </div>

        <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#4ADE80] to-[#22C55E] rounded-full flex items-center justify-center text-[#0F0F0F] text-3xl font-bold">
              {userData.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">{userData.name}</h2>
              <p className="text-[#B3B3B3] text-sm">{userData.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="px-3 py-1 bg-[#4ADE80]/10 border border-[#4ADE80] rounded-full">
                  <span className="text-[#4ADE80] text-xs font-medium">
                    Investidor {userData.investorProfile}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#B3B3B3]">Nível {userData.level}</span>
              <span className="text-sm text-white font-medium">{userData.xp} XP</span>
            </div>
            <div className="h-3 bg-[#0F0F0F] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-xs text-[#B3B3B3] text-center">
              Faltam {500 - (userData.xp % 500)} XP para o próximo nível
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-[#4ADE80]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5 text-[#4ADE80]" />
            </div>
            <p className="text-2xl font-bold text-white">{userData.streak}</p>
            <p className="text-xs text-[#B3B3B3]">Dias seguidos</p>
          </div>
          <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-[#4ADE80]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-[#4ADE80]" />
            </div>
            <p className="text-2xl font-bold text-white">{achievements.filter(a => a.unlocked).length}</p>
            <p className="text-xs text-[#B3B3B3]">Conquistas</p>
          </div>
          <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 text-center">
            <div className="w-10 h-10 bg-[#4ADE80]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Star className="w-5 h-5 text-[#4ADE80]" />
            </div>
            <p className="text-2xl font-bold text-white">{userData.completedCourses}</p>
            <p className="text-xs text-[#B3B3B3]">Cursos</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div>
          <h3 className="text-white font-semibold mb-4">Conquistas</h3>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-2xl p-4 text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-[#1E1E1E] border border-[#4ADE80]'
                    : 'bg-[#1E1E1E] border border-white/10 opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 text-2xl ${
                  achievement.unlocked ? 'bg-[#4ADE80]/10' : 'bg-[#0F0F0F] grayscale'
                }`}>
                  {achievement.icon}
                </div>
                <p className="text-xs text-white font-medium mb-1">{achievement.title}</p>
                <p className="text-xs text-[#B3B3B3] leading-tight">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Certificados</h3>
            <button className="text-[#4ADE80] text-sm flex items-center gap-1">
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {completedCourses.map((course) => (
              <div key={course.id} className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-[#4ADE80]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium mb-1">{course.title}</p>
                  <p className="text-sm text-[#B3B3B3]">
                    Concluído em {new Date(course.completedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button className="px-4 py-2 bg-[#4ADE80]/10 border border-[#4ADE80] rounded-xl text-[#4ADE80] text-sm font-medium hover:bg-[#4ADE80]/20 transition-colors flex-shrink-0">
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Estatísticas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[#B3B3B3]">Tempo total de estudo</span>
              <span className="text-white font-semibold">12h 30min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#B3B3B3]">Aulas assistidas</span>
              <span className="text-white font-semibold">34 aulas</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#B3B3B3]">Quizzes completados</span>
              <span className="text-white font-semibold">18 quizzes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#B3B3B3]">Taxa de acerto</span>
              <span className="text-[#4ADE80] font-semibold">87%</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-white/10 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => onNavigate('courses')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Cursos</span>
          </button>
          <button onClick={() => onNavigate('simulator')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Investir</span>
          </button>
          <button onClick={() => onNavigate('goals')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <Target className="w-6 h-6" />
            <span className="text-xs">Metas</span>
          </button>
          <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1 text-[#4ADE80]">
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
