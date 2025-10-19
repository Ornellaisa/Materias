document.addEventListener("DOMContentLoaded", () => {
  const materias = document.querySelectorAll(".materia");

  materias.forEach((materia, index) => {
    const esEditable = materia.classList.contains("editable");

    const nombreOriginal = materia.textContent.trim();

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("check");

    const label = document.createElement("label");
    label.textContent = nombreOriginal.replace(/Escribí el nombre|Inglés o Portugués/gi, "").trim();

    let inputTexto = null;
    if (esEditable) {
      inputTexto = materia.querySelector("input[type='text']") || document.createElement("input");
      inputTexto.type = "text";
      inputTexto.placeholder = "Escribí el nombre";
      inputTexto.classList.add("editable-input");
      inputTexto.style.marginRight = "25px";
    }

    const notaCursada = document.createElement("input");
    notaCursada.type = "number";
    notaCursada.min = 0;
    notaCursada.max = 10;
    notaCursada.placeholder = "Cursada";
    notaCursada.style.marginRight = "15px";

    const notaFinal = document.createElement("input");
    notaFinal.type = "number";
    notaFinal.min = 0;
    notaFinal.max = 10;
    notaFinal.placeholder = "Final";
    notaFinal.style.marginLeft = "15px";

    materia.textContent = "";

    materia.appendChild(checkbox);
    materia.appendChild(label);
    if (esEditable) materia.appendChild(inputTexto);
    materia.appendChild(notaCursada);
    materia.appendChild(notaFinal);

    const key = `materia-${index}`;

    const saved = JSON.parse(localStorage.getItem(key));
    if (saved) {
      checkbox.checked = saved.checked || false;
      notaCursada.value = saved.cursada || "";
      notaFinal.value = saved.final || "";
      if (inputTexto) inputTexto.value = saved.nombre || "";
    }

    [checkbox, notaCursada, notaFinal, inputTexto].forEach(input => {
      if (input) {
        input.addEventListener("input", () => {
          localStorage.setItem(key, JSON.stringify({
            checked: checkbox.checked,
            cursada: notaCursada.value,
            final: notaFinal.value,
            nombre: inputTexto ? inputTexto.value : null
          }));
          actualizarProgreso();
          actualizarPromedio();
        });
      }
    });
  });

  function actualizarProgreso() {
    const checkboxes = document.querySelectorAll(".check");
    const total = checkboxes.length;
    const aprobadas = [...checkboxes].filter(c => c.checked).length;
    const porcentaje = Math.round((aprobadas / total) * 100);

    const barra = document.getElementById("progresoTotalBarra");
    const texto = document.getElementById("porcentajeTotal");

    barra.style.width = `${porcentaje}%`;
    texto.textContent = `${porcentaje}%`;
  }

  function actualizarPromedio() {
    const notasFinales = document.querySelectorAll(".materia input[type='number']");
    let suma = 0;
    let count = 0;

    notasFinales.forEach(input => {
      const valor = parseFloat(input.value);
      if (!isNaN(valor) && input.placeholder === "Final") {
        suma += valor;
        count++;
      }
    });

    const promedio = count > 0 ? (suma / count).toFixed(2) : 0;
    document.getElementById("promedioFinal").textContent = promedio;
  }

  actualizarProgreso();
  actualizarPromedio();
});
