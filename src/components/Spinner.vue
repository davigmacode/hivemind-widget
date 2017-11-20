<template>
  <div class="hivemind-loading">
    <div class="hivemind-spinner"></div>
    <div class="hivemind-spinner-text">Loading..</div>
  </div>
</template>

<script>
  export default {}
</script>

<style>
  .hivemind-spinner {
    transition: all 0.3s linear;
    margin: 0 auto;
    border-radius: 100%;
    border: 4px solid #eee;
    border-top: 4px solid #059B85;
    width: 32px;
    height: 32px;
    animation: hivemind-spinner-spin 0.8s linear infinite;
  }
  .hivemind-spinner-text {
    margin-top: 25px;
    font-size: 16px;
    text-align: center;
    color: #555;
  }
  @keyframes hivemind-spinner-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>