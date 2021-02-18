import * as dotenv from "dotenv";
import { resolve as resolvePath } from "path";

let typeEnv = "../.env";
switch (process.env.NODE_ENV) {
  case "dev":
    typeEnv = ".env.dev";
    break;

  default:
    typeEnv = ".env.dev";
    break;
}
dotenv.config({ path: resolvePath(process.cwd(), typeEnv) });
