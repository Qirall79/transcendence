export async function uploadFile(file: any) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "transcendence");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/docpycf9f/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await response.json();

  if (data?.url) {
    data.url = data.url.replace("http", "https");
  }

  return data.url;
}
