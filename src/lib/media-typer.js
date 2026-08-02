export function parse(string) {
  if (!string) {
    throw new TypeError('argument string is required');
  }
  if (typeof string !== 'string') {
    throw new TypeError('argument string is required to be a string');
  }
  const TYPE_REGEXP = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;
  const match = TYPE_REGEXP.exec(string.toLowerCase());
  if (!match) {
    throw new TypeError('invalid media type');
  }
  const type = match[1];
  const subtype = match[2];
  let suffix;
  const index = subtype.lastIndexOf('+');
  if (index !== -1) {
    suffix = subtype.substring(index + 1);
  }
  return { type, subtype, suffix: suffix || '' };
}

export function format(obj) {
  let str = obj.type + '/' + obj.subtype;
  if (obj.suffix) str += '+' + obj.suffix;
  return str;
}

export function test(string) {
  if (!string) {
    throw new TypeError('argument string is required');
  }
  if (typeof string !== 'string') {
    throw new TypeError('argument string is required to be a string');
  }
  const TYPE_REGEXP = /^ *([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}) *$/;
  return TYPE_REGEXP.test(string.toLowerCase());
}

export default { parse, format, test };
