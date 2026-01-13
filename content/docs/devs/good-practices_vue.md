---
title: "Buenas Practicas [VueJS]"
weight: 200
---

Guía de mejores prácticas para desarrollar aplicaciones de escritorio performantes con Vue.js 3 y Tauri.

## Arquitectura de Componentes

### Componentes Pequeños y Enfocados

**Mal ejemplo:**

```vue
<!-- ❌ Componente monolítico -->
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
// 300+ líneas de lógica mezclada
const volume = ref(50)
const devices = ref([])
// ... muchísima más lógica
</script>
```

**Buen ejemplo:**

```vue
<!-- ✅ Componente principal pequeño -->
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

### Props Tipadas y Documentadas

**Mal ejemplo:**

```vue
<script setup>
// ❌ Props sin tipos ni documentación
const props = defineProps(['title', 'data', 'callback'])
</script>
```

**Buen ejemplo:**

```vue
<script setup lang="ts">
interface Device {
  id: string
  name: string
  volume: number
}

interface Props {
  /** Título del componente de audio */
  title: string
  /** Lista de dispositivos de audio disponibles */
  devices: Device[]
  /** Volumen actual (0-100) */
  currentVolume: number
  /** Si el audio está silenciado */
  muted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  muted: false
})
</script>
```

### Eventos Bien Definidos

**Mal ejemplo:**

```vue
<script setup>
// ❌ Eventos sin tipo
const emit = defineEmits(['update', 'change', 'click'])

function handleClick() {
  emit('update', someData) // ¿Qué formato tiene someData?
}
</script>
```

**Buen ejemplo:**

```vue
<script setup lang="ts">
interface Emits {
  /** Se emite cuando el volumen cambia */
  (e: 'volume-changed', volume: number): void
  /** Se emite cuando se cambia de dispositivo */
  (e: 'device-selected', deviceId: string): void
  /** Se emite cuando se alterna mute */
  (e: 'mute-toggled', muted: boolean): void
}

const emit = defineEmits<Emits>()

function handleVolumeChange(newVolume: number) {
  emit('volume-changed', newVolume)
}
</script>
```

## Performance y Optimización

### Lazy Loading de Componentes

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// ✅ Cargar componentes pesados solo cuando se necesitan
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

### Virtual Scrolling para Listas Grandes

```vue
<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

const allApps = ref<App[]>([]) // 1000+ aplicaciones

// ✅ Renderizar solo los items visibles
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

### Debounce en Búsquedas

```vue
<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { invoke } from '@tauri-apps/api/tauri'

const searchQuery = ref('')
const results = ref<SearchResult[]>([])

// ✅ Debounce para evitar llamadas excesivas al backend
const debouncedSearch = useDebounceFn(async (query: string) => {
  if (!query.trim()) {
    results.value = []
    return
  }
  
  try {
    results.value = await invoke<SearchResult[]>('global_search', { 
      query 
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

### Memoización de Computadas Costosas

```vue
<script setup lang="ts">
import { computed } from 'vue'

const apps = ref<App[]>([])
const searchQuery = ref('')
const selectedCategory = ref('all')

// ✅ Computada memoizada - solo se recalcula cuando cambian las dependencias
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

// ❌ Evitar recalcular en cada render
// const getFilteredApps = () => apps.value.filter(...)
</script>
```

### v-show vs v-if

```vue
<template>
  <!-- ✅ v-show para componentes que se alternan frecuentemente -->
  <AudioApplet v-show="showAudioApplet" />
  
  <!-- ✅ v-if para componentes que raramente se muestran -->
  <SettingsDialog v-if="showSettings" />
</template>
```

## Gestión de Estado

### Usar Pinia para Estado Global

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

  // ✅ Acciones claramente definidas
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

  // ✅ Escuchar eventos del backend
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

### Composables para Lógica Reutilizable

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

// Uso en componente
const { loading, error, data, execute } = useBackendCommand<SystemInfo>(
  'get_system_info'
)

onMounted(() => {
  execute()
})
```

## Comunicación con Backend

### Manejo Robusto de Comandos Tauri

```vue
<script setup lang="ts">
import { invoke } from '@tauri-apps/api/tauri'

const brightness = ref(50)
const isUpdating = ref(false)
const updateError = ref<string | null>(null)

// ✅ Manejo completo de async con loading y errores
async function updateBrightness(newValue: number) {
  isUpdating.value = true
  updateError.value = null

  try {
    await invoke('set_brightness_info', { brightness: newValue })
    brightness.value = newValue
  } catch (error) {
    updateError.value = 'Failed to update brightness'
    console.error('Brightness update failed:', error)
    
    // Revertir al valor anterior
    // brightness permanece sin cambios
  } finally {
    isUpdating.value = false
  }
}

// ❌ Evitar esto
// async function badUpdate(value: number) {
//   await invoke('set_brightness_info', { brightness: value })
//   brightness.value = value // ¿Y si falla?
// }
</script>
```

### Listeners de Eventos con Cleanup

```vue
<script setup lang="ts">
import { listen, UnlistenFn } from '@tauri-apps/api/event'

const notifications = ref<Notification[]>([])
let unlistenNotification: UnlistenFn | null = null

onMounted(async () => {
  // ✅ Guardar función de cleanup
  unlistenNotification = await listen<Notification>(
    'notification_received',
    (event) => {
      notifications.value.push(event.payload)
    }
  )
})

onUnmounted(() => {
  // ✅ Siempre limpiar listeners
  if (unlistenNotification) {
    unlistenNotification()
  }
})
</script>
```

