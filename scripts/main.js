// ============================================================================
// Constants & Data
// ============================================================================
const CARDS_DATA = [
    {
        id: 1,
        name: "by Jerome Bell",
        price: "$100",
        category: "marketing",
        info: "The Ultimate Google Ads Training Course",
        image: "images/cards/imageJeromeBell.png",
    },
    {
        id: 2,
        name: "by Marvin McKinney",
        price: "$480",
        category: "management",
        info: "Product Management Fundamentals",
        image: "images/cards/imageMarvinMcKinney.png",
    },
    {
        id: 3,
        name: "by Leslie Alexander Li",
        price: "$200",
        category: "hr",
        info: "HR Management and Analytics",
        image: "images/cards/imageLeslieAlexanderLi.png",
    },
    {
        id: 4,
        name: "by Kristin Watson",
        price: "$530",
        category: "marketing",
        info: "Brand Management & PR Communications",
        image: "images/cards/imageKristinWatson.png",
    },
    {
        id: 5,
        name: "by Guy Hawkins",
        price: "$500",
        category: "design",
        info: "Graphic Design Basic",
        image: "images/cards/imageGuyHawkins.png",
    },
    {
        id: 6,
        name: "by Dianne Russell",
        price: "$400",
        category: "management",
        info: "Business Development Management",
        image: "images/cards/imageDianneRussell.png",
    },
    {
        id: 7,
        name: "by Brooklyn Simmons",
        price: "$600",
        category: "development",
        info: "Highload Software Architecture",
        image: "images/cards/imageBrooklynSimmons.png",
    },
    {
        id: 8,
        name: "by Kathryn Murphy",
        price: "$150",
        category: "hr",
        info: "Human Resources – Selection and Recruitment",
        image: "images/cards/imageKathrynMurphy.png",
    },
    {
        id: 9,
        name: "by Cody Fisher",
        price: "$240",
        category: "design",
        info: "User Experience. Human-centered Design",
        image: "images/cards/imageCodyFisher.png",
    },
    {
        id: 10,
        name: "by Jerome Bell",
        price: "$100",
        category: "marketing",
        info: "The Ultimate Google Ads Training Course",
        image: "images/cards/imageJeromeBell.png",
    },
    {
        id: 11,
        name: "by Jerome Bell",
        price: "$100",
        category: "marketing",
        info: "The Ultimate Google Ads Training Course",
        image: "images/cards/imageJeromeBell.png",
    },
    {
        id: 12,
        name: "by Marvin McKinney",
        price: "$480",
        category: "management",
        info: "Product Management Fundamentals",
        image: "images/cards/imageMarvinMcKinney.png",
    },
    {
        id: 13,
        name: "by Kathryn Murphy",
        price: "$150",
        category: "hr",
        info: "Human Resources – Selection and Recruitment",
        image: "images/cards/imageKathrynMurphy.png",
    },
    {
        id: 14,
        name: "by Kathryn Murphy",
        price: "$150",
        category: "hr",
        info: "Human Resources – Selection and Recruitment",
        image: "images/cards/imageKathrynMurphy.png",
    },
    {
        id: 15,
        name: "by Kathryn Murphy",
        price: "$150",
        category: "hr",
        info: "Human Resources – Selection and Recruitment",
        image: "images/cards/imageKathrynMurphy.png",
    },
    {
        id: 16,
        name: "by Brooklyn Simmons",
        price: "$600",
        category: "development",
        info: "Highload Software Architecture",
        image: "images/cards/imageBrooklynSimmons.png",
    },
    {
        id: 17,
        name: "by Brooklyn Simmons",
        price: "$600",
        category: "development",
        info: "Highload Software Architecture",
        image: "images/cards/imageBrooklynSimmons.png",
    },
];


const CATEGORIES = {
    all: "All",
    marketing: "Marketing",
    management: "Management",
    hr: "HR & Recruting",
    design: "Design",
    development: "Development"
};

// ============================================================================
// State Management
// ============================================================================
let state = {
    activeFilter: 'all',
    searchQuery: '',
    filteredCards: [...CARDS_DATA],
    loadMore: {
        visibleCount: 9,
        step: 9,
        hasMore: true
    }
};

