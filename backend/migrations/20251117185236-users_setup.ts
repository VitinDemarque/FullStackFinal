import { Db } from "mongodb";

export const up = async (db: Db) => {

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("users").createIndex({ username: 1 }, { unique: true });


  await db.collection("users").updateMany(
    { xp: { $exists: false } },
    { $set: { xp: 0 } }
  );

  await db.collection("users").updateMany(
    { level: { $exists: false } },
    { $set: { level: 1 } }
  );

  await db.collection("users").updateMany(
    { streak: { $exists: false } },
    { $set: { streak: 0 } }
  );

};

export const down = async (db: Db) => {
  await db.collection("users").dropIndex("email_1").catch(() => {});
  await db.collection("users").dropIndex("username_1").catch(() => {});
};