<template>
  <div class="auth-layout-wrap flex justify-center min-h-screen flex-col bg-cover items-center" style="background-image: url(../../images/photo-wide-4.jpg)">
        <div class="container-session-v1 max-w-2xl">
            <BaseCard noPadding class="overflow-hidden">
                <div class="grid grid-cols-12">
                    <div class="col-span-12 bg-cover lg:col-span-6" style="background-image: url(../../images/photo-long-3.jpg)">
                        <div class="block justify-center items-center flex-col h-full px-4 py-2 lg:flex">
                            <p class="mb-14">Vous avez déjà un compte ?</p>
                            <BaseBtn block rounded class="mb-3 border border-green-500 bg-gray-100 text-green-500 hover:bg-green-500 hover:text-white" @click="this.$router.push('/login')">
                                <i class="i-Mail-with-At-Sign align-middle mr-2"></i>Se connecter
                            </BaseBtn>
                        </div>
                    </div>
                    <div class="col-span-12 lg:col-span-6">
                        <div class="p-5">
                            <h1 class="mb-3 text-lg">Créer un compte </h1>
                            <form>
                                <div class="mb-3">
                                    <label class="text-base text-gray-600" for="">Votre prénom</label>
                                    <input class="w-full px-4 py-1 border border-gray focus:outline-none rounded-full" type="text" placeholder="" v-model="firstName">
                                </div>
                                <div class="mb-3">
                                    <label class="text-base text-gray-600" for="">Votre nom</label>
                                    <input class="w-full px-4 py-1 border border-gray focus:outline-none rounded-full" type="text" placeholder="" v-model="lastName">
                                </div>
                                <div class="mb-3">
                                    <label class="text-base text-gray-600" for="">Votre adresse Mail</label>
                                    <input class="w-full px-4 py-1 border border-gray focus:outline-none rounded-full" type="email" placeholder="" v-model="mail">
                                </div>
                                <div class="mb-3">
                                    <label class="text-base text-gray-600" for="">Mot de passe</label>
                                    <input class="w-full px-4 py-1 border border-gray focus:outline-none rounded-full" type="password" placeholder="" v-model="password">
                                </div>
                                <BaseBtn rounded block class="bg-green-500 text-white" @click="register">Créer le compte</BaseBtn>
                            </form>
                            
                        </div>
                    </div>
                </div>
            </BaseCard>
            
            
        </div>
    </div>
</template>
<script>
import { createToast } from "mosha-vue-toastify";
export default {
  name: 'register',
  data() {
    return {
        firstName: null,
        lastName: null,
        mail: null,
        password: null,
        validForm: true,
        errorMessage: null,
    }
  },
  methods: {
    register() {
        const regexName = /^[A-Za-zÀ-ú'-]{1,15}$/g;
        const regexMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.firstName && this.lastName && this.mail && this.password) {
            if(this.firstName.match(regexName) && this.lastName.match(regexName) && this.mail.match(regexMail)) {
                fetch('https://warm-inlet-55236.herokuapp.com/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        first_name: this.firstName,
                        last_name: this.lastName,
                        email: this.mail,
                        password: this.password
                    })
                })
                .then(response => response.json())
                .then(r => {
                    if (r.statusCode === 200) {
                        this.toast("Registered successfully", 'success');
                        this.$router.push(`/login?email=${this.mail}`);
                        this.validForm = true;
                    } else {
                        this.toast(r.res.message, 'danger');
                        this.errorMessage = r.res.message;
                        this.validForm = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.toast("Something went wrong", 'danger');
                    this.validForm = false;
                    this.errorMessage = "Une erreur est survenue";
                });
            } else {
                this.toast("Please enter valid data", 'danger');
                this.validForm = false;
                this.errorMessage = "Veuillez entrer des données valides";
            }
        }else {
            this.toast("Please fill all the fields.", "danger");
            this.validForm = false;
            this.errorMessage = "Veuillez remplir tous les champs";
        }
    }
  },
  mounted() {
    if(localStorage.getItem('token')) {
      this.$router.push('/dashboards/dashboard')
    }
  },
  setup() {
    const toast = (message, type) => {
      createToast(message, {
        position: "top-left",
        timeout: 5000,
        type: type,
        showIcon: true,
      });
    };
    return { toast };
  },
}
</script>
