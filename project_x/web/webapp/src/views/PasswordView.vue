<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Please input {{ $route.params.name }}'s email and password:</span>
      </div>
    </template>

    <el-form
      action="https://projectx.i234.me/oauth2/password"
      method="post"
      ref="formRef"
      :model="dynamicValidateForm"
      label-width="120px"
    >
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
        <el-input name="username" v-model="dynamicValidateForm.email" />
      </el-form-item>

      <el-form-item label="Password" prop="pass">
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
          >Submit</el-button
        >
        <el-button @click="resetForm">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { reactive } from 'vue';
import { FormInstance } from 'element-plus';
import { ElCard, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';

export default defineComponent({
  name: 'PasswordView',
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
        email: '',
        pass: '',
      }),
    };
  },

  methods: {
    submitForm(e: any) {
      e.preventDefault();

      let form = this.$refs.formRef as FormInstance;
      if (!form) return;

      form.validate((valid) => {
        console.log('submitForm, valid: ' + valid);
        if (valid) {
          console.log('submit!');
          form.$el.submit();
        } else {
          console.log('error submit!');
          return false;
        }
      });
    },

    resetForm(e: any) {
      e.preventDefault();

      let form = this.$refs.formRef as FormInstance;
      if (!form) return;
      form.resetFields();
    },
  },
});
</script>
