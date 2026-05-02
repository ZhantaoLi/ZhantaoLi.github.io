<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import YunWebsiteItem from './YunWebsiteItem.vue'
import type { WebsiteType } from './YunWebsiteItem.vue'

const props = defineProps<{
  Websites: WebsiteType[] | string
}>()

const websites = ref<WebsiteType[]>([])

async function loadWebsites(source: WebsiteType[] | string) {
  if (Array.isArray(source)) {
    websites.value = source
    return
  }

  // SSG/SSR 阶段不请求相对路径 JSON，避免触发 Invalid URL。
  if (import.meta.env.SSR) {
    websites.value = []
    return
  }

  try {
    const res = await fetch(source)

    if (!res.ok)
      throw new Error(`HTTP ${res.status}`)

    websites.value = await res.json()
  } catch (err) {
    websites.value = []
    console.error('Failed to load websites JSON:', err)
  }
}

watch(() => props.Websites, (value) => {
  if (import.meta.env.SSR)
    return

  void loadWebsites(value)
})

onMounted(() => {
  void loadWebsites(props.Websites)
})

const types = computed(() => Array.from(new Set(websites.value.map(w => w.type))))

const typeCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const w of websites.value)
    counts[w.type] = (counts[w.type] || 0) + 1
  return counts
})

const selectedType = ref<string | null>(null)

const filteredWebsites = computed(() => {
  if (!selectedType.value)
    return websites.value

  return websites.value.filter(w => w.type === selectedType.value)
})

function selectType(type: string | null) {
  selectedType.value = type
}
</script>

<template>
  <div class="Websites">
    <div class="Website-filter">
      <button
        :class="{ active: !selectedType }"
        @click="selectType(null)"
      >
        All ({{ websites.length }})
      </button>
      <button
        v-for="type in types"
        :key="type"
        :class="{ active: selectedType === type }"
        @click="selectType(type)"
      >
        {{ type }} ({{ typeCounts[type] }})
      </button>
    </div>

    <ul class="Website-items">
      <YunWebsiteItem
        v-for="(Website, i) in filteredWebsites"
        :key="i"
        :i="i"
        :Website="Website"
      />
    </ul>
  </div>
</template>

<style lang="scss">
.Websites {
  text-align: center;

  button {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid rgba(0, 0, 0, 0.15);

    &:not(:last-child) {
      border-right: none;
    }

    &.active {
      background-color: #dcdcdc;
    }

    &:not(.active):hover {
      background-color: rgba(233, 233, 233, 0.3);
    }

    &:first-child {
      border-top-left-radius: 1rem;
      border-bottom-left-radius: 1rem;
    }

    &:last-child {
      border-top-right-radius: 1rem;
      border-bottom-right-radius: 1rem;
    }
  }

  .dark & {
    button {
      background-color: #eeeeee00;
      border: none;

      &.active {
        background-color: #00000050;
      }

      &:not(.active):hover {
        background-color: #00000030;
      }
    }
  }

  .Website-items {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-left: 0;
  }
}
</style>
