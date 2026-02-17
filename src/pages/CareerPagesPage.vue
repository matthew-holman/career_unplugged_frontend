<template>
  <div class="q-pa-md">
    <q-card flat bordered class="q-pa-md">
      <q-card-section class="row items-center">
        <div class="text-h6">Career Pages</div>
        <q-space />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.company_name"
              label="Company (contains)"
              filled
              clearable
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input v-model="filters.url" label="URL (contains)" filled clearable />
          </div>
          <div class="col-12 col-md-2">
            <q-select
              v-model="activeModel"
              :options="activeOptions"
              label="Active"
              filled
              emit-value
              map-options
              clearable
            />
          </div>
          <div class="col-12 col-md-2">
            <q-input
              v-model.number="lastStatusCodeModel"
              label="Last Status Code"
              type="number"
              filled
              clearable
            />
          </div>
        </div>
        <div class="row q-col-gutter-md items-end q-mt-sm">
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.last_synced_at_gte"
              label="Last Synced From"
              type="date"
              filled
              clearable
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.last_synced_at_lte"
              label="Last Synced To"
              type="date"
              filled
              clearable
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.deactivated_at_gte"
              label="Deactivated From"
              type="date"
              filled
              clearable
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.deactivated_at_lte"
              label="Deactivated To"
              type="date"
              filled
              clearable
            />
          </div>
        </div>
        <div class="row q-col-gutter-md items-end q-mt-sm">
          <div class="col-12 col-md-2">
            <q-input
              v-model.number="maxAgeHours"
              label="Max Age (hours)"
              type="number"
              filled
              min="1"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-toggle v-model="includeInactive" label="Include inactive" />
          </div>
          <div class="col-12 col-md-3">
            <q-btn
              color="primary"
              label="Sync ATS"
              :disable="selectedRows.length === 0"
              @click="triggerSyncAts"
            />
          </div>
        </div>
      </q-card-section>

      <q-separator spaced />

      <q-card-section>
        <q-form @submit.prevent="addCareerPage">
          <div class="row q-col-gutter-md items-end">
            <div class="col">
              <q-input v-model="newPage.url" label="URL" filled required />
            </div>
            <div class="col">
              <q-input v-model="newPage.company_name" label="Company Name" filled />
            </div>
            <div class="col-auto">
              <q-btn color="primary" label="Add" type="submit" />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator spaced />

      <q-card-section>
        <q-table
          title="Saved Career Pages"
          :rows="careerPagesStore.pages"
          :columns="columns"
          row-key="id"
          flat
          bordered
          dense
          selection="multiple"
          v-model:selected="selectedRows"
        >
          <template #body-cell-active="props">
            <q-td :props="props">
              <q-chip
                dense
                :color="props.row.active ? 'positive' : 'grey-6'"
                text-color="white"
              >
                {{ props.row.active ? 'Active' : 'Inactive' }}
              </q-chip>
            </q-td>
          </template>
          <template #body-cell-last_synced_at="props">
            <q-td :props="props">
              {{ formatTimestamp(props.row.last_synced_at) }}
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                color="primary"
                flat
                dense
                label="View jobs"
                @click="viewJobsForCareerPage(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { QTableProps } from 'quasar';
import { useCareerPagesStore } from 'stores/career-pages';
import { CareerPageCreate, type CareerPageRead, type WorkerRunRead } from 'src/client/scraper';
import { type CareerPageListParams } from 'src/api/career-pages';
import { syncAts } from 'src/api/sync';

type CareerPageRow = CareerPageRead & {
  last_synced_at?: string | null;
  deactivated_at?: string | null;
  last_status_code?: number | null;
};

type CareerPageFilters = {
  company_name?: string;
  url?: string;
  active?: boolean;
  last_synced_at_gte?: string;
  last_synced_at_lte?: string;
  deactivated_at_gte?: string;
  deactivated_at_lte?: string;
  last_status_code?: number;
};

const careerPagesStore = useCareerPagesStore();
const route = useRoute();
const router = useRouter();

const newPage = reactive<CareerPageCreate>({
  url: '',
  company_name: '',
  active: true,
});

const filters = reactive<CareerPageFilters>({});

const activeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];

const activeModel = computed<string | null>({
  get: () => {
    if (filters.active === true) return 'true';
    if (filters.active === false) return 'false';
    return 'all';
  },
  set: (value) => {
    if (value === 'true') {
      filters.active = true;
      return;
    }
    if (value === 'false') {
      filters.active = false;
      return;
    }
    filters.active = undefined;
  },
});

const lastStatusCodeModel = computed<number | null>({
  get: () => (filters.last_status_code == null ? null : filters.last_status_code),
  set: (value) => {
    if (value == null || Number.isNaN(value)) {
      filters.last_status_code = undefined;
      return;
    }
    filters.last_status_code = value;
  },
});

const selectedRows = ref<CareerPageRow[]>([]);
const maxAgeHours = ref(24);
const includeInactive = ref(false);
const lastWorkerRun = ref<WorkerRunRead | null>(null);

const columns: QTableProps['columns'] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'company_name', label: 'Company', field: 'company_name', align: 'left' },
  { name: 'url', label: 'URL', field: 'url', align: 'left' },
  { name: 'active', label: 'Active', field: 'active', align: 'center' },
  {
    name: 'last_synced_at',
    label: 'Last Synced',
    field: 'last_synced_at',
    align: 'left',
  },
  {
    name: 'last_status_code',
    label: 'Last Status',
    field: 'last_status_code',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'id',
    align: 'right',
  },
];

