<template>
  <div class="py-8 px-2 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-2 text-left sm:text-4xl sm:mb-4">Dashboard</h1>
    <h2 class="text-xl font-semibold text-gray-700 mb-6 text-left sm:text-2xl">{{ greeting }}</h2>

    <!-- Cards Row -->
    <div class="flex flex-wrap gap-4 justify-center mb-8">
      <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center w-60 min-w-[140px] flex-1 max-w-xs">
        <div class="text-base font-medium mb-1" style="color:#2b80ff;">Total Employees</div>
        <div class="text-2xl font-bold" style="color:#2b80ff;">{{ totalEmployees }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center w-60 min-w-[140px] flex-1 max-w-xs">
        <div class="text-base font-medium mb-1" style="color:#22c55e;">Present</div>
        <div class="text-2xl font-bold" style="color:#22c55e;">{{ totalPresent }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center w-60 min-w-[140px] flex-1 max-w-xs">
        <div class="text-base font-medium mb-1" style="color:#ef4444;">Absent</div>
        <div class="text-2xl font-bold" style="color:#ef4444;">{{ totalAbsent }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center w-60 min-w-[140px] flex-1 max-w-xs">
        <div class="text-base font-medium mb-1" style="color:#f59e42;">Pending</div>
        <div class="text-2xl font-bold" style="color:#f59e42;">{{ totalPending }}</div>
      </div>
    </div>
    <!-- Denied Card -->
    <div class="flex w-full justify-center mb-2">
      <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center w-60 min-w-[140px] max-w-xs">
        <div class="text-base font-medium mb-1" style="color:#ef4444;">Denied</div>
        <div class="text-2xl font-bold" style="color:#ef4444;">{{ totalDenied }}</div>
      </div>
    </div>

    <div class="flex w-full justify-center mb-6">
      <div class="font-bold text-gray-700 text-lg">This month</div>
    </div>

    <!-- Filter -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
      <div class="sr-only font-bold text-gray-700 text-lg">This month</div>
      <select v-model="selectedDepartment" class="border px-3 py-2 rounded shadow-sm w-full sm:w-auto">
        <option value="">All Departments</option>
        <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
      </select>
    </div>

    <!-- Charts -->
    <div v-if="!loading && filteredEmployees.length" class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-7">
      <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <h2 class="text-lg font-medium mb-2">Employees per Department</h2>
        <canvas ref="deptBar" width="250" height="200"></canvas>
      </div>
      <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <h2 class="text-lg font-medium mb-2">Salary Range Distribution</h2>
        <canvas ref="salaryBar" width="250" height="200"></canvas>
      </div>
      <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center">
        <h2 class="text-lg font-medium mb-2">Employees Joined Per Year</h2>
        <canvas ref="historyBar" width="250" height="200"></canvas>
      </div>
    </div>

    <!-- Hours Worked Line Chart -->
    <div class="relative mt-8 bg-white rounded-lg shadow p-4 flex flex-col items-center w-full max-w-2xl mx-auto">
      <div class="bbi-dbrd-control-background absolute inset-0 bg-gray-100 opacity-50 rounded-lg z-0"></div>
      <h2 class="text-lg font-medium mb-2 z-10 relative">Total Hours Worked</h2>
      <canvas ref="hoursLine" width="600" height="250" class="z-10 relative w-full max-w-full"></canvas>
    </div>

    <!-- States -->
    <div v-if="loading" class="text-gray-500 mt-6 text-center">Loading...</div>
    <div v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</div>
    <div v-if="!loading && !filteredEmployees.length" class="text-gray-500 mt-6 text-center">No data to display.</div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "EmployeeDashboard",
  props: {
    sidebarCollapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      employees: [],
      loading: true,
      error: null,
      deptBar: null,
      salaryBar: null,
      historyBar: null,
      hoursLine: null,
      search: "",
      selectedDepartment: "",
      payrollData: [],
      attendanceData: [],
      totalEmployees: 0,
      totalPresent: 0,
      totalAbsent: 0,
      totalPending: 0,
      totalDenied: 0,
      greeting: ""
    };
  },
  computed: {
    departments() {
      const depts = this.employees.map(e => e.department).filter(Boolean);
      return [...new Set(depts)];
    },
    filteredEmployees() {
      return this.employees.filter(emp => {
        return this.selectedDepartment ? emp.department === this.selectedDepartment : true;
      });
    }
  },
  watch: {
    filteredEmployees() {
      this.$nextTick(() => {
        const deptBar = this.$refs.deptBar;
        const salaryBar = this.$refs.salaryBar;
        const historyBar = this.$refs.historyBar;
        const hoursLine = this.$refs.hoursLine;
        if (
          deptBar instanceof HTMLCanvasElement &&
          salaryBar instanceof HTMLCanvasElement &&
          historyBar instanceof HTMLCanvasElement &&
          hoursLine instanceof HTMLCanvasElement &&
          this.filteredEmployees.length
        ) {
          if (this.deptBar) { this.deptBar.destroy(); this.deptBar = null; }
          if (this.salaryBar) { this.salaryBar.destroy(); this.salaryBar = null; }
          if (this.historyBar) { this.historyBar.destroy(); this.historyBar = null; }
          if (this.hoursLine) { this.hoursLine.destroy(); this.hoursLine = null; }
          this.renderCharts();
          this.renderHoursLine();
        } else {
          if (this.deptBar) { this.deptBar.destroy(); this.deptBar = null; }
          if (this.salaryBar) { this.salaryBar.destroy(); this.salaryBar = null; }
          if (this.historyBar) { this.historyBar.destroy(); this.historyBar = null; }
          if (this.hoursLine) { this.hoursLine.destroy(); this.hoursLine = null; }
        }
      });
    }
  },
  mounted() {
    fetch("https://zakariad007.github.io/employee/employee_info.json")
      .then(res => res.json())
      .then(data => {
        this.employees = data.employeeInformation;
        this.loading = false;
        return fetch("https://zakariad007.github.io/payroll/payroll_data.json");
      })
      .then(res => res.json())
      .then(payroll => {
        this.payrollData = payroll.payrollData || [];
        this.$nextTick(() => {
          if (this.$refs.hoursLine) {
            this.renderHoursLine();
          }
        });
      })
      .catch(() => {
        this.error = "Failed to load employee or payroll data.";
        this.loading = false;
      });
    fetch("https://zakariad007.github.io/attendance/attendance.json")
      .then(res => res.json())
      .then(data => {
        this.attendanceData = data.attendanceAndLeave || [];
        this.calculateAttendanceStats();
      });
  },
  created() {
    this.greeting = this.getGreeting();
  },
  methods: {
    renderCharts() {
      if (!this.filteredEmployees.length) return;
      const deptCounts = {};
      this.filteredEmployees.forEach(emp => {
        if (emp.department) {
          deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
        }
      });
      const deptCtx = this.$refs.deptBar;
      if (deptCtx && Object.keys(deptCounts).length) {
        this.deptBar = new Chart(deptCtx, {
          type: 'bar',
          data: {
            labels: Object.keys(deptCounts),
            datasets: [{
              label: 'Employees',
              data: Object.values(deptCounts),
              backgroundColor: '#60a5fa',
              borderColor: '#2563eb',
              borderWidth: 2,
              borderRadius: 6,
              barPercentage: 0.7,
              categoryPercentage: 0.7
            }]
          },
          options: {
            responsive: false,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                font: { size: 16, weight: 'bold' }
              }
            },
            scales: {
              y: { beginAtZero: true, precision: 0 }
            }
          }
        });
      }
      const salaryRanges = {
        '50k-59k': 0,
        '60k-69k': 0,
        '70k-79k': 0,
        '80k+': 0
      };
      this.filteredEmployees.forEach(emp => {
        if (emp.salary < 60000) salaryRanges['50k-59k']++;
        else if (emp.salary < 70000) salaryRanges['60k-69k']++;
        else if (emp.salary < 80000) salaryRanges['70k-79k']++;
        else salaryRanges['80k+']++;
      });
      const salaryCtx = this.$refs.salaryBar;
      if (salaryCtx && Object.values(salaryRanges).some(v => v > 0)) {
        this.salaryBar = new Chart(salaryCtx, {
          type: 'bar',
          data: {
            labels: Object.keys(salaryRanges),
            datasets: [{
              label: 'Employees',
              data: Object.values(salaryRanges),
              backgroundColor: '#34d399',
              borderColor: '#059669',
              borderWidth: 2,
              borderRadius: 6,
              barPercentage: 0.7,
              categoryPercentage: 0.7
            }]
          },
          options: {
            responsive: false,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                font: { size: 16, weight: 'bold' }
              }
            },
            scales: {
              y: { beginAtZero: true, precision: 0 }
            }
          }
        });
      }
      const yearCounts = {};
      this.filteredEmployees.forEach(emp => {
        const match = emp.employmentHistory && emp.employmentHistory.match(/Joined in (\d{4})/);
        if (match) {
          const year = match[1];
          yearCounts[year] = (yearCounts[year] || 0) + 1;
        }
      });
      const historyCtx = this.$refs.historyBar;
      if (historyCtx && Object.keys(yearCounts).length) {
        this.historyBar = new Chart(historyCtx, {
          type: 'bar',
          data: {
            labels: Object.keys(yearCounts),
            datasets: [{
              label: 'Employees Joined',
              data: Object.values(yearCounts),
              backgroundColor: '#f59e42',
              borderColor: '#b45309',
              borderWidth: 2,
              borderRadius: 6,
              barPercentage: 0.7,
              categoryPercentage: 0.7
            }]
          },
          options: {
            responsive: false,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                font: { size: 16, weight: 'bold' }
              }
            },
            scales: {
              y: { beginAtZero: true, precision: 0 }
            }
          }
        });
      }
    },
    renderHoursLine() {
      if (this.hoursLine) { this.hoursLine.destroy(); this.hoursLine = null; }
      const ctx = this.$refs.hoursLine;
      if (!ctx || !this.payrollData.length) return;

      const displayMonths = [
        { key: "2025-06-01", label: "Week 1" },
        { key: "2025-06-08", label: "Week 2" },
        { key: "2025-06-15", label: "Week 3" },
        { key: "2025-06-22", label: "Week 4" },
        { key: "2025-06-29", label: "Week 5" }
      ];
      const totalHours = Number(
        this.payrollData.reduce(
          (sum, entry) => sum + (typeof entry.hoursWorked === "number" ? entry.hoursWorked : 0),
          0
        )
      );
      const monthHours = [1640, 1358,1254 ,1516, totalHours || 0];
      const monthLabels = displayMonths.map(m => m.label);

      this.hoursLine = new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthLabels,
          datasets: [{
            label: 'Total Hours Worked',
            data: monthHours,
            fill: true,
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99,102,241,0.1)',
            tension: 0.4,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#fff',
            pointRadius: 4
          }]
        },
        options: {
          responsive: false,
          plugins: {
            legend: { display: true },
            title: {
              display: true,
              font: { size: 16, weight: 'bold' }
            }
          },
          scales: {
            x: {
              title: { display: true, text: 'Weeks' }
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Hours Worked' }
            }
          }
        }
      });
    },
    calculateAttendanceStats() {
      this.totalEmployees = this.attendanceData.length;
      const allAttendance = this.attendanceData.flatMap(emp => emp.attendance || []);
      this.totalPresent = allAttendance.filter(
        a => a.status && a.status.trim().toLowerCase() === "present"
      ).length;
      this.totalAbsent = allAttendance.filter(
        a => a.status && a.status.trim().toLowerCase() === "absent"
      ).length;
      const allLeaveRequests = this.attendanceData.flatMap(emp => emp.leaveRequests || []);
      this.totalPending = allLeaveRequests.filter(
        l => l.status && l.status.trim().toLowerCase() === "pending"
      ).length;
      this.totalDenied = allLeaveRequests.filter(
        l => l.status && l.status.trim().toLowerCase() === "denied"
      ).length;
    },
    getGreeting() {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 18) return "Good afternoon";
      return "Good evening";
    }
  }
}
</script>

<style scoped>
.bbi-dbrd-control-background {
  pointer-events: none;
}

/* Card hover effect */
.bg-white.rounded-lg.shadow.p-4:hover {
  box-shadow: 0 8px 32px 0 rgba(60, 60, 120, 0.18), 0 1.5px 6px 0 rgba(60, 60, 120, 0.10);
  transform: translateY(-4px) scale(1.03);
  transition: box-shadow 0.2s, transform 0.2s;
}

/* Media Queries */
@media (max-width: 1024px) {
  .w-60 { width: 12rem !important; }
  .max-w-2xl { max-width: 100% !important; }
  .grid-cols-3 { grid-template-columns: 1fr 1fr !important; }
}
@media (max-width: 640px) {
  .w-60 { width: 100% !important; min-width: 0 !important; }
  .max-w-2xl { max-width: 100% !important; }
  .grid-cols-3 { grid-template-columns: 1fr !important; }
  .py-8, .px-2, .sm\:px-6, .md\:px-10, .lg\:px-16 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
  h1, h2 { text-align: center !important; margin-left: 0 !important; }
}
</style>