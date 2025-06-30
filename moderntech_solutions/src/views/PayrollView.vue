<template>
  <div class="payroll px-2 py-6 max-w-5xl mx-auto">

    <div class="employee-info flex flex-col gap-3 bg-gray-50 p-4 rounded-md border border-gray-200 mb-8 w-full max-w-3xl mx-auto">
      <div class="employee-row flex flex-wrap gap-6 items-center justify-center">
        <div class="employee-field flex flex-col gap-1 items-center">
          <label class="text-xs font-semibold text-gray-500 uppercase">Select Employee</label>
          <select v-model="selectedEmployeeId" @change="loadEmployeeData"
            class="px-3 py-2 border border-blue-400 rounded w-52 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
            <option value="">-- Select Employee --</option>
            <option v-for="emp in payrollData" :key="emp.employeeId" :value="emp.employeeId">
              {{ getEmployeeName(emp.employeeId) }} (ID: {{ emp.employeeId }})
            </option>
          </select>
        </div>
        <div class="employee-field flex flex-col gap-1 items-center">
          <label class="text-xs font-semibold text-gray-500 uppercase">User ID</label>
          <input v-model="employeeInfo.userId" placeholder="Enter User ID"
            class="px-3 py-2 border border-blue-400 rounded w-40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div class="employee-field flex flex-col gap-1 items-center">
          <label class="text-xs font-semibold text-gray-500 uppercase">Employee Name</label>
          <input v-model="employeeInfo.employeeName" placeholder="Enter Employee Name"
            class="px-3 py-2 border border-blue-400 rounded w-40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div class="employee-field flex flex-col gap-1 items-center">
          <label class="text-xs font-semibold text-gray-500 uppercase">Pay Period</label>
          <input v-model="employeeInfo.payPeriod"
            class="px-3 py-2 border border-blue-400 rounded w-40 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div class="employee-field flex flex-col gap-1 items-center">
          <label class="text-xs font-semibold text-gray-500 uppercase">Leave Deductions (Days)</label>
          <input v-model.number="employeeInfo.leaveDeductions" type="number" min="0" step="1" placeholder="0"
            class="px-3 py-2 border border-blue-400 rounded w-32 text-sm bg-gray-100 text-gray-500" />
        </div>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-center mb-4">MONTHLY PAYROLL</h1>
    <button @click="downloadPayslip"
      class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow mb-6 transition">
      DOWNLOAD PAYSLIP
    </button>
    <div class="overflow-x-auto">
      <table class="w-full border-collapse rounded shadow bg-white text-sm">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-3 py-2 border">WORKED</th>
            <th class="px-3 py-2 border">DAY</th>
            <th class="px-3 py-2 border">DATE</th>
            <th class="px-3 py-2 border">REGULAR HOURS</th>
            <th class="px-3 py-2 border">RATE PER HOUR</th>
            <th class="px-3 py-2 border">TOTAL SALARY</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day, index) in days" :key="index" class="hover:bg-gray-50">
            <td class="px-3 py-2 border">
              <input v-if="day.name!=''" type="checkbox" v-model="day.worked"
                class="form-checkbox h-4 w-4 text-blue-600" />
            </td>
            <td class="px-3 py-2 border">{{ day.name }}</td>
            <td class="px-3 py-2 border">{{ day.date }}</td>
            <td class="px-3 py-2 border">
              <input v-if="day.name!=''" type="number" v-model.number="day.regular" min="0"
                class="w-20 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </td>
            <td class="px-3 py-2 border">
              <input v-if="day.name!=''" type="number" v-model.number="day.rate" min="412.61" max="412.61"
                class="w-20 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
            </td>
            <td class="px-3 py-2 border">
              <span v-if="day.name!=''">{{ day.worked ? ((day.regular * day.rate ) ).toFixed(2) : '0.00' }}</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th colspan="3"></th>
            <th class="px-3 py-2 border">{{ totalRegularHours }}</th>
            <th class="px-3 py-2 border">Monthly Total</th>
            <th class="px-3 py-2 border">{{ totalSalary.toFixed(2) }}</th>
          </tr>
          <tr v-if="employeeInfo.leaveDeductions > 0">
            <th colspan="5" class="px-3 py-2 border text-right">Leave Deductions ({{ employeeInfo.leaveDeductions }} days)</th>
            <th class="px-3 py-2 border text-red-600">-{{ leaveDeductionAmount.toFixed(2) }}</th>
          </tr>
          <tr>
            <th colspan="5" class="px-3 py-2 border text-right">Net Salary</th>
            <th class="px-3 py-2 border text-green-700">{{ netSalary.toFixed(2) }}</th>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
  
