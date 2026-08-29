export interface SpanishCity {
  name: string;
  province: string;
  region: string;
}

export const SPANISH_CITIES: SpanishCity[] = [
  // Madrid
  { name: 'Madrid', province: 'Madrid', region: 'Comunidad de Madrid' },
  { name: 'Alcalá de Henares', province: 'Madrid', region: 'Comunidad de Madrid' },
  { name: 'Alcobendas', province: 'Madrid', region: 'Comunidad de Madrid' },
  { name: 'Las Rozas de Madrid', province: 'Madrid', region: 'Comunidad de Madrid' },
  { name: 'Pozuelo de Alarcón', province: 'Madrid', region: 'Comunidad de Madrid' },
  { name: 'Majadahonda', province: 'Madrid', region: 'Comunidad de Madrid' },
  { name: 'Getafe', province: 'Madrid', region: 'Comunidad de Madrid' },
  { name: 'Leganés', province: 'Madrid', region: 'Comunidad de Madrid' },
  { name: 'San Lorenzo de El Escorial', province: 'Madrid', region: 'Comunidad de Madrid' },
  { name: 'Collado Villalba', province: 'Madrid', region: 'Comunidad de Madrid' },
  { name: 'Rivas-Vaciamadrid', province: 'Madrid', region: 'Comunidad de Madrid' },

  // Cataluña
  { name: 'Barcelona', province: 'Barcelona', region: 'Cataluña' },
  { name: 'Girona', province: 'Girona', region: 'Cataluña' },
  { name: 'Tarragona', province: 'Tarragona', region: 'Cataluña' },
  { name: 'Lleida', province: 'Lleida', region: 'Cataluña' },
  { name: 'Badalona', province: 'Barcelona', region: 'Cataluña' },
  { name: 'Sabadell', province: 'Barcelona', region: 'Cataluña' },
  { name: 'Terrassa', province: 'Barcelona', region: 'Cataluña' },
  { name: 'Sant Cugat del Vallès', province: 'Barcelona', region: 'Cataluña' },
  { name: 'Sitges', province: 'Barcelona', region: 'Cataluña' },
  { name: 'Castelldefels', province: 'Barcelona', region: 'Cataluña' },

  // Comunitat Valenciana
  { name: 'Valencia', province: 'Valencia', region: 'Comunitat Valenciana' },
  { name: 'Alicante', province: 'Alicante', region: 'Comunitat Valenciana' },
  { name: 'Castellón de la Plana', province: 'Castellón', region: 'Comunitat Valenciana' },
  { name: 'Elche', province: 'Alicante', region: 'Comunitat Valenciana' },
  { name: 'Gandía', province: 'Valencia', region: 'Comunitat Valenciana' },
  { name: 'Benidorm', province: 'Alicante', region: 'Comunitat Valenciana' },
  { name: 'Torrevieja', province: 'Alicante', region: 'Comunitat Valenciana' },
  { name: 'Denia', province: 'Alicante', region: 'Comunitat Valenciana' },
  { name: 'Altea', province: 'Alicante', region: 'Comunitat Valenciana' },

  // Andalucía
  { name: 'Sevilla', province: 'Sevilla', region: 'Andalucía' },
  { name: 'Málaga', province: 'Málaga', region: 'Andalucía' },
  { name: 'Granada', province: 'Granada', region: 'Andalucía' },
  { name: 'Córdoba', province: 'Córdoba', region: 'Andalucía' },
  { name: 'Cádiz', province: 'Cádiz', region: 'Andalucía' },
  { name: 'Marbella', province: 'Málaga', region: 'Andalucía' },
  { name: 'Almería', province: 'Almería', region: 'Andalucía' },
  { name: 'Huelva', province: 'Huelva', region: 'Andalucía' },
  { name: 'Jaén', province: 'Jaén', region: 'Andalucía' },
  { name: 'Jerez de la Frontera', province: 'Cádiz', region: 'Andalucía' },
  { name: 'Ronda', province: 'Málaga', region: 'Andalucía' },
  { name: 'Estepona', province: 'Málaga', region: 'Andalucía' },
  { name: 'Fuengirola', province: 'Málaga', region: 'Andalucía' },

  // País Vasco & Navarra
  { name: 'Bilbao', province: 'Bizkaia', region: 'País Vasco' },
  { name: 'San Sebastián / Donostia', province: 'Gipuzkoa', region: 'País Vasco' },
  { name: 'Vitoria-Gasteiz', province: 'Álava', region: 'País Vasco' },
  { name: 'Pamplona / Iruña', province: 'Navarra', region: 'Navarra' },
  { name: 'Getxo', province: 'Bizkaia', region: 'País Vasco' },
  { name: 'Zarautz', province: 'Gipuzkoa', region: 'País Vasco' },

  // Galicia & Asturias & Cantabria
  { name: 'A Coruña', province: 'A Coruña', region: 'Galicia' },
  { name: 'Vigo', province: 'Pontevedra', region: 'Galicia' },
  { name: 'Santiago de Compostela', province: 'A Coruña', region: 'Galicia' },
  { name: 'Ourense', province: 'Ourense', region: 'Galicia' },
  { name: 'Pontevedra', province: 'Pontevedra', region: 'Galicia' },
  { name: 'Lugo', province: 'Lugo', region: 'Galicia' },
  { name: 'Oviedo', province: 'Asturias', region: 'Asturias' },
  { name: 'Gijón', province: 'Asturias', region: 'Asturias' },
  { name: 'Santander', province: 'Cantabria', region: 'Cantabria' },

  // Aragón, La Rioja, Castilla y León, Castilla-La Mancha, Extremadura, Murcia, Baleares, Canarias
  { name: 'Zaragoza', province: 'Zaragoza', region: 'Aragón' },
  { name: 'Huesca', province: 'Huesca', region: 'Aragón' },
  { name: 'Logroño', province: 'La Rioja', region: 'La Rioja' },
  { name: 'Valladolid', province: 'Valladolid', region: 'Castilla y León' },
  { name: 'Salamanca', province: 'Salamanca', region: 'Castilla y León' },
  { name: 'Burgos', province: 'Burgos', region: 'Castilla y León' },
  { name: 'León', province: 'León', region: 'Castilla y León' },
  { name: 'Segovia', province: 'Segovia', region: 'Castilla y León' },
  { name: 'Murcia', province: 'Murcia', region: 'Región de Murcia' },
  { name: 'Cartagena', province: 'Murcia', region: 'Región de Murcia' },
  { name: 'Palma de Mallorca', province: 'Illes Balears', region: 'Baleares' },
  { name: 'Ibiza', province: 'Illes Balears', region: 'Baleares' },
  { name: 'Las Palmas de Gran Canaria', province: 'Las Palmas', region: 'Canarias' },
  { name: 'Santa Cruz de Tenerife', province: 'Santa Cruz de Tenerife', region: 'Canarias' },
  { name: 'Toledo', province: 'Toledo', region: 'Castilla-La Mancha' },
  { name: 'Badajoz', province: 'Badajoz', region: 'Extremadura' },
  { name: 'Cáceres', province: 'Cáceres', region: 'Extremadura' },
];
