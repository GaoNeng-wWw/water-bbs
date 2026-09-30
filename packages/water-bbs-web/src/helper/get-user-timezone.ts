export const getUserTimezone = (intl: typeof Intl = Intl) => intl.DateTimeFormat().resolvedOptions().timeZone;
