document.addEventListener('DOMContentLoaded', () => {
    // Dados dos artistas 
    const artistsData = [
        { name: 'Henrique & Juliano', image: './img/artista-henrique-juliano.jpg' },
        { name: 'Jorge & Mateus', image: './img/artista-jorge-mateus.jpg' },
        { name: 'Zé Neto & Cristiano', image: './img/artista-ze-neto.jpg' },
        { name: 'Gusttavo Lima', image: './img/artista-gustavo-limma.jpg' },
        { name: 'Luan Santana', image: './img/artista-luan-santana.jpg' },
        { name: 'Matheus & Kauan', image: './img/artista-mateus-kauan.jpg' }
    ];

    // Dados dos álbuns
    const albumsData = [
        { name: 'White Noise (Sleep & Relaxation Sounds)', artist: 'Sleepy John', image: './img/album-white-noise.jpg' },
        { name: 'O Céu Explica Tudo (Ao Vivo)', artist: 'Henrique & Juliano', image: './img/album-ceu-explica.jpg' },
        { name: 'Nada como um dia após o outro', artist: 'Racionais', image: './img/album-racionais.jpg' },
        { name: 'HIT ME HARD AND SOFT', artist: 'Billie Eilish', image: './img/album-hit-me.jpg' },
        { name: 'CAJU', artist: 'Liniker', image: './img/album-caju.jpg' },
        { name: 'Escândalo Íntimo', artist: 'Luísa Sonza', image: './img/album-escandalo.jpg' }
    ];

    const artistsGrid = document.querySelector('.artists-grid');
    const albumsGrid = document.querySelector('.albums-grid');

    // Renderiza os cards de artistas
    artistsData.forEach(artist => {
        const artistCard = document.createElement('div');
        artistCard.classList.add('artist-card');
        artistCard.innerHTML = `
            <img src="${artist.image}" alt="Imagem do ${artist.name}">
            <h3>${artist.name}</h3>
            <p>Artista</p>
        `;
        artistsGrid.appendChild(artistCard);
    });

    // Renderiza os cards de álbuns
    albumsData.forEach(album => {
        const albumCard = document.createElement('div');
        albumCard.classList.add('album-card');
        albumCard.innerHTML = `
            <img src="${album.image}" alt="${album.name}">
            <div class="album-info">
                <h3>${album.name}</h3>
                <p>${album.artist}</p>
            </div>
        `;
        albumsGrid.appendChild(albumCard);
    });

    setupCarousels();
});

// Configura navegação por setas e estado visual dos cards cortados nos carrosséis
function setupCarousels() {
    const wrappers = document.querySelectorAll('.carousel-wrapper');

    wrappers.forEach((wrapper) => {
        const track = wrapper.querySelector('.artists-grid, .albums-grid');
        const prevBtn = wrapper.querySelector('.carousel-btn.prev');
        const nextBtn = wrapper.querySelector('.carousel-btn.next');

        if (!track || !prevBtn || !nextBtn) return;

        // Atualiza visibilidade das setas e opacidade dos cards cortados nas bordas
        const updateCarouselState = () => {
            const maxScrollLeft = track.scrollWidth - track.clientWidth;
            prevBtn.classList.toggle('hidden', track.scrollLeft <= 2);
            nextBtn.classList.toggle('hidden', maxScrollLeft <= 2 || track.scrollLeft >= maxScrollLeft - 2);

            const trackRect = track.getBoundingClientRect();
            const cards = track.querySelectorAll('.artist-card, .album-card');

            cards.forEach((card) => {
                const cardRect = card.getBoundingClientRect();
                const isCutLeft = cardRect.left < trackRect.left - 2 && cardRect.right > trackRect.left + 2;
                const isCutRight = cardRect.right > trackRect.right + 2 && cardRect.left < trackRect.right - 2;

                card.classList.toggle('card-clipped', isCutLeft || isCutRight);
            });
        };

        // Exibe as setas apenas quando o cursor passa sobre um card
        track.addEventListener('mouseover', (event) => {
            const card = event.target.closest('.artist-card, .album-card');
            if (card && track.contains(card)) {
                wrapper.classList.add('card-hovered');
            }
        });

        wrapper.addEventListener('mouseleave', () => {
            wrapper.classList.remove('card-hovered');
        });

        prevBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const scrollAmount = Math.max(track.clientWidth * 0.75, 200);
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const scrollAmount = Math.max(track.clientWidth * 0.75, 200);
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        track.addEventListener('scroll', updateCarouselState);
        window.addEventListener('resize', updateCarouselState);

        requestAnimationFrame(updateCarouselState);
    });
}

