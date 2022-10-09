<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Select company name:</span>
      </div>
    </template>
    <div  @click="onClick('youtube')" class="text item">Youtube</div>
    <div  @click="onClick('patreon')" class="text item">Patreon</div>
    <div @click="onClick('shopify')" class="text item">Shopify</div>
  </el-card>  
</template>

<script>
import {  ElCard } from 'element-plus'

export default {
  name: 'App',
  components: {
     ElCard
  },

  methods: {
    onClick(name) {
      console.log('onClick ' + name)
      if (name === 'youtube') {
        location.href = "https://projectx.i234.me/oauth2/code?company=youtube";
      } 
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
</style>
