import { DEFAULT_TIMEZONES } from '~/lib/constants';

export function getCityName(timezone: string): string {
  const index = timezone.lastIndexOf('/');
  if (index < 0) {
    return timezone;
  }
  return timezone.substring(index + 1).replaceAll('_', ' ');
}

export function zeroPad(n: number | undefined): string {
  if (n === undefined) {
    return '';
  }
  return n < 10 ? `0${n}` : n.toString();
}

export function saveTimezones(timezones: string[]) {
  window.location.hash = timezones.join(';');
}

export function loadTimezones(): string[] {
  if (!window.location.hash) {
    return DEFAULT_TIMEZONES;
  }
  return window.location.hash
    .slice(1) // remove leading '#'
    .split(';');
}

export function getColorHueForItem(index: number, totalItems: number): string {
  const colorGap = totalItems <= 6 ? 60 : Math.round(360 / totalItems);
  return (index * colorGap).toString();
}
