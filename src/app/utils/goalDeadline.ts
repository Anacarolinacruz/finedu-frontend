/** Meses completos: cada aporte ocorre no aniversário mensal da data inicial. */
export function getGoalDeadlineInfo(deadline: string, referenceDate = new Date()) {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  const end = new Date(`${deadline}T00:00:00`);
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(deadline) &&
    Number.isFinite(today.getTime()) && Number.isFinite(end.getTime()) &&
    end.getFullYear() === Number(deadline.slice(0, 4)) &&
    end.getMonth() + 1 === Number(deadline.slice(5, 7)) &&
    end.getDate() === Number(deadline.slice(8, 10));
  if (!valid) return { valid: false, expired: false, dueToday: false, months: 0 };
  const expired = end < today;
  const dueToday = end.getTime() === today.getTime();
  if (expired || dueToday) return { valid: true, expired, dueToday, months: 0 };
  let months = (end.getFullYear() - today.getFullYear()) * 12 + end.getMonth() - today.getMonth();
  const anniversary = new Date(today.getFullYear(), today.getMonth() + months, 1);
  const lastDay = new Date(anniversary.getFullYear(), anniversary.getMonth() + 1, 0).getDate();
  anniversary.setDate(Math.min(today.getDate(), lastDay));
  if (anniversary > end) months--;
  return { valid: true, expired: false, dueToday: false, months: Math.max(0, months) };
}
