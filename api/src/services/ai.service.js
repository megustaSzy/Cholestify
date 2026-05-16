import axios from "axios";
import FormData from "form-data";

export const predictEyeScan = async (fileBuffer, filename) => {
  const formData = new FormData();

  formData.append("file", fileBuffer, filename);

  const response = await axios.post(
    process.env.FASTAPI_URL + "/predict",
    formData,
    {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
    },
  );

  return response.data;
};
