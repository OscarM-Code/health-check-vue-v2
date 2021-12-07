<template>
    <form id="deleteLinkForm" method="POST" @submit.prevent="use" ref="delLink">
        <section>
            <div class="flex flex-col">
                <label for="getName"
                    >Choisir une catégorie, séléctionner un lien, choix de
                    l'actions, modifications des paramètres voulus.</label
                >
                <div class="flex flex-col">
                    <label for="category">Catégorie:</label>
                    <select
                        name="category"
                        v-model="category"
                        @change="selectLink"
                        class="
                            w-auto
                            h-10
                            pl-3
                            pr-6
                            text-base
                            bg-gray-50
                            border
                            rounded-lg
                            focus:shadow-outline
                            mb-4
                        "
                    >
                        <option
                            v-for="list in this.categories"
                            :key="list"
                            :value="list.id"
                        >
                            {{
                                list.name
                            }}
                        </option>
                    </select>
                    <label for="delormod">Action:</label>
                    <select
                        name="delormod"
                        v-model="action"
                        class="
                            w-auto
                            h-10
                            pl-3
                            pr-6
                            text-base
                            bg-gray-50
                            border
                            rounded-lg
                            focus:shadow-outline
                            mb-4
                        "
                    >
                        <option value="PUT">Modifier</option>
                        <option value="DELETE">Supprimer</option>
                    </select>
                </div>
                <label for="allLink">Selectionnez le lien:</label>
                <select
                    name="allLink"
                    v-model="selectedLink"
                    @change="changeData"
                    class="
                        w-full
                        h-10
                        pl-3
                        pr-6
                        text-base
                        bg-gray-50
                        border
                        rounded-lg
                        focus:shadow-outline
                        mb-4
                    "
                >
                    <option
                        v-for="link in allLinks"
                        :key="link.link"
                        :value="link._id"
                    >
                        {{ link.link + ' (' + link.method + ')' }}
                    </option>
                </select>
                <div v-if="action === 'PUT'" class="flex flex-col">
                    <label for="method">Nouvelle méthode:</label>
                    <select
                        name="method"
                        v-model="method"
                        class="
                            w-auto
                            h-10
                            pl-3
                            pr-6
                            text-base
                            bg-gray-50
                            border
                            rounded-lg
                            focus:shadow-outline
                            mb-4
                        "
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PUT">PUT</option>
                    </select>
                    <label for="newCat">Nouvelle catégorie</label>
                    <select
                        name="newCat"
                        v-model="newCat"
                        class="
                            w-auto
                            h-10
                            pl-3
                            pr-6
                            text-base
                            bg-gray-50
                            border
                            rounded-lg
                            focus:shadow-outline
                            mb-4
                        "
                    >
                        <option
                            v-for="list in this.categories"
                            :key="list"
                            :value="list.id"
                        >
                            {{
                                list.name
                            }}
                        </option>
                    </select>
                </div>
                <label v-if="action === 'PUT'">Changez le lien ici:</label>
                <input
                    v-if="action === 'PUT'"
                    type="text"
                    v-model="newLink"
                    class="
                        w-full
                        h-10
                        px-3
                        mb-2
                        bg-gray-50
                        text-base text-gray-700
                        placeholder-gray-600
                        border
                        rounded-lg
                        focus:shadow-outline
                        mb-4
                    "
                />
            </div>
            <p v-if="!verif" class="text-red-500">{{ errorMessage }}</p>
            <p v-if="ok" class="text-green-400">{{ okMessage }}</p>
            <button
                class="
                    border border-success
                    text-success
                    hover:bg-success hover:text-white
                    rounded
                    px-2
                "
            >
                Valider
            </button>
        </section>
    </form>
</template>

<script>
import { createToast } from 'mosha-vue-toastify'
import VueJwtDecode from 'vue-jwt-decode'

