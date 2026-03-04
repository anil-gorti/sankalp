import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Share2,
  Download,
  Plus,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { DEITIES, OCCASIONS, RELATIONS, type Song } from "@shared/schema";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SongPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: song, isLoading, refetch } = useQuery<Song>({
    queryKey: ["/api/songs", id],
  });

  useEffect(() => {
    if (song?.status === "generating") {
      const interval = setInterval(() => refetch(), 3000);
      return () => clearInterval(interval);
    }
  }, [song?.status, refetch]);

  const deityData = DEITIES.find((d) => d.id === song?.deity);
  const occasionData = OCCASIONS.find((o) => o.id === song?.occasion);
  const relationData = RELATIONS.find((r) => r.id === song?.recipientRelation);

  const handleCopyLyrics = async () => {
    if (song?.generatedLyrics) {
      await navigator.clipboard.writeText(song.generatedLyrics);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "कॉपी हो गया!", description: "गीत के बोल कॉपी हो गए" });
    }
  };

  const handleWhatsAppShare = () => {
    if (!song?.generatedLyrics) return;
    const text = `${song.recipientName} के लिए विशेष भजन\n\n${song.generatedLyrics}\n\nSankalp - अपना आशीर्वाद, अपनी प्रार्थना`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleNativeShare = async () => {
    if (!song?.generatedLyrics) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${song.recipientName} के लिए भजन`,
          text: song.generatedLyrics,
        });
      } catch {}
    } else {
      handleWhatsAppShare();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-lg mx-auto space-y-4 pt-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-48 w-full rounded-md" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm">
          <p className="text-lg font-medium mb-2">भजन नहीं मिला</p>
          <p className="text-sm text-muted-foreground mb-4">Song not found</p>
          <Button onClick={() => setLocation("/")} data-testid="button-go-home">
            वापस जाएं
          </Button>
        </Card>
      </div>
    );
  }

  if (song.status === "generating" || song.status === "pending") {
    return <GeneratingState song={song} deityData={deityData} />;
  }

  if (song.status === "failed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm">
          <p className="text-lg font-medium mb-2">भजन बनाने में त्रुटि</p>
          <p className="text-sm text-muted-foreground mb-4">
            कृपया पुनः प्रयास करें
          </p>
          <Button onClick={() => setLocation("/create")} data-testid="button-try-again">
            फिर से बनाएं
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-sm font-medium flex-1">आपका भजन तैयार है</h1>
        </div>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            {deityData && (
              <div className="h-40 relative overflow-hidden">
                <img
                  src={deityData.image}
                  alt={deityData.labelEn}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-xl font-serif font-bold">
                    {song.recipientName} के लिए भजन
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/10 text-xs">
                      {deityData.label}
                    </Badge>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/10 text-xs">
                      {occasionData?.label}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {relationData?.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground italic mt-2">
                संकल्प: "{song.userSankalp}"
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold">भजन के बोल</h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCopyLyrics}
                data-testid="button-copy-lyrics"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="whitespace-pre-wrap text-sm leading-relaxed font-serif text-foreground/90" data-testid="text-lyrics">
              {song.generatedLyrics}
            </div>
          </Card>
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            className="w-full text-base bg-[#25D366] text-white border-[#25D366]"
            size="lg"
            onClick={handleWhatsAppShare}
            data-testid="button-whatsapp-share"
          >
            <Share2 className="w-4 h-4 mr-2" />
            WhatsApp पर भेजें
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={handleNativeShare}
              data-testid="button-share"
            >
              <Share2 className="w-4 h-4 mr-2" />
              शेयर करें
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/create")}
              data-testid="button-create-another"
            >
              <Plus className="w-4 h-4 mr-2" />
              एक और बनाएं
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function GeneratingState({
  song,
  deityData,
}: {
  song: Song;
  deityData?: (typeof DEITIES)[number];
}) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        className="text-center max-w-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {deityData && (
          <motion.div
            className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary/20"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <img
              src={deityData.image}
              alt={deityData.labelEn}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
        </motion.div>

        <h2 className="text-xl font-serif font-semibold mb-2">
          आपका आशीर्वाद तैयार हो रहा है{dots}
        </h2>
        <p className="text-sm text-muted-foreground mb-1">
          {song.recipientName} के लिए भजन लिखा जा रहा है
        </p>
        <p className="text-xs text-muted-foreground">
          Your blessing is being prepared
        </p>

        <div className="mt-8">
          <div className="w-48 mx-auto">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                style={{ width: "40%" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