### Timeout para Operaciones Largas

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

// Uso
try {
  const devices = await fetchWithTimeout<Device[]>(
    'scan_bluetooth_devices',
    {},
    10000 // 10 segundos
  )
} catch (error) {
  console.error('Scan timeout or failed:', error)
}
```

## Manejo de Errores

### Error Boundaries y Feedback

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
  
  // Auto-ocultar después de 5 segundos
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

## Memory Management

### Cleanup Completo

```vue
<script setup lang="ts">
import { onUnmounted } from 'vue'

const intervalId = ref<number | null>(null)
const observers = ref<ResizeObserver[]>([])
const unlisteners = ref<UnlistenFn[]>([])

onMounted(() => {
  // Interval para actualizar datos
  intervalId.value = setInterval(updateSystemInfo, 2000)
  
  // Observer para resize
  const observer = new ResizeObserver(handleResize)
  observer.observe(element.value!)
  observers.value.push(observer)
  
  // Event listeners
  setupEventListeners()
})

onUnmounted(() => {
  // ✅ Limpiar interval
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  
  // ✅ Limpiar observers
  observers.value.forEach(obs => obs.disconnect())
  observers.value = []
  
  // ✅ Limpiar event listeners
  unlisteners.value.forEach(unlisten => unlisten())
  unlisteners.value = []
})
</script>
```

### Prevenir Memory Leaks en Watchers

```vue
<script setup lang="ts">
import { watch, WatchStopHandle } from 'vue'

const stopWatchers: WatchStopHandle[] = []

onMounted(() => {
  // ✅ Guardar la función stop
  const stopVolumeWatch = watch(volume, async (newVal) => {
    await invoke('set_audio_volume', { volume: newVal })
  })
  
  stopWatchers.push(stopVolumeWatch)
})

onUnmounted(() => {
  // ✅ Detener todos los watchers
  stopWatchers.forEach(stop => stop())
})
</script>
```

## Accesibilidad

### ARIA Labels y Keyboard Navigation

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

### Focus Management

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

// ✅ Trap focus dentro del diálogo
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeDialog()
  }
}
</script>
```

## Testing

### Test Unitarios con Vitest

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

## Mejores Prácticas - Resumen

{{< mermaid >}}
graph LR
    Practicas["✅ Mejores Prácticas"]
    Evitar["❌ Evitar"]
    
    Practicas --> P1["✓ Componentes pequeños y enfocados"]
    Practicas --> P2["✓ Props tipadas y documentadas"]
    Practicas --> P3["✓ Manejo explícito de errores"]
    Practicas --> P4["✓ Cleanup en onUnmounted"]
    Practicas --> P5["✓ Composables para lógica compartida"]
    Practicas --> P6["✓ Eventos bien definidos"]
    Practicas --> P7["✓ Lazy loading de componentes"]
    Practicas --> P8["✓ Virtual scrolling para listas"]
    Practicas --> P9["✓ Debounce en búsquedas"]
    Practicas --> P10["✓ Timeout en operaciones largas"]
    
    Evitar --> E1["✗ Componentes monolíticos"]
    Evitar --> E2["✗ Props sin tipos"]
    Evitar --> E3["✗ Ignorar errores async"]
    Evitar --> E4["✗ Memory leaks por listeners"]
    Evitar --> E5["✗ Código hardcoded"]
    Evitar --> E6["✗ Efectos secundarios en render"]
    Evitar --> E7["✗ Renderizar 1000+ items sin virtual scroll"]
    Evitar --> E8["✗ Llamadas sin debounce"]
    Evitar --> E9["✗ Operaciones sin timeout"]
    Evitar --> E10["✗ Olvidar cleanup de watchers"]
    
    style Practicas fill:#43e97b,stroke:#38f9d7,color:#fff
    style Evitar fill:#f093fb,stroke:#f5576c,color:#fff
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

## Checklist de Componente

* [ ] Crear Componente Vue 🚀
* [ ] Nombre claro y descriptivo 📝
* [ ] Props documentadas con tipos 📋
* [ ] Eventos bien definidos 📡
* [ ] Manejo de errores robusto ⚠️
* [ ] Cleanup en onUnmounted 🧹
* [ ] Estilos scoped 🎨
* [ ] Tests unitarios 🧪
* [ ] Accesibilidad (ARIA) ♿
* [ ] Optimizado (lazy load, virtual scroll) ⚡
* [ ] Listo para producción ✅


## Performance Checklist Específico para Desktop

- [ ] **Virtual scrolling** implementado en listas grandes (>100 items)
- [ ] **Debounce** en búsquedas y inputs de alta frecuencia
- [ ] **Lazy loading** para componentes pesados (Settings, File Manager)
- [ ] **Memoización** de computadas costosas
- [ ] **Timeout** en todas las llamadas al backend (5-10s)
- [ ] **Loading states** visibles para operaciones async
- [ ] **Error recovery** con reintentos automáticos
- [ ] **Cleanup** de todos los listeners y watchers
- [ ] **v-show** para componentes que se alternan frecuentemente
- [ ] **v-if** para componentes que raramente se muestran

## Recursos Adicionales

- [Vue 3 Composition API](https://vuejs.org/api/composition-api-setup.html)
- [Pinia State Management](https://pinia.vuejs.org/)
- [VueUse - Composables Collection](https://vueuse.org/)
- [Tauri API Documentation](https://tauri.app/v1/api/js/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)