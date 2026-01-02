const fs = require('fs');
const path = require('path');

// CONFIGURACIÓN DE RUTAS
const MS_ROOT_DIR = path.resolve(__dirname, '../../../marketingStudio');
const COMPONENTS_DIR = path.resolve(__dirname, '../packages/ui/src/components');

// 1. OBTENER LISTA DE COMPONENTES DISPONIBLES
const componentFolders = fs.readdirSync(COMPONENTS_DIR)
  .filter(file => fs.statSync(path.join(COMPONENTS_DIR, file)).isDirectory());

const allFiles = [];
const getAllFiles = (dir) => {
  if (dir.includes('node_modules') || dir.includes('dist') || dir.includes('.git')) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      allFiles.push({ name: file, path: fullPath });
    }
  }
};

getAllFiles(MS_ROOT_DIR);

componentFolders.forEach(compFolder => {
  const metadataPath = path.join(COMPONENTS_DIR, compFolder, `${compFolder}.metadata.json`);
  if (!fs.existsSync(metadataPath)) return;

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const componentName = metadata.name;
  const occurrences = [];

  allFiles.forEach(file => {
    const content = fs.readFileSync(file.path, 'utf8');
    
    // Búsqueda más simple: ¿Aparece el nombre del componente y '@loopdev/ui' en el mismo archivo?
    // Esto es un 99% seguro en nuestro caso.
    if (content.includes(componentName) && content.includes('@loopdev/ui')) {
      const cleanName = file.name.replace('View.tsx', '').replace('Page.tsx', '').replace('.tsx', '');
      occurrences.push({
        name: cleanName.replace(/([A-Z])/g, ' $1').trim(),
        path: '/brand/overview'
      });
    }
  });

  metadata.usedIn = occurrences;
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  if (occurrences.length > 0) {
    console.log(`✅ ${componentName}: ${occurrences.length} usos actualizados.`);
  }
});

console.log('🏁 Auditoría completada.');
