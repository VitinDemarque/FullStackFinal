export type BRUniversity = {
  id: string;
  name: string;
  acronym?: string;
  city?: string;
  state?: string; // UF
};

// Lista enxuta para exemplo/demo. Expanda conforme necessidade acadêmica.
export const BR_UNIVERSITIES: BRUniversity[] = [
  { id: 'usp-sp', name: 'Universidade de São Paulo', acronym: 'USP', city: 'São Paulo', state: 'SP' },
  { id: 'unicamp-sp', name: 'Universidade Estadual de Campinas', acronym: 'UNICAMP', city: 'Campinas', state: 'SP' },
  { id: 'ufrj-rj', name: 'Universidade Federal do Rio de Janeiro', acronym: 'UFRJ', city: 'Rio de Janeiro', state: 'RJ' },
  { id: 'ufmg-mg', name: 'Universidade Federal de Minas Gerais', acronym: 'UFMG', city: 'Belo Horizonte', state: 'MG' },
  { id: 'ufsc-sc', name: 'Universidade Federal de Santa Catarina', acronym: 'UFSC', city: 'Florianópolis', state: 'SC' },
  { id: 'ufpr-pr', name: 'Universidade Federal do Paraná', acronym: 'UFPR', city: 'Curitiba', state: 'PR' },
  { id: 'ufrs-rs', name: 'Universidade Federal do Rio Grande do Sul', acronym: 'UFRGS', city: 'Porto Alegre', state: 'RS' },
  { id: 'unb-df', name: 'Universidade de Brasília', acronym: 'UnB', city: 'Brasília', state: 'DF' },
  { id: 'ufpe-pe', name: 'Universidade Federal de Pernambuco', acronym: 'UFPE', city: 'Recife', state: 'PE' },
  { id: 'ufba-ba', name: 'Universidade Federal da Bahia', acronym: 'UFBA', city: 'Salvador', state: 'BA' },
];