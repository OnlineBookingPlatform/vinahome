<script setup lang="ts">
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { ElMessage } from "element-plus";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { createPolicyAPI, getPolicyAPI } from "~/api/companyAPI";
const route = useRoute();
const companyId = route.params.id;
const editorContent = ref("");

const loadPolicy = async () => {
  try {
    const response = await getPolicyAPI(Number(companyId));
    if (response.result) {
      editorContent.value =
        typeof response.result.content === "string"
          ? JSON.parse(response.result.content)
          : response.result.content;
      console.log("Editor content loaded:", editorContent.value);
    }
  } catch (error) {
    ElMessage.error("Không thể tải chính sách!");
  }
};

const saveContentPolicy = async () => {
  try {
    const policyInfo = {
      content: editorContent.value,
    };

    const response = await createPolicyAPI(Number(companyId), policyInfo);

    if (response.result) {
      ElMessage.success("Lưu chính sách thành công!");
      editorContent.value = response.result.content;
      console.log(response.result);
    } else {
      ElMessage.error(response.message || "Lưu thất bại.");
    }
  } catch (error) {
    ElMessage.error("Đã xảy ra lỗi khi lưu chính sách.");
  }
};


onMounted(() => {
  loadPolicy();
});
</script>

<template>
  <el-button type="primary" @click="saveContentPolicy" class="mb-2"
    >Lưu thông tin</el-button
  >
  <div>
    <div>{{ editorContent }}</div>
  </div>
  <client-only>
    <QuillEditor
      v-model:content="editorContent"
      theme="snow"
      contentType="delta"
      :toolbar="[
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
      ]"
    />
  </client-only>
</template>
