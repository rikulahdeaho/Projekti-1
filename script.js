document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("tuntikirja-form");
    const list = document.getElementById("tuntikirja-list");
    const yhteenveto = document.getElementById("yhteenveto");
    
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Lue syötetyt tiedot
        const pvm = document.getElementById("pvm").value;
        const tunnit = parseFloat(document.getElementById("tunnit").value);
        const kuvaus = document.getElementById("kuvaus").value;
        
        // Lisää tuntikirjaus listaan
        const li = document.createElement("li");
        li.innerHTML = `<strong>${pvm}</strong><br>Tunnit: ${tunnit}<br>Kuvaus: ${kuvaus}<button onclick="poistaKirjaus(this)">Poista</button>`;
        list.appendChild(li);
        
        // Tyhjennä lomake
        form.reset();
        
        // Päivitä yhteenveto
        päivitäYhteenveto();
    });
    
    // Poista kirjaus
    function poistaKirjaus(button) {
        const li = button.parentNode;
        list.removeChild(li);
        päivitäYhteenveto();
    }
    
    // Päivitä yhteenveto
    function päivitäYhteenveto() {
        const tunnit = document.querySelectorAll("#tuntikirja-list li strong");
        let kokonaistunnit = 0;
        
        tunnit.forEach(function (tunti) {
            kokonaistunnit += parseFloat(tunti.nextSibling.textContent.split(":")[1]);
        });
        
        yhteenveto.innerHTML = `Kokonaistunnit: ${kokonaistunnit.toFixed(2)}`;
    }
});
