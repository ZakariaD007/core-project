<template>
  <div>
    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th>Employee</th>
            <th v-for="date in uniqueDates" :key="date" class="text-center">
              {{ formatDate(date) }}
            </th>
            <th class="text-center">Leave Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in attendanceData" :key="employee.employeeId">
            <td class="fw-medium">{{ employee.name }}</td>
            <template v-for="date in uniqueDates" :key="date">
              <td class="text-center">
                <span 
                  class="badge"
                  :class="statusBadgeClass(employee, date)"
                  style="font-size: 1.1em;"
                >
                  <span v-if="getStatus(employee, date) === 'Present'" style="color: #198754; font-weight: bold; font-size: 1.4em; line-height: 1;">✓</span>
                  <span v-else-if="getStatus(employee, date) === 'Absent'" style="color: #dc3545; font-weight: bold; font-size: 1.4em; line-height: 1;">✗</span>
                  <span v-else></span>
                </span>
              </td>
            </template>
            <!-- Leave Status column: show status for the first date with a leave request, or blank -->
            <td class="text-center">
              <span
                v-if="getOverallLeaveStatus(employee)"
                class="badge"
                :class="leaveStatusBadgeClass(getOverallLeaveStatus(employee))"
                style="font-size: 0.95em;"
              >
                {{ capitalize(getOverallLeaveStatus(employee)) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import attendanceData from '@/data/attendance.json';

export default {
  name: 'AttendanceComp',
  data() {
    return {
      attendanceData: attendanceData.attendanceAndLeave
    }
  },
  computed: {
    uniqueDates() {
      const dates = new Set();
      this.attendanceData.forEach(employee => {
        employee.attendance.forEach(record => {
          dates.add(record.date);
        });
      });
      return Array.from(dates).sort();
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short' 
      });
    },
    getStatus(employee, date) {
      const record = employee.attendance.find(a => a.date === date);
      return record ? record.status : '';
    },
    getLeaveStatus(employee, date) {
      if (!employee.leaveRequests) return '';
      const leave = employee.leaveRequests.find(l => l.date === date);
      return leave ? leave.status : '';
    },
    getOverallLeaveStatus(employee) {
      // Show the status of the first leave request, or blank if none
      if (employee.leaveRequests && employee.leaveRequests.length > 0) {
        return employee.leaveRequests[0].status;
      }
      return '';
    },
    getStatusSymbol(employee, date) {
      const status = this.getStatus(employee, date);
      return status === 'Present' ? '✓' : status === 'Absent' ? '✗' : '';
    },
    statusBadgeClass(employee, date) {
      const status = this.getStatus(employee, date);
      return {
        'bg-primary bg-opacity-10 text-primary': status === 'Present',
        'bg-secondary bg-opacity-10 text-secondary': status === 'Absent',
        'bg-light text-muted': !status
      };
    },
    leaveStatusBadgeClass(status) {
      const s = status ? status.toLowerCase() : '';
      return {
        'bg-warning text-dark': s === 'pending',
        'bg-success': s === 'approved',
        'bg-danger': s === 'denied'
      };
    },
    capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
}

.card-header {
  border-radius: 0.5rem 0.5rem 0 0 !important;
}

.table {
  font-size: 0.9rem;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  color: #6c757d;
}

.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
  border-radius: 0.25rem;
}

.bg-primary {
  background-color: #2f7df4 !important;
}

.bg-secondary {
  background-color: #101112 !important;
}

.bg-primary.bg-opacity-10 {
  background-color: rgba(49, 72, 105, 0.1) !important;
}

.bg-secondary.bg-opacity-10 {
  background-color: rgba(108, 117, 125, 0.1) !important;
}

.text-primary {
  color: #0d6efd !important;
}

.text-secondary {
  color: #6c757d !important;
}

.attendance-header {
  background-color: #39BBC8 !important;
}
</style>