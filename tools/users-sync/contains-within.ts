function isObject(object) {
  return object != null && typeof object === 'object';
}

export function containsWithin(obj, reference): boolean {
  if (obj === reference) {
    return true;
  } else if (Array.isArray(obj) && Array.isArray(reference)) {
    return obj.length === reference.length
      && obj.every((item, index) => containsWithin(item, reference[index]));
  } else if (isObject(obj) && isObject(reference)) {
    const objKeys = Object.keys(obj);
    return objKeys.every(key => containsWithin(obj[key], reference[key]))
  } else {
    return false;
  }
}
