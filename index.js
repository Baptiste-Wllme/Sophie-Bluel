
const API_CATEGORIES = "http://localhost:5678/api/categories"; // récupération des catégories sur l'API via une constante

async function fetchCategories() {          // création d'une fonction async pour intégrer les catégories
  try {
    const response = await fetch(API_CATEGORIES, {          // constante pour l'appel des catégories
      method: "GET",                                   // GET car ele existe déjà ( on va les chercher)
      headers: { "Accept": "application/json" }          // réception en JSON
    });
    if (!response.ok) {                                    // si la réponse n'est pas ok, alorsm essage d'erreur
      throw new Error(`Erreur HTTP : ${response.status}`);
    }
    const categories = await response.json();                      // constante qui attend la réponse en JSON
    displayCategoryButtons(categories);                              // exécution de la fonction pour afficher les catégories
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories :", error);
  }
}

function filterPhotos(categoryId) {                                      // création fonction filter photo
  fetch("http://localhost:5678/api/works")                               // fetch pour appeler l'API
  .then(response => response.json())                                          // réponse en JSON
  .then(data => {
    const gallery = document.getElementById("gallery");                    // récupération de " gallery " dans le HTML
    gallery.innerHTML ="";                                                 // Vider la galerie avant d'ajouter les nouvelles images
    const filteredWorks = categoryId === "all" ? data : data.filter(work => work.categoryId === categoryId);   // si la categoryID === all, alors filterworks affiche toutesl es photos, sinon on applique data.filter

    filteredWorks.forEach(work => {                                // pour tous les travaux
      const figure = document.createElement("figure");                // création de l'élément figure

      const img = document.createElement("img");                 // création de l'élément img
      img.src = work.imageUrl;                                   // la source de l'image est = à l'url de l'image
      img.alt = work.title;                                 

      const caption = document.createElement("figcaption");             // création de l'éléement figcation
      caption.textContent = work.title;                                 // le contenu de caption est le titre du travail

      figure.appendChild(img);                                               // figure est dans img
      figure.appendChild(caption);                                           // figure est dans caption
      gallery.appendChild(figure);                                           // gallery est dans figure
    });
  })
  .catch(error => console.error("Erreur lors du filtrage des photos :", error));  // message error
}
 
  
function displayCategoryButtons(categories) {                    // fonction pour afficher les catégories
  const filtersDiv = document.getElementById("filters");
  filtersDiv.innerHTML = "";

  
  const allButton = document.createElement("button");            // Ajout un bouton "Toutes"
  allButton.textContent = "Tous";
  allButton.classList.add("buttonSelected");
  allButton.onclick = () => filterPhotos("all");
  filtersDiv.appendChild(allButton);
  filterPhotos("all")

  
  categories.forEach(category => {                          // Création dynamique des boutons de catégories
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("buttonNoSelected")
    button.onclick = () => filterPhotos(category.id);
    filtersDiv.appendChild(button);
  });

  const filterButtons = document.querySelectorAll("#filters button");

  filterButtons.forEach(button => {                                       
      button.addEventListener("click", function () {                 // Désactive tous les boutons
          
          filterButtons.forEach(btn => {
              btn.classList.remove("buttonSelected");
              btn.classList.add("buttonNoSelected");
          });
          
          this.classList.add("buttonSelected");                        
          this.classList.remove("buttonNoSelected");
      });
  });
}
  
  document.addEventListener("DOMContentLoaded", fetchCategories);          // Lancement de la récupération des catégories

// MODAL

  const openModalBtn = document.getElementById("openModalBtn");       // Sélection du bouton openmodalbtn

  openModalBtn.addEventListener("click", (event) => {             // évènement au click
    event.target.classList.remove("buttonSelected", "buttonNoSelected");
    event.stopPropagation();                                      // Empêche d'autres événements d'affecter le bouton
    event.preventDefault();                                       // Empêche l'ajout automatique de classes si cela vient d'un comportement par défaut
    modal.style.display = "flex";                                          // Change le display de none en flex
  
});    

const modal = document.getElementById("modal"); 
const closeModal = document.querySelector(".close");

