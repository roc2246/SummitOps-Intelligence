import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import {
  Department,
  User,
  WorkOrderSnapshot,
} from "../src/models/index.js";

import {
  connectDatabase,
} from "../src/config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

const mongoUri =
  process.env.MONGODB_URI ??
  "mongodb://127.0.0.1:27017/mern_app";

const username =
  process.env.LOCAL_ADMIN_USERNAME;

const email =
  process.env.LOCAL_ADMIN_EMAIL;

const password =
  process.env.LOCAL_ADMIN_PASSWORD;

if (
  !username ||
  !email ||
  !password
) {
  throw new Error(
    "Missing local admin credentials"
  );
}

const adminUsername = username;
const adminEmail = email;
const adminPassword = password;

async function seedDatabase(): Promise<void> {
  await connectDatabase(mongoUri);

  const adminPasswordHash =
    await bcrypt.hash(
      adminPassword,
      10
    );

  const adminUser =
    await User.findOneAndUpdate(
      {
        email: adminEmail,
      },
      {
        username:
          adminUsername,
        email:
          adminEmail,
        passwordHash:
          adminPasswordHash,
        role:
          "admin",
        isActive:
          true,
      },
      {
        upsert: true,
        returnDocument:
          "after",
      }
    );

  const supervisorPassword =
    "DevPassword123!";

  const supervisorPasswordHash =
    await bcrypt.hash(
      supervisorPassword,
      10
    );

  const department =
    await Department.findOneAndUpdate(
      {
        name:
          "Grounds",
      },
      {
        name:
          "Grounds",
        description:
          "Grounds and summer mountain operations",
        isActive:
          true,
      },
      {
        upsert: true,
        returnDocument:
          "after",
      }
    );

  const supervisorUser =
    await User.findOneAndUpdate(
      {
        email:
          "supervisor@example.com",
      },
      {
        username:
          "supervisor",
        email:
          "supervisor@example.com",
        passwordHash:
          supervisorPasswordHash,
        role:
          "supervisor",
        isActive:
          true,
      },
      {
        upsert: true,
        returnDocument:
          "after",
      }
    );

  await WorkOrderSnapshot.deleteMany({
    department:
      department._id,
    source:
      "manual",
  });

  await WorkOrderSnapshot.create([
    {
      externalId:
        "WO-1001",
      source:
        "manual",
      department:
        department._id,
      title:
        "Repair drainage near trail",
      category:
        "Drainage",
      priority:
        "high",
      status:
        "completed",
      location:
        "Main trail",
      createdAtSource:
        new Date(
          "2026-08-03T08:00:00.000Z"
        ),
      dueDateSource:
        new Date(
          "2026-08-05T17:00:00.000Z"
        ),
      completedAtSource:
        new Date(
          "2026-08-05T15:00:00.000Z"
        ),
      laborHours:
        6,
      snapshotDate:
        new Date(
          "2026-08-07T12:00:00.000Z"
        ),
    },
    {
      externalId:
        "WO-1002",
      source:
        "manual",
      department:
        department._id,
      title:
        "Replace damaged trail sign",
      category:
        "Signage",
      priority:
        "medium",
      status:
        "open",
      location:
        "Lower mountain",
      createdAtSource:
        new Date(
          "2026-08-04T08:00:00.000Z"
        ),
      dueDateSource:
        new Date(
          "2026-08-06T17:00:00.000Z"
        ),
      laborHours:
        2,
      snapshotDate:
        new Date(
          "2026-08-07T12:00:00.000Z"
        ),
    },
    {
      externalId:
        "WO-1003",
      source:
        "manual",
      department:
        department._id,
      title:
        "Clear brush from work road",
      category:
        "Vegetation",
      priority:
        "low",
      status:
        "in_progress",
      location:
        "Upper mountain",
      createdAtSource:
        new Date(
          "2026-07-28T08:00:00.000Z"
        ),
      dueDateSource:
        new Date(
          "2026-08-04T17:00:00.000Z"
        ),
      laborHours:
        4.5,
      snapshotDate:
        new Date(
          "2026-08-07T12:00:00.000Z"
        ),
    },
  ]);

  console.log(
    "Database seeded successfully."
  );

  console.log(
    `Department ID: ${department._id}`
  );

  console.log(
    `Admin User ID: ${adminUser._id}`
  );

  console.log(
    `Supervisor User ID: ${supervisorUser._id}`
  );

  console.log(
    "Supervisor login:"
  );

  console.log(
    "Email: supervisor@example.com"
  );

  console.log(
    `Password: ${supervisorPassword}`
  );

  process.exit(0);
}

seedDatabase().catch(
  (error) => {
    console.error(
      "Failed to seed database. Ensure MongoDB is running and MONGODB_URI is correct.",
      error
    );

    process.exit(1);
  }
);