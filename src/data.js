export const importerData = async (nomFichier, cleDeStockage) => {
    try {
      const response = await fetch(nomFichier);
  
      if (!response.ok) {
        throw new Error(`Erreur de chargement du fichier JSON : ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!localStorage.getItem(cleDeStockage)) {
        const dataFiltrees = data.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          devise: item.devise
        }));
  
        localStorage.setItem(cleDeStockage, JSON.stringify(dataFiltrees));
        console.log('Données JSON importées avec succès dans le localStorage');
      }
  
      return JSON.parse(localStorage.getItem(cleDeStockage));
    } catch (error) {
      console.error('Une erreur est survenue :', error);
      return []; // Return an empty array on error
    }
  };
  
export const rechargerTable = (dataJSON) => {
    let tableauHTML = '<table class="table table-bordered align-middle nowrap">'

  // En-tête du tableau
  tableauHTML += `
    <thead>
      <tr>
          <th scope="col">ID</th>
          <th scope="col">Nom</th>
          <th scope="col">Email</th>
          <th scope="col">Devise</th>
          <th scope="col">Action</th>
      </tr>
    </thead>
    <tbody> 
  `
  
  // Lignes du tableau
  for (const data of dataJSON) {
    tableauHTML += `
        <tr>
        <th scope="row">${data.id}</th>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.devise}</td>
        <td>
            <ul class="list-unstyled hstack gap-1 mb-0">
                <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Editer" data-bs-original-title="Editer">
                    <a data-bs-toggle="modal" data-bs-target="#edit${data.id}" class="btn btn-sm btn-soft-primary"><i class="mdi mdi-square-edit-outline"></i></a>
                    <div class="modal fade" id="edit${data.id}" tabindex="-1" aria-labelledby="ajouterclientModalLabel" style="display: none;" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="ajouterclientModalLabel">Modifier un donnée dans ${data.name}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <form method="post" onsubmit="modifierData(event, ${data.id})">
                                        <div class="row">
                                            <div class="col-lg-12">
                                                <input type="hidden" class="form-control" id="orderid-input" value="">
                                                <div class="mb-3">
                                                    <label for="nom_edit" class="form-label">Nom :</label>
                                                    <input value="${data.name}" type="text" name="nom_edit" id="nom_edit${data.id}" class="form-control" placeholder="Entrer le nom" required="">
                                                    <div class="invalid-feedback">Veuillez saisir le nom.</div>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="email_edit" class="form-label">Email :</label>
                                                    <input value="${data.email}" type="email" name="email_edit" id="email_edit${data.id}" class="form-control" placeholder="Entrer le émail" required="">
                                                    <div class="invalid-feedback">Veuillez saisir l'émail.</div>
                                                </div>
                                                <div class="mb-3">
                                                    <label for="devise_edit" class="form-label">Devise :</label>
                                                    <select name="devise" id="devise_edit${data.id}" class="form-control" required>
                                                      <option value="" selected>Sélectionner une devise</option>
                                                      <option value="MGA" ${data.devise === 'MGA' ? 'selected' : ''}>Ariary malgache</option>
                                                      <option value="USD" ${data.devise === 'USD' ? 'selected' : ''}>Dollar américain</option>
                                                      <option value="EUR" ${data.devise === 'EUR' ? 'selected' : ''}>Euro</option>
                                                      <option value="GBP" ${data.devise === 'GBP' ? 'selected' : ''}>Livre sterling</option>
                                                      <option value="JPY" ${data.devise === 'JPY' ? 'selected' : ''}>Yen japonais</option>
                                                    </select>
                                                    <div class="invalid-feedback">Veuillez sélectionner une devise.</div>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div class="text-end">
                                                    <button type="reset" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
                                                    <button type="submit" name="submit" class="btn btn-success" data-bs-dismiss="modal">Enregistrer</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                <li data-bs-toggle="tooltip" data-bs-placement="top" aria-label="Supprimer" data-bs-original-title="Supprimer">
                    <a data-bs-toggle="modal" data-bs-target="#remove${data.id}" class="btn btn-sm btn-soft-danger"><i class="mdi mdi-delete-outline"></i></a>
                    <div class="modal fade" id="remove${data.id}" tabindex="-1" aria-labelledby="ajouterclientModalLabel" style="display: none;" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-sm">
                            <div class="modal-content">
                                <div class="modal-body px-4 py-5 text-center">
                                    <button type="button" class="btn-close position-absolute end-0 top-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
                                    <div class="avatar-sm mb-4 mx-auto">
                                        <div class="avatar-title bg-primary text-primary bg-opacity-10 font-size-20 rounded-3">
                                            <i class="mdi mdi-trash-can-outline"></i>
                                        </div>
                                    </div>
                                    <p class="text-muted font-size-16 mb-4">Êtes-vous sûr de vouloir supprimer ${data.name} ?</p>
                                    
                                    <div class="hstack gap-2 justify-content-center mb-0">
                                        <button type="button" class="btn btn-secondary" id="close-removeProductModal" data-bs-dismiss="modal">Fermer</button>
                                        <a type="button" class="btn btn-danger" id="remove-item" data-bs-dismiss="modal" onclick='supprimerData(12)'>Supprimer</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </td>
      </tr>
    `;
  }
  
  // Fermeture du tableau
  tableauHTML += `
      </tbody>
    </table>
  `
  document.getElementById('tableau').innerHTML = tableauHTML;
};
  
export const getMaxID = (dataJSON) => {
    let maxID = localStorage.getItem('maxID') ? parseInt(localStorage.getItem('maxID')) : 0;
    for (const data of dataJSON) {
      if (data.id > maxID) {
        maxID = data.id;
      }
    }
    localStorage.setItem('maxID', maxID);
    console.log('Identifiant le plus élevé mis à jour');
};
  
export const ajouterData = (event, dataJSON) => {
    // Empêche le comportement par défaut de soumission du formulaire
    event.preventDefault();

    // Récupération des références aux champs de saisie
    const nomInput = document.getElementById('nom');
    const emailInput = document.getElementById('email');
    const deviseInput = document.getElementById('devise');

    // Récupération de l'identifiant maximum existant dans le stockage local ou initialisation à 0
    let maxID = parseInt(localStorage.getItem('maxID')) || 0;

    // Incrémentation de l'identifiant pour la nouvelle entrée
    maxID++;

    // Création du nouvel objet de données avec l'identifiant incrémenté
    const newdata = {
        id: maxID,
        name: nomInput.value,
        email: emailInput.value,
        devise: deviseInput.value,
    };

    // Ajout de l'objet newdata directement au tableau dataJSON
    dataJSON.push(newdata);

    // Mise à jour du stockage local avec le nouvel identifiant maximum et dataJSON
    localStorage.setItem('maxID', maxID);
    localStorage.setItem('data', JSON.stringify(dataJSON));

    // Appel de la fonction rechargerTable pour mettre à jour le tableau (en supposant qu'elle existe)
    this.rechargerTable();
};

export const supprimerData = (id) => {
    alert(dataJSON)
    const index = dataJSON.findIndex(element => element.id === id);
  
    if (index !== -1) {
      dataJSON.splice(index, 1);
  
      localStorage.setItem("data", JSON.stringify(dataJSON));
  
      return dataJSON;
    } else {
      console.error(`Élément avec l'ID ${id} introuvable dans le stockage local`);
      return dataJSON; 
    }
};
  
export const modifierData = (event, id, dataJSON) => {
    event.preventDefault();
  
    const index = dataJSON.findIndex(data => data.id === id);
  
    const newdata = {
      name: document.getElementById("nom_edit" + id).value,
      email: document.getElementById("email_edit" + id).value,
      devise: document.getElementById("devise_edit" + id).value
    };
  
    if (index !== -1) {
      dataJSON[index] = { ...dataJSON[index], ...newdata };
  
      localStorage.setItem("data", JSON.stringify(dataJSON));
  
      return dataJSON;
    } else {
      console.error(`Élément avec l'ID ${id} introuvable dans le stockage local`);
      return dataJSON; // Return the unmodified data
    }
};
  
export const rechercherData = (mot_cle, dataJSON) => {
    const nom_rechercher = mot_cle.toLowerCase();
    
    const donneesFiltrees = dataJSON.filter(data => {
        return data.name.toLowerCase().includes(nom_rechercher);
    });
    
    return donneesFiltrees;
};
  