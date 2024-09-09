const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append("upload_preset", "chat-app-file");

    const response = await fetch(url, {
        method: 'post',
        body: formData
    })

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const responseData = await response.json();

    return responseData;
}

export default uploadFile;