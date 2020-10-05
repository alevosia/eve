import { Campaign, MyState } from '../types'
import { nodes } from './nodes'

export const campaign: Campaign<MyState> = {
    id: 'campaign_1',
    name: 'The Family',
    description: 'You live a surreal rural life.',
    state: {
        name: '',
        level: 1,
        health: 10,
        exp: 0,
        gold: 0
    },
    nodes: nodes
}
