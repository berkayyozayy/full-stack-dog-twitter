
const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const havsElement = document.querySelector('.havs');

const API_URL = 'http://localhost:5000/havs';

loadingElement.style.display = '';


listAllHavs();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    //Take Form Data
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    //Create a new object called 'hav' from form data
    const hav = {
        name,
        content
    };
    console.log(hav);
    form.style.display = 'none';
    loadingElement.style.display = '';

    fetch(API_URL, {
        method : 'POST',
        body : JSON.stringify(hav),
        headers : {
            'content-type' : 'application/json'
        }
    }).then(response => response.json())
      .then(createdHav => {
        form.reset();
        setTimeout(() => {
            form.style.display = '';
        }, 2000);
        listAllHavs();
        loadingElement.style.display = 'none';
      });

});

function listAllHavs(){
    havsElement.innerHTML = ''; //blank out that was there before list elements
    fetch(API_URL)
    .then(response => response.json())
    .then(havs => {
        console.log(havs);
        havs.reverse(); // Latest hav tweet will show on the top
        havs.forEach(hav => {
            const div = document.createElement('div');

            const header = document.createElement('h3');
            header.textContent =  hav.name;

            const contents = document.createElement('p');
            contents.textContent = hav.content;

            const date = document.createElement('small');
            date.textContent = new Date(hav.created);

            
            div.appendChild(header);
            div.appendChild(contents);
            div.appendChild(date);

            havsElement.appendChild(div);
        });
        loadingElement.style.display = 'none';
    })
}