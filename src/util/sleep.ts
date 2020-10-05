export const sleep = (ms: number): Promise<number> =>
    new Promise((resolve) => setTimeout(() => resolve(ms), ms))
