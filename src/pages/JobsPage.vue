<template>
  <div class="q-pa-lg cu-container">
    <div class="row items-center q-gutter-md q-mb-lg">
      <div class="text-h5 text-weight-medium">Jobs</div>
      <q-space />
      <q-input
        v-model="titleModel"
        outlined
        dense
        debounce="300"
        placeholder="Search by title"
        class="search-input"
        clearable
      />
    </div>

    <div class="row q-col-gutter-sm q-mb-xl">
      <q-chip
        clickable
        :outline="!isToReviewActive"
        :color="isToReviewActive ? 'primary' : 'grey-4'"
        text-color="dark"
        class="cu-chip"
        @click="toggleToReview"
      >
        To review
      </q-chip>
      <q-chip
        clickable
        :outline="!isRemoteActive"
        :color="isRemoteActive ? 'primary' : 'grey-4'"
        text-color="dark"
        class="cu-chip"
        @click="toggleRemote"
      >
        Remote
      </q-chip>
      <q-chip
        clickable
        :outline="!isSwedenActive"
        :color="isSwedenActive ? 'primary' : 'grey-4'"
        text-color="dark"
        class="cu-chip"
        @click="toggleSweden"
      >
        Sweden
      </q-chip>
      <q-chip
        clickable
        :outline="!isEuRemoteActive"
        :color="isEuRemoteActive ? 'primary' : 'grey-4'"
        text-color="dark"
        class="cu-chip"
        @click="toggleEuRemote"
      >
        EU Remote
      </q-chip>
      <q-chip
        clickable
        :outline="!isNew7dActive"
        :color="isNew7dActive ? 'primary' : 'grey-4'"
        text-color="dark"
        class="cu-chip"
        @click="toggleNew7d"
      >
        New 7d
      </q-chip>
      <q-chip
        clickable
        :outline="!isPositiveMatchActive"
        :color="isPositiveMatchActive ? 'primary' : 'grey-4'"
        text-color="dark"
        class="cu-chip"
        @click="togglePositiveMatch"
      >
        Positive matches
      </q-chip>
    </div>

    <section class="q-mb-xl">
      <div class="row items-center q-mb-md">
        <div class="text-subtitle1 text-weight-medium">Top Matches</div>
        <q-space />
        <div class="text-caption text-grey-7">
          {{ topMatches.length }} results
        </div>
      </div>
      <div class="row q-col-gutter-lg">
        <div
          v-for="job in topMatches"
          :key="job.id ?? job.sourceUrl"
          class="col-12 col-sm-6 col-lg-4 col-xl-3"
        >
          <JobCard
            :job="job"
            :triage-label="triageLabel(job)"
            :triage-color="triageColor(job)"
            :location-label="locationLabel(job)"
            :listing-remote-label="listingRemoteLabel(job)"
            :date-label="dateLabel(job)"
            @open="openLinkInNewTab(job.sourceUrl)"
            @applied="setTriage(job, 'applied')"
            @shortlist="setTriage(job, 'shortlist')"
            @ignore="setTriage(job, 'ignore')"
          />
        </div>
      </div>
    </section>

    <section>
      <div class="row items-center q-mb-md">
        <div class="text-subtitle1 text-weight-medium">All Results</div>
        <q-space />
        <div class="text-caption text-grey-7">
          {{ visibleJobs.length }} results
        </div>
      </div>
      <div class="row q-col-gutter-lg">
        <div
          v-for="job in visibleJobs"
          :key="`all-${job.id ?? job.sourceUrl}`"
          class="col-12 col-sm-6 col-lg-4 col-xl-3"
        >
          <JobCard
            :job="job"
            :triage-label="triageLabel(job)"
            :triage-color="triageColor(job)"
            :location-label="locationLabel(job)"
            :listing-remote-label="listingRemoteLabel(job)"
            :date-label="dateLabel(job)"
            @open="openLinkInNewTab(job.sourceUrl)"
            @applied="setTriage(job, 'applied')"
            @shortlist="setTriage(job, 'shortlist')"
            @ignore="setTriage(job, 'ignore')"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { QChip, QInput, QSpace } from 'quasar';
