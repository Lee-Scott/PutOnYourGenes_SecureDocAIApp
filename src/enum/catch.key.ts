export const Key = {
    LOGGEDIN: '[KEY] LOGGEDIN',
    ROLE: '[KEY] ROLE'
} as const;

export type Key = typeof Key[keyof typeof Key];