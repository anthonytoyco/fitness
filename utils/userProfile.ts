import { storage, db } from '@/FirebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export async function pickImageFromLibrary() {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      throw new Error('Permission to access media library is required');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }

    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    throw error;
  }
}

export async function uploadImageToStorage(uri: string, userId: string): Promise<string> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = `avatars/${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image to storage:', error);
    throw error;
  }
}

export async function updateUserPhotoUrl(userId: string, photoUrl: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      photoUrl: photoUrl,
    });
  } catch (error) {
    console.error('Error updating user photo URL:', error);
    throw error;
  }
}

export async function updateUserAvatar(userId: string): Promise<string | null> {
  try {
    const image = await pickImageFromLibrary();
    if (!image) {
      return null;
    }

    const photoUrl = await uploadImageToStorage(image.uri, userId);

    await updateUserPhotoUrl(userId, photoUrl);

    return photoUrl;
  } catch (error) {
    console.error('Error updating user avatar:', error);
    throw error;
  }
}