// ============================================================================
// DOM Elements
// ============================================================================
const elements = {
    searchInput: document.querySelector('.filters__search'),
    filterButtons: document.querySelectorAll('.filters__button'),
    cardsContainer: document.getElementById('cards-container'),
    emptyState: document.getElementById('cards-empty'),
    filterCounts: document.querySelectorAll('.filters__count'),
    // Добавляем элементы для load more
    loadMoreBtn: document.getElementById('load-more-btn'),
    loadMoreWrapper: document.getElementById('load-more-wrapper'),
    loadMoreText: document.querySelector('.load-more-btn__text')
};

// ============================================================================
// Utility Functions
// ============================================================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function normalizeString(str) {
    return str.toLowerCase().trim();
}


/**
 * Показывает только часть карточек (первые N)
 */
function getVisibleCards() {
    return state.filteredCards.slice(0, state.loadMore.visibleCount);
}


/**
 * Проверяет, есть ли еще карточки для загрузки
 */
function updateHasMoreState() {
    state.loadMore.hasMore = state.loadMore.visibleCount < state.filteredCards.length;
}

/**
 * Обновляет состояние кнопки Load More
 */
function updateLoadMoreButton() {
    updateHasMoreState();

    if (state.filteredCards.length === 0) {
        // Если нет карточек вообще - скрываем кнопку
        elements.loadMoreWrapper.hidden = true;
        return;
    }

    if (!state.loadMore.hasMore) {
        elements.loadMoreWrapper.hidden = true;
    } else {
        // Показываем кнопку
        elements.loadMoreWrapper.hidden = false;
    }
}

/**
 * Обработчик клика на кнопку Load More
 */
function handleLoadMore() {
    // Увеличиваем количество видимых карточек
    const previousCount = state.loadMore.visibleCount;
    state.loadMore.visibleCount += state.loadMore.step;

    // Перерисовываем карточки
    renderCards();

    // Прокручиваем к новым карточкам (опционально)
    if (previousCount > 0) {
        scrollToNewCards();
    }
}

/**
 * Плавно прокручивает к новым карточкам
 */
