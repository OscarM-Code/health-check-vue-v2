<template>
    <form
        id="linkForm"
        @submit.prevent="addLink"
        method="POST"
        ref="addLink"
        class="flex flex-col"
    >
        <div>
            <div>
                <label for="getLink"
                    >Entrez le lien et la méthode que vous voulez
                    ajouter.</label
                >
                <input
                    type="text"
                    id="getLink"
                    placeholder="Lien ici"
                    v-model="link"
                    class="
                        w-full
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
            <div class="flex flex-col">
                <label for="methid">Méthode:</label>
                <select
                    name="method"
                    v-model="method"
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
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PUT">PUT</option>
                </select>
                <label for="category">Catégorie:</label>
                <select
                    name="category"
                    v-model="category"
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
                        {{ list.name }}
                    </option>
                </select>
            </div>
            <p v-if="!verif" class="text-red-500">{{ errorMessage }}</p>
            <p v-if="ok" class="text-green-400">Le lien/la requête a bien été ajouté(e).</p>
            <button
                class="
                    border border-success
                    text-success
                    bg-gray-50
                    hover:bg-success hover:text-white
                    rounded
                    px-2
                "
            >
                Ajouter
            </button>
        </div>
    </form>
</template>

<script>
import { createToast } from 'mosha-vue-toastify'

export default {
    name: 'formAdd',
    props: ['categories'],
    data() {
        return {
            link: null,
            method: 'GET',
            category: this.categories[0].id,
            loading: false,
            verif: true,
            errorMessage: null,
            ok: false,
        }
    },
    methods: {
        addLink() {
            const regexLink =
                /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm
            let data = {
                link: this.link,
                method: this.method,
                statusCode: 200,
                health: true,
                category: this.category,
            }
            if (this.link) {
                if (this.link.match(regexLink)) {
                    fetch('https://warm-inlet-55236.herokuapp.com/api/links', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            'x-access-token': localStorage.getItem('token'),
                        },
                        body: JSON.stringify(data),
                    })
                        .then((response) => response.json())
                        .then((r) => {
                            if (r.status && r.status === 400) {
                                this.toast(r.message, 'warning')
                                this.verif = false
                                this.errorMessage = r.message
                            } else if (r.status && r.status === 200) {
                                this.toast('Lien ajouté', 'success')
                                this.$emit('addLink')
                                this.verif = true
                                this.ok = true
                                setTimeout(() => {
                                    this.ok = false
                                }, 3000)
                            } else if (r.status && r.status === 401) {
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
                            this.link = null
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
                    this.toast("Ce n'est pas un lien valide.", 'warning')
                    this.verif = false
                    this.link = null
                    this.errorMessage = "Ce n'est pas un lien valide."
                    setTimeout(() => {
                        this.verif = true
                    }, 3000)
                }
            } else {
                this.toast('Veuillez entrer un lien', 'warning')
                this.verif = false
                this.errorMessage = 'Veuillez entrer un lien'
                setTimeout(() => {
                    this.verif = true
                }, 3000)
            }
        },
        toggleLinkForm() {
            this.$refs.addLink.classList.toggle('active')
            this.$refs.btnAddLink.classList.toggle('active')
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
                timeout: 5000,
                type: type,
                showIcon: true,
            })
        }
        return { toast }
    },
}
</script>
