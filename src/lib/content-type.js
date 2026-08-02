export default {
  parse: function (contentType) {
    const parts = contentType.split(';').map(s => s.trim());
    const [type] = parts[0].split('/');
    const subtype = parts[0].split('/').slice(1).join('/');
    const parameters = {};

    for (let i = 1; i < parts.length; i++) {
      const param = parts[i];
      const eq = param.indexOf('=');
      if (eq === -1) continue;
      const key = param.substring(0, eq).trim().toLowerCase();
      let value = param.substring(eq + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      parameters[key] = value;
    }

    return {
      type,
      subtype,
      suffix: '',
      parameters
    };
  }
};

export function format(obj) {
  let str = obj.type + '/' + obj.subtype;
  if (obj.suffix) str += '+' + obj.suffix;
  const entries = Object.entries(obj.parameters || {});
  for (const [k, v] of entries) {
    str += '; ' + k + '=' + (String(v).includes(' ') ? '"' + v + '"' : v);
  }
  return str;
}

export function stringify(obj) {
  return format(obj);
}
