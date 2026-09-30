---
title: "Best practices [VueJS]"
weight: 200
aliases: ["/docs/devs/good-practices_vue/"]
description: "Best practices for writing performant desktop applications with Vue 3 and Tauri."
---

A best practices guide for developing performant desktop applications with Vue.js 3 and
Tauri.

## Component architecture

### Small, focused components

**Bad example:**

```vue
<!-- ❌ Monolithic component -->
<template>
  <div class="control-center">
    <!-- Audio controls -->
    <div class="audio">
      <input v-model="volume" type="range" />
      <button @click="toggleMute">Mute</button>
      <select v-model="selectedDevice">
        <option v-for="device in devices">{{ device }}</option>
      </select>
    </div>
    <!-- Bluetooth controls -->
    <div class="bluetooth">...</div>
    <!-- Network controls -->
    <div class="network">...</div>
    <!-- Battery info -->
    <div class="battery">...</div>
  </div>
</template>

<script setup>
// 300+ lines of mixed logic
const volume = ref(50)
const devices = ref([])
// ... a lot more logic
</script>
```

**Good example:**

```vue
<!-- ✅ Small main component -->
<template>
  <div class="control-center">
    <AudioControl />
    <BluetoothControl />
    <NetworkControl />
    <BatteryInfo />
  </div>
</template>

<script setup lang="ts">
import AudioControl from './components/AudioControl.vue'
import BluetoothControl from './components/BluetoothControl.vue'
import NetworkControl from './components/NetworkControl.vue'
import BatteryInfo from './components/BatteryInfo.vue'
</script>
```

### Typed, documented props

**Bad example:**

```vue
<script setup>
// ❌ Props with no types or documentation
const props = defineProps(['title', 'data', 'callback'])
</script>
```

**Good example:**

```vue
<script setup lang="ts">
interface Device {
  id: string
  name: string
  volume: number
}

interface Props {
  /** Title of the audio component */
  title: string
  /** List of available audio devices */
  devices: Device[]
  /** Current volume (0-100) */
  currentVolume: number
  /** Whether the audio is muted */
  muted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  muted: false
})
</script>
```

### Well-defined events

**Bad example:**

```vue
<script setup>
// ❌ Events with no types
const emit = defineEmits(['update', 'change', 'click'])

function handleClick() {
  emit('update', someData) // What shape is someData?
}
</script>
```

**Good example:**

```vue
<script setup lang="ts">
interface Emits {
  /** Emitted when the volume changes */
  (e: 'volume-changed', volume: number): void
  /** Emitted when the device is changed */
  (e: 'device-selected', deviceId: string): void
  /** Emitted when mute is toggled */
  (e: 'mute-toggled', muted: boolean): void
}

const emit = defineEmits<Emits>()

function handleVolumeChange(newVolume: number) {
  emit('volume-changed', newVolume)
}
</script>
```

## Performance and optimisation

### Lazy loading of components

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// ✅ Load heavy components only when they are needed
const SettingsDialog = defineAsyncComponent(
  () => import('./components/SettingsDialog.vue')
)

const FileManager = defineAsyncComponent(
  () => import('./components/FileManager.vue')
)
</script>

<template>
  <SettingsDialog v-if="showSettings" />
  <FileManager v-if="showFileManager" />
</template>
```

### Virtual scrolling for large lists

```vue
<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

const allApps = ref<App[]>([]) // 1000+ applications

// ✅ Render only the visible items
const { list, containerProps, wrapperProps } = useVirtualList(
  allApps,
  {
    itemHeight: 50,
    overscan: 5
  }
)
</script>

<template>
  <div v-bind="containerProps" class="app-list">
    <div v-bind="wrapperProps">
      <AppItem
        v-for="{ data, index } in list"
        :key="data.id"
        :app="data"
      />
    </div>
  </div>
</template>
```

### Debounce on searches

```vue
<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { invoke } from '@tauri-apps/api/tauri'

const searchQuery = ref('')
const results = ref<SearchResult[]>([])

// ✅ Debounce to avoid excessive calls to the backend
const debouncedSearch = useDebounceFn(async (query: string) => {
  if (!query.trim()) {
    results.value = []
    return
  }

  try {
    // The launcher's search command, in vasak-prism
    results.value = await invoke<SearchResult[]>('buscar', {
      consulta: query
    })
  } catch (error) {
    console.error('Search failed:', error)
  }
}, 300)

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})
</script>
```

### Memoising expensive computeds

```vue
<script setup lang="ts">
import { computed } from 'vue'

