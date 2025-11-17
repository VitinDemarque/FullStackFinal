import { Db } from "mongodb";

export async function up(db: Db) {
  await db.createCollection("UserTitle");

  await db.collection("UserTitle").createIndex({ userId: 1 });
  await db.collection("UserTitle").createIndex({ titleId: 1 });
  await db.collection("UserTitle").createIndex(
    { userId: 1, titleId: 1 },
    { unique: true }
  );
}

export async function down(db: Db) {
  await db.collection("UserTitle").drop();
};