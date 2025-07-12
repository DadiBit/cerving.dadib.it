import { type Controls, control, loadOptions } from "./lib/controls";
import { click, match, set, populate, type ActionData, wait, EVENTS } from "./lib/actions";
import { regione, provincia, comune, zona_sismica, metropoli, servizi } from "./lib/zona_sismica";
import { cardinale, toponimi } from "./lib/toponomastica";

const destinazione = control('select', 'Destinazione', { required: true }, [
  'Residenziale', 'Negozio/Spazio Commerciale', 'Ufficio/Spazio Direzionale',
  'Alberghiero/Ricettivo', 'Industriale', 'Artigianale'
]);

const tipologia = control('select', 'Tipologia', { required: true }, []);
destinazione[1].addEventListener('change', () => {

  // Clear the options and add the new ones
  tipologia[1].innerHTML = '';
  switch (destinazione[1].value) {
    case 'Residenziale':
      loadOptions(tipologia[1],
        ['Appartamento', 'Appartamento in villa', 'Villa bifamiliare', 'Villa monofamiliare', 'Villetta a schiera', 'Villino']);
      break;
    case 'Negozio/Spazio Commerciale':
      loadOptions(tipologia[1], ['Negozio / locale commerciale']);
      break;
    case 'Ufficio/Spazio Direzionale':
      loadOptions(tipologia[1], ['Ufficio / studio professionale']);
      break;
    case 'Alberghiero/Ricettivo':
      loadOptions(tipologia[1], ['Palazzina / condominio']);
      break;
    case 'Industriale':
      loadOptions(tipologia[1], ['Magazzino', 'Palazzina / condominio', 'Capannone', 'Capannone + abitazione']);
      break;
    case 'Artigianale':
      loadOptions(tipologia[1], ['Laboratorio artigianale']);
      break;
  }

  // Show/hide the options
  const parent = tipologia[1].parentElement;
  if (parent instanceof HTMLDivElement) {
    parent.style.display = tipologia[1].options.length < 2 ? 'none' : 'block';
  }

});

// Simulate a change event
destinazione[1].dispatchEvent(EVENTS.change);

export const controls = {
  regione, provincia, comune, zona_sismica, metropoli,
  toponimo: control('select', 'Toponimo', { required: true }, Object.keys(toponimi)),
  indirizzo: control('string', 'Indirizzo', { required: true }),
  civico: control('string', 'Civico', { required: true }),
  zona_omi: control('string', 'Zona OMI', { required: true, minlength: 1, maxlength: 3 }),
  destinazione, tipologia,
  dimensione: control('select', 'Dimensione', { required: true, value: 'Medio' }, [
    'Piccolo', 'Medio piccolo', 'Medio', 'Medio grande', 'Grande'
  ]),
  piani_fuori_terra: control('number', 'Piani fuori terra', { required: true, min: 0, max: 100, step: 1 }),
  piani_entro_terra: control('number', 'Piani entro terra', { required: true, min: 0, max: 100, step: 1 }),
  anno_costruzione: control('number', 'Anno di costruzione', { required: true, min: 1700, max: new Date().getFullYear() }),
  vtr: control('number', 'VTR', { required: false, min: 0, max: 100_000_000, step: 100 }),
} satisfies Controls;

