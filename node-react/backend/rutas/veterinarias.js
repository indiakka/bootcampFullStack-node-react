module.exports = function veterinariasHandler(veterinarias) {
  return {
    get: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        console.log("handler veterinarias", { data });
        if (veterinarias[data.indice]) {
          return callback(200, veterinarias[data.indice]);
        }
        return callback(404, {
          mensaje: `veterinaria con indice ${data.indice} no encontrada`,
        }); // poniendo `` es un literal
      }
       /* verifico que data.query traiga datos
      en apellido o nombre o documento, esto significa
      que el request es una búsqueda */
      if (
        data.query &&
        (data.query.nombre||
          data.query.apellido||
          data.query.documento )
      )
      {
        //creo un array con las llaves del objeto data query
        const llavesQuery = Object.keys( data.query );
        /* clono el array de veterinarias que viene de reucursos  y este
         irá guardando los resultados */
        let respuestaVeterinarias = [ ...veterinarias ];
        /* recorro cada una de las llaves con el fin de filtrar
        según los criterios de búsqueda */
        for ( const llave of llavesQuery )
        {
          /* filtro el array de respuestas con el index solamente dejar
          los objetos de veterinaria que cumplen con la búsqueda */
          respuestaVeterinarias = respuestaVeterinarias.filter( ( _veterinaria ) =>
          {
            /*  creo una expresión regular para que la búsqueda
            devuelva el resultado aunque sea may. o min. o partes parciales
            de una palabra poniendo el ig ej: mar de marta*/
            const expresionRegular = new RegExp( data.query[ llave ], "ig" );
            /*  resultado guarda la verificación del string del criterio de 
            búsqueda y los objetos de veterinaria, nos dice si el criterio está
            o no, en el objeto de veterinaria que estamos evaluando en el momento */
            const resultado = _veterinaria[ llave ].match( expresionRegular );
            /* el resultado entrega null cuando no encuentra  el criterio de 
            búsqueda, null es falso por lo tanto el filter ignorará el resultado
            === null, y los que si tengan el criterio de búsqueda entran en el 
            array de respuestaveterinarias  */
            return resultado;
          } );
        }
        return callback( 200, respuestaVeterinarias );
      }
      callback(200, veterinarias);
    },
    post: (data, callback) => {
      veterinarias.push(data.payload);
      callback(201, data.payload);
    },
    put: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (veterinarias[data.indice]) {
          veterinarias[data.indice] = data.payload;
          return callback(200, veterinarias[data.indice]);
        }
        return callback(404, {
          mensaje: `veterinaria con indice ${data.indice} no encontrada`,
        });
      }
      callback(400, { mensaje: "indice no enviado" });
    },
    delete: (data, callback) => {
      if (typeof data.indice !== "undefined") {
        if (veterinarias[data.indice]) {
          /* esta condicional, esta pidiendo un data.indice y en la siguiente linea
           le está diciendo que veterinarias sea igual a lo mismo, pero
           filtrando que el indice pasado anteriormente no esté en él. Ya que será
           el que se va a eliminar */
          veterinarias = veterinarias.filter(
            (_veterinaria, indice) => indice != data.indice
          ); // la _ indica que puede que se use o no esa variable
          return callback(204, {
            mensaje: `elemento con indice ${data.indice} eliminado`,
          });
        }
        return callback(404, {
          mensaje: `veterinaria con indice ${data.indice} no encontrada`,
        });
      }
      callback(400, { mensaje: "indice no enviado" });
    },
  };
};
