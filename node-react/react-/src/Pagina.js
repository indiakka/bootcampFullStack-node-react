import React, { Component } from "react";
import ActionsMenu from "./componentes/ActionsMenu";
import Tabla from "./componentes/Tabla";
import Modal from "./componentes/Modal";
import {
  listarEntidad,
  crearEditarEntidad,
  eliminarEntidad,
  obtenerUno,
} from "./servicio";
import ComponenteCampo from "./componentes/ComponenteCampo";

const opcionesIniciales = {
  tipo: [
    { valor: "Perro", etiqueta: "Perro" },
    { valor: "Gato", etiqueta: "Gato" },
    { valor: "Pájaro", etiqueta: "Pájaro" },
    { valor: "Otro", etiqueta: "Otro" },
  ],
  diagnostico: [
    { valor: "Leishmaniosis", etiqueta: "Leishmaniosis" },
    { valor: "Epilepsia Idiopática", etiqueta: "Epilepsia Idiopática" },
    { valor: "Moquillo", etiqueta: "Moquillo" },
    { valor: "Parvovirus", etiqueta: "Parvovirus" },
    { valor: "Aspergilosis", etiqueta: "Aspergilosis" },
  ],
  mascota: [],
  veterinaria: [],
  dueno: [],
};

class Pagina extends Component {
  constructor(props) {
    super(props); //llama a todos los métodos del componente
    this.state = {
      mostraModal: false,
      entidades: [],
      objeto: {},
      idObjeto: null,
      method: "POST",
      columnas: [],
      options: opcionesIniciales,
    };
  }

  cambiarModal = (_evento, method = "POST", newState = {}) => {
    let _newState = {
      mostraModal: !this.state.mostraModal,
      method,
      ...newState,
    };
    if (method === "POST") {
      _newState = { ..._newState, idObjeto: null, objeto: {} };
    }
    this.obtenerOpcionesBackend(_newState);
  };

  listar = async () => {
    const { entidad } = this.props;
    const entidades = await listarEntidad({ entidad });
    let columnas = [];
    if (Array.isArray(entidades) && entidades.length > 0) {
      columnas = Object.keys(entidades[0]) || [];
    }
    this.setState({ entidades, columnas });
  };

  manejarInput = (evento) => {
    const {
      target: { value, name },
    } = evento;
    let { objeto } = this.state;
    objeto = { ...objeto, [name]: value };
    this.setState({ objeto });
  }; //... copia de objeto del constructor

  crearEntidad = async (_evento = null) => {
    const { entidad } = this.props;
    let { objeto, method, idObjeto } = this.state;
    await crearEditarEntidad({ entidad, objeto, method, idObjeto });
    this.cambiarModal(_evento, "POST", { objeto: {}, idObjeto: null });
    //this.listar();
  };
  obtenerOpcionesBackend = async (newState) => {
    const { options } = this.state;
    const mascotasPromise = listarEntidad({ entidad: "mascotas" });
    const veterinariasPromise = listarEntidad({ entidad: "veterinarias" });
    const duenosPromise = listarEntidad({ entidad: "duenos" });
    let [mascota = [], veterinaria = [], dueno = []] = await Promise.all([
      mascotasPromise,
      veterinariasPromise,
      duenosPromise,
    ]);
    mascota = mascota.map((_mascota, index) => ({
      valor: index.toString(),
      etiqueta: `${_mascota.nombre} (${_mascota.tipo})`,
    }));
    veterinaria = veterinaria.map((_veterinaria, index) => ({
      valor: index.toString(),
      etiqueta: `${_veterinaria.nombre} ${_veterinaria.apellido}`,
    }));
    dueno = dueno.map((_dueno, index) => ({
      valor: index.toString(),
      etiqueta: `${_dueno.nombre} ${_dueno.apellido}`,
    }));
    const nuevasOpciones = { ...options, mascota, veterinaria, dueno };
    console.log({ nuevasOpciones });
    this.setState({ ...newState, options: nuevasOpciones });
  };

  editarEntidad = async (_evento, index) => {
    const { entidad } = this.props;
    const objeto = await obtenerUno({ entidad, idObjeto: index });
    const newState = { objeto, idObjeto: index };
    this.cambiarModal(null, "PUT", newState);
  };

  eliminarEntidad = async (_evento, index) => {
    const { entidad } = this.props;
    const respuesta = await eliminarEntidad({ entidad, idObjeto: index });
    console.log({ respuesta });
    this.listar();
  };

  componentDidMount() {
    this.listar();
  }

  // código del componente

  // render siempre debe ir el último
  //render = interpreta el código para mostrar
  render() {
    const { titulo = "Página sin título", entidad } = this.props;
    const { columnas, idObjeto, entidades, objeto, options } = this.state;
    return (
      <>
        <ActionsMenu cambiarModal={this.cambiarModal} titulo={titulo} />
        <Tabla
          entidades={entidades}
          editarEntidad={this.editarEntidad}
          eliminarEntidad={this.eliminarEntidad}
          columnas={columnas}
        />
        {this.state.mostraModal && (
          <Modal
            cambiarModal={this.cambiarModal}
            manejarInput={this.manejarInput}
            crearEntidad={this.crearEntidad}
            entidad={entidad}
            idObjeto={idObjeto}
          >
            {columnas.map((columna, index) => (
              <ComponenteCampo
                key={index}
                nombreCampo={columna}
                manejarInput={this.manejarInput}
                objeto={objeto}
                options={options}
              />
            ))}
          </Modal>
        )}
      </>
    );
  }
}

export default Pagina;
