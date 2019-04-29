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
const routes = require('./routes/index');
const users = require('./routes/users');
///

const jmy = require('comsis_jmy');
const jmy_connect={
  servidor:"https://comsis.mx/api/auth/v1/",
  path:"coworkingnestplayadelcarmen/us-central1/api/",
  localhost:true,
  localhost_api:"https://us-central1-encouraging-mix-111109.cloudfunctions.net/da/",
  api_server:"e2ad454bea7d919f0fc411a8b885580c", 
  api:"c5594c6085437d206ab73b4c2ace3596",
  apikey:"ff9ff56d008e7fb8ef5ce5bdeab84814",
};

app.use(express.static(__dirname + '/public'));



let blocks = {}; 
let tmp = [];  
hbs.registerHelper('extend', function(name, context) {
    let block = blocks[name];
    if (!block) { 
        block = blocks[name] = [];
    }
    block.push(context.fn(this)); 
});

hbs.registerHelper('block', function(name) {
    let val = (blocks[name] || []).join('\n');
    blocks[name] = [];
    return val; 
});

hbs.registerHelper('carga', function(items=[], options) {
 // console.log('carga inicia con: ',items);
  
  let out = "<!-- carga automatica JMY -->";
  for(let i=0, l=items.length; i<l; i++) {
    out = out + options.fn(items[i]) ;
    //console.log('carga for -- ',);
  }
  return out + "<!-- fin carga automatica JMY -->";
});
hbs.registerHelper('cargab', function(items=[], options) {
 // console.log('carga inicia con: ',items);
  
  let out = "<!-- carga automatica JMY -->";
  for(let i=0, l=items.length; i<l; i++) {
    out = out + options.fn(items[i]) ;
    //console.log('carga for -- ',t);
  }
  return out + "<!-- fin carga automatica JMY -->";
});

app.set('view engine',"hbs");
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(jmy.co);


let context = function (req,carga={css:[],js:[],meta:[]}) {  
  let acceso = req.accesos;    
  /*console.log('acceso',acceso);*/
  //console.log('api ---->',acceso.api.json.modulos,Object.keys(acceso.api.json.modulos));
  let menu = [];

  Object.keys(acceso.api.json.modulos).forEach(mod => {
   // console.log(mod);
    menu.push({
      nombre: acceso.api.json.modulos_label[ mod ],
      modulo: acceso.pm[mod]    
    });
  });
  //console.log(">>>> >>>>><<<  MENU ", menu );
  
  let o ={
    head:{
      cdn:"http://localhost:5000/",
      cdn2:"https://cdn-concomsis.firebaseapp.com/paper/",
      url_base:'http'+((jmy_connect.localhost)?'':'s')+'://'+req.headers.host+'/'+jmy_connect.path,
      title:"titulo",
      keywords:"",
      description:"",
      url:"",
      image:"",
      panel:{
        nombre:"Jmy Panel",            
        corto:"JMY",
        url:""
      }
    },
    social:{
      twitter_card:"summary_large_image",
      twitter_site:"summary_large_image",
      twitter_creator:"summary_large_image",
      twitter_image:"summary_large_image",
      twitter_card:"summary_large_image",
      og_type:"article",
      og_site_name:"article",
    },
  empresa:{
    nombre:acceso.api.nombre,
    logo:acceso.api.json.logo,
    terminos_y_condiciones:acceso.api.json.terminos_y_condiciones,
    aviso_de_privacidad:acceso.api.json.aviso_de_privacidad,
  },
  menu:menu,
  usuario:{
    nombre:acceso.user.name,
    email:acceso.user.email,
    uid:acceso.user.user_id,
    foto:acceso.user_info.url_foto || "http://localhost:5000/assets/img/faces/face-2.jpg",
    provvedor:acceso.user_info.proveedor
  },
  vistaweb:{
    capacidad:"capacidad"
  },
  carga:carga,
  out:{} 
  };
   return o;
} 

app.get('/sesion/:i/:t',jmy.entrar(jmy_connect),jmy.auth());
app.get('/instalar', jmy.sesion(jmy_connect),jmy.instalar());


