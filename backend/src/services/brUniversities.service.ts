import { BR_UNIVERSITIES, BRUniversity } from '../data/brUniversities';

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export type SearchParams = {
  q?: string;
  state?: string;
  city?: string;
  limit?: number;
};

export function search(params: SearchParams) {
  const { q, state, city, limit = 10 } = params;
  const qNorm = (q || '').trim();
  const stateNorm = (state || '').trim().toUpperCase();
  const cityNorm = (city || '').trim();

  let items: BRUniversity[] = BR_UNIVERSITIES;

  if (qNorm) {
    const r = new RegExp(escapeRegex(qNorm), 'i');
    items = items.filter(u => r.test(u.name) || (u.acronym && r.test(u.acronym)));
  }
  if (stateNorm) {
    items = items.filter(u => (u.state || '').toUpperCase() === stateNorm);
  }
  if (cityNorm) {
    const rCity = new RegExp(escapeRegex(cityNorm), 'i');
    items = items.filter(u => u.city && rCity.test(u.city));
  }

  return { items: items.slice(0, limit) };
}