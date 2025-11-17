import { Db } from "mongodb";

export const up = async (db: Db) => {
  
  await db.collection("userstats").createIndex({ userId: 1 }, { unique: true });

  await db.collection("userstats").updateMany(
    { exercisesCreatedCount: { $exists: false } },
    { $set: { exercisesCreatedCount: 0 } }
  );

  await db.collection("userstats").updateMany(
    { exercisesSolvedCount: { $exists: false } },
    { $set: { exercisesSolvedCount: 0 } }
  );

  await db.collection("userstats").updateMany(
    { loginStreakCurrent: { $exists: false } },
    { $set: { loginStreakCurrent: 0 } }
  );

  await db.collection("userstats").updateMany(
    { loginStreakMax: { $exists: false } },
    { $set: { loginStreakMax: 0 } }
  );
};

export const down = async (db: Db) => {
  await db.collection("userstats").dropIndex("userId_1").catch(() => {});
};