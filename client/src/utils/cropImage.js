// This function creates a new Image object from the URL/File
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); 
    image.src = url;
  });

// This function draws the cropped part onto a canvas and returns the Base64 string
export default async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to the cropped area size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the image onto the canvas (cropping it)
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Convert to Base64 String (JPEG, 90% quality)
  // We resize to 300x300 to keep the database happy
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = 300;
  finalCanvas.height = 300;
  const finalCtx = finalCanvas.getContext('2d');
  
  finalCtx.drawImage(canvas, 0, 0, 300, 300);

  return finalCanvas.toDataURL('image/jpeg', 0.9);
}