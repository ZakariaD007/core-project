<template>
    <div>
        <transition name="zoom-in">
            <div v-if="showLogin" key="login" class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img class="mx-auto h-20" src="@/assets/Logo.png" alt="Your Company" />
                    <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your
                        account
                    </h2>
                </div>

                <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="space-y-6" @submit.prevent="handleLogin">
                        <div>
                            <label for="username"
                                class="block text-left text-sm/6 font-medium text-gray-900">Username</label>
                            <div class="mt-2">
                                <input v-model="username" type="text" name="username" id="username"
                                    autocomplete="username" required
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <div class="flex items-center justify-between">
                                <label for="password"
                                    class="block text-sm/6 font-medium text-gray-900">Password</label>
                                <div class="text-sm">
                                    <a href="#" class="pwd">Forgot
                                        password?</a>
                                </div>
                            </div>
                            <div class="mt-2">
                                <input v-model="password" type="password" name="password" id="password"
                                    autocomplete="current-password" required
                                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                            </div>
                        </div>

                        <div>
                            <button type="submit"
                                class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign
                                in</button>
                        </div>
                        <div v-if="errorMessage" class="text-red-500 text-center text-sm mt-2">
                            {{ errorMessage }}
                        </div>
                    </form>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      showLogin: true
    }
  },
  methods: {
    handleLogin() {
      const validUsername = 'admin';
      const validPassword = 'password123';

      if (this.username === validUsername && this.password === validPassword) {
        this.errorMessage = '';
        this.showLogin = false;
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 700); // Match the transition duration
      } else {
        this.errorMessage = 'Incorrect username or password.';
      }
    }
  }
}
</script>

<style scoped>
.zoom-in-enter-active, .zoom-in-leave-active {
  transition: transform 0.7s cubic-bezier(.4,2,.6,1), opacity 0.7s;
}
.zoom-in-enter-from, .zoom-in-leave-to {
  transform: scale(1);
  opacity: 1;
}
.zoom-in-leave-active {
  z-index: 100;
}
.zoom-in-leave-from {
  transform: scale(1);
  opacity: 1;
}
.zoom-in-leave-to {
  transform: scale(2.5);
  opacity: 0;
}
button {
  background-color: #f08331;
}
button:hover{
  background-color: #e76e37;
  cursor: pointer;
}
.pwd{
  color: #f08331;
}
.pwd:hover{
  color: #e76e37;
}
input:focus {
  outline: 2px solid #f08331 !important;
  outline-offset: 2px;
}
</style>