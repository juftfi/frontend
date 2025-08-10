import Navigation from "@/components/common/Navigation";
// import AlgebraLogo from "@/assets/clamm-single-logo.svg";
import AlgebraIntegral from "@/assets/clamm-logo.svg";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlignJustify, UnplugIcon, WalletIcon } from "lucide-react";
import Loader from "../Loader";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Address } from "viem";
import { TransactionCard } from "../TransactionCard";
import { useAccount, useChainId } from "wagmi";
import { usePendingTransactions, usePendingTransactionsStore } from "@/state/pendingTransactionsStore";
import { DEFAULT_CHAIN_NAME } from "config";
import { useAppKit, useAppKitNetwork } from "@reown/appkit/react";

const Header = () => (
    <header className="sticky top-0 py-4 z-10 grid grid-cols-3 bg-background h-full max-h-18 justify-between items-center gap-4">
        <Algebra />
        <Navigation />
        <Account />
    </header>
);

const Algebra = () => (
    <div className="flex items-center gap-2">
        <NavLink to={"/"}>
            <div className="flex items-center gap-2 rounded-3xl duration-200">
                {/* <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full">
                    <img src={AlgebraLogo} width={25} height={25} />
                </div> */}
                <img className="hidden md:block" src={AlgebraIntegral} width={140} height={25} />
            </div>
        </NavLink>
    </div>
);

const Account = () => {
    const { open } = useAppKit();

    const appChainId = useChainId();

    const { chainId: userChainId } = useAppKitNetwork();

    const { pendingTransactions } = usePendingTransactionsStore();

    const { address: account } = useAccount();

    const showTxHistory = account && pendingTransactions[account] ? Object.keys(pendingTransactions[account]).length > 0 : false;

    const pendingTxCount =
        account && pendingTransactions[account]
            ? Object.entries(pendingTransactions[account]).filter(([, transaction]) => transaction.loading).length
            : 0;

    if (!userChainId || appChainId !== userChainId)
        return (
            <div className="flex justify-end">
                <Button
                    onClick={() =>
                        open({
                            view: "Networks",
                        })
                    }
                    size={"sm"}
                    variant={"destructive"}
                    className="hidden md:block"
                >{`Connect to ${DEFAULT_CHAIN_NAME}`}</Button>
                <Button
                    onClick={() =>
                        open({
                            view: "Networks",
                        })
                    }
                    size={"icon"}
                    variant={"icon"}
                    className="md:hidden text-red-500"
                >
                    <UnplugIcon />
                </Button>
            </div>
        );

    return (
        <div className="flex h-full justify-end items-center gap-4 whitespace-nowrap">
            <div className="hidden md:block">
                <w3m-button balance={pendingTxCount > 0 ? "hide" : "show"} />
            </div>
            <div className="md:hidden">
                <Button onClick={() => open()} variant={"icon"} size={"icon"}>
                    <WalletIcon />
                </Button>
            </div>
            {showTxHistory && (
                <TransactionHistoryPopover>
                    {pendingTxCount > 0 ? (
                        <Button
                            className="flex font-normal items-center my-auto h-10 px-3 justify-center gap-2 cursor-pointer hover:bg-primary-button/80 border border-card bg-primary-button rounded-3xl transition-all duration-200"
                            aria-label="Transaction history"
                        >
                            <Loader />
                            <span>{pendingTxCount}</span>
                            <span>Pending</span>
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            className="flex font-normal items-center my-auto h-10 px-3 justify-center gap-2 cursor-pointerrounded-3xl transition-all duration-200"
                            aria-label="Transaction history"
                        >
                            <AlignJustify size={20} />
                        </Button>
                    )}
                </TransactionHistoryPopover>
            )}
        </div>
    );
};

const TransactionHistoryPopover = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const pendingTransactions = usePendingTransactions();
    const { address: account } = useAccount();

    if (account)
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger>{children}</PopoverTrigger>
                <PopoverContent
                    className="w-fit max-h-80 flex flex-col gap-4 -translate-x-28 translate-y-2 max-xl:-translate-x-8 max-xs:-translate-x-4"
                    sideOffset={6}
                >
                    Transaction History
                    <hr />
                    <ul className="flex flex-col gap-3 w-64 overflow-auto ">
                        {Object.entries(pendingTransactions[account])
                            .reverse()
                            .map(([hash, transaction]) => (
                                <TransactionCard key={hash} hash={hash as Address} transaction={transaction} />
                            ))}
                    </ul>
                </PopoverContent>
            </Popover>
        );
};

export default Header;
