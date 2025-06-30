<template>
  <div class="p-8 relative">
    <!-- Employee Directory Content -->
    <div :class="{ 'pointer-events-none select-none': selectedEmployee }">
      <div class="flex items-center justify-end mb-4">
        <input
          v-model="search"
          type="text"
          placeholder="Enter employee name"
          class="border border-gray-300 rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <h2 class="text-2xl font-bold mb-4">Employee Directory</h2>
      <table class="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th class="px-4 py-2 border-b">Photo</th>
            <th class="px-4 py-2 border-b">ID</th>
            <th class="px-4 py-2 border-b">Name</th>
            <th class="px-4 py-2 border-b">Position</th>
            <th class="px-4 py-2 border-b">Department</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="emp in filteredEmployees"
            :key="emp.employeeId"
            @click="showEmployee(emp)"
            class="cursor-pointer hover:bg-gray-100"
          >
            <td class="px-4 py-2 border-b">
              <img
                v-if="emp.photo"
                :src="emp.photo"
                alt="Employee Photo"
                class="w-12 h-12 rounded-full object-cover"
              />
              <img
                v-else-if="emp.name === 'Sibongile Nkosi'"
                src="@/assets/Sibongile Nkosi.jpg"
                alt="Sibongile Nkosi"
                class="w-12 h-12 rounded-full object-cover"
              />
              <img
                v-else-if="emp.name === 'Lungile Moyo'"
                src="@/assets/Lungile Moyo.jpg"
                alt="Lungile Moyo"
                class="w-12 h-12 rounded-full object-cover"
              />
              <img
                v-else-if="emp.name === 'Thabo Molefe'"
                src="@/assets/Thabo Molefe.jpg"
                alt="Another Name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <img
                v-else-if="emp.name === 'Keshav Naidoo'"
                src="@/assets/Keshav Naidoo.jpg"
                alt="Another Name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <img
                v-else-if="emp.name === 'Zanele Khumalo'"
                src="@/assets/Zanele Khumalo.jpg"
                alt="Another Name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <img
                v-else-if="emp.name === 'Sipho Zulu'"
                src="@/assets/Sipho Zulu.jpg"
                alt="Another Name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <img
                v-else-if="emp.name === 'Naledi Moeketsi'"
                src="@/assets/Naledi Moeketsi.jpg"
                alt="Another Name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <img
                v-else-if="emp.name === 'Farai Gumbo'"
                src="@/assets/Farai Gumbo.jpg"
                alt="Another Name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <img
                v-else-if="emp.name === 'Karabo Dlamini'"
                src="@/assets/Karabo Dlamini.jpg"
                alt="Another Name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <img
                v-else-if="emp.name === 'Fatima Patel'"
                src="@/assets/Fatima Patel.jpg"
                alt="Another Name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <span
                v-else
                class="inline-block w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center"
              >
                <!-- fallback avatar -->
              </span>
            </td>
            <td class="px-4 py-2 border-b">{{ emp.employeeId }}</td>
            <td class="px-4 py-2 border-b">{{ emp.name }}</td>
            <td class="px-4 py-2 border-b">{{ emp.position }}</td>
            <td class="px-4 py-2 border-b">{{ emp.department }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="loading" class="mt-4 text-gray-500">Loading...</div>
      <div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
    </div>

    <!-- Modal Overlay -->
    <transition name="modal-zoom-fade">
      <div
        v-if="selectedEmployee"
        class="fixed inset-0 z-50 flex items-center justify-center"
        style="background: rgba(0,0,0,0.4);"
        @click.self="selectedEmployee = null"
      >
        <div class="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 relative">
          <button
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            @click="selectedEmployee = null"
            aria-label="Close"
          >
            &times;
          </button>
          <!-- Employee photo above name -->
          <div class="flex flex-col items-center mb-4">
            <img
              v-if="selectedEmployee.name === 'Sibongile Nkosi'"
              src="@/assets/Sibongile Nkosi.jpg"
              alt="Sibongile Nkosi"
              class="w-20 h-20 rounded-full object-cover mb-2"
            />
            <img
              v-else-if="selectedEmployee.name === 'Lungile Moyo'"
              src="@/assets/Lungile Moyo.jpg"
              alt="Lungile Moyo"
              class="w-20 h-20 rounded-full object-cover mb-2"
            />
            <img
              v-else-if="selectedEmployee.name === 'Thabo Molefe'"
              src="@/assets/Thabo Molefe.jpg"
              alt="Thabo Molefe"
              class="w-20 h-20 rounded-full object-cover mb-2"
            />
            <img
              v-else-if="selectedEmployee.name === 'Keshav Naidoo'"
              src="@/assets/Keshav Naidoo.jpg"
              alt="Keshav Naidoo"
              class="w-20 h-20 rounded-full object-cover mb-2"
            />
            <img
              v-else-if="selectedEmployee.name === 'Zanele Khumalo'"
              src="@/assets/Zanele Khumalo.jpg"
              alt="Zanele Khumalo"
              class="w-20 h-20 rounded-full object-cover mb-2"
            />
            <img
              v-else-if="selectedEmployee.name === 'Sipho Zulu'"
              src="@/assets/Sipho Zulu.jpg"
              alt="Sipho Zulu"
              class="w-20 h-20 rounded-full object-cover mb-2"
            />
            <img
              v-else-if="selectedEmployee.name === 'Naledi Moeketsi'"
              src="@/assets/Naledi Moeketsi.jpg"
              alt="Naledi Moeketsi"
              class="w-20 h-20 rounded-full object-cover mb-2"
            />
            <img
              v-else-if="selectedEmployee.name === 'Farai Gumbo'"
              src="@/assets/Farai Gumbo.jpg"
              alt="Farai Gumbo"
              class="w-20 h-20 rounded-full object-cover mb-2"
            />
            <img
              v-else-if="selectedEmployee.name === 'Karabo Dlamini'"
              src="@/assets/Karabo Dlamini.jpg"
              alt="Karabo Dlamini"
              class="w-20 h-20 rounded-full object-cover mb-2"
            />
            <img
              v-else-if="selectedEmployee.name === 'Fatima Patel'"
              src="@/assets/Fatima Patel.jpg"
              alt="Fatima Patel"
              class="w-20 h-20 rounded-full object-cover mb-2"
            />
            <span
              v-else
              class="inline-block w-20 h-20 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-2"
            >
              <!-- fallback avatar -->
            </span>
            <h2 class="text-2xl font-bold">{{ selectedEmployee.name }}</h2>
          </div>
          <table class="mb-4 w-full">
            <tbody>
              <tr>
                <td class="font-semibold pr-2">ID:</td>
                <td>{{ selectedEmployee.employeeId }}</td>
              </tr>
              <tr>
                <td class="font-semibold pr-2">Name:</td>
                <td>{{ selectedEmployee.name }}</td>
              </tr>
              <tr>
                <td class="font-semibold pr-2">Position:</td>
                <td>{{ selectedEmployee.position }}</td>
              </tr>
              <tr>
                <td class="font-semibold pr-2">Department:</td>
                <td>{{ selectedEmployee.department }}</td>
              </tr>
              <tr>
                <td class="font-semibold pr-2">Salary:</td>
                <td>{{ selectedEmployee.salary }}</td>
              </tr>
              <tr>
                <td class="font-semibold pr-2">Employment History:</td>
                <td>
                  <span
                    v-if="
                      selectedEmployee.employmentHistory &&
                      typeof selectedEmployee.employmentHistory === 'string'
                    "
                  >
                    {{ selectedEmployee.employmentHistory }}
                  </span>
                  <span v-else>-</span>
                </td>
              </tr>
              <tr>
                <td class="font-semibold pr-2">Contact:</td>
                <td>{{ selectedEmployee.contact }}</td>
              </tr>
            </tbody>
          </table>
          <button
            class="w-full py-2 rounded text-white mt-4"
            @click="selectedEmployee = null"
            id="close"
          >
            Close
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
    data() {
        return {
            employees: [],
            loading: true,
            error: null,
            selectedEmployee: null,
            search: "",
        };
    },
    computed: {
        filteredEmployees() {
            if (!this.search) return this.employees;
            return this.employees.filter(emp =>
                emp.name.toLowerCase().includes(this.search.toLowerCase())
            );
        },
    },
    methods: {
        showEmployee(emp) {
            this.selectedEmployee = emp;
        },
    },
    mounted() {
        fetch("https://zakariad007.github.io/employee/employee_info.json")
            .then(res => res.json())
            .then((data) => {
                this.employees = data.employeeInformation || [];
                this.loading = false;
            })
            .catch(() => {
                this.error = "Failed to load employee data.";
                this.loading = false;
            });
    },
};
</script>

