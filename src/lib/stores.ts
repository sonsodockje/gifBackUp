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

// 로컬 스토리지에서 캐시된 데이터를 가져옵니다.
const storedPhotos = typeof window !== 'undefined' ? localStorage.getItem('photoCache') : null;

// 캐시된 데이터나 빈 배열로 스토어를 초기화합니다.
export const photoStore = writable<ImageItem[]>(storedPhotos ? JSON.parse(storedPhotos) : []);

// 스토어의 값이 변경될 때마다 로컬 스토리지를 업데이트합니다.
photoStore.subscribe(items => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('photoCache', JSON.stringify(items));
  }
});

let isFetching = false;

/**
 * Firebase Storage에서 사진 목록을 가져와 스토어를 업데이트합니다.
 * @param force - true일 경우 캐시를 무시하고 강제로 새로고침합니다.
 */
export const fetchPhotos = async (force = false) => {
  if (isFetching) return;

  const cache = typeof window !== 'undefined' ? localStorage.getItem('photoCache') : null;
  // 강제 새로고침이 아니고 캐시가 존재하면, 캐시된 데이터를 사용합니다.
  if (!force && cache && JSON.parse(cache).length > 0) {
    console.log("캐시에서 사진을 로드합니다.");
    photoStore.set(JSON.parse(cache));
    // 백그라운드에서 최신 데이터를 가져올 수도 있습니다. (stale-while-revalidate)
    // 이 부분은 필요에 따라 주석을 해제하여 사용하세요.
    // fetchFromFirebase(); 
    return;
  }

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
    photoStore.set(items); // 스토어를 업데이트하면 로컬 스토리지도 자동으로 업데이트됩니다.
    console.log("사진 로딩 및 캐시 업데이트 완료.");
  } catch (error) {
    console.error("사진 로딩 중 오류 발생: ", error);
  } finally {
    isFetching = false;
  }
};

export const searchQuery = writable('');

