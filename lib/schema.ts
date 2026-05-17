import {
  pgTable,
  uuid,
  text,
  timestamp,
  numeric,
  integer,
  boolean,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============ Better Auth Tables ============
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  name: text("name"),
  image: text("image"),
  whatsappNumber: text("whatsapp_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ============ Core Domain ============
export const accountTypeEnum = pgEnum("account_type", [
  "bank",
  "ewallet",
  "cash",
  "credit_card",
]);

export const financialAccounts = pgTable("financial_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  type: accountTypeEnum("type").notNull(),
  currency: text("currency").default("IDR").notNull(),
  balance: numeric("balance", { precision: 18, scale: 2 }).default("0").notNull(),
  isDefault: boolean("is_default").default(false),
  archivedAt: timestamp("archived_at"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const merchants = pgTable("merchants", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category"),
  isGlobal: boolean("is_global").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  icon: text("icon"),
  color: text("color"),
  type: text("type").notNull(), // 'expense' | 'income'
  isDefault: boolean("is_default").default(false),
});

// ============ Flows (the graph edges) ============
export const flowTypeEnum = pgEnum("flow_type", [
  "expense",
  "income",
  "transfer",
  "receivable",
  "payable",
  "settlement",
]);

export const flows = pgTable("flows", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: flowTypeEnum("type").notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  currency: text("currency").default("IDR").notNull(),
  occurredAt: timestamp("occurred_at").notNull(),

  sourceType: text("source_type"), // 'account' | 'contact' | 'merchant'
  sourceId: uuid("source_id"),
  targetType: text("target_type"),
  targetId: uuid("target_id"),

  categoryId: uuid("category_id").references(() => categories.id),
  merchantId: uuid("merchant_id").references(() => merchants.id),
  note: text("note"),

  commitmentId: uuid("commitment_id"),
  obligationId: uuid("obligation_id"),

  createdAt: timestamp("created_at").defaultNow(),
});

// ============ Commitments (Subscriptions) ============
export const billingCycleEnum = pgEnum("billing_cycle", [
  "monthly",
  "yearly",
  "weekly",
  "custom",
]);
export const commitmentStatusEnum = pgEnum("commitment_status", [
  "active",
  "paused",
  "cancelled",
]);

export const commitments = pgTable("commitments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  merchantId: uuid("merchant_id").references(() => merchants.id),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  currency: text("currency").default("IDR").notNull(),
  billingCycle: billingCycleEnum("billing_cycle").notNull(),
  cycleConfig: jsonb("cycle_config"),
  nextRenewalAt: timestamp("next_renewal_at").notNull(),
  paymentAccountId: uuid("payment_account_id").references(
    () => financialAccounts.id
  ),
  status: commitmentStatusEnum("status").default("active").notNull(),
  isShared: boolean("is_shared").default(false),
  reminderDays: integer("reminder_days").array().default([3, 1]),
  pausedAt: timestamp("paused_at"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============ Obligations (auto-generated from commitments) ============
export const obligationStatusEnum = pgEnum("obligation_status", [
  "pending",
  "notified",
  "paid",
  "settled",
  "disputed",
  "deferred",
]);

export const obligations = pgTable("obligations", {
  id: uuid("id").primaryKey().defaultRandom(),
  commitmentId: uuid("commitment_id")
    .references(() => commitments.id, { onDelete: "cascade" })
    .notNull(),
  cyclePeriod: text("cycle_period").notNull(), // e.g. '2026-11'
  fromUserId: text("from_user_id").references(() => users.id),
  toUserId: text("to_user_id")
    .references(() => users.id)
    .notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  dueAt: timestamp("due_at").notNull(),
  status: obligationStatusEnum("status").default("pending").notNull(),
  lastNudgedAt: timestamp("last_nudged_at"),
  paidAt: timestamp("paid_at"),
  settledAt: timestamp("settled_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ============ Relations ============
export const flowsRelations = relations(flows, ({ one }) => ({
  category: one(categories, { fields: [flows.categoryId], references: [categories.id] }),
  merchant: one(merchants, { fields: [flows.merchantId], references: [merchants.id] }),
}));

export const obligationsRelations = relations(obligations, ({ one }) => ({
  commitment: one(commitments, { fields: [obligations.commitmentId], references: [commitments.id] }),
}));

export const commitmentsRelations = relations(commitments, ({ many }) => ({
  obligations: many(obligations),
}));

// ============ Types ============
export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type FinancialAccount = typeof financialAccounts.$inferSelect;
export type NewFinancialAccount = typeof financialAccounts.$inferInsert;
export type Merchant = typeof merchants.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Flow = typeof flows.$inferSelect;
export type NewFlow = typeof flows.$inferInsert;
export type Commitment = typeof commitments.$inferSelect;
export type NewCommitment = typeof commitments.$inferInsert;
export type Obligation = typeof obligations.$inferSelect;
