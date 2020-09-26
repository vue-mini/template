export function stringifyQuery(obj: Record<string, string>): string {
  let str = '';
  Object.keys(obj).forEach((key) => {
    str = `${str}&${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
  });
  if (str) {
    str = str.replace(/^&/, '?');
  }

  return str;
}
