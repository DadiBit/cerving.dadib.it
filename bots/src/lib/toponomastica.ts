export const toponimi : {
    [key: string]: string;
} = {
    'via': 'V.',
    'viale': 'V.LE',
    'vicolo': 'VICOLO',
    'piazza': 'PIAZZA',
    'piazzale': 'PIAZZALE',
    'piazzetta': 'P.TTA',
    'riva': 'RIVA',
    'androna': 'ANDRA',
    'androne': 'ANDR.',
    'salita': 'SAL',
    'scala': 'SCALA',
    'localita\'': 'LOC',
    'corso': 'C.SO',
    'contrada': 'C.DA',
};

export function cardinale(int: number): string {
    if (!int || int < 0) throw new Error('Cardinale can\'t be negative'); 
    if (int == 0) return 'zero';
    const unita_map = [undefined, 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove']; 
    const decine_map = [undefined, undefined, 'venti', 'trenta', 'quaranta', 'cinquanta', 'sessanta', 'settanta', 'ottanta', 'novanta'];
    const unita_int = int < unita_map.length ? int % unita_map.length : int % 10;
    const decine_int = Math.floor((int - unita_int) / 10);
    const decine_str = decine_map[decine_int] ?? '';
    const unita_str = unita_map[unita_int] ?? '';
    // If it's 21, 31, 41, etc. return "ventuno", not "ventiuno"
    return `${unita_int == 1 ? decine_str.slice(0, -1) : decine_str}${unita_str}`;
}

export function ordinale(int: number): string {
    if (!int || int < 1) throw new Error('Ordinale can\'t be negative or zero');
    // Handle special cases 1 usque 10
    if (int <= 10) return ['primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto', 'settimo', 'ottavo', 'nono', 'decimo'][int - 1];
    // Everything else is cardinale, stripped last, plus -esimo
    return `${cardinale(int).slice(0, -1)}esimo`;
}
