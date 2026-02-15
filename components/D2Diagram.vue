<script lang="ts">
// Module-level: shared across all D2Diagram instances
import lz from 'lz-string'

let d2Promise: Promise<any> | null = null

function getD2() {
  if (!d2Promise) {
    d2Promise = import('@terrastruct/d2').then(({ D2 }) => new D2()).catch((e) => {
      d2Promise = null // allow retry on failure
      throw e
    })
  }
  return d2Promise
}

const cache = new Map<string, string>()

// D2 WASM crashes when compile/render run concurrently.
// Serialize all operations through a queue.
let queue: Promise<void> = Promise.resolve()

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const p = queue.then(fn, fn)
  queue = p.then(() => {}, () => {})
  return p
}
</script>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useDark } from '@vueuse/core'

const props = defineProps<{
  codeLz: string
  theme?: number
  darkTheme?: number
  sketch?: boolean
  layout?: 'dagre' | 'elk'
  pad?: number
  scale?: number
}>()

const isDark = useDark()
const html = ref('')
const error = ref<string | null>(null)
const loading = ref(true)

watchEffect(async (onCleanup) => {
  let disposed = false
  onCleanup(() => { disposed = true })

  error.value = null

  const code = lz.decompressFromBase64(props.codeLz || '')
  if (!code) {
    html.value = ''
    loading.value = false
    return
  }

  const themeID = isDark.value
    ? (props.darkTheme ?? props.theme ?? 200)
    : (props.theme ?? 0)

  const key = JSON.stringify([props.codeLz, themeID, props.sketch, props.layout, props.pad])
  const cached = cache.get(key)
  if (cached) {
    if (!disposed) {
      html.value = cached
      loading.value = false
    }
    return
  }

  loading.value = true

  try {
    const svg = await enqueue(async () => {
      const d2 = await getD2()

      const result = await d2.compile(code, {
        sketch: props.sketch ?? false,
        themeID,
        layout: props.layout,
        pad: props.pad,
      })

      return await d2.render(result.diagram, {
        ...result.renderOptions,
        noXMLTag: true,
      })
    })

    if (!disposed) {
      html.value = svg
      cache.set(key, svg)
    }
  }
  catch (e: any) {
    if (!disposed) {
      try {
        const errors = JSON.parse(e.message)
        error.value = errors.map((err: any) => err.errmsg).join('\n')
      }
      catch {
        error.value = e.message || String(e)
      }
    }
  }
  finally {
    if (!disposed) {
      loading.value = false
    }
  }
})
</script>

<template>
  <div class="slidev-d2-diagram">
    <div v-if="loading" class="slidev-d2-loading">
      <div class="slidev-d2-spinner" />
    </div>
    <pre v-else-if="error" class="slidev-d2-error">{{ error }}</pre>
    <div
      v-else
      class="slidev-d2-svg"
      v-html="html"
      :style="scale ? { transform: `scale(${scale})`, transformOrigin: 'top center' } : undefined"
    />
  </div>
</template>

<style>
.slidev-d2-diagram {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.slidev-d2-svg {
  display: flex;
  justify-content: center;
  width: 100%;
}

.slidev-d2-svg svg {
  max-width: 100%;
  height: auto;
}

.slidev-d2-loading {
  color: #94a3b8;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slidev-d2-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: slidev-d2-spin 0.8s linear infinite;
}

@keyframes slidev-d2-spin {
  to { transform: rotate(360deg); }
}

.slidev-d2-error {
  color: #e53e3e;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 6px;
  padding: 1rem 1.5rem;
  font-size: 0.85em;
  white-space: pre-wrap;
  text-align: left;
  max-width: 100%;
  overflow: auto;
  margin: 1rem;
}

html.dark .slidev-d2-error {
  color: #fc8181;
  background: rgba(254, 178, 178, 0.05);
  border-color: rgba(254, 178, 178, 0.2);
}
</style>
