<script lang="ts">
  import PhotoUpload from "./lib/PhotoUpload.svelte";
  import PhotoList from "./lib/PhotoList.svelte";
  import Auth from "./lib/Auth.svelte";
  import Search from "./lib/Search.svelte";
  import CommentUpload from "./lib/CommentUpload.svelte";
  import CommentList from "./lib/CommentList.svelte";
</script>

<main class="max-w-3xl mx-auto p-4 mt-6 bg-white shadow-lg rounded-lg">
  <h1 class="text-2xl font-extrabold text-center text-gray-800 mb-4">^^</h1>
  <Auth />
  <PhotoUpload />
  <Search />
  <PhotoList />
  <CommentUpload />
  <CommentList />
</main>