import { writable } from 'svelte/store';
import { storage, auth } from './firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import type { User } from "firebase/auth";

interface ImageItem {
  url: string;
  name: string;
}

// User store
export const userStore = writable<User | null>(null);

// Update user store on auth state change
auth.onAuthStateChanged((user) => {
  userStore.set(user);
});

export const photoStore = writable<ImageItem[]>([]);

let isFetching = false;

export const fetchPhotos = async () => {
  if (isFetching) return;

  isFetching = true;
  try {
    console.log("Firebase Storage에서 사진을 가져옵니다...");
    const listRef = ref(storage, 'images');
    const res = await listAll(listRef);
    const itemsPromises = res.items.map(async (itemRef) => ({
      url: await getDownloadURL(itemRef),
      name: itemRef.name,
    }));
    const items = await Promise.all(itemsPromises);
    photoStore.set(items);
    console.log("사진 로딩 완료.");
  } catch (error) {
    
    console.error("사진 로딩 중 오류 발생: ", error);
  } finally {
    isFetching = false;
  }
};

export const searchQuery = writable('');

