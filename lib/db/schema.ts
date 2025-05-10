import {pgTable, text, uuid, integer, boolean, timestamp} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),

    //basic file/folder information
    name: text("name").notNull(),
    path: text("path").notNull(),
    size: integer("size").notNull(),
    type: text("type").notNull(), // file type (folder)

    //storage information
    fileURL: text("file_url").notNull(), //url to access the file
    thumbnailURL: text("thumbnail_url"), //url to access the thumbnail

    //Ownership information
    userId: text("user_id").notNull(), //user id of the owner
    parentId: uuid("parent_id"), // Parent folder id, null for root items

    // file/folder flags
    isFolder: boolean("is_folder").notNull().default(false), // true if folder, false if file
    isStarred: boolean("is_starred").notNull().default(false), // true if starred
    isTrash: boolean("is_trash").notNull().default(false), // true if in trash
    isShared: boolean("is_shared").notNull().default(false), // true if shared

    // timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const filesRelations = relations(files, ({one, many}) => ({
    // Define the relations here
    parent: one(files, {
        fields: [files.parentId],
        references: [files.id],
    }),
    children: many(files)
}))

//type definitions
export const File = typeof files.$inferSelect
export const NewFile = typeof files.$inferInsert
