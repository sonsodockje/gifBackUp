<script lang="ts">
  import { searchQuery } from "./stores";
</script>

<div class="p-6 bg-gray-50 rounded-lg shadow-inner mb-6">
  <input type="text" bind:value={$searchQuery} placeholder="사진 이름 검색..." class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200" />
</div>
