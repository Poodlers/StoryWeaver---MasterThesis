let defaultMaps = [
  {
    id: 1,
    name: "Map 1",
    description: "This is the first map",
    image: "/images/map1.jpg",
    mapSize: { width: 1000, height: 500 },
    anchors: [],
    places: [
      {
        id: 1,
        name: "Casa de Banho",
        description: "This is a bathroom",
        icon: "bathroom",
        coords: { x: 0, y: 0 },
      },
      {
        id: 2,
        name: "Sala",
        description: "This is a living room",
        icon: "living_room",
        coords: { x: 0, y: 0 },
      },
      {
        id: 3,
        name: "Cozinha",
        description: "This is a kitchen",
        icon: "kitchen",
        coords: { x: 0, y: 0 },
      },
      {
        id: 4,
        name: "Quarto",
        description: "This is a bedroom",
        icon: "bedroom",
        coords: { x: 0, y: 0 },
      },
    ],
  },
];

const mapsStorage = localStorage.getItem("maps");

let maps = mapsStorage != null ? JSON.parse(mapsStorage) : defaultMaps;
export default maps;
