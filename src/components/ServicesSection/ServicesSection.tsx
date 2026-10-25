import { motion } from "framer-motion";
import { Code2, Cable, Cpu, Layers } from "lucide-react";
import { MagicCard } from "../lightswind/magic-card";

const services = [
  {
    icon: Cable,
    title: "LAN & MikroTik Configuration",
    description: "Hands-on network setup with LAN cabling and MikroTik RB750/RB941 configuration.",
  },
  {
    icon: Cpu,
    title: "Computer & Laptop Support",
    description: "Computer servicing, troubleshooting, and practical technical support.",
  },
  {
    icon: Code2,
    title: "CLI Tools & Developer Utilities",
    description: "Practical terminal tools that support network testing, diagnostics, and technical workflows.",
  },
  {
    icon: Layers,
    title: "Web Application Development",
    description: "CLI and web projects built to make useful technical tools accessible and straightforward.",
  }
];

export const ServicesSection = () => {
  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-gradient-primary">
          What I Do
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Network configuration and IT support are my primary focus, complemented by coding projects that turn practical technical needs into useful tools.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <MagicCard
                className="min-h-[250px] rounded-[2rem] border border-border bg-card/90 p-8 shadow-lg dark:shadow-none"
              >
                <div className="flex flex-col h-full justify-between gap-6">
                  <div>
                    {/* Consistent Icon Styling with signature primary color */}
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 text-primary flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {service.description}
                    </p>
                  </div>
                </div>
              </MagicCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
