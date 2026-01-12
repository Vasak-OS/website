---
title: "Componentes de VueJS | vasak-desktop"
weight: 25
---

Guía para desarrollar componentes Vue en Vasak Desktop.

## Estructura Base de un Componente

```vue
<template>
  <div class="audio-control">
    <h2>{{ title }}</h2>
    <input
      v-model="volume"
      type="range"
      min="0"
      max="100"
      @change="handleVolumeChange"
    />
    <span>{{ volume }}%</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

import type { Device } from '@/interfaces/device';

// Props
interface Props {
  title?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Audio Control',
  disabled: false,
});

// State
const volume = ref(0);
const devices = ref<Device[]>([]);
const isLoading = ref(false);

// Computed
const isActive = computed(() => !props.disabled && !isLoading.value);

// Métodos
async function loadVolume() {
  try {
    isLoading.value = true;
    volume.value = await invoke<number>('get_volume');
  } catch (error) {
    console.error('Error loading volume:', error);
  } finally {
    isLoading.value = false;
  }
}

async function handleVolumeChange() {
  try {
    await invoke('set_volume', { level: volume.value });
  } catch (error) {
    console.error('Error setting volume:', error);
  }
}

// Lifecycle
onMounted(() => {
  loadVolume();
  
  // Escuchar cambios del sistema
  listen('volume_changed', (event) => {
    volume.value = event.payload as number;
  });
});

onUnmounted(() => {
  // Cleanup si es necesario
});
</script>

<style scoped>
.audio-control {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}

.audio-control h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.audio-control input {
  width: 100%;
  margin-bottom: 0.5rem;
}

.audio-control span {
  display: block;
  text-align: center;
  color: #666;
}
</style>
```

## Tipos de Componentes

### 1. Componentes Presentacionales (Dumb)

Solo reciben props y emiten eventos:

```vue
<template>
  <button
    :class="['btn', `btn-${variant}`]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot>Click me</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
});

defineEmits<{
  click: [];
}>();
</script>

<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}
</style>
```

### 2. Componentes Inteligentes (Smart)

Manejan lógica y estado:

```vue
<template>
  <div class="audio-manager">
    <AudioControl
      v-if="!isLoading"
      :volume="volume"
      :devices="devices"
      @volume-change="handleVolumeChange"
      @device-change="handleDeviceChange"
    />
    <LoadingSpinner v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AudioControl from './AudioControl.vue';
import LoadingSpinner from './LoadingSpinner.vue';

const volume = ref(0);
const devices = ref([]);
const isLoading = ref(true);

async function loadData() {
  // Cargar datos del backend
}

onMounted(() => {
  loadData();
});

function handleVolumeChange(newVolume: number) {
  // Actualizar backend
}
</script>
```

## Composables (Composiciones Reutilizables)

Para lógica compartida entre componentes:

```typescript
// src/composables/useAudio.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

export function useAudio() {
  const volume = ref(0);
  const isMuted = ref(false);
  const devices = ref([]);
  const isLoading = ref(false);
  
  let unlistenVolumeChanged: UnlistenFn | null = null;

  async function loadVolume() {
    try {
      isLoading.value = true;
      volume.value = await invoke<number>('get_volume');
      isMuted = await invoke<boolean>('get_mute_status');
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function setVolume(newVolume: number) {
    try {
      await invoke('set_volume', { level: newVolume });
      volume.value = newVolume;
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }

  async function toggleMute() {
    try {
      await invoke('toggle_mute');
      isMuted.value = !isMuted.value;
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  }

  onMounted(async () => {
    await loadVolume();
    unlistenVolumeChanged = await listen('volume_changed', (event) => {
      volume.value = event.payload as number;
    });
  });

  onUnmounted(() => {
    if (unlistenVolumeChanged) {
      unlistenVolumeChanged();
    }
  });

  return {
    volume,
    isMuted,
    devices,
    isLoading,
    loadVolume,
    setVolume,
    toggleMute,
  };
}
```

**Uso en componente**:

```typescript
import { useAudio } from '@/composables/useAudio';

export default {
  setup() {
    const { volume, setVolume, toggleMute } = useAudio();
    
    return { volume, setVolume, toggleMute };
  }
};
```

## Comunicación con Backend

### Invocar Comandos

```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Sin argumentos
const version = await invoke<string>('get_version');

// Con argumentos
const result = await invoke('set_volume', {
  level: 50
});

// Con manejo de errores
try {
  await invoke('set_volume', { level: 150 }); // Invalid
} catch (error) {
  console.error('Validation error:', error);
}
```