</template>

<script>
import jsPDF from "jspdf";
import logoImg from "@/assets/Logo.png";

export default {
  data() {
    return {
      selectedEmployeeId: '',
      employeeInfo: {
        userId: '',
        employeeName: '',
        payPeriod: '2025-06-01 to 2025-06-30',
        leaveDeductions: 0
      },
      days: [
        { name: "Mon", date: "2025-06-02", worked: false, regular: 0, rate: 412.61},
        { name: "Tue", date: "2025-06-03", worked: false, regular: 0, rate: 412.61 },
        { name: "Wed", date: "2025-06-04", worked: false, regular: 0, rate: 412.61 },
        { name: "Thu", date: "2025-06-05", worked: false, regular: 0, rate: 412.61 },
        { name: "Fri", date: "2025-06-06", worked: false, regular: 0, rate: 412.61 },
        { name: "Mon", date: "2025-06-09", worked: false, regular: 0, rate: 412.61 },
        { name: "Tue", date: "2025-06-10", worked: false, regular: 0, rate: 412.61 },
        { name: "Wed", date: "2025-06-11", worked: false, regular: 0, rate: 412.61 },
        { name: "Thu", date: "2025-06-12", worked: false, regular: 0, rate: 412.61 },
        { name: "Fri", date: "2025-06-13", worked: false, regular: 0, rate: 412.61 },
        { name: "Mon", date: "2025-06-16", worked: false, regular: 0, rate: 412.61 },
        { name: "Tue", date: "2025-06-17", worked: false, regular: 0, rate: 412.61 },
        { name: "Wed", date: "2025-06-18", worked: false, regular: 0, rate: 412.61 },
        { name: "Thu", date: "2025-06-19", worked: false, regular: 0, rate: 412.61 },
        { name: "Fri", date: "2025-06-20", worked: false, regular: 0, rate: 412.61 },
        { name: "Mon", date: "2025-06-23", worked: false, regular: 0, rate: 412.61 },
        { name: "Tue", date: "2025-06-24", worked: false, regular: 0, rate: 412.61 },
        { name: "Wed", date: "2025-06-25", worked: false, regular: 0, rate: 412.61 },
        { name: "Thu", date: "2025-06-26", worked: false, regular: 0, rate: 412.61 },
        { name: "Fri", date: "2025-06-27", worked: false, regular: 0, rate: 412.61 },
      ],
      payrollData: [
        {
            "employeeId": 1,
            "hoursWorked": 160,
            "leaveDeductions": 8,
            "finalSalary": 69500
        },
        {
            "employeeId": 2,
            "hoursWorked": 150,
            "leaveDeductions": 10,
            "finalSalary": 79000
        },
        {
            "employeeId": 3,
            "hoursWorked": 170,
            "leaveDeductions": 4,
            "finalSalary": 54800
        },
        {
            "employeeId": 4,
            "hoursWorked": 165,
            "leaveDeductions": 6,
            "finalSalary": 59700
        },
        {
            "employeeId": 5,
            "hoursWorked": 158,
            "leaveDeductions": 5,
            "finalSalary": 57850
        },
        {
            "employeeId": 6,
            "hoursWorked": 168,
            "leaveDeductions": 2,
            "finalSalary": 64800
        },
        {
            "employeeId": 7,
            "hoursWorked": 175,
            "leaveDeductions": 3,
            "finalSalary": 71800
        },
        {
            "employeeId": 8,
            "hoursWorked": 160,
            "leaveDeductions": 0,
            "finalSalary": 56000
        },
        {
            "employeeId": 9,
            "hoursWorked": 155,
            "leaveDeductions": 5,
            "finalSalary": 61500
        },
        {
            "employeeId": 10,
            "hoursWorked": 162,
            "leaveDeductions": 4,
            "finalSalary": 57750
        }
      ],
      employeeInformation: [
        {
            "employeeId": 1,
            "name": "Sibongile Nkosi",
            "position": "Software Engineer",
            "department": "Development",
            "salary": 70000,
            "employmentHistory": "Joined in 2015, promoted to Senior in 2018",
            "contact": "sibongile.nkosi@moderntech.com"
        },
        {
            "employeeId": 2,
            "name": "Lungile Moyo",
            "position": "HR Manager",
            "department": "HR",
            "salary": 80000,
            "employmentHistory": "Joined in 2013, promoted to Manager in 2017",
            "contact": "lungile.moyo@moderntech.com"
        },
        {
            "employeeId": 3,
            "name": "Thabo Molefe",
            "position": "Quality Analyst",
            "department": "QA",
            "salary": 55000,
            "employmentHistory": "Joined in 2018",
            "contact": "thabo.molefe@moderntech.com"
        },
        {
            "employeeId": 4,
            "name": "Keshav Naidoo",
            "position": "Sales Representative",
            "department": "Sales",
            "salary": 60000,
            "employmentHistory": "Joined in 2020",
            "contact": "keshav.naidoo@moderntech.com"
        },
        {
            "employeeId": 5,
            "name": "Zanele Khumalo",
            "position": "Marketing Specialist",
            "department": "Marketing",
            "salary": 58000,
            "employmentHistory": "Joined in 2019",
            "contact": "zanele.khumalo@moderntech.com"
        },
        {
            "employeeId": 6,
            "name": "Sipho Zulu",
            "position": "UI/UX Designer",
            "department": "Design",
            "salary": 65000,
            "employmentHistory": "Joined in 2016",
            "contact": "sipho.zulu@moderntech.com"
        },
        {
            "employeeId": 7,
            "name": "Naledi Moeketsi",
            "position": "DevOps Engineer",
            "department": "IT",
            "salary": 72000,
            "employmentHistory": "Joined in 2017",
            "contact": "naledi.moeketsi@moderntech.com"
        },
        {
            "employeeId": 8,
            "name": "Farai Gumbo",
            "position": "Content Strategist",
            "department": "Marketing",
            "salary": 56000,
            "employmentHistory": "Joined in 2021",
            "contact": "farai.gumbo@moderntech.com"
        },
        {
            "employeeId": 9,
            "name": "Karabo Dlamini",
            "position": "Accountant",
            "department": "Finance",
            "salary": 62000,
            "employmentHistory": "Joined in 2018",
            "contact": "karabo.dlamini@moderntech.com"
        },
        {
            "employeeId": 10,
            "name": "Fatima Patel",
            "position": "Customer Support Lead",
            "department": "Support",
            "salary": 58000,
            "employmentHistory": "Joined in 2016",
            "contact": "fatima.patel@moderntech.com"
        }
      ]
    };
  },
  computed: {
    totalRegularHours() {
      return this.days.reduce((sum, day) => day.worked ? sum + day.regular : sum, 0);
    },
    totalSalary() {
      return this.days.reduce((sum, day) => {
        if (day.worked) {
          return sum + (day.regular * day.rate);
        }
        return sum;
      }, 0);
    },
    dailyRate() {
      // Calculate average daily rate from worked days
      const workedDays = this.days.filter(day => day.worked && day.rate > 0);
      if (workedDays.length === 0) return 0;
      return workedDays[0].rate * 8;
    },
    leaveDeductionAmount() {
      return (this.employeeInfo.leaveDeductions || 0) * this.dailyRate;
    },
    netSalary() {
      return this.totalSalary - this.leaveDeductionAmount;
    }
  },
  methods: {
    getEmployeeName(employeeId) {
      const employee = this.employeeInformation.find(emp => emp.employeeId === employeeId);
      return employee ? employee.name : `Employee #${employeeId}`;
    },
    
    loadEmployeeData() {
      if (!this.selectedEmployeeId) {
        // Reset form if no employee selected
        this.employeeInfo = {
          userId: '',
          employeeName: '',
          payPeriod: '2025-06-01 to 2025-06-30',
          leaveDeductions: 0
        };
        this.resetDays();
        return;
      }

      const employee = this.payrollData.find(emp => emp.employeeId == this.selectedEmployeeId);
      const employeeDetails = this.employeeInformation.find(emp => emp.employeeId == this.selectedEmployeeId);
      
      if (employee && employeeDetails) {
        // Auto-populate employee info
        this.employeeInfo.userId = `EMP${String(employee.employeeId).padStart(3, '0')}`;
        this.employeeInfo.employeeName = employeeDetails.name;
        this.employeeInfo.leaveDeductions = employee.leaveDeductions;
        
        // Calculate and populate work days based on hours worked
        this.populateWorkDays(employee.hoursWorked, employee.leaveDeductions);
      }
    },
    
    populateWorkDays(totalHours, leaveDays) {
      // Reset all days first
      this.resetDays();
      
      // Calculate how many 8-hour days were worked
      const fullDaysWorked = Math.floor(totalHours / 8);
      const remainingHours = totalHours % 8;
      
      let daysPopulated = 0;
      let leaveDaysSet = 0;
      
      // Mark working days and leave days
      for (let i = 0; i < this.days.length && (daysPopulated < fullDaysWorked + (remainingHours > 0 ? 1 : 0) + leaveDays); i++) {
        if (this.days[i].name !== '') {
          if (leaveDaysSet < leaveDays && Math.random() < 0.3) {
            this.days[i].worked = false;
            this.days[i].regular = 0;
            leaveDaysSet++;
          } else if (daysPopulated < fullDaysWorked) {
            // Full 8-hour days
            this.days[i].worked = true;
            this.days[i].regular = 8;
            daysPopulated++;
          } else if (daysPopulated === fullDaysWorked && remainingHours > 0) {
            this.days[i].worked = true;
            this.days[i].regular = remainingHours;
            daysPopulated++;
          }
        }
      }
      
      // If we haven't set enough leave days, set them at the end
      for (let i = this.days.length - 1; i >= 0 && leaveDaysSet < leaveDays; i--) {
        if (this.days[i].name !== '' && this.days[i].worked) {
          this.days[i].worked = false;
          this.days[i].regular = 0;
          leaveDaysSet++;
        }
      }
    },
    
    resetDays() {
      this.days.forEach(day => {
        if (day.name !== '') {
          day.worked = false;
          day.regular = 0;
        }
      });
    },
    
    async downloadPayslip() {
      const workedDays = this.days.filter(day => day.worked && day.name !== '');
      const currentDate = new Date().toLocaleDateString();
      const doc = new jsPDF();

      // Path to Logo.png in public folder
      const logoUrl = `${window.location.origin}/Logo.png`;

      function getBase64Image(imgSrc) {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
          };
          img.onerror = reject;
          img.src = imgSrc;
        });
      }

      // Draw PDF after logo loads
      const drawPdf = (logoDataUrl) => {
        if (logoDataUrl) {
          // Decrease width to 30 and adjust x to keep it centered (A4 width is 210mm)
          doc.addImage(logoDataUrl, 'PNG', 90, 5, 30, 20);
        }

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 73, 244);
        doc.text("Monthly Payslip", 105, 28, { align: "center" });

        // Sub-header
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated: ${currentDate}`, 105, 36, { align: "center" });

        // Employee Info Box
        doc.setDrawColor(66, 153, 225);
        doc.setLineWidth(0.5);
        doc.roundedRect(10, 42, 190, 28, 3, 3);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Employee Information", 15, 50);
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`User ID: ${this.employeeInfo.userId || 'Not specified'}`, 15, 57);
        doc.text(`Employee Name: ${this.employeeInfo.employeeName || 'Not specified'}`, 70, 57);
        doc.text(`Pay Period: ${this.employeeInfo.payPeriod}`, 15, 64);
        if (this.employeeInfo.leaveDeductions > 0) {
          doc.text(`Leave Deductions: ${this.employeeInfo.leaveDeductions} days`, 140, 64);
        }

        // Timesheet Section
        let y = 78;
        doc.setFontSize(13);
        doc.setTextColor(40, 73, 244);
        doc.text("Timesheet - June 2025", 15, y);
        y += 6;
        doc.setDrawColor(220, 220, 220);
        doc.line(10, y, 200, y);
        y += 6;

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        if (workedDays.length === 0) {
          doc.text("No days worked.", 15, y);
          y += 8;
        } else {
          doc.text("Day", 15, y);
          doc.text("Date", 40, y);
          doc.text("Hours", 75, y);
          doc.text("Rate", 100, y);
          doc.text("Total", 130, y);
          y += 6;
          doc.setDrawColor(220, 220, 220);
          doc.line(10, y, 200, y);
          y += 6;
          workedDays.forEach(day => {
            doc.text(day.name, 15, y);
            doc.text(day.date, 40, y);
            doc.text(String(day.regular), 75, y);
            doc.text(`R${day.rate}`, 100, y);
            doc.text(`R${(day.regular * day.rate).toFixed(2)}`, 130, y);
            y += 7;
            if (y > 270) {
              doc.addPage();
              y = 20;
            }
          });
        }

        // Summary Section
        y += 8;
        doc.setFontSize(13);
        doc.setTextColor(40, 73, 244);
        doc.text("Summary", 15, y);
        y += 6;
        doc.setDrawColor(220, 220, 220);
        doc.line(10, y, 200, y);
        y += 8;
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Hours Worked: ${this.totalRegularHours}`, 15, y);
        y += 7;
        doc.text(`Hourly Rate: R${workedDays[0]?.rate || 412.61}`, 15, y);
        y += 7;
        doc.text(`Gross Pay: R${this.totalSalary.toFixed(2)}`, 15, y);
        y += 7;
        if (this.employeeInfo.leaveDeductions > 0) {
          doc.text(`Leave Deductions: ${this.employeeInfo.leaveDeductions} days (-R${this.leaveDeductionAmount.toFixed(2)})`, 15, y);
          y += 7;
        }
        doc.setFontSize(12);
        doc.setTextColor(40, 73, 244);
        doc.text(`Net Pay: R${this.netSalary.toFixed(2)}`, 15, y);

        // Footer
        y = 285;
        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text("Generated by Payroll System", 105, y, { align: "center" });

        doc.save(`Payslip_${this.employeeInfo.employeeName?.replace(/\s+/g, '_')}_June_2025_${currentDate.replace(/\//g, '-')}.pdf`);
      };

      try {
        const logoDataUrl = await getBase64Image(logoImg);
        drawPdf(logoDataUrl);
      } catch (e) {
        drawPdf(null);
      }
    }
  }
};
</script>

