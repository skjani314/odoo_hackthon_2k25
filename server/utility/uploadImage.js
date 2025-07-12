import cloudinary from 'cloudinary';


const uploadImageToCloudinary = async (imagePath) => {
  if (!cloudinary.config().cloud_name) {
    console.warn('Cloudinary not configured. Skipping image upload.');
    return null;
  }
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'skill_swap_profiles', // Optional: specify a folder for organization
      // resource_type: 'auto', // Automatically detect file type
    });
    return result.secure_url; // Return the URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    // In a real app, you might throw an error or handle it more gracefully
    return null;
  }
}

export default uploadImageToCloudinary;