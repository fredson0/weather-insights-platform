import { motion } from 'framer-motion';

interface StormBackgroundProps {
  imageUrl?: string;
}

export function StormBackground({ imageUrl = "/storm-clouds.png" }: StormBackgroundProps) {
  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: '120% 120%',
          backgroundPosition: 'center',
        }}
        animate={{
          backgroundPosition: [
            '50% 50%',
            '45% 48%',
            '52% 52%',
            '48% 50%',
            '50% 50%'
          ],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: '125% 125%',
          backgroundPosition: 'center',
          mixBlendMode: 'soft-light',
        }}
        animate={{
          scale: [1, 1.02, 1.01, 1.03, 1],
          opacity: [0.3, 0.4, 0.35, 0.4, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundSize: '130% 130%',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay',
        }}
        animate={{
          backgroundPosition: [
            '50% 50%',
            '55% 52%',
            '48% 48%',
            '52% 50%',
            '50% 50%'
          ],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-transparent to-slate-950/50"
        animate={{ opacity: [0.6, 0.7, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(15,23,42,0.6)_100%)]" />

      <motion.div
        className="absolute inset-0 bg-blue-200/5 pointer-events-none"
        animate={{
          opacity: [0, 0, 0, 0.08, 0, 0, 0, 0, 0.05, 0, 0, 0, 0, 0, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
