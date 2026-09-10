/**
 * Comunidades cubiertas por Clima Cureña.
 *
 * Por ahora cada ubicación solo declara identificador, nombre y una breve
 * descripción. Las descripciones son provisionales y deben sustituirse por
 * información local verificada. No se incluyen coordenadas ni datos
 * meteorológicos: se agregarán cuando se integre la fuente oficial.
 */
export type Location = {
  id: string;
  name: string;
  description: string;
};

export const LOCATIONS: Location[] = [
  {
    id: "union-del-toro",
    name: "Unión del Toro",
    description: "Comunidad de referencia de la aplicación.",
  },
  {
    id: "tambor",
    name: "Tambor",
    description: "Comunidad cercana a Unión del Toro.",
  },
  {
    id: "los-angeles",
    name: "Los Ángeles",
    description: "Comunidad cercana a Unión del Toro.",
  },
  {
    id: "copalchi",
    name: "Copalchí",
    description: "Comunidad cercana a Unión del Toro.",
  },
  {
    id: "puerto-viejo",
    name: "Puerto Viejo",
    description: "Comunidad de la zona de Sarapiquí.",
  },
  {
    id: "la-delia",
    name: "La Delia",
    description: "Comunidad cercana a Unión del Toro.",
  },
  {
    id: "chaparron",
    name: "Chaparrón",
    description: "Comunidad cercana a Unión del Toro.",
  },
];
