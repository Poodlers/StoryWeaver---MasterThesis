import L from "leaflet";
import anchor from "../assets/mdi_location.svg";
import bathroom from "../assets/casa_de_banho.svg";
import artefacto from "../assets/artefacto.svg";
import elevador from "../assets/elevador.svg";
import entrada from "../assets/entrada.svg";
import escultura from "../assets/escultura.svg";
import pintura from "../assets/pintura.svg";
import saida from "../assets/saida.svg";
import info from "../assets/info.svg";

const iconAnchor = new L.Icon({
  iconUrl: anchor,
  iconRetinaUrl: anchor,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const iconSaida = new L.Icon({
  iconUrl: saida,
  iconRetinaUrl: saida,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const iconEntrada = new L.Icon({
  iconUrl: entrada,
  iconRetinaUrl: entrada,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const iconBathroom = new L.Icon({
  iconUrl: bathroom,
  iconRetinaUrl: bathroom,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const iconArtefacto = new L.Icon({
  iconUrl: artefacto,
  iconRetinaUrl: artefacto,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const iconElevador = new L.Icon({
  iconUrl: elevador,
  iconRetinaUrl: elevador,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const iconEscultura = new L.Icon({
  iconUrl: escultura,
  iconRetinaUrl: escultura,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const iconPintura = new L.Icon({
  iconUrl: pintura,
  iconRetinaUrl: pintura,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const iconOther = new L.Icon({
  iconUrl: info,
  iconRetinaUrl: info,
  popupAnchor: [-0, -0],
  iconSize: [32, 45],
});

const MarkerTypeToIcon = {
  anchor: iconAnchor,
  exit: iconSaida,
  entrance: iconEntrada,
  bathroom: iconBathroom,
  artifact: iconArtefacto,
  elevator: iconElevador,
  sculpture: iconEscultura,
  painting: iconPintura,
  other: iconOther,
};

export {
  iconAnchor,
  iconSaida,
  iconEntrada,
  iconBathroom,
  iconArtefacto,
  iconElevador,
  iconEscultura,
  iconPintura,
  MarkerTypeToIcon,
};
