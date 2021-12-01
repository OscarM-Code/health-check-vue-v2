<template>
    <form
        id="catDeleteForm"
        @submit.prevent="modDelCategory"
        method="POST"
        ref="delCat"
    >
        <section>
            <div>
                <label for="getName"
                    >Choisissez une catégorie et l'action à effectuer.</label
                >
                <div class="flex flex-col">
                    <label for="category">Catégorie:</label>
                    <select
                        name="category"
                        v-model="category"
                        @change="
                            newName = this.categories.find(
                                (i) => i.id === category
                            ).name
                        "
                        class="
                            w-auto
                            h-10
                            pl-3
                            bg-gray-50
                            pr-6
                            text-base
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
                            {{ list.name }}
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
                            bg-gray-50
                            text-base
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
                <label v-if="action === 'PUT'">Changez le nom ici:</label>
                <input
                    v-if="action === 'PUT'"
                    type="text"
                    v-model="newName"
                    class="
                        w-full
                        h-10
                        px-3
                        mb-2
                        text-base text-gray-700
                        bg-gray-50
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
            newName: this.categories[0].name,
            userData: VueJwtDecode.decode(localStorage.getItem('token')),
            verif: true,
            errorMessage: null,
            ok: false,
            okMessage: null,
        }
    },
    methods: {
        modDelCategory() {
            const regexContent = /^[^<>{}]*$/
            let data = {
                name: this.newName,
            }
            if (this.newName && this.newName !== '') {
                if (
                    this.newName !==
                        this.categories.find((i) => i.id === this.category)
                            .name ||
                    this.action === 'DELETE'
                ) {
                    if (this.newName.match(regexContent)) {
                        fetch(
                            `https://warm-inlet-55236.herokuapp.com/api/user/${this.userData.userId}/categories/${this.category}`,
                            {
                                method: this.action,
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'application/json',
                                    'x-access-token':
                                        localStorage.getItem('token'),
                                },
                                body: JSON.stringify(data),
                            }
                        )
                            .then((response) => response.json())
                            .then(async (r) => {
                                if (this.action === 'DELETE') {
                                    if (r.status === 200) {
                                        this.$store.commit(
                                            'deleteAllLinks',
                                            this.category
                                        )
                                        this.toast(r.message, 'success')
                                        this.category = this.categories[0].id
                                        this.verif = true
                                        this.ok = true
                                        this.okMessage = r.message
                                            ? r.message
                                            : 'Catégorie supprimé.'
                                        setTimeout(() => {
                                            this.ok = false
                                        }, 3000)
                                    } else if (r.status === 401) {
                                        this.logout()
                                    } else {
                                        this.toast(r.message, 'danger')
                                        this.verif = false
                                        this.errorMessage = r.message
                                            ? r.message
                                            : 'Une erreur est survenue.'
                                    }
                                } else if (this.action === 'PUT') {
                                    if (r.status === 200) {
                                        this.$store.commit('modifyAllLinks', {
                                            cat: this.category,
                                            name: this.newName,
                                        })
                                        this.toast(r.message, 'success')
                                        this.verif = true
                                        this.ok = true
                                        this.okMessage = r.message
                                            ? r.message
                                            : 'Catégorie modifié.'
                                        setTimeout(() => {
                                            this.ok = false
                                        }, 3000)
                                    } else if (r.status === 401) {
                                        this.logout()
                                    } else {
                                        this.toast(r.message, 'danger')
                                        this.verif = false
                                        this.errorMessage = r.message
                                            ? r.message
                                            : 'Une erreur est survenue.'
                                    }
                                }
                                setTimeout(() => {
                                    this.verif = true
                                }, 3000)
                            })
                            .catch((e) => {
                                console.log(e)
                                this.toast('Une erreur est survenue.', 'danger')
                                this.verif = false
                                this.errorMessage = 'Une erreur est survenue.'
                                setTimeout(() => {
                                    this.verif = true
                                }, 3000)
                            })
                    } else {
                        this.toast(
                            'Le nom de la catégorie ne doit pas contenir de caractères spéciaux.',
                            'danger'
                        )
                        this.verif = false
                        this.errorMessage =
                            'Le nom de la catégorie ne doit pas contenir de caractères spéciaux.'
                        setTimeout(() => {
                            this.verif = true
                        }, 3000)
                    }
                } else {
                    this.toast('Les deux nom sont identiques !', 'danger')
                    this.verif = false
                    this.errorMessage = 'Les deux nom sont identiques !'
                    setTimeout(() => {
                        this.verif = true
                    }, 3000)
                }
            } else {
                this.toast('Le nom ne peut être vide.', 'danger')
                this.verif = false
                this.errorMessage = 'Le nom ne peut être vide.'
                setTimeout(() => {
                    this.verif = true
                }, 3000)
            }
        },
        toggleCatDelForm() {
            this.$refs.delCat.classList.toggle('active')
            this.$refs.btnDelCat.classList.toggle('active')
        },
        logout() {
            localStorage.removeItem('token')
            this.$router.push('/login')
            this.$$store.commit('clearAllLinks')
        },
    },
    setup() {
        const toast = (message, type) => {
            createToast(message, {
                position: 'top-right',
                timeout: 5000,
                type: type,
                showIcon: true,
            })
        }
        return { toast }
    },
    mounted() {},
}
</script>
