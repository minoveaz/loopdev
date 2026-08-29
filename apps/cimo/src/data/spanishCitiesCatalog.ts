export interface SpanishCity {
  name: string;
  province: string;
  region: string;
  postalCodes?: string[];
}

export interface SportsVenue {
  name: string;
  city: string;
  postalCode: string;
  category: 'Parque' | 'Pádel' | 'Running' | 'Polideportivo' | 'Montaña' | 'Playa';
  address: string;
  lat: number;
  lng: number;
}

export const SPANISH_CITIES: SpanishCity[] = [
  // Madrid
  { name: 'Madrid', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28001', '28009', '28014', '28016', '28036', '28045'] },
  { name: 'Alcalá de Henares', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28801', '28805'] },
  { name: 'Alcobendas', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28100', '28108'] },
  { name: 'Las Rozas de Madrid', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28230', '28290'] },
  { name: 'Pozuelo de Alarcón', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28223', '28224'] },
  { name: 'Majadahonda', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28220', '28221'] },
  { name: 'Getafe', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28901', '28905'] },
  { name: 'Leganés', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28911', '28915'] },
  { name: 'San Lorenzo de El Escorial', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28200'] },
  { name: 'Collado Villalba', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28400'] },

  // Cataluña
  { name: 'Barcelona', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08001', '08003', '08005', '08021', '08034'] },
  { name: 'Girona', province: 'Girona', region: 'Cataluña', postalCodes: ['17001', '17004'] },
  { name: 'Tarragona', province: 'Tarragona', region: 'Cataluña', postalCodes: ['43001', '43004'] },
  { name: 'Lleida', province: 'Lleida', region: 'Cataluña', postalCodes: ['25001', '25004'] },
  { name: 'Badalona', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08911', '08915'] },
  { name: 'Sabadell', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08201', '08208'] },
  { name: 'Sant Cugat del Vallès', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08172', '08174'] },
  { name: 'Sitges', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08870'] },
  { name: 'Castelldefels', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08860'] },

  // Comunitat Valenciana
  { name: 'Valencia', province: 'Valencia', region: 'Comunitat Valenciana', postalCodes: ['46001', '46003', '46011', '46023'] },
  { name: 'Alicante', province: 'Alicante', region: 'Comunitat Valenciana', postalCodes: ['03001', '03005', '03540'] },
  { name: 'Castellón de la Plana', province: 'Castellón', region: 'Comunitat Valenciana', postalCodes: ['12001', '12004'] },
  { name: 'Elche', province: 'Alicante', region: 'Comunitat Valenciana', postalCodes: ['03201', '03205'] },
  { name: 'Gandía', province: 'Valencia', region: 'Comunitat Valenciana', postalCodes: ['46701', '46730'] },
  { name: 'Benidorm', province: 'Alicante', region: 'Comunitat Valenciana', postalCodes: ['03501', '03503'] },

  // Andalucía
  { name: 'Sevilla', province: 'Sevilla', region: 'Andalucía', postalCodes: ['41001', '41004', '41010', '41013'] },
  { name: 'Málaga', province: 'Málaga', region: 'Andalucía', postalCodes: ['29001', '29016', '29018'] },
  { name: 'Granada', province: 'Granada', region: 'Andalucía', postalCodes: ['18001', '18005', '18009'] },
  { name: 'Córdoba', province: 'Córdoba', region: 'Andalucía', postalCodes: ['14001', '14004'] },
  { name: 'Cádiz', province: 'Cádiz', region: 'Andalucía', postalCodes: ['11001', '11004'] },
  { name: 'Marbella', province: 'Málaga', region: 'Andalucía', postalCodes: ['29601', '29604'] },
  { name: 'Almería', province: 'Almería', region: 'Andalucía', postalCodes: ['04001', '04004'] },

  // País Vasco, Navarra, Galicia, Asturias, Cantabria
  { name: 'Bilbao', province: 'Bizkaia', region: 'País Vasco', postalCodes: ['48001', '48009', '48011'] },
  { name: 'San Sebastián / Donostia', province: 'Gipuzkoa', region: 'País Vasco', postalCodes: ['20001', '20007'] },
  { name: 'Vitoria-Gasteiz', province: 'Álava', region: 'País Vasco', postalCodes: ['01001', '01005'] },
  { name: 'Pamplona / Iruña', province: 'Navarra', region: 'Navarra', postalCodes: ['31001', '31005'] },
  { name: 'A Coruña', province: 'A Coruña', region: 'Galicia', postalCodes: ['15001', '15004'] },
  { name: 'Vigo', province: 'Pontevedra', region: 'Galicia', postalCodes: ['36201', '36204'] },
  { name: 'Santander', province: 'Cantabria', region: 'Cantabria', postalCodes: ['39001', '39005'] },
  { name: 'Gijón', province: 'Asturias', region: 'Asturias', postalCodes: ['33201', '33205'] },
  { name: 'Zaragoza', province: 'Zaragoza', region: 'Aragón', postalCodes: ['50001', '50009'] },
  { name: 'Palma de Mallorca', province: 'Illes Balears', region: 'Baleares', postalCodes: ['07001', '07005'] },
  { name: 'Las Palmas de Gran Canaria', province: 'Las Palmas', region: 'Canarias', postalCodes: ['35001', '35005'] },
];

export const POPULAR_SPORTS_VENUES: SportsVenue[] = [
  // Madrid
  { name: 'Parque del Retiro (Puerta de Alcalá)', city: 'Madrid', postalCode: '28009', category: 'Running', address: 'Plaza de la Independencia 7, 28009 Madrid', lat: 40.4198, lng: -3.6887 },
  { name: 'Madrid Río (Puente de Segovia)', city: 'Madrid', postalCode: '28005', category: 'Running', address: 'Paseo de la Virgen del Puerto, 28005 Madrid', lat: 40.4132, lng: -3.7224 },
  { name: 'Club Tenis Chamartín', city: 'Madrid', postalCode: '28036', category: 'Pádel', address: 'Calle Federico Salmón 4, 28036 Madrid', lat: 40.4578, lng: -3.6781 },
  { name: 'Casa de Campo (Lago)', city: 'Madrid', postalCode: '28011', category: 'Running', address: 'Paseo del Embarcadero, 28011 Madrid', lat: 40.4172, lng: -3.7381 },
  { name: 'Box Singular Chamberí', city: 'Madrid', postalCode: '28010', category: 'Polideportivo', address: 'Calle de Alonso Cano 66, 28010 Madrid', lat: 40.4395, lng: -3.6991 },
  { name: 'Sierra de Guadarrama / Navacerrada', city: 'Madrid', postalCode: '28470', category: 'Montaña', address: 'Puerto de Navacerrada, 28470 Cercedilla', lat: 40.7891, lng: -4.0042 },

  // Barcelona
  { name: 'Paseo Marítimo Barceloneta', city: 'Barcelona', postalCode: '08003', category: 'Playa', address: 'Passeig Marítim de la Barceloneta, 08003 Barcelona', lat: 41.3802, lng: 2.1934 },
  { name: 'Carretera de les Aigües', city: 'Barcelona', postalCode: '08034', category: 'Running', address: 'Carretera de les Aigües, 08034 Barcelona', lat: 41.4112, lng: 2.1121 },
  { name: 'Montjuïc (Font Màgica)', city: 'Barcelona', postalCode: '08038', category: 'Running', address: 'Plaça de Carles Buïgas 1, 08038 Barcelona', lat: 41.3712, lng: 2.1518 },
  { name: 'Pádel Indoor Poble Nou', city: 'Barcelona', postalCode: '08005', category: 'Pádel', address: 'Carrer de Roc Boronat 44, 08005 Barcelona', lat: 41.3991, lng: 2.1984 },

  // Valencia
  { name: 'Jardines del Turia (Puente de las Flores)', city: 'Valencia', postalCode: '46003', category: 'Running', address: 'Paseo de la Ciudadela, 46003 Valencia', lat: 39.4721, lng: -0.3664 },
  { name: 'Marina Real de Valencia', city: 'Valencia', postalCode: '46024', category: 'Running', address: 'Carrer del Moll de Ponent, 46024 Valencia', lat: 39.4608, lng: -0.3278 },
  { name: 'Pádel Club Ruzafa', city: 'Valencia', postalCode: '46006', category: 'Pádel', address: 'Carrer de Cuba 32, 46006 Valencia', lat: 39.4623, lng: -0.3751 },

  // Sevilla
  { name: 'Parque de María Luisa / Plaza de España', city: 'Sevilla', postalCode: '41013', category: 'Running', address: 'Avenida de Isabel la Católica, 41013 Sevilla', lat: 37.3772, lng: -5.9869 },
  { name: 'Márgenes del Guadalquivir (Triana)', city: 'Sevilla', postalCode: '41010', category: 'Running', address: 'Calle Betis, 41010 Sevilla', lat: 37.3854, lng: -6.0002 },

  // Granada
  { name: 'Paseo del Salón / Río Genil', city: 'Granada', postalCode: '18009', category: 'Running', address: 'Paseo del Salón, 18009 Granada', lat: 37.1691, lng: -3.5932 },
  { name: 'Parque García Lorca', city: 'Granada', postalCode: '18004', category: 'Running', address: 'Calle Arabial, 18004 Granada', lat: 37.1724, lng: -3.6101 },
  { name: 'Pádel Club Granada', city: 'Granada', postalCode: '18015', category: 'Pádel', address: 'Camino de Ronda 120, 18015 Granada', lat: 37.1812, lng: -3.6145 },

  // Málaga & Bilbao & Santander
  { name: 'Paseo Marítimo Antonio Banderas', city: 'Málaga', postalCode: '29004', category: 'Running', address: 'Paseo Marítimo Antonio Banderas, 29004 Málaga', lat: 36.6981, lng: -4.4372 },
  { name: 'Ría de Bilbao / Guggenheim', city: 'Bilbao', postalCode: '48009', category: 'Running', address: 'Abandoibarra Etorbidea 2, 48009 Bilbao', lat: 43.2687, lng: -2.9340 },
  { name: 'Paseo Marítimo de El Sardinero', city: 'Santander', postalCode: '39005', category: 'Playa', address: 'Avenida de la Reina Victoria, 39005 Santander', lat: 43.4721, lng: -3.7854 },
];
