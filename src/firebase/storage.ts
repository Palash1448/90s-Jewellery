import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage, isPlaceholderConfig } from './config';

/**
 * Client-side image compression using HTML Canvas
 * Resizes max dimension to 1600px and converts to WebP/JPEG with quality 0.85
 */
export async function compressImage(file: File, maxDimension = 1400, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If SVG or gif, return as is
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Upload product image to Firebase Storage
 */
export async function uploadProductImage(file: File, slug: string): Promise<string> {
  const timestamp = Date.now();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `products/${slug || 'catalog'}/${timestamp}_${cleanFileName}`;

  try {
    const compressedBlob = await compressImage(file);

    if (!isPlaceholderConfig) {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, compressedBlob, {
        contentType: 'image/webp',
        customMetadata: { originalName: file.name, uploadedAt: new Date().toISOString() }
      });
      return await getDownloadURL(snapshot.ref);
    }
  } catch (error) {
    console.warn('Firebase Storage upload warning, using local preview fallback:', error);
  }

  // Fallback / offline data URL generator for local development & immediate preview
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Delete image from Firebase Storage if it matches the bucket URL
 */
export async function deleteProductImage(imageUrl: string): Promise<void> {
  if (isPlaceholderConfig || !imageUrl.includes('firebasestorage.googleapis.com')) {
    return;
  }
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (err) {
    console.warn('Could not delete image from Firebase Storage:', err);
  }
}
