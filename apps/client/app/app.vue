<script setup lang="ts">
import { hcWithType } from "@rms/server/hc";

const data = ref({
  message: "Hello World",
});

const client = hcWithType("http://localhost:3000");

const onHello = async () => {
  const res = await client.index.$get();
  data.value = await res.json();
};
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <div>
      <Button @click="onHello">Hello</Button>
      <pre v-if="data.message !== 'Hello World'">{{
        JSON.stringify(data, null, 2)
      }}</pre>
    </div>
  </div>
</template>
