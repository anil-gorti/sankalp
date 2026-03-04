import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  RELATIONS,
  OCCASIONS,
  DEITIES,
  LANGUAGES,
} from "@shared/schema";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Heart,
  BookOpen,
  Briefcase,
  Flame,
  HandHeart,
  HeartHandshake,
  Home,
  User,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ICON_MAP: Record<string, any> = {
  Sparkles,
  Heart,
  BookOpen,
  Briefcase,
  Flame,
  HandHeart,
  HeartHandshake,
  Home,
};

const STEPS = [
  { id: 1, title: "किसके लिए?", titleEn: "Who is this for?" },
  { id: 2, title: "अवसर", titleEn: "Occasion" },
  { id: 3, title: "परंपरा", titleEn: "Tradition" },
  { id: 4, title: "आपका संकल्प", titleEn: "Your Prayer" },
  { id: 5, title: "पुष्टि", titleEn: "Confirm" },
];

export default function CreateSong() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [recipientRelation, setRecipientRelation] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPronunciation, setRecipientPronunciation] = useState("");
  const [occasion, setOccasion] = useState("");
  const [deity, setDeity] = useState("");
  const [language, setLanguage] = useState("hindi_classical");
  const [userSankalp, setUserSankalp] = useState("");

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/songs", {
        recipientName,
        recipientPronunciation: recipientPronunciation || undefined,
        recipientRelation,
        occasion,
        deity,
        language,
        userSankalp,
      });
      return res.json();
    },
    onSuccess: (data: any) => {
      setLocation(`/song/${data.id}`);
    },
    onError: () => {
      toast({
        title: "कुछ गलत हो गया",
        description: "कृपया पुनः प्रयास करें",
        variant: "destructive",
      });
    },
  });

  const canProceed = () => {
    switch (step) {
      case 1:
        return recipientRelation && recipientName.trim();
      case 2:
        return occasion;
      case 3:
        return deity;
      case 4:
        return userSankalp.trim().length >= 5;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else createMutation.mutate();
  };

  const progress = (step / 5) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => (step > 1 ? setStep(step - 1) : setLocation("/"))}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-sm font-medium">{STEPS[step - 1].title}</p>
              <span className="text-xs text-muted-foreground">
                {step}/5
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <StepRecipient
                relation={recipientRelation}
                setRelation={setRecipientRelation}
                name={recipientName}
                setName={setRecipientName}
                pronunciation={recipientPronunciation}
                setPronunciation={setRecipientPronunciation}
              />
            )}
            {step === 2 && (
              <StepOccasion occasion={occasion} setOccasion={setOccasion} />
            )}
            {step === 3 && (
              <StepTradition
                deity={deity}
                setDeity={setDeity}
                language={language}
                setLanguage={setLanguage}
              />
            )}
            {step === 4 && (
              <StepSankalp sankalp={userSankalp} setSankalp={setUserSankalp} />
            )}
            {step === 5 && (
              <StepReview
                recipientName={recipientName}
                recipientRelation={recipientRelation}
                occasion={occasion}
                deity={deity}
                language={language}
                userSankalp={userSankalp}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="sticky bottom-0 bg-background/95 backdrop-blur border-t px-4 py-4">
        <div className="max-w-lg mx-auto">
          <Button
            className="w-full text-base bg-primary text-primary-foreground border-primary-border"
            size="lg"
            disabled={!canProceed() || createMutation.isPending}
            onClick={handleNext}
            data-testid="button-next-step"
          >
            {createMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                तैयार हो रहा है...
              </span>
            ) : step === 5 ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                भजन बनाएं
              </span>
            ) : (
              <span className="flex items-center gap-2">
                आगे बढ़ें
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}

function StepRecipient({
  relation,
  setRelation,
  name,
  setName,
  pronunciation,
  setPronunciation,
}: {
  relation: string;
  setRelation: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  pronunciation: string;
  setPronunciation: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">ये किसके लिए है?</h2>
        <p className="text-sm text-muted-foreground">रिश्ता चुनें</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {RELATIONS.map((r) => (
          <Badge
            key={r.id}
            variant={relation === r.id ? "default" : "outline"}
            className={`cursor-pointer text-sm py-1.5 px-3 ${
              relation === r.id
                ? "bg-primary text-primary-foreground border-primary-border"
                : ""
            }`}
            onClick={() => setRelation(r.id)}
            data-testid={`badge-relation-${r.id}`}
          >
            {relation === r.id && <Check className="w-3 h-3 mr-1" />}
            {r.label}
          </Badge>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">
            उनका नाम <span className="text-muted-foreground">(Their name)</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="जैसे: कमला, राहुल, प्रिया"
            className="text-base"
            data-testid="input-recipient-name"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">
            उच्चारण{" "}
            <span className="text-muted-foreground">(Pronunciation - optional)</span>
          </label>
          <Input
            value={pronunciation}
            onChange={(e) => setPronunciation(e.target.value)}
            placeholder="जैसे: kuh-muh-laa"
            className="text-base"
            data-testid="input-pronunciation"
          />
          <p className="text-xs text-muted-foreground mt-1">
            ताकि भजन में नाम सही बोला जाए
          </p>
        </div>
      </div>
    </div>
  );
}

function StepOccasion({
  occasion,
  setOccasion,
}: {
  occasion: string;
  setOccasion: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">अवसर क्या है?</h2>
        <p className="text-sm text-muted-foreground">
          किस मौके पर भजन चाहिए?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {OCCASIONS.map((o) => {
          const Icon = ICON_MAP[o.icon] || Sparkles;
          const isSelected = occasion === o.id;
          return (
            <Card
              key={o.id}
              className={`p-4 cursor-pointer transition-all hover-elevate ${
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => setOccasion(o.id)}
              data-testid={`card-occasion-${o.id}`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">{o.label}</p>
                  <p className="text-[10px] text-muted-foreground">{o.labelEn}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function StepTradition({
  deity,
  setDeity,
  language,
  setLanguage,
}: {
  deity: string;
  setDeity: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">परंपरा चुनें</h2>
        <p className="text-sm text-muted-foreground">
          किस देवता का आशीर्वाद चाहते हैं?
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {DEITIES.map((d) => {
          const isSelected = deity === d.id;
          return (
            <Card
              key={d.id}
              className={`p-3 cursor-pointer transition-all hover-elevate ${
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : ""
              }`}
              onClick={() => setDeity(d.id)}
              data-testid={`card-deity-${d.id}`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-16 h-16 rounded-md overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.labelEn}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs font-medium">{d.label}</p>
                  <p className="text-[10px] text-muted-foreground">{d.labelEn}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">
          भाषा/शैली <span className="text-muted-foreground">(Language)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <Badge
              key={l.id}
              variant={language === l.id ? "default" : "outline"}
              className={`cursor-pointer text-sm py-1.5 px-3 ${
                language === l.id
                  ? "bg-primary text-primary-foreground border-primary-border"
                  : ""
              }`}
              onClick={() => setLanguage(l.id)}
              data-testid={`badge-language-${l.id}`}
            >
              {language === l.id && <Check className="w-3 h-3 mr-1" />}
              {l.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepSankalp({
  sankalp,
  setSankalp,
}: {
  sankalp: string;
  setSankalp: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">आपका संकल्प</h2>
        <p className="text-sm text-muted-foreground">
          आप उनके लिए क्या प्रार्थना करते हैं?
        </p>
      </div>

      <Textarea
        value={sankalp}
        onChange={(e) => setSankalp(e.target.value.slice(0, 200))}
        placeholder="जैसे: माँ की सेहत जल्दी ठीक हो, बेटा की नौकरी पक्की हो, घर में सुख शांति रहे..."
        className="text-base min-h-[140px] resize-none"
        data-testid="textarea-sankalp"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          अपने दिल की बात लिखें
        </p>
        <span className="text-xs text-muted-foreground">
          {sankalp.length}/200
        </span>
      </div>

      <Card className="p-4 bg-primary/5 border-primary/10">
        <p className="text-xs font-medium mb-2 text-primary">
          उदाहरण (Examples):
        </p>
        <div className="space-y-2">
          {[
            "माँ की सेहत जल्दी ठीक हो",
            "बेटा की नौकरी पक्की हो",
            "घर में सुख शांति रहे",
            "परीक्षा में अच्छे अंक आएं",
          ].map((example) => (
            <button
              key={example}
              className="block text-left text-sm text-muted-foreground hover-elevate rounded-md px-2 py-1 w-full"
              onClick={() => setSankalp(example)}
              data-testid={`button-example-${example.slice(0, 10)}`}
            >
              "{example}"
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StepReview({
  recipientName,
  recipientRelation,
  occasion,
  deity,
  language,
  userSankalp,
}: {
  recipientName: string;
  recipientRelation: string;
  occasion: string;
  deity: string;
  language: string;
  userSankalp: string;
}) {
  const relationLabel = RELATIONS.find((r) => r.id === recipientRelation)?.label || "";
  const occasionData = OCCASIONS.find((o) => o.id === occasion);
  const deityData = DEITIES.find((d) => d.id === deity);
  const langLabel = LANGUAGES.find((l) => l.id === language)?.label || "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">पुष्टि करें</h2>
        <p className="text-sm text-muted-foreground">
          सब कुछ सही है? भजन बनाने के लिए तैयार!
        </p>
      </div>

      <Card className="overflow-hidden">
        {deityData && (
          <div className="h-32 relative overflow-hidden">
            <img
              src={deityData.image}
              alt={deityData.labelEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            <div className="absolute bottom-3 left-4">
              <p className="text-white font-semibold text-lg">{deityData.label}</p>
            </div>
          </div>
        )}
        <div className="p-4 space-y-3">
          <ReviewRow label="किसके लिए" value={`${recipientName} (${relationLabel})`} />
          <ReviewRow label="अवसर" value={occasionData?.label || ""} />
          <ReviewRow label="भाषा" value={langLabel} />
          <div>
            <p className="text-xs text-muted-foreground mb-1">आपका संकल्प</p>
            <p className="text-sm font-medium italic">"{userSankalp}"</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
