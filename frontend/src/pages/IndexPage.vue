<template>
<q-page padding>
  <div class="text-h4 q-mb-md">
    Advanced Full-Stack Demo (Quasar + Express)
  </div>
  
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">Git Workflow</div>
      <q-list bordered separator class="q-mt-sm">
        <q-item v-for="(step, index) in gitSteps" :key="index">
          <q-item-section avatar>
            <q-badge>{{ index + 1 }}</q-badge>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ step.title }}</q-item-label>
            <q-item-label caption>{{ step.detail }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>

  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">Docker Concepts</div>
      <q-list bordered separator class="q-mt-sm">
        <q-item v-for="(item, index) in dockerItems" :key="index">
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
            <q-item-label caption>{{ item.detail }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>

  <q-card>
    <q-card-section>
      <div class="text-h6">Data from Backend API</div>
      
      <p v-if="!loading && apiData.message" class="text-subtitle1 text-primary q-pb-sm">
        **{{ apiData.message }}**
      </p>
      
      <q-spinner v-if="loading" color="primary" size="2em" />
      <q-list v-else bordered separator class="q-mt-sm">
        <q-item class="bg-blue-grey-1">
                    <q-item-section>
                        <q-item-label overline>ข้อมูลนักศึกษา</q-item-label>
                        <q-item-label>ชื่อ: {{ apiData.student.name }} {{ apiData.student.surname }}</q-item-label>
                        <q-item-label caption>รหัส: {{ apiData.student.id }}</q-item-label>
                    </q-item-section>
                </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Advanced Git</q-item-label>
            <q-item-label caption>{{ apiData.git.detail }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label>Advanced Docker</q-item-label>
            <q-item-label caption>{{ apiData.docker.detail }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-btn v-if="!loading" color="primary" @click="fetchData" class="q-mt-md">Refresh Data</q-btn>
    </q-card-section>
  </q-card>
</q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// ข้อมูล Git/Docker (จากตัวอย่างก่อนหน้า)
const gitSteps = [
  { title: 'Feature Branching', detail: 'สร้าง branch ใหม่สำหรับทุก feature/bugfix' },
  { title: 'Code Review', detail: 'ต้องมีการรีวิวโค้ดก่อน merge เข้า main' },
  { title: 'Conventional Commits', detail: 'ใช้รูปแบบ commit message ที่เป็นมาตรฐาน (เช่น feat: fix:)' }
];
const dockerItems = [
  { title: 'Immutable Images', detail: 'ไม่ควรแก้ข้อมูลใน container ที่รันอยู่' },
  { title: 'Layer Caching', detail: 'ใช้ประโยชน์จากการแคชของ Docker เพื่อให้ build เร็วขึ้น' },
  { title: 'Multi-stage Build', detail: 'ใช้เพื่อลดขนาด final image' }
];

// อัปเดตการกำหนดค่าเริ่มต้นเพื่อรองรับฟิลด์ 'message' ใหม่
const apiData = ref({ message: '', git: {}, docker: {} }); 
const loading = ref(true);

const fetchData = async () => {
  loading.value = true;
  try {
    // ใช้ VITE_API_URL จากไฟล์ .env หรือ Environment Variable
    //const response = await axios.get(import.meta.env.VITE_API_URL + '/api/demo');
    const response = await axios.get(process.env.VITE_API_URL + '/api/demo');
    apiData.value = response.data;
  } catch (error) {
    console.error('API Error:', error);
    // เพิ่มการจัดการข้อผิดพลาดกรณีเรียก API ไม่สำเร็จ
    apiData.value = { 
        message: 'เกิดข้อผิดพลาดในการเรียก API (โปรดตรวจสอบว่า Backend ทำงานอยู่)', 
        student: {},
        git: { detail: 'ไม่สามารถโหลดข้อมูล' }, 
        docker: { detail: 'ไม่สามารถโหลดข้อมูล' } 
    };
  } finally {
    loading.value = false;
  }
};
  onMounted(fetchData); // เรียก API เมื่อ component ถูก mount
</script>
