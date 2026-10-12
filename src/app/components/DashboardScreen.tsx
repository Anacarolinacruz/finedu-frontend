import { Home, BookOpen, TrendingUp, Target, User, Flame, Trophy, Star, ChevronRight, Play } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardScreenProps {
  userData: any;
  onNavigate: (screen: string) => void;
}

export default function DashboardScreen({ userData, onNavigate }: DashboardScreenProps) {
  const growthData = [
    { month: 'Jan', value: 1000 },
    { month: 'Fev', value: 1200 },
    { month: 'Mar', value: 1500 },
    { month: 'Abr', value: 1800 },
    { month: 'Mai', value: 2200 },
  ];

  const coursesData = [
    { name: 'Concluído', value: 30, color: '#4ADE80' },
    { name: 'Em progresso', value: 45, color: '#22C55E' },
    { name: 'A fazer', value: 25, color: '#1E1E1E' },
  ];

  const courses = [
    { id: 1, title: 'Educação Financeira Básica', progress: 80, duration: '2h 30min', level: 'Iniciante' },
    { id: 2, title: 'Reserva de Emergência', progress: 45, duration: '1h 45min', level: 'Iniciante' },
    { id: 3, title: 'Como Investir', progress: 20, duration: '3h 15min', level: 'Intermediário' },
  ];

  const goals = [
    { id: 1, title: 'Comprar Notebook', current: 1200, target: 3000, icon: '💻' },
    { id: 2, title: 'Fazer Intercâmbio', current: 5000, target: 15000, icon: '✈️' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] pb-24">
      <div className="bg-gradient-to-b from-[#1E1E1E] to-[#0F0F0F] px-6 pt-8 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#4ADE80] rounded-full flex items-center justify-center text-[#0F0F0F] font-bold">
              {userData.name.charAt(0)}
            </div>
            <div>
              <p className="text-[#B3B3B3] text-sm">Olá,</p>
              <h2 className="text-white font-semibold">{userData.name}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#4ADE80]/10 border border-[#4ADE80] px-4 py-2 rounded-full">
            <Flame className="w-4 h-4 text-[#4ADE80]" />
            <span className="text-[#4ADE80] font-semibold">{userData.streak} dias</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4">
            <Star className="w-5 h-5 text-[#4ADE80] mb-2" />
            <p className="text-2xl font-bold text-white">{userData.xp}</p>
            <p className="text-xs text-[#B3B3B3]">XP Total</p>
          </div>
          <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4">
            <Trophy className="w-5 h-5 text-[#4ADE80] mb-2" />
            <p className="text-2xl font-bold text-white">Nível {userData.level}</p>
            <p className="text-xs text-[#B3B3B3]">Ranking</p>
          </div>
          <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4">
            <BookOpen className="w-5 h-5 text-[#4ADE80] mb-2" />
            <p className="text-2xl font-bold text-white">{userData.completedCourses}</p>
            <p className="text-xs text-[#B3B3B3]">Cursos</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-6">
        <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Evolução Patrimonial</h3>
            <span className="text-[#4ADE80] text-sm">+R$ 1.200</span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#B3B3B3" fontSize={12} />
              <YAxis stroke="#B3B3B3" fontSize={12} />
              <Area type="monotone" dataKey="value" stroke="#4ADE80" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Cursos em Progresso</h3>
            <button onClick={() => onNavigate('courses')} className="text-[#4ADE80] text-sm flex items-center gap-1">
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => onNavigate('lesson')}
                className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 hover:border-[#4ADE80]/50 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Play className="w-6 h-6 text-[#4ADE80]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-white font-medium mb-1">{course.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-[#B3B3B3]">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#0F0F0F] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4ADE80] rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#4ADE80] font-medium">{course.progress}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Minhas Metas</h3>
            <button onClick={() => onNavigate('goals')} className="text-[#4ADE80] text-sm flex items-center gap-1">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{goal.title}</h4>
                    <p className="text-sm text-[#B3B3B3]">
                      R$ {goal.current.toLocaleString()} / R$ {goal.target.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#0F0F0F] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4ADE80] rounded-full"
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#4ADE80] font-medium">
                    {Math.round((goal.current / goal.target) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E1E1E] border-t border-white/10 px-6 py-3">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center gap-1 text-[#4ADE80]">
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => onNavigate('courses')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <BookOpen className="w-6 h-6" />
            <span className="text-xs">Desafios</span>
          </button>
          <button onClick={() => onNavigate('simulator')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Investir</span>
          </button>
          <button onClick={() => onNavigate('goals')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <Target className="w-6 h-6" />
            <span className="text-xs">Metas</span>
          </button>
          <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1 text-[#B3B3B3] hover:text-white transition-colors">
            <User className="w-6 h-6" />
            <span className="text-xs">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
