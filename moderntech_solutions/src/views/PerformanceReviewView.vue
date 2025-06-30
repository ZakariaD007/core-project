<template>
  <div class="p-4 sm:p-8">
    <div class="text-center mb-4 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-semibold">Performance Reviews</h1>
    </div>

    <div
      ref="tableContainer"
      class="overflow-x-auto mx-auto max-w-full lg:max-w-6xl rounded-lg shadow-md"
    >
      <table class="w-full table-auto border-collapse bg-white">
        <thead class="bg-teal-500 text-white">
          <tr>
            <th class="px-2 py-2 sm:px-4 sm:py-3 text-left text-sm sm:text-base w-1/12">#</th>
            <th class="px-2 py-2 sm:px-4 sm:py-3 text-left text-sm sm:text-base w-3/12">Employee Name</th>
            <th class="px-2 py-2 sm:px-2 sm:py-3 text-center text-sm sm:text-base w-2/12 whitespace-nowrap">Score</th>
            <th class="px-2 py-2 sm:px-6 sm:py-3 text-center text-sm sm:text-base w-6/12 hidden sm:table-cell">Performance Bar</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(employee, index) in employeeInformation"
            :key="employee.employeeId"
            class="border-b hover:bg-gray-100"
          >
            <td class="px-2 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base">{{ index + 1 }}</td>
            <td class="px-2 py-3 sm:px-4 sm:py-4 text-left text-sm sm:text-base whitespace-nowrap">{{ employee.name }}</td>
            <td class="px-2 py-3 sm:px-2 sm:py-4 text-center text-sm sm:text-base whitespace-nowrap">{{ employee.performanceScore }}%</td>
            <td class="px-2 py-3 sm:px-6 sm:py-4 hidden sm:table-cell">
              <div class="mx-auto bg-gray-300 rounded-full h-5 overflow-hidden flex items-center" style="width: 200px;">
                <div
                  class="h-5 rounded-full performance-bar transition-width duration-1000 ease-out flex items-center justify-end pr-2"
                  :style="{ width: animatedWidths[index] + '%' }"
                >
                  <span class="text-xs font-semibold text-white" v-if="animatedWidths[index] > 10">
                    {{ employee.performanceScore }}%
                  </span>
                  <span class="text-xs font-semibold text-gray-700 pl-2" v-else>
                    {{ employee.performanceScore }}%
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "PerformanceReviews",
  data() {
    return {
      employeeInformation: [
        { employeeId: 1, name: "Sibongile Nkosi", performanceScore: 78 },
        { employeeId: 2, name: "Lungile Moyo", performanceScore: 85 },
        { employeeId: 3, name: "Thabo Molefe", performanceScore: 64 },
        { employeeId: 4, name: "Keshav Naidoo", performanceScore: 92 },
        { employeeId: 5, name: "Zanele Khumalo", performanceScore: 74 },
        { employeeId: 6, name: "Sipho Zulu", performanceScore: 88 },
        { employeeId: 7, name: "Naledi Moeketsi", performanceScore: 90 },
        { employeeId: 8, name: "Farai Gumbo", performanceScore: 80 },
        { employeeId: 9, name: "Karabo Dlamini", performanceScore: 55 },
        { employeeId: 10, name: "Fatima Patel", performanceScore: 70 },
      ],
      animatedWidths: [],
      observer: null,
      animationTriggered: false,
    };
  },
  mounted() {
    this.animatedWidths = this.employeeInformation.map(() => 0);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animationTriggered) {
            this.animationTriggered = true;
            this.fillBars();
            this.observer.disconnect();
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    this.observer.observe(this.$refs.tableContainer);
  },
  methods: {
    fillBars() {
      this.animatedWidths = this.employeeInformation.map(emp => emp.performanceScore);
    }
  },
  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
};
</script>

<style scoped>
.transition-width {
  transition-property: width;
}

.performance-bar {
  background: linear-gradient(
    90deg,
    #f08331,
    #e76e37
  );
}
</style>


