import { formatCurrency, groupPlayersByPosition } from "../utils/helpers";
import {
  HiUsers,
  HiCurrencyDollar,
  HiTrendingUp,
  HiShoppingCart,
} from "react-icons/hi";

const TeamStats = ({ team, players }) => {
  const playersByPosition = groupPlayersByPosition(players);
  const totalValue = players.reduce((sum, player) => sum + player.value, 0);
  const playersOnMarket = players.filter((p) => p.isOnTransferList).length;

  const stats = [
    {
      name: "Team Budget",
      value: formatCurrency(team?.budget || 0),
      icon: HiCurrencyDollar,
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-900",
    },
    {
      name: "Squad Size",
      value: players.length,
      subtitle: "Players",
      icon: HiUsers,
      color: "indigo",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      textColor: "text-indigo-900",
    },
    {
      name: "Total Value",
      value: formatCurrency(totalValue),
      icon: HiTrendingUp,
      color: "amber",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      textColor: "text-amber-900",
    },
    {
      name: "On Market",
      value: playersOnMarket,
      subtitle: "Listed",
      icon: HiShoppingCart,
      color: "red",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      textColor: "text-red-900",
    },
  ];

  const positionCounts = {
    Goalkeeper: playersByPosition["Goalkeeper"]?.length || 0,
    Defender: playersByPosition["Defender"]?.length || 0,
    Midfielder: playersByPosition["Midfielder"]?.length || 0,
    Attacker: playersByPosition["Attacker"]?.length || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="stat-card">
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-semibold text-gray-600">{stat.name}</p>
              <div className="flex items-baseline">
                <p className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className="ml-2 text-sm text-gray-500">{stat.subtitle}</p>
                )}
              </div>
              {stat.name === "Squad Size" && (
                <div className="mt-1 text-xs text-gray-500">
                  GK: {positionCounts.Goalkeeper} • DEF:{" "}
                  {positionCounts.Defender} • MID: {positionCounts.Midfielder} •
                  ATT: {positionCounts.Attacker}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamStats;
