export const filterNotelp = (value: string) => {
  return value.replace(/[^0-9]/g, "");
};

// format Tanggal Indo
export const formatDate = (tanggal: string, waktu?: string) => {
  const date = new Date(tanggal).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  if (!waktu) return date;
  return `${date} pukul ${waktu}`;
};