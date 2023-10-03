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

// Muokataan lomakkeen submit-kuuntelijaa
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const pvm = document.getElementById("pvm").value;
    const tunnit = parseFloat(document.getElementById("tunnit").value);
    const kuvaus = document.getElementById("kuvaus").value;

    // Luo tietue tuntikirjauksesta
    const tuntikirjaus = {
        pvm: pvm,
        tunnit: tunnit,
        kuvaus: kuvaus
    };

    // Tarkista, onko tallennusmahdollisuutta
    if (typeof(Storage) !== "undefined") {
        // Hae nykyiset tuntikirjaukset
        let tuntikirjaukset = JSON.parse(localStorage.getItem("tuntikirjaukset")) || [];

        // Lisää uusi tuntikirjaus tietoihin
        tuntikirjaukset.push(tuntikirjaus);

        // Tallenna päivitetyt tiedot
        localStorage.setItem("tuntikirjaukset", JSON.stringify(tuntikirjaukset));
    } else {
        alert("Selain ei tue localStoragea.");
    }

    // Lisää tuntikirjaus listaan ja päivitä yhteenveto
    // (Koodi tästä osasta voi olla samanlainen kuin aikaisemmassa esimerkissä)
});

document.addEventListener("DOMContentLoaded", function () {
    // Tarkista, onko tallennettuja tuntikirjauksia
    if (typeof(Storage) !== "undefined") {
        const tuntikirjaukset = JSON.parse(localStorage.getItem("tuntikirjaukset"));

        // Tarkista, onko tallennettuja tuntikirjauksia
        if (tuntikirjaukset && tuntikirjaukset.length > 0) {
            // Käy läpi tallennetut tuntikirjaukset ja lisää ne listaan
            tuntikirjaukset.forEach(function (tuntikirjaus) {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${tuntikirjaus.pvm}</strong><br>Tunnit: ${tuntikirjaus.tunnit}<br>Kuvaus: ${tuntikirjaus.kuvaus}<button onclick="poistaKirjaus(this)">Poista</button>`;
                list.appendChild(li);
            });

            // Päivitä yhteenveto
            päivitäYhteenveto();
        }
    } else {
        alert("Selain ei tue localStoragea.");
    }
    
    // Muut toiminnot (kuten lisää tuntikirjauksen poistaminen) voivat olla samanlaisia kuin aikaisemmassa esimerkissä.
});
