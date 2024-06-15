import { narrator } from "../../data/narrator";
import { DialogNodeType } from "../../models/DialogNodeTypes";
import { FileTypesInput } from "../../models/FileTypesInput";
import { InputFieldType } from "../../models/InputFieldTypes";
import { NodeType } from "../../models/NodeTypes";
import { ThreeDModelTypes } from "../../models/ThreeDModelTypes";

const ThreeDModelProps = {
  nodeType: "Cena 3D",
  fields: [
    {
      type: [InputFieldType.hidden],
      label: "",
      initialValue: "Cena ",
      name: "sceneName",
    },
    {
      type: [InputFieldType.multiple_choice],
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: [InputFieldType.textFieldMultiline],
      label: "Texto:",
      icon: "description",
      initialValue: "Modelo 3D",
      name: "name",
    },
    {
      type: [InputFieldType.file_select, InputFieldType.color_picker],
      label: "Fundo:",
      icon: "landscape",
      initialValue: {
        inputType: "url",
        filename: "",
        blob: null,
        color: "#A9B388",
      },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: [InputFieldType.file_select],
      label: "Ficheiro:",
      icon: "view_in_ar",
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
      type: [InputFieldType.threeDCoord],
      label: "Posição:",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "position",
    },
    {
      type: [InputFieldType.threeDCoord],
      label: "Escala:",
      initialValue: { x: 1, y: 1, z: 1 },
      name: "scale",
    },
    {
      type: [InputFieldType.threeDCoord],
      label: "Rotação:",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "rotation",
    },
    {
      type: [InputFieldType.checkbox],
      label: "Auto-play animações",
      initialValue: false,
      name: "autoplay",
    },
    {
      type: [InputFieldType.checkbox],
      label: "Permitir AR? ",
      initialValue: false,
      name: "ar",
    },
    {
      type: [InputFieldType.select_location],
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
        marker_generation: { qr_code: "Not Started", image: "Not Started" },
      },
      name: "ar_type",
    },
  ],
};

const QuizProps = {
  nodeType: "Cena Quiz",
  fields: [
    {
      type: [InputFieldType.hidden],
      label: "",
      initialValue: "Cena ",
      name: "sceneName",
    },
    {
      type: [InputFieldType.multiple_choice],
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: [InputFieldType.textFieldMultiline],
      label: "Pergunta:",
      icon: "description",
      initialValue: "Pergunta",
      name: "question",
    },
    {
      type: [InputFieldType.file_select, InputFieldType.color_picker],
      label: "Fundo:",
      icon: "landscape",
      initialValue: {
        inputType: "url",
        filename: "",
        blob: null,
        color: "#A9B388",
      },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: [InputFieldType.textFieldExpandable],
      label: "Respostas:",
      initialValue: ["Resposta 1", "Resposta 2", "Resposta 3", "Resposta 4"],
      name: "answers",
    },
  ],
};

const VideoProps = {
  nodeType: "Cena Vídeo",
  fields: [
    {
      type: [InputFieldType.hidden],
      label: "",
      initialValue: "Cena ",
      name: "sceneName",
    },
    {
      type: [InputFieldType.multiple_choice],
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: [InputFieldType.textFieldMultiline],
      label: "Texto:",
      icon: "description",
      initialValue: "Nome do video",
      name: "name",
    },
    {
      type: [InputFieldType.file_select, InputFieldType.color_picker],
      label: "Fundo:",
      icon: "landscape",
      initialValue: {
        inputType: "url",
        filename: "",
        blob: null,
        color: "#A9B388",
      },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: [InputFieldType.file_select],
      label: "Ficheiro:",
      icon: "videocam",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "file",
      acceptedType: FileTypesInput.Video,
    },
    {
      type: [InputFieldType.checkbox],
      label: "Permitir AR? ",
      initialValue: false,
      name: "ar",
    },
    {
      type: [InputFieldType.threeDCoord],
      label: "Posição:",
      conditional: "ar",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "position",
    },
    {
      type: [InputFieldType.threeDCoord],
      label: "Escala:",
      conditional: "ar",
      initialValue: { x: 1, y: 1, z: 1 },
      name: "scale",
    },
    {
      type: [InputFieldType.select_location],
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
        marker_generation: { qr_code: "Not Started", image: "Not Started" },
      },
      name: "ar_type",
    },
  ],
};

const ImageProps = {
  nodeType: "Cena Imagem",
  fields: [
    {
      type: [InputFieldType.hidden],
      label: "",
      initialValue: "Cena ",
      name: "sceneName",
    },
    {
      type: [InputFieldType.multiple_choice],
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: [InputFieldType.textFieldMultiline],
      label: "Texto:",
      icon: "description",
      initialValue: "Imagem",
      name: "name",
    },
    {
      type: [InputFieldType.file_select, InputFieldType.color_picker],
      label: "Fundo:",
      icon: "landscape",
      initialValue: {
        inputType: "url",
        filename: "",
        blob: null,
        color: "#A9B388",
      },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: [InputFieldType.file_select],
      label: "Ficheiro:",
      icon: "add_photo_alternate",
      initialValue: { inputType: "file", filename: "", blob: null },
      name: "file",
      acceptedType: FileTypesInput.Image,
    },

    {
      type: [InputFieldType.checkbox],
      label: "Permitir AR? ",
      initialValue: false,
      name: "ar",
    },
    {
      type: [InputFieldType.threeDCoord],
      label: "Posição:",
      conditional: "ar",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "position",
    },
    {
      type: [InputFieldType.threeDCoord],
      label: "Escala:",
      conditional: "ar",
      initialValue: { x: 1, y: 1, z: 1 },
      name: "scale",
    },
    {
      type: [InputFieldType.select_location],
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
        marker_generation: { qr_code: "Not Started", image: "Not Started" },
      },
      name: "ar_type",
    },
  ],
};

