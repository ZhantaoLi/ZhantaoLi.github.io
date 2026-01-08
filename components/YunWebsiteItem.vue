<script setup lang="ts">
import { useMotion } from '@vueuse/motion'
import { ref } from 'vue'

export interface WebsiteType {
  name: string
  url: string
  avatar: string
  type: string
  reason?: string
}

const props = defineProps<{
  i: number
  Website: WebsiteType
}>()

const itemRef = ref()
useMotion(itemRef, {
  initial: {
    opacity: 0,
    translateY: 40,
  },
  enter: {
    opacity: 1,
    translateY: 0,
    transition: {
      type: 'spring',
      duration: 400,
      damping: 8,
      delay: props.i * 50,
    },
  },
})
</script>

<template>
  <li ref="itemRef" class="Website-item">
    <a
      class="Website-item-link"
      :href="Website.url"
      :title="Website.reason" alt="portrait" target="_blank" rel="noopener"
    >
      <figure class="Website-info">
        <img class="Website-avatar" loading="lazy" :src="Website.avatar" :alt="Website.name">
        <figcaption class="Website-name" :title="(i + 1).toString()">{{ Website.name }}</figcaption>
        <figcaption class="Website-reason">{{ Website.reason }}</figcaption>
      </figure>
    </a>
  </li>
</template>

<style lang="scss">
.Website-item {
  display: inline-flex;
  text-align: center;
  justify-content: center;
  width: 8rem;
  margin: 1rem;

  .Website {
    &-info {
      width: 100%;
      padding: 0;
      margin: 0;
    }

    &-avatar {
      object-fit: cover;
      object-position: center top;
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      padding: 0.2rem;
      background-color: #fff;
      box-shadow: 0 0 1rem rgb(0 0 0 / 0.12);
      transition: 0.5s;

      &:hover {
        box-shadow: 0 0 2rem rgb(0 0 0 / 0.12);
      }
    }

    &-name {
      font-size: 0.9rem;
    }

    &-reason {
      font-size: 12px;
      font-family: var(--va-font-serif);
      font-weight: bold;
      color: var(--va-c-text-light);
    }
  }
}
</style>