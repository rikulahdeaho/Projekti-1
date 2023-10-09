document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("tuntikirja-form");
    const list = document.getElementById("tuntikirja-list");
    const yhteenveto = document.getElementById("yhteenveto");
    
    // Hae tallennetut tuntikirjaukset localStoragesta
    let tuntikirjaukset = JSON.parse(localStorage.getItem("tuntikirjaukset")) || [];
    
    // Järjestetään tuntikirjaukset niin, että uusimmat ajat ovat ylhäällä ja vanhimmat alhaalla
    tuntikirjaukset.sort(function(a, b) {
        const dateA = new Date(a.pvm);
        const dateB = new Date(b.pvm);
        return dateB - dateA;
    });
    
    // Päivitä tuntikirjaukset näyttämään aiemmin tallennetut
    tuntikirjaukset.forEach(function (tuntikirjaus) {
        lisaaTuntikirjausListalle(tuntikirjaus);
    });

    //Tarkistetaan yhteenveto
    paivitaYhteenveto();

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Lue syötetyt tiedot
        const pvm = document.getElementById("pvm").value;
        const tunnit = parseFloat(document.getElementById("tunnit").value);
        const kuvaus = document.getElementById("kuvaus").value;
        
        const selectedRadioButton = document.querySelector('input[name="color"]:checked');
        const selected = selectedRadioButton ? selectedRadioButton.value : null;

        // Luodaan tuntikirjaukselle tietue
        const uusiTuntikirjaus = {
            pvm: pvm,
            tunnit: tunnit,
            kuvaus: kuvaus,
            aktiviteetti: selected
        };
        
        // Lisää uusi tuntikirjaus listaan ja localStorageen
        lisaaTuntikirjausListalle(uusiTuntikirjaus);
        tuntikirjaukset.push(uusiTuntikirjaus);
        
        // Järjestetään tuntikirjaukset uudestaan, niin että uusimmat ajat ovat ylhäällä ja vanhimmat alhaalla
        tuntikirjaukset.sort(function(a, b) {
            const dateA = new Date(a.pvm);
            const dateB = new Date(b.pvm);
            return dateB - dateA;
        });

        tallennaTuntikirjaukset();

        form.reset();
        paivitaYhteenveto();
    });

    document.addEventListener("click", function(event) {
        if (event.target && event.target.matches("button[data-action='poista']")) {
            poistaKirjaus(event.target);
        }
    });    
    
    // Lisää tuntikirjaus listaan ja localStorageen
    function lisaaTuntikirjausListalle(tuntikirjaus) {
        const li = document.createElement("div");

        li.classList.add("card-body")

        if(tuntikirjaus.aktiviteetti === "liikunta") {
            li.style.backgroundColor = "#e1fae9"
        } else if(tuntikirjaus.aktiviteetti === "opiskelu"){
            li.style.backgroundColor = "#e1f8fa"
        }


        //Luodaan tuntikirjaus elementti
        li.innerHTML = `<h5 class="card-title">${tuntikirjaus.aktiviteetti} | ${tuntikirjaus.pvm}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Tunnit: ${tuntikirjaus.tunnit} h</h6>
            <p class="card-text">${tuntikirjaus.kuvaus}</p>
            <button class="btn btn-danger" data-action="poista">Poista</button>`;

        list.appendChild(li);
    }
    
    // Tallenna tuntikirjaukset localStorageen
    function tallennaTuntikirjaukset() {
        localStorage.setItem("tuntikirjaukset", JSON.stringify(tuntikirjaukset));
    }
    
    // Poista kirjaus
    function poistaKirjaus(button) {
        console.log(button)

        const li = button.parentNode;
        const indeksi = Array.from(list.children).indexOf(li);
        
        // Poista kirjaus listalta ja localStoragesta
        list.removeChild(li);
        tuntikirjaukset.splice(indeksi, 1);

        tallennaTuntikirjaukset();
        paivitaYhteenveto();
    }
    
    // Päivitä yhteenveto
    function paivitaYhteenveto() {
        let kokonaistunnit = 0;
        
        tuntikirjaukset.forEach(function (tuntikirjaus) {
            kokonaistunnit += parseFloat(tuntikirjaus.tunnit);
        });
        
        yhteenveto.innerHTML = `Kokonaistunnit: ${kokonaistunnit.toFixed(2)}`;
    }
});