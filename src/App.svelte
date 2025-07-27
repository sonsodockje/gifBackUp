<script lang="ts">
  import PhotoUpload from "./lib/PhotoUpload.svelte";
  import PhotoList from "./lib/PhotoList.svelte";
  import Auth from "./lib/Auth.svelte";
  import Search from "./lib/Search.svelte";
</script>

<main class="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-lg">
  <h1 class="text-3xl font-extrabold text-center text-gray-800 mb-6">^^</h1>
  <Auth />
  <PhotoUpload />
  <Search />
  <PhotoList />
</main>