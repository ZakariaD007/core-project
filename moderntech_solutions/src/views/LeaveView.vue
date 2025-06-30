<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <div class="flex justify-center">
      <div class="w-full lg:w-10/12">
        <div class="bg-white shadow-md rounded-lg">
          <div
            id="header"
            class="rounded-t-lg bg-[#39BBC8] text-white px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row justify-between items-center"
          >
            <h2 class="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">Leave Request Form</h2>
            <button
              class="btn-refresh flex items-center space-x-2 text-white bg-teal-400 hover:bg-teal-500 px-3 py-1 rounded text-sm sm:text-base"
              @click="refreshLeaves"
              id="submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582M20 20v-5h-.581M5.586 19A9 9 0 1119 5.586"
                />
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          <div class="p-4 sm:p-6">
            <form @submit.prevent="submitForm" class="space-y-4 sm:space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <button
                  type="button"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 flex justify-between items-center text-left text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  @click="showEmployeeSelect = !showEmployeeSelect"
                  :aria-expanded="showEmployeeSelect.toString()"
                  aria-controls="employeeSelectCollapse"
                >
                  <span>{{ form.name || 'Select your name' }}</span>
                  <svg
                    :class="showEmployeeSelect ? 'rotate-180' : ''"
                    class="h-5 w-5 text-gray-500 transition-transform duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <transition name="fade">
                  <select
                    v-show="showEmployeeSelect"
                    id="employeeSelectCollapse"
                    v-model="form.name"
                    @change="showEmployeeSelect = false"
                    required
                    class="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    <option value="" disabled>Select your name</option>
                    <option
                      v-for="emp in employees"
                      :key="emp.employeeId"
                      :value="emp.name"
                    >
                      {{ emp.name }}
                    </option>
                  </select>
                </transition>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <select
                  v-model="form.leaveType"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  <option value="" disabled>Select type</option>
                  <option value="sick">Sick Leave</option>
                  <option value="vacation">Vacation</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div v-if="form.leaveType === 'other'">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Other Reason
                </label>
                <input
                  v-model="form.otherReason"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div v-else>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  v-model="form.reason"
                  type="text"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    v-model="form.startDate"
                    type="date"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    v-model="form.endDate"
                    type="date"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                :disabled="isSubmitting"
                class="inline-flex items-center justify-center bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-semibold rounded-md px-4 py-2"
                id="submit"
              >
                <svg
                  v-if="isSubmitting"
                  class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4 4v5h.582M20 20v-5h-.581M5.586 19A9 9 0 1119 5.586"
                  />
                </svg>
                Submit Request
              </button>
            </form>

            <hr class="my-4 sm:my-6" />

            <div v-if="isLoading" class="text-center py-8">
              <svg
                class="animate-spin mx-auto h-8 w-8 text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582M20 20v-5h-.581M5.586 19A9 9 0 1119 5.586"
                />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>

            <div v-else-if="leaves.length === 0" class="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded relative text-sm sm:text-base" role="alert">
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 mr-2 text-blue-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8 4a1 1 0 100-2 1 1 0 000 2zm.707-6.707a1 1 0 10-1.414-1.414L9 7.586 7.707 6.293a1 1 0 00-1.414 1.414L7.586 9l-1.293 1.293a1 1 0 001.414 1.414L9 10.414l1.293 1.293a1 1 0 001.414-1.414L10.414 9l1.293-1.293z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>No leave requests found. Submit a request using the form.</span>
              </div>
            </div>

            <div v-else class="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3 sm:text-sm"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3 sm:text-sm"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell sm:px-4 sm:py-3 sm:text-sm"
                    >
                      Reason
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3 sm:text-sm"
                    >
                      Dates
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell sm:px-4 sm:py-3 sm:text-sm"
                    >
                      Days
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3 sm:text-sm"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell sm:px-4 sm:py-3 sm:text-sm"
                    >
                      Submitted
                    </th>
                    <th
                      scope="col"
                      class="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3 sm:text-sm"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="leave in leaves"
                    :key="leave.id"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-2 py-2 text-xs text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                      {{ leave.name }}
                    </td>
                    <td class="px-2 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm">
                      <span
                        :class="['inline-flex items-center px-1 py-0.5 rounded text-xs font-medium', statusBadgeClass(leave.status)]"
                      >
                        {{ leaveTypeLabel(leave.leaveType) }}
                      </span>
                    </td>
                    <td class="px-2 py-2 text-xs text-gray-600 hidden md:table-cell sm:px-4 sm:py-3 sm:text-sm">
                      <span v-if="leave.leaveType === 'other'">
                        {{ leave.otherReason }}
                      </span>
                      <span v-else-if="leave.reason" class="block">
                        {{ leave.reason }}
                      </span>
                      <span v-else class="text-gray-400 italic">
                        No additional details
                      </span>
                    </td>
                    <td class="px-2 py-2 text-xs text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                      {{ formatDate(leave.startDate) }}
                      <br class="sm:hidden" />
                      <span class="text-xs text-gray-400">to</span>
                      <br class="sm:hidden" />
                      {{ formatDate(leave.endDate) }}
                    </td>
                    <td class="px-2 py-2 text-center text-xs text-gray-700 hidden sm:table-cell sm:px-4 sm:py-3 sm:text-sm">
                      {{ countDays(leave.startDate, leave.endDate) }}
                    </td>
                    <td
                      class="px-2 py-2 text-center text-xs sm:px-4 sm:py-3 sm:text-sm"
                    >
                      <span
                        :class="['inline-flex items-center px-1 py-0.5 rounded text-xs font-medium', statusBadgeClass(leave.status)]"
                      >
                        {{ capitalize(leave.status) }}
                      </span>
                    </td>
                    <td class="px-2 py-2 text-xs text-gray-700 hidden lg:table-cell sm:px-4 sm:py-3 sm:text-sm">
                      <div class="flex flex-col">
                        <span>{{ formatDate(leave.submittedAt) }}</span>
                        <span class="text-xs text-gray-400">
                          {{ formatTime(leave.submittedAt) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-2 py-2 text-center text-xs text-gray-700 sm:px-4 sm:py-3 sm:text-sm">
                      <div class="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <div v-if="leave.status === 'pending'" class="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                          <button
                            class="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded inline-flex items-center justify-center w-full sm:w-auto"
                            @click="changeStatus(leave.id, 'approved')"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 mr-0 sm:mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span class="hidden sm:inline">Approve</span>
                            <span class="inline sm:hidden">Appr.</span>
                          </button>
                          <button
                            class="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded inline-flex items-center justify-center w-full sm:w-auto"
                            @click="changeStatus(leave.id, 'denied')"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 mr-0 sm:mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span class="hidden sm:inline">Deny</span>
                            <span class="inline sm:hidden">Deny</span>
                          </button>
                        </div>
                        <button
                          v-if="leave.status !== 'pending'"
                          class="border border-red-500 hover:bg-red-100 text-red-600 text-xs px-2 py-1 rounded inline-flex items-center justify-center w-full sm:w-auto ml-auto sm:ml-0"
                          @click="deleteLeave(leave.id)"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 mr-0 sm:mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M19 7L5 21M5 7l14 14"
                            />
                          </svg>
                          <span class="hidden sm:inline">Delete</span>
                          <span class="inline sm:hidden">Del</span>
                        </button>
                        <span
                          v-if="leave.status !== 'pending' && leave.status !== 'approved' && leave.status !== 'denied'"
                          class="text-gray-500 text-xs ml-2 hidden sm:inline"
                        >
                          {{ capitalize(leave.status) }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import attendanceData from '@/data/attendance.json';

export default {
  data() {
    return {
      leaves: [],
      isLoading: false,
      isSubmitting: false,
      employees: attendanceData.attendanceAndLeave,
      showEmployeeSelect: false,
      form: {
        name: '',
        leaveType: '',
        reason: '',
        otherReason: '',
        startDate: '',
        endDate: '',
      },
    };
  },
  created() {
    this.loadLeaves();
  },
  methods: {
    loadLeaves() {
      this.isLoading = true;
      setTimeout(() => {
        const stored = localStorage.getItem('leaves');
        this.leaves = stored
          ? JSON.parse(stored).sort(
              (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
            )
          : [];
        this.isLoading = false;
      }, 500);
    },
    refreshLeaves() {
      this.loadLeaves();
    },
    submitForm() {
      this.isSubmitting = true;
      setTimeout(() => {
        const newLeave = {
          ...this.form,
          id: Date.now(),
          status: 'pending',
          submittedAt: new Date().toISOString(),
        };
        const leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
        leaves.unshift(newLeave);
        localStorage.setItem('leaves', JSON.stringify(leaves));
        this.loadLeaves();
        this.isSubmitting = false;
        this.form = {
          name: '',
          leaveType: '',
          reason: '',
          otherReason: '',
          startDate: '',
          endDate: '',
        };
      }, 800);
    },
    changeStatus(id, status) {
      const leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
      const updated = leaves.map((leave) =>
        leave.id === id ? { ...leave, status } : leave
      );
      localStorage.setItem('leaves', JSON.stringify(updated));
      this.loadLeaves();
    },
    deleteLeave(id) {
      const leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
      const updated = leaves.filter((leave) => leave.id !== id);
      localStorage.setItem('leaves', JSON.stringify(updated));
      this.loadLeaves();
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    },
    formatTime(date) {
      if (!date) return '';
      return new Date(date).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    countDays(start, end) {
      if (!start || !end) return 0;
      const s = new Date(start);
      const e = new Date(end);
      return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    },
    leaveTypeLabel(type) {
      const labels = {
        sick: 'Sick Leave',
        vacation: 'Vacation',
        personal: 'Personal',
        other: 'Other',
      };
      return labels[type] || type;
    },
    statusBadgeClass(status) {
      const s = status ? status.toLowerCase() : '';
      return {
        'bg-yellow-400 text-yellow-900': s === 'pending',
        'bg-green-600 text-white': s === 'approved',
        'bg-red-600 text-white': s === 'denied',
      };
    },
    capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
#submit{
  cursor: pointer;
}
</style>
