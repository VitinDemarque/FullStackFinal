import 'dotenv/config'
import { connectMongo, disconnectMongo } from '../config/mongo'
import Title from '../models/Title.model'

type SeedTitle = { name: string; description: string; minLevel?: number | null; minXp?: number | null }

const titles: SeedTitle[] = [
  // 💻 DESAFIOS CONCLUÍDOS
  { name: 'Primeiro de Muitos', description: 'Seu primeiro desafio concluído — o início da jornada!' },
  { name: 'Destrava Códigos', description: 'Está pegando o jeito e decifrando a lógica.' },
  { name: 'Dev em Ascensão', description: 'Já concluiu 10 desafios! O aprendizado está fluindo.' },
  { name: 'Mão na Massa', description: 'Resolve desafios como quem toma café: todo dia.' },
  { name: 'Ligeirinho da Lógica', description: 'Resolve tudo com velocidade e precisão.' },
  { name: 'Lenda do Terminal', description: '100 desafios concluídos — você virou história!' },

  // 🧠 DESAFIOS CRIADOS
  { name: 'Criador de Bugs (sem querer)', description: 'Criou seu primeiro desafio (e talvez um bug).' },
  { name: 'Arquiteto de Ideias', description: 'Suas criações desafiam mentes brilhantes.' },
  { name: 'Engenheiro de Lógica', description: 'Seus desafios são referência entre os devs.' },
  { name: 'Sensei do Código', description: 'Ensina e inspira com seus desafios lendários.' },

  // ⚡ PERFORMANCE
  { name: 'Embalado no Código', description: 'Está pegando ritmo e soltando o talento!' },
  { name: 'Modo Turbo', description: 'Resolve desafios em sequência como um robô.' },
  { name: 'Imparável', description: 'Nada te detém, você virou uma máquina de lógica.' },
  { name: 'Ligeirinho', description: 'Foi tão rápido que o compilador nem piscou.' },

  // 💬 COMENTÁRIOS DENTRO DOS TÓPICOS
  { name: 'Palpiteiro de Primeira Viagem', description: 'Deu o primeiro pitaco no fórum.' },
  { name: 'Conselheiro de Plantão', description: 'Sempre tem uma dica pra compartilhar.' },
  { name: 'Guru da Comunidade', description: 'Suas palavras viraram referência entre os devs.' },

  // 🧩 TÓPICOS DO FÓRUM
  { name: 'Quebrador de Gelo', description: 'Iniciou a primeira conversa — coragem!' },
  { name: 'Gerador de Ideias', description: 'Traz boas discussões e movimenta o fórum.' },
  { name: 'Debatedor Nato', description: 'Gosta de trocar ideias e aprender com a galera.' },
  { name: 'Voz do Fórum', description: 'Um verdadeiro porta-voz da comunidade!' },

  // 👥 GRUPOS (Participação)
  { name: 'Recruta do Código', description: 'Entrou na sua primeira equipe!' },
  { name: 'Integrador', description: 'Adora trocar ideias e colaborar.' },
  { name: 'Conectadão', description: 'Está em todos os lugares ao mesmo tempo.' },

  // 👑 GRUPOS (Criação)
  { name: 'Fundador de Equipe', description: 'Reuniu a galera pela primeira vez.' },
  { name: 'Líder de Stack', description: 'Cria times e compartilha conhecimento.' },
  { name: 'Gestor do Caos', description: 'Administra grupos e mantém a paz (quase sempre).' },
  { name: 'Senhor das Comunidades', description: 'Criou um império de aprendizado e conexão!' },

  // 💎 EXTRAS E TÍTULOS ESPECIAIS
  { name: 'Explorador do Código', description: 'Bem-vindo à sua nova aventura lógica!' },
  { name: 'Dev Constante', description: 'A rotina de um verdadeiro programador disciplinado.' },
  { name: 'Perfect Coder', description: 'Código limpo, sem erros — impecável!' }
]

async function run() {
  await connectMongo()
  let created = 0
  let updated = 0

  for (const t of titles) {
    const res = await Title.updateOne(
      { name: t.name },
      { $set: { description: t.description, minLevel: t.minLevel ?? null, minXp: t.minXp ?? null } },
      { upsert: true }
    )

    if ((res.upsertedCount ?? 0) > 0 || (res as any).upserted) {
      created += 1
      console.log(`+ created: ${t.name}`)
    } else if ((res.modifiedCount ?? 0) > 0) {
      updated += 1
      console.log(`~ updated: ${t.name}`)
    } else {
      console.log(`= exists: ${t.name}`)
    }
  }

  console.log(`Done. created=${created}, updated=${updated}, total=${titles.length}`)
  await disconnectMongo()
}

run().catch(async (err) => {
  console.error('seed-titles error:', err)
  await disconnectMongo()
  process.exit(1)
})