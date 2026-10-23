import { useState } from 'react';

import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import OnboardingScreen from './components/OnboardingScreen';
import DashboardScreen from './components/DashboardScreen';
import CoursesScreen from './components/CoursesScreen';
import LessonScreen from './components/LessonScreen';
import SimulatorScreen from './components/SimulatorScreen';
import GoalsScreen from './components/GoalsScreen';
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';

import { getTrails } from './services/api';
import type {
  Goal,
  User,
  UserProgress,
} from './services/api';

const initialUserData = {
  name: '',
  email: '',
  investorProfile: 'não definido',
  xp: 0,
  level: 1,
  completedCourses: 0,
  streak: 0,
};

export default function App() {
  const [resetToken, setResetToken] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('resetToken');
  });

  const [currentScreen, setCurrentScreen] = useState(() =>
    resetToken !== null ? 'reset-password' : 'splash',
  );

  const [selectedLessonId, setSelectedLessonId] =
    useState<string | null>(null);

  const [selectedGoal, setSelectedGoal] =
    useState<Goal | null>(null);

  const [userData, setUserData] = useState(initialUserData);

  const navigateTo = (screen: string) => {
    // A navegação comum abre uma simulação independente.
    setSelectedGoal(null);
    setCurrentScreen(screen);
  };

  const updateUserData = (user: User) => {
    setUserData({
      name: user.name,
      email: user.email,
      investorProfile: user.investorProfile
        ? user.investorProfile.toLowerCase()
        : 'não definido',
      xp: user.xp,
      level: user.level,
      completedCourses: 0,
      streak: user.streak,
    });
  };

  const refreshCompletedCourses = async () => {
    const token = sessionStorage.getItem('finedu_token');

    if (!token) return;

    try {
      const trails = await getTrails();

      if (sessionStorage.getItem('finedu_token') !== token) {
        return;
      }

      setUserData((current) => ({
        ...current,
        completedCourses: trails.filter(
          (trail) => trail.status === 'COMPLETED',
        ).length,
      }));
    } catch (error) {
      console.error(
        'Não foi possível atualizar os cursos concluídos.',
        error,
      );
    }
  };

  const handleUserProgressUpdate = (progress: UserProgress) => {
    setUserData((current) => ({
      ...current,
      xp: progress.xp,
      level: progress.level,
    }));

    void refreshCompletedCourses();
  };

  const handleLogin = (user: User) => {
    updateUserData(user);
    navigateTo('dashboard');

    void refreshCompletedCourses();
  };

  const handleSignup = (user: User) => {
    updateUserData(user);
    navigateTo('onboarding');
  };

  const handleOpenLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    navigateTo('lesson');
  };

  const handleSimulateGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setCurrentScreen('simulator');
  };

  const handleBackToLogin = () => {
    const url = new URL(window.location.href);

    url.searchParams.delete('resetToken');
    window.history.replaceState(null, '', url.toString());

    setResetToken(null);
    setSelectedLessonId(null);
    setSelectedGoal(null);
    setUserData(initialUserData);

    navigateTo('login');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('finedu_token');
    setSelectedLessonId(null);
    setSelectedGoal(null);
    setUserData(initialUserData);

    navigateTo('splash');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onStart={() => navigateTo('login')}
          />
        );

      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onSignup={() => navigateTo('signup')}
            onForgotPassword={() =>
              navigateTo('forgot-password')
            }
          />
        );

      case 'forgot-password':
        return (
          <ForgotPasswordScreen
            onBack={() => navigateTo('login')}
          />
        );

      case 'reset-password':
        return (
          <ResetPasswordScreen
            token={resetToken ?? ''}
            onBackToLogin={handleBackToLogin}
          />
        );

      case 'signup':
        return (
          <SignupScreen
            onSignup={handleSignup}
            onBack={() => navigateTo('login')}
          />
        );

      case 'onboarding':
        return (
          <OnboardingScreen
            onComplete={() => navigateTo('dashboard')}
          />
        );

      case 'dashboard':
        return (
          <DashboardScreen
            userData={userData}
            onNavigate={navigateTo}
          />
        );

      case 'courses':
        return (
          <CoursesScreen
            userData={userData}
            onNavigate={navigateTo}
            onBack={() => navigateTo('dashboard')}
            onOpenLesson={handleOpenLesson}
            onUserProgressUpdate={handleUserProgressUpdate}
          />
        );

      case 'lesson':
        if (!selectedLessonId) {
          return (
            <CoursesScreen
              userData={userData}
              onNavigate={navigateTo}
              onBack={() => navigateTo('dashboard')}
              onOpenLesson={handleOpenLesson}
              onUserProgressUpdate={handleUserProgressUpdate}
            />
          );
        }

        return (
          <LessonScreen
            key={selectedLessonId}
            lessonId={selectedLessonId}
            onBack={() => navigateTo('courses')}
            onNavigate={navigateTo}
            onOpenLesson={handleOpenLesson}
            onUserProgressUpdate={handleUserProgressUpdate}
          />
        );

      case 'simulator':
        return (
          <SimulatorScreen
            key={selectedGoal?.id ?? 'independent-simulation'}
            goal={selectedGoal}
            onBack={() =>
              navigateTo(selectedGoal ? 'goals' : 'dashboard')
            }
            onNavigate={navigateTo}
          />
        );

      case 'goals':
        return (
          <GoalsScreen
            onBack={() => navigateTo('dashboard')}
            onNavigate={navigateTo}
            onSimulateGoal={handleSimulateGoal}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            userData={userData}
            onNavigate={navigateTo}
          />
        );

      case 'settings':
        return (
          <SettingsScreen
            onBack={() => navigateTo('profile')}
            onLogout={handleLogout}
          />
        );

      default:
        return (
          <SplashScreen
            onStart={() => navigateTo('login')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      {renderScreen()}
    </div>
  );
}