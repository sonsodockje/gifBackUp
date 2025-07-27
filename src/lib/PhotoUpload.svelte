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

    
      if (currentUserUid !== adminUid) {
    alert("관리자만 가능.");
    return;
  }


  // 파일과 파일 이름이 모두 선택/입력되었는지 먼저 확인합니다.
  if (!file) {
    alert("파일을 선택해주세요.");
    return;
  }
  if (!fileName) {
    alert("파일 이름을 입력해주세요.");
    return;
  }
  isLoading = true;
  try {
    // Firebase Storage에 파일 업로드
    const storageRef = ref(storage, `images/${fileName}`);
    await uploadBytes(storageRef, file[0]); // file[0]은 FileList에서 첫 번째 파일

    alert("업로드 완료!");
    // 업로드 성공 후 사진 목록을 새로고침합니다.
    // fetchPhotos 함수가 캐시를 무시하고 최신 목록을 가져오도록 구현되어 있다고 가정합니다.
    fetchPhotos(true);

    // 입력 필드를 초기화합니다.
    file = null;
    fileName = '';
    if (fileInput) {
      fileInput.value = '';
    }
  } catch (error) {
    console.error("업로드 실패:", error);
    // Firebase Storage 보안 규칙에 의해 거부된 경우, 여기에 Permission Denied 오류가 나타날 수 있습니다.
    alert("업로드 실패! (권한 문제 또는 네트워크 오류일 수 있습니다.)");
  } finally {
    // 로딩 상태를 비활성화합니다.
    isLoading = false;
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
