<script setup>
import Breadcrumb from '@/components/Breadcrumbs.vue'
</script>

<template>
  <div class="container mx-auto">
     <Breadcrumb parentTitle='Options'/>
    <div class="mt-10">
      <div class="grid md:grid-cols-1 sm:grid-cols-1 gap-4">
        <div>
          <BaseCard>
            <div class="card-title mb-5 text-green-500">Créer une Catégorie</div> 
            <Form1></Form1>           
          </BaseCard>
        </div>
        <div v-if="storeCat.length !== 0">
          <BaseCard>
            <div class="card-title mb-5 text-green-500">Ajouter un lien/une requête</div>
            <Form2 :categories="storeCat" @addLink="updateLinks"></Form2> 
          </BaseCard>
        </div>
        <div v-if="storeCat.length !== 0">
          <BaseCard>
            <div class="card-title mb-5 text-green-500">Modifier ou supprimer une Catégorie</div>
            <Form3 :categories="storeCat"></Form3>
          </BaseCard>
        </div>
        <div v-if="storeCat.length !== 0">
          <BaseCard>
            <div class="card-title mb-5 text-green-500">Modifier ou supprimer un lien/une requête</div>
            <Form4 :categories="storeCat" v-bind:ref="ref"></Form4>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Form1 from "./forms/FormCat.vue";
import Form2 from "./forms/FormLink.vue";
import Form3 from "./forms/FormDeleteCat.vue";
import Form4 from "./forms/FormDeleteLink.vue";

export default {
  name: "Options",
  components: {
    Form1,
    Form2,
    Form3,
    Form4,
  },
  data() {
    return {
      ref: "formDel",
    };
  },
  computed: {
    storeCat() {
      return this.$store.state.allLinks;
    },
  },
  methods: {
    updateLinks(){
      this.$refs.formDel.selectLink();
    },
  },
}
</script>