openModalBtn.addEventListener("click", () => {
  modal.style.display = "flex";                                          // Change le display de none en flex
  loadProjectsInModal();                                                  // Charge les projets
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";                                    // Cache la modale au click sur la croix
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";                                 // Cache la modale si tu clique à coté
  }
});
function loadProjectsInModal() {                                   // création fonction
  fetch("http://localhost:5678/api/works")                         // appel de l'API
    .then(response => response.json())                              // réponse en json
    .then(data => {
      const modalGallery = document.getElementById("modalGallery");              //répurétion de modal gallery
      modalGallery.innerHTML = "";                                               // Efface le contenu précédent
     
      data.forEach(work => {                                                            // pour tous les works ..
        const figure = document.createElement("figure");     
     
        const img = document.createElement("img");     
        img.src = work.imageUrl;                                                 // correspondance avec les données sur l'API
        img.alt = work.title;     
        img.style.width = "100px";                                                // Taille plus petite pour la modale
     
        const caption = document.createElement("figcaption");                     
        caption.textContent = "";     
     
        const deleteBtn = document.createElement("button");                           // création du boutton pour supprimer
        deleteBtn.textContent = "🗑️";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.classList ="trash";
        deleteBtn.style.cursor = "pointer";

                                                                             
         deleteBtn.addEventListener("click", () => deleteProject(work.id));   // Supprimer un projet
   
         figure.appendChild(img);
         figure.appendChild(caption);
         figure.appendChild(deleteBtn);
         modalGallery.appendChild(figure);
       });
     })
     .catch(error => console.error("Erreur lors de la récupération des projets :", error));
 }

 function deleteProject(projectId) {
  fetch(`http://localhost:5678/api/works/${projectId}`, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`     // ??? 
      }
  })
  .then(response => {
      if (response.ok) {
          console.log("Projet supprimé avec succès !");
          loadProjectsInModal();                       // Recharger la modale et la galerie principale après suppression
          loadGallery();
          
          document.getElementById("modal").style.display = "none";  // ferme le modal
          
      } else {
          console.error("Erreur lors de la suppression du projet.");
      }
  })
  .catch(error => console.error("Erreur lors de la suppression :", error));
}

function loadGallery() {                                            // fonction pour afficher la gallery
  fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(data => {
          const gallery = document.getElementById("gallery");
          gallery.innerHTML = "";                                      // Efface l'ancienne galerie

          data.forEach(work => {
              const figure = document.createElement("figure");
              const img = document.createElement("img");
              img.src = work.imageUrl;
              img.alt = work.title;

              const caption = document.createElement("figcaption");
              caption.textContent = work.title;

              figure.appendChild(img);
              figure.appendChild(caption);
              gallery.appendChild(figure);
          });
      })
      .catch(error => console.error("Erreur lors du chargement de la galerie :", error));
}



const modalGalleryView = document.getElementById("modal-gallery-view");
const modalFormView = document.getElementById("modal-form-view");               // le formulaire d'ajout
const addProjectBtn = document.getElementById("addProjectBtn");               // bouton ajouter
const backToGalleryBtn = document.getElementById("backToGalleryBtn");             // bouton retour

                                                       
addProjectBtn.addEventListener("click", () => {                       // Afficher le formulaire et masquer la galerie
    modalGalleryView.classList.add("hidden");
    modalFormView.classList.remove("hidden");
});


backToGalleryBtn.addEventListener("click", () => {                    // Retourner à la galerie et masquer le formulaire
    modalFormView.classList.add("hidden");
    modalGalleryView.classList.remove("hidden");
});     

document.getElementById("imageUpload").addEventListener("change", function(event) {
  const file = event.target.files[0];                                                 // Récupère le fichier sélectionné
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const img = document.getElementById("imagePreview");
          img.src = e.target.result;                                                  // Met l'image en source
          img.style.display = "block";                                                // Affiche l'image
          document.getElementById("previewIcon").style.display = "none";              // Cache le SVG
          document.getElementById("addPhoto").style.display = "none";                  // cache le bouton ajouter photo
          document.getElementById("Size-img").style.display = "none";                  // cache les paramètre pour la photo
          checkFormCompletion();                                                       // Vérifie le formulaire après sélection
      };
      reader.readAsDataURL(file);                                                     // Convertit le fichier en URL
  }
});

const imageUpload = document.getElementById("imageUpload");
const titleInput = document.getElementById("titleInput");
const categorySelect = document.getElementById("category");
const validateButton = document.querySelector(".validation-button-off");
const previewIcon = document.getElementById("previewIcon");
const imagePreview = document.getElementById("imagePreview");


function checkFormCompletion() {                                                                     // Fonction pour vérifier si tous les champs sont remplis
    const isImageSelected = imagePreview.src && imagePreview.style.display === "block";
    const isTitleFilled = titleInput.value.trim() !== "";
    const isCategorySelected = categorySelect.value !== "";

    if (isImageSelected && isTitleFilled && isCategorySelected) {                    // si l'image est sélectionné, que le titre est choisi et que la catégorie est sélectionnée alors .. 
        validateButton.classList.remove("validation-button-off");                    // supprime la class
        validateButton.classList.add("validation-button-on");                        // ajoute une class
        validateButton.disabled = false;                                             // Active le bouton
    } else {
        validateButton.classList.remove("validation-button-on");
        validateButton.classList.add("validation-button-off");
        validateButton.disabled = true;                                             // Désactive le bouton
    }
}

                                                                                    // Événements pour vérifier le formulaire à chaque modification
titleInput.addEventListener("input", checkFormCompletion);
categorySelect.addEventListener("change", checkFormCompletion);


const projectGallery = document.getElementById("gallery");                  // const gallery

validateButton.addEventListener("click", function (event) {
    event.preventDefault();                                   // Empêche le rechargement de la page

    const imageSrc = imagePreview.src;
    const title = titleInput.value.trim();
    const category = categorySelect.options[categorySelect.selectedIndex].text;

    if (imageSrc && title && category) {
                                                                // Création d'un nouvel élément projet
        const projectItem = document.createElement("div");
        

                                                           
        const img = document.createElement("img");               // Ajout de l'image
        img.src = imageSrc;
        img.alt = title;
        projectItem.appendChild(img);

        
        const titleElement = document.createElement("p");             // Ajout du titre
        titleElement.textContent = title;
        projectItem.appendChild(titleElement);

        
        const categoryElement = document.createElement("span");      // Ajout de la catégorie
        categoryElement.textContent = category;
        projectItem.appendChild(categoryElement);

        
        projectGallery.appendChild(projectItem);                    // Ajout à la galerie

        
        imagePreview.src = "";                                   // Réinitialisation du formulaire
        imagePreview.style.display = "none";
        previewIcon.style.display = "block";                     // Réaffiche l’icône
        titleInput.value = "";
        categorySelect.value = "";
        checkFormCompletion();                                   // Désactive le bouton valider après soumission

        modal.style.display = "none";  // Ferme le modal
    }
  const imageInput = document.getElementById("imageUpload");
  const titleInput = document.getElementById("titleInput");
  const categoryInput = document.getElementById("category");

  if (imageInput.files.length === 0 || titleInput.value.trim() === "" || categoryInput.value === "") {
      alert("Veuillez remplir tous les champs !");                                        // si il manque un élément, le message s'affiche
      return;
  }

  const formData = new FormData();
  formData.append("image", imageInput.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categoryInput.value);

  
  fetch("http://localhost:5678/api/works", {                   // Envoi à l'API
      method: "POST",                                          // pour ajouter
      headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}` // si token alors .. 
      },
      body: formData
  })
  .then(response => response.json())
  .then(data => {
      console.log("Projet ajouté avec succès :", data);

      
      addImageToGallery(data);          // Ajouter immédiatement l'image à la galerie principale

      
      document.getElementById("modal").style.display = "none";    // Fermer la modale

      
      resetModalForm();  // Réinitialiser le formulaire
  })
  .catch(error => console.error("Erreur lors de l'ajout du projet :", error));
});

function addImageToGallery(work) {
  const gallery = document.getElementById("gallery");

  const figure = document.createElement("figure");

  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;

  const caption = document.createElement("figcaption");
  caption.textContent = work.title;

  figure.appendChild(img);
  figure.appendChild(caption);
  gallery.appendChild(figure);
}

function resetModalForm() {
  document.getElementById("imageUpload").value = "";
  document.getElementById("titleInput").value = "";
  document.getElementById("category").value = "";
  document.getElementById("imagePreview").style.display = "none"; // Cacher l'aperçu
  document.getElementById("previewIcon").style.display = "block"; // Remettre l'icône
}




