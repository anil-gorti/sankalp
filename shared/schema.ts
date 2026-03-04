import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const songs = pgTable("songs", {
  id: serial("id").primaryKey(),
  recipientName: text("recipient_name").notNull(),
  recipientPronunciation: text("recipient_pronunciation"),
  recipientRelation: text("recipient_relation").notNull(),
  occasion: text("occasion").notNull(),
  deity: text("deity").notNull(),
  language: text("language").notNull().default("hindi_classical"),
  userSankalp: text("user_sankalp").notNull(),
  generatedLyrics: text("generated_lyrics"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertSongSchema = createInsertSchema(songs).omit({
  id: true,
  generatedLyrics: true,
  status: true,
  createdAt: true,
});

export type InsertSong = z.infer<typeof insertSongSchema>;
export type Song = typeof songs.$inferSelect;

export const RELATIONS = [
  { id: "myself", label: "खुद के लिए", labelEn: "Myself" },
  { id: "mother", label: "माँ", labelEn: "Mother" },
  { id: "father", label: "पिता", labelEn: "Father" },
  { id: "spouse", label: "पति/पत्नी", labelEn: "Spouse" },
  { id: "child", label: "बच्चा", labelEn: "Child" },
  { id: "sibling", label: "भाई/बहन", labelEn: "Sibling" },
  { id: "friend", label: "मित्र", labelEn: "Friend" },
  { id: "elder", label: "बड़े", labelEn: "Elder" },
] as const;

export const OCCASIONS = [
  { id: "daily_blessing", label: "दैनिक आशीर्वाद", labelEn: "Daily Blessing", icon: "Sparkles" },
  { id: "recovery", label: "स्वास्थ्य लाभ", labelEn: "Recovery", icon: "Heart" },
  { id: "exam_success", label: "परीक्षा सफलता", labelEn: "Exam Success", icon: "BookOpen" },
  { id: "new_job", label: "नया काम / व्यापार", labelEn: "New Job", icon: "Briefcase" },
  { id: "festival", label: "त्योहार शुभकामना", labelEn: "Festival Greeting", icon: "Flame" },
  { id: "gratitude", label: "आभार / धन्यवाद", labelEn: "Gratitude", icon: "HandHeart" },
  { id: "wedding", label: "विवाह आशीर्वाद", labelEn: "Wedding Blessing", icon: "HeartHandshake" },
  { id: "new_home", label: "गृह प्रवेश", labelEn: "New Home", icon: "Home" },
] as const;

export const DEITIES = [
  { id: "ganesh", label: "गणेश जी", labelEn: "Ganesh Ji", image: "/images/ganesh.png" },
  { id: "hanuman", label: "हनुमान जी", labelEn: "Hanuman Ji", image: "/images/hanuman.png" },
  { id: "krishna", label: "कृष्ण जी", labelEn: "Krishna Ji", image: "/images/krishna.png" },
  { id: "shiva", label: "शिव जी", labelEn: "Shiv Ji", image: "/images/shiva.png" },
  { id: "durga", label: "दुर्गा माँ", labelEn: "Durga Maa", image: "/images/durga.png" },
] as const;

export const LANGUAGES = [
  { id: "hindi_classical", label: "हिंदी (शास्त्रीय)", labelEn: "Hindi (Classical)" },
  { id: "hindi_bhojpuri", label: "हिंदी (भोजपुरी)", labelEn: "Hindi (Bhojpuri style)" },
] as const;
