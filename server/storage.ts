import { db } from "./db";
import { songs, type Song, type InsertSong } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createSong(song: InsertSong): Promise<Song>;
  getSong(id: number): Promise<Song | undefined>;
  updateSongLyrics(id: number, lyrics: string): Promise<Song | undefined>;
  updateSongStatus(id: number, status: string): Promise<Song | undefined>;
  getRecentSongs(limit?: number): Promise<Song[]>;
}

export class DatabaseStorage implements IStorage {
  async createSong(song: InsertSong): Promise<Song> {
    const [created] = await db.insert(songs).values(song).returning();
    return created;
  }

  async getSong(id: number): Promise<Song | undefined> {
    const [song] = await db.select().from(songs).where(eq(songs.id, id));
    return song;
  }

  async updateSongLyrics(id: number, lyrics: string): Promise<Song | undefined> {
    const [updated] = await db
      .update(songs)
      .set({ generatedLyrics: lyrics, status: "completed" })
      .where(eq(songs.id, id))
      .returning();
    return updated;
  }

  async updateSongStatus(id: number, status: string): Promise<Song | undefined> {
    const [updated] = await db
      .update(songs)
      .set({ status })
      .where(eq(songs.id, id))
      .returning();
    return updated;
  }

  async getRecentSongs(limit = 10): Promise<Song[]> {
    return db.select().from(songs).orderBy(desc(songs.createdAt)).limit(limit);
  }
}

export const storage = new DatabaseStorage();
