import { defineComponent, ref } from '@vue-mini/wechat';

defineComponent(() => {
  const greeting = ref('Welcome to Vue Mini');

  return {
    greeting,
  };
});
