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

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Lue syötetyt tiedot
        const pvm = document.getElementById("pvm").value;
        const tunnit = parseFloat(document.getElementById("tunnit").value);
        const kuvaus = document.getElementById("kuvaus").value;
        
        const selectedRadioButton = document.querySelector('input[name="color"]:checked');
        const selected = selectedRadioButton ? selectedRadioButton.value : null;

        // Luo tietue tuntikirjauksesta
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
        
        // Tyhjennä lomake
        form.reset();
        
        // Päivitä yhteenveto
        paivitaYhteenveto();
    });

    document.addEventListener("click", function(event) {
        if (event.target && event.target.matches("button[data-action='poista']")) {
            poistaKirjaus(event.target);
        }
    });    
    
    // Lisää tuntikirjaus listaan ja localStorageen
    function lisaaTuntikirjausListalle(tuntikirjaus) {
        const li = document.createElement("li");

        if(tuntikirjaus.aktiviteetti === "liikunta") {
            li.style.backgroundColor = "green"
        } else if(tuntikirjaus.aktiviteetti === "opiskelu"){
            li.style.backgroundColor = "blue"
        }


        li.innerHTML = `<strong>${tuntikirjaus.pvm}</strong><br>Tunnit: ${tuntikirjaus.tunnit}<br>Kuvaus: ${tuntikirjaus.kuvaus}<button data-action="poista">Poista</button>`;
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
        
        // Päivitä yhteenveto
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