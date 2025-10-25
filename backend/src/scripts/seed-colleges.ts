import 'dotenv/config';
import { connectMongo, disconnectMongo } from '../config/mongo';
import College from '../models/College.model';

const colleges = [
  {
    name: 'Faculdade de Minas (FAMINAS)',
    acronym: 'FAMINAS',
    city: 'Muriaé',
    state: 'MG'
  },
  {
    name: 'Universidade de São Paulo (USP)',
    acronym: 'USP',
    city: 'São Paulo',
    state: 'SP'
  },
  {
    name: 'Universidade Federal de Minas Gerais (UFMG)',
    acronym: 'UFMG',
    city: 'Belo Horizonte',
    state: 'MG'
  },
  {
    name: 'Pontifícia Universidade Católica (PUC-SP)',
    acronym: 'PUC-SP',
    city: 'São Paulo',
    state: 'SP'
  },
  {
    name: 'Universidade Federal do Rio de Janeiro (UFRJ)',
    acronym: 'UFRJ',
    city: 'Rio de Janeiro',
    state: 'RJ'
  },
  {
    name: 'Universidade Estadual de Campinas (UNICAMP)',
    acronym: 'UNICAMP',
    city: 'Campinas',
    state: 'SP'
  },
  {
    name: 'Universidade Federal do Rio Grande do Sul (UFRGS)',
    acronym: 'UFRGS',
    city: 'Porto Alegre',
    state: 'RS'
  },
  {
    name: 'Universidade de Brasília (UnB)',
    acronym: 'UnB',
    city: 'Brasília',
    state: 'DF'
  }
];

async function seed() {
  console.log('Iniciando seed de faculdades...');

  try {
    await connectMongo();
    console.log('Conectado ao MongoDB');

    const deleteResult = await College.deleteMany({});
    console.log(`${deleteResult.deletedCount} faculdades removidas`);

    const result = await College.insertMany(colleges);
    console.log(`${result.length} faculdades inseridas com sucesso!`);

    console.log('\nFaculdades cadastradas:');
    console.log('-'.repeat(60));
    
    for (const college of result) {
      console.log(`${college._id} - ${college.name} (${college.acronym})`);
    }

    console.log('-'.repeat(60));
    console.log('Seed concluído com sucesso!');
    
  } catch (error: any) {
    console.error('Erro durante o seed:', error.message);
    process.exit(1);
  } finally {
    await disconnectMongo();
    process.exit(0);
  }
}

seed();
