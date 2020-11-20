<template>
  <div id="counter">
    Counter: {{ counter }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      counter: 0
    }
  }
}
</script>
<style lang="scss" scoped>
div {
  color: #000;
}
</style>