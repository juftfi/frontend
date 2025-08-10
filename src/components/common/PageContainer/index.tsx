interface PageContainerProps {
    children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
    return <div className="flex flex-col items-start py-20 animate-fade-in duration-200">{children}</div>;
};

export default PageContainer;
