<script lang="ts">
    import { storage } from "./firebase";
    import { ref, deleteObject } from "firebase/storage";
    import { onMount } from "svelte";
    import { photoStore, fetchPhotos, searchQuery, userStore } from "./stores";

    let filteredItems: ImageItem[] = [];
    let currentUserUid: string | null = null;
    const adminUid = import.meta.env.VITE_ADMIN_UID;

    userStore.subscribe((user) => {
        currentUserUid = user?.uid || null;
    });

    $: {
        const query = $searchQuery.toLowerCase();
        if (query) {
            filteredItems = $photoStore.filter((item) =>
                item.name.toLowerCase().includes(query)
            );
        } else {
            filteredItems = $photoStore;
        }
    }

    interface ImageItem {
        url: string;
        name: string;
    }

    const copyLink = async (url: string): Promise<void> => {
        await navigator.clipboard.writeText(url);
        alert("링크가 복사되었습니다!");
    };

    const shortCopyLink = async (url: string): Promise<void> => {
        try {
            const response: Response = await fetch("/api/link/v2/create", {
                method: "POST", // HTTP 메서드를 'POST'로 지정합니다.
                headers: {
                    Authorization: `APIKey ${import.meta.env.VITE_URL_API_KEY}`,
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({
                    url: url, // 단축할 긴 URL
                    domain: "https://vvd.bz", // 사용할 도메인 (명세에 따라 포함)
                }),
            });

            interface ShortenLinkResponse {
                code: number;
                result: string;
            }
            const data: ShortenLinkResponse = await response.json();

            if (data.code === 0) {
                const shortUrl = data.result;
                await navigator.clipboard.writeText(shortUrl);
                alert("링크가 복사되었습니다!");
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("URL 단축 중 오류 발생:", error.message);
                alert(
                    "URL 단축 중 문제가 발생했습니다. 다시 시도해 주세요." +
                        error.message
                );
            } else {
                console.error("URL 단축 중 알 수 없는 오류 발생:", error);
                alert("URL 단축 중 알 수 없는 문제가 발생했습니다.");
            }
        }
    };

    const handleDelete = async (url: string): Promise<void> => {
        if (currentUserUid !== adminUid) {
            alert("불가");
            return;
        }

        if (confirm("정말로 이 이미지를 삭제하시겠습니까?")) {
            const imageRef = ref(storage, url);
            await deleteObject(imageRef);
            alert("삭제 완료!");
            fetchPhotos(); // 캐시를 무시하고 목록을 새로고침합니다.
        }
    };

    onMount(() => {
        fetchPhotos();
    });
</script>

<div
    class="grid grid-cols-2 sm:grid-cols-3 2md:grid-cols-4 gap-4 mt-4"
>
    {#each filteredItems as item}
        <div
            class="flex flex-col items-center p-2 border border-gray-200 rounded-lg shadow-md bg-white transition-all duration-300"
        >
            <div
                class="w-full aspect-square  mb-2 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center"
            >
                <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block w-full h-full"
                >
                    <img
                        src={item.url}
                        alt="uploaded"
                        class="object-cover w-full h-full shadow-light-500"
                        loading="lazy"
                    />
                </a>
            </div>

          
            <!-- <div class="flex flex-row justify-between align-middle  items-center w-full">
                <p
                class="text-xs font-semibold w-full text-gray-700"
            >
                {item.name}
            </p>
                <button
                    on:click={() => copyLink(item.url)}
                    class="p-1 text-xs bg-indigo-500 text-white rounded-md hover:cursor-pointer"
                    >🔗</button
                >

                
            </div> -->

            <!-- {#if currentUserUid !== adminUid}
                    <button
                        on:click={() => handleDelete(item.url)}
                        class="py-1 mt-1 px-2 w-full text-xs bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 hover:cursor-pointer"
                        >삭제</button
                    >
                {/if} -->
        </div>
    {/each}
</div>
