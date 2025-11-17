import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectMongo } from '../config/mongo';
import Language from '../models/Language.model';

async function seedJavaLanguage() {
  try {
    console.log('🌱 Iniciando seed da linguagem Java...\n');

    // Conectar ao banco
    await connectMongo();
    console.log('✅ Conectado ao MongoDB\n');

    // Verificar se Java já existe
    const existingJava = await Language.findOne({ 
      $or: [
        { name: 'Java' },
        { slug: 'java' }
      ]
    });

    if (existingJava) {
      console.log('⚠️  A linguagem Java já existe no banco de dados');
      console.log(`   ID: ${existingJava._id}`);
      console.log(`   Nome: ${existingJava.name}`);
      console.log(`   Slug: ${existingJava.slug}\n`);
      await mongoose.connection.close();
      return;
    }

    // Criar linguagem Java
    console.log('📚 Criando linguagem Java...');
    const javaLanguage = await Language.create({
      name: 'Java',
      slug: 'java'
    });

    console.log('✅ Linguagem Java criada com sucesso!');
    console.log(`   ID: ${javaLanguage._id}`);
    console.log(`   Nome: ${javaLanguage.name}`);
    console.log(`   Slug: ${javaLanguage.slug}\n`);

    await mongoose.connection.close();
    console.log('✅ Conexão fechada\n');
  } catch (error: any) {
    console.error('❌ Erro ao criar linguagem Java:', error.message);
    if (error.code === 11000) {
      console.error('   A linguagem Java já existe no banco de dados');
    }
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedJavaLanguage();

