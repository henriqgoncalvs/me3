import * as trpc from "@trpc/server";
import { createContext } from "./context";

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();