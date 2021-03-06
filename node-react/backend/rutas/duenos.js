const { palabraSinAcentos } = require("../util");

module.exports = function duenosHandler(duenos) {
  return {
    get: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        console.log("handler duenos", { data });
        if (duenos[data.indice]) {
          return callback(200, duenos[data.indice]);
        }
        return callback(404, {
          mensaje: `dueno con indice ${data.indice} no encontradO`,
        }); // poniendo `` es un literal
      }
      /* verifico que data.query traiga datos
      en dni o nombre o apellido, esto significa
      que el request es una búsqueda */
      if (
        data.query &&
        (data.query.nombre || data.query.apellido || data.query.dni)
      ) {
        //creo un array con las llaves del objeto data query
        const llavesQuery = Object.keys(data.query);
        /* clono el array de duenoss que viene de reucursos  y este
         irá guardando los resultados */
        let respuestaDuenos = [...duenos];

        /* filtro el array de respuestas con el index solamente dejar
          los objetos de duenos que cumplen con la búsqueda */
        respuestaDuenos = respuestaDuenos.filter((_dueno) => {
          let resultado = false;
          /* recorro cada una de las llaves con el fin de filtrar
          según los criterios de búsqueda */
          for (const llave of llavesQuery) {
            const busqueda = palabraSinAcentos(data.query[llave]);

            /*  creo una expresión regular para que la búsqueda
            devuelva el resultado aunque sea may. o min. o partes parciales
            de una palabra poniendo el ig ej: mar de marta*/
            const expresionRegular = new RegExp(busqueda, "ig");
            const campoDuenoSinAcentos = palabraSinAcentos(_dueno[llave]);
            /*  resultado guarda la verificación del string del criterio de
            búsqueda y los objetos de duenos, nos dice si el criterio está
            o no, en el objeto de duenos que estamos evaluando en el momento */
            resultado = campoDuenoSinAcentos.match(expresionRegular);
            if (resultado) {
              break;
            }
          }
          /* el resultado entrega null cuando no encuentra  el criterio de
            búsqueda, null es falso por lo tanto el filter ignorará el resultado
            === null, y los que si tengan el criterio de búsqueda entran en el 
            array de respuestaduenos  */
          return resultado;
        });
        return callback(200, respuestaDuenos);
      }
      callback(200, duenos);
    },
    post: (data, callback) => {
      duenos.push(data.payload);
      callback(201, data.payload);
    },
    put: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (duenos[data.indice]) {
          duenos[data.indice] = data.payload;
          return callback(200, duenos[data.indice]);
        }
        return callback(404, {
          mensaje: `dueno con indice ${data.indice} no encontrado`,
        });
      }
      callback(400, { mensaje: "indice no enviado" });
    },
    delete: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (duenos[data.indice]) {
          /* esta condicional, esta pidiendo un data.indice y en la siguiente linea
           le está diciendo que duenos sea igual a lo mismo, pero
           filtrando que el indice pasado anteriormente no esté en él. Ya que será
           el que se va a eliminar */
          duenos = duenos.filter((_dueno, indice) => indice != data.indice);
          return callback(204, {
            mensaje: `elemento con indice ${data.indice} eliminado`,
          });
        }
        return callback(404, {
          mensaje: `dueno con indice ${data.indice} no encontrado`,
        });
      }
      callback(400, { mensaje: "indice no enviado" });
    },
  };
};