import { useJobStore } from 'stores/jobs';
import { Job, RemoteStatus } from 'src/client/scraper';
import { JobQueryFilters, parseJobQuery, serializeJobQuery } from 'src/utils/jobQuery';
import JobCard from 'src/components/JobCard.vue';

type TriageStatus = 'applied' | 'shortlist' | 'ignore';

const TRIAGE_STORAGE_KEY = 'jobTriage';
const jobStore = useJobStore();
const route = useRoute();
const router = useRouter();
const jobs = ref<Job[]>([]);
const triage = ref<Record<string, TriageStatus>>({});
const filters = reactive<JobQueryFilters>({
  title: undefined,
  company: undefined,
  country: undefined,
  city: undefined,
  applied: undefined,
  trueRemote: undefined,
  analysed: undefined,
  positiveKeywordMatch: undefined,
  negativeKeywordMatch: undefined,
  source: undefined,
  listingRemote: undefined,
  createdAtGte: undefined,
  createdAtLte: undefined,
  listingDateGte: undefined,
  listingDateLte: undefined,
  euRemote: undefined,
  recentDays: undefined,
});

const titleModel = computed({
  get: () => filters.title ?? '',
  set: (value: string) => {
    filters.title = value ? value : undefined;
  },
});

let queryUpdateTimer: number | undefined;
let syncingFromRoute = false;
let appliedDefaultQuery = false;

const DEFAULT_RECENT_DAYS = 7;

function getDefaultFilters(): JobQueryFilters {
  return {
    recentDays: DEFAULT_RECENT_DAYS,
  };
}

onMounted(() => {
  loadTriage();
});

watch(
  () => route.query,
  (query) => {
    syncingFromRoute = true;
    const hasQuery = Object.keys(query).length > 0;
    if (!hasQuery) {
      if (!appliedDefaultQuery) {
        appliedDefaultQuery = true;
        const defaults = getDefaultFilters();
        applyFilters(defaults);
        const nextQuery = serializeJobQuery(defaults);
        router.replace({ query: nextQuery });
        fetchJobs();
      }
      window.setTimeout(() => {
        syncingFromRoute = false;
      }, 0);
      return;
    }
    appliedDefaultQuery = false;
    const next = parseJobQuery(
      query as Record<string, string | string[] | null | undefined>
    );
    const changed = applyFilters(next);
    if (changed) {
      fetchJobs();
    }
    window.setTimeout(() => {
      syncingFromRoute = false;
    }, 0);
  },
  { immediate: true }
);

watch(
  filters,
  () => {
    if (syncingFromRoute) return;
    if (queryUpdateTimer) window.clearTimeout(queryUpdateTimer);
    queryUpdateTimer = window.setTimeout(() => {
      const nextQuery = serializeJobQuery(filters);
      if (!isSameQuery(nextQuery, route.query)) {
        router.replace({ query: nextQuery });
      }
      fetchJobs();
    }, 300);
  },
  { deep: true }
);

async function fetchJobs(): Promise<void> {
  await jobStore.listJobs({
    title: filters.title,
    company: filters.company,
    country: filters.country,
    city: filters.city,
    applied: filters.applied,
    trueRemote: filters.trueRemote,
    analysed: filters.analysed,
    positiveKeywordMatch: filters.positiveKeywordMatch,
    negativeKeywordMatch: filters.negativeKeywordMatch,
    source: filters.source,
    listingRemote: filters.listingRemote,
    createdAtGte: filters.createdAtGte,
    createdAtLte: filters.createdAtLte,
    listingDateGte: filters.listingDateGte,
    listingDateLte: filters.listingDateLte,
    euRemote: filters.euRemote,
    recentDays: filters.recentDays,
  });
  jobs.value = jobStore.jobs;
}

const visibleJobs = computed(() => jobs.value);

const topMatches = computed(() => visibleJobs.value);

const isToReviewActive = computed(() => filters.applied === false);
const isRemoteActive = computed(() => filters.trueRemote === true);
const isSwedenActive = computed(
  () => (filters.country || '').toLowerCase() === 'sweden'
);
const isEuRemoteActive = computed(() => filters.euRemote === true);
const isNew7dActive = computed(
  () =>
    filters.recentDays === 7 ||
    Boolean(filters.createdAtGte && filters.createdAtLte)
);
const isPositiveMatchActive = computed(
  () => filters.positiveKeywordMatch === true
);