<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    text-align: left;
    padding: 8px;
}

th {
    background-color: #f2f2f2;
}

tr:hover {
    background-color: #f5f5f5;
}

button {
    cursor: pointer;
}

/* Modal transition: scale and fade */
.modal-zoom-fade-enter-active,
.modal-zoom-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1);
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
#close{
  background-color: #f08331;
}
#close:hover{
  background-color: #e76e37;
}

/* Media Queries */
@media (max-width: 1024px) {
  .p-8 {
    padding: 1.5rem !important;
  }
  table {
    font-size: 0.95rem;
  }
  .w-64 {
    width: 100% !important;
    min-width: 0 !important;
  }
  .max-w-lg {
    max-width: 90vw !important;
  }
}

/* Hide less important columns on tablets */
@media (max-width: 900px) {
  th:nth-child(4), td:nth-child(4), /* Position */
  th:nth-child(5), td:nth-child(5)  /* Department */ {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .p-8 {
    padding: 1rem !important;
  }
  h2.text-2xl {
    font-size: 1.25rem !important;
  }
  table, th, td {
    font-size: 0.9rem !important;
  }
  .w-12, .h-12 {
    width: 2.5rem !important;
    height: 2.5rem !important;
  }
  .w-20, .h-20 {
    width: 3.5rem !important;
    height: 3.5rem !important;
  }
  .max-w-lg {
    max-width: 98vw !important;
    padding: 0.5rem !important;
  }
}

/* Hide even more columns on mobile */
@media (max-width: 640px) {
  .p-8 {
    padding: 0.5rem !important;
  }
  .flex.items-center.justify-end.mb-4 {
    flex-direction: column !important;
    align-items: stretch !important;
    margin-bottom: 1rem !important;
  }
  .w-64 {
    width: 100% !important;
    min-width: 0 !important;
  }
  table, th, td {
    font-size: 0.85rem !important;
    padding: 4px !important;
  }
  th, td {
    white-space: normal !important;
    word-break: break-word !important;
  }
  .max-w-lg {
    max-width: 100vw !important;
    padding: 0.25rem !important;
  }
  .rounded, .rounded-2xl {
    border-radius: 0.5rem !important;
  }
  h2.text-2xl {
    font-size: 1rem !important;
    text-align: center !important;
  }
  /* Hide ID and Department columns on small screens */
  th:nth-child(2), td:nth-child(2), /* ID */
  th:nth-child(5), td:nth-child(5)  /* Department */ {
    display: none !important;
  }
}

/* On very small screens, only show Photo and Name */
@media (max-width: 480px) {
  table {
    display: block;
    overflow-x: auto;
    width: 100%;
  }
  thead, tbody, tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
  /* Hide all except Photo and Name */
  th:nth-child(2), td:nth-child(2), /* ID */
  th:nth-child(4), td:nth-child(4), /* Position */
  th:nth-child(5), td:nth-child(5)  /* Department */ {
    display: none !important;
  }
}

/* Modal */
@media (max-width: 640px) {
  .max-w-lg {
    max-width: 98vw !important;
    min-width: 0 !important;
    padding: 0.5rem !important;
  }
  .bg-white.p-8 {
    padding: 1rem !important;
  }
  .flex.flex-col.items-center.mb-4 {
    flex-direction: column !important;
    align-items: center !important;
    margin-bottom: 1rem !important;
  }
  .w-20, .h-20 {
    width: 3.5rem !important;
    height: 3.5rem !important;
  }
  .text-2xl.font-bold {
    font-size: 1.1rem !important;
    text-align: center !important;
    margin-top: 0.5rem !important;
  }
  .mb-4.w-full {
    margin-bottom: 0.5rem !important;
  }
  table.mb-4.w-full td,
  table.mb-4.w-full tr {
    display: block !important;
    width: 100% !important;
    box-sizing: border-box !important;
    padding: 4px 0 !important;
  }
  table.mb-4.w-full tr {
    margin-bottom: 0.5rem !important;
    border-bottom: 1px solid #eee !important;
  }
  table.mb-4.w-full td:first-child {
    font-weight: bold !important;
    width: 40% !important;
    display: inline-block !important;
  }
  table.mb-4.w-full td:last-child {
    width: 60% !important;
    display: inline-block !important;
    text-align: right !important;
  }
  #close {
    font-size: 1rem !important;
    padding: 0.5rem 0 !important;
  }
}

/* Extra small screens */
@media (max-width: 400px) {
  .max-w-lg {
    max-width: 100vw !important;
    padding: 0.25rem !important;
  }
  .bg-white.p-8 {
    padding: 0.5rem !important;
  }
  .w-20, .h-20 {
    width: 2.5rem !important;
    height: 2.5rem !important;
  }
  .text-2xl.font-bold {
    font-size: 1rem !important;
  }
}
</style>