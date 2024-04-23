import { AudioProps, CharacterProps, EndDialogProps, ImageProps, PathProps, QuizProps, TextProps, ThreeDModelProps, VideoProps } from "../flowchart/nodes/nodeProps";
import { NodeType } from "./NodeTypes";

export const possibleNodes =[
    {
        name: 'Quiz',
        type: NodeType.quizNode,
        props: QuizProps,
        image: 'quiz_node.png',
    },
    {
        name: 'Fim',
        type: NodeType.endNode,
        props: EndDialogProps,
        image : 'end_dialog_node.svg'
    },
    {
        name: 'Video',
        type: NodeType.videoNode,
        props: VideoProps,
        image: 'video_node.png',
    },
    {
        name: 'Audio',
        type: NodeType.audioNode,
        props: AudioProps,
        image: 'audio_node.png',
    },
    {
        name: 'Image',
        type: NodeType.imageNode,
        props: ImageProps,
        image: 'image_node.png',
    },
    {
        name: 'Text',
        type: NodeType.textNode,
        props: TextProps,
        image: 'text_node.png',
    },
    {
        name: '3D Model',
        type: NodeType.threeDModelNode,
        props: ThreeDModelProps,
        image: 'three_d_model_node.png',
    },
    {
        name: 'Path',
        type: NodeType.pathNode,
        props: PathProps,
        image: 'path_node.png',

    },
    {
        name: 'Character Dialogue',
        type: NodeType.characterNode,
        props: CharacterProps,
        image: 'character_dialogue_node.png'
    }


]