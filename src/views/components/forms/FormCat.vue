<template>
    <form
        ref="addCat"
        id="categoryForm"
        @submit.prevent="addCategory"
        method="POST"
    >
        <div>
            <div>
                <label for="getName"
                    >Entrez le nom pour la nouvelle catégorie</label
                >
                <input
                    type="text"
                    id="getName"
                    placeholder="Nom ici"
                    v-model="nameC"
                    class="
                        w-full
                        bg-gray-50
                        h-10
                        px-3
                        mb-2
                        text-base text-gray-700
                        placeholder-gray-600
                        border
                        rounded-lg
                        focus:shadow-outline
                    "
                />
            </div>
            <p v-if="!verif" class="text-red-500">{{ errorMessage }}</p>
            <p v-if="ok" class="text-green-400">La catégorie a bien été crée.</p>
            <button
                class="
                    border border-success
                    text-success
                    hover:bg-success hover:text-white
                    rounded
                    px-2
                "
            >
                Créer
            </button>
        </div>
    </form>
</template>

<script>
import { createToast } from 'mosha-vue-toastify'

export default {
    name: 'formAdd',
    data() {
        return {
            nameC: null,
            loading: false,
            verif: true,
            errorMessage: null,
            ok: false,
        }
    },
    methods: {
        addCategory() {
            const regexContent = /^[^<>{}]*$/
            let data = {
                name: this.nameC,
            }
            if (this.nameC) {
                if (this.nameC.match(regexContent)) {
                    fetch(
                        'https://warm-inlet-55236.herokuapp.com/api/categories',
                        {
                            method: 'POST',
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
                            if (r.status && r.status === 400) {
                                this.toast(r.message, 'warning')
                                this.verif = false
                                this.errorMessage = r.message
                            } else if (r.status && r.status === 200) {
                                this.$store.commit('incrementAllLinks', r.cat)
                                this.toast('Category créée', 'success')
                                this.verif = true
                                this.errorMessage = null
                                this.ok = true
                                setTimeout(() => {
                                    this.ok = false
                                }, 3000)
                            } else if (r.status && r.status === 401) {
                                this.logout()
                            } else {
                                this.toast('Une erreur est survenue.', 'error')
                                this.verif = false
                                this.errorMessage = r.message
                            }
                            setTimeout(() => {
                                this.verif = true
                            }, 3000)
                            this.nameC = null
                        })
                        .catch((e) => {
                            this.toast('Une erreur est survenue.', 'danger')
                            this.verif = false
                            this.errorMessage = 'Une erreur est survenue.'
                            setTimeout(() => {
                                this.verif = true
                            }, 3000)
                        })
                } else {
                    this.toast(
                        'Le nom ne doit pas contenir de caractères spéciaux.',
                        'warning'
                    )
                    this.verif = false
                    this.errorMessage =
                        'Le nom ne doit pas contenir de caractères spéciaux.'
                    setTimeout(() => {
                        this.verif = true
                    }, 3000)
                }
            } else {
                this.toast('Le nom est vide', 'warning')
                this.verif = false
                this.errorMessage = 'Le nom est vide'
                setTimeout(() => {
                    this.verif = true
                }, 3000)
            }
        },
        toggleCatForm() {
            this.$refs.addCat.classList.toggle('active')
            this.$refs.btnAddCat.classList.toggle('active')
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
}
</script>
