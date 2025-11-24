<script lang="ts">
  import PhotoUpload from "./lib/PhotoUpload.svelte";
  import PhotoList from "./lib/PhotoList.svelte";
  import Auth from "./lib/Auth.svelte";
  import Search from "./lib/Search.svelte";
  import CommentUpload from "./lib/CommentUpload.svelte";
  import CommentList from "./lib/CommentList.svelte";
</script>

<main class="max-w-3xl mx-auto p-4 bg-white">
  <Auth />

  <!-- <PhotoUpload /> -->
  <Search />
  <PhotoList />
  <!-- <CommentList /> -->
</main>