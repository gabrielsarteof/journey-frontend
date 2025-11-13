import { motion, type Variants } from 'framer-motion'

export function StartHint() {
  const hintVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.3,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1],
      }
    },
    exit: {
      opacity: 0,
      scale: 0.3,
      transition: {
        duration: 0.25,
        ease: [0.6, 0, 0.8, 0.4],
      }
    }
  }

  const floatVariants: Variants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  }

  return (
    <motion.div
      className="relative mb-2"
      variants={hintVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ originY: 1 }}
    >
      <motion.div variants={floatVariants} animate="animate">
        <div
          className="speech-bubble-bottom rounded-2xl px-6 py-3 border-2 border-border-secondary transition-colors"
          style={{
            backgroundColor: 'var(--color-surface)',
            '--arrow-size': '10px',
            '--border-color': 'var(--color-border-secondary)',
            '--bg-color': 'var(--color-surface)'
          } as React.CSSProperties}
        >
          <p className="text-secondary font-bold text-xl uppercase tracking-wide">
            COMEÇAR
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
