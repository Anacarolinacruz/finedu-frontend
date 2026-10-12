import { TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#4ADE80] opacity-20 blur-3xl rounded-full"></div>
          <div className="relative bg-[#1E1E1E] p-8 rounded-3xl border border-[#4ADE80]/20">
            <TrendingUp className="w-20 h-20 text-[#4ADE80]" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">FinEdu</h1>
        <p className="text-[#B3B3B3] text-center mb-12 max-w-xs">
          Sua jornada para a liberdade financeira começa aqui
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="w-full max-w-sm bg-[#4ADE80] text-[#0F0F0F] px-8 py-4 rounded-2xl font-semibold hover:bg-[#22C55E] transition-colors"
        >
          Começar
        </motion.button>

        <div className="flex items-center gap-6 mt-12">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#4ADE80]" />
            <span className="text-sm text-[#B3B3B3]">Aprenda</span>
          </div>
          <div className="w-1 h-1 bg-[#4ADE80] rounded-full"></div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#4ADE80]" />
            <span className="text-sm text-[#B3B3B3]">Invista</span>
          </div>
          <div className="w-1 h-1 bg-[#4ADE80] rounded-full"></div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#4ADE80]" />
            <span className="text-sm text-[#B3B3B3]">Cresça</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
