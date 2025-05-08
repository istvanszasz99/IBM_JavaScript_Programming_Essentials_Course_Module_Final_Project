let travelData = {};

fetch('../travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
        travelData = data;
        console.log(data); // Check if the data is accessible

        // Set up search logic after data is loaded
        setupSearch();
    })
    .catch(error => {
        console.error('Error fetching travel data:', error);
    });

function setupSearch() {
    const navForm = document.querySelector('.search-bar');
    if (!navForm) return;
    const searchInput = navForm.querySelector('input[name="search"]');
    const clearBtn = document.getElementById('clear-btn'); // Make sure your clear button has id="clear-btn"

    navForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const keyword = searchInput.value.trim().toLowerCase();

        let results = [];

        // Show at least two recommendations for beach, temple, or country
        if (keyword === 'beach' || keyword === 'beaches') {
            results = (travelData.beaches || []).slice(0, 2);
        } else if (keyword === 'temple' || keyword === 'temples') {
            results = (travelData.temples || []).slice(0, 2);
        } else if (keyword === 'country' || keyword === 'countries') {
            results = [];
            (travelData.countries || []).forEach(country => {
                (country.cities || []).forEach(city => {
                    results.push({
                        name: city.name,
                        imageUrl: city.imageUrl,
                        description: city.description
                    });
                });
            });
            results = results.slice(0, 2);
        } else {
            // General keyword search across all items
            results = [];
            (travelData.beaches || []).forEach(item => {
                if (
                    item.name.toLowerCase().includes(keyword) ||
                    (item.description && item.description.toLowerCase().includes(keyword))
                ) results.push(item);
            });
            (travelData.temples || []).forEach(item => {
                if (
                    item.name.toLowerCase().includes(keyword) ||
                    (item.description && item.description.toLowerCase().includes(keyword))
                ) results.push(item);
            });
            (travelData.countries || []).forEach(country => {
                (country.cities || []).forEach(city => {
                    if (
                        city.name.toLowerCase().includes(keyword) ||
                        (city.description && city.description.toLowerCase().includes(keyword))
                    ) results.push({
                        name: city.name,
                        imageUrl: city.imageUrl,
                        description: city.description
                    });
                });
            });
        }

        console.log('Searched results:', results); // Log the searched results

        renderRecommendations(results);
    });

    // Clear button logic
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            searchInput.value = '';
            const container = document.getElementById('results-container');
            if (container) container.innerHTML = '';
        });
    }
}

// Render recommendations in the #results-container
function renderRecommendations(results) {
    const container = document.getElementById('results-container');
    container.innerHTML = '';
    if (!results.length) {
        container.innerHTML = '<div style="color:#fff;">No results found.</div>';
        return;
    }
    results.forEach(item => {
        const card = document.createElement('div');
        card.style.background = 'rgba(0,0,0,0.5)';
        card.style.borderRadius = '12px';
        card.style.padding = '24px';
        card.style.color = '#fff';
        card.style.width = '260px';
        card.style.margin = '16px auto';
        card.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'center';

        if (item.imageUrl) {
            const img = document.createElement('img');
            img.src = fixImageUrl(item.imageUrl);
            img.alt = item.name;
            img.style.width = '100%';
            img.style.height = '160px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            img.style.marginBottom = '16px';
            card.appendChild(img);
        }

        const title = document.createElement('h4');
        title.textContent = item.name;
        title.style.margin = '0 0 10px 0';
        card.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = item.description || '';
        desc.style.fontSize = '1em';
        desc.style.margin = '0';
        card.appendChild(desc);

        container.appendChild(card);
    });
}

function fixImageUrl(url) {
    //random image urls for the images in the json file
    const imageMap = {
        "enter_your_image_for_bora-bora.jpg": "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "enter_your_image_for_copacabana.jpg": "https://images.unsplash.com/photo-1464983953574-0892a716854b",
        "enter_your_image_for_angkor-wat.jpg": "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368",
        "enter_your_image_for_taj-mahal.jpg": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
        "enter_your_image_for_rio.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        "enter_your_image_for_sao-paulo.jpg": "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
        "enter_your_image_for_sydney.jpg": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
        "enter_your_image_for_melbourne.jpg": "https://images.unsplash.com/photo-1465101178521-c1a9136a3c5c",
        "enter_your_image_for_tokyo.jpg": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
        "enter_your_image_for_kyoto.jpg": "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
    };
    return imageMap[url] || url;
}