function scrollToNewCards() {
    const cards = elements.cardsContainer.querySelectorAll('.card');
    if (cards.length > 0) {
        const lastCard = cards[cards.length - 1];
        lastCard.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

/**
 * Сбрасывает состояние Load More при фильтрации
 */
function resetLoadMore() {
    state.loadMore.visibleCount = 9;
    updateHasMoreState();
}

/**
 * Автоматически подсчитываем количество карточек в каждой категории
 */
function calculateCategoryCounts() {
    const counts = {
        all: CARDS_DATA.length,
        marketing: 0,
        management: 0,
        hr: 0,
        design: 0,
        development: 0
    };

    // Считаем карточки по категориям
    CARDS_DATA.forEach(card => {
        if (card.category in counts) {
            counts[card.category]++;
        }
    });

    return counts;
}

/**
 * Обновляем счетчики на кнопках фильтров
 */
function updateFilterCounts() {
    const counts = calculateCategoryCounts();

    elements.filterButtons.forEach(button => {
        const filter = button.dataset.filter;
        const countElement = button.querySelector('.filters__count');

        if (countElement && counts[filter] !== undefined) {
            countElement.textContent = counts[filter];
        }
    });
}

// ============================================================================
// Card Rendering
// ============================================================================
function createCardElement(card) {
    const cardElement = document.createElement('article');
    cardElement.className = 'card';
    cardElement.dataset.category = card.category;
    cardElement.dataset.name = normalizeString(card.info); // Ищем по info

    const categoryName = CATEGORIES[card.category] || card.category;

    cardElement.innerHTML = `
        <div class="card__image-wrapper">
            <img 
                src="${card.image}" 
                alt="${card.info}" 
                class="card__image"
                loading="lazy"
            >
        </div>
        <div class="card__content">
            <div class="card__category" data-category="${card.category}">${categoryName}</div>
            <h3 class="card__title">${card.info}</h3>
            <div class="card__meta">
                <div class="card__price">${card.price}</div>
                <div class="card__author">${card.name}</div>
            </div>
        </div>
    `;

    return cardElement;
}

function renderCards() {
    elements.cardsContainer.innerHTML = '';

    if (state.filteredCards.length === 0) {
        elements.emptyState.hidden = false;
        elements.loadMoreWrapper.hidden = true;
        return;
    }

    elements.emptyState.hidden = true;

    // Показываем только видимые карточки
    const visibleCards = getVisibleCards();

    visibleCards.forEach((card, index) => {
        const cardElement = createCardElement(card);

        // Добавляем анимацию появления для новых карточек
        if (index >= state.loadMore.visibleCount - state.loadMore.step) {
            cardElement.style.opacity = '0';
            cardElement.style.transform = 'translateY(20px)';

            setTimeout(() => {
                cardElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                cardElement.style.opacity = '1';
                cardElement.style.transform = 'translateY(0)';
            }, 10);
        }

        elements.cardsContainer.appendChild(cardElement);
    });

    // Обновляем состояние кнопки Load More
    updateLoadMoreButton();
}

// ============================================================================
// Filtering Logic
// ============================================================================
function filterCards() {
    let filtered = CARDS_DATA;

    // 1. Применяем текстовый поиск
    if (state.searchQuery) {
        const query = normalizeString(state.searchQuery);
        filtered = filtered.filter(card =>
            normalizeString(card.info).includes(query) ||
            normalizeString(card.name).includes(query) ||
            normalizeString(card.category).includes(query)
        );
    }

    // 2. Применяем фильтр по категории
    if (state.activeFilter !== 'all') {
        filtered = filtered.filter(card => card.category === state.activeFilter);
    }

    state.filteredCards = filtered;

    // Сбрасываем Load More при фильтрации
    resetLoadMore();

    // Перерисовываем карточки
    renderCards();
}

function handleFilterClick(event) {
    const button = event.currentTarget;
    const filter = button.dataset.filter;

    // Обновляем активный фильтр
    state.activeFilter = filter;

    // Обновляем состояние кнопок
    elements.filterButtons.forEach(btn => {
        const isActive = btn === button;
        btn.classList.toggle('filters__button_active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    });

    // Применяем фильтры
    filterCards();
}

function handleSearchInput(event) {
    state.searchQuery = event.target.value;
    filterCards();
}

// ============================================================================
// Event Listeners
// ============================================================================
function initializeEventListeners() {
    // Поиск с debounce
    elements.searchInput.addEventListener(
        'input',
        debounce(handleSearchInput, 300)
    );

    // Кнопки фильтров
    elements.filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });

    // Очистка поиска по Escape
    elements.searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            elements.searchInput.value = '';
            state.searchQuery = '';
            filterCards();
        }
    });

    // Сброс всех фильтров по двойному клику на "All"
    const allButton = document.querySelector('[data-filter="all"]');
    allButton.addEventListener('dblclick', () => {
        state.activeFilter = 'all';
        state.searchQuery = '';
        elements.searchInput.value = '';

        // Сбрасываем все кнопки
        elements.filterButtons.forEach((btn, index) => {
            const isActive = index === 0;
            btn.classList.toggle('filters__button_active', isActive);
            btn.setAttribute('aria-pressed', isActive);
        });

        filterCards();
    });

    // Обработчик для кнопки Load More
    if (elements.loadMoreBtn) {
        console.log('Load More button found, adding event listener');
        elements.loadMoreBtn.addEventListener('click', handleLoadMore);
    } else {
        console.warn('Load More button not found!');
    }

    // Также можно добавить обработку клавиатуры
    elements.loadMoreBtn?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleLoadMore();
        }
    });

}

// ============================================================================
// Initialization
// ============================================================================
function init() {
    // Автоматически считаем и обновляем счетчики
    updateFilterCounts();

    // Инициализируем состояние Load More
    resetLoadMore();
    updateHasMoreState();

    // Рендерим начальные карточки (только первые 9)
    renderCards();

    // Инициализируем обработчики
    initializeEventListeners();
}

// ============================================================================
// Start the application
// ============================================================================
document.addEventListener('DOMContentLoaded', init);
