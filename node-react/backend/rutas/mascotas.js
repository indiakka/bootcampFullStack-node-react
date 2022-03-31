module.exports = function mascotasHandler(mascotas) {
  return {
    get: (data, callback) => {
      console.log("handler mascotas", { data });
      if (typeof data.indice !== "undefined") {
        if (mascotas[data.indice]) {
          return callback(200, mascotas[data.indice]);
        }
        return callback(404, {
          mensaje: `mascota con indice ${data.indice} no encontrada`,
        }); // poniendo `` es un literal
      }
      /* verifico que data.query traiga datos
      en tipo o nombre o dueno, esto significa
      que el request es una búsqueda */
      if (
        data.query &&
        (typeof data.query.nombre !== "undefined" ||
          data.query.tipo !== "undefined" ||
          data.query.dueno !== "undefined")
      )
      {
        //creo un array con las llaves del objeto data query
        const llavesQuery = Object.keys(data.query);
       /* clono el array de mascotas que viene de reucursos  y este
        irá guardando los resultados */
        let respuestaMascotas = [ ...mascotas ];
        /* recorro cada una de las llaves con el fin de filtrar
        según los criterios de búsqueda */
        for ( const llave of llavesQuery )
        {
          /* filtro el array de respuestas con el fin solamente dejar
          los objetos de mascota que cumplen con la búsqueda */
          respuestaMascotas = respuestaMascotas.filter((_mascota) => {
           /*  creo una expresión regular para que la búsqueda
           devuelva el resultado aunque sea may. o min. o partes parciales
           de una palabra poniendo el ig ej: gat de gato*/
            const expresionRegular = new RegExp( data.query[ llave ], "ig" );
            /*  resultado guarda la verificación del string del criterio de 
            búsqueda y los objetos de mascota, nos dice si el criterio está
            o no, en el objeto de mascota que estamos evaluando en el momento */
            const resultado = _mascota[ llave ].match( expresionRegular );
            /* el resultado entrega null cuando no encuentra  el criterio de 
            búsqueda, null es falso por lo tanto el filter ignorará el resultado
            === null, y los que si tengan el criterio de búsqueda entran en el 
            array de respuestaMascotas  */
            return resultado;
          });
        }
        return callback(200, respuestaMascotas);
      }
      callback(200, mascotas);
    },
    post: (data, callback) => {
      mascotas.push(data.payload);
      callback(201, data.payload);
    },
    put: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (mascotas[data.indice]) {
          mascotas[data.indice] = data.payload;
          return callback(200, mascotas[data.indice]);
        }
        return callback(404, {
          mensaje: `mascota con indice ${data.indice} no encontrada`,
        });
      }
      callback(400, { mensaje: "indice no enviado" });
    },
    delete: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (mascotas[data.indice]) {
          /* esta condicional, esta pidiendo un data.indice y en la siguiente linea
           le está diciendo que mascotas sea igual a lo mismo, pero
           filtrando que el indice pasado anteriormente no esté en él. Ya que será
           el que se va a eliminar */
          mascotas = mascotas.filter(
            (_mascota, indice) => indice != data.indice
          ); // la _ indica que puede que se use o no esa variable
          return callback(204, {
            mensaje: `elemento con indice ${data.indice} eliminado`,
          });
        }
        return callback(404, {
          mensaje: `mascota con indice ${data.indice} no encontrada`,
        });
      }
      callback(400, { mensaje: "indice no enviado" });
    },
  };
};