let queryUpdateTimer: number | undefined;
let syncingFromRoute = false;

watch(
  () => route.query,
  (query) => {
    syncingFromRoute = true;
    const next = parseCareerQuery(query);
    applyFilters(next);
    fetchCareerPages();
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
      const nextQuery = serializeCareerQuery(filters);
      if (!isSameQuery(nextQuery, route.query)) {
        router.replace({ query: nextQuery });
      }
      fetchCareerPages();
    }, 300);
  },
  { deep: true }
);

async function fetchCareerPages(): Promise<void> {
  const params: CareerPageListParams = {
    companyName: normalizeString(filters.company_name),
    url: normalizeString(filters.url),
    active: filters.active,
    lastSyncedAtGte: normalizeString(filters.last_synced_at_gte),
    lastSyncedAtLte: normalizeString(filters.last_synced_at_lte),
    deactivatedAtGte: normalizeString(filters.deactivated_at_gte),
    deactivatedAtLte: normalizeString(filters.deactivated_at_lte),
    lastStatusCode: filters.last_status_code,
  };
  await careerPagesStore.listPages(params);
}

async function addCareerPage() {
  await careerPagesStore.addPage(newPage);
  newPage.url = '';
  newPage.company_name = '';
}

async function triggerSyncAts(): Promise<void> {
  const careerPageIds = selectedRows.value.map((row) => row.id);
  const request = {
    max_age_hours: maxAgeHours.value,
    include_inactive: includeInactive.value,
    ...(careerPageIds.length > 0 ? { career_page_ids: careerPageIds } : {}),
  };
  lastWorkerRun.value = await syncAts(request);
}

function viewJobsForCareerPage(row: CareerPageRow) {
  router.push({
    path: '/jobs',
    query: { career_page_id: String(row.id) },
  });
}

function normalizeString(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function parseCareerQuery(query: LocationQuery): CareerPageFilters {
  return {
    company_name: getQueryString(query.company_name),
    url: getQueryString(query.url),
    active: parseBoolean(query.active),
    last_synced_at_gte: getQueryString(query.last_synced_at_gte),
    last_synced_at_lte: getQueryString(query.last_synced_at_lte),
    deactivated_at_gte: getQueryString(query.deactivated_at_gte),
    deactivated_at_lte: getQueryString(query.deactivated_at_lte),
    last_status_code: parseNumber(query.last_status_code),
  };
}

function serializeCareerQuery(filters: CareerPageFilters): Record<string, string> {
  const query: Record<string, string> = {};

  if (normalizeString(filters.company_name)) {
    query.company_name = normalizeString(filters.company_name) as string;
  }
  if (normalizeString(filters.url)) {
    query.url = normalizeString(filters.url) as string;
  }
  if (filters.active !== undefined) {
    query.active = filters.active ? 'true' : 'false';
  }
  if (normalizeString(filters.last_synced_at_gte)) {
    query.last_synced_at_gte = normalizeString(filters.last_synced_at_gte) as string;
  }
  if (normalizeString(filters.last_synced_at_lte)) {
    query.last_synced_at_lte = normalizeString(filters.last_synced_at_lte) as string;
  }
  if (normalizeString(filters.deactivated_at_gte)) {
    query.deactivated_at_gte = normalizeString(filters.deactivated_at_gte) as string;
  }
  if (normalizeString(filters.deactivated_at_lte)) {
    query.deactivated_at_lte = normalizeString(filters.deactivated_at_lte) as string;
  }
  if (filters.last_status_code != null) {
    query.last_status_code = String(filters.last_status_code);
  }

  return query;
}

function applyFilters(next: CareerPageFilters): boolean {
  const keys: (keyof CareerPageFilters)[] = [
    'company_name',
    'url',
    'active',
    'last_synced_at_gte',
    'last_synced_at_lte',
    'deactivated_at_gte',
    'deactivated_at_lte',
    'last_status_code',
  ];
  let changed = false;
  keys.forEach((key) => {
    if (filters[key] !== next[key]) {
      (filters as Record<string, CareerPageFilters[keyof CareerPageFilters]>)[key] = next[key];
      changed = true;
    }
  });
  return changed;
}

function isSameQuery(next: Record<string, string>, current: LocationQuery) {
  const normalized: Record<string, string> = {};
  Object.keys(current).forEach((key) => {
    const value = current[key];
    if (Array.isArray(value)) {
      if (value[0]) normalized[key] = String(value[0]);
      return;
    }
    if (typeof value === 'string') normalized[key] = value;
  });
  const nextKeys = Object.keys(next);
  const currentKeys = Object.keys(normalized);
  if (nextKeys.length !== currentKeys.length) return false;
  return nextKeys.every((key) => normalized[key] === next[key]);
}

function getQueryString(value: LocationQuery[keyof LocationQuery]): string | undefined {
  if (Array.isArray(value)) return value[0] ? String(value[0]) : undefined;
  if (typeof value === 'string' && value.trim().length > 0) return value;
  return undefined;
}

function parseBoolean(value: LocationQuery[keyof LocationQuery]): boolean | undefined {
  const raw = getQueryString(value);
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return undefined;
}

function parseNumber(value: LocationQuery[keyof LocationQuery]): number | undefined {
  const raw = getQueryString(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatTimestamp(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}
</script>
