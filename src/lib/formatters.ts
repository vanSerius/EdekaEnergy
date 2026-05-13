export function formatkWh(value: number, opts: { digits?: number; unit?: boolean } = {}): string {
  const digits = opts.digits ?? (value >= 100 ? 0 : value >= 10 ? 1 : 2);
  const formatted = value.toLocaleString("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return opts.unit === false ? formatted : `${formatted} kWh`;
}

export function formatKg(value: number, opts: { digits?: number; unit?: boolean } = {}): string {
  const digits = opts.digits ?? (value >= 100 ? 0 : 1);
  const formatted = value.toLocaleString("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return opts.unit === false ? formatted : `${formatted} kg`;
}

export function formatPercent(value: number, opts: { signed?: boolean; digits?: number } = {}): string {
  const digits = opts.digits ?? 1;
  const sign = opts.signed && value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} %`;
}

export function formatEuro(value: number): string {
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

export function formatInt(value: number): string {
  return value.toLocaleString("de-DE");
}

export function formatRelativeMinutes(minutes: number): string {
  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Min.`;
  const h = Math.floor(minutes / 60);
  return `vor ${h} Std.`;
}

const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const WEEKDAYS_LONG = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

export function weekdayShort(date: Date): string {
  return WEEKDAYS[date.getDay()];
}

export function weekdayLong(date: Date): string {
  return WEEKDAYS_LONG[date.getDay()];
}

export function monthShort(date: Date): string {
  return MONTHS[date.getMonth()];
}

export function formatDateDE(date: Date): string {
  return `${date.getDate()}. ${monthShort(date)} ${date.getFullYear()}`;
}
