import pg from 'pg';
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config();

const client = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

function convertToISODate(dateStr) {
    if (!dateStr) return null;
    
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart ? timePart.split(':') : [0, 0, 0];
    
    const date = new Date(year, month - 1, day, hours, minutes, seconds);
    return date.toISOString();
}

async function insertData() {
    try {
        await client.connect();
        const jsonData = JSON.parse(fs.readFileSync('./dataset/liste-mairies.json', 'utf8'));

        for (const data of jsonData) {
            const query = `
                INSERT INTO mairies (
                    itm_identifiant,
                    plage_ouverture,
                    site_internet,
                    copyright,
                    siren,
                    ancien_code_pivot,
                    reseau_social,
                    texte_reference,
                    partenaire,
                    telecopie,
                    nom,
                    siret,
                    sigle,
                    affectation_personne,
                    date_modification,
                    adresse_courriel,
                    service_disponible,
                    organigramme,
                    pivot,
                    partenaire_identifiant,
                    ancien_identifiant,
                    ancien_nom,
                    commentaire_plage_ouverture,
                    annuaire,
                    tchat,
                    hierarchie,
                    categorie,
                    sve,
                    telephone_accessible,
                    application_mobile,
                    version_type,
                    type_repertoire,
                    telephone,
                    version_etat_modification,
                    date_creation,
                    partenaire_date_modification,
                    mission,
                    formulaire_contact,
                    version_source,
                    type_organisme,
                    code_insee_commune,
                    statut_de_diffusion,
                    adresse,
                    url_service_public,
                    information_complementaire,
                    date_diffusion
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
                    $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, 
                    $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46)
            `;

            const values = [
                data.itm_identifiant,
                data.plage_ouverture,
                data.site_internet,
                data.copyright,
                data.siren,
                data.ancien_code_pivot,
                data.reseau_social,
                data.texte_reference,
                data.partenaire,
                data.telecopie,
                data.nom,
                data.siret,
                data.sigle,
                data.affectation_personne,
                convertToISODate(data.date_modification),
                data.adresse_courriel,
                data.service_disponible,
                data.organigramme,
                data.pivot,
                data.partenaire_identifiant,
                data.ancien_identifiant,
                data.ancien_nom,
                data.commentaire_plage_ouverture,
                data.annuaire,
                data.tchat,
                data.hierarchie,
                data.categorie,
                data.sve,
                data.telephone_accessible,
                data.application_mobile,
                data.version_type,
                data.type_repertoire,
                data.telephone,
                data.version_etat_modification,
                convertToISODate(data.date_creation),
                data.partenaire_date_modification,
                data.mission,
                data.formulaire_contact,
                data.version_source,
                data.type_organisme,
                data.code_insee_commune,
                data.statut_de_diffusion === 'true',
                data.adresse,
                data.url_service_public,
                data.information_complementaire,
                convertToISODate(data.date_diffusion)
            ];

            try {
                await client.query(query, values);
                console.log(`Inserted record for ${data.nom}`);
            } catch (err) {
                console.error(`Error inserting record for ${data.nom}:`, err);
                continue;
            }
        }

        console.log('Data insertion process completed!');
    } catch (err) {
        console.error('Error in main process:', err);
    } finally {
        await client.end();
    }
}

insertData();