### Escuchar Eventos

```typescript
import { listen, UnlistenFn } from '@tauri-apps/api/event';

let unlisten: UnlistenFn;

onMounted(async () => {
  // Escuchar evento
  unlisten = await listen('audio_volume_changed', (event) => {
    console.log('Volume changed to:', event.payload);
  });
});

onUnmounted(() => {
  // Dejar de escuchar
  if (unlisten) unlisten();
});
```

## Manejo de Estado Global (Pinia)

Para estado compartido entre componentes:

```typescript
// src/stores/audioStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAudioStore = defineStore('audio', () => {
  const volume = ref(0);
  const isMuted = ref(false);
  const currentDevice = ref('default');

  function setVolume(newVolume: number) {
    volume.value = newVolume;
  }

  function toggleMute() {
    isMuted.value = !isMuted.value;
  }

  return {
    volume,
    isMuted,
    currentDevice,
    setVolume,
    toggleMute,
  };
});
```

**Uso en componente**:

```typescript
import { useAudioStore } from '@/stores/audioStore';

export default {
  setup() {
    const audioStore = useAudioStore();
    
    const handleVolumeChange = (newVolume: number) => {
      audioStore.setVolume(newVolume);
    };
    
    return { audioStore, handleVolumeChange };
  }
};
```

## Slots (Contenido Dinámico)

Para componentes flexibles:

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <div class="card-header">
      <slot name="header">Default Header</slot>
    </div>
    <div class="card-body">
      <slot>Default content</slot>
    </div>
    <div class="card-footer">
      <slot name="footer">Default Footer</slot>
    </div>
  </div>
</template>

<!-- Uso -->
<Card>
  <template #header>
    <h2>Mi Card</h2>
  </template>
  
  <p>Contenido principal</p>
  
  <template #footer>
    <button @click="close">Cerrar</button>
  </template>
</Card>
```

## Directivas Personalizadas

Para reutilizar lógica de DOM:

```typescript
// src/directives/vFocus.ts
import { DirectiveBinding } from 'vue';

export const vFocus = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // Enfocar el elemento cuando se monta
    el.focus();
  },
};
```

**Uso**:

```vue
<template>
  <input v-focus type="text" />
</template>

<script setup>
import { vFocus } from '@/directives/vFocus';
</script>
```

## Transiciones y Animaciones

```vue
<template>
  <Transition name="fade">
    <div v-if="isVisible" class="content">
      Contenido que aparece/desaparece
    </div>
  </Transition>

  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>

<script setup>
import { ref } from 'vue';

const isVisible = ref(true);
const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
]);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
```

## Testing de Componentes

```typescript
// AudioControl.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AudioControl from './AudioControl.vue';

describe('AudioControl', () => {
  it('renders correctly', () => {
    const wrapper = mount(AudioControl, {
      props: {
        title: 'Test Volume'
      }
    });
    
    expect(wrapper.text()).toContain('Test Volume');
  });

  it('emits volume change event', async () => {
    const wrapper = mount(AudioControl);
    
    await wrapper.find('input').setValue(75);
    
    expect(wrapper.emitted('volume-change')).toBeTruthy();
    expect(wrapper.emitted('volume-change')[0]).toEqual([75]);
  });

  it('disables controls when disabled prop is true', async () => {
    const wrapper = mount(AudioControl, {
      props: {
        disabled: true
      }
    });
    
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
  });
});
```

## Mejores Prácticas

### ✅ Haz:
- Componentes pequeños y enfocados
- Props documentadas con tipos
- Manejo explícito de errores
- Cleanup en onUnmounted
- Usar composables para lógica compartida
- Nombrar eventos claramente

### ❌ No hagas:
- Componentes "todo en uno"
- Props sin tipo
- Ignorar errores de async
- Memory leaks por listeners no removidos
- Código duro (hardcoded)
- Efectos secundarios en render

## Checklist de Componente

- [ ] Tiene nombre claro
- [ ] Props documentadas
- [ ] Eventos definidos
- [ ] Manejo de errores
- [ ] Cleanup en unmount
- [ ] Estilos scoped
- [ ] Tests unitarios
- [ ] Accesibilidad (ARIA)

## Siguientes Pasos

- [Comandos Rust](comandos-rust.md)
- [Lineamientos de Código](lineamientos.md)
- [Debugging](debugging.md)
