export interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
}

export const LOCATIONS: Location[] = [
  {
    id: "union-del-toro",
    name: "Unión del Toro",
    description: "Comunidad de referencia de la aplicación.",
    latitude: 10.6208083,
    longitude: -84.0453998,
  },
  {
    id: "tambor",
    name: "Tambor",
    description: "Punto de referencia: Escuela Tambor.",
    latitude: 10.7314363,
    longitude: -83.9694939,
  },
  {
    id: "los-angeles",
    name: "Los Ángeles",
    description: "Punto de referencia: Escuela Los Ángeles del Río.",
    latitude: 10.6834657,
    longitude: -83.9760053,
  },
  {
    id: "copalchi",
    name: "Copalchí",
    description: "Punto de referencia: Escuela Copalchí.",
    latitude: 10.709246,
    longitude: -83.991169,
  },
  {
    id: "puerto-viejo",
    name: "Puerto Viejo de Sarapiquí",
    description: "Punto de referencia: Municipalidad de Sarapiquí.",
    latitude: 10.4499611,
    longitude: -84.0131556,
  },
  {
    id: "la-delia",
    name: "La Delia",
    description: "Punto de referencia dentro de la comunidad.",
    latitude: 10.6003444,
    longitude: -84.0686248,
  },
  {
    id: "chaparron",
    name: "Chaparrón",
    description: "Punto de referencia: Puente Mulas Pangola - Golfito.",
    latitude: 10.589628,
    longitude: -84.1201958,
  },
];