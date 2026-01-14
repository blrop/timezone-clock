export function getCityName(timezone: string): string {
  const index = timezone.lastIndexOf('/');
  if (index < 0) {
    return timezone;
  }
  return timezone.substring(index + 1).replaceAll('_', ' ');
}
