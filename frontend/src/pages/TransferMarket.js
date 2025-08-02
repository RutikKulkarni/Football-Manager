"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { transferAPI, teamAPI } from "../services/api";
import { formatCurrency, debounce, canBuyPlayer } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";
import PlayerCard from "../components/PlayerCard";
import Modal from "../components/Modal";
import { HiSearch, HiFilter, HiShoppingCart, HiRefresh } from "react-icons/hi";

const TransferMarket = () => {
  const [players, setPlayers] = useState([]);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [buyingPlayer, setBuyingPlayer] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [filters, setFilters] = useState({
    teamName: "",
    playerName: "",
    minPrice: "",
    maxPrice: "",
  });

  const fetchMarketData = async (showRefreshMessage = false) => {
    try {
      if (showRefreshMessage) setRefreshing(true);

      const [marketResponse, teamResponse] = await Promise.all([
        transferAPI.getMarket(filters),
        teamAPI.getTeam(),
      ]);

      setPlayers(marketResponse.data);
      setTeam(teamResponse.data);

      if (showRefreshMessage) {
        toast.success("Market data refreshed");
      }
    } catch (error) {
      toast.error("Failed to load transfer market data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const debouncedFetch = debounce(() => {
    setLoading(true);
    fetchMarketData();
  }, 500);

  useEffect(() => {
    fetchMarketData();
  }, []);

  useEffect(() => {
    if (!loading) {
      debouncedFetch();
    }
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBuyPlayer = (player) => {
    if (!canBuyPlayer(team?.players?.length || 0)) {
      toast.error("Cannot buy player. Team cannot exceed 25 players.");
      return;
    }

    if (team?.budget < player.askingPrice * 0.95) {
      toast.error("Insufficient budget to buy this player.");
      return;
    }

    setSelectedPlayer(player);
    setShowBuyModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPlayer) return;

    setBuyingPlayer(selectedPlayer._id);
    try {
      const response = await transferAPI.buyPlayer(selectedPlayer._id);
      toast.success(
        `Successfully purchased ${selectedPlayer.name} for ${formatCurrency(
          response.data.pricePaid
        )}`
      );
      setShowBuyModal(false);
      setSelectedPlayer(null);
      fetchMarketData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to purchase player");
    } finally {
      setBuyingPlayer(null);
    }
  };

  const clearFilters = () => {
    setFilters({
      teamName: "",
      playerName: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600 font-semibold">
            Loading transfer market...
          </p>
        </div>
      </div>
    );
  }

  const buyPrice = selectedPlayer ? selectedPlayer.askingPrice * 0.95 : 0;

  return (
    <div className="space-y-8 fade-in">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Transfer Market</h1>
            <p className="page-subtitle">
              {players.length} players available for transfer
            </p>
          </div>
          <button
            onClick={() => fetchMarketData(true)}
            disabled={refreshing}
            className="btn-secondary"
          >
            {refreshing ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <HiRefresh className="mr-2" />
            )}
            Refresh Market
          </button>
        </div>
      </div>

      {team && (
        <div className="card bg-gradient-to-r from-indigo-50 to-emerald-50 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-indigo-900 mb-1 text-lg">
                Available Budget
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                {formatCurrency(team.budget)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-indigo-700">
                Squad Size
              </p>
              <p className="text-xl font-bold text-indigo-900">
                {team.players?.length || 0}/25
              </p>
              <p className="text-xs text-indigo-600">players</p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center mb-6">
          <HiFilter className="mr-3 text-gray-600" />
          <h3 className="font-bold text-gray-900 text-lg">Search & Filter</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Player Name
            </label>
            <div className="relative">
              <HiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={filters.playerName}
                onChange={(e) =>
                  handleFilterChange("playerName", e.target.value)
                }
                className="input pl-10"
                placeholder="Search players..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={filters.teamName}
              onChange={(e) => handleFilterChange("teamName", e.target.value)}
              className="input"
              placeholder="Filter by team..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              className="input"
              placeholder="Minimum price..."
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              className="input"
              placeholder="Maximum price..."
              min="0"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={clearFilters} className="btn-ghost text-sm">
            Clear All Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <PlayerCard
            key={player._id}
            player={player}
            showTeam={true}
            actions={
              <button
                onClick={() => handleBuyPlayer(player)}
                disabled={
                  buyingPlayer === player._id ||
                  !canBuyPlayer(team?.players?.length || 0) ||
                  (team?.budget || 0) < player.askingPrice * 0.95
                }
                className="btn-primary text-xs px-4 py-2"
              >
                {buyingPlayer === player._id ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-1" />
                    Processing...
                  </>
                ) : (
                  <>
                    <HiShoppingCart size={14} className="mr-1" />
                    Buy {formatCurrency(player.askingPrice * 0.95)}
                  </>
                )}
              </button>
            }
          />
        ))}
      </div>

      {players.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
            <HiShoppingCart className="text-gray-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Players Available
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or check back later for new transfers.
          </p>
        </div>
      )}

      <Modal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        title="Confirm Transfer"
      >
        {selectedPlayer && (
          <div className="space-y-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-900 text-lg">
                {selectedPlayer.name}
              </h4>
              <p className="text-gray-600">
                {typeof selectedPlayer.teamId === "object"
                  ? selectedPlayer.teamId.name
                  : "Unknown Team"}
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">
                  Asking Price:
                </span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(selectedPlayer.askingPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-semibold">
                  You Pay (95%):
                </span>
                <span className="font-bold text-indigo-600 text-lg">
                  {formatCurrency(buyPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-gray-600 font-semibold">
                  Remaining Budget:
                </span>
                <span className="font-bold text-gray-900">
                  {formatCurrency((team?.budget || 0) - buyPrice)}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowBuyModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={buyingPlayer === selectedPlayer._id}
                className="btn-primary flex-1"
              >
                {buyingPlayer === selectedPlayer._id ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  "Confirm Purchase"
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransferMarket;
