import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, Lock, Bell, Shield, Moon, Sun, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useState } from 'react';

type SettingsItem =
  | { icon: LucideIcon; label: string; toggle?: false; action: () => void }
  | { icon: LucideIcon; label: string; toggle: true; value: boolean; onChange: () => void };

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export default function SettingsScreen({ onBack, onLogout }: SettingsScreenProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: 'Conta',
      items: [
        { icon: Lock, label: 'Alterar senha', action: () => {} },
        { icon: Shield, label: 'Privacidade e segurança', action: () => {} },
      ],
    },
    {
      title: 'Preferências',
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: 'Tema escuro',
          toggle: true,
          value: darkMode,
          onChange: () => setDarkMode(!darkMode),
        },
        {
          icon: Bell,
          label: 'Notificações',
          toggle: true,
          value: notifications,
          onChange: () => setNotifications(!notifications),
        },
      ],
    },
    {
      title: 'Suporte',
      items: [
        { icon: HelpCircle, label: 'Central de ajuda', action: () => {} },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="bg-[#1E1E1E] px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="text-[#B3B3B3] hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
        </div>
      </div>

      <div className="px-6 pt-6 space-y-6">
        {settingsSections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-[#B3B3B3] text-sm font-semibold mb-3 px-2">{section.title}</h3>
            <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl overflow-hidden">
              {section.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  onClick={item.toggle ? item.onChange : item.action}
                  className={`w-full flex items-center justify-between p-4 hover:bg-[#0F0F0F]/50 transition-colors ${
                    itemIdx !== section.items.length - 1 ? 'border-b border-white/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#B3B3B3]" />
                    <span className="text-white">{item.label}</span>
                  </div>
                  {item.toggle ? (
                    <div
                      className={`w-12 h-6 rounded-full transition-colors ${
                        item.value ? 'bg-[#4ADE80]' : 'bg-[#0F0F0F]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full m-0.5 transition-transform ${
                          item.value ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#B3B3B3]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={onLogout}
          className="w-full bg-[#1E1E1E] border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-3 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Sair da conta</span>
        </button>

        <div className="text-center text-[#B3B3B3] text-sm py-4">
          <p>FinEdu v1.0.0</p>
          <p className="mt-1">© 2026 Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
}
