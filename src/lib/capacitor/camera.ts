import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { isNativeApp } from ".";

/**
 * Take a photo using the native camera on iOS/Android,
 * returning a base64 data URL. Falls back to null on web
 * so the caller can use the existing web camera flow.
 */
export async function takeNativePhoto(): Promise<string | null> {
  if (!isNativeApp()) return null;

  try {
    const photo = await Camera.getPhoto({
      quality: 85,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      width: 1024,
      correctOrientation: true,
    });
    return photo.dataUrl ?? null;
  } catch {
    // User cancelled or permission denied
    return null;
  }
}

/**
 * Pick a photo from the native gallery on iOS/Android,
 * returning a base64 data URL. Falls back to null on web.
 */
export async function pickNativePhoto(): Promise<string | null> {
  if (!isNativeApp()) return null;

  try {
    const photo = await Camera.getPhoto({
      quality: 85,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
      width: 1024,
      correctOrientation: true,
    });
    return photo.dataUrl ?? null;
  } catch {
    return null;
  }
}