const apps = ref<App[]>([])
const searchQuery = ref('')
const selectedCategory = ref('all')

// ✅ Memoised computed - only recalculated when the dependencies change
const filteredApps = computed(() => {
  return apps.value.filter(app => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())

    const matchesCategory = selectedCategory.value === 'all' ||
                           app.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

// ❌ Avoid recalculating on every render
// const getFilteredApps = () => apps.value.filter(...)
</script>
```

### v-show vs v-if

```vue
<template>
  <!-- ✅ v-show for components that toggle frequently -->
  <AudioApplet v-show="showAudioApplet" />

  <!-- ✅ v-if for components that are rarely shown -->
  <SettingsDialog v-if="showSettings" />
</template>
```

## State management

### Use Pinia for global state

```typescript
// stores/audio.ts
import { defineStore } from 'pinia'
import { invoke } from '@tauri-apps/api/tauri'
import { listen } from '@tauri-apps/api/event'

export const useAudioStore = defineStore('audio', () => {
  const volume = ref(50)
  const muted = ref(false)
  const devices = ref<AudioDevice[]>([])
  const selectedDevice = ref<string | null>(null)

  // ✅ Clearly defined actions
  async function setVolume(newVolume: number) {
    try {
      await invoke('set_audio_volume', { volume: newVolume })
      volume.value = newVolume
    } catch (error) {
      console.error('Failed to set volume:', error)
      throw error
    }
  }

  async function toggleMute() {
    try {
      await invoke('toggle_audio_mute')
      muted.value = !muted.value
    } catch (error) {
      console.error('Failed to toggle mute:', error)
      throw error
    }
  }

  // ✅ Listen to events from the backend
  function initializeListeners() {
    listen<number>('audio_volume_changed', (event) => {
      volume.value = event.payload
    })

    listen<boolean>('audio_mute_changed', (event) => {
      muted.value = event.payload
    })
  }

  return {
    volume,
    muted,
    devices,
    selectedDevice,
    setVolume,
    toggleMute,
    initializeListeners
  }
})
```

### Composables for reusable logic

```typescript
// composables/useBackendCommand.ts
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'

export function useBackendCommand<T, P = void>(
  command: string
) {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const data = ref<T | null>(null)

  async function execute(params?: P): Promise<T | null> {
    loading.value = true
    error.value = null

    try {
      const result = await invoke<T>(command, params)
      data.value = result
      return result
    } catch (err) {
      error.value = err as string
      console.error(`Command ${command} failed:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    data: readonly(data),
    execute
  }
}

// Usage in a component
const { loading, error, data, execute } = useBackendCommand<SystemInfo>(
  'get_system_info'
)

onMounted(() => {
  execute()
})
```

## Communicating with the backend

### Robust handling of Tauri commands

```vue
<script setup lang="ts">
import { invoke } from '@tauri-apps/api/tauri'

const brightness = ref(50)
const isUpdating = ref(false)
const updateError = ref<string | null>(null)

// ✅ Complete async handling with loading and errors
async function updateBrightness(newValue: number) {
  isUpdating.value = true
  updateError.value = null

  try {
    await invoke('set_brightness_info', { brightness: newValue })
    brightness.value = newValue
  } catch (error) {
    updateError.value = 'Failed to update brightness'
    console.error('Brightness update failed:', error)

    // Revert to the previous value
    // brightness is left unchanged
  } finally {
    isUpdating.value = false
  }
}

// ❌ Avoid this
// async function badUpdate(value: number) {
//   await invoke('set_brightness_info', { brightness: value })
//   brightness.value = value // What if it fails?
// }
</script>
```

### Event listeners with cleanup

```vue
<script setup lang="ts">
import { listen, UnlistenFn } from '@tauri-apps/api/event'

const notifications = ref<Notification[]>([])
let unlistenNotification: UnlistenFn | null = null

onMounted(async () => {
  // ✅ Keep the cleanup function
  unlistenNotification = await listen<Notification>(
    'notification_received',
    (event) => {
      notifications.value.push(event.payload)
    }
  )
})

onUnmounted(() => {
  // ✅ Always clean up listeners
  if (unlistenNotification) {
    unlistenNotification()
  }
})
</script>
```

### Timeout for long operations

```typescript
async function fetchWithTimeout<T>(
  command: string,
  params: any,
  timeoutMs = 5000
): Promise<T> {
  return Promise.race([
    invoke<T>(command, params),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
    )
  ])
}

// Usage
try {
  const devices = await fetchWithTimeout<Device[]>(
    'scan_bluetooth_devices',
    {},
    10000 // 10 seconds
  )
} catch (error) {
  console.error('Scan timeout or failed:', error)
}
```

## Error handling

### Error boundaries and feedback

```vue
<script setup lang="ts">
import { ref } from 'vue'

const errorMessage = ref<string | null>(null)
const showError = ref(false)

function handleError(error: unknown, context: string) {
  const message = error instanceof Error
    ? error.message
    : String(error)

  console.error(`Error in ${context}:`, error)

  errorMessage.value = message
  showError.value = true

  // Auto-hide after 5 seconds
  setTimeout(() => {
    showError.value = false
  }, 5000)
}

async function loadData() {
  try {
    await invoke('load_data')
  } catch (error) {
    handleError(error, 'loadData')
  }
}
</script>

<template>
  <div class="error-toast" v-if="showError">
    {{ errorMessage }}
  </div>
</template>
```

## Memory management

### Complete cleanup

```vue
<script setup lang="ts">
import { onUnmounted } from 'vue'

const intervalId = ref<number | null>(null)
const observers = ref<ResizeObserver[]>([])
const unlisteners = ref<UnlistenFn[]>([])

onMounted(() => {
  // Interval to update the data
  intervalId.value = setInterval(updateSystemInfo, 2000)

  // Observer for resize
  const observer = new ResizeObserver(handleResize)
  observer.observe(element.value!)
  observers.value.push(observer)

  // Event listeners
  setupEventListeners()
})

onUnmounted(() => {
  // ✅ Clear the interval
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }

  // ✅ Disconnect the observers
  observers.value.forEach(obs => obs.disconnect())
  observers.value = []

  // ✅ Clean up the event listeners
  unlisteners.value.forEach(unlisten => unlisten())
  unlisteners.value = []
})
</script>
```

### Preventing memory leaks in watchers

```vue
<script setup lang="ts">
import { watch, WatchStopHandle } from 'vue'

const stopWatchers: WatchStopHandle[] = []

onMounted(() => {
  // ✅ Keep the stop function
  const stopVolumeWatch = watch(volume, async (newVal) => {
    await invoke('set_audio_volume', { volume: newVal })
  })

  stopWatchers.push(stopVolumeWatch)
})

onUnmounted(() => {
  // ✅ Stop all the watchers
  stopWatchers.forEach(stop => stop())
})
</script>
```

## Accessibility

### ARIA labels and keyboard navigation

```vue
<template>
  <div class="volume-control">
    <label for="volume-slider" class="sr-only">
      Volume Control
    </label>

    <input
      id="volume-slider"
      type="range"
      min="0"
      max="100"
      :value="volume"
      @input="handleVolumeChange"
      aria-label="Volume level"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="volume"
      :aria-valuetext="`${volume}%`"
    />

    <button
      @click="toggleMute"
      :aria-label="muted ? 'Unmute' : 'Mute'"
      :aria-pressed="muted"
    >
      <Icon :name="muted ? 'volume-mute' : 'volume'" />
    </button>
  </div>
</template>

<style scoped>
/* ✅ Screen reader only text */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
```

### Focus management

```vue
<script setup lang="ts">
import { ref, nextTick } from 'vue'

const showDialog = ref(false)
const firstFocusableElement = ref<HTMLElement | null>(null)
const previousActiveElement = ref<HTMLElement | null>(null)

async function openDialog() {
  previousActiveElement.value = document.activeElement as HTMLElement
  showDialog.value = true

  await nextTick()
  firstFocusableElement.value?.focus()
}

function closeDialog() {
  showDialog.value = false
  previousActiveElement.value?.focus()
}

// ✅ Trap focus inside the dialog
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeDialog()
  }
}
</script>
```

## Testing

### Unit tests with Vitest

```typescript
// AudioControl.test.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import AudioControl from './AudioControl.vue'

// Mock Tauri
vi.mock('@tauri-apps/api/tauri', () => ({
  invoke: vi.fn()
}))

describe('AudioControl', () => {
  it('renders volume slider', () => {
    const wrapper = mount(AudioControl, {
      props: {
        currentVolume: 50
      }
    })

    expect(wrapper.find('input[type="range"]').exists()).toBe(true)
  })

  it('emits volume-changed event', async () => {
    const wrapper = mount(AudioControl)
    const slider = wrapper.find('input[type="range"]')

    await slider.setValue(75)

    expect(wrapper.emitted('volume-changed')).toBeTruthy()
    expect(wrapper.emitted('volume-changed')?.[0]).toEqual([75])
  })
})
```

## Best practices - summary

{{< mermaid >}}
graph LR
    Practices["✅ Best practices"]
    Avoid["❌ Avoid"]

    Practices --> P1["✓ Small, focused components"]
    Practices --> P2["✓ Typed, documented props"]
    Practices --> P3["✓ Explicit error handling"]
    Practices --> P4["✓ Cleanup in onUnmounted"]
    Practices --> P5["✓ Composables for shared logic"]
    Practices --> P6["✓ Well-defined events"]
    Practices --> P7["✓ Lazy loading of components"]
    Practices --> P8["✓ Virtual scrolling for lists"]
    Practices --> P9["✓ Debounce on searches"]
    Practices --> P10["✓ Timeout on long operations"]

    Avoid --> E1["✗ Monolithic components"]
    Avoid --> E2["✗ Untyped props"]
    Avoid --> E3["✗ Ignoring async errors"]
    Avoid --> E4["✗ Memory leaks from listeners"]
    Avoid --> E5["✗ Hardcoded code"]
    Avoid --> E6["✗ Side effects during render"]
    Avoid --> E7["✗ Rendering 1000+ items without virtual scroll"]
    Avoid --> E8["✗ Calls without debounce"]
    Avoid --> E9["✗ Operations without a timeout"]
    Avoid --> E10["✗ Forgetting to clean up watchers"]

    style Practices fill:#43e97b,stroke:#38f9d7,color:#fff
    style Avoid fill:#f093fb,stroke:#f5576c,color:#fff
    style P1 fill:#4facfe,stroke:#00f2fe,color:#fff
    style P2 fill:#4facfe,stroke:#00f2fe,color:#fff
    style P3 fill:#4facfe,stroke:#00f2fe,color:#fff
    style P4 fill:#4facfe,stroke:#00f2fe,color:#fff
    style P5 fill:#4facfe,stroke:#00f2fe,color:#fff
    style P6 fill:#4facfe,stroke:#00f2fe,color:#fff
    style P7 fill:#4facfe,stroke:#00f2fe,color:#fff
    style P8 fill:#4facfe,stroke:#00f2fe,color:#fff
    style P9 fill:#4facfe,stroke:#00f2fe,color:#fff
    style P10 fill:#4facfe,stroke:#00f2fe,color:#fff
    style E1 fill:#fa709a,stroke:#f5576c,color:#fff
    style E2 fill:#fa709a,stroke:#f5576c,color:#fff
    style E3 fill:#fa709a,stroke:#f5576c,color:#fff
    style E4 fill:#fa709a,stroke:#f5576c,color:#fff
    style E5 fill:#fa709a,stroke:#f5576c,color:#fff
    style E6 fill:#fa709a,stroke:#f5576c,color:#fff
    style E7 fill:#fa709a,stroke:#f5576c,color:#fff
    style E8 fill:#fa709a,stroke:#f5576c,color:#fff
    style E9 fill:#fa709a,stroke:#f5576c,color:#fff
    style E10 fill:#fa709a,stroke:#f5576c,color:#fff
{{< /mermaid >}}

## Component checklist

* [ ] Create the Vue component 🚀
* [ ] Clear, descriptive name 📝
* [ ] Props documented with types 📋
* [ ] Well-defined events 📡
* [ ] Robust error handling ⚠️
* [ ] Cleanup in onUnmounted 🧹
* [ ] Scoped styles 🎨
* [ ] Unit tests 🧪
* [ ] Accessibility (ARIA) ♿
* [ ] Optimised (lazy load, virtual scroll) ⚡
* [ ] Production ready ✅


## Performance checklist specific to desktop

- [ ] **Virtual scrolling** implemented on large lists (>100 items)
- [ ] **Debounce** on searches and high-frequency inputs
- [ ] **Lazy loading** for heavy components (Settings, File Manager)
- [ ] **Memoisation** of expensive computeds
- [ ] **Timeout** on every call to the backend (5-10s)
- [ ] **Loading states** visible for async operations
- [ ] **Error recovery** with automatic retries
- [ ] **Cleanup** of all listeners and watchers
- [ ] **v-show** for components that toggle frequently
- [ ] **v-if** for components that are rarely shown

## Further reading

- [Vue 3 Composition API](https://vuejs.org/api/composition-api-setup.html)
- [Pinia State Management](https://pinia.vuejs.org/)
- [VueUse - Composables Collection](https://vueuse.org/)
- [Tauri API Documentation](https://tauri.app/v1/api/js/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

## Remember

- [Code guidelines](/en/docs/devs/guidelines/)
