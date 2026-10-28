import { useState } from 'react';
import type { FormEvent } from 'react';

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Lock,
  LogOut,
  Shield,
  Users,
} from 'lucide-react';

import { changePassword } from '../services/api';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

type SettingsPage =
  | 'settings'
  | 'password'
  | 'privacy'
  | 'about'
  | 'team';

const pageTitles: Record<SettingsPage, string> = {
  settings: 'Configurações',
  password: 'Alterar senha',
  privacy: 'Privacidade e segurança',
  about: 'Sobre nós',
  team: 'Nossa equipe',
};

const teamMembers = [
  {
    name: 'Ana Carolina Brasiliano',
    registration: '759316',
  },
  {
    name: 'Cauê Freitas Silva dos Santos',
    registration: '761801',
  },
  {
    name: 'João Felix da Silva Nogueira',
    registration: '761240',
  },
  {
    name: 'Matheus Martinez Almeida',
    registration: '762336',
  },
  {
    name: 'Rafael Dantas da Silva',
    registration: '762203',
  },
];

const inputClassName =
  'w-full rounded-xl border border-white/10 bg-[#101E35] ' +
  'px-4 py-3 pr-12 text-white outline-none transition-colors ' +
  'focus:border-[#E6BB66] disabled:opacity-60';

const cardClassName =
  'rounded-2xl border border-white/10 bg-[#172B43] p-5';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'current-password' | 'new-password';
  disabled: boolean;
  minLength?: number;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  disabled,
  minLength,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-white"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required
          minLength={minLength}
          maxLength={72}
          disabled={disabled}
          className={inputClassName}
        />

        <button
          type="button"
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#ADBFCC] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E6BB66]"
        >
          {visible ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function SettingsScreen({
  onBack,
  onLogout,
}: SettingsScreenProps) {
  const [page, setPage] = useState<SettingsPage>('settings');

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  function clearPasswordFields() {
    setCurrentPassword('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  }

  function openPage(nextPage: SettingsPage) {
    clearPasswordFields();
    setPasswordChanged(false);
    setPage(nextPage);
  }

  function handleBack() {
    if (saving) return;

    if (passwordChanged) {
      onLogout();
      return;
    }

    if (page === 'settings') {
      onBack();
      return;
    }

    openPage('settings');
  }

  async function handleChangePassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (saving) return;

    setError('');

    if (!currentPassword || !password || !confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }

    if (
      password.length < 8 ||
      password.length > 72 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setError(
        'A nova senha deve ter entre 8 e 72 caracteres, com uma letra maiúscula, uma minúscula e um número.',
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('A confirmação da nova senha não coincide.');
      return;
    }

    if (currentPassword === password) {
      setError('A nova senha deve ser diferente da senha atual.');
      return;
    }

    setSaving(true);

    try {
      await changePassword({
        currentPassword,
        password,
        confirmPassword,
      });

      // Remove o token local somente após a confirmação do servidor.
      sessionStorage.removeItem('finedu_token');

      clearPasswordFields();
      setPasswordChanged(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível alterar a senha. Tente novamente.',
      );
    } finally {
      setSaving(false);
    }
  }

  const sections = [
    {
      title: 'Conta',
      items: [
        {
          icon: Lock,
          label: 'Alterar senha',
          destination: 'password' as const,
        },
        {
          icon: Shield,
          label: 'Privacidade e segurança',
          destination: 'privacy' as const,
        },
      ],
    },
    {
      title: 'Sobre nós',
      items: [
        {
          icon: Info,
          label: 'Descrição do projeto',
          destination: 'about' as const,
        },
        {
          icon: Users,
          label: 'Nossa equipe',
          destination: 'team' as const,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#101E35] pb-8 text-white">
      <header className="bg-[#172B43] px-5 py-6">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={saving}
            aria-label={
              passwordChanged
                ? 'Sair da conta'
                : page === 'settings'
                  ? 'Voltar ao perfil'
                  : 'Voltar às configurações'
            }
            className="rounded-lg p-2 text-[#ADBFCC] transition-colors hover:text-white disabled:opacity-50"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <h1 className="text-xl font-bold sm:text-2xl">
            {pageTitles[page]}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-5 pt-6">
        {page === 'settings' && (
          <>
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 px-2 text-sm font-semibold text-[#ADBFCC]">
                  {section.title}
                </h2>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#172B43]">
                  {section.items.map(
                    ({ icon: Icon, label, destination }, index) => (
                      <button
                        key={destination}
                        type="button"
                        onClick={() => openPage(destination)}
                        className={`flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-[#101E35]/50 ${
                          index < section.items.length - 1
                            ? 'border-b border-white/10'
                            : ''
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-5 w-5 shrink-0 text-[#E6BB66]" />
                          <span>{label}</span>
                        </span>

                        <ChevronRight className="h-5 w-5 shrink-0 text-[#ADBFCC]" />
                      </button>
                    ),
                  )}
                </div>
              </section>
            ))}

            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-[#172B43] p-4 text-red-400 transition-colors hover:border-red-400/50 hover:bg-red-400/10"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-semibold">Sair da conta</span>
            </button>

            <footer className="py-4 text-center text-sm text-[#ADBFCC]">
              <p>FinEdu v1.0.0</p>
              <p className="mt-1">Projeto acadêmico · 2026</p>
            </footer>
          </>
        )}

        {page === 'password' &&
          (passwordChanged ? (
            <section className={`${cardClassName} text-center`}>
              <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-[#E6BB66]" />

              <h2 className="mb-2 text-xl font-bold" role="status">
                Senha alterada com sucesso!
              </h2>

              <p className="mb-6 text-sm text-[#ADBFCC]">
                Entre novamente usando sua nova senha.
              </p>

              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-xl bg-[#E6BB66] px-5 py-3 font-semibold text-[#101E35] hover:bg-[#2BAAA0]"
              >
                Sair e entrar novamente
              </button>
            </section>
          ) : (
            <section className={cardClassName}>
              <h2 className="mb-2 text-lg font-semibold">
                Atualize sua senha
              </h2>

              <p className="mb-6 text-sm leading-relaxed text-[#ADBFCC]">
                Informe sua senha atual e escolha uma nova senha.
                Após a alteração, será necessário entrar novamente.
              </p>

              <form
                onSubmit={handleChangePassword}
                className="space-y-5"
              >
                <PasswordField
                  id="current-password"
                  label="Senha atual"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  autoComplete="current-password"
                  disabled={saving}
                />

                <PasswordField
                  id="new-password"
                  label="Nova senha"
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                  disabled={saving}
                  minLength={8}
                />

                <p className="text-xs leading-relaxed text-[#ADBFCC]">
                  Use entre 8 e 72 caracteres, incluindo uma letra
                  maiúscula, uma minúscula e um número.
                </p>

                <PasswordField
                  id="confirm-password"
                  label="Confirmar nova senha"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  autoComplete="new-password"
                  disabled={saving}
                  minLength={8}
                />

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E6BB66] px-5 py-3 font-semibold text-[#101E35] transition-colors hover:bg-[#2BAAA0] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  )}

                  {saving ? 'Salvando...' : 'Salvar nova senha'}
                </button>
              </form>
            </section>
          ))}

        {page === 'privacy' && (
          <section className={cardClassName}>
            <Shield className="mb-4 h-8 w-8 text-[#E6BB66]" />

            <h2 className="mb-3 text-lg font-semibold">
              Cuidados com sua conta
            </h2>

            <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-[#ADBFCC]">
              <li>
                Utilize uma senha exclusiva e não compartilhe suas
                credenciais.
              </li>
              <li>
                Ao acessar em um dispositivo compartilhado, use
                “Sair da conta” ao terminar.
              </li>
              <li>
                Caso esqueça sua senha, utilize a opção de
                recuperação disponível na tela de login.
              </li>
              <li>
                Não compartilhe links de recuperação de senha.
              </li>
            </ul>

            <p className="mt-5 text-xs text-[#ADBFCC]">
              Estas orientações não substituem uma política de
              privacidade.
            </p>
          </section>
        )}

        {page === 'about' && (
          <div className="space-y-5">
            <section className={cardClassName}>
              <BookOpen className="mb-4 h-9 w-9 text-[#E6BB66]" />

              <h2 className="mb-3 text-2xl font-bold">
                Conheça o FinEdu
              </h2>

              <p className="text-sm leading-relaxed text-[#ADBFCC]">
                O FinEdu é uma plataforma de educação financeira
                desenvolvida para tornar o aprendizado sobre
                finanças pessoais e investimentos mais simples,
                acessível e interativo, especialmente para jovens
                que desejam desenvolver uma relação mais consciente
                com o dinheiro.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-[#ADBFCC]">
                Por meio de recursos educativos, ferramentas
                financeiras e elementos de gamificação, buscamos
                incentivar hábitos financeiros saudáveis e
                proporcionar uma experiência de aprendizado prática
                e dinâmica.
              </p>

              <span className="mt-4 inline-block rounded-full bg-[#E6BB66]/10 px-3 py-1 text-xs font-medium text-[#E6BB66]">
                Projeto acadêmico
              </span>
            </section>

            <section className={cardClassName}>
              <h2 className="mb-3 text-lg font-semibold">
                Nossa missão
              </h2>

              <p className="text-sm leading-relaxed text-[#ADBFCC]">
                Democratizar o acesso à educação financeira,
                oferecendo conhecimentos e ferramentas que ajudem
                os jovens a compreender suas finanças, planejar
                objetivos e tomar decisões mais conscientes.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-[#ADBFCC]">
                Acreditamos que a educação financeira é fundamental
                para desenvolver autonomia, responsabilidade e
                segurança na administração dos recursos pessoais.
              </p>
            </section>

            <section className={cardClassName}>
              <h2 className="mb-3 text-lg font-semibold">
                Como funciona o FinEdu
              </h2>

              <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed text-[#ADBFCC]">
                <li>
                  <strong className="text-white">
                    Trilhas de aprendizagem:
                  </strong>{' '}
                  conteúdos organizados em etapas sobre organização
                  financeira, reserva de emergência e introdução aos
                  investimentos.
                </li>

                <li>
                  <strong className="text-white">
                    Gamificação:
                  </strong>{' '}
                  pontos de experiência (XP) para incentivar a
                  participação e reconhecer o progresso.
                </li>

                <li>
                  <strong className="text-white">
                    Ferramentas financeiras:
                  </strong>{' '}
                  metas e simulações para apoiar a compreensão dos
                  conceitos e o planejamento pessoal.
                </li>

                <li>
                  <strong className="text-white">
                    Acompanhamento do progresso:
                  </strong>{' '}
                  visualização da evolução nas atividades e trilhas
                  educacionais.
                </li>
              </ul>
            </section>

            <section className={cardClassName}>
              <h2 className="mb-3 text-lg font-semibold">
                Por que criamos o FinEdu?
              </h2>

              <p className="text-sm leading-relaxed text-[#ADBFCC]">
                A falta de familiaridade com conceitos financeiros
                pode dificultar o planejamento pessoal e as decisões
                relacionadas ao dinheiro. O FinEdu surgiu como uma
                proposta de aproximar a educação financeira do
                público jovem por meio da tecnologia.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-[#ADBFCC]">
                Nosso objetivo é demonstrar que aprender sobre
                dinheiro, economia e investimentos não precisa ser
                complicado, combinando teoria, prática e
                interatividade.
              </p>
            </section>

            <section className={cardClassName}>
              <h2 className="mb-3 text-lg font-semibold">
                Nosso compromisso
              </h2>

              <p className="text-sm leading-relaxed text-[#ADBFCC]">
                Buscamos proporcionar uma experiência educativa
                acessível, intuitiva e relevante. Os conteúdos e
                ferramentas possuem finalidade exclusivamente
                educacional e não constituem recomendações
                personalizadas ou consultoria de investimentos.
              </p>

              <p className="mt-4 font-medium text-[#E6BB66]">
                FinEdu — Conhecimento financeiro para construir
                o seu futuro.
              </p>
            </section>
          </div>
        )}

        {page === 'team' && (
          <div className="space-y-5">
            <section className={cardClassName}>
              <Users className="mb-4 h-9 w-9 text-[#E6BB66]" />

              <h2 className="mb-3 text-2xl font-bold">
                Nossa equipe
              </h2>

              <p className="text-sm leading-relaxed text-[#ADBFCC]">
                O FinEdu é resultado de um projeto acadêmico
                desenvolvido por cinco estudantes da área de
                tecnologia, que uniram conhecimentos, dedicação e
                criatividade para construir uma plataforma voltada
                à educação financeira de jovens.
              </p>

              <p className="mt-3 text-sm leading-relaxed text-[#ADBFCC]">
                Durante o desenvolvimento, a equipe aplicou os
                conhecimentos adquiridos na formação acadêmica,
                trabalhando de forma colaborativa para transformar
                uma ideia em uma solução com propósito educativo.
              </p>
            </section>

            <section aria-label="Integrantes da equipe">
              <div className="grid gap-3 sm:grid-cols-2">
                {teamMembers.map((member) => (
                  <article
                    key={member.registration}
                    className={cardClassName}
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#E6BB66]/10 text-lg font-bold text-[#E6BB66]">
                      {member.name.charAt(0)}
                    </div>

                    <h3 className="font-semibold">
                      {member.name}
                    </h3>

                    <p className="mt-1 text-sm text-[#ADBFCC]">
                      Matrícula: {member.registration}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className={cardClassName}>
              <p className="text-sm leading-relaxed text-[#ADBFCC]">
                O FinEdu representa a aplicação prática dos
                conhecimentos acadêmicos e o compromisso da equipe
                com a inovação, a colaboração e o desenvolvimento de
                soluções que contribuam positivamente para a
                sociedade.
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}