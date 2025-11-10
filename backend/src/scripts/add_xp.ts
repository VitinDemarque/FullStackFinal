import dotenv from 'dotenv';
dotenv.config();

import { connectMongo } from '../config/mongo';
import User from '../models/User.model';
import LevelRule, { ILevelRule } from '../models/LevelRule.model';

async function main() {
  const email = process.argv[2] || 'teste@example.com';
  const delta = Number(process.argv[3] || 250);

  await connectMongo();
  console.log('✅ Conectado ao MongoDB');

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`❌ Usuário não encontrado: ${email}`);
    process.exit(1);
  }

  user.xpTotal = (user.xpTotal ?? 0) + delta;
  console.log(`ℹ️ XP atualizado: +${delta} (total: ${user.xpTotal})`);

  // Recalcular nível com base em regras cumulativas (minXp = XP total necessário para atingir o nível)
  const rules = await LevelRule.find().sort({ level: 1 }).lean<ILevelRule[]>();
  let newLevel = 0;
  for (const r of rules) {
    if (user.xpTotal >= r.minXp) newLevel = r.level;
  }
  user.level = newLevel;
  await user.save();

  console.log(`✅ Usuário '${user.email}' agora está no nível ${user.level} (XP: ${user.xpTotal})`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Erro ao adicionar XP:', err);
  process.exit(1);
});