export const getCategorias = async () => {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const data = await response.json();
        return data.meals;
      } catch (error) {
        console.log(error);
        return [];
      }
}

export const getCategoriasFiltro = async (categoria) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`);
        const data = await response.json();
        return data.meals;
      } catch (error) {
        console.log(error);
        return [];
      }
}

export const getPLato = async (name) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
        const data = await response.json();
        return data.meals;
      } catch (error) {
        console.log(error);
        return [];
      }
};

export const getAreas = async () => {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        const data = await response.json();
        return data.meals;
      } catch (error) {
        console.log(error);
        return [];
      }
}

export const getAreasFiltro = async (area) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
        const data = await response.json();
        return data.meals;
      } catch (error) {
        console.log(error);
        return [];
      }
}

export const getIngredientes = async () => {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const data = await response.json();
        return data.meals;
      } catch (error) {
        console.log(error);
        return [];
      }
}

export const getIngredientesFiltro = async (ingrediente) => {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediente}`);
        const data = await response.json();
        return data.meals;
      } catch (error) {
        console.log(error);
        return [];
      }
}

export const getRecetaRandom = async () => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const data = await response.json();
    return data.meals;
  } catch (error) {
    console.log(error);
    return [];
  }
}