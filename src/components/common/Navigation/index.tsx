import { enabledModules } from "config/app-modules";
import { ArrowUpRight } from "lucide-react";
import { Link, NavLink, matchPath, useLocation } from "react-router-dom";

const PATHS = {
    SWAP: "/swap",
    LIMIT_ORDERS: "limit-order",
    POOLS: "/pools",
    POOL: "/pool",
    ANALYTICS: "/analytics",
};

const menuItems = [
    {
        title: "Swap",
        link: "/swap",
        active: [PATHS.SWAP, PATHS.LIMIT_ORDERS],
    },
    {
        title: "Pools",
        link: "/pools",
        active: [PATHS.POOLS, PATHS.POOL],
    },
    enabledModules.analytics && {
        title: "Analytics",
        link: "/analytics",
        active: [PATHS.ANALYTICS],
    },
].filter(Boolean) as { title: string; link: string; active: string[] }[];

const Navigation = () => {
    const { pathname } = useLocation();

    const setNavlinkClasses = (paths: string[]) =>
        paths.some((path) => matchPath(path, pathname))
            ? "border-b border-muted-primary"
            : "border-b border-transparent hover:border-card-hover";

    return (
        <nav>
            <ul className="flex justify-center gap-2 rounded-full whitespace-nowrap">
                {menuItems.map((item) => (
                    <NavLink
                        key={`nav-item-${item.link}`}
                        to={item.link}
                        className={`${setNavlinkClasses(item.active)} py-2 px-4 font-semibold select-none duration-200`}
                    >
                        {item.title}
                    </NavLink>
                ))}
                <Link
                    to="https://docs.algebra.finance/"
                    target="_blank"
                    className="flex items-center py-2 px-4 gap-2 font-semibold max-sm:hidden select-none duration-200 border-b border-transparent hover:opacity-60"
                >
                    Docs <ArrowUpRight size={16} />
                </Link>
            </ul>
        </nav>
    );
};

export default Navigation;
