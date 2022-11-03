import axios from 'axios';

export async function urlToBase64(urlStr: string) {
  const response = await axios.get(urlStr, { responseType: "arraybuffer" });
  const data = response.data;
  const base = Buffer.from(data, "base64");
  return `data:image/jpg;base64,${base.toString("base64")}`;
}
