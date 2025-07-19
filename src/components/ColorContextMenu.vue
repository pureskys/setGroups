<template>
  <div
    v-if="showMenu"
    class="fixed z-50 flex w-26 flex-col gap-2 rounded-md border border-gray-200 bg-white p-2 shadow-lg"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    @click.stop
  >
    <h2 class="text-center font-bold">颜色标记</h2>
    <div
      v-for="color in colors"
      :key="color"
      class="h-6 rounded-xl"
      :style="{ backgroundColor: color || 'transparent' }"
      @click="selectColor(color)"
    ></div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["color-selected"]);
const showMenu = ref(false);
const position = ref({ x: 0, y: 0 });
const colors = ["#ff4444", "#ffcc00", "#44cc44"];
const currentItem = ref(null); // 新增：用于存储当前操作的item

const openMenu = (e, item) => {
  e.preventDefault();
  currentItem.value = item; // 存储item到内部ref
  position.value = { x: e.clientX, y: e.clientY };
  showMenu.value = true;
};

const selectColor = (color) => {
  if (!currentItem.value) return; // 安全检查

  emit("color-selected", {
    color,
    item: currentItem.value, // 使用存储的item
  });
  showMenu.value = false;
};

window.addEventListener("click", () => {
  showMenu.value = false;
});

defineExpose({ openMenu });
</script>
