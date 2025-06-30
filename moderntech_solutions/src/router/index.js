import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import Employee_DirectoryView from '@/views/Employee_DirectoryView.vue'
import PayrollView from '@/views/PayrollView.vue'
import LoginView from '@/views/LoginView.vue'
import AttendanceView from '@/views/AttendanceView.vue'
import PerformanceReviewView from '@/views/PerformanceReviewView.vue'
import LeaveView from '@/views/LeaveView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    // *** CHANGE THIS LINE ***
    path: '/employee-directory', // Changed space to hyphen
    name: 'Employee Directory',
    component: Employee_DirectoryView
  },
  {
    path: '/payroll',
    name: 'Payroll',
    component: PayrollView
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: AttendanceView
  },
  {
    path: '/performance-review',
    name: 'Performance Reviews',
    component: PerformanceReviewView
  },
  {
    path: '/leave',
    name: 'Leave',
    component: LeaveView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router