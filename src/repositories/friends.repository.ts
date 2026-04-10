import initDatabase from "../core/database.js";
import type { PageOptions } from "../core/page-option.js";
import type { iFriend } from "../models/friend.model.js";
import mysql from "mysql2/promise";

// Define the shape of our MySQL rows
interface FriendRow extends mysql.RowDataPacket {
    id: number;
    name: string;
    email: string;
    phone: string;
    balance: number;
    isActive: number;
}

export class FriendRepository {
    private static instance: FriendRepository;
    private currentData!: mysql.Connection;

    static async getInstance() {
        if (!FriendRepository.instance) {
            const repo = new FriendRepository();
            repo.currentData = await initDatabase();
            FriendRepository.instance = repo;
        }
        return FriendRepository.instance;
    }

    private constructor() { }

    async closeConnection() {
        await this.currentData.end();
    }

    async checkEmailInRepository(email: string) {
        const [rows] = await this.currentData.execute<FriendRow[]>(
            `SELECT id FROM friends WHERE LOWER(email) = LOWER(?) AND isActive = 1`, 
            [email]
        );

        if (rows.length > 0) {
            return { success: false, message: "Action failed: Email must be unique" };
        }
        return { success: true };
    }

    async checkPhoneInRepository(phone: string) {
        const [rows] = await this.currentData.execute<FriendRow[]>(
            `SELECT id FROM friends WHERE phone = ? AND isActive = 1`, 
            [phone]
        );

        if (rows.length > 0) {
            return { success: false, message: "Action failed: Phone number must be unique" };
        }
        return { success: true };
    }

    async addFriendToRepository(friend: iFriend): Promise<{ success: boolean; message: string }> {
        const [rows] = await this.currentData.execute<FriendRow[]>(
            `SELECT id, isActive FROM friends WHERE email = ? OR phone = ?`,
            [friend.email, friend.phone]
        );

        const existingFriend = rows[0];

        if (existingFriend) {
            if (existingFriend.isActive === 0) {
                await this.currentData.execute(
                    `UPDATE friends SET isActive = 1, name = ?, balance = ? WHERE id = ?`, 
                    [friend.name, friend.balance, existingFriend.id]
                );
                return { success: true, message: `Re-activated existing friend: ${friend.name}` };
            } else {
                return { success: false, message: "Action failed: Friend with same email or phone already exists" };
            }
        }

        await this.currentData.execute(
            `INSERT INTO friends (name, email, phone, balance) VALUES (?, ?, ?, ?)`, 
            [friend.name, friend.email, friend.phone, friend.balance]
        );

        return { success: true, message: `Added friend to database: ${friend.name}` };
    }

    async updateFriend(value: string, friend: iFriend) {
        const [rows] = await this.currentData.execute<FriendRow[]>(
            `SELECT id, isActive FROM friends WHERE email = ? OR phone = ?`,
            [value, value]
        );

        const existingFriend = rows[0];

        if (existingFriend && existingFriend.isActive) {
            await this.currentData.execute(
                `UPDATE friends SET name = ?, email = ?, phone = ?, balance = ? WHERE id = ?`, 
                [friend.name, friend.email, friend.phone, friend.balance, existingFriend.id]
            );
            return { success: true, message: "Friend updated successfully" };
        } else {
            return { success: false, message: "Action failed: Friend not found. No changes made." };
        }
    }

    async removeFriend(value: string): Promise<{ success: boolean; message: string }> {
        const [rows] = await this.currentData.execute<FriendRow[]>(
            `SELECT id, isActive, balance, name FROM friends WHERE email = ? OR phone = ?`,
            [value, value]
        );

        const existingFriend = rows[0];

        if (existingFriend) {
            if (existingFriend.isActive !== 0) {
                if (existingFriend.balance !== 0) {
                    return { success: false, message: "Action failed: Balance needs to be settled before removing a friend." };
                }
            } else {
                return { success: false, message: "Action failed: Friend not found. No changes made." };
            }

            await this.currentData.execute(
                `UPDATE friends SET isActive = ? WHERE id = ?`, 
                [0, existingFriend.id]
            );
            return { success: true, message: `${existingFriend.name} removed as friend` };
        } else {
            return { success: false, message: "Action failed: Friend not found. No changes made." };
        }
    }

    async searchFriends(query?: string, pageOption?: PageOptions) {
        const limit = pageOption?.limit || 5;
        const offset = pageOption?.offset || 0;

        let friends: FriendRow[] = [];
        let matchedCount = 0;

        if (query) {
            const sqlQuery = `%${query}%`;

            // MySQL uses different parameters for LIMIT/OFFSET
            [friends] = await this.currentData.execute<FriendRow[]>(
                `SELECT * FROM friends 
                 WHERE (name LIKE ? OR email LIKE ? OR phone LIKE ?) AND isActive = 1
                 LIMIT ? OFFSET ?`,
                [sqlQuery, sqlQuery, sqlQuery, limit.toString(), offset.toString()]
            );

            const [countRows] = await this.currentData.execute<any[]>(
                `SELECT COUNT(*) as count FROM friends 
                 WHERE (name LIKE ? OR email LIKE ? OR phone LIKE ?) AND isActive = 1`,
                [sqlQuery, sqlQuery, sqlQuery]
            );
            matchedCount = countRows[0].count;
        } else {
            [friends] = await this.currentData.execute<FriendRow[]>(
                `SELECT * FROM friends WHERE isActive = 1 LIMIT ? OFFSET ?`,
                [limit.toString(), offset.toString()]
            );

            const [countRows] = await this.currentData.execute<any[]>(
                `SELECT COUNT(*) as count FROM friends WHERE isActive = 1`
            );
            matchedCount = countRows[0].count;
        }

        const [totalRows] = await this.currentData.execute<any[]>(
            `SELECT COUNT(*) as count FROM friends WHERE isActive = 1`
        );

        return {
            data: friends,
            matched: matchedCount,
            total: totalRows[0].count
        };
    }
}