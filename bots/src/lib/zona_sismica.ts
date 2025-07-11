import { control } from "./controls";
import { EVENTS } from "./actions";

const PATH = '/db/zona_sismica.json';

export const regione = control('hidden');
export const provincia = control('select', 'Provincia', { required: true }, []);
export const comune = control('select', 'Comune', { required: true }, []);
export const zona_sismica = control('hidden');

fetch(PATH)
.then(res => res.json())
.then((data: [string, string, string, string, string, string][]) => {
  
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
    for (const nome of comuni)
      comune[1].appendChild(new Option(nome, nome));

  });

  // Whenever the comune changes, update the zone sismica
  comune[1].addEventListener('change', () => {
    zona_sismica[1].value = data.find(row => row[3] == comune[1].value)?.[5] ?? '';
  });

  // Add the options
  const province = new Set(data.map(row => row[2]));
  for (const sigla of [...province].sort())
    provincia[1].appendChild(new Option(sigla, sigla));

  // When loading fire change events immidiately
  provincia[1].dispatchEvent(EVENTS.change);
  comune[1].dispatchEvent(EVENTS.change);
  
});