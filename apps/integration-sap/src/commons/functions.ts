export const convertCity = (city: string) => {

    if (['soledad', 'caracoli', 
        'malambo', 'barranquilla',
        'la playa', 'galapa', 'fact electronica',
        'barraqnuilla', 'puerto', 'barra'].includes(city?.toLowerCase())) {
            return 'Barranquilla';
    } else if (['valledupar', 'valleduoar'].includes(city?.toLowerCase())) {
        return 'Valledupar';
    } else if (['cartagena'].includes(city?.toLowerCase())) {
        return 'Cartagena';
    } 
    return 'Ciudad No Identificada';

}   

export const convertCityToSap = (city: string) => {

    if (city?.toLowerCase() == 'barranquilla') {
            return `(contains(Remarks, 'SOLEDAD') or contains(Remarks, 'CARACOLI') or contains(Remarks, 'MALAMBO') or contains(Remarks, 'BARRANQUILLA') or contains(Remarks, 'LA PLAYA') or contains(Remarks, 'GALAPA') or contains(Remarks, 'FACT ELECTRONICA') or contains(Remarks, 'BARRAQNUILLA') or contains(Remarks, 'PUERTO'))`;
    } else if (city?.toLowerCase() == 'valledupar') {
        return `(contains(Remarks, 'VALLEDUPAR') or contains(Remarks, 'VALLEDUOAR'))`
    } else if (city?.toLowerCase() == 'cartagena') {
        return `contains(Remarks, 'CARTAGENA')`;
    }
}   