// Exibe a barra de rolagem do main apenas quando o cursor estiver sobre ele
const mainContent = document.querySelector('main');

// Verifica se o elemento main existe antes de adicionar os event listeners
if (mainContent) {

    // Adiciona/remover a classe 'show-scrollbar' ao passar o mouse sobre o main
    mainContent.addEventListener('mouseenter', () => {
        mainContent.classList.add('show-scrollbar');
    });


    // Remove a classe 'show-scrollbar' quando o mouse sair do main
    mainContent.addEventListener('mouseleave', () => {
        mainContent.classList.remove('show-scrollbar');
    });
}

// Expande/recolhe a barra de pesquisa ao clicar em telas menores
const searchBar = document.querySelector('.search-bar');
const searchInput = searchBar?.querySelector('input');

// Verifica se os elementos existem antes de adicionar os event listeners
if (searchBar && searchInput) {

    // Expande a barra de pesquisa ao clicar nela em telas menores
    searchBar.addEventListener('click', () => {
        if (window.innerWidth <= 1024 && !searchBar.classList.contains('expanded')) {
            searchBar.classList.add('expanded');
            searchInput.focus();
        }
    });

    // Fecha a barra de pesquisa se o usuário clicar fora dela
    document.addEventListener('click', (event) => {
        if (!searchBar.contains(event.target)) {
            searchBar.classList.remove('expanded');
        }
    });
}

// Controla abertura, fechamento e ícone do menu dropdown mobile
const menuWrapper = document.querySelector('.mobile-menu-wrapper');
const menuToggleBtn = document.querySelector('.menu-toggle-button');
const menuDropdown = document.querySelector('.mobile-menu-dropdown');

// Verifica se os elementos existem antes de adicionar os event listeners
if (menuWrapper && menuToggleBtn && menuDropdown) {
    const toggleIcon = menuToggleBtn.querySelector('i');

    // Função para fechar o menu
    const closeMenu = () => {
        menuDropdown.classList.remove('open');
        menuToggleBtn.setAttribute('aria-expanded', 'false');

        // Alterna o ícone do botão de volta para "fa-bars" quando o menu é fechado
        if (toggleIcon) {
            toggleIcon.classList.remove('fa-xmark');
            toggleIcon.classList.add('fa-bars');
        }
    };

    // Adiciona event listener para o botão de toggle do menu
    menuToggleBtn.addEventListener('click', (event) => {

        // Impede que o clique no botão feche o menu imediatamente
        event.stopPropagation();

        // Alterna a classe 'open' no menu dropdown e atualiza o atributo aria-expanded
        const isOpen = menuDropdown.classList.toggle('open');

        // Atualiza o atributo aria-expanded do botão de toggle
        menuToggleBtn.setAttribute('aria-expanded', String(isOpen));

        // Alterna o ícone do botão entre "fa-bars" e "fa-xmark"
        if (toggleIcon) {
            toggleIcon.classList.toggle('fa-bars', !isOpen);
            toggleIcon.classList.toggle('fa-xmark', isOpen);
        }
    });

    // Fecha o menu se o usuário clicar fora dele
    document.addEventListener('click', (event) => {

        // Impede que o clique no botão de toggle feche o menu imediatamente
        if (!menuWrapper.contains(event.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 820) {
            closeMenu();
        }
    });
}