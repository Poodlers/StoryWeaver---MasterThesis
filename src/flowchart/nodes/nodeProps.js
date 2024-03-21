import { InputFieldType } from "../../models/InputFieldTypes";

const ThreeDModelProps = {
    nodeType: '3DModelNode',
    fields: [ {type: InputFieldType.textField, label: 'Modelo:', initialValue: 'Modelo 3D', name: 'name'},
            {type: InputFieldType.file_select, label: 'Ficheiro:', initialValue: './assets/spongebob.glb', name: 'filepath'},
            {type: InputFieldType.threeDCoord, label: 'Posição:', initialValue: {x: 0, y: 0, z:0}, name: 'position'},
            {type: InputFieldType.threeDCoord, label: 'Escala:', initialValue: {x: 0, y: 0, z:0}, name: 'scale'},
            {type: InputFieldType.threeDCoord, label: 'Rotação:', initialValue: {x: 0, y: 0, z:0}, name: 'rotation'},
            {type: InputFieldType.checkbox, label: 'Auto-play animações', initialValue: false, name: 'autoplay'},
            {type: InputFieldType.select_location, label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: {trigger_mode: 'GPS Coords', 
            map: 'Map 1', place: 'place', qr_code: 'qr_code'
          }, name: 'location'},
            {type: InputFieldType.multichoice_check, label: 'Animações:', options: ['Animation1', 'Animation2'], initialValue: {
              'Animation1': false,
              'Animation2': false
            }, name: 'animations'}
        ] 
  };


const QuizProps = {
    nodeType: 'Quiz Node',
    fields: [ {type: InputFieldType.textField, label: 'Pergunta:', initialValue: '', name: 'question'},
    {type: InputFieldType.textFieldExpandable, label: 'Respostas:', initialValue: ['','','',''], name: 'answers'},
    ] 
  }; 
  

  const VideoProps = {
    nodeType: 'Video Node',
    fields: [ {type: InputFieldType.textField, label: 'Modelo:', initialValue: 'Modelo 3D', name: 'model'},
    {type: InputFieldType.threeDCoord, label: 'Posição:', initialValue: {x: 1, y: 1, z:0}, name: 'position'},
    {type: InputFieldType.threeDCoord, label: 'Escala:', initialValue: {x: 0, y: 0, z:0}, name: 'scale'},
    {type: InputFieldType.threeDCoord, label: 'Rotação:', initialValue: {x: 0, y: 0, z:0}, name: 'rotation'},
    {type: InputFieldType.checkbox, label: 'Auto-play', initialValue: false, name: 'autoplay'},
    {type: InputFieldType.select_location, label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: {trigger_mode: 'GPS Coords', 
    map: 'Map 1', place: 'place', qr_code: 'qr_code'
  }, name: 'location'},
] 
  };
  

  const ImageProps = {
    nodeType: 'Image Node',
    fields: [ {type: InputFieldType.textField, label: 'Modelo:', initialValue: 'Modelo 3D', name: 'model'},
    {type: InputFieldType.threeDCoord, label: 'Posição:', initialValue: {x: 0, y: 0, z:0}, name: 'position'},
    {type: InputFieldType.threeDCoord, label: 'Escala:', initialValue: {x: 0, y: 0, z:0}, name: 'scale'},
    {type: InputFieldType.threeDCoord, label: 'Rotação:', initialValue: {x: 0, y: 0, z:0}, name: 'rotation'},
    {type: InputFieldType.checkbox, label: 'Auto-play animações', initialValue: false, name: 'autoplay'},
    {type: InputFieldType.select_location, label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: {trigger_mode: 'GPS Coords', 
    map: 'Map 1', place: 'place', qr_code: 'qr_code'
  }, name: 'location'},
    {type: InputFieldType.multichoice_check, label: 'Animações:', options: ['Animation1', 'Animation2'], initialValue: {
      'Animation1': false,
      'Animation2': false
    }, name: 'animations'}
] 
  };


export {ThreeDModelProps, QuizProps, VideoProps, ImageProps};