import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

export function SwapTypeSelector({ isLimitOrder }: { isLimitOrder: boolean }) {
    return (
        <div className="grid grid-cols-2 h-full col-span-1 max-h-16 p-2 bg-card rounded-xl gap-2">
            <NavLink className="w-full h-full" to="/swap">
                <Button
                    size={"sm"}
                    variant={isLimitOrder ? "ghost" : "ghostActive"}
                    className="flex items-center justify-center gap-2 w-full rounded-lg h-12"
                >
                    Swap
                </Button>
            </NavLink>
            <NavLink className={"w-full h-full"} to="/limit-order">
                <Button
                    size={"sm"}
                    variant={isLimitOrder ? "ghostActive" : "ghost"}
                    className="flex items-center justify-center gap-2 w-full rounded-lg h-12"
                >
                    Limit
                </Button>
            </NavLink>
        </div>
    );
}
