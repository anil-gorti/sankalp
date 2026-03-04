import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSongSchema } from "@shared/schema";
import { generateLyrics } from "./lyrics";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/songs", async (req, res) => {
    try {
      const parsed = insertSongSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
      }

      const song = await storage.createSong(parsed.data);

      res.json(song);

      generateLyrics(song).catch((err) => {
        console.error("Lyrics generation failed for song", song.id, err);
      });
    } catch (error) {
      console.error("Error creating song:", error);
      res.status(500).json({ error: "Failed to create song" });
    }
  });

  app.get("/api/songs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid song ID" });
      }
      const song = await storage.getSong(id);
      if (!song) {
        return res.status(404).json({ error: "Song not found" });
      }
      res.json(song);
    } catch (error) {
      console.error("Error fetching song:", error);
      res.status(500).json({ error: "Failed to fetch song" });
    }
  });

  app.get("/api/songs", async (req, res) => {
    try {
      const songs = await storage.getRecentSongs(20);
      res.json(songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ error: "Failed to fetch songs" });
    }
  });

  return httpServer;
}
