import { narrator } from "../../data/narrator";
import { DialogNodeType } from "../../models/DialogNodeTypes";
import { FileTypesInput } from "../../models/FileTypesInput";
import { InputFieldType } from "../../models/InputFieldTypes";
import { NodeType } from "../../models/NodeTypes";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";

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
      label: "Fundo:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: InputFieldType.file_select,
      label: "Ficheiro:",
      initialValue: {
        inputType: "url",
        filename: "",
        blob: null,
        modelType: ThreeDModelTypes.gltf,
      },
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
      initialValue: { x: 1, y: 1, z: 1 },
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
      type: InputFieldType.checkbox,
      label: "AR enabled? ",
      initialValue: false,
      name: "ar",
    },
    {
      type: InputFieldType.select_location,
      conditional: "ar",
      label: "Modo de acionamento:",
      options: ["GPS Coords", "QR-Code", "Image Tracking"],
      initialValue: {
        trigger_mode: "GPS Coords",
        map: "Map 1",
        place: "place",
        qr_code: "qr_code",
        tolerance: 5,
        image: { inputType: "url", filename: "", blob: null },
      },
      name: "ar_type",
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
      type: InputFieldType.textFieldMultiline,
      label: "Pergunta:",
      initialValue: "Pergunta",
      name: "question",
    },
    {
      type: InputFieldType.file_select,
      label: "Fundo:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "background",
      acceptedType: FileTypesInput.Image,
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
      type: InputFieldType.textFieldMultiline,
      label: "Texto:",
      initialValue: "Nome do video",
      name: "name",
    },
    {
      type: InputFieldType.file_select,
      label: "Fundo:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: InputFieldType.file_select,
      label: "Ficheiro:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "file",
      acceptedType: FileTypesInput.Video,
    },
    {
      type: InputFieldType.checkbox,
      label: "AR enabled? ",
      initialValue: false,
      name: "ar",
    },
    {
      type: InputFieldType.select_location,
      conditional: "ar",
      label: "Modo de acionamento:",
      options: ["GPS Coords", "QR-Code", "Image Tracking"],
      initialValue: {
        trigger_mode: "GPS Coords",
        map: "Map 1",
        place: "place",
        tolerance: 5,
        qr_code: "qr_code",
        image: { inputType: "url", filename: "", blob: null },
      },
      name: "ar_type",
    },
    {
      type: InputFieldType.threeDCoord,
      label: "Posição:",
      conditional: "ar",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "position",
    },
    {
      type: InputFieldType.threeDCoord,
      label: "Escala:",
      conditional: "ar",
      initialValue: { x: 1, y: 1, z: 1 },
      name: "scale",
    },
  ],
};

const ImageProps = {
  nodeType: "Image Node",
  fields: [
    {
      type: InputFieldType.textFieldMultiline,
      label: "Nome:",
      initialValue: "Modelo 3D",
      name: "name",
    },
    {
      type: InputFieldType.file_select,
      label: "Fundo:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: InputFieldType.file_select,
      label: "Ficheiro:",
      initialValue: { inputType: "file", filename: "", blob: null },
      name: "file",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: InputFieldType.threeDCoord,
      label: "Posição:",
      conditional: "ar",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "position",
    },
    {
      type: InputFieldType.threeDCoord,
      label: "Escala:",
      conditional: "ar",
      initialValue: { x: 1, y: 1, z: 1 },
      name: "scale",
    },
    {
      type: InputFieldType.checkbox,
      label: "AR enabled? ",
      initialValue: false,
      name: "ar",
    },
    {
      type: InputFieldType.select_location,
      conditional: "ar",
      label: "Modo de acionamento:",
      options: ["GPS Coords", "QR-Code", "Image Tracking"],
      initialValue: {
        trigger_mode: "GPS Coords",
        map: "Map 1",
        place: "place",
        tolerance: 5,
        qr_code: "qr_code",
        image: { inputType: "url", filename: "", blob: null },
      },
      name: "ar_type",
    },
  ],
};

