import * as chrono from 'chrono-node';

const DEFAULT_HOUR = 17;
const DEFAULT_MINUTE = 0;
const EVENING_HOUR = 20;

export interface ParsedScheduleResult {
  cleanedText: string;
  scheduledAt: string | null;
  scheduleText: string | null;
}

export const TODAY_FILTER = '__TODAY__';
export const TOMORROW_FILTER = '__TOMORROW__';
export const PAST_DUE_FILTER = '__PAST_DUE__';

export const parseSchedule = (input: string, referenceDate: Date = new Date()): ParsedScheduleResult => {
  const results = chrono.parse(input, referenceDate, { forwardDate: true });
  const match = results[0];

  if (!match) {
    return {
      cleanedText: cleanupText(input),
      scheduledAt: null,
      scheduleText: null,
    };
  }

  const scheduledDate = buildScheduledDate(match);
  const cleanedText = cleanupText(
    input.slice(0, match.index) + input.slice(match.index + match.text.length)
  );

  return {
    cleanedText,
    scheduledAt: scheduledDate ? scheduledDate.toISOString() : null,
    scheduleText: match.text.trim(),
  };
};

const cleanupText = (text: string) =>
  text
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim();

const buildScheduledDate = (match: chrono.ParsedResult) => {
  const scheduled = match.date();
  if (!Number.isFinite(scheduled.getTime())) {
    return null;
  }

  const normalized = match.text.toLowerCase();

  if (!match.start.isCertain('hour')) {
    const defaultHour = normalized.includes('tonight') ? EVENING_HOUR : DEFAULT_HOUR;
    scheduled.setHours(defaultHour, DEFAULT_MINUTE, 0, 0);
  } else if (!match.start.isCertain('minute')) {
    scheduled.setMinutes(DEFAULT_MINUTE, 0, 0);
  }

  return scheduled;
};

export const isPastDue = (scheduledAt: string | null | undefined, referenceDate: Date = new Date()) => {
  if (!scheduledAt) return false;
  const dueDate = new Date(scheduledAt);
  return Number.isFinite(dueDate.getTime()) && dueDate.getTime() < referenceDate.getTime();
};

export const isDueToday = (scheduledAt: string | null | undefined, referenceDate: Date = new Date()) => {
  if (!scheduledAt) return false;
  const dueDate = new Date(scheduledAt);
  if (!Number.isFinite(dueDate.getTime())) return false;

  const sameYear = dueDate.getFullYear() === referenceDate.getFullYear();
  const sameMonth = dueDate.getMonth() === referenceDate.getMonth();
  const sameDate = dueDate.getDate() === referenceDate.getDate();

  return sameYear && sameMonth && sameDate;
};

export const isDueTomorrow = (scheduledAt: string | null | undefined, referenceDate: Date = new Date()) => {
  if (!scheduledAt) return false;
  const dueDate = new Date(scheduledAt);
  if (!Number.isFinite(dueDate.getTime())) return false;

  const tomorrow = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate() + 1);
  return (
    dueDate.getFullYear() === tomorrow.getFullYear() &&
    dueDate.getMonth() === tomorrow.getMonth() &&
    dueDate.getDate() === tomorrow.getDate()
  );
};

export const formatScheduledAt = (scheduledAt: string | null | undefined) => {
  if (!scheduledAt) return null;
  const dueDate = new Date(scheduledAt);
  if (!Number.isFinite(dueDate.getTime())) {
    return null;
  }
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(dueDate);
};
