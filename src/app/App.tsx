import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import OnboardingScreen from './components/OnboardingScreen';
import DashboardScreen from './components/DashboardScreen';
import CoursesScreen from './components/CoursesScreen';
import LessonScreen from './components/LessonScreen';
import SimulatorScreen from './components/SimulatorScreen';
import GoalsScreen from './components/GoalsScreen';
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';
import type { User } from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');

  const [userData, setUserData] = useState({
    name: 'Maria Silva',
    email: 'maria@email.com',
    investorProfile: 'moderado',
    xp: 1250,
    level: 5,
    completedCourses: 3,
    streak: 7,
  });

  const navigateTo = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleLogin = (user: User) => {
    setUserData((currentUserData) => ({
      ...currentUserData,
      name: user.name,
      email: user.email,
    }));

    navigateTo('dashboard');
  };

  const handleSignup = (user: User) => {
  setUserData((currentUserData) => ({
    ...currentUserData,
    name: user.name,
    email: user.email,
    investorProfile: user.investorProfile
      ? user.investorProfile.toLowerCase()
      : 'não definido',
    xp: user.xp,
    level: user.level,
    completedCourses: 0,
    streak: user.streak,
  }));

  navigateTo('onboarding');
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
    />
  );

      case 'lesson':
        return (
          <LessonScreen
            onBack={() => navigateTo('courses')}
            onNavigate={navigateTo}
          />
        );

      case 'simulator':
        return (
          <SimulatorScreen
            onBack={() => navigateTo('dashboard')}
            onNavigate={navigateTo}
          />
        );

      case 'goals':
        return (
          <GoalsScreen
            onBack={() => navigateTo('dashboard')}
            onNavigate={navigateTo}
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
            onLogout={() => navigateTo('splash')}
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