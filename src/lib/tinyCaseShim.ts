const reWords =
  /[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+|[^\s_\-.]+/g;

export function words(str: string): string[] {
  return String(str).match(reWords) ?? [];
}

export function upperFirst(str: string): string {
  return str ? str[0].toUpperCase() + str.slice(1) : str;
}

function join(str: string, delimiter: string): string {
  return words(str).join(delimiter).toLowerCase();
}

export function camelCase(str: string): string {
  return words(str).reduce((acc, next) => {
    const lower = next.toLowerCase();
    return acc ? `${acc}${upperFirst(lower)}` : lower;
  }, '');
}

export function pascalCase(str: string): string {
  return upperFirst(camelCase(str));
}

export function snakeCase(str: string): string {
  return join(str, '_');
}

export function kebabCase(str: string): string {
  return join(str, '-');
}

export function sentenceCase(str: string): string {
  return upperFirst(join(str, ' '));
}

export function titleCase(str: string): string {
  return words(str).map(upperFirst).join(' ');
}
