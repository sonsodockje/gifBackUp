<script lang="ts">
  import { storage } from "./firebase";
  import { ref, uploadBytes } from "firebase/storage";
  import { fetchPhotos, userStore } from "./stores";
  import { getAuth } from "firebase/auth";

  let file: FileList | null;
  let fileName: string = '';
  let isLoading: boolean = false;
  let fileInput: HTMLInputElement;
  let currentUserUid: string | null = null;

  const adminUid = import.meta.env.VITE_ADMIN_UID;

  userStore.subscribe(user => {
    currentUserUid = user?.uid || null;
  });

  const handleUpload = async () => {
    if (!currentUserUid || currentUserUid !== adminUid) {
      alert("관리자만 사진을 업로드할 수 있습니다.");
      return;
    }

    if (file && fileName) {
      isLoading = true;
      try {
        const storageRef = ref(storage, `images/${fileName}`);
        await uploadBytes(storageRef, file[0]);
        alert("업로드 완료!");
        fetchPhotos(true); // 캐시를 무시하고 목록을 새로고침합니다.
        // Clear inputs after successful upload
        file = null;
        fileName = '';
        if (fileInput) {
          fileInput.value = '';
        }
      } catch (error) {
        // console.error("업로드 실패:", error);
        alert("업로드 실패!");
      } finally {
        isLoading = false;
      }
    } else if (!file) {
      alert("파일을 선택해주세요.");
    } else if (!fileName) {
      alert("파일 이름을 입력해주세요.");
    }
  };
</script>

<div class="p-6 bg-gray-50 rounded-lg shadow-inner mb-6">
  <div class="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
    <input type="file" bind:files={file} bind:this={fileInput} class="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
    <input type="text" bind:value={fileName} placeholder="파일 이름 입력" class="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200" />
    <button on:click={handleUpload} disabled={isLoading} class="w-full md:w-auto py-2 px-6 rounded-md text-white font-semibold transition-all duration-200 {
      isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 transform hover:scale-105'
    }">
      {#if isLoading}
        업로드 중...
      {:else}
        업로드
      {/if}
    </button>
  </div>
</div>
