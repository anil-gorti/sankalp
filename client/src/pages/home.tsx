import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Music, Share2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const SAMPLE_TESTIMONIALS: { name: string; text: string; relation: string }[] = [
  {
    name: "सुनीता जी",
    text: "माँ के जन्मदिन पर भेजा, वो रो पड़ीं। बहुत सुंदर भजन बना।",
    relation: "बेटी",
  },
  {
    name: "राकेश भाई",
    text: "गणेश चतुर्थी पर पूरे परिवार ने सुना। सबको बहुत पसंद आया!",
    relation: "परिवार",
  },
  {
    name: "प्रिया दीदी",
    text: "पति की नई नौकरी के लिए बनवाया। WhatsApp पर सबने शेयर किया।",
    relation: "पत्नी",
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI से बना भजन",
    desc: "आपकी प्रार्थना, आपके शब्दों में",
  },
  {
    icon: Music,
    title: "2 मिनट में तैयार",
    desc: "तुरंत सुनें और डाउनलोड करें",
  },
  {
    icon: Share2,
    title: "WhatsApp पर भेजें",
    desc: "प्रियजनों को आशीर्वाद भेजें",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-bg.png)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />

        <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/10">
              <Sparkles className="w-3 h-3 mr-1" />
              व्यक्तिगत भजन
            </Badge>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-white mb-3 font-serif leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            अपना आशीर्वाद,
            <br />
            अपनी प्रार्थना
          </motion.h1>

          <motion.p
            className="text-white/80 text-base sm:text-lg mb-8 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            किसी भी अवसर के लिए 2 मिनट में
            <br />
            व्यक्तिगत भजन बनाएं
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button
              size="lg"
              onClick={() => setLocation("/create")}
              className="text-lg px-8 bg-primary text-primary-foreground border-primary-border"
              data-testid="button-create-blessing"
            >
              आशीर्वाद बनाएं
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>

          <motion.p
            className="text-white/50 text-sm mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Your Blessing, Your Prayer
          </motion.p>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-20 max-w-lg mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
            >
              <Card className="p-3 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-md bg-primary/10 flex items-center justify-center" data-testid={`icon-feature-${i}`}>
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-medium leading-tight" data-testid={`text-feature-title-${i}`}>{feature.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{feature.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-10 pb-12 max-w-lg mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-center">
          लोगों का अनुभव
        </h2>
        <div className="space-y-3">
          {SAMPLE_TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.15 }}
            >
              <Card className="p-4" data-testid={`card-testimonial-${i}`}>
                <p className="text-sm text-muted-foreground italic mb-2" data-testid={`text-testimonial-${i}`}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.relation}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center pb-8 px-4">
        <Button
          size="lg"
          onClick={() => setLocation("/create")}
          className="w-full max-w-sm text-lg bg-primary text-primary-foreground border-primary-border"
          data-testid="button-create-blessing-bottom"
        >
          अभी भजन बनाएं
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
