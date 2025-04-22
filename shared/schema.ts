import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Cache model to track API cache entries
export const cacheEntries = pgTable("cache_entries", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  expires_at: timestamp("expires_at").notNull(),
  hits: integer("hits").default(0).notNull(),
});

export const insertCacheEntrySchema = createInsertSchema(cacheEntries).pick({
  key: true,
  expires_at: true,
});

// API Request Log model
export const apiLogs = pgTable("api_logs", {
  id: serial("id").primaryKey(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  status_code: integer("status_code").notNull(),
  response_time: integer("response_time").notNull(), // in milliseconds
  cache_hit: boolean("cache_hit").default(false).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  user_agent: text("user_agent"),
  ip_address: text("ip_address"),
});

export const insertApiLogSchema = createInsertSchema(apiLogs).omit({
  id: true,
});

// Cryptocurrency model
export const cryptocurrencies = pgTable("cryptocurrencies", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  current_price: real("current_price"),
  price_change_24h: real("price_change_24h"),
  last_updated: timestamp("last_updated").defaultNow().notNull(),
  market_cap: real("market_cap"),
  volume_24h: real("volume_24h"),
  metadata: jsonb("metadata"),
});

export const insertCryptocurrencySchema = createInsertSchema(cryptocurrencies).omit({
  id: true,
});

// Historical Price data for cryptocurrencies
export const historicalPrices = pgTable("historical_prices", {
  id: serial("id").primaryKey(),
  cryptocurrency_id: integer("cryptocurrency_id").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  price: real("price").notNull(),
  volume: real("volume"),
});

export const insertHistoricalPriceSchema = createInsertSchema(historicalPrices).omit({
  id: true,
});

// Performance metrics for API monitoring
export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  avg_response_time: integer("avg_response_time").notNull(), // in milliseconds
  cache_hit_rate: real("cache_hit_rate").notNull(), // percentage
  requests_per_second: real("requests_per_second").notNull(),
  error_rate: real("error_rate").notNull(), // percentage
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).omit({
  id: true,
});

// Export type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type CacheEntry = typeof cacheEntries.$inferSelect;
export type InsertCacheEntry = z.infer<typeof insertCacheEntrySchema>;

export type ApiLog = typeof apiLogs.$inferSelect;
export type InsertApiLog = z.infer<typeof insertApiLogSchema>;

export type Cryptocurrency = typeof cryptocurrencies.$inferSelect;
export type InsertCryptocurrency = z.infer<typeof insertCryptocurrencySchema>;

export type HistoricalPrice = typeof historicalPrices.$inferSelect;
export type InsertHistoricalPrice = z.infer<typeof insertHistoricalPriceSchema>;

export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
