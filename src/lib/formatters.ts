export function formatkWh(value: number, opts: { digits?: number; unit?: boolean } = {}): string {
  const digits = opts.digits ?? (value >= 100 ? 0 : value >= 10 ? 1 : 2);
  const formatted = value.toLocaleString("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return opts.unit === false ? formatted : `${formatted} kWh`;
}

export function formatIntensity(
  value: number,
  opts: { digits?: number; unit?: boolean } = {},
): string {
  const digits = opts.digits ?? (value >= 10 ? 1 : 2);
  const formatted = value.toLocaleString("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return opts.unit === false ? formatted : `${formatted} kWh/m²`;
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

export function formatRelativeMinutes(
  minutes: number,
  updatedLabel = "aktualisiert",
): string {
  if (minutes < 1) return updatedLabel === "updated" ? "just now" : "gerade eben";
  if (minutes < 60) {
    return updatedLabel === "updated"
      ? `${minutes} min. ago`
      : `vor ${minutes} Min.`;
  }
  const h = Math.floor(minutes / 60);
  return updatedLabel === "updated" ? `${h} hrs. ago` : `vor ${h} Std.`;
}

const WEEKDAYS_DE = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS_LONG_DE = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
const WEEKDAYS_LONG_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS_DE = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function weekdayShort(date: Date, locale: "de" | "en" = "de"): string {
  return (locale === "en" ? WEEKDAYS_EN : WEEKDAYS_DE)[date.getDay()];
}

export function weekdayLong(date: Date, locale: "de" | "en" = "de"): string {
  return (locale === "en" ? WEEKDAYS_LONG_EN : WEEKDAYS_LONG_DE)[date.getDay()];
}

export function monthShort(date: Date, locale: "de" | "en" = "de"): string {
  return (locale === "en" ? MONTHS_EN : MONTHS_DE)[date.getMonth()];
}

export function formatDateDE(date: Date): string {
  return `${date.getDate()}. ${monthShort(date)} ${date.getFullYear()}`;
}
