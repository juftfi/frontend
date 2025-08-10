import { wagmiContracts } from "./config";
import { defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";

export default defineConfig({
    out: "src/generated.ts",
    contracts: wagmiContracts,
    plugins: [react(), actions()],
});
