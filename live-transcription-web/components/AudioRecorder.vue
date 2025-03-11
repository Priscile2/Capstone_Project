<template>
  <div class="space-y-4">
    <div class="flex items-center space-x-2">
      <button
        @click="handleRecordingToggle"
        :disabled="disabled || audioStore.isStopping"
        :class="[
          'flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 shadow-sm text-white min-h-[40px]',
          audioStore.isRecording ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          (disabled || audioStore.isStopping) ? 'opacity-50 cursor-not-allowed' : ''
        ]"
      >
        <svg 
          :class="{'animate-pulse': audioStore.isRecording}" 
          class="h-4 w-4 mr-2 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
        <span class="whitespace-nowrap">
          {{ buttonText }}
        </span>
      </button>
    </div>

    <div 
      v-if="!audioStore.isRecording && audioStore.combinedError" 
      class="p-4 bg-red-50 text-red-600 rounded-md"
    >
      {{ audioStore.combinedError }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AudioRecorder from '~/components/AudioRecorder.vue'
import { useTranscriptionStore } from '~/stores/transcriptionStore'
import { useAudioStore } from '~/stores/audioStore'

const transcriptionStore = useTranscriptionStore()
const audioStore = useAudioStore()

const transcription = ref('')

watch(
  () => transcriptionStore.transcription,
  (newTranscription) => {
    transcription.value = newTranscription
  }
)

const chunkSize = ref(5) // Default chunk size in seconds

const handleRecordingToggle = async () => {
  try {
    if (!audioStore.isRecording) {
      await audioStore.startRecording()
    } else {
      await audioStore.stopRecording()
    }
  } catch (error: any) {
    console.error('Recording error:', error)
    alert(error.message || 'An unexpected error occurred during recording.')
  }
}
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const offlineCtx = new OfflineAudioContext(1, 44100, 44100); // Set sample rate
    const audioContext = new AudioContext({ sampleRate: offlineCtx.sampleRate });
    const source = audioContext.createMediaStreamSource(stream);
  })
  .catch(error => console.error("Error accessing microphone:", error));


const buttonText = computed(() => {
  if (audioStore.isStopping) return 'Stopping...'
  return audioStore.isRecording ? 'Recording...' : 'Start Recording'
})

const props = defineProps<{
  disabled?: boolean
}>()
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>