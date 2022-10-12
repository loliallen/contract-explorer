const METADATA_FILED = "memorized_data";

export const memorize = (name: string, object: any) => {
  const strObject = JSON.stringify(object);
  localStorage.setItem(name, strObject);
  updateMetadata(name);
};

export const getMemorizedData = () => {
  return JSON.parse(localStorage.getItem(METADATA_FILED) || JSON.stringify([]));
};

const updateMetadata = (value: string) => {
  const meta: string[] = JSON.parse(
    localStorage.getItem(METADATA_FILED) || JSON.stringify([])
  );
  meta.push(value);
  localStorage.setItem(METADATA_FILED, JSON.stringify(meta));
};

export const getObject = (name: string) => {
  const strObject = localStorage.getItem(name);
  if (!strObject) return null;
  return JSON.parse(strObject);
};
