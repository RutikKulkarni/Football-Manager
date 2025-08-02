import { NavLink, useLocation } from "react-router-dom";
import { HiHome, HiUsers, HiShoppingCart, HiChartBar } from "react-icons/hi";

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HiHome,
      description: "Overview & Analytics",
    },
    {
      name: "My Squad",
      href: "/my-team",
      icon: HiUsers,
      description: "Team Management",
    },
    {
      name: "Transfer Market",
      href: "/transfer-market",
      icon: HiShoppingCart,
      description: "Buy & Sell Players",
    },
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64 fixed h-full border-r border-gray-200">
        <div className="flex flex-col flex-grow pt-8 pb-4 overflow-hidden">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-6 space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${
                      isActive ? "nav-link-active" : "nav-link-inactive"
                    }`}
                  >
                    <item.icon
                      className={`mr-4 flex-shrink-0 h-5 w-5 ${
                        isActive
                          ? "text-indigo-600"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-sm font-semibold ${
                          isActive
                            ? "text-indigo-700"
                            : "text-gray-700 group-hover:text-gray-900"
                        }`}
                      >
                        {item.name}
                      </p>
                      <p
                        className={`text-xs ${
                          isActive ? "text-indigo-600" : "text-gray-500"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </NavLink>
                );
              })}
            </nav>

            <div className="px-6 py-16 ">
              <div className="flex items-center space-x-3 text-gray-600  border-t border-gray-200">
                <HiChartBar className="h-5 w-5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Season 2025/26
                  </p>
                  <p className="text-xs text-gray-500">Professional League</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
