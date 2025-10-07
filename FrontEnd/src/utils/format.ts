/**
 * Format date to Brazilian format
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('pt-BR')
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('pt-BR')
}
