enum MarkerTypes {
    anchor = 'anchor',
    bathroom = 'bathroom',
    elevator = 'elevator',
    artifact = 'artifact',
    entrance = 'entrance',
    exit = 'exit',
    painting = 'painting',
    sculpture = 'sculpture',
    other = 'other',
}

const possibleMarkers =[
    {
        name: 'Casa de Banho',
        type: MarkerTypes.bathroom,
        image: 'casa_de_banho.svg',
    },
    {
        name: 'Escultura',
        type: MarkerTypes.sculpture,
        image: 'escultura.svg',
    },
    {
        name: 'Elevador',
        type: MarkerTypes.elevator,
        image: 'elevador.svg',
    },
    {
        name: 'Entrada',
        type: MarkerTypes.entrance,
        image: 'entrance.png',
    },
    {
        name: 'Saída',
        type: MarkerTypes.exit,
        image: 'saida.svg',
    },
    {
        name: 'Pintura',
        type: MarkerTypes.painting,
        image: 'pintura.svg',
    },
    {
        name: 'Âncora',
        type: MarkerTypes.anchor,
        image: 'ancora.svg',
    },
    {
        name: 'Artefacto',
        type: MarkerTypes.artifact,
        image: 'artefacto.svg',
    },
    {
        name: 'Outro',
        type: MarkerTypes.other,
        image: 'info.svg',
    }
    
]


export { MarkerTypes, possibleMarkers}