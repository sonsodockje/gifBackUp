<script lang="ts">
  import { db } from "./firebase";
  import { collection, addDoc, Timestamp } from "firebase/firestore";

  let commentText: string = '';
  let isSubmitting: boolean = false;

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    isSubmitting = true;
    try {
      await addDoc(collection(db, "comments"), {
        text: commentText,
        timestamp: Timestamp.now(),
      });
      commentText = ''; // Clear input
      alert("댓글이 성공적으로 게시되었습니다!");
    } catch (error) {
      console.error("댓글 게시 중 오류 발생:", error);
      alert("댓글 게시 중 오류가 발생했습니다.");
    } finally {
      isSubmitting = false;
    }
  };
</script>

<div class="mt-10 p-6 bg-gray-50 rounded-lg shadow-inner mb-6">

  <textarea
    bind:value={commentText}
    placeholder="여기에 쪽지를 남겨주세요..."
    rows="4"
    class="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 mb-4"
  ></textarea>
  <button
    on:click={handleSubmit}
    disabled={isSubmitting}
    class="w-full py-2 px-4 rounded-md text-white font-semibold transition-all duration-200
      {isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}"
  >
    {#if isSubmitting}
      게시 중...
    {:else}
      쪽지 게시
    {/if}
  </button>
</div>
