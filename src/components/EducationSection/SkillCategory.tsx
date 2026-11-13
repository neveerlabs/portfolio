import { motion, AnimatePresence } from "framer-motion";
import {
  Atom,
  Server,
  Code2,
  Palette,
  Braces,
  Database,
  Crown,
  Brain,
  HeartHandshake,
  Lightbulb,
  Rocket,
} from "lucide-react";

export default function ProfessionalProfile() {
  const languageDistribution = [
    { name: "Dart", share: 97.86, icon: Atom, color: "text-cyan-400" },
    { name: "TypeScript", share: 86.36, icon: Code2, color: "text-sky-400" },
    { name: "Python", share: 65.84, icon: Server, color: "text-blue-400" },
    { name: "JavaScript", share: 43.64, icon: Code2, color: "text-yellow-400" },
    { name: "CSS", share: 17.20, icon: Palette, color: "text-purple-400" },
    { name: "HTML", share: 13.92, icon: Braces, color: "text-orange-400" },
    { name: "PL/pgSQL", share: 5.73, icon: Database, color: "text-amber-400" },
    { name: "C++", share: 1.03, icon: Code2, color: "text-muted-foreground" },
    { name: "Dockerfile", share: 0.32, icon: Server, color: "text-muted-foreground" },
    { name: "Java", share: 0.14, icon: Code2, color: "text-muted-foreground" },
    { name: "C", share: 0.07, icon: Code2, color: "text-muted-foreground" },
  ];

  const toolsByCategory = [
    {
      name: "Frontend",
      tools: ["React", "Next.js", "Vite", "Tailwind CSS", "Three.js"],
    },
    {
      name: "Backend & Data",
      tools: ["Node.js", "Express.js", "Flask", "Supabase", "PostgreSQL", "MySQL", "SQLite"],
    },
    {
      name: "Desktop & AI",
      tools: ["Flutter", "CustomTkinter", "aiogram", "Gemini API"],
    },
    {
      name: "Systems & Network",
      tools: ["LAN & Cabling", "MikroTik RB750 / RB941", "Linux Diagnostics"],
    },
  ];

  const softSkills = [
    { name: "Leadership", icon: Crown, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { name: "Adaptability", icon: Brain, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
    { name: "Problem Solving", icon: Brain, color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
    { name: "Technical Communication", icon: HeartHandshake, color: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
    { name: "Continuous Learning", icon: Lightbulb, color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  ];

  return (
    <motion.section
      id="skills"
      className="space-y-8"
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.3 },
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Code2 className="w-5 h-5" />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Expertise & Skills</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-8">
        {/* Technical Skills */}
        <div className="glass-panel p-8 rounded-[2rem] border border-foreground/15 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
            <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" /> Technical Arsenal
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
              Per-language Average
            </span>
          </div>

          <p className="text-xs text-muted-foreground -mt-4 mb-6">
            Average share per language, calculated only from repositories where it appears.
          </p>

          <div className="space-y-5">
            {languageDistribution.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <div key={i} className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-foreground flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-foreground/5 border border-foreground/10">
                        <Icon className={`w-4 h-4 ${skill.color}`} />
                      </div>
                      {skill.name}
                    </span>
                    <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full text-xs border border-primary/20">
                      {skill.share.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden border border-border/40 p-[1px]">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 via-primary to-sky-400 rounded-full relative shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.share}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Soft Skills & Traits */}
        <div className="glass-panel p-8 rounded-[2rem] border border-foreground/15 shadow-xl flex flex-col">
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
              <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" /> Professional Traits
              </h4>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
                Core Competencies
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <AnimatePresence>
                {softSkills.map((skill, i) => {
                  const Icon = skill.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.08 }}
                      viewport={{ once: true }}
                      className={`px-4 py-2.5 rounded-2xl border text-sm font-semibold flex items-center gap-2 shadow-sm hover:scale-105 transition-transform cursor-default ${skill.color}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{skill.name}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <div className="mt-7 pt-6 border-t border-border/60 space-y-4">
              <h5 className="text-sm font-bold text-foreground">Frameworks & Tools</h5>
              {toolsByCategory.map((category) => (
                <div key={category.name} className="space-y-2">
                  <h6 className="text-xs font-semibold text-muted-foreground">{category.name}</h6>
                  <div className="flex flex-wrap gap-2">
                    {category.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-xs font-medium text-foreground"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/60">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent border border-primary/20 flex items-start gap-3.5 shadow-sm">
              <div className="p-2 rounded-xl bg-primary/20 text-primary shrink-0 mt-0.5">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-foreground font-bold text-sm block mb-0.5">
                  Constant Learner & Tools Builder
                </strong>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Applying networking and IT support fundamentals while continuing to build practical CLI and web projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
