import PageContainer from "@/components/common/PageContainer";
import PageTitle from "@/components/common/PageTitle";
import PoweredByAlgebra from "@/components/common/PoweredByAlgebra";
import CreatePoolForm from "@/components/create-pool/CreatePoolForm";

const CreatePoolPage = () => {
    return (
        <PageContainer>
            <div className="w-full flex justify-between">
                <PageTitle title={"Create Pool"} showSettings={false} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-3 w-full lg:gap-8">
                <div className="col-span-1 flex flex-col gap-2">
                    <CreatePoolForm />
                    <PoweredByAlgebra className="mt-2" />
                </div>
            </div>
        </PageContainer>
    );
};

export default CreatePoolPage;
