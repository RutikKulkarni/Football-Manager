// Format currency
export const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount.toLocaleString()}`
}

// Format player position
export const formatPosition = (position) => {
  const positions = {
    Goalkeeper: "GK",
    Defender: "DEF",
    Midfielder: "MID",
    Attacker: "ATT",
  }
  return positions[position] || position
}

// Get position color class
export const getPositionColor = (position) => {
  const colors = {
    Goalkeeper: "position-gk",
    Defender: "position-def",
    Midfielder: "position-mid",
    Attacker: "position-att",
  }
  return colors[position] || "badge-primary"
}

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Calculate team value
export const calculateTeamValue = (players) => {
  return players.reduce((total, player) => total + (player.value || 0), 0)
}

// Group players by position
export const groupPlayersByPosition = (players) => {
  return players.reduce((groups, player) => {
    const position = player.position
    if (!groups[position]) {
      groups[position] = []
    }
    groups[position].push(player)
    return groups
  }, {})
}

// Sort players by value
export const sortPlayersByValue = (players, ascending = false) => {
  return [...players].sort((a, b) => {
    return ascending ? a.value - b.value : b.value - a.value
  })
}

// Check if team can sell player (minimum 15 players)
export const canSellPlayer = (totalPlayers) => {
  return totalPlayers > 15
}

// Check if team can buy player (maximum 25 players)
export const canBuyPlayer = (totalPlayers) => {
  return totalPlayers < 25
}

// Generate random team formation
export const getRandomFormation = () => {
  const formations = ["4-4-2", "4-3-3", "3-5-2", "4-5-1", "5-3-2"]
  return formations[Math.floor(Math.random() * formations.length)]
}

// Calculate days since date
export const daysSince = (date) => {
  const now = new Date()
  const past = new Date(date)
  const diffTime = Math.abs(now - past)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}
