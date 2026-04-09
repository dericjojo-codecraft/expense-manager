import type { PageOptions } from "../core/page-option.js";
import type { iFriend } from "../models/friend.model.js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

interface isFriendObjectActive {
    id: number;
    name: string;
    isActive: number;
    balance: number;
}

const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
});

await db.exec(`
    CREATE TABLE IF NOT EXISTS friends (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        balance INTEGER,
        isActive INTEGER NOT NULL DEFAULT 1
    )
`);

export class FriendRepository {
    private static instance: FriendRepository;
    private currentData = db;

    static getInstance() {
        if (!FriendRepository.instance) {
            FriendRepository.instance = new FriendRepository();
        }
        return FriendRepository.instance;
    }

    private constructor() { }

    async checkEmailInRepository(email: string) {
        const existingFriend = await this.currentData.get(`SELECT id FROM friends WHERE LOWER(email) = LOWER(?) AND isActive = 1`, [email]);

        if (existingFriend) {
            return { success: false, message: "Action failed: Email must be unique" };
        }

        return { success: true };
    }

    async checkPhoneInRepository(phone: string) {
        const existingFriend = await this.currentData.get(`SELECT id FROM friends WHERE phone = ? AND isActive = 1`, [phone]);

        if (existingFriend) {
            return { success: false, message: "Action failed: Phone number must be unique" };
        }

        return { success: true };
    }

    async addFriendToRepository(friend: iFriend): Promise<{ success: boolean; message: string }> {
        const existingFriend = await this.currentData.get<isFriendObjectActive>(
            `SELECT id, isActive FROM friends WHERE email = ? OR phone = ?`,
            [friend.email, friend.phone]
        );

        if (existingFriend) {
            if (existingFriend.isActive === 0) {
                await this.currentData.run(`
                    UPDATE friends SET isActive = 1, name = ?, balance = ? WHERE id = ?
                `, [friend.name, friend.balance, existingFriend.id]);
                return { success: true, message: `Re-activated existing friend: ${friend.name}` };
            } else {
                return { success: false, message: "Action failed: Friend with same email or phone already exists" };
            }
        }

        await this.currentData.run(`
            INSERT INTO friends (name, email, phone, balance) VALUES (?, ?, ?, ?)
        `, [friend.name, friend.email, friend.phone, friend.balance]);

        return { success: true, message: `Added friend to database: ${friend.name}` };
    }

    async updateFriend(value: string, friend: iFriend) {
        const existingFriend = await this.currentData.get<isFriendObjectActive>(
            `SELECT id, isActive FROM friends WHERE email = ? OR phone = ?`,
            [value, value]
        );

        if (existingFriend && existingFriend.isActive) {
            await this.currentData.run(`
                UPDATE friends SET name = ?, email = ?, phone = ?, balance = ? WHERE id = ?
            `, [friend.name, friend.email, friend.phone, friend.balance, existingFriend.id]);
            return { success: true, message: "Friend updated successfully" };
        } else {
            return { success: false, message: "Action failed: Friend not found. No changes made." };
        }
    }

    async removeFriend(value: string): Promise<{ success: boolean; message: string }> {
        const existingFriend = await this.currentData.get<isFriendObjectActive>(
            `SELECT id, isActive, balance, name FROM friends WHERE email = ? OR phone = ?`,
            [value, value]
        );

        if (existingFriend) {
            if (existingFriend.isActive !== 0) {
                if (existingFriend.balance !== 0) {
                    return { success: false, message: "Action failed: Balance needs to be settled before removing a friend." };
                }
            } else {
                return { success: false, message: "Action failed: Friend not found. No changes made." };
            }

            await this.currentData.run(`
                UPDATE friends SET isActive = ? WHERE id = ?
            `, [0, existingFriend.id]);
            return { success: true, message: `${existingFriend.name} removed as friend` };
        } else {
            return { success: false, message: "Action failed: Friend not found. No changes made." };
        }
    }

    async searchFriends(query?: string, pageOption?: PageOptions) {
        const limit = pageOption?.limit || 5;
        const offset = pageOption?.offset || 0;

        let friends: iFriend[] = [];
        let matchedCount = 0;

        if (query) {
            const sqlQuery = `%${query}%`;

            friends = await this.currentData.all(
                `SELECT * FROM friends 
                 WHERE (name LIKE ? OR email LIKE ? OR phone LIKE ?) AND isActive = 1
                 LIMIT ? OFFSET ?`,
                [sqlQuery, sqlQuery, sqlQuery, limit, offset]
            );

            const countResult = await this.currentData.get(
                `SELECT COUNT(*) as count FROM friends 
                 WHERE (name LIKE ? OR email LIKE ? OR phone LIKE ?) AND isActive = 1`,
                [sqlQuery, sqlQuery, sqlQuery]
            );
            matchedCount = countResult.count;
        } else {
            friends = await this.currentData.all(
                `SELECT * FROM friends WHERE isActive = 1 LIMIT ? OFFSET ?`,
                [limit, offset]
            );

            const countResult = await this.currentData.get(
                `SELECT COUNT(*) as count FROM friends WHERE isActive = 1`
            );
            matchedCount = countResult.count;
        }

        const totalResult = await this.currentData.get(
            `SELECT COUNT(*) as count FROM friends WHERE isActive = 1`
        );

        return {
            data: friends,
            matched: matchedCount,
            total: totalResult.count
        };
    }
}