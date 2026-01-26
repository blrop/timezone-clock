import { DEFAULT_TIMEZONE_1, DEFAULT_TIMEZONE_2 } from '~/lib/constants';
import { DateTime } from 'luxon';

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
    const localTimezone = DateTime.now().zoneName;
    const otherTimezone = (localTimezone === DEFAULT_TIMEZONE_1) ? DEFAULT_TIMEZONE_2 : DEFAULT_TIMEZONE_1;
    return [
      localTimezone,
      otherTimezone,
    ];
  }

  return window.location.hash
    .slice(1) // remove leading '#'
    .split(';');
}

export function getColorHueForItem(index: number, totalItems: number): string {
  const colorGap = totalItems <= 6 ? 60 : Math.round(360 / totalItems);
  return (index * colorGap).toString();
}
