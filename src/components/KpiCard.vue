<template>
  <q-card class="cu-card cu-card-bordered cu-kpi">
    <q-card-section>
      <div class="text-caption text-grey-7">{{ label }}</div>
      <div class="text-h5">{{ value }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { QCard, QCardSection } from 'quasar';

defineProps<{
  label: string;
  value: string | number;
}>();
</script>
