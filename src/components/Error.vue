<template>
  <div class="error">
    <div class="error-message" v-text="message"></div>
  </div>
</template>

<script>
  export default {
    props: {
      message: {
        type: String,
        required: false,
        default: ''
      }
    }
  }
</script>

<style scoped>
  .error {
    min-height: 250px;
    background: #ECEFF1;
    justify-content: center;
    flex-direction: column;
    display: flex;
  }
  .error-message {
    color: #78909C;
    font-weight: bold;
    text-align: center;
  }
</style>
