"use client";

import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import { LoginForm } from "@/components/login-form";
import Link from "next/link";
import { Activity, Brain, FileText, ArrowRight, CheckCircle2, Shield, Users, Sparkles } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

function FloatingBadge({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={cn("absolute backdrop-blur-xl bg-white/90 shadow-2xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3 text-sm font-semibold text-slate-700", className)}
    >
      {children}
    </motion.div>
  );
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function LandingPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden selection:bg-teal-100 selection:text-teal-900">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-teal-600 origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Navbar - Glassmorphism */}
      <nav className="fixed top-0 w-full z-40 bg-white/70 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-teal-600 to-emerald-500 rounded-lg p-1.5 shadow-lg shadow-teal-500/20">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Cravey
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-500">
             <Link href="#features" className="hover:text-teal-600 transition-colors">Science</Link>
             <Link href="#privacy" className="hover:text-teal-600 transition-colors">Privacy</Link>
          </div>
          <Link href="/login" className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/20">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3], 
              scale: [1, 1.1, 1] 
            }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" 
          />
           <motion.div 
            animate={{ 
              y: [0, 30, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Hero Content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>New: Intelligent Pattern Analysis</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                Break the cycle, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
                  master your mind.
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl text-slate-600 leading-relaxed max-w-lg">
                The first medical-grade cessation tool that adapts to your biology. Track cravings, identify triggers, and recover with clinical precision.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-slate-${i * 100 + 100} shadow-sm bg-[url('/placeholder-avatar-${i}.jpg')] flex items-center justify-center bg-slate-200`}>
                        <Users className="h-4 w-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                  <p>Trusted by 2,000+ recovering patients</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Simulated App / Form */}
            <div className="relative">
              {/* Floating Elements */}
              <FloatingBadge className="-top-8 -left-8 md:-left-12 z-20" delay={1}>
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                High Craving Detected
              </FloatingBadge>
              
              <FloatingBadge className="top-1/2 -right-12 z-20" delay={1.4}>
                <div className="h-8 w-8 rounded bg-teal-100 flex items-center justify-center text-teal-600">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-normal">Insight</div>
                  <div>Stress trigger identified</div>
                </div>
              </FloatingBadge>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, type: "spring" }}
                className="relative bg-white rounded-3xl p-8 shadow-2xl border border-slate-100/50 backdrop-blur-sm z-10"
              >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">Sign in</h3>
                    <p className="text-slate-500">Access your recovery dashboard</p>
                  </div>
                  <LoginForm />
                  <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> AES-256 Encrypted</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> HIPAA Compliant</span>
                  </div>
              </motion.div>

               {/* Background Card Offset */}
               <div className="absolute inset-0 bg-gradient-to-tr from-teal-500 to-blue-500 rounded-3xl transform rotate-3 translate-x-2 translate-y-2 opacity-20 -z-10 blur-sm" />
            </div>
          </div>
        </div>
      </section>


      {/* Moving Text Streamer (Marquee) */}
      <div className="w-full overflow-hidden bg-slate-900 py-3 mb-20 whitespace-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="inline-block text-white/80 text-sm font-mono tracking-wider"
        >
          {Array(10).fill(" SCIENCE-BACKED RECOVERY • REAL-TIME TRACKING • TRIGGER ANALYSIS • SECURE EXPORT • ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>

      {/* Bento Grid Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">Built for human nature.</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Recovery isn&apos;t linear. Our tools are designed to catch you when you stumble and push you when you soar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-rows-2 h-auto md:h-[600px]">
          {/* Large Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 md:row-span-2 rounded-3xl bg-slate-900 text-white p-10 flex flex-col justify-between overflow-hidden relative group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-teal-400">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Neural Pattern Recognition</h3>
              <p className="text-slate-400 max-w-md">Our algorithm analyzes your logs to find hidden correlations between your environment, mood, and cravings.</p>
            </div>
            
            {/* Abstract Chart Visualization */}
            <div className="absolute right-0 bottom-0 w-3/4 h-2/3 opacity-30 group-hover:opacity-50 transition-opacity">
               <div className="flex items-end gap-2 h-full p-8">
                  {[40, 70, 45, 90, 60, 80, 50, 95, 30, 60].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                      className="flex-1 bg-gradient-to-t from-teal-500 to-transparent rounded-t-lg"
                    />
                  ))}
               </div>
            </div>
          </motion.div>

          {/* Small Card 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-3xl bg-teal-50 p-8 border border-teal-100 flex flex-col justify-center"
          >
            <TrendingUpIcon className="h-8 w-8 text-teal-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Visual Streaks</h3>
            <p className="text-sm text-slate-600">Gamified progress tracking that rewards consistency without shaming setbacks.</p>
          </motion.div>

          {/* Small Card 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm flex flex-col justify-center group"
          >
            <div className="flex justify-between items-start mb-4">
               <FileText className="h-8 w-8 text-blue-600" />
               <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-600 -rotate-45 group-hover:rotate-0 transition-all duration-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Doctor Ready</h3>
            <p className="text-sm text-slate-600">Export HIPAA-friendly reports in PDF or CSV formats instantly.</p>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
           <p>© 2026 Cravey Health Inc.</p>
           <div className="flex gap-6 mt-4 md:mt-0">
             <Link href="#" className="hover:text-slate-900">Terms</Link>
             <Link href="#" className="hover:text-slate-900">Privacy</Link>
             <Link href="#" className="hover:text-slate-900">Contact</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
  );
}
