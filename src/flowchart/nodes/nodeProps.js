import { FileTypesInput } from "../../models/FileTypesInput";
import { InputFieldType } from "../../models/InputFieldTypes";
import { NodeType } from "../../models/NodeTypes";

const ThreeDModelProps = {
  nodeType: "3DModelNode",
  fields: [
    {
      type: InputFieldType.textField,
      label: "Modelo:",
      initialValue: "Modelo 3D",
      name: "name",
    },
    {
      type: InputFieldType.file_select,
      label: "Ficheiro:",
      initialValue: { inputType: "file", filename: "", blob: null },
      name: "file",
      acceptedType: FileTypesInput.ThreeDModel,
    },
    {
      type: InputFieldType.threeDCoord,
      label: "Posição:",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "position",
    },
    {
      type: InputFieldType.threeDCoord,
      label: "Escala:",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "scale",
    },
    {
      type: InputFieldType.threeDCoord,
      label: "Rotação:",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "rotation",
    },
    {
      type: InputFieldType.checkbox,
      label: "Auto-play animações",
      initialValue: false,
      name: "autoplay",
    },
    {
      type: InputFieldType.select_location,
      label: "Modo de acionamento:",
      options: ["GPS Coords", "QR-Code"],
      initialValue: {
        trigger_mode: "GPS Coords",
        map: "Map 1",
        place: "place",
        qr_code: "qr_code",
      },
      name: "location",
    },
    {
      type: InputFieldType.multichoice_check,
      label: "Animações:",
      options: ["Animation1", "Animation2"],
      initialValue: {
        Animation1: false,
        Animation2: false,
      },
      name: "animations",
    },
  ],
};

const QuizProps = {
  nodeType: "Quiz Node",
  fields: [
    {
      type: InputFieldType.textField,
      label: "Pergunta:",
      initialValue: "Pergunta",
      name: "question",
    },
    {
      type: InputFieldType.textFieldExpandable,
      label: "Respostas:",
      initialValue: ["Resposta 1", "Resposta 2", "Resposta 3", "Resposta 4"],
      name: "answers",
    },
  ],
};

const VideoProps = {
  nodeType: "Video Node",
  fields: [
    {
      type: InputFieldType.textField,
      label: "Nome:",
      initialValue: "Nome do video",
      name: "name",
    },
    {
      type: InputFieldType.file_select,
      label: "Ficheiro:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "file",
      acceptedType: FileTypesInput.Video,
    },
  ],
};

const ImageProps = {
  nodeType: "Image Node",
  fields: [
    {
      type: InputFieldType.textField,
      label: "Nome:",
      initialValue: "Modelo 3D",
      name: "name",
    },
    {
      type: InputFieldType.file_select,
      label: "Ficheiro:",
      initialValue: { inputType: "file", filename: "", blob: null },
      name: "file",
      acceptedType: FileTypesInput.Image,
    },
  ],
};

const AudioProps = {
  nodeType: "Audio Node",
  fields: [
    {
      type: InputFieldType.textField,
      label: "Nome:",
      initialValue: "Nome do audio",
      name: "name",
    },
    {
      type: InputFieldType.file_select,
      label: "Ficheiro:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "file",
      acceptedType: FileTypesInput.Audio,
    },
  ],
};

const TextProps = {
  nodeType: "Text Node",
  fields: [
    {
      type: InputFieldType.textFieldMultiline,
      label: "Texto:",
      initialValue: "Texto",
      name: "text",
    },
    {
      type: InputFieldType.threeDCoord,
      label: "Posição:",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "position",
    },
  ],
};

const PathProps = {
  nodeType: "Path Node",
  fields: [
    {
      type: InputFieldType.textField,
      label: "Nome:",
      initialValue: "Nome do caminho",
      name: "name",
    },
    {
      type: InputFieldType.select_location,
      label: "Início:",
      options: ["GPS Coords", "QR-Code"],
      initialValue: {
        trigger_mode: "GPS Coords",
        map: "Map 1",
        place: "place",
        qr_code: "qr_code",
      },
      name: "start",
    },
    {
      type: InputFieldType.select_location,
      label: "Destino:",
      options: ["GPS Coords", "QR-Code"],
      initialValue: {
        trigger_mode: "GPS Coords",
        map: "Map 1",
        place: "place",
        qr_code: "qr_code",
      },
      name: "destination",
    },
  ],
};

const CharacterProps = {
  nodeType: "Character Node",
  fields: [
    {
      type: InputFieldType.textField,
      label: "Nome:",
      initialValue: "Nome do personagem",
      name: "name",
    },
    {
      type: InputFieldType.file_select,
      label: "Character Sprite:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "file",
      acceptedType: FileTypesInput.Image,
    },
  ],
};

export {
  ThreeDModelProps,
  QuizProps,
  VideoProps,
  ImageProps,
  AudioProps,
  TextProps,
  PathProps,
  CharacterProps,
};
