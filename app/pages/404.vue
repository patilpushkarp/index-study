<template>
  <div class="error-page oi-container">
    <div class="error-card oi-card-box">
      <span class="meta-tag font-mono oi-xs">// 404 STATUS ERROR</span>
      <h1 class="oi-display">Page Not Located, <span class="oi-serif">symbol not listed.</span></h1>
      <p class="oi-body">
        The requested routing path does not correspond to an active global benchmark or module in the registry.
      </p>
      <div class="error-actions">
        <NuxtLink to="/" class="oi-btn is-white">
          Return to Global Overview
        </NuxtLink>
        <NuxtLink to="/compare" class="oi-btn">
          Compare Studio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '404 - Page Not Found — INDEX // STUDY'
})
</script>

<style scoped>
.error-page {
  padding-top: var(--oi-s6);
  padding-bottom: var(--oi-s7);
  display: flex;
  justify-content: center;
}

.error-card {
  max-width: 640px;
  padding: var(--oi-s5);
  display: flex;
  flex-direction: column;
  gap: var(--oi-s3);
  text-align: center;
  align-items: center;
}

.error-actions {
  display: flex;
  align-items: center;
  gap: var(--oi-s2);
  margin-top: var(--oi-s2);
}
</style>