const AudioProps = {
  nodeType: "Cena Áudio",
  fields: [
    {
      type: [InputFieldType.hidden],
      label: "",
      initialValue: "Cena ",
      name: "sceneName",
    },
    {
      type: [InputFieldType.multiple_choice],
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: [InputFieldType.textFieldMultiline],
      label: "Texto:",
      icon: "description",
      initialValue: "Texto exemplo",
      name: "name",
    },
    {
      type: [InputFieldType.file_select, InputFieldType.color_picker],
      label: "Fundo:",
      icon: "landscape",
      initialValue: {
        inputType: "url",
        filename: "",
        blob: null,
        color: "#A9B388",
      },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: [InputFieldType.color_picker],
      label: "Cor do audio:",
      initialValue: { color: "#A9B388", inputType: "color" },
      name: "color",
    },

    {
      type: [InputFieldType.file_select],
      label: "Ficheiro:",
      icon: "volume_up",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "file",
      acceptedType: FileTypesInput.Audio,
    },
  ],
};

const TextProps = {
  nodeType: "Cena Texto",
  fields: [
    {
      type: [InputFieldType.hidden],
      label: "",
      initialValue: "Cena ",
      name: "sceneName",
    },
    {
      type: [InputFieldType.multiple_choice],
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: [InputFieldType.textFieldMultiline],
      label: "Texto:",
      initialValue: "Texto exemplo",
      icon: "description",
      name: "text",
    },
    {
      type: [InputFieldType.file_select, InputFieldType.color_picker],
      label: "Fundo:",
      icon: "landscape",
      initialValue: {
        inputType: "url",
        filename: "",
        blob: null,
        color: "#A9B388",
      },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: [InputFieldType.checkbox],
      label: "Permitir AR? ",
      initialValue: false,
      name: "ar",
    },
    {
      type: [InputFieldType.select_location],
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
        marker_generation: { qr_code: "Not Started", image: "Not Started" },
      },
      name: "ar_type",
    },
    {
      type: [InputFieldType.threeDCoord],
      label: "Posição:",
      conditional: "ar",
      initialValue: { x: 0, y: 0, z: 0 },
      name: "position",
    },
    {
      type: [InputFieldType.threeDCoord],
      label: "Escala:",
      conditional: "ar",
      initialValue: { x: 1, y: 1, z: 1 },
      name: "scale",
    },
  ],
};

const PathProps = {
  nodeType: "Caminho",
  fields: [
    {
      type: [InputFieldType.hidden],
      label: "",
      initialValue: "Cena ",
      name: "sceneName",
    },
    {
      type: [InputFieldType.multiple_choice],
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: [InputFieldType.textFieldMultiline],
      label: "Texto:",
      initialValue: "Texto do caminho",
      icon: "description",
      name: "name",
    },
    {
      type: [InputFieldType.file_select, InputFieldType.color_picker],
      label: "Fundo:",
      icon: "landscape",
      initialValue: {
        inputType: "url",
        filename: "",
        blob: null,
        color: "#A9B388",
      },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: [InputFieldType.select_location],
      label: "Destino:",
      options: ["GPS Coords"],
      initialValue: {
        trigger_mode: "GPS Coords",
        map: "Map 1",
        place: "place",
        qr_code: "qr_code",
        tolerance: 5,
        image: { inputType: "url", filename: "", blob: null },
        marker_generation: { qr_code: "Not Started", image: "Not Started" },
      },
      name: "destination",
    },
  ],
};

const DialogProps = {
  nodeType: "Diálogo",
  fields: [
    {
      type: [InputFieldType.multiple_choice],
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: [InputFieldType.textFieldMultiline],
      label: "Texto:",
      initialValue: "Texto",
      name: "text",
    },
    {
      type: [InputFieldType.file_select],
      label: "Áudio:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "audio",
      acceptedType: FileTypesInput.Audio,
    },
  ],
};

const DialogChoiceProps = {
  nodeType: "Pergunta",
  fields: [
    {
      type: [InputFieldType.multiple_choice],
      label: "Personagem:",
      initialValue: narrator,
      name: "character",
    },
    {
      type: [InputFieldType.textFieldMultiline],
      label: "Pergunta:",
      initialValue: "Texto",
      name: "prompt",
    },
    {
      type: [InputFieldType.textFieldExpandable],
      label: "Opções:",
      initialValue: ["Resposta 1", "Resposta 2", "Resposta 3", "Resposta 4"],
      name: "answers",
    },
    {
      type: [InputFieldType.file_select],
      label: "Áudio:",
      initialValue: { inputType: "url", filename: "", blob: null },
      name: "audio",
      acceptedType: FileTypesInput.Audio,
    },
  ],
};

const EndDialogProps = {
  nodeType: "Fim",
  fields: [
    {
      type: [InputFieldType.textField],
      label: "Identificador:",
      initialValue: "Normal",
      name: "id",
    },
  ],
};

const defaultDialogNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: narrator,
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
  nodeType: "Cena Diálogo",
  fields: [
    {
      type: [InputFieldType.hidden],
      label: "",
      initialValue: "Cena ",
      name: "sceneName",
    },
    {
      type: [InputFieldType.textFieldMultiline],
      label: "Nome:",
      icon: "description",
      initialValue: "Nome do Diálogo",
      name: "name",
    },
    {
      type: [InputFieldType.file_select, InputFieldType.color_picker],
      label: "Fundo:",
      icon: "landscape",
      initialValue: {
        inputType: "url",
        filename: "",
        blob: null,
        color: "#A9B388",
      },
      name: "background",
      acceptedType: FileTypesInput.Image,
    },
    {
      type: [InputFieldType.open_window],
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
