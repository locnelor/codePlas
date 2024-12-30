

export const deepCopyArray = <T>(arr: T[]) => {
  const newArr: T[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === 'object') {
      newArr.push(deepCopyObject(arr[i]));
      continue;
    }
    newArr.push(arr[i]);
  }
  return newArr;
}
export const deepCopyObject = <T>(obj: T) => {
  const newObj: T = {} as T;
  for (const key in obj) {
    if (!obj[key]) {
      newObj[key] = obj[key]
      continue;
    }
    if (typeof obj[key] === 'object') {
      newObj[key] = deepCopyObject(obj[key]);
      continue;
    }
    newObj[key] = obj[key];
  }
  return newObj;
}