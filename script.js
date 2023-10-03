document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("tuntikirja-form");
    const list = document.getElementById("tuntikirja-list");
    const yhteenveto = document.getElementById("yhteenveto");
    
    // Hae tallennetut tuntikirjaukset localStoragesta
    let tuntikirjaukset = JSON.parse(localStorage.getItem("tuntikirjaukset")) || [];
    
    // Järjestä tuntikirjaukset niin, että uusimmat ajat ovat ylhäällä ja vanhimmat alhaalla
    tuntikirjaukset.sort(function(a, b) {
        return new Date(b.pvm) - new Date(a.pvm);
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
        
        // Luo tietue tuntikirjauksesta
        const uusiTuntikirjaus = {
            pvm: pvm,
            tunnit: tunnit,
            kuvaus: kuvaus
        };
        
        // Lisää uusi tuntikirjaus listaan ja localStorageen
        lisaaTuntikirjausListalle(uusiTuntikirjaus);
        tuntikirjaukset.push(uusiTuntikirjaus);
        tallennaTuntikirjaukset();
        
        // Tyhjennä lomake
        form.reset();
        
        // Päivitä yhteenveto
        paivitaYhteenveto();
    });
    
    // Lisää tuntikirjaus listaan ja localStorageen
    function lisaaTuntikirjausListalle(tuntikirjaus) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${tuntikirjaus.pvm}</strong><br>Tunnit: ${tuntikirjaus.tunnit}<br>Kuvaus: ${tuntikirjaus.kuvaus}<button class="poista-nappula" onclick="poistaKirjaus(this)">Poista</button>`;
        list.appendChild(li);
    }
    
    // Tallenna tuntikirjaukset localStorageen
    function tallennaTuntikirjaukset() {
        // Järjestä tuntikirjaukset uudestaan ennen tallennusta
        tuntikirjaukset.sort(function(a, b) {
            return new Date(b.pvm) - new Date(a.pvm);
        });
        localStorage.setItem("tuntikirjaukset", JSON.stringify(tuntikirjaukset));
    }
    
    // Poista kirjaus
    function poistaKirjaus(button) {
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