const ThreeDModelProps = {
    nodeType: '3DModelNode',
    fields: [ {type: 'textField', label: 'Modelo:', initialValue: 'Modelo 3D'},
            {type: '3DCoord', label: 'Posição:', initialValue: [0,0,0]},
            {type: '3DCoord', label: 'Escala:', initialValue: [1,1,1]},
            {type: '3DCoord', label: 'Rotação:', initialValue: [0,0,0]},
            {type: 'checkbox', label: 'Auto-play animações', initialValue: false},
            {type: 'select-location', label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: 'Click'},
            {type: 'multichoice-check', label: 'Animações:', options: ['Animation1', 'Animation2'], initialValue: [0,0]}
        ] 
  };


const QuizProps = {
    nodeType: 'Quiz Node',
    fields: [ {type: 'textField', label: 'Modelo:', initialValue: 'Modelo 3D'},
            {type: '3DCoord', label: 'Posição:', initialValue: [0,0,0]},
            {type: '3DCoord', label: 'Escala:', initialValue: [1,1,1]},
            {type: '3DCoord', label: 'Rotação:', initialValue: [0,0,0]},
            {type: 'checkbox', label: 'Auto-play animações', initialValue: false},
            {type: 'select-location', label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: 'Click'},
            {type: 'multichoice-check', label: 'Animações:', options: ['Animation1', 'Animation2'], initialValue: [0,0]}
        ] 
  };

  const VideoProps = {
    nodeType: 'Video Node',
    fields: [ {type: 'textField', label: 'Modelo:', initialValue: 'Modelo 3D'},
            {type: '3DCoord', label: 'Posição:', initialValue: [0,0,0]},
            {type: '3DCoord', label: 'Escala:', initialValue: [1,1,1]},
            {type: '3DCoord', label: 'Rotação:', initialValue: [0,0,0]},
            {type: 'checkbox', label: 'Auto-play animações', initialValue: false},
            {type: 'select-location', label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: 'Click'},
            {type: 'multichoice-check', label: 'Animações:', options: ['Animation1', 'Animation2'], initialValue: [0,0]}
        ] 
  };

  const ImageProps = {
    nodeType: 'Image Node',
    fields: [ {type: 'textField', label: 'Modelo:', initialValue: 'Modelo 3D'},
            {type: '3DCoord', label: 'Posição:', initialValue: [0,0,0]},
            {type: '3DCoord', label: 'Escala:', initialValue: [1,1,1]},
            {type: '3DCoord', label: 'Rotação:', initialValue: [0,0,0]},
            {type: 'checkbox', label: 'Auto-play animações', initialValue: false},
            {type: 'select-location', label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: 'Click'},
            {type: 'multichoice-check', label: 'Animações:', options: ['Animation1', 'Animation2'], initialValue: [0,0]}
        ] 
  };


export {ThreeDModelProps, QuizProps, VideoProps, ImageProps};