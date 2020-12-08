export function orderProps(obj, ignore = []) {
  if (obj) {
    const keys = Object.keys(obj).sort().filter(key => !ignore.includes(key));
    return keys.reduce((result, key) => ({
        ...result,
        [key]: obj[key]
      }),
      {}
    );
  } else {
    return obj;
  }
}
