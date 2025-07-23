import { createContext, useContext } from "react";
import { type User } from "better-auth";

export interface IRootContextUser extends Partial<User> {
    jwt: string;
}

interface IRootContext {
    online: boolean;
    user?: IRootContextUser;
    setUser: (user: IRootContextUser | undefined) => void;
    isAndroid: boolean;
}

export const RootContext = createContext<IRootContext>({
    online: false,
    user: undefined,
    setUser: () => {
        throw new Error("setUser function not implemented");
    },
    isAndroid: false,
})

export function useRootContext() {
    const rootContext = useContext(RootContext);
    return rootContext;
}