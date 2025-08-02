"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { teamAPI, transferAPI } from "../services/api";
import {
  formatCurrency,
  groupPlayersByPosition,
  canSellPlayer,
} from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";
import PlayerCard from "../components/PlayerCard";
import TeamStats from "../components/TeamStats";
import Modal from "../components/Modal";
import { HiPlus, HiMinus, HiCurrencyDollar, HiFilter } from "react-icons/hi";

const MyTeam = () => {
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [askingPrice, setAskingPrice] = useState("");
  const [processingTransfer, setProcessingTransfer] = useState(false);

  const fetchTeamData = async () => {
    try {
      const [teamResponse, playersResponse] = await Promise.all([
        teamAPI.getTeam(),
        teamAPI.getPlayers(),
      ]);

      setTeam(teamResponse.data);
      setPlayers(playersResponse.data);
    } catch (error) {
      toast.error("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleAddToTransferList = (player) => {
    if (!canSellPlayer(players.length)) {
      toast.error("Cannot sell player. Team must have at least 15 players.");
      return;
    }

    setSelectedPlayer(player);
    setAskingPrice(player.value.toString());
    setShowTransferModal(true);
  };

  const handleRemoveFromTransferList = async (player) => {
    setProcessingTransfer(true);
    try {
      await transferAPI.removeFromTransferList(player._id);
      toast.success(`${player.name} removed from transfer list`);
      fetchTeamData();
    } catch (error) {
      toast.error("Failed to remove player from transfer list");
    } finally {
      setProcessingTransfer(false);
    }
  };

  const handleConfirmTransfer = async () => {
    if (!selectedPlayer || !askingPrice) return;

    const price = Number.parseInt(askingPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid asking price");
      return;
    }

    setProcessingTransfer(true);
    try {
      await transferAPI.addToTransferList(selectedPlayer._id, price);
      toast.success(
        `${selectedPlayer.name} added to transfer list for ${formatCurrency(
          price
        )}`
      );
      setShowTransferModal(false);
      setSelectedPlayer(null);
      setAskingPrice("");
      fetchTeamData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add player to transfer list"
      );
    } finally {
      setProcessingTransfer(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600 font-semibold">
            Loading your squad...
          </p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Team Not Found
        </h2>
        <p className="text-gray-600">
          Your team might still be being created. Please check back in a few
          moments.
        </p>
      </div>
    );
  }

  const playersByPosition = groupPlayersByPosition(players);
  const positions = ["All", "Goalkeeper", "Defender", "Midfielder", "Attacker"];

  const filteredPlayers =
    selectedPosition === "All"
      ? players
      : players.filter((player) => player.position === selectedPosition);

  return (
    <div className="space-y-8 fade-in">
      <div className="page-header">
        <h1 className="page-title">Squad Management</h1>
        <p className="page-subtitle">
          Manage your squad of {players.length} professional players
        </p>
      </div>

      <TeamStats team={team} players={players} />

      <div className="card">
        <div className="flex items-center mb-6">
          <HiFilter className="mr-3 text-gray-600" />
          <h3 className="font-bold text-gray-900 text-lg">
            Filter by Position
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {positions.map((position) => (
            <button
              key={position}
              onClick={() => setSelectedPosition(position)}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                selectedPosition === position
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {position}
              {position !== "All" && playersByPosition[position] && (
                <span className="ml-2 text-xs opacity-75">
                  ({playersByPosition[position].length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player._id}
            player={player}
            actions={
              <div className="space-y-2">
                {player.isOnTransferList ? (
                  <button
                    onClick={() => handleRemoveFromTransferList(player)}
                    disabled={processingTransfer}
                    className="btn-danger text-xs px-4 py-2"
                  >
                    <HiMinus size={14} className="mr-1" />
                    Remove from Market
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddToTransferList(player)}
                    disabled={
                      !canSellPlayer(players.length) || processingTransfer
                    }
                    className="btn-success text-xs px-4 py-2"
                  >
                    <HiPlus size={14} className="mr-1" />
                    List for Transfer
                  </button>
                )}
              </div>
            }
          />
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500">
            No players found for the selected position.
          </p>
        </div>
      )}

      <Modal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        title="List Player for Transfer"
      >
        {selectedPlayer && (
          <div className="space-y-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <h4 className="font-bold text-gray-900 text-lg">
                {selectedPlayer.name}
              </h4>
              <p className="text-gray-600">
                Current Market Value: {formatCurrency(selectedPlayer.value)}
              </p>
            </div>

            <div>
              <label
                htmlFor="askingPrice"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Asking Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiCurrencyDollar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="askingPrice"
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  className="input pl-10"
                  placeholder="Enter asking price"
                  min="1"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Buyers will pay 95% of this amount (
                {formatCurrency(Number.parseInt(askingPrice) * 0.95 || 0)})
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowTransferModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTransfer}
                disabled={processingTransfer || !askingPrice}
                className="btn-primary flex-1"
              >
                {processingTransfer ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Listing...
                  </>
                ) : (
                  "List for Transfer"
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyTeam;
