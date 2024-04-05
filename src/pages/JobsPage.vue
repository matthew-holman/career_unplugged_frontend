<template>
  <div class="q-pa-md">
    <q-table
      :rows="jobs"
      :columns="tableColumns"
      :pagination="pagination"
      row-key="name"
      data-cy="breaksTable"
    >
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, Ref } from 'vue';
import { useJobStore } from 'stores/jobs';
import { JobRead } from 'src/client/scraper';
import { QTableColumn } from 'quasar';

onMounted(() => {
  fetchJobs();
});

interface JobTableParams {
  title?: string;
  company?: string;
  country?: string,
  city?: string;
  applied?: boolean;
  remote?: boolean;
  analysed?: boolean;
  offset?: number;
  limit?: number;
}

const jobStore = useJobStore();

const tableColumns: QTableColumn[] = [
  {
    name: 'title',
    label: 'Role Title',
    field: 'title',
    sortable: true
  },
  { name: 'company', align: 'center', label: 'Company', field: 'company', sortable: true },
  { name: 'country', label: 'Country', field: 'country', sortable: true },
  { name: 'city', label: 'City', field: 'city', sortable: true },
  { name: 'applied', label: 'Applied', field: 'applied', sortable: true },
  { name: 'remote', label: 'Remote', field: 'remote', sortable: true},
  { name: 'analysed', label: 'Analysed', field: 'analysed', sortable: true}
]

let jobs: Ref<JobRead[]> = ref([]);
let jobTableParams: JobTableParams = reactive({
  title: undefined,
  company: undefined,
  country: undefined,
  city: undefined,
  applied: undefined,
  remote: undefined,
  analysed: undefined,
  offset: 0,
  limit: 1000,
});
let pagination = ref({
  page: 1,
  rowsPerPage: 50,
});

async function fetchJobs(): Promise<void> {

    await jobStore.listJobs(
      jobTableParams.title,
      jobTableParams.company,
      jobTableParams.country,
      jobTableParams.city,
      jobTableParams.applied,
      jobTableParams.remote,
      jobTableParams.analysed,
    );
  jobs.value = jobStore.jobs;
}

</script>
