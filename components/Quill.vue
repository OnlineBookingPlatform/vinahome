<script setup lang="ts">
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
const content = defineModel<string>();
const emits = defineEmits(['onsave'])
</script>

<template>
  <el-button type="primary" @click="() => emits('onsave')" class="mb-2">Lưu thông tin</el-button>
  <client-only>
    <QuillEditor v-model:content="content" theme="snow" contentType="html" :toolbar="[
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['link', 'image', 'video'],
      ['clean'],
    ]" />
  </client-only>
</template>
