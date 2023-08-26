<script setup lang="ts">
import { nextTick, ref } from "vue";

const input = ref<HTMLInputElement>();

const content = ref("");
const last_height = ref("");

const emit = defineEmits<{
  "update:modelValue": [v: string];
  send: [];
}>();

/* 输入时触发 */
const handleInput = (e: Event) => {
  if (!input.value) return;
  const el = e.target as HTMLInputElement;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
  last_height.value = el.clientHeight + "px";

  emit("update:modelValue", content.value);
};

/* 失去焦点 */
const handleBlur = () => {
  nextTick(() => {
    if (!input.value) return;
    input.value.style.height = "7rem";
  });
};

/* 获取焦点 */
const handleFocus = () => {
  if (!input.value) return;
  input.value.style.height = last_height.value;
};

/* 发送 */
const handleSend = () => {
  emit("send");
  content.value = "";
};
</script>

<template>
  <transition name="c-input" appear>
    <div class="c-input">
      <div class="main">
        <textarea
          ref="input"
          v-model.trim="content"
          class="input input-content"
          placeholder="回车发送"
          @focus="handleFocus"
          @input="handleInput"
          @blur="handleBlur"
          @keydown.exact.enter.prevent="handleSend"
        ></textarea>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="less">
@import url("./index");
</style>
