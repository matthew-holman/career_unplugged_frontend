<template>
  <div class="q-pa-md">
    <q-table
      :rows="jobs"
      :columns="tableColumns"
      :pagination="pagination"
      row-key="name"
      data-cy="breaksTable"
    >
      <template v-slot:top>
        <div style="width: 100%" class="row">
          <div class="col-9">
            <q-toggle v-model="jobTableParams.true_remote" label="True Remote" @update:model-value="fetchJobs"/>
          </div>
        </div>
      </template>
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
  true_remote?: boolean;
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
    sortable: true,
    align: 'left'
  },
  { name: 'company', label: 'Company', field: 'company', sortable: true, align: 'left' },
  { name: 'country', label: 'Country', field: 'country', sortable: true, align: 'left' },
  { name: 'city', label: 'City', field: 'city', sortable: true, align: 'left' },
  { name: 'applied', label: 'Applied', field: 'applied', sortable: true, align: 'center'  },
  { name: 'true_remote', label: 'True Remote', field: 'trueRemote', sortable: true, align: 'center' },
  { name: 'analysed', label: 'Analysed', field: 'analysed', sortable: true}
]

let jobs: Ref<JobRead[]> = ref([]);
let jobTableParams: JobTableParams = reactive({
  title: undefined,
  company: undefined,
  country: undefined,
  city: undefined,
  applied: undefined,
  true_remote: undefined,
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
      jobTableParams.true_remote,
      jobTableParams.analysed,
    );
  jobs.value = jobStore.jobs;
}

</script>
