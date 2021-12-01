<template>
  <router-view />
</template>
<script>
import VueJwtDecode from "vue-jwt-decode";
export default {
  name: 'App',
  data() {
    return {
      userDatas: localStorage.getItem("token")
        ? VueJwtDecode.decode(localStorage.getItem("token"))
        : null,
    }
  },
  computed: {
    links() {
      return this.$store.state.allLinks ? this.$store.state.allLinks : [];
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
      this.$store.commit("clearAllLinks");
    },
    async setCat(){
      if (localStorage.getItem("token")) {
        if (this.links && this.links.length !== 0) return;
        console.log("get links");
        console.log(this.links);
        let userData = await VueJwtDecode.decode(localStorage.getItem("token"));
        let link;
        if (userData.role === "ROLE_ADMIN") {
          link = `https://warm-inlet-55236.herokuapp.com/api/categories`;
        } else {
          link = `https://warm-inlet-55236.herokuapp.com/api/userCategories`;
        }
        await fetch(link, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token"),
          },
        })
          .then((response) => response.json())
          .then(async (links) => {
            if (links.status && (links.status == 401 || links.status == 403 || links.status == 400)) {
              console.log("error");
              this.logout();
            }
            this.userDatas = userData;
            await this.$store.commit("getAllLinks", links);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  },
  mounted() {
    if(!localStorage.getItem('token')) {
      this.$router.push('/login')
    }else{
      setInterval(() => {
        this.setCat();
      }, 30000);
    }
  },
  watch: {
    async $route(to, from) {
      this.setCat();
    },
  },
};
</script>

