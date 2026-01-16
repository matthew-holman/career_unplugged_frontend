<template>
  <div class="q-pa-lg cu-container">
    <div class="row items-center q-mb-lg">
      <div class="text-h5 text-weight-medium">Dashboard</div>
      <q-space />
      <q-btn color="primary" label="Review now" @click="goToReview" />
    </div>

    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-6 col-lg-3">
        <KpiCard label="To review" :value="kpi.toReview" />
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <KpiCard label="EU Remote" :value="kpi.euRemote" />
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <KpiCard label="Sweden" :value="kpi.sweden" />
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <KpiCard label="New 7d" :value="kpi.new7d" />
      </div>
      <div class="col-12 col-sm-6 col-lg-3">
        <KpiCard label="Positive matches" :value="kpi.positiveMatches" />
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-4">
        <DashboardWidgetCard title="Jobs by Source">
          <q-table
            flat
            dense
            :rows="jobsBySource"
            :columns="breakdownColumns"
            row-key="label"
            hide-bottom
          />
        </DashboardWidgetCard>
      </div>

      <div class="col-12 col-lg-4">
        <DashboardWidgetCard title="Jobs by Country">
          <q-table
            flat
            dense
            :rows="jobsByCountry"
            :columns="breakdownColumns"
            row-key="label"
            hide-bottom
          />
        </DashboardWidgetCard>
      </div>

      <div class="col-12 col-lg-4">
        <DashboardWidgetCard title="Remote status distribution">
          <div v-for="row in remoteStatusRows" :key="row.label" class="q-mb-md">
            <div class="row items-center q-mb-xs">
              <div class="text-caption text-grey-8">{{ row.label }}</div>
              <q-space />
              <div class="text-caption">{{ row.count }}</div>
            </div>
            <q-linear-progress :value="row.ratio" color="primary" />
          </div>
        </DashboardWidgetCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  QBtn,
  QTable,
  QLinearProgress,
  QSpace,
} from 'quasar';
import { QTableProps } from 'quasar';
import { DashboardService, type JobSummary, RemoteStatus } from 'src/client/scraper';
import KpiCard from 'src/components/KpiCard.vue';
import DashboardWidgetCard from 'src/components/DashboardWidgetCard.vue';

const router = useRouter();
const summary = ref<JobSummary | null>(null);

onMounted(() => {
  DashboardService.jobsSummaryDashboardJobsSummaryGet().then((data) => {
    summary.value = data;
  });
});

const totalJobs = computed(() => {
  if (!summary.value) return 1;
  const values = Object.values(summary.value.counts_by_source || {});
  const total = values.reduce((acc, value) => acc + value, 0);
  return total || 1;
});

const breakdownColumns: QTableProps['columns'] = [
  { name: 'label', label: 'Label', field: 'label', align: 'left' },
  { name: 'count', label: 'Count', field: 'count', align: 'right' },
  { name: 'percent', label: '%', field: 'percent', align: 'right' },
];

const kpi = computed(() => {
  return {
    toReview: summary.value?.to_review ?? 0,
    euRemote: summary.value?.eu_remote ?? 0,
    sweden: summary.value?.sweden ?? 0,
    new7d: summary.value?.new7d ?? 0,
    positiveMatches: summary.value?.positive_matches ?? 0,
  };
});

const jobsBySource = computed(() => {
  const counts = summary.value?.counts_by_source || {};
  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      percent: `${Math.round((count / totalJobs.value) * 100)}%`,
    }))
    .sort((a, b) => b.count - a.count);
});

const jobsByCountry = computed(() => {
  const counts = summary.value?.counts_by_country || {};
  return Object.entries(counts)
    .map(([label, count]) => ({
      label,
      count,
      percent: `${Math.round((count / totalJobs.value) * 100)}%`,
    }))
    .sort((a, b) => b.count - a.count);
});

const remoteStatusRows = computed(() => {
  const counts = summary.value?.counts_by_remote_status || {};
  const order = [RemoteStatus.REMOTE, RemoteStatus.HYBRID, RemoteStatus.ONSITE];
  const rows = order.map((status) => ({
    label: statusLabel(status),
    count: counts[status] ?? 0,
    ratio: (counts[status] ?? 0) / totalJobs.value,
  }));
  const unknown = Object.keys(counts).filter((key) => !order.includes(key as RemoteStatus));
  if (unknown.length > 0) {
    const totalUnknown = unknown.reduce((acc, key) => acc + (counts[key] || 0), 0);
    rows.push({
      label: 'Unknown',
      count: totalUnknown,
      ratio: totalUnknown / totalJobs.value,
    });
  }
  return rows;
});

function statusLabel(status: RemoteStatus) {
  if (status === RemoteStatus.REMOTE) return 'Remote';
  if (status === RemoteStatus.HYBRID) return 'Hybrid';
  return 'Onsite';
}

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
