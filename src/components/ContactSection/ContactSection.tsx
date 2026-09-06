import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { Input } from "../lightswind/input";
import { Textarea } from "../lightswind/textarea";
import { Button } from "../lightswind/button";

export const ContactSection = () => {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [invalidAttempt, setInvalidAttempt] = useState(0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      setInvalidAttempt((attempt) => attempt + 1);
      setStatus({ type: "error", message: "Please complete all fields with valid information." });
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      const response = await fetch("https://formsubmit.co/ajax/neverlabs4@gmail.com", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: new FormData(form),
      });

      if (!response.ok) {
        throw new Error(`FormSubmit request failed with status ${response.status}`);
      }

      form.reset();
      setStatus({ type: "success", message: "Your message was sent successfully. Thank you for reaching out." });
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setStatus({ type: "error", message: "Your message could not be sent. Please try again or email me directly." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="glass-panel p-8 md:p-12 rounded-[3rem] border border-foreground/10 relative overflow-hidden"
      >
        {/* Background Gradients */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-12 md:gap-24">
          
          {/* Contact Info */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Let's <span className="text-gradient-primary">Connect</span>
              </h2>
              <p className="text-muted-foreground">
                Open to collaboration around developer tools, web applications, networking, and open-source projects.
                Feel free to reach out with an idea or technical challenge.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:neverlabs4@gmail.com" className="font-medium">neverlabs4@gmail.com</a>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <a href="https://wa.me/6285894030512" target="_blank" rel="noreferrer" className="font-medium">+62 858-9403-0512</a>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-medium">Depok, Jawa Barat, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 glass-panel p-8 rounded-[2rem] border border-foreground/10 relative">
            <form
              className="space-y-5"
              action="https://formsubmit.co/ajax/neverlabs4@gmail.com"
              method="POST"
              onSubmit={handleSubmit}
              onInvalid={(event) => {
                event.preventDefault();
                setInvalidAttempt((attempt) => attempt + 1);
                setStatus({ type: "error", message: "Please complete all fields with valid information." });
              }}
            >
              <input type="hidden" name="_subject" value="New portfolio contact message" />
              <input type="hidden" name="_template" value="table" />
              <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Your Name</label>
                <Input 
                  type="text" 
                  name="name"
                  required
                  minLength={2}
                  className="rounded-xl py-3 px-4 bg-foreground/5 border-foreground/10 text-foreground focus-visible:ring-primary placeholder:text-muted-foreground/50"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Your Email</label>
                <Input 
                  type="email" 
                  name="email"
                  required
                  className="rounded-xl py-3 px-4 bg-foreground/5 border-foreground/10 text-foreground focus-visible:ring-primary placeholder:text-muted-foreground/50"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Message</label>
                <Textarea 
                  rows={4}
                  name="message"
                  required
                  minLength={10}
                  className="rounded-xl py-3 px-4 bg-foreground/5 border-foreground/10 text-foreground focus-visible:ring-primary resize-none placeholder:text-muted-foreground/50 min-h-[120px]"
                  placeholder="How can I help you?"
                />
              </div>

              <Button type="submit" disabled={isSending} size="lg" className="relative w-full overflow-hidden rounded-xl bg-primary text-primary-foreground font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] mt-4 h-12">
                <span>{isSending ? "Sending..." : "Send Message"}</span>
                <motion.span
                  key={`${isSending}-${invalidAttempt}`}
                  className="inline-flex items-center"
                  initial={status?.type === "error" ? { x: 0, y: 0, rotate: 0 } : false}
                  animate={
                    status?.type === "error" && !isSending
                      ? { x: [0, -4, 4, -3, 3, 0], y: [0, 0, 0, 0, 0, 0], rotate: 0 }
                      : isSending
                        ? { y: [8, -2, 8], opacity: [0.2, 1, 0.2], rotate: -12 }
                        : { y: 0, opacity: 1, rotate: 0 }
                  }
                  transition={
                    invalidAttempt && !isSending
                      ? { duration: 0.45 }
                      : { duration: 1.1, repeat: isSending ? Infinity : 0, ease: "easeInOut" }
                  }
                >
                  <Send className="w-4 h-4 ml-1" />
                </motion.span>
              </Button>
              {status && (
                <p role="status" className={`text-sm ${status.type === "success" ? "text-emerald-500" : "text-destructive"}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>

        </div>
      </motion.div>
    </section>
  );
};
