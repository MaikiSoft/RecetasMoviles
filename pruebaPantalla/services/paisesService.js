export const getPais = async (pais) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/demonym/${pais}`);
        const data = await response.json();
        return data.map(p => ({
            nombre: p.translations.spa.common,
            bandera: p.flags.png
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const getPaisPorNombre = async (nombrePais) => {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${nombrePais}`);
        const data = await response.json();
        return data.map(p => ({
            nombre: p.translations.spa.common,
            bandera: p.flags.png
        }));
    } catch (error) {
        console.log(error);
        return [];
    }
}