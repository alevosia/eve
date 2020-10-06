import { AkairoClient } from 'discord-akairo'
import { Message } from 'discord.js'

export enum CNodeType {
    INPUT,
    CHOICE,
    READ
}

export interface Choice {
    id: string
    text: string
    nextNodeId: string
}

export interface Choices {
    [id: string]: Choice
}

export interface CNode<State> {
    id: string
    title: string
    text: string
    imageUrl?: string
    type: CNodeType
    choices?: Choices
    stateKey?: keyof State
    nextNodeId?: string
}

export interface CNodes<State> {
    start: CNode<State>
    [id: string]: CNode<State>
}

export interface NodeHandlerParams {
    client: AkairoClient
    node: CNode<MyState>
    message: Message
}

export type NodeHandler = (params: NodeHandlerParams) => Promise<string | void | null>

// provide your own shape of state
export interface Campaign<State> {
    id: string
    name: string
    description: string
    nodes: CNodes<State>
    state: State
}

export type MyState = {
    name: string
    health: number
    gold: number
    exp: number
    level: number
}