app.get('/administrador/:c', jmy.sesion(jmy_connect),async (req,res)=>{
  try{
    let data=context(req);
    const a = req.accesos; 
    //console.log("Modulos a usar",a.api.json);
    if(a.pm.administrador.permisos>3){
      let ren='administrador_dashboad';
      switch (req.params.c) {
        case 'usuarios':
          let m = [];
          let n = []; 
          let c = 0;
          //console.log(a);
          
          a.api.json.modulos_niveles.forEach(ni =>{n.push({nombre:ni,c:c});c++;});
          Object.keys(a.api.json.modulos).forEach(mod => {          
            m.push({
              nombre: a.api.json.modulos_label[ mod ],
              api: mod ,
              modulo: a.pm[ mod],
              niveles:n
            });
          });
          //console.log('usuarios mod',m);
          data=context(req,{
            css:[
              {url:"//cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css"}
            ],
            js:[
              {url:"//cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js"},
              {url:data.head.cdn+"assets/js/jmy/jmy_administrador_usuarios.js?d="+Date.now()},
            ]
          });
          data.head.title="Administrador de usuarios";
          data.out={modulos:m};
          //console.log("data.out",data.out.modulos);
          
          ren='administrador_usuarios';
          jmy.ver([{
            tabla:"plantillas_web",
            api:"vstaweb",
          }],a).then(function (vw) {  
            console.log("vistaweb",vw);
            data.vistaweb=vw;
            res.render(ren,data);    
          });
          
        break;    
        default:
          break;
      }
    }else{
      res.render('404',data);
    }
  }catch(e){
    console.log('Error Administrador', e.message);
    res.status(500).send();
  }  
});



app.post('/administrador/:c/:p', jmy.sesion(jmy_connect),async (req,res)=>{
  res.set('Cache-Control','public, max-age=2, s-maxage=4');
  try{
    let data=context(req);
    const a = req.accesos;
      if(a.pm.administrador.permisos>3){
      let ren='administrador_dashboad';
      let o = {
        error:0,
        mensaje:""
      };
      o['body']=[];
      console.log('req.body',req.body);
      if(req.body!=undefined&&req.body!=''&&!Array.isArray(req.body))
        o['body']=JSON.parse(req.body);
      switch (req.params.c) {
        case 'usuarios':
          let m = [];
          let n = [];
          let c = 0;
          switch (req.params.p) {
            case 'modulos':
              if(a.pm.administrador.permisos>3){
                jmy.usuario([{uid:o.body.u}],a).then(function (r) {
                  let j = JSON.parse(r[0].jmy_usr[0][0].datos);
                  j[0].emp[a.eid].apis=o.body.g;
                  jmy.usuario([{uid:o.body.u,datos:j}],a).then(function (reu) {
                    o.mensaje=reu[0].jmy_usr[0];
                    o['respuesta']=r;
                    res.send(JSON.stringify(o));                      
                  });                         
                });
              }else{
                o.error=1;o.mensaje="Se requieren permisos de administrador para realizar los cambios";
                res.send(JSON.stringify(o));
              }          
            break;
            case 'listausuarios':      
              if(a.pm.administrador.permisos>3){
                jmy.ver([{
                  tabla:"usuarios",
                  api:"administrador",
                  col:["info"],
                  lo:1
                }],a).then(function (e) {  
                  res.send(JSON.stringify(e));                   
                });
              }else{
                o.error=1;o.mensaje="Se requieren permisos de administrador para realizar los cambios";
                res.send(JSON.stringify(o));
              }          
            break;
            case 'guardar-perfil':      
              if(a.pm.administrador.permisos>3){                
                if(req.body!=undefined&&req.body!=''&&!Array.isArray(req.body))
                  o['body']=JSON.parse(req.body);                  
                if(o['body']['u']!=''){
                  jmy.guardar([{
                    tabla:"usuarios",
                    api:"administrador",
                    id:o['body']['u'],
                    guardar:{perfil:o['body']['g']}
                  }],a).then(function (e) {
                    res.send( JSON.stringify(e[0].jmy_guardar) );
                  });
                }
              }else{
                  o.error = 1;
                  o.mensaje="No tienes accesos a esta sección";
              }
            break;
            case 'perfil':      
              if(a.pm.administrador.permisos>3){                
                if(req.body!=undefined&&req.body!=''&&!Array.isArray(req.body))
                o['body']=JSON.parse(req.body);
                jmy.usuario([{
                  uid:o['body']['u']
                }],a).then(function (usu) {  
                    jmy.ver([{
                        tabla:"usuarios",
                        api:"administrador",
                        id:[o['body']['u']]
                      }],a).then(function (e){
                        let r = usu[0].jmy_usr[0][0];
                        r.datos=JSON.parse(r.datos);
                        r=r.datos[0].emp[a.eid].apis;
                        res.send(JSON.stringify({modulos:r,u:o['body']['u'],info:e[0].jmy_ver.ot}));
                    });
                });
              }else{
                o.error=1;o.mensaje="Se requieren permisos de administrador para realizar los cambios";
                res.send(JSON.stringify(o));
              }          
            break;
            default:
              break;                 
          } 
        break; 
        case 'jmyWebAjG':
          console.log('jmyWebAjG',o.body);
          let g = [];    
          switch (req.params.p) {
            case 's':      
              Object.keys(o.body).forEach(e => {
                Object.keys(o.body[e]).forEach(eb => {
                  Object.keys(o.body[e][eb]).forEach(ec => {
                    g.push({
                      tabla:eb,
                      api:e,
                      id:(ec!='nuevo')?ec:null,
                      guardar:o.body[e][eb][ec]
                    });
                  });
                });
              });          
              jmy.guardar(g,a).then(function (e) { 
                res.send( JSON.stringify([e,g]) );        
              });   
            break;
            case 'v':
              Object.keys(o.body).forEach(e => {
                Object.keys(o.body[e]).forEach(eb => {
                  Object.keys(o.body[e][eb]).forEach(ec => {
                    g.push({
                      tabla:eb,
                      api:e,
                      id:ec,
                      col:o.body[e][eb][ec]
                    });
                  });
                });
              });        
              jmy.ver(g,a).then(function (e) {  
                res.send( JSON.stringify(e) );      
              });
            break;
            default:
            break;
          }       
        break;
        default:
          break;
        
      }
    }else{
      res.send(JSON.stringify({error:"Se requien permisos de administrador"}));
    }
  }catch(e){
    console.log('Error Administrador', e);
    res.status(500).send();
  }
});




