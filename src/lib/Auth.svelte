<script lang="ts">
  import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  import type { User } from "firebase/auth";

  let userLoggedIn = false;
  let currentUser: User | null = null;

  onAuthStateChanged(auth, (user) => {
    userLoggedIn = !!user;
    currentUser = user;
  });

  const handleAuth = async () => {

    
    if (userLoggedIn) {
      await signOut(auth);
      console.log("로그아웃 성공");
    } else {
      try {
        const result = await signInWithPopup(auth, provider);

        // 로그인 성공 시 처리할 로직
        const credential = GoogleAuthProvider.credentialFromResult(result);
        let token = null;
        let user = null;
        if (credential) {
          token = credential.accessToken;
          user = result.user;
        }

        // TODO: 사용자 정보를 이용한 추가 작업 (예: 서버에 사용자 정보 전송)
        // console.log("로그인 성공:", user);
        // console.log("액세스 토큰:", token);
      } catch (error: any) {
        // 오류 발생 시 처리할 로직
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData?.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        // console.error("로그인 오류 발생:", errorMessage);
        // ... 오류 처리 로직 추가
      }
    }
  };
</script>

<div class="w-full">

  <button on:click={handleAuth} class="p-2 mb-2 rounded-md text-white  text-sm transition-all duration-200 ">
    {#if userLoggedIn}
      🎀
    {:else}
      🎀
    {/if}

  </button>
  <button on:click={handleAuth} class="p-2 mb-2 rounded-md text-white  text-sm transition-all duration-200 ">
    💌
  </button>
</div>