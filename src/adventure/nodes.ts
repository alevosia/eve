import { CNodes, MyState, CNodeType } from '../types'

const { CHOICE, READ } = CNodeType

export const nodes: CNodes<MyState> = {
    start: {
        id: 'start',
        type: READ,
        title: 'The Beginning',
        text: "Ah, here you are. Let's start!",
        nextNodeId: 'node_2'
    },
    node_2: {
        id: 'node_2',
        type: CHOICE,
        title: 'The Path Forward',
        text: 'You wake up feeling fresh. Where do you want to go?',
        choices: {
            choice_1: {
                id: 'choice_1',
                text: 'The Farm',
                nextNodeId: 'node_3'
            },
            choice_2: {
                id: 'choice_2',
                text: 'The Market',
                nextNodeId: 'node_10'
            }
        }
    },
    node_3: {
        id: 'node_3',
        type: READ,
        title: 'The Farm',
        text:
            'Welcome to the farm. This is where you work your ass off ' +
            'and earn as little as you can.',
        nextNodeId: 'node_4'
    },
    node_4: {
        id: 'node_4',
        type: CHOICE,
        title: 'The Farm',
        text: 'Your little sister, Zoe, comes to see you.',
        choices: {
            choice_3: {
                id: 'choice_3',
                text: 'Greet her.',
                nextNodeId: 'node_5'
            },
            choice_4: {
                id: 'choice_4',
                text: 'Ignore her.',
                nextNodeId: 'node_7'
            },
            choice_5: {
                id: 'choice_5',
                text: 'Hide in the haystack.',
                nextNodeId: 'node_9'
            }
        }
    },
    node_5: {
        id: 'node_5',
        type: READ,
        title: 'The Farm',
        imageUrl: 'https://qph.fs.quoracdn.net/main-qimg-1ef3e4da76d8b00141598f800d24b5d6.webp',
        text: 'Zoe: Hola. Mom is calling for you.',
        nextNodeId: 'node_6'
    },
    node_6: {
        id: 'node_6',
        type: READ,
        title: 'The Farm',
        text: 'Mom: You dummy. *knifes you',
        imageUrl:
            'https://pm1.narvii.com/7109/7a26e2718dada0487255eb2af10ef53698e6fa9ar1-749-1068v2_hq.jpg'
    },
    node_7: {
        id: 'node_7',
        type: READ,
        title: 'The Farm',
        text: 'Zoe is confused but she is determined to talk to you so she runs towards you.',
        nextNodeId: 'node_8'
    },
    node_8: {
        id: 'node_8',
        type: READ,
        title: 'The Farm',
        imageUrl: 'https://qph.fs.quoracdn.net/main-qimg-1ef3e4da76d8b00141598f800d24b5d6.webp',
        text: 'Zoe: Phew! Why did you ignore me? Mom wants to see you.',
        nextNodeId: 'node_6'
    },
    node_9: {
        id: 'node_9',
        type: READ,
        title: 'The Haystack',
        text:
            'As you jump into the haystack, you hear a loud engine ' +
            'turned on and it ground you to bits and pieces.'
    }
}