<style scoped>
.employee-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin:0 auto 20px auto;
  border: 1px solid #dee2e6;
  max-width:fit-content;
}

.employee-row {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.employee-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.employee-field label {
  font-size: 12px;
  font-weight: 600;
  color: #6c7883;
  text-transform: uppercase;
}

.employee-field select {
  padding: 6px 10px;
  border: 1px solid #419af4;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
  background-color: white;
}

.employee-field input {
  padding: 6px 10px;
  border: 1px solid #419af4;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

.employee-field input[readonly] {
  background-color: #f8f9fa;
  color: #6c757d;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2px;
}
th, td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}
input[type="number"] {
  width: 80px;
}
button{
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
  margin: 20px 0;
}
button:hover {
  background-color: #218838;
  border: none;
}

/* Media Queries */
@media (max-width: 1024px) {
  .employee-info {
    padding: 10px !important;
    max-width: 100% !important;
  }
  .employee-row {
    gap: 12px !important;
  }
  .employee-field input,
  .employee-field select {
    min-width: 120px !important;
    width: 100% !important;
    font-size: 13px !important;
  }
  th, td {
    padding: 8px !important;
    font-size: 13px !important;
  }
}

@media (max-width: 768px) {
  .payroll {
    padding: 0.5rem !important;
  }
  .employee-info {
    padding: 8px !important;
    border-radius: 4px !important;
    margin-bottom: 12px !important;
  }
  .employee-row {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
  }
  .employee-field {
    align-items: stretch !important;
    width: 100% !important;
  }
  .employee-field input,
  .employee-field select {
    min-width: 0 !important;
    width: 100% !important;
    font-size: 12px !important;
  }
  h1.text-2xl {
    font-size: 1.2rem !important;
  }
  th, td {
    padding: 6px !important;
    font-size: 12px !important;
  }
  button {
    width: 100% !important;
    padding: 8px 0 !important;
    margin: 12px 0 !important;
  }
}

@media (max-width: 480px) {
  .payroll {
    padding: 0.25rem !important;
  }
  .employee-info {
    padding: 4px !important;
    border-radius: 2px !important;
    margin-bottom: 8px !important;
  }
  .employee-row {
    gap: 6px !important;
  }
  .employee-field label {
    font-size: 10px !important;
  }
  .employee-field input,
  .employee-field select {
    font-size: 11px !important;
    padding: 4px 6px !important;
  }
  h1.text-2xl {
    font-size: 1rem !important;
  }
  th, td {
    padding: 4px !important;
    font-size: 11px !important;
  }
  .overflow-x-auto {
    overflow-x: auto !important;
    width: 100% !important;
  }
  table {
    width: 600px !important;
    font-size: 11px !important;
  }
}
</style>