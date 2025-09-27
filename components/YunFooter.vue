<script lang="ts" setup>
import { useScriptTag } from '@vueuse/core'
import YunFooter from 'valaxy-theme-yun/components/YunFooter.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

</script>

<template>
  <NoticeBar />
  <YunFooter style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
    <div style="display: flex;">
      <a class="github-badge" target="_blank" href="https://github.com/ZhantaoLi/ZhantaoLi.github.io"
        style="margin-inline:5px" title="Github"><img
          src="https://sourcebucket.s3.bitiful.net/badge/Source-Github-d021d6.svg"
          data-lazy-src="https://sourcebucket.s3.bitiful.net/badge/Source-Github-d021d6.svg" alt=""
          data-ll-status="loaded" class="entered loaded"></a>
    </div>
    <VCLiveTime mt="2" start-time="2025-9-17">
      <template #live-time-before>
        <span>{{ t('intro.siteRunning') }}</span>
      </template>
    </VCLiveTime>
  </YunFooter>
</template>