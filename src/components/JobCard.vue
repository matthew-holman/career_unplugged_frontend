<template>
  <q-card class="cu-card cu-card-bordered cu-job-card">
    <q-card-section class="column cu-job-card__body">
      <div class="row items-start cu-job-card__header">
        <div class="text-subtitle1 text-weight-medium cu-job-card__title">
          {{ job.title || 'Untitled role' }}
        </div>
        <q-space />
        <q-chip
          v-if="triageLabel"
          dense
          :color="triageColor"
          text-color="white"
          class="cu-chip"
        >
          {{ triageLabel }}
        </q-chip>
      </div>

      <div class="text-subtitle2 cu-job-card__subheader">{{ job.company }}</div>

      <div class="text-caption text-grey-7 cu-job-card__meta">
        {{ locationLabel }} • Source: {{ job.source || 'unknown' }}
      </div>

      <div v-if="hasChips" class="row q-gutter-xs cu-job-card__chips">
        <q-chip
          v-if="job.trueRemote"
          dense
          color="teal-2"
          text-color="teal-9"
          class="cu-chip"
        >
          True remote
        </q-chip>
        <q-chip
          v-if="listingRemoteLabel"
          dense
          color="blue-1"
          text-color="blue-9"
          class="cu-chip"
        >
          {{ listingRemoteLabel }}
        </q-chip>
        <q-chip
          v-if="job.positiveKeywordMatch"
          dense
          color="green-1"
          text-color="green-9"
          class="cu-chip"
        >
          Positive match
        </q-chip>
        <q-chip
          v-if="job.negativeKeywordMatch"
          dense
          color="red-1"
          text-color="red-9"
          class="cu-chip"
        >
          Negative match
        </q-chip>
        <q-chip
          v-if="job.analysed"
          dense
          color="amber-1"
          text-color="amber-10"
          class="cu-chip"
        >
          Analysed
        </q-chip>
      </div>

      <div class="text-caption text-grey-7 cu-job-card__date">
        {{ dateLabel }}
      </div>
      <div
        v-if="job.remoteFlagReason"
        class="text-caption text-teal-7 cu-job-card__note"
      >
        Remote reason: {{ job.remoteFlagReason }}
      </div>
      <div class="cu-job-card__footer">
        <q-separator class="cu-job-card__separator" />
        <q-card-actions align="between" class="cu-job-card__actions">
          <q-btn
            flat
            dense
            no-caps
            color="primary"
            label="Open"
            @click="$emit('open')"
          />
          <div class="row q-gutter-xs">
            <q-btn
              flat
              dense
              no-caps
              label="Mark Applied"
              :disable="job.applied || job.ignored"
              @click="$emit('applied')"
            />
            <q-btn
              flat
              dense
              no-caps
              label="Shortlist"
              @click="$emit('shortlist')"
            />
            <q-btn
              flat
              dense
              no-caps
              color="negative"
              label="Ignore"
              :disable="job.ignored"
              @click="$emit('ignore')"
            />
          </div>
        </q-card-actions>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  QCard,
  QCardSection,
  QSeparator,
  QCardActions,
  QBtn,
  QChip,
  QSpace,
} from 'quasar';
import { JobWithUserStateRead } from 'src/client/scraper';

defineEmits<{
  (event: 'open'): void;
  (event: 'applied'): void;
  (event: 'shortlist'): void;
  (event: 'ignore'): void;
}>();

const props = defineProps<{
  job: JobWithUserStateRead;
  triageLabel?: string | null;
  triageColor?: string;
  locationLabel: string;
  listingRemoteLabel?: string | null;
  dateLabel: string;
}>();

const hasChips = computed(() => {
  return Boolean(
    props.job.trueRemote ||
      props.listingRemoteLabel ||
      props.job.positiveKeywordMatch ||
      props.job.negativeKeywordMatch ||
      props.job.analysed
  );
});
</script>
