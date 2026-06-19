let totalJugadores = 0;

fetch("data.json")
.then(r => r.json())
.then(data => {

    const equipos = {};

    data.forEach(jugador => {

        if(!equipos[jugador.equipo]){
            equipos[jugador.equipo] = [];
        }

        equipos[jugador.equipo].push(jugador);
    });

    document.getElementById("equiposTotal").textContent =
        Object.keys(equipos).length;

    document.getElementById("jugadoresTotal").textContent =
        data.length;

    totalJugadores = data.length;

    pintarEquipos(equipos);

    document
        .getElementById("buscar")
        .addEventListener("input", filtrar);

});

function pintarEquipos(equipos){

    const contenedor =
        document.getElementById("equipos");

    contenedor.innerHTML = "";

    Object.keys(equipos)
        .sort()
        .forEach(equipo => {

        const details =
            document.createElement("details");

        let html =
            `<summary>${equipo} (${equipos[equipo].length})</summary>`;

        equipos[equipo].forEach((j,index)=>{

            html += `
            <div class="jugador">

                <div class="jugador-nombre">
                    ${j.jugador}
                </div>

                <div class="jugador-dorsal">
                    Dorsal: ${j.dorsal || "-"}
                </div>

                <label class="check">
                    <input
                        type="checkbox"
                        class="revision">
                    Datos correctos
                </label>

                <input
                    class="error"
                    placeholder="Indicar error si existe">

            </div>
            `;
        });

        details.innerHTML = html;

        contenedor.appendChild(details);
    });

    actualizarContador();

    document
        .querySelectorAll(".revision")
        .forEach(check => {

        check.addEventListener(
            "change",
            actualizarContador
        );

    });
}

function actualizarContador(){

    const revisados =
        document.querySelectorAll(
            ".revision:checked"
        ).length;

    document.getElementById(
        "revisados"
    ).textContent = revisados;
}

function filtrar(){

    const texto =
        this.value.toLowerCase();

    document
        .querySelectorAll("details")
        .forEach(detalle => {

        detalle.style.display =
            detalle.innerText
            .toLowerCase()
            .includes(texto)
            ? "block"
            : "none";

    });
}

document
.getElementById("enviar")
.addEventListener("click", () => {

    alert(
        "Revisión guardada correctamente."
    );

});
