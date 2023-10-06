import { Aereo } from "../model/aereo.js";
import { Terrestre } from "../model/terrestre.js";

export const $ = (id) => document.getElementById(id);

const esTerrestre = (cantidadRuedas, cantidadPuertas) => {
  return cantidadPuertas >= 0 || (cantidadPuertas === 0 && cantidadRuedas >= 0);
};

const esAereo = (alturaMaxima, autonomia) => {
  return alturaMaxima > 0 && autonomia > 0;
};

export const validarVehiculo = (vehiculo) => {
  // Vehiculo
  if (!vehiculo.id || isNaN(vehiculo.id) || vehiculo.id <= 0) return false;
  if (!vehiculo.modelo || !vehiculo.modelo.length > 0) return false;
  if (!vehiculo.anoFab || isNaN(vehiculo.anoFab) || vehiculo.anoFab <= 1885)
    return false;
  if (!vehiculo.velMax || isNaN(vehiculo.velMax) || vehiculo.velMax <= 0)
    return false;

  console.log(vehiculo);

  if (
    esTerrestre(vehiculo.cantRue, vehiculo.cantPue) ||
    esAereo(vehiculo.altMax, vehiculo.autonomia)
  ) {
    return true;
  }

  return false;
};

export const agregarVehiculo = (vehiculo, listado) => {
  const { id, modelo, anoFab, velMax, altMax, autonomia, cantPue, cantRue } =
    vehiculo;

  if (altMax && autonomia) {
    listado.push(new Aereo(id, modelo, anoFab, velMax, altMax, autonomia));
  } else if (cantPue && cantRue) {
    listado.push(new Terrestre(id, modelo, anoFab, velMax, cantPue, cantRue));
  }
};

export const modificarVehiculo = (vehiculo, datos) => {
  vehiculo.modelo = datos.modelo;
  vehiculo.anoFab = datos.anoFab;
  vehiculo.velMax = datos.velMax;

  if (datos.altMax && datos.autonomia) {
    vehiculo.altMax = datos.altMax;
    vehiculo.autonomia = datos.autonomia;
  } else if (datos.cantPue && datos.cantRue) {
    vehiculo.cantPue = datos.cantPue;
    vehiculo.cantRue = datos.cantRue;
  }
};

export const eliminarVehiculo = (listado, id) => {
  if (id > 0) {
    const vehiculo = listado.findIndex(
      (vehiculo) => vehiculo.id === parseInt(id)
    );

    if (vehiculo >= 0) {
      listado.splice(vehiculo, 1);
    }
  }
};

export const llenarListado = (mock, listado) => {
  mock.forEach((dato) => {
    if (validarVehiculo(dato)) {
      agregarVehiculo(dato, listado);
    }
  });
};

export const calcularPromedio = (vehiculos) => {
  if (vehiculos.length === 0) return 0;

  let length = 0;
  const velMax = vehiculos
    .map((vehiculo) => {
      length++;
      return vehiculo.velMax;
    })
    .reduce((accumulator, current) => accumulator + current);

  return (velMax / length).toFixed(2);
};

export const actualizarTabla = (listado, campos) => {
  const tableBody = $("table-body");

  while (tableBody.hasChildNodes()) {
    tableBody.removeChild(tableBody.firstChild);
  }

  listado.forEach((vehiculo) => {
    const tableRow = document.createElement("tr");

    tableRow.setAttribute("id-vehiculo", `${vehiculo.id}`);

    campos.forEach((campo) => {
      const tableData = document.createElement("td");
      const elemento = vehiculo[campo];

      tableData.appendChild(
        document.createTextNode(`${elemento ? elemento : "---"}`)
      );

      tableData.setAttribute("class", `col-${campo}`);
      tableRow.setAttribute("scope", "row");
      tableRow.appendChild(tableData);
    });

    tableBody.appendChild(tableRow);
  });
};

export const agregarItemSelector = (tipoSeleccionado) => {
  const divSelectedType = $("selected-type");

  while (divSelectedType.hasChildNodes()) {
    divSelectedType.removeChild(divSelectedType.lastChild);
  }

  const div1 = document.createElement("div");
  const label1 = document.createElement("label");
  const input1 = document.createElement("input");

  const div2 = document.createElement("div");
  const label2 = document.createElement("label");
  const input2 = document.createElement("input");

  switch (tipoSeleccionado) {
    case "":
      break;
    case "aereo":
      input1.setAttribute("type", "number");
      input1.setAttribute("min", "1");
      input1.setAttribute("step", "1");
      input1.setAttribute("name", "altMax");
      input1.setAttribute("id", "altMax");

      label1.appendChild(document.createTextNode(`Alt. max.: `));
      label1.setAttribute("for", "altMax");

      input2.setAttribute("type", "number");
      input2.setAttribute("min", "1");
      input2.setAttribute("step", "1");
      input2.setAttribute("name", "autonomia");
      input2.setAttribute("id", "autonomia");

      label2.appendChild(document.createTextNode(`Autonomia: `));
      label2.setAttribute("for", "autonomia");
      break;

    case "terrestre":
      input1.setAttribute("type", "number");
      input1.setAttribute("min", "0");
      input1.setAttribute("step", "1");
      input1.setAttribute("name", "cantPue");
      input1.setAttribute("id", "cantPue");

      label1.appendChild(document.createTextNode(`Cant. pue: `));
      label1.setAttribute("for", "cantPue");

      input2.setAttribute("type", "number");
      input2.setAttribute("min", "1");
      input2.setAttribute("step", "1");
      input2.setAttribute("name", "cantRue");
      input2.setAttribute("id", "cantRue");

      label2.appendChild(document.createTextNode(`Cant. rue: `));
      label2.setAttribute("for", "cantRue");
      break;

    default:
      throw new Error("Invalid value for type " + tipoSeleccionado);
  }

  if (tipoSeleccionado !== "") {
    input1.setAttribute("required", "true");
    input2.setAttribute("required", "true");

    div1.appendChild(label1);
    div2.appendChild(label2);

    div1.appendChild(input1);
    div2.appendChild(input2);

    div1.className = "d-flex justify-content-between my-2";
    div2.className = "d-flex justify-content-between my-2";

    divSelectedType.appendChild(div1);
    divSelectedType.appendChild(div2);
  }
};

