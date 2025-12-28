<template>
  <div class="q-pa-md row full-width">
    <!-- Jobs List occupying 50% of the width on the left -->
    <div class="col-6 job-list">
      <q-list bordered class="scrollable-section">
        <q-item
          v-for="job in jobs"
          :key="job.id"
          class="q-my-sm"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              <q-icon name="work_outline" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ job.title }}</q-item-label>
            <q-item-label caption>{{ job.company }}</q-item-label>
            <q-item-label caption
              >{{ job.country }}, {{ job.city }}</q-item-label
            >
            <q-item-label caption>
              Listing remote status
              {{ job.listingRemote != null ? RemoteStatus[job.listingRemote] : 'not set' }}
            </q-item-label>
            <q-item-label
              caption
              v-if="job.remoteFlagReason"
              class="text-teal-7"
            >
              Remote reason: {{ job.remoteFlagReason }}
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-btn
              flat
              icon="launch"
              @click.stop="openLinkInNewTab(job.sourceUrl)"
            />
          </q-item-section>
        </q-item>

        <q-separator />
      </q-list>
    </div>

    <!-- Filters and Search occupying the right 50% -->
    <div class="col-6 filter-section" style="max-width: 350px">
      <q-list bordered padding>
        <q-item-label header>Job Filters</q-item-label>

        <q-item clickable v-ripple tag="label">
          <q-item-section side top>
            <q-toggle
              :model-value="jobListParams.trueRemote === true"
              @update:model-value="toggleTrueRemote"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>True Remote</q-item-label>
            <q-item-label caption> Show only truly remote jobs </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple tag="label">
          <q-item-section side top>
            <q-toggle
              :model-value="jobListParams.city === 'Gothenburg'"
              @update:model-value="toggleLocalJobs"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>Local Jobs</q-item-label>
            <q-item-label caption> Show local jobs </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple tag="label">
          <q-item-section side top>
            <q-toggle
              :model-value="jobListParams.positiveKeywordMatch === true"
              @update:model-value="togglePositiveKeywordMatch"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>Positive Match</q-item-label>
            <q-item-label caption>
              Jobs with positive keyword matches
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple tag="label">
          <q-item-section side top>
            <q-toggle
              :model-value="jobListParams.recent === true"
              @update:model-value="toggleRecent"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>Recent Results</q-item-label>
            <q-item-label caption> Show only recent job postings </q-item-label>
          </q-item-section>
        </q-item>

        <q-select
          standout
          v-model="jobListParams.listingRemote"
          :options="remoteStatusOptions"
          option-value="value"
          option-label="name"
          label="LinkedIn remote status"
          emit-value
          map-options
          @update:model-value="fetchJobs"
          clearable
        />

        <q-separator spaced />

        <q-item-label header>Country Search</q-item-label>
        <q-item>
          <q-item-section>
            <q-input
              v-model="jobListParams.country"
              filled
              debounce="300"
              @update:model-value="fetchJobs"
              placeholder="Type to search country..."
              clearable
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import {
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QAvatar,
  QIcon,
  QBtn,
  QSeparator,
  QInput,
} from 'quasar';
import { useJobStore } from 'stores/jobs';
import { JobRead } from 'src/client/scraper';

enum RemoteStatus {
  ONSITE = 1,
  HYBRID = 3,
  REMOTE = 2,
}

const remoteStatusOptions = computed(() => {
  return Object.entries(RemoteStatus)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([key, value]) => !isNaN(Number(value)))
    .map(([key, value]) => ({ name: key, value: value }));
});

const jobStore = useJobStore();
let jobs = ref<JobRead[]>([]);
let jobListParams = reactive<{
  title?: string;
  company?: string;
  country?: string;
  city?: string;
  applied?: boolean;
  trueRemote?: boolean;
  positiveKeywordMatch?: true;  // Allow only `true` or `undefined`
  recent?: true;
  listingRemote?: number;
  offset: number;
  limit: number;
}>({
  title: undefined,
  company: undefined,
  country: undefined,
  city: undefined,
  applied: undefined,
  trueRemote: undefined,
  positiveKeywordMatch: undefined, // Default to undefined
  recent: undefined,
  listingRemote: undefined,
  offset: 0,
  limit: 1000,
});

onMounted(() => {
  console.log(jobListParams);
  fetchJobs();
});

async function fetchJobs(): Promise<void> {
  await jobStore.listJobs(jobListParams);
  jobs.value = jobStore.jobs;
}

function openLinkInNewTab(url: string) {
  window.open(url, '_blank');
}

function togglePositiveKeywordMatch(value: boolean) {
  jobListParams.positiveKeywordMatch = value ? true : undefined;
  fetchJobs();
}

function toggleRecent(value: boolean) {
  jobListParams.recent = value ? true : undefined;
  fetchJobs();
}

function toggleTrueRemote(value: boolean) {
  jobListParams.trueRemote = value ? true : undefined;
  fetchJobs();
}

function toggleLocalJobs(value: boolean) {
  jobListParams.city = value ? 'Gothenburg' : undefined;
  fetchJobs();
}

</script>

<style>
.full-width {
  width: 100%;
}
.job-list {
  margin-right: 20px; /* Adds space between the job list and the filter section */
}
.filter-section {
  max-width: 350px; /* Adjust if necessary */
}
.scrollable-section {
  max-height: 90vh; /* Adjust based on your layout needs */
  overflow-y: auto; /* Makes the section scrollable */
}
</style>
