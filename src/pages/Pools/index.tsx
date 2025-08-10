import PageContainer from "@/components/common/PageContainer";
import PageTitle from "@/components/common/PageTitle";
import PoolsList from "@/components/pools/PoolsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const PoolsPage = () => {
    return (
        <PageContainer>
            <div className="w-full flex-col flex sm:grid grid-cols-4 gap-3 mb-3 justify-between">
                <div className="col-span-3">
                    <PageTitle title={"Pools"} showSettings={false} />
                </div>
                <Link className="col-span-1 w-full" to={"create"}>
                    <Button
                        className="whitespace-nowrap h-16 w-full gap-3 rounded-xl sm:text-lg! hover:bg-accent-100 bg-accent-100 text-black"
                        size={"md"}
                    >
                        Create a Pool
                        <div className="rounded-full p-1 bg-black">
                            <Plus size={20} className="text-white" />
                        </div>
                    </Button>
                </Link>
            </div>

            <div className="w-full">
                <div className="pb-5 bg-card border border-card-border/60 rounded-xl">
                    <PoolsList />
                </div>
            </div>
        </PageContainer>
    );
};

export default PoolsPage;
