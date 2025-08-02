"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { teamAPI } from "../services/api";
import { formatCurrency, groupPlayersByPosition } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";
import TeamStats from "../components/TeamStats";
import {
  HiRefresh,
  HiUsers,
  HiCurrencyDollar,
  HiClock,
  HiChartBar,
} from "react-icons/hi";

const Dashboard = () => {
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTeamData = async (showRefreshMessage = false) => {
    try {
      if (showRefreshMessage) setRefreshing(true);

      const [teamResponse, playersResponse] = await Promise.all([
        teamAPI.getTeam(),
        teamAPI.getPlayers(),
      ]);

      setTeam(teamResponse.data);
      setPlayers(playersResponse.data);

      if (showRefreshMessage) {
        toast.success("Team data refreshed successfully");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setTeam(null);
        setPlayers([]);
      } else {
        toast.error("Failed to load team data");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  const handleRefresh = () => {
    fetchTeamData(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600 font-semibold">
            Loading your team...
          </p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
          <HiClock className="text-gray-600" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Team Setup in Progress
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We're assembling your professional squad with 20 talented players and
          a $5M budget. This process may take a few moments.
        </p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-primary"
        >
          {refreshing ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Checking Status...
            </>
          ) : (
            <>
              <HiRefresh className="mr-2" />
              Check Status
            </>
          )}
        </button>
      </div>
    );
  }

  const playersByPosition = groupPlayersByPosition(players);
  const totalValue = players.reduce((sum, player) => sum + player.value, 0);

  const quickActions = [
    {
      name: "Squad Management",
      description: "View and manage your players",
      href: "/my-team",
      icon: HiUsers,
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      name: "Transfer Market",
      description: "Buy and sell players",
      href: "/transfer-market",
      icon: HiCurrencyDollar,
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      name: "Team Analytics",
      description: "Performance insights",
      href: "#",
      icon: HiChartBar,
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Team Dashboard</h1>
            <p className="page-subtitle">
              Welcome back, {user?.email?.split("@")[0]}! Here's your team
              overview.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary"
          >
            {refreshing ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <HiRefresh className="mr-2" />
            )}
            Refresh Data
          </button>
        </div>
      </div>

      <TeamStats team={team} players={players} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Team Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-semibold">Team Name</span>
                  <span className="font-bold text-gray-900">{team.name}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-semibold">
                    Available Budget
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(team.budget)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600 font-semibold">
                    Squad Size
                  </span>
                  <span className="font-bold text-gray-900">
                    {players.length} players
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-semibold">
                    Total Squad Value
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(totalValue)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-semibold">
                    Players Listed
                  </span>
                  <span className="font-bold text-gray-900">
                    {players.filter((p) => p.isOnTransferList).length}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-gray-600 font-semibold">Season</span>
                  <span className="font-bold text-gray-900">2024/25</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Squad Composition
          </h3>
          <div className="space-y-4">
            {Object.entries(playersByPosition).map(
              ([position, positionPlayers]) => (
                <div
                  key={position}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <span className="font-semibold text-gray-900">
                      {position}s
                    </span>
                    <p className="text-xs text-gray-500">
                      {positionPlayers.length} players
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">
                      {formatCurrency(
                        positionPlayers.reduce((sum, p) => sum + p.value, 0)
                      )}
                    </span>
                    <p className="text-xs text-gray-500">Total Value</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className={`flex items-center p-6 ${action.bgColor} rounded-xl hover:shadow-md transition-all duration-200 group`}
            >
              <div
                className={`w-12 h-12 ${action.bgColor} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200`}
              >
                <action.icon className={`${action.iconColor} h-6 w-6`} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{action.name}</h4>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
