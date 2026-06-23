const STORAGE_KEY = "revisionTemporada2627";

function guardarEstado() {

    const datos = [];

    document.querySelectorAll(".jugador")
        .forEach(jugador => {

            datos.push({

                correcto:
                    jugador.querySelector(".revision").checked,

                error:
                    jugador.querySelector(".error").value

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

document
.getElementById("enviar")
.addEventListener(
    "click",
    enviarRevision
);

async function enviarRevision() {

    const revisor =
        document.getElementById("nombre")
        .value
        .trim();

    if (!revisor) {

        alert(
            "Introduce tu nombre."
        );

        return;
    }

    const incidencias = [];

    document
        .querySelectorAll("details")
        .forEach(detalle => {

            const equipo =
                detalle.querySelector("summary")
                .textContent
                .replace(/\s+\(\d+\)$/,"");

            detalle
                .querySelectorAll(".jugador")
                .forEach(jugador => {

                    const error =
                        jugador.querySelector(".error")
                        .value
                        .trim();

                    if (!error) return;

                    incidencias.push({

                        revisor,

                        equipo,

                        jugador:
                            jugador.querySelector(
                                ".jugador-nombre"
                            ).textContent.trim(),

                        dorsal:
                            jugador.querySelector(
                                ".jugador-dorsal"
                            ).textContent
                            .replace(
                                "Dorsal: ",
                                ""
                            ),

                        error

                    });

                });

        });

    if (incidencias.length === 0) {

        alert(
            "No hay incidencias para enviar."
        );

        return;
    }

    try {

        await fetch(
   "https://script.google.com/macros/s/AKfycbxSairjucA_bo8cpKRwfO24MuaM1xQxl51t3CXhor58l91DdIU8W5yd2KgQY4r8IcalvA/exec",
   {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(incidencias)
   }
);

        alert(
            "Revisión enviada correctamente."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Error enviando la revisión."
        );

    }
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
