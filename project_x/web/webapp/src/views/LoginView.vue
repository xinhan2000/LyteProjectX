<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Financial Time</span>
      </div>
    </template>

    <div>
      <span
        >Financial Time partners with Project X to connect your employment
        information.</span
      >
    </div>
    <br />
    <el-form ref="formRef" :model="dynamicValidateForm" label-width="160px">
      <el-form-item
        label="Project X user name: "
        label-with="160px"
        :rules="[
          //   {
          //     required: true,
          //     message: 'Please input user name',
          //     trigger: 'blur',
          //   },
          //   {
          //     type: 'email',
          //     message: 'Please input correct email address',
          //     trigger: ['blur', 'change'],
          //   },
        ]"
      >
        <el-input name="username" v-model="dynamicValidateForm.username" />
      </el-form-item>

      <el-form-item label="Password:" prop="pass">
        <el-input
          name="password"
          v-model="dynamicValidateForm.pass"
          type="password"
          autocomplete="off"
        />
      </el-form-item>

      <el-input name="company" type="hidden" :value="$route.params.name" />

      <el-form-item>
        <el-button
          ref="submit"
          type="primary"
          native-type="submit"
          @click="submitForm"
          >Login</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { reactive } from 'vue';
import {
  FormInstance,
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessageBox,
} from 'element-plus';

export default defineComponent({
  name: 'LoginView',
  components: {
    ElCard,
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
  },

  data() {
    return {
      dynamicValidateForm: reactive({
        username: '',
        pass: '',
      }),
    };
  },

  methods: {
    submitForm(e: any) {
      e.preventDefault();

      if (!this.dynamicValidateForm.username) {
        ElMessageBox.alert('Please input user name', 'Error');
        return;
      }
      if (!this.dynamicValidateForm.pass) {
        ElMessageBox.alert('Please input password', 'Error');
        return;
      }

      let form = this.$refs.formRef as FormInstance;
      if (!form) return;

      form.validate((valid) => {
        if (valid) {
          //   form.$el.submit();
          this.$router.push({ name: 'company' });
        } else {
          return false;
        }
      });
    },
  },
});
</script>
