import { InputFieldType } from "../../models/InputFieldTypes";

const ThreeDModelProps = {
    nodeType: '3DModelNode',
    fields: [ {type: InputFieldType.textField, label: 'Modelo:', initialValue: 'Modelo 3D', name: 'model'},
            {type: InputFieldType.threeDCoord, label: 'Posição:', initialValue: {x: 0, y: 0, z:0}, name: 'position'},
            {type: InputFieldType.threeDCoord, label: 'Escala:', initialValue: {x: 0, y: 0, z:0}, name: 'scale'},
            {type: InputFieldType.threeDCoord, label: 'Rotação:', initialValue: {x: 0, y: 0, z:0}, name: 'rotation'},
            {type: InputFieldType.checkbox, label: 'Auto-play animações', initialValue: false, name: 'autoplay'},
            {type: InputFieldType.select_location, label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: 'Click', name: 'trigger_mode'},
            {type: InputFieldType.multichoice_check, label: 'Animações:', options: ['Animation1', 'Animation2'], initialValue: [0,0], name: 'animations'}
        ] 
  };


const QuizProps = {
    nodeType: 'Quiz Node',
    fields: [ {type: InputFieldType.textField, label: 'Modelo:', initialValue: 'Modelo 3D', name: 'model'},
    {type: InputFieldType.threeDCoord, label: 'Posição:', initialValue: {x: 0, y: 0, z:0}, name: 'position'},
    {type: InputFieldType.threeDCoord, label: 'Escala:', initialValue: {x: 0, y: 0, z:0}, name: 'scale'},
    {type: InputFieldType.threeDCoord, label: 'Rotação:', initialValue: {x: 0, y: 0, z:0}, name: 'rotation'},
    {type: InputFieldType.checkbox, label: 'Auto-play animações', initialValue: false, name: 'autoplay'},
    {type: InputFieldType.select_location, label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: 'Click', name: 'trigger_mode'},
    {type: InputFieldType.multichoice_check, label: 'Animações:', options: ['Animation1', 'Animation2'], initialValue: [0,0], name: 'animations'}
] 
  }; 
  

  const VideoProps = {
    nodeType: 'Video Node',
    fields: [ {type: InputFieldType.textField, label: 'Modelo:', initialValue: 'Modelo 3D', name: 'model'},
    {type: InputFieldType.threeDCoord, label: 'Posição:', initialValue: {x: 1, y: 1, z:0}, name: 'position'},
    {type: InputFieldType.threeDCoord, label: 'Escala:', initialValue: {x: 0, y: 0, z:0}, name: 'scale'},
    {type: InputFieldType.threeDCoord, label: 'Rotação:', initialValue: {x: 0, y: 0, z:0}, name: 'rotation'},
    {type: InputFieldType.checkbox, label: 'Auto-play animações', initialValue: false, name: 'autoplay'},
    {type: InputFieldType.select_location, label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: 'Click', name: 'trigger_mode'},
    {type: InputFieldType.multichoice_check, label: 'Animações:', options: ['Animation1', 'Animation2'], initialValue: [0,0], name: 'animations'}
] 
  };
  

  const ImageProps = {
    nodeType: 'Image Node',
    fields: [ {type: InputFieldType.textField, label: 'Modelo:', initialValue: 'Modelo 3D', name: 'model'},
    {type: InputFieldType.threeDCoord, label: 'Posição:', initialValue: {x: 0, y: 0, z:0}, name: 'position'},
    {type: InputFieldType.threeDCoord, label: 'Escala:', initialValue: {x: 0, y: 0, z:0}, name: 'scale'},
    {type: InputFieldType.threeDCoord, label: 'Rotação:', initialValue: {x: 0, y: 0, z:0}, name: 'rotation'},
    {type: InputFieldType.checkbox, label: 'Auto-play animações', initialValue: false, name: 'autoplay'},
    {type: InputFieldType.select_location, label: 'Modo de acionamento:', options: ['GPS Coords', 'QR-Code'], initialValue: 'Click', name: 'trigger_mode'},
    {type: InputFieldType.multichoice_check, label: 'Animações:', options: ['Animation1', 'Animation2'], initialValue: [0,0], name: 'animations'}
] 
  };


export {ThreeDModelProps, QuizProps, VideoProps, ImageProps};