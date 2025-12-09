<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">
      Task List (Express + Prisma + Supabase)
    </div>

    <!-- ปุ่มโหลดและแสดงสถานะ/ข้อความ Error -->
    <div class="q-mb-md row items-center q-gutter-sm">
      <q-btn
        color="primary"
        label="Reload Tasks"
        :loading="loading"
        @click="fetchTasks"
        icon="refresh"
      />
      <span v-if="errorMessage" class="text-negative text-weight-bold">
        {{ errorMessage }}
      </span>
    </div>

    <q-spinner v-if="loading" color="primary" size="3em" />

    <div v-else>
      <div v-if="tasks.length === 0" class="text-h6 text-grey-7 q-py-lg">
        ยังไม่มีงานในระบบ ลองสร้างด้วย curl / Postman ก่อน
      </div>

      <!-- แสดงรายการ Task เป็น q-list -->
      <q-list v-else bordered separator>
        <!-- ใช้ q-item เพื่อแสดงแต่ละ Task -->
        <q-item v-for="task in tasks" :key="task.id" clickable v-ripple>
          <q-item-section>
            <q-item-label class="text-lg text-weight-medium text-primary">{{ task.title }}</q-item-label>
            <!-- task.description เป็น optional จึงใช้ ? เพื่อป้องกัน error ถ้าเป็น null -->
            <q-item-label caption v-if="task.description">
              {{ task.description }}
            </q-item-label>
            <q-item-label caption v-else class="text-grey-6">
              (ไม่มีคำอธิบาย)
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label caption class="text-right">
              <!-- แสดงวันที่สร้างในรูปแบบท้องถิ่น -->
              Created: {{ new Date(task.createdAt).toLocaleString() }}
            </q-item-label>
            <q-item-label caption class="text-right">
              Updated: {{ new Date(task.updatedAt).toLocaleString() }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useQuasar } from 'quasar';

// อ่านค่าจาก quasar.config → env.API_URL
// Quasar 2.x จะใช้ process.env ในโค้ด build ได้
const API_URL = process.env.API_URL || 'http://localhost:3000';

const $q = useQuasar(); // ใช้สำหรับแสดง Notification (optional, แต่ดีกว่า console.error)

const tasks = ref([]);
const loading = ref(false);
const errorMessage = ref('');

// ฟังก์ชันสำหรับดึงข้อมูล Task จาก Backend
const fetchTasks = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  // ให้ Quasar แสดง Loading Bar ด้านบน
  $q.loading.show({ message: 'กำลังโหลด Tasks...' });

  try {
    const res = await axios.get(API_URL + '/api/tasks');
    
    // ตรวจสอบโครงสร้าง response: Backend ส่ง { data: [...] }
    tasks.value = res.data.data; 

    $q.notify({
      type: 'positive',
      message: 'โหลด Tasks สำเร็จ',
      timeout: 1000,
    });

  } catch (err) {
    console.error('API /api/tasks error:', err);
    errorMessage.value = 'โหลดงานจากฐานข้อมูลไม่สำเร็จ กรุณาตรวจสอบ Backend และ Network';

    $q.notify({
      type: 'negative',
      message: errorMessage.value,
    });
  } finally {
    loading.value = false;
    $q.loading.hide();
  }
};

// ดึงข้อมูลทันทีที่ Component ถูก Mount
onMounted(fetchTasks);
</script>
