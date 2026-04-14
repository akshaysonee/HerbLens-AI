import apiClient from "./apiClient.js";

export async function identifyPlant(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await apiClient.post("/plant/identify", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data?.data;
  } catch (error) {
    console.error("Plant identification error:", error);

    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Plant identification failed",
    );
  }
}

// import apiClient from "./apiClient.js";

// export async function identifyPlant(imageFile, onProgress) {
//   const formData = new FormData();
//   formData.append("image", imageFile);

//   try {
//     const response = await apiClient.post("/plant/identify", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },

//       // 🔥 NEW: upload progress tracking
//       onUploadProgress: (progressEvent) => {
//         if (!progressEvent.total) return;

//         const percent = Math.round(
//           (progressEvent.loaded * 100) / progressEvent.total,
//         );

//         if (onProgress) {
//           onProgress(percent);
//         }
//       },
//     });

//     // 🔥 IMPORTANT: return full response (for async system)
//     return response.data;
//   } catch (error) {
//     console.error("Plant identification error:", error);

//     throw new Error(
//       error?.response?.data?.message ||
//         error?.message ||
//         "Plant identification failed",
//     );
//   }
// }