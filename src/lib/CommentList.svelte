<script lang="ts">
  import { db, auth } from "./firebase"; // auth 인스턴스도 가져옵니다.
  import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
  import { onMount, onDestroy } from "svelte";
  import { onAuthStateChanged } from "firebase/auth"; // 인증 상태 변화 감지

  interface CommentItem {
    id: string;
    text: string;
    timestamp: Timestamp;
  }

  let comments: CommentItem[] = [];
  let unsubscribeFirestore: (() => void) | null = null; // Firestore 구독 해제 함수
  let authUnsubscribe: (() => void) | null = null; // Auth 구독 해제 함수
  let isFirebaseReady = false; // Firebase 준비 상태 플래그

  onMount(() => {
    // Firebase Authentication 상태 변화를 감지하는 리스너 설정
    authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isFirebaseReady) { // 이 블록은 한 번만 실행되도록 합니다.
        console.log("Firebase Auth 상태 확인 완료. Firestore 리스너 설정 시도.");
        isFirebaseReady = true; // 준비 완료 플래그 설정

        // Firestore 쿼리 및 실시간 리스너 설정
        const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
        unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
          const fetchedComments: CommentItem[] = [];
          querySnapshot.forEach((doc) => {
            fetchedComments.push({
              id: doc.id,
              text: doc.data().text,
              timestamp: doc.data().timestamp,
            });
          });
          comments = fetchedComments;
        }, (error) => {
          console.error("댓글 로딩 중 오류 발생:", error);
          // 오류 발생 시 사용자에게 알림 또는 UI 업데이트
        });
      }
    });

    // 컴포넌트 언마운트 시 모든 구독 해제
    return () => {
      if (authUnsubscribe) authUnsubscribe();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  });

  // onDestroy 훅은 onMount의 return 함수로 대체될 수 있습니다.
  // 여기서는 명시적으로 사용하지 않아도 됩니다.

  const formatTimestamp = (timestamp: Timestamp): string => {
    const date = timestamp.toDate();
    return date.toLocaleString(); // 필요에 따라 형식 조정
  };
  
</script>

<div class="p-6 bg-gray-50 rounded-lg shadow-inner">
  <h2 class="text-xl font-bold text-gray-800 mb-4">쪽지함</h2>
  {#if !isFirebaseReady}
    <p class="text-gray-600">데이터 로딩 중...</p>
  {:else if comments.length === 0}
    <p class="text-gray-600">아직 쪽지가 없습니다. 첫 쪽지를 남겨주세요!</p>
  {:else}
    <div class="space-y-4">
      {#each comments as comment (comment.id)}
        <div class="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <p class="text-gray-700 mb-2">{comment.text}</p>
          <p class="text-sm text-gray-500 text-right">{formatTimestamp(comment.timestamp)}</p>
        </div>
      {/each}
    </div>
  {/if}
</div>