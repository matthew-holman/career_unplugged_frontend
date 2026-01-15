<template>
  <div class="q-pa-lg">
    <div class="row items-center q-mb-lg">
      <div class="text-h5 text-weight-medium">Dashboard</div>
      <q-space />
      <q-btn color="primary" label="Review now" @click="goToReview" />
    </div>

    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card bordered class="kpi-card">
          <q-card-section>
            <div class="text-caption text-grey-7">To review</div>
            <div class="text-h5">{{ kpi.toReview }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card bordered class="kpi-card">
          <q-card-section>
            <div class="text-caption text-grey-7">EU Remote</div>
            <div class="text-h5">{{ kpi.euRemote }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card bordered class="kpi-card">
          <q-card-section>
            <div class="text-caption text-grey-7">Sweden</div>
            <div class="text-h5">{{ kpi.sweden }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card bordered class="kpi-card">
          <q-card-section>
            <div class="text-caption text-grey-7">New 7d</div>
            <div class="text-h5">{{ kpi.new7d }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <q-card bordered class="kpi-card">
          <q-card-section>
            <div class="text-caption text-grey-7">Positive matches</div>
            <div class="text-h5">{{ kpi.positiveMatches }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-4">
        <q-card bordered class="q-pa-sm">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium">Jobs by Source</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-table
              flat
              dense
              :rows="jobsBySource"
              :columns="breakdownColumns"
              row-key="label"
              hide-bottom
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-4">
        <q-card bordered class="q-pa-sm">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium">Jobs by Country</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-table
              flat
              dense
              :rows="jobsByCountry"
              :columns="breakdownColumns"
              row-key="label"
              hide-bottom
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-4">
        <q-card bordered class="q-pa-sm">
          <q-card-section>
            <div class="text-subtitle1 text-weight-medium">
              Remote status distribution
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div
              v-for="row in remoteStatusRows"
              :key="row.label"
              class="q-mb-md"
            >
              <div class="row items-center q-mb-xs">
                <div class="text-caption text-grey-8">{{ row.label }}</div>
                <q-space />
                <div class="text-caption">{{ row.count }}</div>
              </div>
              <q-linear-progress :value="row.ratio" color="primary" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  QCard,
  QCardSection,
  QBtn,
  QSeparator,
  QTable,
  QLinearProgress,
  QSpace,
} from 'quasar';
import { QTableProps } from 'quasar';
import { useJobStore } from 'stores/jobs';
import { Job, RemoteStatus } from 'src/client/scraper';

const jobStore = useJobStore();
const router = useRouter();

onMounted(() => {
  jobStore.listJobs({});
});

const jobs = computed<Job[]>(() => jobStore.jobs);
const totalJobs = computed(() => jobs.value.length || 1);

const breakdownColumns: QTableProps['columns'] = [
  { name: 'label', label: 'Label', field: 'label', align: 'left' },
  { name: 'count', label: 'Count', field: 'count', align: 'right' },
  { name: 'percent', label: '%', field: 'percent', align: 'right' },
];

const EU_COUNTRIES = new Set(
  [
    'austria',
    'belgium',
    'bulgaria',
    'croatia',
    'cyprus',
    'czechia',
    'czech republic',
    'denmark',
    'estonia',
    'finland',
    'france',
    'germany',
    'greece',
    'hungary',
    'ireland',
    'italy',
    'latvia',
    'lithuania',
    'luxembourg',
    'malta',
    'netherlands',
    'poland',
    'portugal',
    'romania',
    'slovakia',
    'slovenia',
    'spain',
    'sweden',
  ]
);

const kpi = computed(() => {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  let toReview = 0;
  let euRemote = 0;
  let sweden = 0;
  let new7d = 0;
  let positiveMatches = 0;

  jobs.value.forEach((job) => {
    if (job.applied !== true) toReview += 1;
    if (job.positiveKeywordMatch) positiveMatches += 1;

    const country = (job.country || '').toLowerCase().trim();
    if (country === 'sweden') sweden += 1;

    const isRemote =
      job.listingRemote === RemoteStatus._2 || job.trueRemote === true;
    if (isRemote && EU_COUNTRIES.has(country)) euRemote += 1;

    const rawDate = job.listingDate ?? job.createdAt;
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!Number.isNaN(parsed.getTime()) && parsed >= sevenDaysAgo) {
        new7d += 1;
      }
    }
  });

  return { toReview, euRemote, sweden, new7d, positiveMatches };
});

const jobsBySource = computed(() => {
  const counts: Record<string, number> = {};
  jobs.value.forEach((job) => {
    const label = job.source ? String(job.source) : 'unknown';
    counts[label] = (counts[label] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      percent: `${Math.round((count / totalJobs.value) * 100)}%`,
    }))
    .sort((a, b) => b.count - a.count);
});

const jobsByCountry = computed(() => {
  const counts: Record<string, number> = {};
  jobs.value.forEach((job) => {
    const label = job.country ? String(job.country) : 'unknown';
    counts[label] = (counts[label] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      percent: `${Math.round((count / totalJobs.value) * 100)}%`,
    }))
    .sort((a, b) => b.count - a.count);
});

const remoteStatusRows = computed(() => {
  const counts = {
    Remote: 0,
    Hybrid: 0,
    Onsite: 0,
    Unknown: 0,
  };

  jobs.value.forEach((job) => {
    if (job.listingRemote === RemoteStatus._2 || job.trueRemote === true) {
      counts.Remote += 1;
      return;
    }
    if (job.listingRemote === RemoteStatus._3) {
      counts.Hybrid += 1;
      return;
    }
    if (job.listingRemote === RemoteStatus._1) {
      counts.Onsite += 1;
      return;
    }
    counts.Unknown += 1;
  });

  return Object.entries(counts).map(([label, count]) => ({
    label,
    count,
    ratio: count / totalJobs.value,
  }));
});

function goToReview() {
  const now = new Date();
  const gte = new Date(now);
  gte.setDate(now.getDate() - 7);
  router.push({
    name: 'jobs',
    query: {
      createdAtGte: gte.toISOString(),
      createdAtLte: now.toISOString(),
    },
  });
}
</script>

<style scoped>
.kpi-card {
  min-height: 110px;
}
</style>
