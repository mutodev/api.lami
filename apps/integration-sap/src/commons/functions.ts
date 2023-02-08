export const convertCity = (city) => {

    if (['SOLEDAD', 'CARACOLI', 
        'MALAMBO', 'BARRANQUILLA',
        'LA PLAYA', 'GALAPA', 'FACT ELECTRONICA',
        'BARRAQNUILLA', 'PUERTO'].includes(city)) {
            return 'Barranquilla';
    } else if (['VALLEDUPAR', 'VALLEDUOAR'].includes(city)) {
        return 'Valledupar';
    } else if (city == 'CARTAGENA') {
        return 'Cartagena';
    } 
    return null;

}   