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
  category: 'Parque' | 'Pádel' | 'Running' | 'Polideportivo' | 'Montaña' | 'Playa' | 'Café' | 'Tercer Tiempo' | 'Restaurante';
  address: string;
  lat: number;
  lng: number;
}

export const SPANISH_CITIES: SpanishCity[] = [
  // Madrid
  { name: 'Madrid', province: 'Madrid', region: 'Comunidad de Madrid', postalCodes: ['28001', '28005', '28009', '28010', '28011', '28014', '28016', '28036', '28045'] },
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
  { name: 'Barcelona', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08001', '08003', '08005', '08021', '08034', '08038'] },
  { name: 'Girona', province: 'Girona', region: 'Cataluña', postalCodes: ['17001', '17004'] },
  { name: 'Tarragona', province: 'Tarragona', region: 'Cataluña', postalCodes: ['43001', '43004'] },
  { name: 'Lleida', province: 'Lleida', region: 'Cataluña', postalCodes: ['25001', '25004'] },
  { name: 'Badalona', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08911', '08915'] },
  { name: 'Sabadell', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08201', '08208'] },
  { name: 'Sant Cugat del Vallès', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08172', '08174'] },
  { name: 'Sitges', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08870'] },
  { name: 'Castelldefels', province: 'Barcelona', region: 'Cataluña', postalCodes: ['08860'] },

  // Comunitat Valenciana
  { name: 'Valencia', province: 'Valencia', region: 'Comunitat Valenciana', postalCodes: ['46001', '46003', '46006', '46011', '46023', '46024'] },
  { name: 'Alicante', province: 'Alicante', region: 'Comunitat Valenciana', postalCodes: ['03001', '03005', '03540'] },
  { name: 'Castellón de la Plana', province: 'Castellón', region: 'Comunitat Valenciana', postalCodes: ['12001', '12004'] },
  { name: 'Elche', province: 'Alicante', region: 'Comunitat Valenciana', postalCodes: ['03201', '03205'] },
  { name: 'Gandía', province: 'Valencia', region: 'Comunitat Valenciana', postalCodes: ['46701', '46730'] },
  { name: 'Benidorm', province: 'Alicante', region: 'Comunitat Valenciana', postalCodes: ['03501', '03503'] },

  // Andalucía
  { name: 'Sevilla', province: 'Sevilla', region: 'Andalucía', postalCodes: ['41001', '41004', '41010', '41013'] },
  { name: 'Málaga', province: 'Málaga', region: 'Andalucía', postalCodes: ['29001', '29004', '29016', '29018'] },
  { name: 'Granada', province: 'Granada', region: 'Andalucía', postalCodes: ['18001', '18004', '18005', '18009', '18015'] },
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
  { name: 'Puerta de Alcalá - Parque del Retiro', city: 'Madrid', postalCode: '28009', category: 'Running', address: 'Plaza de la Independencia 7, 28009 Madrid', lat: 40.4198, lng: -3.6887 },
  { name: 'Madrid Río (Puente de Segovia)', city: 'Madrid', postalCode: '28005', category: 'Running', address: 'Paseo de la Virgen del Puerto, 28005 Madrid', lat: 40.4132, lng: -3.7224 },
  { name: 'Club Tenis Chamartín', city: 'Madrid', postalCode: '28036', category: 'Pádel', address: 'Calle Federico Salmón 4, 28036 Madrid', lat: 40.4578, lng: -3.6781 },
  { name: 'Club de Tenis Chamartín', city: 'Madrid', postalCode: '28036', category: 'Pádel', address: 'Calle Federico Salmón 4, 28036 Madrid', lat: 40.4578, lng: -3.6781 },
  { name: 'Casa de Campo (Lago)', city: 'Madrid', postalCode: '28011', category: 'Running', address: 'Paseo del Embarcadero, 28011 Madrid', lat: 40.4172, lng: -3.7381 },
  { name: 'Box Singular Chamberí', city: 'Madrid', postalCode: '28010', category: 'Polideportivo', address: 'Calle de Alonso Cano 66, 28010 Madrid', lat: 40.4395, lng: -3.6991 },
  { name: 'Sierra de Guadarrama / Navacerrada', city: 'Madrid', postalCode: '28470', category: 'Montaña', address: 'Puerto de Navacerrada, 28470 Cercedilla, Madrid', lat: 40.7891, lng: -4.0042 },

  // Barcelona
  { name: 'Paseo Marítimo Barceloneta', city: 'Barcelona', postalCode: '08003', category: 'Playa', address: 'Passeig Marítim de la Barceloneta, 08003 Barcelona', lat: 41.3802, lng: 2.1934 },
  { name: 'Carretera de les Aigües', city: 'Barcelona', postalCode: '08034', category: 'Running', address: 'Carretera de les Aigües, 08034 Barcelona', lat: 41.4112, lng: 2.1121 },
  { name: 'Montjuïc (Font Màgica)', city: 'Barcelona', postalCode: '08038', category: 'Running', address: 'Plaça de Carles Buïgas 1, 08038 Barcelona', lat: 41.3712, lng: 2.1518 },
  { name: 'Diagonal / Turó Park', city: 'Barcelona', postalCode: '08021', category: 'Running', address: 'Avinguda Diagonal, Turó Park, 08021 Barcelona', lat: 41.3934, lng: 2.1412 },
  { name: 'Pádel Indoor Poble Nou', city: 'Barcelona', postalCode: '08005', category: 'Pádel', address: 'Carrer de Roc Boronat 44, 08005 Barcelona', lat: 41.3991, lng: 2.1984 },
  { name: 'Parc de Collserola', city: 'Barcelona', postalCode: '08035', category: 'Montaña', address: 'Carretera de l\'Església 92, 08017 Barcelona', lat: 41.4215, lng: 2.1142 },

  // Valencia
  { name: 'Jardines del Turia (Puente de las Flores)', city: 'Valencia', postalCode: '46003', category: 'Running', address: 'Pont de les Flors, 46003 Valencia', lat: 39.4721, lng: -0.3664 },
  { name: 'Marina Real de Valencia', city: 'Valencia', postalCode: '46024', category: 'Running', address: 'Carrer del Moll de Ponent, 46024 Valencia', lat: 39.4608, lng: -0.3278 },
  { name: 'Playa de la Malvarrosa', city: 'Valencia', postalCode: '46011', category: 'Playa', address: 'Paseo Marítimo de la Malvarrosa, 46011 Valencia', lat: 39.4812, lng: -0.3245 },
  { name: 'Pádel Club Ruzafa', city: 'Valencia', postalCode: '46006', category: 'Pádel', address: 'Carrer de Cuba 32, 46006 Valencia', lat: 39.4623, lng: -0.3751 },

  // Madrid Tercer Tiempo
  { name: 'Café Murillo (Retiro)', city: 'Madrid', postalCode: '28014', category: 'Café', address: 'Calle de Ruiz de Alarcón 27, 28014 Madrid', lat: 40.4152, lng: -3.6917 },
  { name: 'Café Murillo', city: 'Madrid', postalCode: '28014', category: 'Café', address: 'Calle de Ruiz de Alarcón 27, 28014 Madrid', lat: 40.4152, lng: -3.6917 },
  { name: 'Terraza Florida Park (Retiro)', city: 'Madrid', postalCode: '28009', category: 'Tercer Tiempo', address: 'Paseo de Panamá s/n, Parque del Retiro, 28009 Madrid', lat: 40.4168, lng: -3.6825 },
  { name: 'Honest Greens Retiro', city: 'Madrid', postalCode: '28009', category: 'Restaurante', address: 'Calle de Alcalá 63, 28009 Madrid', lat: 40.4208, lng: -3.6872 },
  { name: 'Honest Greens', city: 'Madrid', postalCode: '28009', category: 'Restaurante', address: 'Calle de Alcalá 63, 28009 Madrid', lat: 40.4208, lng: -3.6872 },
  { name: 'Pum Puk Café (Chamberí)', city: 'Madrid', postalCode: '28003', category: 'Café', address: 'Calle de José Abascal 61, 28003 Madrid', lat: 40.4379, lng: -3.6938 },
  { name: 'Terraza Florida Park', city: 'Madrid', postalCode: '28009', category: 'Tercer Tiempo', address: 'Paseo de Panamá s/n, Parque del Retiro, 28009 Madrid', lat: 40.4168, lng: -3.6825 },
  { name: 'Café del Río (Madrid Río)', city: 'Madrid', postalCode: '28011', category: 'Café', address: 'Avenida de Portugal 1, 28011 Madrid', lat: 40.4143, lng: -3.7259 },
  { name: 'Plaza Mayor (Terrazas)', city: 'Madrid', postalCode: '28012', category: 'Tercer Tiempo', address: 'Plaza Mayor, 28012 Madrid', lat: 40.4155, lng: -3.7074 },
  { name: 'La Latina / Cava Baja', city: 'Madrid', postalCode: '28005', category: 'Tercer Tiempo', address: 'Calle de la Cava Baja, 28005 Madrid', lat: 40.4124, lng: -3.7102 },
  { name: 'Raw Coco Green Bar (Salamanca)', city: 'Madrid', postalCode: '28001', category: 'Café', address: 'Calle del General Pardiñas 21, 28001 Madrid', lat: 40.4265, lng: -3.6812 },

  // Barcelona Tercer Tiempo
  { name: 'Syra Coffee (Gràcia)', city: 'Barcelona', postalCode: '08012', category: 'Café', address: 'Carrer de Siracusa 13, 08012 Barcelona', lat: 41.4018, lng: 2.1584 },
  { name: 'Nomad Coffee Lab (Born)', city: 'Barcelona', postalCode: '08003', category: 'Café', address: 'Passatge Sert 12, 08003 Barcelona', lat: 41.3879, lng: 2.1764 },
  { name: 'Honest Greens Rambla Catalunya', city: 'Barcelona', postalCode: '08007', category: 'Restaurante', address: 'Rambla de Catalunya 3, 08007 Barcelona', lat: 41.3872, lng: 2.1678 },
  { name: 'El Chiringuito Barceloneta', city: 'Barcelona', postalCode: '08003', category: 'Tercer Tiempo', address: 'Passeig Marítim de la Barceloneta, 08003 Barcelona', lat: 41.3805, lng: 2.1936 },
  { name: 'Terraza Miramar (Montjuïc)', city: 'Barcelona', postalCode: '08038', category: 'Tercer Tiempo', address: 'Carretera de Miramar 40, 08038 Barcelona', lat: 41.3718, lng: 2.1724 },

  // Valencia Tercer Tiempo
  { name: 'Bluebell Coffee Co (Ruzafa)', city: 'Valencia', postalCode: '46006', category: 'Café', address: 'Carrer de Buenos Aires 3, 46006 Valencia', lat: 39.4628, lng: -0.3721 },
  { name: 'Blackbird Coffee & Pastry', city: 'Valencia', postalCode: '46011', category: 'Café', address: 'Carrer de la Reina 82, 46011 Valencia', lat: 39.4674, lng: -0.3298 },
  { name: 'Marina Beach Club Valencia', city: 'Valencia', postalCode: '46024', category: 'Tercer Tiempo', address: 'Carrer Marina Real Juan Carlos I, 46024 Valencia', lat: 39.4632, lng: -0.3229 },
  { name: 'Mercado de Colón (Terrazas)', city: 'Valencia', postalCode: '46004', category: 'Tercer Tiempo', address: 'Carrer de Jorge Juan 19, 46004 Valencia', lat: 39.4687, lng: -0.3695 },

  // Sevilla
  { name: 'Parque de María Luisa / Plaza de España', city: 'Sevilla', postalCode: '41013', category: 'Running', address: 'Avenida de Isabel la Católica, 41013 Sevilla', lat: 37.3772, lng: -5.9869 },
  { name: 'Márgenes del Guadalquivir (Triana)', city: 'Sevilla', postalCode: '41010', category: 'Running', address: 'Calle Betis, 41010 Sevilla', lat: 37.3854, lng: -6.0002 },
  { name: 'Parque del Alamillo', city: 'Sevilla', postalCode: '41092', category: 'Running', address: 'Parque del Alamillo, Isla de la Cartuja, 41092 Sevilla', lat: 37.4145, lng: -5.9982 },
  { name: 'Virgin Coffee (Las Setas)', city: 'Sevilla', postalCode: '41003', category: 'Café', address: 'Calle Regina 1, 41003 Sevilla', lat: 37.3934, lng: -5.9918 },
  { name: 'Torch Coffee Roasters (Paseo de las Delicias)', city: 'Sevilla', postalCode: '41012', category: 'Café', address: 'Paseo de las Delicias 3, 41012 Sevilla', lat: 37.3754, lng: -5.9912 },
  { name: 'La Terraza del EME (Giralda)', city: 'Sevilla', postalCode: '41004', category: 'Tercer Tiempo', address: 'Calle Alemanes 27, 41004 Sevilla', lat: 37.3862, lng: -5.9924 },

  // Granada
  { name: 'Paseo del Salón / Río Genil', city: 'Granada', postalCode: '18009', category: 'Running', address: 'Paseo del Salón, 18009 Granada', lat: 37.1691, lng: -3.5932 },
  { name: 'Parque García Lorca', city: 'Granada', postalCode: '18004', category: 'Running', address: 'Calle Arabial, 18004 Granada', lat: 37.1724, lng: -3.6101 },
  { name: 'Pádel Club Granada', city: 'Granada', postalCode: '18015', category: 'Pádel', address: 'Camino de Ronda 120, 18015 Granada', lat: 37.1812, lng: -3.6145 },
  { name: 'Sierra Nevada / Cumbres Verdes', city: 'Granada', postalCode: '18196', category: 'Montaña', address: 'Carretera de la Sierra, 18196 Monachil, Granada', lat: 37.0954, lng: -3.3982 },

  // Málaga
  { name: 'Paseo Marítimo Antonio Banderas', city: 'Málaga', postalCode: '29004', category: 'Running', address: 'Paseo Marítimo Antonio Banderas, 29004 Málaga', lat: 36.6981, lng: -4.4372 },
  { name: 'Muelle Uno / La Farola', city: 'Málaga', postalCode: '29016', category: 'Running', address: 'Paseo de la Farola, 29016 Málaga', lat: 36.7172, lng: -4.4121 },
  { name: 'Castillo de Gibralfaro', city: 'Málaga', postalCode: '29016', category: 'Montaña', address: 'Camino de Gibralfaro 11, 29016 Málaga', lat: 36.7234, lng: -4.4112 },

  // Bilbao
  { name: 'Ría de Bilbao / Guggenheim', city: 'Bilbao', postalCode: '48009', category: 'Running', address: 'Abandoibarra Etorbidea 2, 48009 Bilbao', lat: 43.2687, lng: -2.9340 },
  { name: 'Parque Doña Casilda', city: 'Bilbao', postalCode: '48011', category: 'Running', address: 'Parque de Doña Casilda Iturrizar, 48011 Bilbao', lat: 43.2645, lng: -2.9421 },
  { name: 'Paseo de Artxanda', city: 'Bilbao', postalCode: '48015', category: 'Montaña', address: 'Camino de Artxanda, 48015 Bilbao', lat: 43.2754, lng: -2.9234 },

  // Santander
  { name: 'Paseo Marítimo de El Sardinero', city: 'Santander', postalCode: '39005', category: 'Playa', address: 'Avenida de la Reina Victoria, 39005 Santander', lat: 43.4721, lng: -3.7854 },
  { name: 'Península de La Magdalena', city: 'Santander', postalCode: '39005', category: 'Running', address: 'Península de la Magdalena, 39005 Santander', lat: 43.4682, lng: -3.7654 },
  { name: 'Parque de Las Llamas', city: 'Santander', postalCode: '39005', category: 'Running', address: 'Avenida de los Castros, 39005 Santander', lat: 43.4754, lng: -3.7991 },

  // Zaragoza
  { name: 'Parque Grande José Antonio Labordeta', city: 'Zaragoza', postalCode: '50009', category: 'Running', address: 'Paseo de San Sebastián, 50009 Zaragoza', lat: 41.6334, lng: -0.8987 },
  { name: 'Riberas del Ebro / Expo', city: 'Zaragoza', postalCode: '50018', category: 'Running', address: 'Paseo de la Ribera, 50018 Zaragoza', lat: 41.6612, lng: -0.8912 },
  // Alicante
  { name: 'Paseo de la Explanada / Puerto', city: 'Alicante', postalCode: '03001', category: 'Running', address: 'Passeig de l\'Esplanada d\'Espanya, 03001 Alacant', lat: 38.3442, lng: -0.4821 },
  { name: 'Playa de San Juan', city: 'Alicante', postalCode: '03540', category: 'Playa', address: 'Avenida de Niza, 03540 Alicante', lat: 38.3682, lng: -0.4187 },
];

export const POPULAR_CITIES = [
  'Toda España',
  'Madrid',
  'Barcelona',
  'Valencia',
  'Sevilla',
  'Málaga',
  'Bilbao',
  'Zaragoza',
  'Granada',
  'Alicante',
  'Santander',
  'San Sebastián / Donostia',
];
