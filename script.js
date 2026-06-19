const STORAGE_KEY = "revisionTemporada2627";

let totalJugadores = 0;

function guardarEstado() {

    const datos = [];

    document.querySelectorAll(".jugador")
        .forEach(jugador => {

            datos.push({

                correcto:
                    jugador.querySelector(".revision")
                    ?.checked || false,

                error:
                    jugador.querySelector(".error")
                    ?.value || ""

            });

        });

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(datos)
    );
}

function recuperarEstado() {

    const guardado =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

    if (!guardado) return;

    document.querySelectorAll(".jugador")
        .forEach((jugador, i) => {

            if (!guardado[i]) return;

            jugador.querySelector(".revision").checked =
                guardado[i].correcto;

            jugador.querySelector(".error").value =
                guardado[i].error;

        });

    actualizarContador();
}

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

    totalJugadores = data.length;

    pintarEquipos(equipos);

    document
        .getElementById("buscar")
        .addEventListener("input", filtrar);

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
                () => {

                    actualizarContador();
                    guardarEstado();

                }
            );

        });

    document
        .querySelectorAll(".error")
        .forEach(campo => {

            campo.addEventListener(
                "input",
                guardarEstado
            );

        });

    recuperarEstado();
}

function actualizarContador() {

    const revisados =
        document.querySelectorAll(
            ".revision:checked"
        ).length;

    document.getElementById(
        "revisados"
    ).textContent = revisados;
}

function filtrar() {

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
.getElementById("excel")
.addEventListener(
    "click",
    exportarExcel
);

function exportarExcel() {

    const filas = [];

    document.querySelectorAll(".jugador")
        .forEach(jugador => {

            filas.push({

                Jugador:
                    jugador.querySelector(
                        ".jugador-nombre"
                    ).textContent,

                Dorsal:
                    jugador.querySelector(
                        ".jugador-dorsal"
                    ).textContent.replace(
                        "Dorsal: ",
                        ""
                    ),

                Correcto:
                    jugador.querySelector(
                        ".revision"
                    ).checked
                        ? "SI"
                        : "NO",

                Error:
                    jugador.querySelector(
                        ".error"
                    ).value

            });

        });

    const ws =
        XLSX.utils.json_to_sheet(filas);

    const wb =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        wb,
        ws,
        "Revision"
    );

    XLSX.writeFile(
        wb,
        "Revision_Temporada_26_27.xlsx"
    );
}

document
.getElementById("limpiar")
.addEventListener(
    "click",
    () => {

        if (
            confirm(
                "¿Seguro que quieres borrar la revisión?"
            )
        ) {

            localStorage.removeItem(
                STORAGE_KEY
            );

            location.reload();

        }

    }
);
