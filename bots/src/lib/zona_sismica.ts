import { control, loadOptions } from "./controls";
import { EVENTS } from "./actions";

const DB = '/db/zona_sismica.json';

export const regione = control('hidden');
export const provincia = control('select', 'Provincia', { required: true }, []);
export const comune = control('select', 'Comune', { required: true }, []);
export const zona_sismica = control('hidden');

(async function() {

  // Guard against running the init function within the cerved page
  // ! This is a hack, but it works for now
  // We should just wait for up to 10 seconds or something like that for the elements to be connected.
  if (document.location.host === 'perizie.cervedgroup.com') return;

  // Fetch JSON database
  const res = await fetch(DB);
  const data = await res.json() as [string, string, string, string, string, string][];
    
  // Header currently is:
  // 0:REGIONE	1:PROV_CITTA_METROPOLITANA	2:SIGLA_PROV	3:COMUNE	4:COD_ISTAT_COMUNE	5:ZONA_SISMICA
  // Hardcoding reduces a tonshit of bandwidth -> faster loading!

  // Whenever the province changes, update the comune options
  provincia[1].addEventListener('change', () => {

    // Set regione
    regione[1].value = data.find(row => row[2] == provincia[1].value)?.[0] ?? '';

    // Filter the comuni
    let comuni = data.filter(row => row[2] == provincia[1].value)
      .map(row => row[3]);

    // Replace the current options
    comune[1].innerHTML = '';
    loadOptions(comune[1], comuni);

  });

  // Whenever the comune changes, update the zone sismica
  comune[1].addEventListener('change', () => {
    zona_sismica[1].value = data.find(row => row[3] == comune[1].value)?.[5] ?? '';
  });

  // Add the options
  const province = new Set(data.map(row => row[2]));
  loadOptions(provincia[1], [...province].sort());

  // When loading fire change events immidiately
  provincia[1].dispatchEvent(EVENTS.change);
  comune[1].dispatchEvent(EVENTS.change);

})();