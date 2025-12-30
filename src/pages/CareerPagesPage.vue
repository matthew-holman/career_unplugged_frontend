<template>
  <div class="q-pa-md">
    <q-card flat bordered class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Career Pages</div>
      </q-card-section>

      <q-separator />

      <!-- Add new page -->
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

      <!-- Existing pages -->
      <q-card-section>
        <q-table
          title="Saved Career Pages"
          :rows="careerPagesStore.pages"
          :columns="columns"
          row-key="id"
          flat
          bordered
          dense
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { QTableProps } from 'quasar';
import { useCareerPagesStore } from 'stores/career-pages';
import { CareerPageCreate } from 'src/client/scraper';

const careerPagesStore = useCareerPagesStore();

const newPage = reactive<CareerPageCreate>({
  url: '',
  company_name: '',
  active: true,
});

const columns: QTableProps['columns'] = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'company_name', label: 'Company', field: 'company_name', align: 'left' },
  { name: 'url', label: 'URL', field: 'url', align: 'left' },
  { name: 'active', label: 'Active', field: 'active', align: 'center' },
];

async function addCareerPage() {
  await careerPagesStore.addPage(newPage);
  newPage.url = '';
  newPage.company_name = '';
}

onMounted(() => {
  careerPagesStore.listPages();
});
</script>