export default {
    name: 'formAdd',
    props: ['categories'],
    data() {
        return {
            category: this.categories[0].id,
            action: 'PUT',
            newLink: '',
            allLinks: [],
            selectedLink: null,
            method: null,
            newCat: null,
            userData: VueJwtDecode.decode(localStorage.getItem('token')),
            verif: true,
            errorMessage: null,
            ok: false,
            okMessage: null,
        }
    },
    methods: {
        selectLink() {
            fetch(
                `https://warm-inlet-55236.herokuapp.com/api/user/${this.userData.userId}/categories/${this.category}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.getItem('token'),
                    },
                }
            )
                .then((response) => response.json())
                .then(async (r) => {
                    this.allLinks = r.cat.sites
                    this.newLink = r.cat.sites[0]
                        ? r.cat.sites[0].link
                        : 'Cette catégorie est vide'
                    this.selectedLink = r.cat.sites[0]
                        ? r.cat.sites[0]._id
                        : 'Cette catégorie est vide'
                    this.method = r.cat.sites[0] ? r.cat.sites[0].method : 'GET'
                    this.newCat = this.category
                })
                .catch((e) => {
                    console.log(e)
                    this.toast('Une erreur est survenue.', 'danger')
                })
        },
        toggleDelLinkForm() {
            this.$refs.delLink.classList.toggle('active')
            this.$refs.btnDelLink.classList.toggle('active')
        },
        changeData() {
            let index = this.allLinks.find((l) => l._id === this.selectedLink)
            this.method = index.method
            this.newLink = index.link
        },
        delModLink() {
            let index = this.allLinks.find((l) => l._id === this.selectedLink)
            let data = {
                category: this.category,
                link: this.newLink || null,
                action: this.action,
                method: this.method || null,
                newCategory: this.newCat || null,
            }
            if (
                this.method !== index.method ||
                this.newLink !== index.link ||
                (this.category !== this.newCat && this.action === 'PUT') ||
                this.action === 'DELETE'
            ) {
                const regexLink =
                    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
                if (
                    (this.newLink.match(regexLink) && this.action === 'PUT') ||
                    this.action === 'DELETE'
                ) {
                    fetch(
                        `https://warm-inlet-55236.herokuapp.com/api/user/${this.userData.userId}/links/${this.selectedLink}`,
                        {
                            method: this.action,
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'x-access-token': localStorage.getItem('token'),
                            },
                            body: JSON.stringify(data),
                        }
                    )
                        .then((response) => response.json())
                        .then(async (r) => {
                            if (r.status === 200) {
                                this.toast(r.message, 'success')
                                this.selectLink()
                                this.verif = true
                                this.ok = true
                                if (this.action === 'DELETE') {
                                    this.okMessage =
                                        'Le lien a bien été supprimé'
                                } else {
                                    this.okMessage =
                                        'Le lien a bien été modifié'
                                }
                                setTimeout(() => {
                                    this.ok = false
                                }, 3000)
                            } else if (r.status === 400) {
                                this.toast(r.message, 'warning')
                                this.verif = false
                                this.errorMessage = r.message
                                    ? r.message
                                    : 'Une erreur est survenue.'
                            } else if (r.status === 401) {
                                this.logout()
                            } else {
                                this.toast('Une erreur est survenue.', 'danger')
                                this.verif = false
                                this.errorMessage = r.message
                                    ? r.message
                                    : 'Une erreur est survenue.'
                            }
                            setTimeout(() => {
                                this.verif = true
                            }, 3000)
                            this.changeData()
                        })
                        .catch((e) => {
                            console.log(e)
                            this.toast('Une erreur est survenue.', 'danger')
                            this.verif = false
                            setTimeout(() => {
                                this.verif = true
                            }, 3000)
                            this.errorMessage = 'Une erreur est survenue.'
                        })
                } else {
                    this.toast("Le lien n'est pas valide.", 'warning')
                    this.verif = false
                    this.errorMessage = "Le lien n'est pas valide."
                    setTimeout(() => {
                        this.verif = true
                    }, 3000)
                }
            } else {
                this.toast('Tous les paramètres sont identiques !', 'warning')
                this.verif = false
                this.errorMessage = 'Tous les paramètres sont identiques !'
                setTimeout(() => {
                    this.verif = true
                }, 3000)
            }
        },
        use() {
            this.delModLink()
            this.selectLink()
            this.changeData()
        },
        logout() {
            localStorage.removeItem('token')
            this.$router.push('/login')
            this.$store.commit('clearAllLinks')
        },
    },
    setup() {
        const toast = (message, type) => {
            createToast(message, {
                position: 'top-right',
                timeout: 3000,
                type: type,
                showIcon: true,
            })
        }
        return { toast }
    },
    mounted() {
        this.selectLink()
    },
}
</script>
