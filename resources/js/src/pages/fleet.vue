<script setup>
import { ref, onMounted } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet"
import L from 'leaflet'

// Import Leaflet CSS directly in component to ensure it's loaded
import 'leaflet/dist/leaflet.css'

const isMounted = ref(false)
const zoom = ref(13)
const center = ref([-6.2088, 106.8456])

const fleets = ref([
  {
    id: 1,
    name: 'VOL-342808',
    location: 'Chelsea, NY, USA',
    latlng: [-6.2088, 106.8456],
    progress: 88,
    status: 'Arrived',
    driver: 'Veronica Herman'
  },
  {
    id: 2,
    name: 'VOL-954784',
    location: 'Lincoln Harbor, NY, USA',
    latlng: [-6.2150, 106.8500],
    progress: 45,
    status: 'In Transit',
    driver: 'John Doe'
  }
])

const activeFleet = ref(fleets.value[0])

const selectFleet = (fleet) => {
  activeFleet.value = fleet
  center.value = fleet.latlng
}

onMounted(() => {
  // Fix for Leaflet default icon issues with Vite
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
  });
  
  isMounted.value = true
})
</script>

<template>
  <VRow>
    <VCol cols="12" md="4">
      <VCard class="fleet-sidebar d-flex flex-column h-100" style="min-height: 600px;">
        <VCardItem>
          <VCardTitle>Fleet</VCardTitle>
        </VCardItem>
        <VDivider />
        <VList lines="two" class="flex-grow-1 overflow-y-auto">
          <VListItem
            v-for="fleet in fleets"
            :key="fleet.id"
            :active="activeFleet.id === fleet.id"
            @click="selectFleet(fleet)"
            link
          >
            <template #prepend>
              <VAvatar color="grey-lighten-4" rounded variant="tonal">
                <VIcon icon="bx-car" />
              </VAvatar>
            </template>
            <VListItemTitle class="font-weight-medium">{{ fleet.name }}</VListItemTitle>
            <VListItemSubtitle>{{ fleet.location }}</VListItemSubtitle>
            <template #append>
              <VIcon icon="bx-chevron-right" size="20" class="text-disabled" />
            </template>
          </VListItem>
        </VList>

        <VCardText v-if="activeFleet" class="bg-var-theme-background pa-4">
          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-2 font-weight-medium">Delivery Process</span>
            <span class="text-body-2 font-weight-bold text-primary">{{ activeFleet.progress }}%</span>
          </div>
          <VProgressLinear
            :model-value="activeFleet.progress"
            color="primary"
            height="8"
            rounded
            class="mb-4"
          />

          <div class="fleet-timeline">
            <div class="d-flex mb-4">
              <VIcon icon="bx-check-circle" color="success" class="me-3 mt-1" />
              <div>
                <div class="text-caption text-uppercase text-success font-weight-bold">Tracking Number Created</div>
                <div class="text-body-2 font-weight-medium">{{ activeFleet.driver }}</div>
                <div class="text-caption">Sep 01, 7:53 AM</div>
              </div>
            </div>
            <div class="d-flex">
              <VIcon icon="bx-map-pin" color="primary" class="me-3 mt-1" />
              <div>
                <div class="text-caption text-uppercase text-primary font-weight-bold">Arrived</div>
                <div class="text-body-2 font-weight-medium">{{ activeFleet.driver }}</div>
                <div class="text-caption">Sep 04, 8:18 AM</div>
              </div>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="8">
      <VCard class="map-container overflow-hidden" style="height: 600px;">
        <div v-if="isMounted" style="height: 100%; width: 100%">
          <LMap
            ref="map"
            v-model:zoom="zoom"
            :center="center"
            :use-global-leaflet="false"
          >
            <LTileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
              layer-type="base"
              name="OpenStreetMap"
            />

            <LMarker v-for="fleet in fleets" :key="fleet.id" :lat-lng="fleet.latlng">
              <LPopup>
                <div class="pa-2">
                  <div class="font-weight-bold">{{ fleet.name }}</div>
                  <div class="text-caption">{{ fleet.driver }}</div>
                  <div class="text-caption text-primary">{{ fleet.status }}</div>
                </div>
              </LPopup>
            </LMarker>
          </LMap>
        </div>
        <div v-else class="d-flex align-center justify-center h-100">
          <VProgressCircular indeterminate color="primary" />
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

<style scoped>
.fleet-sidebar {
  border-radius: 8px;
}
.fleet-timeline {
  position: relative;
}
.map-container {
  border-radius: 8px;
  z-index: 1;
}
</style>

<style scoped>
.fleet-sidebar {
  height: 600px;
  display: flex;
  flex-direction: column;
}
.map-container {
  overflow: hidden;
}
</style>
