import React, { Component } from 'react';
import icnServEmail from './images/icnServEmail.png';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
  <meta charSet="utf-8" />
  {/* 
	 =============================================================================
	 === PLANTILLA DESARROLLADA POR LA OFICINA DE MEDIOS DIGITALES - UNIMEDIOS ===
	 =============================================================================
		*/}
  {/* base href="ingenieria.bogota.unal.edu.co/uapapp/" */}
  <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon" />
  <meta name="revisit-after" content="1 hour" />
  <meta name="distribution" content="all" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.5, user-scalable=yes"
  />
  <meta name="expires" content={1} />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="robots" content="all" />
  <link
    rel="stylesheet"
    type="text/css"
    href="css/bootstrap.min.css"
    media="all"
  />
  <link
    rel="stylesheet"
    type="text/css"
    href="css/bootstrap-theme.min.css"
    media="all"
  />
  <link rel="stylesheet" type="text/css" href="css/reset.css" media="all" />
  <link rel="stylesheet" type="text/css" href="css/unal.css" media="all" />
  <link rel="stylesheet" type="text/css" href="css/base.css" media="all" />
  <link rel="stylesheet" type="text/css" href="css/tablet.css" media="all" />
  <link rel="stylesheet" type="text/css" href="css/phone.css" media="all" />
  <link rel="stylesheet" type="text/css" href="css/small.css" media="all" />
  <link rel="stylesheet" type="text/css" href="css/printer.css" media="print" />
  <title>UAPAPP: Universidad Nacional de Colombia</title>
  <div id="services">
    <div className="indicator hidden-xs" />
    <ul className="dropdown-menu">
      <li>
        <a href="http://correo.unal.edu.co" target="_blank">
          <img
            src={require("./images/icnServEmail.png")}
            width={32}
            height={32}
            alt="Correo Electrónico"
          />
          Correo Electrónico
        </a>
      </li>
      <li>
        <a href="https://dninfoa.unal.edu.co" target="_blank">
          <img
            src={require("./images/icnServSia.png")}
            width={32}
            height={32}
            alt="Dirección Nacional de Información Académica"
          />
          DNINFOA - SIA
        </a>
      </li>
      <li>
        <a href="http://bibliotecas.unal.edu.co" target="_blank">
          <img
            src={require("./images/icnServLibrary.png")}
            width={32}
            height={32}
            alt="Biblioteca"
          />
          Bibliotecas
        </a>
      </li>
      <li>
        <a href="http://personal.unal.edu.co" target="_blank">
          <img
            src={require("./images/icnServCall.png")}
            width={32}
            height={32}
            alt="Convocatorias"
          />
          Convocatorias
        </a>
      </li>
      <li>
        <a href="http://identidad.unal.edu.co">
          <img
            src={require("./images/icnServIdentidad.png")}
            width={32}
            height={32}
            alt="Identidad U.N."
          />
          Identidad U.N.
        </a>
      </li>
    </ul>
  </div>
  <header id="unalTop">
    <div className="logo">
      <a href="http://unal.edu.co">
        <svg width="93%" height="93%">
          <image
                  xlinkHref={require("./images/escudoUnal.svg")}
            width="100%"
            height="100%"
            className="hidden-print"
          />
        </svg>
              <img src={require("./images/escudoUnal_black.png")} className = "visible-print" />
      </a>
    </div>
    <div className="seal">
      <img
        className="hidden-print"
        alt="Escudo de la República de Colombia"
        src={require("./images/sealColombia.png")}
        width={66}
        height={66}
      />
      <img
        className="visible-print"
        alt="Escudo de la República de Colombia"
        src={require("./images/sealColombia_black.png")}
        width={66}
        height={66}
      />
    </div>
    <div className="firstMenu">
      <button
        className="navbar-toggle collapsed"
        type="button"
        data-toggle="collapse"
        data-target="#bs-navbar"
        aria-controls="bs-navbar"
        aria-expanded="false"
      >
        <span className="icon-bar" />
        <span className="icon-bar" />
        <span className="icon-bar" />
      </button>
      <div className="btn-group languageMenu hidden-xs">
        <div className="btn btn-default dropdown-toggle" data-toggle="dropdown">
          es
          <span className="caret" />
        </div>
        <ul className="dropdown-menu">
          <li>
            <a href="index.html#">es</a>
          </li>
          <li>
            <a href="index.html#">en</a>
          </li>
        </ul>
      </div>
      <ul className="socialLinks hidden-xs">
        <li>
          <a
            href="https://www.facebook.com/UNColombia"
            target="_blank"
            className="facebook"
            title="Página oficial en Facebook"
          />
        </li>
        <li>
          <a
            href="https://twitter.com/UNColombia"
            target="_blank"
            className="twitter"
            title="Cuenta oficial en Twitter"
          />
        </li>
        <li>
          <a
            href="https://www.youtube.com/channel/UCnE6Zj2llVxcvL5I38B0Ceg"
            target="_blank"
            className="youtube"
            title="Canal oficial de Youtube"
          />
        </li>
        <li>
          <a
            href="http://agenciadenoticias.unal.edu.co/nc/sus/type/rss2.html"
            target="_blank"
            className="rss"
            title="Suscripción a canales de información RSS"
          />
        </li>
      </ul>
    </div>
    <div id="bs-navbar" className="navbar-collapse collapse navigation">
      <div className="site-url">
        <a href="https://www.ingenieria.bogota.unal.edu.co/uapapp/">
          ingenieria.bogota.unal.edu.co/uapapp/
        </a>
      </div>
      <div className="buscador">
        <div
          className="gcse-searchbox-only"
          data-resultsurl="http://unal.edu.co/resultados-de-la-busqueda/"
          data-newwindow="true"
        />
      </div>
      <div className="mainMenu">
        <div className="btn-group">
          <a href="index.html#" className="btn btn-default dropdown-toggle">
            Inicio
          </a>
          <span className="caret-right" />
        </div>
        <div className="btn-group">
          <a href="index.html#" className="btn btn-default dropdown-toggle">
            Contáctenos
          </a>
          <span className="caret-right" />
        </div>
        <div className="btn-group">
          <div
            className="btn btn-default dropdown-toggle"
            data-toggle="dropdown"
          >
            Sedes
            <span className="caret" />
          </div>
          <ul className="dropdown-menu dropItem-16">
            <li>
              <a href="http://amazonia.unal.edu.co" target="_blank">
                Amazonia
              </a>
              <span className="caret-right" />
            </li>
            <li>
              <a href="http://bogota.unal.edu.co" target="_blank">
                Bogotá
              </a>
              <span className="caret-right" />
            </li>
            <li>
              <a href="http://caribe.unal.edu.co" target="_blank">
                Caribe
              </a>
              <span className="caret-right" />
            </li>
            <li>
              <a href="http://delapaz.unal.edu.co" target="_blank">
                De La Paz
              </a>
              <span className="caret-right" />
            </li>
            <li>
              <a href="http://www.manizales.unal.edu.co" target="_blank">
                Manizales
              </a>
              <span className="caret-right" />
            </li>
            <li>
              <a href="http://medellin.unal.edu.co" target="_blank">
                Medellín
              </a>
              <span className="caret-right" />
            </li>
            <li>
              <a href="http://orinoquia.unal.edu.co" target="_blank">
                Orinoquia
              </a>
              <span className="caret-right" />
            </li>
            <li>
              <a href="http://www.palmira.unal.edu.co" target="_blank">
                Palmira
              </a>
              <span className="caret-right" />
            </li>
            <li>
              <a href="http://tumaco-pacifico.unal.edu.co" target="_blank">
                Tumaco
              </a>
              <span className="caret-right" />
            </li>
          </ul>
        </div>
      </div>
      <div className="btn-group hidden-sm hidden-md hidden-lg hidden-print">
        <div
          className="btn btn-default dropdown-toggle"
          data-toggle="dropdown"
          id="unalOpenMenuServicios"
          data-target="#services"
        >
          Servicios<span className="caret"> </span>
        </div>
      </div>
      <div className="btn-group hidden-sm hidden-md hidden-lg hidden-print">
        <div
          className="btn btn-default dropdown-toggle"
          data-toggle="dropdown"
          id="unalOpenMenuPerfiles"
          data-target="#profiles"
        >
          Perfiles<span className="caret"> </span>
        </div>
      </div>
    </div>
  </header>
  <main className="detalle">
    <div className="breadcrumb-class">
      Está en:
      <a href="index.html" target="_self" title="Inicio">
        Inicio
      </a>
    </div>
  </main>
  <footer className="clear">
    <nav className="col-md-3 col-lg-3 col-sm-3 col-xs-4 col-xxs-6 gobiernoLinea">
      <a href="http://www.legal.unal.edu.co" target="_top">
        Régimen Legal
      </a>
      <a href="http://personal.unal.edu.co" target="_top">
        Talento humano
      </a>
      <a href="http://contratacion.unal.edu.co" target="_top">
        Contratación
      </a>
      <a href="http://personal.unal.edu.co" target="_top">
        Ofertas de empleo
      </a>
      <a href="http://rendiciondecuentas.unal.edu.co/" target="_top">
        Rendición de cuentas
      </a>
      <a href="http://docentes.unal.edu.co/concurso-profesoral/" target="_top">
        Concurso docente
      </a>
      <a href="http://www.pagovirtual.unal.edu.co/" target="_top">
        Pago Virtual
      </a>
      <a href="http://controlinterno.unal.edu.co/" target="_top">
        Control interno
      </a>
      <a href="http://siga.unal.edu.co" target="_top">
        Calidad
      </a>
      <a href="http://unal.edu.co/buzon-de-notificaciones/" target="_self">
        Buzón de notificaciones
      </a>
    </nav>
    <nav className="col-md-3 col-lg-3 col-sm-3 col-xs-4 col-xxs-6 gobiernoLinea">
      <a href="http://correo.unal.edu.co" target="_top">
        Correo institucional
      </a>
      <a href="index.html#">Mapa del sitio</a>
      <a href="http://redessociales.unal.edu.co" target="_top">
        Redes Sociales
      </a>
      <a href="index.html#">FAQ</a>
      <a href="http://unal.edu.co/quejas-y-reclamos/" target="_self">
        Quejas y reclamos
      </a>
      <a href="http://unal.edu.co/atencion-en-linea/" target="_self">
        Atención en línea
      </a>
      <a href="http://unal.edu.co/encuesta/" target="_self">
        Encuesta
      </a>
      <a href="index.html#">Contáctenos</a>
      <a href="http://www.onp.unal.edu.co" target="_top">
        Estadísticas
      </a>
      <a href="index.html#">Glosario</a>
    </nav>
    <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4 col-xxs-12 footer-info">
      <p className="col-sm-12 col-md-6 contacto">
        <b>Contacto página web:</b>
        <br />
        Carrera 45 # 26-85
        <br />
        Edificio Insignia Julio Garavito Armero
        <br /> Bogotá D.C., Colombia
        <br />
        (+57 1) 316 5000 Ext. 13578
      </p>
      <p className="col-sm-12 col-md-6 derechos">
        © Copyright 2019
        <br /> Algunos derechos reservados.
        <br />
        <a
          title="Comuníquese con el administrador de este sitio web"
          href="mailto:autoevalua_fibo@unal.edu.co"
        >
          autoevalua_fibo@unal.edu.co
        </a>
        <br />
        <a href="index.html#">Acerca de este sitio web</a>
        <br /> Última actualización: 15/11/2019
      </p>
    </div>
    <div className="col-md-2 col-lg-2 col-sm-2 col-xs-12 logos">
      <div className="col-xs-6 col-sm-12 col-md-6 no-padding">
        <a
          className="col-xs-6 col-sm-12"
          href="http://www.orgulloun.unal.edu.co"
        >
          <img
            className="hidden-print"
            alt="Orgullo UN"
            src={require("./images/log_orgullo.png")}
            width={78}
            height={21}
          />
          <img
            className="visible-print"
            alt="Orgullo UN"
                  src={require("./images/log_orgullo_black.png")}
            width={94}
            height={37}
          />
        </a>
        <a
          className="col-xs-6 col-sm-12 imgAgencia"
          href="http://www.agenciadenoticias.unal.edu.co/inicio.html"
        >
          <img
            className="hidden-print"
            alt="Agencia de noticias"
                  src={require("./images/log_agenc.png")}
            width={94}
            height={25}
          />
          <img
            className="visible-print"
            alt="Agencia de noticias"
                  src={require("./images/log_agenc_black.png")}
            width={94}
            height={37}
          />
        </a>
      </div>
      <div className="col-xs-6 col-sm-12 col-md-6 no-padding">
        <a
          className="col-xs-6 col-sm-12"
          href="https://www.sivirtual.gov.co/memoficha-entidad/-/entidad/T0356"
        >
          <img
            alt="Trámites en línea"
                  src={require("./images/log_gobiern.png")}
            width={67}
            height={51}
          />
        </a>
        <a className="col-xs-6 col-sm-12" href="http://www.contaduria.gov.co/">
          <img
            alt="Contaduría general de la republica"
                  src={require("./images/log_contra.png")}
            width={67}
            height={51}
          />Error: ENOENT: no such file or directory, open '/home/uapa04/uapapp/node_modules/antd/es/_util/type.js'
        </a>
      </div>
    </div>
  </footer>
</div>
    );
  }
}

export default App;
