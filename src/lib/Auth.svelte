<script lang="ts">
    import {
        getAuth,
        signInWithPopup,
        GoogleAuthProvider,
        onAuthStateChanged,
        signOut,
    } from "firebase/auth";
    import CommentUpload from "./CommentUpload.svelte";

    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    import type { User } from "firebase/auth";

    let userLoggedIn = false;
    let currentUser: User | null = null;
    let showCommentPopup = false;

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
                const credential =
                    GoogleAuthProvider.credentialFromResult(result);
                if (credential) {
                    const token = credential.accessToken;
                    const user = result.user;
                }
            } catch (error: any) {
                console.error("로그인 오류 발생:", error.message);
            }
        }
    };

    const openCommentPopup = () => {
        showCommentPopup = true;
    };

    const closeCommentPopup = () => {
        showCommentPopup = false;
    };

    const handleCommentSubmitted = () => {
        setTimeout(() => {
            closeCommentPopup();
        }, 500);
    };
</script>

<div class="w-full">
    <button
        on:click={handleAuth}
        class="p-2 mb-2 rounded-md text-white text-sm transition-all duration-200"
    >
        {#if userLoggedIn}
            🎀
        {:else}
            🎀
        {/if}
    </button>
    <button
        on:click={openCommentPopup}
        class="p-2 mb-2 rounded-md text-white text-sm transition-all duration-200"
    >
        💌
    </button>
</div>

{#if showCommentPopup}
    <div
        class="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
        on:click|self={closeCommentPopup}
    >
        <div class="bg-white p-4 rounded-lg shadow-xl">
            <CommentUpload on:submitted={handleCommentSubmitted} />
        </div>
    </div>
{/if}
