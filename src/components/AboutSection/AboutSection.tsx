import { motion } from "framer-motion";
import { Code2, Globe2, Layout, Users } from "lucide-react";

const stats = [
  { icon: <Layout className="w-6 h-6" />, label: "Projects Published", value: "23+" },
  { icon: <Code2 className="w-6 h-6" />, label: "GitHub Contributions", value: "953+" },
  { icon: <Users className="w-6 h-6" />, label: "Professional Certification", value: "1" },
  { icon: <Globe2 className="w-6 h-6" />, label: "Building Since", value: "2025" },
];

export const AboutSection = () => {
  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        className="flex flex-col md:flex-row gap-16 items-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Building <span className="text-gradient-primary">Useful Tools</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I am a software engineer focused on building CLI tools and modern web applications. I create
              developer utilities that simplify complex workflows, from network testing to database management,
              and ship them as polished, deployable products. Currently a student at Universitas Terbuka, I
              actively build and publish open-source projects on GitHub.
            </p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="glass-panel p-6 rounded-2xl border border-foreground/10 hover:border-primary/50 transition-colors group relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
              <div className="text-primary mb-4 p-3 bg-primary/10 w-max rounded-xl">
                {stat.icon}
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
