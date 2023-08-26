<script setup lang="ts">
import { useWebSocket } from "@vueuse/core";
import { nextTick, reactive, ref } from "vue";

import CInput from "./childComps/C-Input/index.vue";

interface Msg {
  msg: string;
  name: string;
  time: string;
}

const chat = ref<HTMLElement>();

const input = ref("");
const user = reactive({
  id: "101",
  name: "",
});
const chat_data = ref<{
  msgList: Msg[];
  userList: Msg[];
}>({
  msgList: [],
  userList: [],
});

const { data, send } = useWebSocket("ws://192.168.8.108:3000", {
  autoReconnect: {
    retries: 10,
    delay: 3000,
  },
  onConnected() {
    console.warn("连接成功");

    const name = sessionStorage.getItem("nickname");
    if (name) {
      user.name = name;
    } else {
      user.name = prompt("请输入你的昵称：") as string;
      sessionStorage.setItem("nickname", user.name);
    }

    send(
      JSON.stringify({
        type: "user",
        data: user,
      }),
    );
  },
  onDisconnected() {
    console.log("断开");
  },
  onMessage() {
    const msg = JSON.parse(data.value);

    console.log(msg);

    if (msg.type === "message") {
      chat_data.value = msg.data;
    } else if (msg.type === "msg") {
      chat_data.value.msgList.push(msg.data);
    }
    nextTick(() => {
      if (!chat.value) return;
      chat.value.scrollTop += chat.value.scrollHeight - chat.value.scrollTop - chat.value.clientHeight;
    });
  },
  onError(err) {
    console.error(err);
  },
});

const sendMsg = () => {
  if (!input.value) return;
  send(
    JSON.stringify({
      type: "message",
      data: {
        ...user,
        msgList: input.value,
      },
    }),
  );
  input.value = "";
};
</script>

<template>
  <div class="chat">
    <div ref="chat" class="msg-list">
      <div v-for="(item, index) in chat_data.msgList" :key="index" class="msg-bx">
        <div v-if="item.name !== user.name" class="box">{{ item.name }}：{{ item.msg }}</div>
        <div v-else class="box" style="text-align: right">{{ item.msg }} : 我</div>
      </div>
    </div>
    <CInput v-model="input" @send="sendMsg" />
  </div>
</template>

<style scoped lang="less">
@import url("./index.less");
</style>
