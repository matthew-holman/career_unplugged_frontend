<template>
  <div class="q-pa-lg page-container">
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
        @click="toggleToReview"
      >
        To review
      </q-chip>
      <q-chip
        clickable
        :outline="!isRemoteActive"
        :color="isRemoteActive ? 'primary' : 'grey-4'"
        text-color="dark"
        @click="toggleRemote"
      >
        Remote
      </q-chip>
      <q-chip
        clickable
        :outline="!isSwedenActive"
        :color="isSwedenActive ? 'primary' : 'grey-4'"
        text-color="dark"
        @click="toggleSweden"
      >
        Sweden
      </q-chip>
      <q-chip
        clickable
        :outline="!isEuRemoteActive"
        :color="isEuRemoteActive ? 'primary' : 'grey-4'"
        text-color="dark"
        @click="toggleEuRemote"
      >
        EU Remote
      </q-chip>
      <q-chip
        clickable
        :outline="!isNew7dActive"
        :color="isNew7dActive ? 'primary' : 'grey-4'"
        text-color="dark"
        @click="toggleNew7d"
      >
        New 7d
      </q-chip>
      <q-chip
        clickable
        :outline="!isPositiveMatchActive"
        :color="isPositiveMatchActive ? 'primary' : 'grey-4'"
        text-color="dark"
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
          <q-card bordered class="job-card">
            <q-card-section>
              <div class="row items-start q-mb-xs">
                <div class="text-subtitle1 text-weight-medium">
                  {{ job.title || 'Untitled role' }}
                </div>
                <q-space />
                <q-chip
                  v-if="triageLabel(job)"
                  dense
                  :color="triageColor(job)"
                  text-color="white"
                >
                  {{ triageLabel(job) }}
                </q-chip>
              </div>
              <div class="text-subtitle2">{{ job.company }}</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                {{ locationLabel(job) }}
              </div>
              <div class="text-caption text-grey-7">
                Source: {{ job.source || 'unknown' }}
              </div>
              <div class="row q-gutter-xs q-mt-sm">
                <q-chip
                  v-if="job.trueRemote"
                  dense
                  color="teal-2"
                  text-color="teal-9"
                >
                  True remote
                </q-chip>
                <q-chip
                  v-if="listingRemoteLabel(job)"
                  dense
                  color="blue-1"
                  text-color="blue-9"
                >
                  {{ listingRemoteLabel(job) }}
                </q-chip>
              </div>
              <div class="text-caption text-grey-7 q-mt-sm">
                {{ dateLabel(job) }}
              </div>
              <div
                v-if="job.remoteFlagReason"
                class="text-caption text-teal-7 q-mt-xs"
              >
                Remote reason: {{ job.remoteFlagReason }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="between">
              <q-btn
                flat
                color="primary"
                label="Open"
                @click.stop="openLinkInNewTab(job.sourceUrl)"
              />
              <div class="row q-gutter-xs">
                <q-btn
                  flat
                  dense
                  label="Mark Applied"
                  @click.stop="setTriage(job, 'applied')"
                />
                <q-btn
                  flat
                  dense
                  label="Shortlist"
                  @click.stop="setTriage(job, 'shortlist')"
                />
                <q-btn
                  flat
                  dense
                  color="negative"
                  label="Ignore"
                  @click.stop="setTriage(job, 'ignore')"
                />
              </div>
            </q-card-actions>
          </q-card>
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
          <q-card bordered class="job-card">
            <q-card-section>
              <div class="row items-start q-mb-xs">
                <div class="text-subtitle1 text-weight-medium">
                  {{ job.title || 'Untitled role' }}
                </div>
                <q-space />
                <q-chip
                  v-if="triageLabel(job)"
                  dense
                  :color="triageColor(job)"
                  text-color="white"
                >
                  {{ triageLabel(job) }}
                </q-chip>
              </div>
              <div class="text-subtitle2">{{ job.company }}</div>
              <div class="text-caption text-grey-7 q-mt-xs">
                {{ locationLabel(job) }}
              </div>
              <div class="text-caption text-grey-7">
                Source: {{ job.source || 'unknown' }}
              </div>
              <div class="row q-gutter-xs q-mt-sm">
                <q-chip
                  v-if="job.trueRemote"
                  dense
                  color="teal-2"
                  text-color="teal-9"
                >
                  True remote
                </q-chip>
                <q-chip
                  v-if="listingRemoteLabel(job)"
                  dense
                  color="blue-1"
                  text-color="blue-9"
                >
                  {{ listingRemoteLabel(job) }}
                </q-chip>
              </div>
              <div class="text-caption text-grey-7 q-mt-sm">
                {{ dateLabel(job) }}
              </div>
              <div
                v-if="job.remoteFlagReason"
                class="text-caption text-teal-7 q-mt-xs"
              >
                Remote reason: {{ job.remoteFlagReason }}
              </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="between">
              <q-btn
                flat
                color="primary"
                label="Open"
                @click.stop="openLinkInNewTab(job.sourceUrl)"
              />
              <div class="row q-gutter-xs">
                <q-btn
                  flat
                  dense
                  label="Mark Applied"
                  @click.stop="setTriage(job, 'applied')"
                />
                <q-btn
                  flat
                  dense
                  label="Shortlist"
                  @click.stop="setTriage(job, 'shortlist')"
                />
                <q-btn
                  flat
                  dense
                  color="negative"
                  label="Ignore"
                  @click.stop="setTriage(job, 'ignore')"
                />
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import {
  QBtn,
  QCard,
  QCardActions,
  QCardSection,
  QChip,
  QInput,
  QSeparator,
  QSpace,
} from 'quasar';
import { useJobStore } from 'stores/jobs';
import { Job, RemoteStatus } from 'src/client/scraper';
import { JobQueryFilters, parseJobQuery, serializeJobQuery } from 'src/utils/jobQuery';

type TriageStatus = 'applied' | 'shortlist' | 'ignore';

const TRIAGE_STORAGE_KEY = 'jobTriage';
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
});

