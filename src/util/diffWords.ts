import { diffWords as d } from 'diff'
import { promisify } from 'util'

export const diffWords = promisify(d)
