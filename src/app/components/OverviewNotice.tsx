import { Loader2 } from 'lucide-react';

interface Props { loading: boolean; error: string; onRetry: () => void }
export default function OverviewNotice({ loading, error, onRetry }: Props) {
  if (loading) return <p role="status" className="flex items-center gap-2 py-4 text-sm text-[#ADBFCC]"><Loader2 className="w-5 h-5 animate-spin" />Carregando…</p>;
  if (!error) return null;
  return <div role="alert" className="border border-red-400/30 rounded-xl p-4 my-3"><p className="text-sm text-red-300">{error}</p><button type="button" onClick={onRetry} className="text-sm text-[#E6BB66] mt-2">Tentar novamente</button></div>;
}
