// -- Mi JS -- //

// Mis tags
const tags = ["MEL", "AMOR", "PAPI", "MINECRAFT", "FLORES", "PLANTITAS", "CHIKI", "RICO", "DON-OMAR"];

// Obtén los elementos
const searchIcon = document.querySelector('.search-icon');
const searchInput = document.getElementById('search-input');
let clickedOnSearch = false; // Variable para rastrear si se hizo clic en la lupa
const autocompleteContainer = document.querySelector('.autocomplete-container');

// Contenedor para el mensaje de "No se han encontrado publicaciones"
const noResultsMessage = document.getElementById('no-results');

// Función para activar el campo de búsqueda
searchIcon.addEventListener('click', () => {
  searchIcon.classList.add('hidden'); // Oculta la lupa
  searchInput.classList.add('active'); // Muestra el campo de búsqueda
  searchInput.focus(); // Coloca el cursor en el campo de búsqueda
  clickedOnSearch = true; // Marca que se hizo clic en la lupa
  autocompleteContainer.style.display = 'flex'; // Muestra el autocompletado cuando se usa la lupa
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm === "") {
    autocompleteContainer.style.display = 'none'; // Oculta el contenedor si el campo está vacío
  } else {
    // Filtra las etiquetas que contienen el término de búsqueda
    const filteredTags = tags.filter(tag => tag.toLowerCase().includes(searchTerm));
    
    // Muestra las sugerencias filtradas solo si hay coincidencias
    if (filteredTags.length > 0) {
      showSuggestions(filteredTags); // Muestra las sugerencias filtradas
      autocompleteContainer.style.display = 'flex'; // Muestra el contenedor
    } else {
      autocompleteContainer.style.display = 'none'; // Si no hay coincidencias, oculta el contenedor
    }
  }
});

// Función para cerrar el campo de búsqueda al hacer clic fuera
document.addEventListener('click', (event) => {
  if (!searchInput.contains(event.target) && event.target !== searchIcon) {
    searchInput.classList.remove('active'); // Oculta el campo de búsqueda
    searchIcon.classList.remove('hidden'); // Vuelve a mostrar la lupa
    clickedOnSearch = false; // Reinicia la marca
    autocompleteContainer.style.display = 'none'; // Oculta el autocompletado al hacer clic fuera
  }
});

// Seleccionamos el header
const header = document.getElementById('header');

// Detectamos el evento de scroll
window.addEventListener('scroll', function() {
  if (window.scrollY > 0) { // Si el scroll es mayor que 0
    header.classList.add('scrolled'); // Añadir clase scrolled
  } else {
    header.classList.remove('scrolled'); // Eliminar la clase cuando el scroll es 0
  }

  // Si el input está activo y el scroll no fue causado por la búsqueda, quita el foco
  if (clickedOnSearch) {
    searchInput.focus(); // Asegura el foco después del scroll
    clickedOnSearch = false; // Reinicia la marca
  }
});

// --- FILTRADO DE POSTS --- //

// Seleccionamos todos los posts
const posts = document.querySelectorAll('.post');

// Función para convertir la fecha en formato DD-MM-YYYY a YYYY-MM-DD
function parseDate(dateString) {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);
}

// Función para filtrar y ordenar los posts
function filterPosts() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  // Filtramos los posts por la etiqueta
  const filteredPosts = Array.from(posts).filter(post => {
    const tags = post.getAttribute('data-tags').toLowerCase();
    return tags.includes(searchTerm); // Solo incluir los posts que contienen la etiqueta buscada
  });

  // Ordenamos los posts por fecha (de más reciente a más antiguo)
  filteredPosts.sort((a, b) => {
    const dateA = parseDate(a.getAttribute('data-date'));
    const dateB = parseDate(b.getAttribute('data-date'));
    return dateB - dateA; // Orden descendente (más reciente primero)
  });

  // Mostramos solo los posts filtrados y ordenados
  posts.forEach(post => {
    post.style.display = 'none'; // Ocultamos todos los posts primero
  });

  filteredPosts.forEach(post => {
    post.style.display = 'block'; // Mostramos los posts filtrados
  });

  // Mostrar el mensaje si no se encuentran publicaciones
  if (filteredPosts.length === 0) {
    noResultsMessage.innerHTML = `                <blockquote> <i class="fa fa-ban"></i> No se han encontrado publicaciones que contengan: <strong>${searchInput.value.trim().toUpperCase()}</strong></blockquote>`
    noResultsMessage.style.display = 'block'; // Muestra el mensaje de no resultados
  } else {
    noResultsMessage.style.display = 'none'; // Oculta el mensaje si hay resultados
  }
}

