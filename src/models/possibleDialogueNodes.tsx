import { DialogChoiceProps, DialogProps, EndDialogProps } from "../flowchart/nodes/nodeProps";
import { DialogNodeType } from "./DialogNodeTypes";

export const possibleDialogueNodes = [
    {
        name: 'Diálogo',
        type: DialogNodeType.dialogNode,
        props: DialogProps,
        image: 'dialog_bubble.svg'
    },
    {
        name: 'Pergunta',
        type: DialogNodeType.dialogChoiceNode,
        props: DialogChoiceProps,
        image: 'quiz_node.png'
    },
    {
        name: 'Fim',
        type: DialogNodeType.endDialogNode,
        props: EndDialogProps,
        image: 'end_dialog_node.svg'
    }
]