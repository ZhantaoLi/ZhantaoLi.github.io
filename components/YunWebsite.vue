<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue'
import YunWebsiteItem from './YunWebsiteItem.vue'
import type { WebsiteType } from './YunWebsiteItem.vue'

const props = defineProps<{
  Websites: WebsiteType[] | string
}>()

const websites = ref<WebsiteType[]>([])

watchEffect(async () => {
  if (typeof props.Websites === 'string') {
    try {
      const res = await fetch(props.Websites)
      websites.value = await res.json()
    } catch (err) {
      console.error('❌ Failed to load JSON:', err)
    }
  } else {
    websites.value = props.Websites
  }
})

// 🧩 获取所有独特的 type 列表
const types = computed(() => Array.from(new Set(websites.value.map(w => w.type))))

// 🧩 当前选中的 type（默认显示全部）
const selectedType = ref<string | null>(null)

// 🧩 根据选择过滤数据
const filteredWebsites = computed(() => {
  if (!selectedType.value) return websites.value
  return websites.value.filter(w => w.type === selectedType.value)
})

// 🧩 切换分类按钮
function selectType(type: string | null) {
  selectedType.value = type
}
</script>

<template>
  <div class="Websites">
    <!-- 🧭 顶部筛选按钮栏 -->
    <div class="Website-filter">
      <button
        :class="{ active: !selectedType }"
        @click="selectType(null)"
      >
        All
      </button>
      <button
        v-for="type in types"
        :key="type"
        :class="{ active: selectedType === type }"
        @click="selectType(type)"
      >
        {{ type }}
      </button>
    </div>

    <!-- 🧱 网站项目 -->
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

  // 暗色模式覆盖
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