import {
  formatCurrency,
  formatPosition,
  getPositionColor,
} from "../utils/helpers";
import { HiCurrencyDollar, HiTrendingUp } from "react-icons/hi";

const PlayerCard = ({ player, actions, showTeam = false }) => {
  return (
    <div className="card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600">
                  {player.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {player.name}
                </h3>
                <span className={`badge ${getPositionColor(player.position)}`}>
                  {formatPosition(player.position)}
                </span>
              </div>
            </div>
          </div>

          {showTeam && player.teamId && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Team:</span>{" "}
                {typeof player.teamId === "object"
                  ? player.teamId.name
                  : "Unknown Team"}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <HiTrendingUp size={16} className="mr-2" />
                <span className="text-sm font-semibold">Market Value</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(player.value)}
              </span>
            </div>

            {player.isOnTransferList && player.askingPrice && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center text-emerald-700">
                  <HiCurrencyDollar size={16} className="mr-2" />
                  <span className="text-sm font-semibold">Asking Price</span>
                </div>
                <span className="text-sm font-bold text-emerald-800">
                  {formatCurrency(player.askingPrice)}
                </span>
              </div>
            )}
          </div>

          {player.isOnTransferList && (
            <div className="mt-4">
              <span className="badge badge-success">
                Available for Transfer
              </span>
            </div>
          )}
        </div>

        {actions && (
          <div className="ml-4 flex flex-col space-y-2">{actions}</div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
