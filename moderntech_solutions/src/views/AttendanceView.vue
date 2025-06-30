<template>
  <div class="max-w-7xl mx-auto p-4">

    <!-- Page Heading -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Employee Attendance Overview</h1>

    <!-- Attendance Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="employee in attendanceData"
        :key="employee.employeeId"
        class="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all"
        @click="openModal(employee)"
      >
        <h3 class="text-xl font-semibold text-gray-800">{{ employee.name }}</h3>
        <p class="text-gray-600">Employee ID: {{ employee.employeeId }}</p>
        <p class="mt-2">
          Latest Attendance:
          <span :class="getAttendanceClass(employee)">
            <span v-if="getAttendanceClass(employee) === 'text-green-500'" class="text-green-500">&#x2713; Present</span>
            <span v-if="getAttendanceClass(employee) === 'text-red-500'" class="text-red-500">&#x2717; Absent</span>
          </span>
        </p>
        <p class="mt-2">Latest Leave Request:
          <span :class="{
            'text-green-500': employee.leaveRequests[0]?.status === 'Approved',
            'text-yellow-500': employee.leaveRequests[0]?.status === 'Pending',
            'text-red-500': employee.leaveRequests[0]?.status === 'Denied'
          }">
            {{ employee.leaveRequests[0]?.status }}
          </span>
        </p>
      </div>
    </div>

    <!-- Modal -->
    <transition name="modal-zoom-fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl relative">

          <!-- Employee Photo -->
          <div class="flex flex-col items-center mb-4">
            <img v-if="modalData.name === 'Sibongile Nkosi'" src="@/assets/Sibongile Nkosi.jpg" alt="Sibongile Nkosi" class="w-20 h-20 rounded-full object-cover mb-2" />
            <img v-else-if="modalData.name === 'Lungile Moyo'" src="@/assets/Lungile Moyo.jpg" alt="Lungile Moyo" class="w-20 h-20 rounded-full object-cover mb-2" />
            <img v-else-if="modalData.name === 'Thabo Molefe'" src="@/assets/Thabo Molefe.jpg" alt="Thabo Molefe" class="w-20 h-20 rounded-full object-cover mb-2" />
            <img v-else-if="modalData.name === 'Keshav Naidoo'" src="@/assets/Keshav Naidoo.jpg" alt="Keshav Naidoo" class="w-20 h-20 rounded-full object-cover mb-2" />
            <img v-else-if="modalData.name === 'Zanele Khumalo'" src="@/assets/Zanele Khumalo.jpg" alt="Zanele Khumalo" class="w-20 h-20 rounded-full object-cover mb-2" />
            <img v-else-if="modalData.name === 'Sipho Zulu'" src="@/assets/Sipho Zulu.jpg" alt="Sipho Zulu" class="w-20 h-20 rounded-full object-cover mb-2" />
            <img v-else-if="modalData.name === 'Naledi Moeketsi'" src="@/assets/Naledi Moeketsi.jpg" alt="Naledi Moeketsi" class="w-20 h-20 rounded-full object-cover mb-2" />
            <img v-else-if="modalData.name === 'Farai Gumbo'" src="@/assets/Farai Gumbo.jpg" alt="Farai Gumbo" class="w-20 h-20 rounded-full object-cover mb-2" />
            <img v-else-if="modalData.name === 'Karabo Dlamini'" src="@/assets/Karabo Dlamini.jpg" alt="Karabo Dlamini" class="w-20 h-20 rounded-full object-cover mb-2" />
            <img v-else-if="modalData.name === 'Fatima Patel'" src="@/assets/Fatima Patel.jpg" alt="Fatima Patel" class="w-20 h-20 rounded-full object-cover mb-2" />
            <span v-else class="inline-block w-20 h-20 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-2">
              <!-- fallback avatar -->
            </span>
            <h2 class="text-xl font-semibold">{{ modalData.name }}</h2>
          </div>

          <!-- Attendance List -->
          <div class="mb-4">
            <h3 class="font-bold mb-2">Attendance Records:</h3>
            <ul>
              <li v-for="(attendance, index) in modalData.attendance" :key="index" class="mb-2">
                <span class="font-semibold">{{ attendance.date }}: </span>
                <span :class="attendance.status === 'Present' ? 'text-green-500' : 'text-red-500'">
                  {{ attendance.status === 'Present' ? '✔ Present' : '✘ Absent' }}
                </span>
              </li>
            </ul>
          </div>

          <!-- Leave Requests -->
          <div>
            <h3 class="font-bold mb-2">Leave Requests:</h3>
            <ul>
              <li
                v-for="(leave, index) in modalData.leaveRequests"
                :key="index"
                class="mb-2 p-2 border-b-2 border-gray-200 rounded-lg"
              >
                <div class="flex justify-between items-center">
                  <span class="font-semibold m-auto">{{ leave.date }} - {{ leave.reason }}</span>
                </div>
                <span :class="{
                  'text-green-500': leave.status === 'Approved',
                  'text-yellow-500': leave.status === 'Pending',
                  'text-red-500': leave.status === 'Denied'
                }" class="font-bold text-sm mt-1 block">
                  {{ leave.status }}
                </span>
              </li>
            </ul>
          </div>

          <button @click="closeModal" class=" text-white px-4 py-2 rounded-lg mt-4 w-full " id="btn">
            Close
          </button>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'AttendanceView',
  data() {
    return {
      attendanceData: [],
      showModal: false,
      modalData: {}
    };
  },
  mounted() {
    this.fetchAttendanceData();
  },
  methods: {
    async fetchAttendanceData() {
      try {
        const response = await fetch('https://zakariad007.github.io/attendance/attendance.json');
        const data = await response.json();
        this.attendanceData = data.attendanceAndLeave;
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    },
    getAttendanceClass(employee) {
      const latestAttendance = employee.attendance[0];
      return latestAttendance.status === 'Present' ? 'text-green-500' : 'text-red-500';
    },
    openModal(employee) {
      this.modalData = employee;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalData = {};
    }
  }
};
</script>

<style scoped>
.modal-zoom-fade-enter-active,
.modal-zoom-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-zoom-fade-enter-from,
.modal-zoom-fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
.modal-zoom-fade-enter-to,
.modal-zoom-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
#btn{
  background-color: #f08331;
}
#btn:hover{
  background-color: #e76e37;
  cursor: pointer;
}
</style>
