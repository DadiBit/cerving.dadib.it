import { type Controls, control } from "./lib/controls.js";
import { click, match, populate, type ActionData } from "./lib/actions.js";

export const controls = {
  toponimo: control('select', 'Toponimo', { required: true }, [
    'via', 'viale', 'vicolo', 'piazza', 'piazzale', 'riva', 'androna', 'salita', 'scala'
  ]),
  indirizzo: control('string', 'Indirizzo', { required: true }),
  civico: control('string', 'Civico', { required: true }),
  // TODO: crea sorgente lista comuni -> regione
  comune: control('string', 'Comune', { required: true }),
  zona_sismica: control('select', 'Zona sismica', { required: true }, ['1', '2', '3', '4']),
  zona_omi: control('string', 'Zona OMI', { required: true, minlength: 1, maxlength: 3 }),
  destinazione: control('select', 'Destinazione', { required: true }, [
    'Residenziale', 'Negozio/Spazio Commerciale', 'Ufficio/Spazio Direzionale',
    'Alberghiero/Ricettivo', 'Industriale', 'Artigianale'
  ]),
  dimensione: control('select', 'Dimensione', { required: true, value: 'Medio' }, [
    'Piccolo', 'Medio piccolo', 'Medio', 'Medio grande', 'Grande'
  ]),
  anno_costruzione: control('number', 'Anno di costruzione', { required: true, min: 1700, max: new Date().getFullYear() }),
} satisfies Controls;

export async function action({
  toponimo,
  indirizzo,
  civico,
  comune,
  zona_sismica,
  zona_omi,
  destinazione,
  dimensione,
  anno_costruzione,
}: ActionData<typeof controls>): Promise<void> {

  // Since we're populating a lot of fields, we should wait
  // so we don't fall in a race condition
  await populate({
    
    /** Riepilogo **/
    '#motivazioneCensimento': "7",
    '#toponimo_1-display': toponimo,
    '#indirizzo': indirizzo,
    '#civico': civico,
    '#comune_1': comune,
    '#region_1': "Friuli-Venezia Giulia", // TODO
    '#metodoValutativoUtilizzato': "MEVU.1",
    '#noteMetodoValutativoUtilizzato': "Valutazione condotta con metodo MCA.",
    '#descrizionePotenzialiRischi': `Zona sismica ${zona_sismica}`,
    
    /** Lotto 1 **/
	  '#destinazione': destinazione,
	  '#taglioDimensionale': dimensione,
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
	  '#commentoAllaValutazione': "Valutazione condotta con metodo MCA. Il VTR indicato è stato desunto da promessa d'acquisto allegata. Si rende evidente che il bene oggetto di stima risulta tavolarmente iscritto.",
	  'select[name=immobileIdoneoPerGaranziaIpotecaria]': "IDONEO",
	
	  /** Urbanistica **/
	  'select[name=conformitaEdiliziaRispettoDocumentazioneFornita]': "0",
	  'select[name=fonteConformitaEdilizia]': "DOC_FOR",
	  'select[name=liberamenteCommerciabile]': "S",
	  '#noteConformitaEdilizia': "Immobile ante 01/09/1967 desunto da promessa di acquisto allegata.",
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

  });

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

  if (typeof zona_omi == 'string') {

    // Try to open the OMI zone selector popup
    await click('button[data-bind="click: addMarketValue"]');
    const zone_omi = await match('#zone_omi');
    
    // Select the correct zone
    if (zone_omi instanceof HTMLSelectElement) {
      for (const option of zone_omi.options) {
        // Try to match the selected zone
        // B1 doesn't match B10 (usage of /)
        if (option.innerText.startsWith(`${zona_omi}/`)) {
          option.selected = true;
          break;
        }
      }
    }

  }

}