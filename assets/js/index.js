const planetList = document.getElementById("planetList");
const planetInfo = document.getElementById("planetInfo");
const residentsInfo = document.getElementById("residentsInfo")
const planetUrl = "https://swapi.dev/api/planets"

let planets = []


addEventListener('load', async () => {
    const planetListLoading = document.getElementById('planetListLoading');
    planetListLoading.style.display = 'block';

    await fetchPlanets();

    planetListLoading.style.display = 'none';

    showPlanets();
})

async function fetchPlanets(){
    let res = await fetch(planetUrl);
    let {results, next} = await res.json();

    planets.push(...results)
    
    let nextUrl = next

    while(nextUrl){
        let res = await fetch(nextUrl);
        let {results: planet, next: nextRequest} = await res.json();
        console.log(nextRequest)
        planets.push(...planet)
        nextUrl = nextRequest
    }
}

async function fetchResidents(planet){
    const residentsLoading = document.getElementById('residentsLoading');
    residentsLoading.style.display = 'block';
    let residents = [];
    for (let resident of planet.residents) {
        console.log(resident)
        let res = await fetch(resident);
        let {name, birth_year} = await res.json();
        residents.push({"name": name, "birth_year": birth_year})
    }
    residentsLoading.style.display = 'none';
    return residents;
}

function showPlanets(){
    planets.forEach(planet => {
        let button = document.createElement("button");
        button.innerHTML = planet.name;

        button.addEventListener("click", () =>{
            residentsInfo.innerHTML = "";
            showPlanetInfo(planet);
        })

        planetList.appendChild(button);
    });
}

function showPlanetInfo(planet) {
    if(planet){
        planetInfo.innerHTML = `
        <div class="planetName">
            <h2>Planeta: ${planet.name}</h2>
        </div>
        <div class="planetInformation">
            <h2><strong>Clima:</strong> ${planet.climate}</h2>
            <h2><strong>População:</strong> ${planet.population}</h2>
            <h2>Terreno:${planet.terrain}</h2>
        </div>
        `;
        showResidents(planet)
    }else{
        planetInfo.innerHTML = "Nenhum planeta encontrado!"
    }
}
  
async function showResidents(planet){
    let residents = await fetchResidents(planet);
    
    if (residents.length > 0){
       

        residentsInfo.innerHTML = `
        <h2> Residentes mais famosos </h2> 
        <table class="residentsTable">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Data de Nascimento</th>
                </tr>
            </thead>
            <tbody id="table_body"></tbody>
        </table>
        `

        let tbody = document.getElementById("table_body")

        for(let resident of residents)
        {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            nameCell.textContent = resident.name;
            const birthYearCell = document.createElement('td');
            birthYearCell.textContent = resident.birth_year;

            row.appendChild(nameCell);
            row.appendChild(birthYearCell);
            tbody.appendChild(row);
        }
    }else{
        residentsInfo.innerHTML = "Nenhum residente"
    }
}

const form = document.getElementById("searchForm");

form.addEventListener("submit", async function(event) {
    event.preventDefault();
    const planetName = form.elements["planetName"].value;

    if (planetName){
        await searchPlanet(planetName)
    }else{
        await searchPlanet(null)
    }

});

async function searchPlanet(planetName){
    residentsInfo.innerHTML = "";
    let res = await fetch(`${planetUrl}?search=${planetName}`);
    let {results} = await res.json();
    showPlanetInfo(results[0])
}

await fetchPlanets();
