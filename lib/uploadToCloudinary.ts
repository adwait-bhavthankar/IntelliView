export const uploadToCloudinary = async (
  blob: Blob,
  questionIndex: number
): Promise<{
  url: string;
  public_id: string;
  questionIndex: number;
}> => {
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", "interview_unsigned"); // 👈 change to yours
  formData.append("folder", "interviews");

  const cloudName = "dii10mrdo"; // 👈 change to yours

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Cloudinary upload failed: ${errorText}`);
  }

  const data = await res.json();

  return {
    url: data.secure_url,
    public_id: data.public_id,
    questionIndex,
  };
};
