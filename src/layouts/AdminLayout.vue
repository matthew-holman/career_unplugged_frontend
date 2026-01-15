<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar class="cu-header">
        <q-btn flat dense round icon="menu" @click="toggleDrawer" />
        <q-toolbar-title>Career Unplugged Admin</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="drawerOpen" show-if-above bordered class="cu-sidebar">
      <div class="cu-sidebar-header">Career Unplugged</div>
      <q-list padding>
        <q-item-label header>Navigation</q-item-label>

        <q-item clickable v-ripple to="/dashboard" exact active-class="cu-nav-active">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/jobs" exact active-class="cu-nav-active">
          <q-item-section avatar><q-icon name="work_outline" /></q-item-section>
          <q-item-section>Jobs</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/career-pages" exact active-class="cu-nav-active">
          <q-item-section avatar><q-icon name="business_center" /></q-item-section>
          <q-item-section>Career Pages</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/settings" exact active-class="cu-nav-active">
          <q-item-section avatar><q-icon name="settings" /></q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Page Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const drawerOpen = ref(false);
function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}
</script>