const AudioProps = {
  nodeType: "Audio Node",
  fields: [
    {
      type: InputFieldType.textFieldMultiline,
      label: "Nome:",
      initialValue: "Nome do audio",
      name: "name",
    },
    {
      type: InputFieldType.file_select,
      label: "Fundo:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: InputFieldType.color_picker,
      label: "Cor do audio:",
      initialValue: "#000000",
      name: "color",
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
      initialValue: "Texto exemplo",
      name: "text",
    },
    {
      type: InputFieldType.file_select,
      label: "Fundo:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: InputFieldType.checkbox,
      label: "AR enabled? ",
      initialValue: false,
      name: "ar",
    },
    {
      type: InputFieldType.select_location,
      conditional: "ar",
      label: "Modo de acionamento:",
      options: ["GPS Coords", "QR-Code", "Image Tracking"],
      initialValue: {
        trigger_mode: "GPS Coords",
        map: "Map 1",
        place: "place",
        tolerance: 5,
        qr_code: "qr_code",
        image: { inputType: "url", filename: "", blob: null },
      },
      name: "ar_type",
    },
    {
      type: InputFieldType.threeDCoord,
      label: "Posição:",
      conditional: "ar",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "position",
    },
    {
      type: InputFieldType.threeDCoord,
      label: "Escala:",
      conditional: "ar",
      initialValue: { x: 1, y: 1, z: 1 },
      name: "scale",
    },
  ],
};

const PathProps = {
  nodeType: "Path Node",
  fields: [
    {
      type: InputFieldType.textFieldMultiline,
      label: "Texto:",
      initialValue: "Nome do caminho",
      name: "name",
    },
    {
      type: InputFieldType.file_select,
      label: "Fundo:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: InputFieldType.select_location,
      label: "Destino:",
      options: ["GPS Coords", "QR-Code", "Image Tracking"],
      initialValue: {
        trigger_mode: "GPS Coords",
        map: "Map 1",
        place: "place",
        qr_code: "qr_code",
        tolerance: 5,
        image: { inputType: "url", filename: "", blob: null },
      },
      name: "destination",
    },
  ],
};

const DialogProps = {
  nodeType: "Dialog Node",
  fields: [
    {
      type: InputFieldType.multiple_choice,
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: InputFieldType.textFieldMultiline,
      label: "Texto:",
      initialValue: "Texto",
      name: "text",
    },
  ],
};

const DialogChoiceProps = {
  nodeType: "Dialog Choice Node",
  fields: [
    {
      type: InputFieldType.multiple_choice,
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: InputFieldType.textField,
      label: "Pergunta:",
      initialValue: "Texto",
      name: "prompt",
    },
    {
      type: InputFieldType.textFieldExpandable,
      label: "Opções:",
      initialValue: ["Resposta 1", "Resposta 2", "Resposta 3", "Resposta 4"],
      name: "answers",
    },
  ],
};

const EndDialogProps = {
  nodeType: "End Dialog Node",
  fields: [
    {
      type: InputFieldType.textField,
      label: "Identificador:",
      initialValue: "Texto",
      name: "id",
    },
  ],
};

const defaultDialogNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: undefined,
    type: DialogNodeType.beginDialogNode,
  },
  {
    id: "2",
    position: { x: 100, y: 100 },
    data: {
      id: "1",
    },
    type: DialogNodeType.endDialogNode,
  },
];

const defaultDialogEdges = [];

const CharacterProps = {
  nodeType: "Character Node",
  fields: [
    {
      type: InputFieldType.textField,
      label: "Nome:",
      initialValue: "Nome do Diálogo",
      name: "name",
    },
    {
      type: InputFieldType.file_select,
      label: "Fundo:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: InputFieldType.open_window,
      label: "Abrir Janela de Diálogo",
      initialValue: {
        nodes: defaultDialogNodes,
        edges: defaultDialogEdges,
      },
      name: "dialog",
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
  DialogProps,
  DialogChoiceProps,
  EndDialogProps,
};
