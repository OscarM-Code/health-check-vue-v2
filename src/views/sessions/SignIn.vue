<template>
  <div
    class="
      auth-layout-wrap
      flex
      justify-center
      min-h-screen
      flex-col
      bg-cover
      items-center
    "
    style="background-image: url(../../images/photo-wide-4.jpg)"
  >
    <div class="container-session-v1 max-w-2xl">
      <BaseCard noPadding class="overflow-hidden">
        <div class="grid grid-cols-12">
          <div class="col-span-12 lg:col-span-6">
            <div class="p-5">
              <h1 class="mb-3 text-lg">Se connecter</h1>
              <form>
                <div class="mb-3">
                  <label class="text-xs text-gray-600" for=""
                    >Adresse mail</label
                  >
                  <input
                    class="
                      w-full
                      px-4
                      py-1
                      bg-gray-100
                      focus:outline-none
                      border border-gray-400
                      rounded-full
                    "
                    type="email"
                    placeholder=""
                    v-model="mail"
                  />
                </div>
                <div class="mb-3">
                  <label class="text-xs text-gray-600" for=""
                    >Mot de passe</label
                  >
                  <input
                    class="
                      w-full
                      px-4
                      py-1
                      bg-gray-100
                      focus:outline-none
                      border border-gray-400
                      rounded-full
                    "
                    type="password"
                    placeholder=""
                    v-model="password"
                  />
                </div>
                <p v-if="!verif" class="text-red-500">{{ errorMessage }}</p>
                <div class="mb-4">
                  <BaseBtn
                    block
                    class="bg-green-500 mb-2 text-white rounded-full"
                    @click="login"
                    >Connexion</BaseBtn
                  >
                </div>
              </form>
            </div>
          </div>
          <div
            class="col-span-12 bg-cover lg:col-span-6"
            style="background-image: url(../../images/photo-long-3.jpg)"
          >
            <div
              class="flex justify-center items-center flex-col h-full px-4 py-2"
            >
              <p class="mb-14">Vous n'avez pas de compte ?</p>
              <BaseBtn
                block
                rounded
                class="
                  mb-3
                  border border-green-500
                  bg-gray-100
                  text-green-500
                  hover:bg-green-500 hover:text-white
                "
                @click="this.$router.push('/register')"
              >
                <i class="i-Mail-with-At-Sign align-middle mr-2"></i>Créer un
                compte
              </BaseBtn>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>
<script>
import { createToast } from "mosha-vue-toastify";
import VueJwtDecode from "vue-jwt-decode";
export default {
  name: "Login",
  data() {
    return {
      mail: this.$route.params && this.$route.params.userMail
        ? this.$route.params.userMail
        : null,
      password: null,
      verif: true,
      errorMessage: null,
    };
  },
  methods: {
    login() {
      if (this.mail && this.password) {
        fetch("https://warm-inlet-55236.herokuapp.com/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            email: this.mail,
            password: this.password,
          }),
        })
          .then((response) => response.json())
          .then((r) => {
            if (r.status === 200) {
              this.verif = true;
              this.toast("Login successfully", "success");
              localStorage.setItem("token", r.thisUser.token);
              setTimeout(() => {
                this.$router.push(`/dashboard`);
              }, 1000);
            } else {
              this.toast(r.message, "danger");
              this.verif = false;
              this.errorMessage = r.message;
            }
          })
          .catch((err) => {
            console.log(err);
            this.toast("Une erreur est survenue.", "danger");
            this.verif = false;
            this.errorMessage = "Une erreur est survenue.";
          });
      } else {
        this.toast("Tout les champs doivent être remplis", "danger");
        this.verif = false;
        this.errorMessage = "Tout les champs doivent être remplis";
      }
    },
  },
  created() {},
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
  mounted() {
    if (localStorage.getItem("token")) {
      this.$router.push(`/dashboard`);
    }
  },
};
</script>
