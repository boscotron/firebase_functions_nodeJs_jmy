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
const engines = require('consolidate');
const hbs = require('hbs');
const app = express();
///////
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
///
const jmy = require('comsis_jmy');
const jmy_connect= require('./config/key.js');

app.use(express.static(__dirname + '/public'));


app.set('view engine',"hbs");
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(jmy.co);
let context = jmy.context;
app.get('/sesion/:i/:t',jmy.entrar(jmy_connect.key),jmy.auth());
app.get('/instalar', jmy.sesion(jmy_connect.key),jmy.instalar());
app.get('/administrador/:c', jmy.sesion(jmy_connect.key),jmy.administrador_g());
app.post('/administrador/:c/:p', jmy.sesion(jmy_connect.key),jmy.administrador_p());


app.get('/token', jmy.sesion(jmy_connect.key),async (req,res)=>{
  jmy.token([],req.accesos).then(function (r) {
    console.log('token -->',r);
    console.log('acceso -->',req.accesos);
    console.log('api -->',req.accesos.api.json);
    res.status(403).send('Token on console ');
  });
});





app.get('/caja', jmy.sesion(jmy_connect.key), async (req, res) => {

  let data=context(req);
  data=context(req,{
    css:[
      {url:"//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"}
    ],
    js:[
      {url:"//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"},
    ]
  });
  data.head.title='Caja Dashboard';
  data.out={ola:"ola k ace"};
  console.log(req);
  res.render('caja_dashboard',data);

});

app.get('/caja/:p', jmy.sesion(jmy_connect.key), async (req, res) => {

  let data=context(req);
  data=context(req,{
    css:[
      {url:"//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"}
    ],
    js:[
      {url:"//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"},
    ]
  });
  

  console.log(req);
  switch (req.params.p) {
    case 'caja':
    
    data.head.title='Caja';
    res.render('caja',data);
    break;
    case 'pagos':
      data.head.title='Pagos';
      data.carga.js.push({url:data.head.cdn+"assets/js/coworking/caja_pagos.js"})
      res.render('caja_pagos',data);
    break;
  
    default:

    break;
  }  
  

});



app.get('/smp/captura', jmy.sesion(jmy_connect.key), async (req, res) => {

  let data=context(req);
  data=context(req,{
    css:[
      {url:"//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"},
      {url:"//cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css"},
      {url:"//raw.githack.com/ttskch/select2-bootstrap4-theme/master/dist/select2-bootstrap4.min.css"}
    ],
    js:[
      {url:"//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"},
      {url:"//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"},
      {url:"//cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"},
      {url:data.head.cdn+"assets/js/smp/captura.js?d="+Date.now()},
    ]
  });

  
  data.head.title='Alta de acción (primera vez)';



  console.log(req);
  res.render('smp_captura',data);

});

app.get('/smp/gestion/:p', jmy.sesion(jmy_connect.key), async (req, res) => {

  let data=context(req);
  data=context(req,{
    css:[
      {url:"//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"},
      {url:"//cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css"},
      {url:"//raw.githack.com/ttskch/select2-bootstrap4-theme/master/dist/select2-bootstrap4.min.css"},
      {url:"//cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.0/bootstrap3-editable/css/bootstrap-editable.css"}
    ],
    js:[
      {url:"//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"},
      {url:"//cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"},
      {url:"//cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"},
      {url:"//cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.0/bootstrap3-editable/js/bootstrap-editable.min.js"}
    ]
  });
  

  console.log(req);
  switch (req.params.p) {
    case 'avances':
      data.carga.js.push({url:data.head.cdn+"assets/js/smp/gestion_avances.js"});
      data.head.title='Gestíon Avances';
      res.render('smp_gestion_avances',data);
    break;
      data.head.title='Gestíon Avances Detalle';
      res.render('smp_gestion_avances_detalle',data);
    break;
    case 'captura':
      data.head.title='Gestíon captura';
      res.render('smp_gestion_captura',data);
    break;
    case 'resumen':
      data.carga.js.push({url:"https://www.gstatic.com/charts/loader.js"});
      data.carga.js.push({url:data.head.cdn+"assets/js/smp/resumen.js"});
      data.head.title='Gestíon resumen';
      res.render('smp_gestion_resumen',data);
    break;
  
    default:

    break;
  }  
  
});

app.get('/smp/catalogo', jmy.sesion(jmy_connect.key), async (req, res) => {

  let data=context(req);
  data=context(req,{
    css:[
      {url:"//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"},
      {url:"//cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.0/bootstrap3-editable/css/bootstrap-editable.css"}
    ],
    js:[
      {url:"//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"},
      {url:"//cdnjs.cloudflare.com/ajax/libs/x-editable/1.5.0/bootstrap3-editable/js/bootstrap-editable.min.js"},
      {url:data.head.cdn+"assets/js/smp/catalogo.js?d="+Date.now()},
    ]
  });  
  console.log(req);
  data.head.title='Catálogos';
  res.render('smp_catalogo',data);

});

app.post('/smp', jmy.sesion(jmy_connect.key), async (req, res) => {
  console.log('req.body',req.body);
  let data=context(req);
  data.out['body'] = req.body;
  res.send(JSON.stringify(data.out));
});

app.post('/smp/catalogo/:p', jmy.sesion(jmy_connect.key), async (req, res) => {

  let data=context(req);

  console.log(req);
  switch (req.params.p) {
    case 'objetivos':
    
      
      res.send(JSON.stringify(data.out));
    break;
    case 'programas':
    
      res.send(JSON.stringify(data.out));
    break;
    case 'objetivos':
      
      res.send(JSON.stringify(data.out));
    break;
  
    default:

    break;
  }  

});



app.get('/', jmy.sesion(jmy_connect.key),async (req, res) => {

  const post = req.body;
  let acceso = req.accesos
  try {      
    console.log('post',post);
    let data=context(req);
    res.render('index',data);    
  } catch(error) {
    console.log('Error detecting sentiment or saving message', error.message);
    res.sendStatus(500);
  }
});



// Expose the API as a function
exports.api = functions.https.onRequest(app);

