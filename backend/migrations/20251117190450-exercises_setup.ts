import { Db } from "mongodb";

export const up = async (db: Db) => {

  await db.collection("exercises").createIndex({ authorUserId: 1 });

  await db.collection("exercises").updateMany(
    { difficulty: { $exists: false } },
    { $set: { difficulty: "easy" } }
  );

  await db.collection("exercises").updateMany(
    { baseXp: { $exists: false } },
    { $set: { baseXp: 10 } }
  );

  await db.collection("exercises").updateMany(
    { isPublic: { $exists: false } },
    { $set: { isPublic: false } }
  );

  await db.collection("exercises").updateMany(
    { status: { $exists: false } },
    { $set: { status: "DRAFT" } }
  );
};

export const down = async (db: Db) => {
  await db.collection("exercises").dropIndex("authorUserId_1").catch(() => {});
};