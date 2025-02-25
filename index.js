
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
  
function displayCategoryButtons(categories) {                    // fonction pour afficher les catégories
  const filtersDiv = document.getElementById("filters");
  filtersDiv.innerHTML = "";

  
  const allButton = document.createElement("button");            // Ajout un bouton "Toutes"
  allButton.textContent = "Tous";
  allButton.classList.add("buttonSelected");
  allButton.onclick = () => filterPhotos("all");
  filtersDiv.appendChild(allButton);

  
  categories.forEach(category => {                          // Création dynamique des boutons de catégories
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("buttonNoSelected")
    button.onclick = () => filterPhotos(category.id);
    filtersDiv.appendChild(button);
  });

  const buttons = document.querySelectorAll("button");

  buttons.forEach(button => {
      button.addEventListener("click", function () {                 // Désactive tous les boutons
          
          buttons.forEach(btn => {
              btn.classList.remove("buttonSelected");
              btn.classList.add("buttonNoSelected");
          });
          
          this.classList.add("buttonSelected");                        
          this.classList.remove("buttonNoSelected");
      });
  });
}
  
  document.addEventListener("DOMContentLoaded", fetchCategories);          // Lancement de la récupération des catégories

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
   