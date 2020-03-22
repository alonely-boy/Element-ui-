<template>
  <div class="home">
    <h1>This is an home page</h1>
    <el-button type="info" @click="logOut">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logOut() {
      window.sessionStorage.clear();
      this.$router.replace("/login");
    }
  }
};
</script>

<style scoped>
</style>