import { pgTable, text, serial, varchar, pgEnum, integer } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['admin', 'user']);

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  role: roleEnum('role').notNull().default('user'),
  avatar: text('avatar'),
});

export const partners = pgTable('partners', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    logoUrl: text('logo_url'),
    logoHint: varchar('logo_hint', {length: 256}),
});

export const locations = pgTable('locations', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    address: text('address').notNull(),
    hours: varchar('hours', { length: 256 }),
});


export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Partner = InferSelectModel<typeof partners>;
export type NewPartner = InferInsertModel<typeof partners>;

export type Location = InferSelectModel<typeof locations>;
export type NewLocation = InferInsertModel<typeof locations>;