const titleModel = computed({
  get: () => filters.title ?? '',
  set: (value: string) => {
    filters.title = value ? value : undefined;
  },
});

let queryUpdateTimer: number | undefined;
let syncingFromRoute = false;

onMounted(() => {
  loadTriage();
});

watch(
  () => route.query,
  (query) => {
    syncingFromRoute = true;
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
  });
  jobs.value = jobStore.jobs;
}

const visibleJobs = computed(() => {
  let list = jobs.value;
  if (filters.listingDateGte || filters.listingDateLte) {
    const gte = parseDate(filters.listingDateGte);
    const lte = parseDate(filters.listingDateLte);
    list = list.filter((job) => {
      const jobDate = parseDate(job.listingDate ?? job.createdAt);
      if (!jobDate) return false;
      if (gte && jobDate < gte) return false;
      if (lte && jobDate > lte) return false;
      return true;
    });
  }
  if (filters.euRemote) {
    list = list.filter((job) => {
      const isRemote =
        job.listingRemote === RemoteStatus._2 || job.trueRemote === true;
      const country = (job.country || '').toLowerCase().trim();
      return isRemote && EU_COUNTRIES.has(country);
    });
  }
  return list;
});

const topMatches = computed(() => visibleJobs.value);

const isToReviewActive = computed(() => filters.applied === false);
const isRemoteActive = computed(() => filters.trueRemote === true);
const isSwedenActive = computed(
  () => (filters.country || '').toLowerCase() === 'sweden'
);
const isEuRemoteActive = computed(() => filters.euRemote === true);
const isNew7dActive = computed(
  () => Boolean(filters.createdAtGte && filters.createdAtLte)
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
  filters.trueRemote = true;
}

function toggleNew7d() {
  if (filters.createdAtGte && filters.createdAtLte) {
    filters.createdAtGte = undefined;
    filters.createdAtLte = undefined;
    return;
  }
  const now = new Date();
  const gte = new Date(now);
  gte.setDate(now.getDate() - 7);
  filters.createdAtGte = gte.toISOString();
  filters.createdAtLte = now.toISOString();
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
  if (job.listingRemote === RemoteStatus._1) return 'Onsite';
  if (job.listingRemote === RemoteStatus._2) return 'Remote';
  if (job.listingRemote === RemoteStatus._3) return 'Hybrid';
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

<style scoped>
.page-container {
  max-width: 1280px;
  margin: 0 auto;
}

.search-input {
  min-width: 260px;
}

.job-card {
  min-height: 280px;
}
</style>
