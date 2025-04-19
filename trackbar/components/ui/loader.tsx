"use client"

import { motion } from "framer-motion"
import { Portal } from "./portal"
import { Logo } from "./logo"
import { useEffect } from "react"

interface LoaderProps {
  isLoading: boolean
}

const Loader = ({ isLoading }: LoaderProps) => {
  if (!isLoading) return null

  return (
    <Portal>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="relative aspect-square w-[280px] overflow-hidden rounded-full bg-quokka-purple shadow-xl backdrop-blur-sm flex items-center justify-center before:absolute before:inset-0 before:rounded-full before:border-[3px] before:border-transparent before:border-t-cyan-500 before:animate-spin"
        >
          <Logo size={280} loading={true} />
        </motion.div>
      </motion.div>
    </Portal>
  )
}

export default Loader
