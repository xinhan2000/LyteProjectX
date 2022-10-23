<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Select company name:</span>
      </div>
    </template>
    <el-table
      :data="tableData"
      :show-header="false"
      @cell-click="onClick"
      ref="list"
    >
      <el-table-column prop="label" label="label" />
    </el-table>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ElCard, ElTable, ElTableColumn } from 'element-plus';

export default defineComponent({
  name: 'CompanyView',
  components: {
    ElCard,
    ElTable,
    ElTableColumn,
  },

  data() {
    return {
      tableData: [
        {
          label: 'Youtube',
          name: 'youtube',
        },
        {
          label: 'Patreon',
          name: 'patreon',
        },
        {
          label: 'Shopify',
          name: 'shopify',
        },
      ],
    };
  },

  methods: {
    onClick(row: any, column: any, cell: any, event: any) {
      let name = row.name;
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