app.get('/token', jmy.sesion(jmy_connect),async (req,res)=>{
  jmy.token([],req.accesos).then(function (r) {
    console.log('token -->',r);
    console.log('acceso -->',req.accesos);
    console.log('api -->',req.accesos.api.json);
    res.status(403).send('Token on console ');
  });
});





app.get('/caja', jmy.sesion(jmy_connect), async (req, res) => {

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

app.get('/caja/:p', jmy.sesion(jmy_connect), async (req, res) => {

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



app.get('/smp/captura', jmy.sesion(jmy_connect), async (req, res) => {

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

app.get('/smp/gestion/:p', jmy.sesion(jmy_connect), async (req, res) => {

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
    case 'avances':
    
      data.head.title='Gestíon Avances';
      res.render('smp_gestion_avances',data);
    break;
    case 'captura':
      data.head.title='Gestíon captura';
      res.render('smp_gestion_captura',data);
    break;
    case 'resumen':
      data.head.title='Gestíon resumen';res.render('smp_gestion_resumen',data);
    break;
  
    default:

    break;
  }  
  
});

app.get('/smp/catalogo/:p', jmy.sesion(jmy_connect), async (req, res) => {

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
    case 'objetivos':
    
      data.head.title='Gestíon objetivos';
      res.render('smp_catalogo_objetivos',data);
    break;
    case 'programas':
      data.head.title='Catálogo programas';
      res.render('smp_catalogo_programas',data);
    break;
    case 'objetivos':
      data.head.title='Gestíon objetivos';
      res.render('smp_catalogo_objetivos',data);
    break;
  
    default:

    break;
  }  

});



app.get('/', jmy.sesion(jmy_connect),async (req, res) => {

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



/*
app.use('/', routes);
app.use('/users', users);
*/



// Expose the API as a function
exports.api = functions.https.onRequest(app);

