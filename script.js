fetch("data.json")
.then(r => r.json())
.then(data => {

    const equipos = {};

    data.forEach(jugador => {

        if (!equipos[jugador.equipo]) {
            equipos[jugador.equipo] = [];
        }

        equipos[jugador.equipo].push(jugador);

    });

    document.getElementById("equiposTotal").textContent =
        Object.keys(equipos).length;

    document.getElementById("jugadoresTotal").textContent =
        data.length;

    pintarEquipos(equipos);

    document
        .getElementById("buscar")
        .addEventListener(
            "input",
            filtrar
        );

});

function pintarEquipos(equipos) {

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

            equipos[equipo].forEach(j => {

                html += `
                <div class="jugador">

                    <div class="jugador-nombre">
                        ${j.jugador}
                    </div>

                    <div class="jugador-dorsal">
                        Dorsal: ${j.dorsal || "-"}
                    </div>

                </div>
                `;

            });

            details.innerHTML = html;

            contenedor.appendChild(details);

        });
}

function filtrar() {

    const texto =
        document.getElementById("buscar")
        .value
        .toLowerCase();

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
