/**
 * convert milliseconds to seconds
 * @param milliSeconds
 * @returns
 */
export const convertMillisecondsToSeconds = (milliSeconds: number): number => {
  return milliSeconds / 1000;
};

/**
 * convert seconds to milliseconds
 * @param seconds
 * @returns
 */
export const convertSecondsToMilliseconds = (seconds: number): number => {
  return seconds * 1000;
};

/**
 * get todays date
 * @returns
 */
export const getTodaysDate = (): string => {
  const today = new Date();
  // day
  let dd = today.getDate().toString();
  dd = dd.length === 1 ? `0${dd}` : dd;
  // mm
  let mm = (today.getMonth() + 1).toString();
  mm = mm.length === 1 ? `0${mm}` : mm;
  // yyyy
  let yyyy = today.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
};
