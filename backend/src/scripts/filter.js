import fs from 'fs';

const rawData = fs.readFileSync('./dataset/api-lannuaire-administration.json', 'utf-8');
const data = JSON.parse(rawData);

if (!Array.isArray(data)) {
  console.error("Error: The JSON file does not contain an array at the top level.");
  process.exit(1);
}

const listeMairies = data.filter((townhall) => {
  try {
    const pivotData = JSON.parse(townhall.pivot || '[]');
    return pivotData.some(p => p.type_service_local === "mairie");
  } catch (error) {
    return false;
  }
});

fs.writeFileSync('./dataset/liste-mairies.json', JSON.stringify(listeMairies, null, 2));
console.log(`Filtrage de ${filteredTownhalls.length} mairies et enregistrement du résultat au chemin d'accès './dataset/liste-mairies.json'.`);
