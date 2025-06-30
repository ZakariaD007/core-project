<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h2 class="h5 mb-0">Submit Leave Request</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="submitLeave" novalidate>
              <!-- Name Field -->
              <div class="mb-3">
                <label for="name" class="form-label">Your Name <span class="text-danger">*</span></label>
                <input 
                  type="text" 
                  class="form-control" 
                  id="name" 
                  v-model.trim="leave.name" 
                  required
                  placeholder="Enter your full name"
                  :class="{ 'is-invalid': errors.name }"
                >
                <div class="invalid-feedback">
                  {{ errors.name || 'Please enter your name' }}
                </div>
              </div>

              <!-- Leave Type Field -->
              <div class="mb-3">
                <label for="leaveType" class="form-label">Leave Type <span class="text-danger">*</span></label>
                <select 
                  class="form-select" 
                  id="leaveType" 
                  v-model="leave.leaveType" 
                  required
                  @change="handleLeaveTypeChange"
                  :class="{ 'is-invalid': errors.leaveType }"
                >
                  <option value="" disabled selected>Select Leave Type</option>
                  <option value="sick">Sick Leave</option>
                  <option value="vacation">Vacation Leave</option>
                  <option value="personal">Personal Reasons</option>
                  <option value="other">Other</option>
                </select>
                <div class="invalid-feedback">
                  {{ errors.leaveType || 'Please select a leave type' }}
                </div>
              </div>

              <!-- Other Reason Field (Conditional) -->
              <div class="mb-3" v-if="showOtherReason">
                <label for="otherReason" class="form-label">Please specify reason <span class="text-danger">*</span></label>
                <textarea 
                  class="form-control" 
                  id="otherReason" 
                  v-model.trim="leave.otherReason" 
                  required
                  rows="2"
                  placeholder="Enter your specific reason"
                  :class="{ 'is-invalid': errors.otherReason }"
                ></textarea>
                <div class="invalid-feedback">
                  {{ errors.otherReason || 'Please specify your reason' }}
                </div>
              </div>

              <!-- Date Range Fields -->
              <div class="row mb-3">
                <div class="col-md-6">
                  <label for="startDate" class="form-label">Start Date <span class="text-danger">*</span></label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="startDate" 
                    v-model="leave.startDate" 
                    required
                    :min="minDate"
                    @change="validateDates"
                    :class="{ 'is-invalid': errors.startDate || dateError }"
                  >
                  <div class="invalid-feedback">
                    {{ errors.startDate || dateError || 'Please select a start date' }}
                  </div>
                </div>
                <div class="col-md-6">
                  <label for="endDate" class="form-label">End Date <span class="text-danger">*</span></label>
                  <input 
                    type="date" 
                    class="form-control" 
                    id="endDate" 
                    v-model="leave.endDate" 
                    required
                    :min="leave.startDate || minDate"
                    @change="validateDates"
                    :class="{ 'is-invalid': errors.endDate || dateError }"
                  >
                  <div class="invalid-feedback">
                    {{ errors.endDate || dateError || 'Please select an end date' }}
                  </div>
                </div>
              </div>

              <!-- Collapsible Reason Field -->
              <div class="mb-4">
                <button 
                  class="btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#reasonCollapse"
                  aria-expanded="false" 
                  aria-controls="reasonCollapse"
                >
                  <span>Additional Reason (Optional)</span>
                  <i class="bi bi-chevron-down"></i>
                </button>
                <div class="collapse mt-2" id="reasonCollapse">
                  <textarea 
                    class="form-control" 
                    v-model.trim="leave.reason" 
                    rows="3"
                    placeholder="Enter additional details about your leave request"
                  ></textarea>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="d-grid">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
                </button>
              </div>
            </form>

            <!-- Success Message -->
            <div v-if="submitted" class="alert alert-success mt-3 mb-0">
              <i class="bi bi-check-circle-fill me-2"></i>
              Leave request submitted successfully!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return {
      leave: {
        name: '',
        leaveType: '',
        otherReason: '',
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        reason: ''
      },
      showOtherReason: false,
      minDate: today.toISOString().split('T')[0],
      dateError: '',
      errors: {},
      isSubmitting: false,
      submitted: false
    }
  },
  methods: {
    handleLeaveTypeChange() {
      this.showOtherReason = this.leave.leaveType === 'other';
      if (!this.showOtherReason) {
        this.leave.otherReason = '';
      }
    },
    validateDates() {
      this.dateError = '';
      
      if (this.leave.startDate && this.leave.endDate) {
        const start = new Date(this.leave.startDate);
        const end = new Date(this.leave.endDate);
        
        if (end < start) {
          this.dateError = 'End date cannot be before start date';
          return false;
        }
      }
      return true;
    },
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.leave.name.trim()) {
        this.errors.name = 'Name is required';
        isValid = false;
      }

      if (!this.leave.leaveType) {
        this.errors.leaveType = 'Leave type is required';
        isValid = false;
      }

      if (this.leave.leaveType === 'other' && !this.leave.otherReason.trim()) {
        this.errors.otherReason = 'Reason is required when selecting "Other"';
        isValid = false;
      }

      if (!this.leave.startDate) {
        this.errors.startDate = 'Start date is required';
        isValid = false;
      }

      if (!this.leave.endDate) {
        this.errors.endDate = 'End date is required';
        isValid = false;
      }

      if (!this.validateDates()) {
        isValid = false;
      }

      return isValid;
    },
    submitLeave() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;
      
      // Simulate processing delay
      setTimeout(() => {
        const leaveData = {
          ...this.leave,
          id: Date.now(),
          status: 'pending',
          submittedDate: new Date().toISOString(),
          finalReason: this.leave.leaveType === 'other' ? 
                       this.leave.otherReason : 
                       this.leave.leaveType.charAt(0).toUpperCase() + this.leave.leaveType.slice(1)
        };
        
        // Store in localStorage
        const leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
        leaves.push(leaveData);
        localStorage.setItem('leaves', JSON.stringify(leaves));
        
        this.submitted = true;
        this.isSubmitting = false;
        this.resetForm();
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          this.submitted = false;
        }, 5000);
      }, 800);
    },
    resetForm() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      this.leave = {
        name: '',
        leaveType: '',
        otherReason: '',
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        reason: ''
      };
      this.showOtherReason = false;
      this.errors = {};
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


[data-bs-toggle="collapse"] .bi-chevron-down {
  transition: transform 0.3s ease;
}

[data-bs-toggle="collapse"][aria-expanded="true"] .bi-chevron-down {
  transform: rotate(180deg);
}
</style>