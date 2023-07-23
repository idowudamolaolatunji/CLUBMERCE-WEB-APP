
const searchForm = document.querySelector('.nav__search');
const searchInput = document.querySelector('.nav__input');

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    searchInput.addEventListener('keyup', function(e) {
        fetch('/api/product/search-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({payload: e.value}),
        }).then(res => res.json()).then(data => {
            console.log(data, data.payload)
        })
    })
})