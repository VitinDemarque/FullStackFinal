import { Db } from "mongodb";

export async function up(db: Db) {
  await db.createCollection("UserBadge");

  await db.collection("UserBadge").createIndex({ userId: 1 });
  await db.collection("UserBadge").createIndex({ badgeId: 1 });
  await db.collection("UserBadge").createIndex(
    { userId: 1, badgeId: 1 },
    { unique: true }
  );
}

export async function down(db: Db) {
  await db.collection("UserBadge").drop();
};