// Evento para realizar la búsqueda cuando el usuario presiona "Enter"
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    filterPosts(); // Llamamos a la función de filtrado y ordenación
  }
});

// También podemos realizar la búsqueda cuando el usuario escriba
searchInput.addEventListener('input', filterPosts);

// --- AUTOCOMPLETADO --- //

// Función para mostrar las sugerencias de autocompletado
function showSuggestions(filteredTags) {
  // Limita la cantidad de sugerencias a 3
  const maxSuggestions = 3;
  const limitedTags = filteredTags.slice(0, maxSuggestions); // Toma solo las primeras 3 etiquetas

  // Limpia el contenedor antes de agregar nuevas sugerencias
  autocompleteContainer.innerHTML = "";

  // Si hay sugerencias, las agregamos al contenedor
  limitedTags.forEach(tag => {
    const item = document.createElement('div');
    item.classList.add('autocomplete-item');
    item.textContent = tag;

    // Agrega un evento para seleccionar una sugerencia al hacer clic
    item.addEventListener('click', () => {
      searchInput.value = tag; // Pone la etiqueta seleccionada en el campo de búsqueda
      autocompleteContainer.innerHTML = ""; // Limpia las sugerencias
      filterPosts(); // Filtra los posts después de seleccionar la etiqueta
    });

    autocompleteContainer.appendChild(item); // Agrega la sugerencia al contenedor
  });

  // Si no hay sugerencias, ocultamos el contenedor
  if (limitedTags.length === 0) {
    autocompleteContainer.style.display = 'none';
  } else {
    autocompleteContainer.style.display = 'flex'; // Muestra el contenedor
  }
}

// Función para manejar la entrada del usuario en el campo de búsqueda
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase().trim(); // Obtiene el valor en minúsculas

  if (searchTerm === "") {
    autocompleteContainer.style.display = 'none'; // Oculta el contenedor si el campo está vacío
  } else {
    // Filtra las etiquetas que contienen el término de búsqueda
    const filteredTags = tags.filter(tag => tag.toLowerCase().includes(searchTerm));

    // Muestra las sugerencias filtradas solo si hay coincidencias
    if (filteredTags.length > 0) {
      showSuggestions(filteredTags); // Muestra las sugerencias filtradas
      autocompleteContainer.style.display = 'flex'; // Muestra el contenedor
    } else {
      autocompleteContainer.style.display = 'none'; // Si no hay coincidencias, oculta el contenedor
    }
  }
});

// --- Mostramos el mensaje de no resultados --- //

const searchInfo = document.getElementById('search-info');
const postsDescription = document.querySelector(".posts-description")

// Función para mostrar u ocultar los divs de acuerdo con la resolución de pantalla
function updateSearchInfoDisplay() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm === "") {
    searchInfo.style.display = 'none';
  } else {
    searchInfo.style.display = 'block';
  }
}

// Actualiza el texto de "Buscando por: [término]" con <strong> alrededor del término
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm !== "") {
    postsDescription.style.display = 'none'
    // Usamos innerHTML para insertar HTML dentro del texto
    searchInfo.innerHTML = `* BUSCANDO POR: <strong>${searchInput.value.trim().toUpperCase()}</strong>`;

    updateSearchInfoDisplay(); // Llama a la función para mostrar u ocultar según la resolución
  } else {
    updateSearchInfoDisplay(); // Si no hay búsqueda, ocultamos ambos
    postsDescription.style.display = 'block'
  }
});

// Llamamos a la función una vez al cargar la página para ajustar el estado inicial
window.addEventListener('resize', updateSearchInfoDisplay); // Asegura que se actualice cuando cambie la resolución
updateSearchInfoDisplay();

//NAV RESPONSIVE

const bars = document.querySelector(".bar-responsive");
const navResponsive = document.querySelector(".nav-responsive");
const nav = document.querySelector(".main-nav");
let menuOpenChecker = false

bars.addEventListener("click", () => {
    if (menuOpenChecker == false) {
      nav.style.transition = "background 0.25s ease";
      nav.style.background = "rgba(25, 34, 41, 1)";
      bars.style.transform = "rotate(180deg)"
      setTimeout(() => {
        navResponsive.style.transform = "translateY(185px)"; 
        menuOpenChecker = true
    }, 150);

    } else {
        setTimeout(() => {
            nav.style.transition = "background 0.3s ease"; 
            nav.style.background = "transparent";
        }, 200);

        bars.style.transform = "rotate(0deg)"
      navResponsive.style.transform = "translateY(0%)";
      menuOpenChecker = false
    }
    navResponsive.style.transition = "transform 0.3s ease"; 
  });