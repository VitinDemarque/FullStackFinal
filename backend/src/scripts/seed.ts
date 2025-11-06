// IMPORTANTE: Carregar variáveis de ambiente ANTES de qualquer import que use process.env
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectMongo } from '../config/mongo';
import User from '../models/User.model';
import Language from '../models/Language.model';
import College from '../models/College.model';
import Exercise from '../models/Exercise.model';
import UserStat from '../models/UserStat.model';

async function seed() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...\n');

    // Conectar ao banco
    await connectMongo();
    console.log('✅ Conectado ao MongoDB\n');

    // Limpar dados existentes
    console.log('🗑️  Limpando dados antigos...');
    await Promise.all([
      User.deleteMany({}),
      Language.deleteMany({}),
      College.deleteMany({}),
      Exercise.deleteMany({}),
      UserStat.deleteMany({}),
    ]);
    console.log('✅ Dados antigos removidos\n');

    // ==================== LINGUAGENS ====================
    console.log('📚 Criando linguagens...');
    const languages = await Language.insertMany([
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'React', slug: 'react' },
    ]);
    console.log(`✅ ${languages.length} linguagens criadas\n`);

    // ==================== FACULDADES ====================
    console.log('🏫 Criando faculdades...');
    const colleges = await College.insertMany([
      {
        name: 'Faculdade de Minas',
        acronym: 'FAMINAS',
        city: 'Muriaé',
        state: 'MG',
      },
      {
        name: 'Universidade de São Paulo',
        acronym: 'USP',
        city: 'São Paulo',
        state: 'SP',
      },
      {
        name: 'Universidade Federal do Rio de Janeiro',
        acronym: 'UFRJ',
        city: 'Rio de Janeiro',
        state: 'RJ',
      },
      {
        name: 'Universidade Federal de Minas Gerais',
        acronym: 'UFMG',
        city: 'Belo Horizonte',
        state: 'MG',
      },
      {
        name: 'Universidade Estadual de Campinas',
        acronym: 'UNICAMP',
        city: 'Campinas',
        state: 'SP',
      },
    ]);
    console.log(`✅ ${colleges.length} faculdades criadas\n`);

    // ==================== USUÁRIOS ====================
    console.log('👥 Criando usuários...');
    const passwordHash = await bcrypt.hash('senha123', 10);

    const users = await User.insertMany([
      {
        name: 'Teste Teste',
        handle: 'testeteste',
        email: 'teste@example.com',
        passwordHash,
        collegeId: colleges[0]._id, // FAMINAS
        level: 1,
        xpTotal: 0,
        bio: 'Usuário de teste principal',
        role: 'USER',
      },
      {
        name: 'Maria Silva',
        handle: 'mariasilva',
        email: 'maria@example.com',
        passwordHash,
        collegeId: colleges[1]._id, // USP
        level: 3,
        xpTotal: 1500,
        bio: 'Desenvolvedora Full Stack apaixonada por desafios',
        role: 'USER',
      },
      {
        name: 'João Santos',
        handle: 'joaosantos',
        email: 'joao@example.com',
        passwordHash,
        collegeId: colleges[2]._id, // UFRJ
        level: 5,
        xpTotal: 3200,
        bio: 'Especialista em algoritmos e estruturas de dados',
        role: 'USER',
      },
      {
        name: 'Admin User',
        handle: 'admin',
        email: 'admin@example.com',
        passwordHash,
        collegeId: colleges[3]._id, // UFMG
        level: 10,
        xpTotal: 10000,
        bio: 'Administrador da plataforma',
        role: 'ADMIN',
      },
    ]);
    console.log(`✅ ${users.length} usuários criados`);
    console.log('   📧 Email: teste@example.com | Senha: senha123');
    console.log('   📧 Email: maria@example.com | Senha: senha123');
    console.log('   📧 Email: joao@example.com | Senha: senha123');
    console.log('   📧 Email: admin@example.com | Senha: senha123\n');

    // ==================== USER STATS ====================
    console.log('📊 Criando estatísticas de usuários...');
    await UserStat.insertMany([
      {
        userId: users[0]._id,
        exercisesCreatedCount: 1,
        exercisesSolvedCount: 0,
      },
      {
        userId: users[1]._id,
        exercisesCreatedCount: 2,
        exercisesSolvedCount: 5,
      },
      {
        userId: users[2]._id,
        exercisesCreatedCount: 3,
        exercisesSolvedCount: 12,
      },
      {
        userId: users[3]._id,
        exercisesCreatedCount: 0,
        exercisesSolvedCount: 0,
      },
    ]);
    console.log('✅ Estatísticas criadas\n');

    // ==================== EXERCÍCIOS/DESAFIOS ====================
    console.log('💻 Criando desafios...');
    const exercises = await Exercise.insertMany([
      {
        authorUserId: users[0]._id,
        languageId: languages[0]._id, // TypeScript
        title: 'Hello World',
        description: 'Crie uma função que retorna a string "Hello, World!". Este é o primeiro passo na sua jornada de programação!',
        difficulty: 1,
        baseXp: 50,
        isPublic: true,
        status: 'PUBLISHED',
        codeTemplate: `function helloWorld(): string {
  // Seu código aqui
  return "";
}`,
      },
      {
        authorUserId: users[1]._id,
        languageId: languages[0]._id, // TypeScript
        title: 'Soma de Dois Números',
        description: 'Implemente uma função que recebe dois números e retorna a soma deles. Simples, mas essencial!',
        difficulty: 1,
        baseXp: 100,
        isPublic: true,
        status: 'PUBLISHED',
        codeTemplate: `function soma(a: number, b: number): number {
  // Seu código aqui
  return 0;
}`,
      },
      {
        authorUserId: users[1]._id,
        languageId: languages[0]._id, // TypeScript
        title: 'Palíndromo',
        description: 'Crie uma função que verifica se uma palavra é um palíndromo (lê-se igual de trás para frente). Exemplo: "arara" é palíndromo.',
        difficulty: 2,
        baseXp: 200,
        isPublic: true,
        status: 'PUBLISHED',
        codeTemplate: `function isPalindrome(palavra: string): boolean {
  // Seu código aqui
  return false;
}`,
      },
      {
        authorUserId: users[2]._id,
        languageId: languages[0]._id, // TypeScript
        title: 'FizzBuzz',
        description: 'Implemente o clássico FizzBuzz: Para números de 1 a n, retorne "Fizz" para múltiplos de 3, "Buzz" para múltiplos de 5, "FizzBuzz" para múltiplos de ambos, ou o próprio número caso contrário.',
        difficulty: 2,
        baseXp: 250,
        isPublic: true,
        status: 'PUBLISHED',
        codeTemplate: `function fizzBuzz(n: number): (string | number)[] {
  // Seu código aqui
  const result: (string | number)[] = [];
  
  return result;
}`,
      },
      {
        authorUserId: users[2]._id,
        languageId: languages[0]._id, // TypeScript
        title: 'Fibonacci',
        description: 'Implemente uma função que retorna o n-ésimo número da sequência de Fibonacci. A sequência começa com 0 e 1, e cada número seguinte é a soma dos dois anteriores.',
        difficulty: 3,
        baseXp: 300,
        isPublic: true,
        status: 'PUBLISHED',
        codeTemplate: `function fibonacci(n: number): number {
  // Seu código aqui
  return 0;
}`,
      },
      {
        authorUserId: users[2]._id,
        languageId: languages[1]._id, // React
        title: 'Componente Contador',
        description: 'Crie um componente React que exibe um contador com botões para incrementar e decrementar o valor. Use hooks (useState).',
        difficulty: 3,
        baseXp: 350,
        isPublic: true,
        status: 'PUBLISHED',
        codeTemplate: `import { useState } from 'react';

export default function Counter() {
  // Seu código aqui
  
  return (
    <div>
      {/* Implemente o contador aqui */}
    </div>
  );
}`,
      },
      {
        authorUserId: users[1]._id,
        languageId: languages[0]._id, // TypeScript
        title: 'Busca Binária',
        description: 'Implemente o algoritmo de busca binária. Dada uma lista ordenada e um valor alvo, retorne o índice do valor ou -1 se não encontrado.',
        difficulty: 4,
        baseXp: 400,
        isPublic: true,
        status: 'PUBLISHED',
        codeTemplate: `function buscaBinaria(arr: number[], target: number): number {
  // Seu código aqui
  return -1;
}`,
      },
      {
        authorUserId: users[0]._id,
        languageId: languages[1]._id, // React
        title: 'Lista de Tarefas',
        description: 'Crie um componente React de lista de tarefas (Todo List) com funcionalidades de adicionar, remover e marcar como concluída.',
        difficulty: 4,
        baseXp: 450,
        isPublic: true,
        status: 'PUBLISHED',
        codeTemplate: `import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  // Seu código aqui
  
  return (
    <div>
      {/* Implemente a lista de tarefas aqui */}
    </div>
  );
}`,
      },
    ]);
    console.log(`✅ ${exercises.length} desafios criados\n`);

    console.log('🎉 Seed concluído com sucesso!\n');
    console.log('📊 Resumo:');
    console.log(`   - ${languages.length} linguagens`);
    console.log(`   - ${colleges.length} faculdades`);
    console.log(`   - ${users.length} usuários`);
    console.log(`   - ${exercises.length} desafios`);
    console.log('\n💡 Use as credenciais acima para fazer login na aplicação.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

// Executar seed
seed();

