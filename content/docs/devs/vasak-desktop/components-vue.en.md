---
title: "VueJS components | vasak-desktop"
weight: 25
---

Guide for developing Vue components in Vasak Desktop.

## Base Structure of a Component

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

// Methods
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
  
  // Listen for system changes
  listen('volume_changed', (event) => {
    volume.value = event.payload as number;
  });
});

onUnmounted(() => {
  // Cleanup if needed
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

## Component Types

### Presentational Components (Dumb)

They only receive props and emit events:

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

### Smart Components

They handle logic and state:

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
  // Load data from the backend
}

onMounted(() => {
  loadData();
});

function handleVolumeChange(newVolume: number) {
  // Update the backend
}
</script>
```

## Composables (Reusable Compositions)

For logic shared between components:

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

**Usage in a component**:

```typescript
import { useAudio } from '@/composables/useAudio';

export default {
  setup() {
    const { volume, setVolume, toggleMute } = useAudio();
    
    return { volume, setVolume, toggleMute };
  }
};
```

## Talking to the Backend

### Invoking Commands

```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Without arguments
const version = await invoke<string>('get_version');

// With arguments
const result = await invoke('set_volume', {
  level: 50
});

// With error handling
try {
  await invoke('set_volume', { level: 150 }); // Invalid
} catch (error) {
  console.error('Validation error:', error);
}
```

### Listening to Events

```typescript
import { listen, UnlistenFn } from '@tauri-apps/api/event';

let unlisten: UnlistenFn;

onMounted(async () => {
  // Listen for the event
  unlisten = await listen('audio_volume_changed', (event) => {
    console.log('Volume changed to:', event.payload);
  });
});

onUnmounted(() => {
  // Stop listening
  if (unlisten) unlisten();
});
```

## Global State Handling (Pinia)

For state shared between components:

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

**Usage in a component**:

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

## Slots (Dynamic Content)

For flexible components:

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

<!-- Usage -->
<Card>
  <template #header>
    <h2>My Card</h2>
  </template>
  
  <p>Main content</p>
  
  <template #footer>
    <button @click="close">Close</button>
  </template>
</Card>
```

## Custom Directives

To reuse DOM logic:

```typescript
// src/directives/vFocus.ts
import { DirectiveBinding } from 'vue';

export const vFocus = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // Focus the element when it is mounted
    el.focus();
  },
};
```

**Usage**:

```vue
<template>
  <input v-focus type="text" />
</template>

<script setup>
import { vFocus } from '@/directives/vFocus';
</script>
```

## Transitions and Animations

```vue
<template>
  <Transition name="fade">
    <div v-if="isVisible" class="content">
      Content that appears/disappears
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

## Component Testing

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

## Best Practices

Remember to check the [VueJS best practices](/en/docs/devs/good-practices_vue/) documentation to keep good practices in place.
