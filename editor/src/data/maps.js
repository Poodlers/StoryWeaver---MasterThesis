const mapsStorage = localStorage.getItem("maps");

let maps = mapsStorage != null ? JSON.parse(mapsStorage) : [];
export default maps;
