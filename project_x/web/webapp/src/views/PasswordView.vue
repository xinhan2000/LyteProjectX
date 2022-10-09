<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Please input email and password:</span>
      </div>
    </template>

    <el-form ref="formRef" :model="dynamicValidateForm" label-width="120px">
      <el-form-item
        prop="email"
        label="Email"
        :rules="[
          {
            required: true,
            message: 'Please input email address',
            trigger: 'blur',
          },
          {
            type: 'email',
            message: 'Please input correct email address',
            trigger: ['blur', 'change'],
          },
        ]"
      >
        <el-input v-model="dynamicValidateForm.email" />
      </el-form-item>

      <el-form-item label="Password" prop="pass">
        <el-input
          v-model="dynamicValidateForm.pass"
          type="password"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">Submit</el-button>
        <el-button @click="resetForm()">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { reactive, ref } from 'vue';
import { FormInstance } from 'element-plus';
import { ElCard, ElForm, ElFormItem, ElButton, ElInput } from 'element-plus';

export default defineComponent({
  name: 'PasswordView',
  components: {
    ElCard,
    ElForm,
    ElFormItem,
    ElButton,
    ElInput,
  },

  data() {
    return {
      formRef: ref<FormInstance>(),
      dynamicValidateForm: reactive({
        email: '',
        pass: '',
      }),
    };
  },
  methods: {
    submitForm() {
      let formEl = this.$refs.formRef as FormInstance;
      if (!formEl) return;
      formEl.validate((valid) => {
        console.log('submitForm, valid: ' + valid);
        if (valid) {
          console.log('submit!');
        } else {
          console.log('error submit!');
          return false;
        }
      });
    },

    resetForm() {
      let formEl = this.$refs.formRef as FormInstance;
      if (!formEl) return;
      formEl.resetFields();
    },
  },
});
</script>