function toggleToReview() {
  filters.applied = filters.applied === false ? undefined : false;
}

function toggleRemote() {
  filters.trueRemote = filters.trueRemote === true ? undefined : true;
}

function toggleSweden() {
  filters.country = isSwedenActive.value ? undefined : 'Sweden';
}

function toggleEuRemote() {
  if (filters.euRemote) {
    filters.euRemote = undefined;
    return;
  }
  filters.euRemote = true;
}

function toggleNew7d() {
  if (filters.recentDays === 7) {
    filters.recentDays = undefined;
    return;
  }
  filters.recentDays = 7;
  filters.createdAtGte = undefined;
  filters.createdAtLte = undefined;
  filters.listingDateGte = undefined;
  filters.listingDateLte = undefined;
}

function togglePositiveMatch() {
  filters.positiveKeywordMatch =
    filters.positiveKeywordMatch === true ? undefined : true;
}

function applyFilters(next: JobQueryFilters): boolean {
  const keys: (keyof JobQueryFilters)[] = [
    'title',
    'company',
    'country',
    'city',
    'applied',
    'trueRemote',
    'analysed',
    'positiveKeywordMatch',
    'negativeKeywordMatch',
    'source',
    'listingRemote',
    'createdAtGte',
    'createdAtLte',
    'listingDateGte',
    'listingDateLte',
    'euRemote',
    'recentDays',
  ];
  let changed = false;
  keys.forEach((key) => {
    if (filters[key] !== next[key]) {
      (filters as Record<string, JobQueryFilters[keyof JobQueryFilters]>)[key] =
        next[key];
      changed = true;
    }
  });
  return changed;
}

function isSameQuery(
  next: Record<string, string>,
  current: LocationQuery
) {
  const normalized: Record<string, string> = {};
  Object.keys(current).forEach((key) => {
    const value = current[key];
    if (Array.isArray(value)) {
      if (value[0]) normalized[key] = value[0];
      return;
    }
    if (typeof value === 'string') normalized[key] = value;
  });
  const nextKeys = Object.keys(next);
  const currentKeys = Object.keys(normalized);
  if (nextKeys.length !== currentKeys.length) return false;
  return nextKeys.every((key) => normalized[key] === next[key]);
}

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function jobKey(job: Job): string {
  if (job.id != null) return String(job.id);
  return job.sourceUrl;
}

function loadTriage() {
  try {
    const raw = window.localStorage.getItem(TRIAGE_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, TriageStatus>;
    triage.value = parsed || {};
  } catch {
    triage.value = {};
  }
}

function persistTriage() {
  window.localStorage.setItem(TRIAGE_STORAGE_KEY, JSON.stringify(triage.value));
}

function setTriage(job: Job, status: TriageStatus) {
  const key = jobKey(job);
  triage.value = {
    ...triage.value,
    [key]: status,
  };
  persistTriage();
}

function triageLabel(job: Job): string | null {
  const status = triage.value[jobKey(job)];
  if (!status) return null;
  if (status === 'applied') return 'Applied';
  if (status === 'shortlist') return 'Shortlist';
  return 'Ignored';
}

function triageColor(job: Job): string {
  const status = triage.value[jobKey(job)];
  if (status === 'applied') return 'positive';
  if (status === 'shortlist') return 'indigo';
  return 'negative';
}

function listingRemoteLabel(job: Job): string | null {
  if (job.listingRemote === RemoteStatus.ONSITE) return 'Onsite';
  if (job.listingRemote === RemoteStatus.REMOTE) return 'Remote';
  if (job.listingRemote === RemoteStatus.HYBRID) return 'Hybrid';
  return null;
}

function locationLabel(job: Job): string {
  const parts = [job.country, job.city].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Location unknown';
}

function dateLabel(job: Job): string {
  const rawDate = job.listingDate ?? job.createdAt;
  if (!rawDate) return 'Date not set';
  const parsed = parseDate(rawDate);
  if (!parsed) return 'Date not set';
  const diffDays = Math.max(
    0,
    Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24))
  );
  return `${parsed.toLocaleDateString()} (${diffDays}d ago)`;
}

function openLinkInNewTab(url: string) {
  window.open(url, '_blank');
}
</script>
