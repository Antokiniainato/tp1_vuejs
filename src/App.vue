<script setup>
  import { ref, onMounted } from 'vue';
  import { importerData, rechargerTable, getMaxID, supprimerData, modifierData, ajouterData, rechercherData } from './data';

  const dataJSON = ref([]);

  onMounted(async () => {
    try {
    // Vérifier si les données existent dans le stockage local
    const donneesLocalStorage = localStorage.getItem('data');
    if (donneesLocalStorage) {
      dataJSON.value = JSON.parse(donneesLocalStorage);
      rechargerTable(dataJSON.value); // Mettre à jour le tableau avec les données du stockage local
      getMaxID(dataJSON.value); // Mettre à jour l'ID maximum
    } else {
      // Récupérer les données du fichier JSON si elles ne sont pas dans le stockage local
      const donnees = await importerData('./data/data.json', 'data');
      dataJSON.value = donnees;
      rechargerTable(donnees);
      getMaxID(donnees);
      localStorage.setItem('data', JSON.stringify(donnees)); // Stocker les données dans le stockage local
    }
  } catch (error) {
    console.error('Une erreur est survenue lors de l\'import des données :', error);
  }
  });

  const handleRechercher = (searchTerm) => {
    const filteredData = rechercherData(searchTerm, dataJSON.value);
    rechargerTable(filteredData)
  };

</script>

<template>
  <div div id="layout-wrapper">
    <br>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h1>TP - Rappel JAVASCRIPT</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="row mb-2">
                <div class="col-sm-4">
                  <div class="search-box me-2 mb-2 d-inline-block">
                    <div class="position-relative">
                      <input type="text" class="form-control" autocomplete="off" id="rechercherData" placeholder="Rechercher..." @keydown.enter="handleRechercher($event.target.value)"/>
                      <i class="mdi mdi-clipboard-text-search-outline search-icon"></i>
                    </div>
                  </div>
                </div>
                <div class="col-sm-8">
                  <div class="text-sm-end">
                    <button type="button" class="btn btn-success btn-rounded waves-effect waves-light mb-2 me-2 addOrder-modal" data-bs-toggle="modal" data-bs-target="#add">
                      <i class="mdi mdi-plus me-1"></i> Ajouter nouveau donnée
                    </button>
                  </div>
                </div>
              </div>
              <div id="tableau" class="table-responsive"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="add" tabindex="-1" aria-labelledby="add" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="add">Ajouter un nouveau donnée</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="ajouterData(event, dataJSON)">
            <div class="row">
              <div class="col-lg-12">
                <input type="hidden" class="form-control" id="orderid-input" value="">
                <div class="mb-3">
                  <label for="nom" class="form-label">Nom :</label>
                  <input type="text" name="nom" id="nom" class="form-control" placeholder="Entrer le nom" required />
                  <div class="invalid-feedback">Veuillez saisir le nom.</div>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email :</label>
                  <input type="email" name="email" id="email" class="form-control" placeholder="Entrer le émail" required />
                  <div class="invalid-feedback">Veuillez saisir l'émail.</div>
                </div>
                <div class="mb-3">
                  <label for="devise" class="form-label">Devise : </label>
                  <select name="devise" id="devise" class="form-control" required>
                    <option value="" selected>Sélectionner une devise</option>
                    <option value="MGA">Ariary malgache</option>
                    <option value="USD">Dollar américain</option>
                    <option value="EUR">Euro</option>
                    <option value="GBP">Livre sterling</option>
                    <option value="JPY">Yen japonais</option>
                  </select>
                  <div class="invalid-feedback">Veuillez sélectionner une devise.</div>
                </div>
              </div>
              <div class="col-lg-12">
                <div class="text-end">
                  <button type="reset" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
                  <button type="submit" class="btn btn-success">Enregistrer</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
