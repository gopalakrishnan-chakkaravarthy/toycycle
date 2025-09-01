import { pgTable, text, serial, varchar, pgEnum, integer, timestamp, date } from 'drizzle-orm/pg-core';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['admin', 'user']);
export const inventoryStatusEnum = pgEnum('inventory_status', ['received', 'sanitizing', 'listed', 'redistributed']);
export const pickupTypeEnum = pgEnum('pickup_type', ['my-address', 'drop-off', 'partner']);
export const pickupStatusEnum = pgEnum('pickup_status', ['scheduled', 'completed', 'cancelled']);


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

export const accessoryTypes = pgTable('accessory_types', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
});

export const toyConditions = pgTable('toy_conditions', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
});

export const inventory = pgTable('inventory', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    conditionId: integer('condition_id').references(() => toyConditions.id),
    status: inventoryStatusEnum('status').notNull().default('received'),
    receivedAt: timestamp('received_at').defaultNow().notNull(),
    imageUrl: text('image_url'),
    imageHint: varchar('image_hint', { length: 256 }),
    locationId: integer('location_id').references(() => locations.id),
});

export const donations = pgTable('donations', {
    id: serial('id').primaryKey(),
    userId: text('user_id').references(() => users.id).notNull(),
    inventoryId: integer('inventory_id').references(() => inventory.id).notNull(),
    donatedAt: timestamp('donated_at').defaultNow().notNull(),
});

export const campaigns = pgTable('campaigns', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    endDate: timestamp('end_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pickups = pgTable('pickups', {
    id: serial('id').primaryKey(),
    pickupDate: date('pickup_date').notNull(),
    timeSlot: varchar('time_slot', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    email: varchar('email', { length: 256 }).notNull(),
    pickupType: pickupTypeEnum('pickup_type').notNull(),
    address: text('address'),
    locationId: integer('location_id').references(() => locations.id),
    partnerId: integer('partner_id').references(() => partners.id),
    toyConditionId: integer('toy_condition_id').references(() => toyConditions.id).notNull(),
    accessoryTypeId: integer('accessory_type_id').references(() => accessoryTypes.id).notNull(),
    status: pickupStatusEnum('status').notNull().default('scheduled'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});


export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Partner = InferSelectModel<typeof partners>;
export type NewPartner = InferInsertModel<typeof partners>;

export type Location = InferSelectModel<typeof locations>;
export type NewLocation = InferInsertModel<typeof locations>;

export type AccessoryType = InferSelectModel<typeof accessoryTypes>;
export type NewAccessoryType = InferInsertModel<typeof accessoryTypes>;

export type ToyCondition = InferSelectModel<typeof toyConditions>;
export type NewToyCondition = InferInsertModel<typeof toyConditions>;

export type Inventory = InferSelectModel<typeof inventory>;
export type NewInventory = InferInsertModel<typeof inventory>;

export type Donation = InferSelectModel<typeof donations>;
export type NewDonation = InferInsertModel<typeof donations>;

export type Campaign = InferSelectModel<typeof campaigns>;
export type NewCampaign = InferInsertModel<typeof campaigns>;

export type Pickup = InferSelectModel<typeof pickups>;
export type NewPickup = InferInsertModel<typeof pickups>;