export const filtrarTabla = (listado, filtrarPor) => {
  let listadoFiltrado = [];

  switch (filtrarPor.toLowerCase()) {
    case "todos":
      listadoFiltrado = [...listado];
      break;
    case "aereos":
      listadoFiltrado = listado.filter((data) => data.altMax && data.autonomia);
      break;
    case "terrestres":
      listadoFiltrado = listado.filter((data) => data.cantPue && data.cantRue);
      break;
    default:
      throw new Error("Invalid value for filter " + filtrarPor);
  }

  return listadoFiltrado;
};

export const ocultarColumna = (columna) => {
  const celdas = document.querySelectorAll(`.col-${columna}`);
  const checkbox = $(`checkbox-${columna}`);

  for (let i = 0; i < celdas.length; i++) {
    if (checkbox.checked) {
      celdas[i].style.display = "";
    } else {
      celdas[i].style.display = "none";
    }
  }
};

export const cambiarForm = (inicial, vehiculo) => {
  let formIn;
  let formOut;

  const aceptarModificar = $("aceptar-modificar");
  const eliminar = $("eliminar");
  const cancelar = $("cancelar");
  const id = $("id");
  const modelo = $("modelo");
  const anoFab = $("anoFab");
  const velMax = $("velMax");
  const tipo = $("tipo");

  if (inicial) {
    formOut = $("form-agregar");
    formIn = $("form-tabla");
  } else {
    formOut = $("form-tabla");
    formIn = $("form-agregar");
  }

  if (vehiculo) {
    id.value = vehiculo.id;
    modelo.value = vehiculo.modelo;
    anoFab.value = vehiculo.anoFab;
    velMax.value = vehiculo.velMax;
    aceptarModificar.value = "Modificar";
    eliminar.classList.replace("d-none", "d-inline-block");
    tipo.setAttribute("disabled", "true");

    if (vehiculo.altMax && vehiculo.autonomia) {
      agregarItemSelector("aereo");
      tipo.value = "aereo";

      const altMax = $("altMax");
      const autonomia = $("autonomia");

      altMax.value = vehiculo.altMax;
      autonomia.value = vehiculo.autonomia;
    } else if (vehiculo.cantPue && vehiculo.cantRue) {
      agregarItemSelector("terrestre");
      tipo.value = "terrestre";

      const cantPue = $("cantPue");
      const cantRue = $("cantRue");

      cantPue.value = vehiculo.cantPue;
      cantRue.value = vehiculo.cantRue;
    }
  } else {
    setTimeout(() => {
      id.value = "";
      modelo.value = "";
      anoFab.value = "";
      velMax.value = "";
      tipo.removeAttribute("disabled");

      aceptarModificar.value = "Aceptar";
      eliminar.classList.replace("d-inline-block", "d-none");
    }, 450);
  }

  formOut.className = "fade-out bordered";

  setTimeout(() => {
    formOut.className = "d-none";
    formIn.className = "fade-in bordered";
  }, 350);
};

export const ordenarFilasPor = (columna, listado) => {
  if (columna.tagName.toLowerCase() !== "TH".toLowerCase()) return;

  const nombreColumna = columna.className.split("-")[1];
  let funcionComparar;
  let listadoOrdenado = [];

  switch (nombreColumna) {
    case "id":
      funcionComparar = (a, b) => a.id - b.id;
      break;
    case "modelo":
      funcionComparar = (a, b) => a.modelo.localeCompare(b.modelo);
      break;
    case "anoFab":
      funcionComparar = (a, b) => a.anoFab - b.anoFab;
      break;
    case "velMax":
      funcionComparar = (a, b) => a.velMax - b.velMax;
      break;
    case "autonomia":
      funcionComparar = (a, b) => a.autonomia - b.autonomia;
      break;
    case "altMax":
      funcionComparar = (a, b) => a.altMax - b.altMax;
      break;
    case "cantPue":
      funcionComparar = (a, b) => a.cantPue - b.cantPue;
      break;
    case "cantRue":
      funcionComparar = (a, b) => a.cantRue - b.cantRue;
      break;
    default:
      throw new Error("Invalid value for table header " + nombreColumna);
  }

  listadoOrdenado = [...listado].sort(funcionComparar);

  return listadoOrdenado;
};
