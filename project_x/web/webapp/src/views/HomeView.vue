<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Select company name:</span>
      </div>
    </template>
    <div @click="onClick('youtube')" class="text item">Youtube</div>
    <div @click="onClick('patreon')" class="text item">Patreon</div>
    <div @click="onClick('shopify')" class="text item">Shopify</div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElCard } from 'element-plus';

export default defineComponent({
  name: 'HomeView',
  components: {
    ElCard,
  },

  methods: {
    onClick(name: string) {
      console.log('onClick ' + name);
      if (name === 'youtube') {
        location.href = 'https://projectx.i234.me/oauth2/code?company=' + name;
      } else if (name === 'patreon') {
        this.$router.push({ name: 'password', params: { name: name } });
      } else if (name === 'shopify') {
        location.href =
          'https://projectx.i234.me/oauth2/code?company=' +
          name +
          '&shop=telystore-dev.myshopify.com';
      }
    },
  },
});
</script>

<style>
.box-card {
  width: 50%;
  margin: 50px auto;
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
