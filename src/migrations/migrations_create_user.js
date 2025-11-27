("use strict");
import mongoose from "mongoose";
import fs from "fs";
import bcrypt from "bcryptjs";
import path from "path";
import User from "../models/user.js";

// Read DB config
const configPath = path.resolve(process.cwd(), "./src/config/config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const DEFAULT_ADMIN = {
	email: process.env.MIGRATE_ADMIN_EMAIL || "admin@local",
	password: process.env.MIGRATE_ADMIN_PASSWORD || "admin123",
	firstName: "System",
	lastName: "Admin",
	address: "Localhost",
	phonenumber: "0000000000",
	gender: true,
	roleId: "1",
};

async function run() {
	try {
		console.log("Connecting to MongoDB for migrations...", dbConfig.uri);
		await mongoose.connect(dbConfig.uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		// Ensure indexes from schema are created (unique email, etc.)
		console.log("Ensuring user indexes...");
		await User.init();

		// Create default admin if not exists
		const existing = await User.findOne({ email: DEFAULT_ADMIN.email }).lean();
		if (existing) {
			console.log("Default admin already exists:", existing.email);
		} else {
			console.log("Creating default admin user...");
			const salt = bcrypt.genSaltSync(10);
			const hashed = bcrypt.hashSync(DEFAULT_ADMIN.password, salt);

			const u = await User.create({
				email: DEFAULT_ADMIN.email,
				password: hashed,
				firstName: DEFAULT_ADMIN.firstName,
				lastName: DEFAULT_ADMIN.lastName,
				address: DEFAULT_ADMIN.address,
				phonenumber: DEFAULT_ADMIN.phonenumber,
				gender: DEFAULT_ADMIN.gender,
				roleId: DEFAULT_ADMIN.roleId,
			});

			console.log("Admin created: ", u.email, " (id:", u._id.toString(), ")");
		}

		console.log("Migration completed.");
	} catch (err) {
		console.error("Migration failed:", err);
		process.exitCode = 1;
	} finally {
		// Close connection cleanly
		try {
			await mongoose.disconnect();
		} catch (e) {
			// ignore
		}
	}
}

// Run the migration when invoked directly
if (import.meta && !import.meta.main) {
	// some environments set import.meta.main differently; fallback below
}

run();

