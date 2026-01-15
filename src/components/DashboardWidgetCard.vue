<template>
  <q-card class="cu-card cu-card-bordered cu-widget-card">
    <q-card-section class="q-pb-sm">
      <div class="text-subtitle1 text-weight-medium">{{ title }}</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { QCard, QCardSection, QSeparator } from 'quasar';

defineProps<{
  title: string;
}>();
</script>
