const images = ['images/drought.png', 'images/dustandhaze.png', 'images/earthquake.png', 'images/floods.png', 'images/landslides.png', 'images/manmade.png', 'images/sealakeice.png', 'images/severeStorms.png', 'images/snow.png', 'images/extreme.png', 'images/vulcanoes.png', 'images/watercolor.png', 'images/extreme.png']

async function logJSONData() {

    const response = await fetch("https://eonet.gsfc.nasa.gov/api/v3/categories");
    const jsonData = await response.json();
    let box = document.getElementById('container');

    for (let i = 0; i < jsonData['categories'].length; i++) {

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        const bannerDiv = document.createElement('div');
        bannerDiv.style.backgroundImage = `url(${images[i]})`
        bannerDiv.classList.add('card-banner');

        const titleH3 = document.createElement('h3');
        titleH3.textContent = jsonData['categories'][i]['title'];

        const descriptionP = document.createElement('p');
        descriptionP.classList.add('description');
        descriptionP.textContent = jsonData['categories'][i]['description']

        const exploreButton = document.createElement('button');
        exploreButton.addEventListener('click', ()=>{
            window.location.href=`test.html?categoryID=${jsonData['categories'][i]['id']}`
        })
        exploreButton.textContent = 'Explore';

        bannerDiv.appendChild(titleH3);
        cardDiv.appendChild(bannerDiv);
        cardDiv.appendChild(descriptionP);
        cardDiv.appendChild(exploreButton)
        box.append(cardDiv)
    }

}
logJSONData()
