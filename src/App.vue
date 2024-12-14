<script setup lang="ts">
import type { PluginMessageEvent } from './model';
import { onMounted, ref } from 'vue';
import { signal } from 'vue-signals';

const theme = signal<string | null>(null);
const threads = ref<string | null>(null);
const openedThread = ref<number| null>(null);

onMounted(() => {
  const url = new URL(window.location.href);

  const initialTheme = url.searchParams.get('theme');

  if (initialTheme) {
    theme.set(initialTheme as string);
  }

  window.addEventListener('message', (event: PluginMessageEvent) => {
    if (event.data.type === 'theme') {
      theme.set(event.data.content);
    }

    if (event.data.type === 'threads') {
      threads.value = JSON.parse(event.data.content);
    }
  });
});
</script>

<template>
  <main
    :data-theme="theme()"
    class="comment__tracker__main"
  >
    <section v-if="threads?.length">
      Comment history for the selection:
      <ul class="comment__tracker__list">
        <li v-for="(thread, idx) in threads"
          :key="idx"
          class="comment__tracker__element">
          <button @click="openedThread = (openedThread === idx) ? null : idx">
            📌 {{ thread[0] }}
          </button>
          <div v-if="openedThread === idx">
            <div v-for="comment in thread.slice(1)"
              class="comment__tracker__text__element">
              {{ comment }}
            </div>
          </div>
        </li>
      </ul>
    </section>
    <section v-else>
      Please select some shapes with a comment history.
    </section>
  </main>
</template>

<style scoped>
.comment__tracker__main {
  padding: 8px 0px;
}

.comment__tracker__list {
  padding: 4px 0px;
}

.comment__tracker__element {
  padding: 4px 0px;
}

.comment__tracker__text__element {
  padding-left: 16px;
}
</style>
