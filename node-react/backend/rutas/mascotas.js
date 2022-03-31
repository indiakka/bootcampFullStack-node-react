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
      if (
        data.query &&
        (typeof data.query.nombre !== "undefined" ||
          data.query.tipo !== "undefined" ||
          data.query.dueno !== "undefined")
      ) {
        const llavesQuery = Object.keys(data.query);
        let respuestaMascotas = [...mascotas];
        for (const llave of llavesQuery) {
          respuestaMascotas.filter(
            (_mascota) => _mascota[llave] === data.query[llave]
          );
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
