// Index page-specific JavaScript

// Variables globales pour le slider
let sliderPhotos = [];
let currentSlideIndex = 0;
let sliderInterval = null;

// Fonctions globales pour les boutons du slider
function nextSlide() {
    if (sliderPhotos.length === 0) return;
    currentSlideIndex = (currentSlideIndex + 1) % sliderPhotos.length;
    goToSlide(currentSlideIndex);
}

function prevSlide() {
    if (sliderPhotos.length === 0) return;
    currentSlideIndex = (currentSlideIndex - 1 + sliderPhotos.length) % sliderPhotos.length;
    goToSlide(currentSlideIndex);
}


let currentPhoto = null; // Variable globale pour la photo actuellement ouverte dans le modal

document.addEventListener('DOMContentLoaded', function() {

    function initSlider() {
    const sliderImages = document.getElementById('sliderImages');
    const indicators = document.getElementById('sliderIndicators');

    if (!sliderImages || !indicators) {
        console.error('Éléments du slider non trouvés');
        return;
    }

    sliderImages.innerHTML = '';
    indicators.innerHTML = '';

    if (sliderPhotos.length === 0) {
        sliderImages.innerHTML = '<div class="w-full flex items-center justify-center text-gray-500 bg-gray-200">Aucune photo disponible</div>';
        return;
    }

    // Créer les images du slider
    sliderPhotos.forEach((photo, index) => {
        const slide = document.createElement('div');
        slide.className = 'min-w-full h-full flex-shrink-0 cursor-pointer';
        slide.style.backgroundImage = `url(${photo.url})`;
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        slide.onclick = () => openModal(photo);
        sliderImages.appendChild(slide);

        // Créer les indicateurs
        const indicator = document.createElement('button');
        indicator.className = `w-3 h-3 rounded-full transition ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`;
        indicator.onclick = () => goToSlide(index);
        indicators.appendChild(indicator);
    });

    // Initialiser à la première slide
    currentSlideIndex = 0;
    goToSlide(0);

    // Masquer les boutons et indicateurs s'il n'y a qu'une seule photo
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (sliderPhotos.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (indicators) indicators.style.display = 'none';
    } else {
        if (prevBtn) prevBtn.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'block';
        if (indicators) indicators.style.display = 'flex';
    }

    // Auto-play toutes les 5 secondes (seulement si plus d'une photo)
    if (sliderInterval) clearInterval(sliderInterval);
    if (sliderPhotos.length > 1) {
        sliderInterval = setInterval(nextSlide, 5000);
    }
}

function goToSlide(index) {
    if (sliderPhotos.length === 0) return;
    
    currentSlideIndex = index % sliderPhotos.length;
    const sliderImages = document.getElementById('sliderImages');
    if (!sliderImages) return;
    
    sliderImages.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    // Mettre à jour les indicateurs
    const indicators = document.querySelectorAll('#sliderIndicators button');
    indicators.forEach((ind, i) => {
        ind.className = `w-3 h-3 rounded-full transition ${i === currentSlideIndex ? 'bg-blue-600' : 'bg-gray-300'}`;
    });
}

function openModal(photo) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');

    // Définir currentPhoto pour openFullscreen
    currentPhoto = photo;

    modalImage.src = photo.url;
    modalTitle.textContent = photo.title || 'Sans titre';
    modalText.textContent = photo.description || 'Aucune description disponible.';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('photoModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto';
}

function openFullscreen() {
    if (!currentPhoto) return;

    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.id = 'fullscreenContainer';
    fullscreenDiv.className = 'fixed inset-0 bg-black z-[9999] flex items-center justify-center';
    fullscreenDiv.style.display = 'flex';

    const img = document.createElement('img');
    img.src = currentPhoto.url;
    img.className = 'max-w-full max-h-full object-contain';
    img.alt = currentPhoto.title || 'Photo';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center';
    closeBtn.onclick = closeFullscreen;

    fullscreenDiv.appendChild(img);
    fullscreenDiv.appendChild(closeBtn);
    document.body.appendChild(fullscreenDiv);

    if (fullscreenDiv.requestFullscreen) {
        fullscreenDiv.requestFullscreen();
    } else if (fullscreenDiv.webkitRequestFullscreen) {
        fullscreenDiv.webkitRequestFullscreen();
    } else if (fullscreenDiv.msRequestFullscreen) {
        fullscreenDiv.msRequestFullscreen();
    }

    document.addEventListener('keydown', handleFullscreenKey);
}

function handleFullscreenKey(e) {
    if (e.key === 'Escape') {
        closeFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    const container = document.getElementById('fullscreenContainer');
    if (container) {
        container.remove();
    }

    document.removeEventListener('keydown', handleFullscreenKey);
}


async function loadGallery() {
    const galleryDiv = document.getElementById('gallery');
    if (!galleryDiv) {
        console.error('Élément gallery non trouvé');
        return;
    }

    galleryDiv.innerHTML = '<div class="col-span-full text-center text-gray-500">Chargement...</div>';

    try {
        const response = await fetch('/gallery');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const gallery = await response.json();

        console.log('Galerie chargée:', gallery.length, 'photos');

        // Charger les 6 dernières photos pour le slider
        sliderPhotos = gallery.slice(-6).reverse(); // Les plus récentes en premier
        console.log('Photos pour le slider:', sliderPhotos.length);
        initSlider();

        galleryDiv.innerHTML = '';
        if (!gallery.length) {
            galleryDiv.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">Aucune photo pour le moment.</div>';
            return;
        }

        // Afficher les 4 premières photos
        const photosToShow = gallery.slice(0, 4);
        photosToShow.forEach(photo => {
            if (!photo.url) {
                console.warn('Photo sans URL:', photo);
                return;
            }

            const div = document.createElement('div');
            div.className = 'relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer';
            div.onclick = () => openModal(photo);

            const img = document.createElement('img');
            img.src = photo.url;
            img.className = 'w-full h-64 object-cover';
            img.alt = photo.title || 'Photo portfolio';
            img.loading = 'lazy';
            img.onerror = function() {
                console.error('Erreur de chargement de l\'image:', photo.url);
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5FcnJldXIgZGUgY2hhcmdlbWVudDwvdGV4dD48L3N2Zz4=';
            };

            div.appendChild(img);
            galleryDiv.appendChild(div);
        });
    } catch (error) {
        console.error('Erreur lors du chargement de la galerie:', error);
        galleryDiv.innerHTML = '<div class="col-span-full text-center text-red-600 py-8">Impossible de charger la galerie: ' + error.message + '</div>';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Fermer le modal en cliquant en dehors
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('photoModal');
        if (e.target === modal) {
            closeModal();
        }
    });

    // Chargement initial
    loadGallery();
});
