/*
La licencia MIT (MIT)

Copyright (c) 2019 Concomsis S.A. de C.V.

Por la presente se otorga el permiso, sin cargo, a cualquier persona que obtenga una copia de
este software y los archivos de documentación asociados (el "Software"), para tratar en
el Software sin restricciones, incluidos, entre otros, los derechos de
usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y / o vender copias de
el Software, y para permitir que las personas a quienes se suministra el Software lo hagan,
sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las
Copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O
IMPLÍCITOS, INCLUIDOS, PERO NO LIMITADOS A LAS GARANTÍAS DE COMERCIABILIDAD, APTITUD
PARA UN PROPÓSITO PARTICULAR Y NO INCUMPLIMIENTO. EN NINGÚN CASO LOS AUTORES O
LOS TITULARES DEL DERECHO DE AUTOR SERÁN RESPONSABLES POR CUALQUIER RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, SI
EN UNA ACCIÓN DE CONTRATO, CORTE O DE OTRA MANERA, DERIVADO DE, FUERA O EN
CONEXIÓN CON EL SOFTWARE O EL USO U OTRAS REPARACIONES EN EL SOFTWARE.
*/
'use strict';
/////////////////////// CON FIREBASE

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient();

/////////////////////////////


const express = require('express');
const app = express();

const jmy = require('comsis_jmy');

const acceso = {
  servidor:"https://us-central1-encouraging-mix-111109.cloudfunctions.net/da/",
  eid:"MARCELO_EMPRESA",
  uid:"boscotronZXC",
  token:"boscotronZXCTOKEN"
};

 jmy.token([],acceso).then(function(e){
    console.log("token",e);  
  });



  /*

  jmy.guardar([{
    tabla:"tabla_extra",
    api:"APIKEY",
    id:"BSK",
    guardar:{"campo1":"Ola k hace","campo2":"hola!","campo3":" :D "}
  }],acceso).then(function (e) {
    for(let p of e){
      p=p.jmy_guardar;
      console.log("guardar",p, "[[ EL ID ES: "+p.out.cabecera.id+"]]");  
    }

    jmy.ver([{
      tabla:"tabla_extra",
      api:"APIKEY",
      col:["campo3"]
    }],acceso).then(function (e) {  
      for(let p of e){
        p=p.jmy_ver;
        console.log("ver",p.ot, "[[ EL ID ES: "+p.id_f+"]]");  
      }
    });

  });
*/


/*
  jmy.nueva_empresa([{
    eid: "MARCELO_EMPRESA",
    estado: "2",
    datos:{
      "tablas":[
        {
          "nombre": "registro_timeline",
          "entrada": "1",
          "salida": "0"
        },
        {
          "nombre": "tabla_extra",
          "entrada": "1",
          "salida": "0"
        },
        {
          "nombre": "registro_de_pagos",
          "entrada": "1",
          "salida": "0"
        }     
      ]}
  }],acceso).then(function(res){
    console.log(
      res[0].jmy_emp.out.datos,
      res[0].jmy_emp.out.datos.datos.tablas
      );  
  });
  
  jmy.db([{eid:"MARCELO_EMPRESA"}],acceso).then(function (e) {
    console.log("DB",e);
  });
*/




app.post('/ver', async (req, res) => {
  const ver = req.body;
  try {
    console.log(ver);
    res.status(201).json(ver);
  } catch(error) {
    console.log('Error detecting sentiment or saving message', error.message);
    res.sendStatus(500);
  }
});

// Expose the API as a function
exports.api = functions.https.onRequest(app);

