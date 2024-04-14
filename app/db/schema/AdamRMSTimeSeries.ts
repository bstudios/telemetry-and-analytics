import { relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { AdamRMSInstallations } from "./AdamRMSInstallations";

// Used to track growth of an installation over time
export const AdamRMSTimeSeries = sqliteTable("adamrmstimeseries", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  installationId: integer("installationId"),
  version: text("version").notNull(),
  metaData: text("metadata", { mode: "json" })
    .$type<{
      instances: number | false;
      users: number | false;
      assets: number | false;
    }>()
    .default({ instances: false, users: false, assets: false }),
});

export const postsRelations = relations(AdamRMSTimeSeries, ({ one }) => ({
  installation: one(AdamRMSInstallations, {
    fields: [AdamRMSTimeSeries.installationId],
    references: [AdamRMSInstallations.id],
  }),
}));
