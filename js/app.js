import { mockData } from "./mock/mock.js";
import { campos } from "./static/campos.js";
import {
  $,
  actualizarTabla,
  agregarItemSelector,
  agregarVehiculo,
  calcularPromedio,
  cambiarForm,
  eliminarVehiculo,
  filtrarTabla,
  llenarListado,
  modificarVehiculo,
  ocultarColumna,
  ordenarFilasPor,
  validarVehiculo,
} from "./functions/funciones.js";

const listado = [];
let listadoFiltrado = [];

window.addEventListener("load", () => {
  // Llenado de array
  llenarListado(mockData, listado);
  listadoFiltrado = filtrarTabla(listado, "todos");

  // Filtro
  const filtro = $("filtro");
  filtro.addEventListener("change", () => {
    listadoFiltrado = filtrarTabla(
      listado,
      filtro.options[filtro.selectedIndex].value
    );

    actualizarTabla(listadoFiltrado, campos);
  });

  /*      Listeners     */
  // Calculo promedio velMax
  $("btn-calcular").addEventListener("click", () => {
    const input = $("promedio-velMax");
    input.value = calcularPromedio(listadoFiltrado);
  });

  $("tipo").addEventListener("change", (e) => {
    agregarItemSelector(e.target.value);
  });

  // Checkboxes
  campos.forEach((campo) => {
    document
      .getElementById(`checkbox-${campo}`)
      .addEventListener("change", (e) => {
        ocultarColumna(e.target.name);
      });
  });

  // dblClick tabla
  $("table").addEventListener("dblclick", (e) => {
    const vehiculo = {};
    const fila = e.target.parentNode;

    for (let i = 0; i < campos.length; i++) {
      const element = fila.cells[i].textContent;
      vehiculo[campos[i]] = element === "---" ? undefined : element;
    }

    if (validarVehiculo(vehiculo)) {
      cambiarForm($("form-agregar").style.display == "none", vehiculo);
    }
  });

  // ordenar tabla
  $("table-head").addEventListener("click", (e) => {
    console.log(listado);
    listadoFiltrado = ordenarFilasPor(e.target, listado);
    actualizarTabla(listadoFiltrado, campos);
  });

  $("btn-agregar").addEventListener("click", () => {
    cambiarForm($("form-agregar").style.display == "none");
  });

  $("cancelar").addEventListener("click", () => {
    cambiarForm($("form-tabla").style.display != "none");
    agregarItemSelector("");
  });

  $("form-agregar").addEventListener("submit", (e) => {
    const botonValue = $("aceptar-modificar").value;

    let id;

    if (botonValue == "aceptar") {
      id = parseInt(listado[listado.length - 1].id) + 1;
    } else {
      id = parseInt($("id").value);
    }

    let modelo = $("modelo").value;
    let anoFab = parseInt($("anoFab").value);
    let velMax = parseInt($("velMax").value);
    let altMax;
    let autonomia;
    let cantPue;
    let cantRue;

    switch ($("tipo").value) {
      case "aereo":
        altMax = parseInt($("altMax").value);
        autonomia = parseInt($("autonomia").value);
        break;
      case "terrestre":
        cantPue = parseInt($("cantPue").value);
        cantRue = parseInt($("cantRue").value);
        break;
      default:
        break;
    }

    let v = { id, modelo, anoFab, velMax, altMax, autonomia, cantPue, cantRue };

    if (validarVehiculo(v)) {
      let vehiculo = listado.find((vehiculo) => vehiculo.id === id);

      if (vehiculo) {
        modificarVehiculo(vehiculo, v);
      } else {
        agregarVehiculo(v, listado);
      }
    } else {
      throw new Error("Invalid data in form, aborting request");
    }

    agregarItemSelector("");

    listadoFiltrado = filtrarTabla(listado, "todos");

    actualizarTabla(listadoFiltrado, campos);

    cambiarForm($("form-tabla").style.display != "none");

    e.preventDefault();
  });

  $("eliminar").addEventListener("click", (e) => {
    const id = parseInt($("id").value);

    eliminarVehiculo(listado, id);
    agregarItemSelector("");
    listadoFiltrado = filtrarTabla(listado, "todos");
    actualizarTabla(listadoFiltrado, campos);
    cambiarForm($("form-tabla").style.display != "none");
  });

  // Actualizar tabla
  console.log(listado);
  console.log(mockData);
  agregarItemSelector("");
  actualizarTabla(listadoFiltrado, campos);
});
