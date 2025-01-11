export const BaseURI = import.meta.env.VITE_BASE_URI
export const joinPath = (...paths: string[]) => {
  let basePath = BaseURI
  if (!basePath.endsWith('/')) {
    basePath += '/';
  }
  const fullPath = paths
    .map((part) => part.replace(/^\/+/, ''))
    .join('/');
  return basePath + fullPath;
};