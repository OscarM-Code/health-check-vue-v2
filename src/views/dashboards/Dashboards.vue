<script setup>
import {
    dashboardOne,
    dashboardTwo,
    splineAreaWidgetTwo,
    splineAreaWidgetThree,
} from '@/data/dashboard.v1.js'
import Breadcrumbs from '@/components/Breadcrumbs.vue'
</script>

<template>
    <div class="container mx-auto">
        <Breadcrumbs parentTitle="Dashboard"/>
        <div class="relative inline-block w-30 text-green-500 mb-12">
        <p>Catégorie:</p>
            <select @change="changeCat" class="w-full h-10 pl-3 pr-6 text-base placeholder-green-500 bg-gray-50 border rounded-lg focus:shadow-outline">
                <option v-for="list in catList" :key="list" :value="list.id">{{ list.name }}</option>
            </select>
        </div>
        <div class="grid grid-cols-12 gap-5" v-if="allData.length !== 0">

            <div
                class="
                    col-span-12
                    xl:col-span-3
                    lg:col-span-3
                    md:col-span-6
                    sm:col-span-6
                "
                v-for="links in allData"
                :key="links"

            >
                <BaseCard class="text-center">
                    <img
                        class="
                            w-20
                            h-20
                            m-auto
                            shadow-lg
                            avatar-md
                            rounded-full
                        "
                        :src=" links.health ? (links.statusCode === 405 ? '/images/status/warn.png' : '/images/status/ok.png') : '/images/status/off.png'"
                        alt=""
                    />
                    <p class="text-base mt-4">Status Code</p>
                    <p class="text-xs text-gray-400">{{ links.statusCode }}</p>
                    <p class="my-2 text-sm text-gray-500 mb-3 break-words">
                        {{ links.link }}
                    </p>
                    <BaseBtn sm class="bg-success text-white rounded-full cursor-default">
                        {{ links.method }}
                    </BaseBtn>
                </BaseCard>
            </div>
        </div>
    </div>
</template>

<script>

import VueJwtDecode from 'vue-jwt-decode'

export default {
    data() {
        return {
            allData: [],
            userData: VueJwtDecode.decode(localStorage.getItem("token")),
        }
    },
    methods: {
        async loadData() {
            if (this.$route.query.cat) {
              this.allData = [];
              const customRoute = this.$route.query.cat
                ? this.$route.query.cat
                : null;
            await fetch(
              `https://warm-inlet-55236.herokuapp.com/api/user/${this.userData.userId}/categories/${customRoute}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "x-access-token": localStorage.getItem("token"),
                },
              }
            )
              .then((response) => response.json())
              .then((r) => {
                if (r.status && (r.status == 401 || r.status == 403 || r.status == 400)) {
                  console.log("error");
                  this.logout();
                } else {
                    r.cat.sites.map((data) => {
                      const { link, method, health, statusCode } = data;
                      this.allData.push({
                        link: link,
                        method: method,
                        health: health,
                        statusCode: statusCode,
                      });
                    });
                }
              });
            }
        },
        logout() {
            localStorage.removeItem('token');
            this.$router.push('/login');
            this.$store.commit('clearAllLinks');
        },
        changeCat(e) {
            this.$router.push(`/dashboard?cat=${e.target.value}`)
            setTimeout(() => {
                this.loadData();
            }, 100);
        },
    },
    computed: {
        catList() {
            return this.$store.state.allLinks
        },
    },
    mounted(){
        setTimeout(() => {
            if(this.catList && this.catList.length > 0){
                setTimeout(() => {   
                    if(!this.$route.query.cat){
                            this.$router.push(`/dashboard?cat=${this.catList[0].id}`)
                    }
                    setTimeout(() => {
                        this.loadData();
                    }, 100);
                }, 400);
            }else{
                this.loadData();
            }
        }, 500)
        console.log(this.$route.query.cat)
    }
}

</script>