export async function action({  
  regione, provincia, comune, zona_sismica, metropoli,
  toponimo, indirizzo, civico,
  zona_omi,
  destinazione, tipologia,
  dimensione, piani_fuori_terra, piani_entro_terra,
  anno_costruzione,
  vtr,
}: ActionData<typeof controls>): Promise<void> {

  // Parse knows ints
  const piani_fuori_terra_int = parseInt(piani_fuori_terra);
  const piani_entro_terra_int = parseInt(piani_entro_terra);
  const anno_costruzione_int = parseInt(anno_costruzione);
  const vtr_int = parseInt(vtr);

  // Since we're populating a lot of fields, we should wait
  // so we don't fall in a race condition
  await populate({
    
    /** Riepilogo **/
    '#motivazioneCensimento': "7",
    '#region_1': regione,
    '#comune_1': `${comune} (${provincia})`,
    '#toponimo_1': toponimi[toponimo] ?? toponimi['via'],
    '#toponimo_1-display': toponimo,
    '#indirizzo': indirizzo,
    '#civico': civico,
    '#realPostCodeSubject': '', // this is computed when validating the address
    '#metodoValutativoUtilizzato': "MEVU.1",
    '#noteMetodoValutativoUtilizzato': "Valutazione condotta con metodo MCA.",
    '#descrizionePotenzialiRischi': `Zona sismica ${zona_sismica}.`,
    
    /** Lotto 1 **/
    '#destinazione': destinazione,
    '#taglioDimensionale': dimensione,
    '#D200_D': tipologia,
    '#scala': "-",
    '#interno': "-",
  
    /** Comparabili **/
    '#calculateMCA_1': true,
    '#calculateMCA_2': true,
    '#calculateMCA_3': true,
    '#panoramicita_0': "Non panoramico",
    '#panoramicita_1': "Non panoramico",
    '#panoramicita_2': "Non panoramico",
    'input[name=buildingSqmComparable_0]': 0,
    'input[name=buildingSqmComparable_1]': 0,
    'input[name=buildingSqmComparable_2]': 0,
    '#construtionYearComparable_0': "-",
    '#construtionYearComparable_1': "-",
    '#construtionYearComparable_2': "-",
    '#priceTypeComparable_0': "Richiesto",
    '#priceTypeComparable_1': "Richiesto",
    '#priceTypeComparable_2': "Richiesto",
    '#dotazione_impiantistica_ui_0': "Nella media",
    '#dotazione_impiantistica_ui_1': "Nella media",
    '#dotazione_impiantistica_ui_2': "Nella media",
    '#peso_comparabile_0': 33,
    '#peso_comparabile_1': 33,
    '#peso_comparabile_2': 34,
    '#tipo_coeff_correttivo_prezzo_0': "Sconto",
    '#tipo_coeff_correttivo_prezzo_1': "Sconto",
    '#tipo_coeff_correttivo_prezzo_2': "Sconto",
    '#classificazione_energetica_0': "NR",
    '#classificazione_energetica_1': "NR",
    '#classificazione_energetica_2': "NR",
    '#trend_mercato': "1%",
    '#dotazione_impianti': "Nella media",
    '#coefficiente_piano': "1,00",
    'select[name=ascensore]': "1",
    'input[name=vetustaAscensore]': "0",
    '#panoramicitaSoggetto': "Non panoramico",
  
    /** Catastali **/
    'select[name=corrispondenzaIntestatarioAttoInVisura]': "Si",
  
    /** Criteri/Modalità **/
    '#criterioMisurazione': "S.E.L.",
    '#tipoMisura': "2",
    '#desuntaGraficamenteDa': "Planimetria catastale quotata",
  
    /** Valutazione immobiliare **/
    '#posizionamento': "MED",
    '#prezzoAlMqAreaEsterna': "10,00",
    '#descrizioneAccessori': "-",
    '#commentoAllaValutazione': "Valutazione condotta con metodo MCA.",
    'select[name=immobileIdoneoPerGaranziaIpotecaria]': "IDONEO",
  
    /** Urbanistica **/
    'select[name=conformitaEdiliziaRispettoDocumentazioneFornita]': "0",
    'select[name=fonteConformitaEdilizia]': "DOC_FOR",
    'select[name=liberamenteCommerciabile]': "S",
    'select[name=verificaCorrettaUbicazioneCostruzione]': "1",
    'select[name=regolaritaUrbanistica]': 1,
    'select[name=servitu]': "Assente",
    'select[name=pattoPregiudizievole]': "Assente",

    /* Vincoli */
    '#assenzaVincoli_1': true,

    /* Convenzioni */
    '#assenzaConvenzioni_1': true,
  
    /** Fabbricato **/
    '#fabbricato': "Presente",
    '#tipoCasa': "A - Altro",
    '#statoImmobileAlSopralluogo': "Finito",
    '#statoOccupazionaleAlSopralluogo': "LIBER",
    '#condizioneFabbricato': "Usato",
    '#nuovaCostruzione': "No",
    '#appetibilitaCommerciale': "2",
    '#noteCommerciabilita': "Il mercato si presenta in soddisfacenti condizioni pertanto è corretto desumere un vendita entro i 12 mesi.",
    '#tempiMediVendita': "Da 6 a 12 mesi",
    '#tempiMediVenditaMesi': "12",
    '#faseDiMercato': "CONT",
    '#livelloDomanda': "Normale",
    '#livelloOfferta': "Normale",
    '#regimeVendita': "Edilizia libera",
    '#regimeSuolo': "AREA_LIBERA",
    '#formaLotto': "Normale",
    '#presenzaUrbanizzazioni': "Presente",
    '#qualificazioneAmbientale': "Normale",
    'select[name=inquinamentoAcustico]': "Nella media",
    'select[name=inquinamentoAtmosferico]': "Nella media",
    'select[name=inquinamentoElettromagnetico]': "Nella media",
    '#accessoStazioneLineaMetropolitana': "Assente",
    '#interesseStoricoArtistico': "Assente",
    '#esposizioneImmobile': "Media",
    '#accessibilitaAdattabilitaFabbricato': "Facilmente adattabile",
    '#prospicienzaFabbricato': "Normale",
    '#accessoDaStradaPrincipale': "Presente",
    '#accessoDaStradaSecondaria': "Assente",
    '#androne': "Assente",
    '#elementiArchitettoniciDecorativi': "Assenti",
    '#copertura': "A falde",
    '#mantoDiCopertura': "Non rilevato",
    '#facciataPrincipale': "Intonacate",
    '#altreFacciate': "Intonacate",
    'select[name=fabbricatoAntisismico]': "No",
    '#tamponamenti': "Mattoni forati",
    'select[name=portieratoGuardinaia]': "Assente",
    'select[name=terrazzeDiUsoComune]': "Assente",
  
    /** Unità immobiliare 1 **/
    '#condizioneUnitaImmobiliare': "Usato",
    '#carattereDistributivi': "Pareti fisse",
    '#qualitaDistributivaeFunzionalita': "Normale",
    '#panoramicitaUnitaImmobiliare': "Assente",
    '#luminositaUnitaImmobiliare': "Media",
    '#pavimentazioniUnitaImmobiliare': "Ceramica",
    'select[name=porteInterneUnitaImmobiliare]': "Legno",
    '#rivestimentiUnitaImmobiliare': "Ceramica",
    '#paretiUnitaImmobiliare': "Intonaco al civile",
    '#taglioDimensionaleUnitaImmobiliare': dimensione,
    'select[name=presenzaSottotetto]': "N",
    'select[name=numeroSolai]': "0",
    'select[name=altrePertinenze]': "N",
    '#numBoxUnitaImmobiliare': "0",
    '#numPostiAutoCopertiUnitaImmobiliare': "0",
    '#numPostiAutoScopertiUnitaImmobiliare': "0",

    /** Impianti **/
    '#impiantoElettrico': "Sottotraccia",
    'select[dichiarazioneConformitaImpiantoElettrico]': "Non rilevato",
    '#impiantoIdricoSanitario': "Presente",
    'select[dichiarazioneConformitaImpiantoIdricoSanitario]': "Non rilevato",
    'select[name=impiantoRiscaldamento]': "Autonomo",
    '#alimentazioneImpiantoRiscaldamento': "Gas/Metano",
    '#elementiRadianti': "Radiatori in alluminio",
    'select[name=dichiarazioneConformitaImpiantoRiscaldamento]': "Non rilevato",
    '#impiantoCondizionamento': "Assente",
    '#impiantoAntifurto': "Assente",
    '#impiantoAntincendio': "Assente",
    '#impiantoTelefonico': "Presente",
    '#impiantoTrasmissioneDati': "Presente",
    '#impiantoSolareTermico': "Assente",
    '#impiantoFotovoltaico': "Assente",
    '#impiantoVideocitofonico': "Assente",

  }, 500); // wait 500ms

  // Before 1920 it's pretty much impossible to see armed concrete in residential buildings
  if (typeof anno_costruzione === 'string') {
    if (parseInt(anno_costruzione) < 1920) {  
      // No need to wait, this can run in the background!
      populate({
        '#strutturePortantiVerticaliPrevalenti': "Muratura",
        '#strutturePortantiOrizzontaliPrevalenti':  "Legno",
      })
    } else {
      populate({
        '#strutturePortantiVerticaliPrevalenti': "Cemento armato",
        '#strutturePortantiOrizzontaliPrevalenti':  "Cemento armato",
      })
    }
  }

  let zona: string;
  switch (zona_omi[0]) {
    case 'B':
      zona = "centrale";
      break;
    case 'C':
      zona = "semicentrale";
      break;
    case 'D':
      zona = "periferica";
      break;
    case 'E':
      zona = "extraurbana";
      break;
    case 'R':
      zona = "rurale";
      break;
    default:
      zona = "";
      break;
  }

  const infrastrutture = zona == 'centrale' || zona == 'semicentrale'
    ? metropoli == 'Metropoli' ? 4 : 3 : 2;
  set('#giudizioInfrastrutture', infrastrutture);

  // We are smart enough to know what it is based on the number of floors...
  if (tipologia === 'Palazzina / condominio') {
    tipologia = tipologia.split(' / ')[piani_fuori_terra_int > 3 ? 1 : 0];
  }

  // Floors texts
  piani_fuori_terra = piani_fuori_terra_int > 0 ? `${cardinale(piani_fuori_terra_int)} piani fuori terra` : '';
  piani_entro_terra = piani_entro_terra_int > 0 ? `${cardinale(piani_entro_terra_int)} piani sotto il livello stradale` : '';
  let piani_str = piani_fuori_terra + (piani_fuori_terra_int > 0 && piani_entro_terra_int > 0 ? ' e ' : '') + piani_entro_terra;

  // Description
  set('#descrizioneLotto',
    `Trattasi di un? ${tipologia.toLowerCase()} strutturat? su ${piani_str}, ubicat? in zona ${zona} del comune di ${comune} (${provincia}), e più precisamente in ${toponimo} ${indirizzo} al civico n. ${civico}.`
  + ' ' + servizi[infrastrutture - 2]);

  /** VALUTAZIONE IMMOBILIARE **/
  if (vtr_int != 0) {
    set('#valutazioneVtr', vtr);
    const commento = document.getElementById('commentoAllaValutazione');
    if (commento instanceof HTMLTextAreaElement) {
      commento.innerHTML += " Il VTR indicato è stato desunto da promessa d'acquisto allegata.";
    }
  } else {
    click('#valutazioneVtrNonDisponibile');
  }

  if (anno_costruzione_int < 1967) {
    set('#noteConformitaEdilizia', "Immobile ante 01/09/1967 desunto da atto di proveninenza allegato."); 
  }

  /** MODALS/POPUPS **/

  /** RIEPILOGO **/
  click('#validateAddress');
  // Wait for the modal to appear
  const validateAddressModal = document.getElementById('validateAddressModal');
  await wait(() => validateAddressModal?.style.display == 'block');
  // Try clicking the button to validate the address
  const importaIndirizzoValidatoButton = document.getElementById('importaIndirizzoValidatoButton');
  if (importaIndirizzoValidatoButton instanceof HTMLButtonElement && !importaIndirizzoValidatoButton.disabled) {
    importaIndirizzoValidatoButton.click();
  } else {
    // Close Modal if it failed to validate the address
    await click('#validateAddressModal button.close');
  }

}