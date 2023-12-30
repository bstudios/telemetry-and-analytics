import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const AdamRMSInstallations = sqliteTable("adamrmsinstallations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  timestamp: integer("timestamp", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  rootUrl: text("rooturl").notNull(),
  version: text("version").notNull(),
  devMode: integer("devmode", { mode: "boolean" }).notNull().default(false),
  hidden: integer("hidden", { mode: "boolean" }).notNull().default(false),
  metaData: text("metadata", { mode: "json" })
    .$type<{
      instances: number | false;
      users: number | false;
      assets: number | false;
    }>()
    .default({ instances: false, users: false, assets: false }),
});
