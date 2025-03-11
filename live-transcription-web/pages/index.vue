<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
    <h1 class="text-2xl font-bold mb-4">Live Audio Transcription</h1>
    <AudioRecorder />

    <div class="mt-6 w-full max-w-md bg-white p-4 rounded-md shadow">
      <h2 class="text-lg font-medium mb-2">Transcription:</h2>
      
      <!-- Editable Textarea for Transcription -->
      <textarea
        v-model="transcription"
        class="w-full h-40 p-2 border rounded-md resize-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      ></textarea>

      <!-- Download Button -->
      <button 
        @click="downloadText"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Download Transcription
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AudioRecorder from '~/components/AudioRecorder.vue'
import { useTranscriptionStore } from '~/stores/transcriptionStore'
import axios from 'axios'

const transcriptionStore = useTranscriptionStore()
const transcription = ref('')
const chunkSize = ref(5) // Default chunk size in seconds
const selectedLanguage = ref('en') // Default: English
const enableDiarization = ref(false)

// Watch for transcription updates
watch(
  () => transcriptionStore.transcription,
  (newTranscription) => {
    transcription.value = newTranscription
  }
)

// Function to download transcription as a .txt file
const downloadText = () => {
  const blob = new Blob([transcription.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "transcription.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Function to translate transcription
const translateText = async () => {
  try {
    const response = await axios.post('/api/translate', {
      text: transcription.value,
      targetLang: selectedLanguage.value
    })
    transcription.value = response.data.translatedText
  } catch (error) {
    console.error('Translation error:', error)
  }
}

</script>

<style scoped>
textarea {
  font-size: 16px;
  line-height: 1.5;
}
</style>
