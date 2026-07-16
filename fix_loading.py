with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace('import { motion } from "motion/react";', 'import { motion, AnimatePresence } from "motion/react";')

old_state = """  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);"""

new_state = """  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    // Simulate loading time for the premium feel
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);"""

content = content.replace(old_state, new_state)

old_return = """  return (
    <div className="min-h-screen bg-[#1a0f0a] text-white">"""

new_return = """  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0604]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <Logo variant="vertical" size="lg" className="brightness-200 contrast-125 grayscale-[0.2]" />
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#1a0f0a] text-white">"""

content = content.replace(old_return, new_return)

# Close the fragment at the end
content = content.replace('    </div>\n  );\n}\n', '    </div>\n    </>\n  );\n}\n')

with open("src/App.tsx", "w") as f:
    f.write(content)

