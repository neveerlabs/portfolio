import { ScrollTimeline } from "../lightswind/scroll-timeline";
import { Briefcase, Award, Layers, Users, Globe } from "lucide-react";

export const CareerTimeline = () => {
  const careerEvents = [
    {
      year: "2025 – Present",
      title: "Open-Source Contributor",
      subtitle: "",
      description:
        "Actively building and publishing open-source CLI tools and web applications on GitHub under @neveerlabs.",
      icon: <Globe className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "7 Oct – 7 Dec 2025",
      title: "IT Support (PKL)",
      subtitle: "",
      description:
        "Completed an internship at Boss Comp, Pertigaan Cikidang, providing computer servicing and troubleshooting support.",
      icon: <Layers className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "Jul – Aug 2026",
      title: "PASKIBRA Coach",
      subtitle: "",
      description:
        "Trained students for the flag-hoisting ceremony, strengthening my instructional communication, discipline, and leadership skills.",
      icon: <Briefcase className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "2026",
      title: "UKK Certification",
      subtitle: "",
      description:
        "Earned the Uji Kompetensi Keahlian (UKK) certification at SMK Bumi Riyadhutholibin.",
      icon: <Award className="h-4 w-4 mr-2 text-primary" />,
    },
    {
      year: "2026",
      title: "Information Technology Student",
      subtitle: "",
      description:
        "Started studying Information Technology at Universitas Terbuka while continuing to build and ship practical software projects.",
      icon: <Users className="h-4 w-4 mr-2 text-primary" />,
    },
  ];

  return (
    <div id="career">
      <ScrollTimeline
        events={careerEvents}
        title="Experience Timeline"
        subtitle="A practical path through technical support, leadership, education, and open source"
        animationOrder="staggered"
        cardAlignment="alternating"
        cardVariant="elevated"
        parallaxIntensity={0.15}
        revealAnimation="fade"
        progressIndicator={true}
        lineColor="bg-primary/20"
        activeColor="bg-primary"
        progressLineWidth={3}
        progressLineCap="round"
      />
    </div>
  );
};
