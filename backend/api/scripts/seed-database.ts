import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/database";
import Team from "../models/Team";
import Player, { PlayerPosition } from "../models/Player";
import { Types } from "mongoose";

dotenv.config();

const PLAYER_NAMES = {
  [PlayerPosition.GOALKEEPER]: [
    "David Martinez",
    "Alex Thompson",
    "Marco Silva",
    "James Wilson",
    "Carlos Rodriguez",
    "Michael Brown",
    "Antonio Garcia",
    "Robert Johnson",
    "Francesco Rossi",
    "Pierre Dubois",
    "Keylor Navas",
    "Jan Oblak",
    "Thibaut Courtois",
    "Alisson Becker",
    "Manuel Neuer",
    "Gianluigi Donnarumma",
    "Ederson Moraes",
    "Hugo Lloris",
    "Jordan Pickford",
    "Nick Pope",
  ],
  [PlayerPosition.DEFENDER]: [
    "Lucas Santos",
    "Thomas Mueller",
    "Diego Lopez",
    "Kevin Anderson",
    "Sergio Ramos",
    "John Smith",
    "Alessandro Bianchi",
    "Mohamed Hassan",
    "Erik Larsson",
    "Pavel Novak",
    "Gabriel Silva",
    "Marcus Johnson",
    "Rafael Costa",
    "Viktor Petrov",
    "Ahmed Ali",
    "Daniel Kim",
    "Matteo Romano",
    "Johan Berg",
    "Carlos Mendez",
    "Ryan O'Connor",
    "Virgil van Dijk",
    "Ruben Dias",
    "Kalidou Koulibaly",
    "Raphael Varane",
    "Mats Hummels",
    "Giorgio Chiellini",
    "Thiago Silva",
    "Marquinhos",
    "Joao Cancelo",
    "Trent Alexander-Arnold",
    "Andrew Robertson",
    "Jordi Alba",
    "Dani Alves",
    "Kyle Walker",
    "Reece James",
    "Achraf Hakimi",
    "Theo Hernandez",
    "Luke Shaw",
    "Ben Chilwell",
    "Cesar Azpilicueta",
  ],
  [PlayerPosition.MIDFIELDER]: [
    "Andrea Pirlo",
    "Luka Modric",
    "Kevin De Bruyne",
    "N'Golo Kante",
    "Toni Kroos",
    "Paul Pogba",
    "Sergio Busquets",
    "Thiago Alcantara",
    "Marco Verratti",
    "Frenkie de Jong",
    "Mason Mount",
    "Bruno Fernandes",
    "Pedri Gonzalez",
    "Jude Bellingham",
    "Declan Rice",
    "Federico Chiesa",
    "Leon Goretzka",
    "Nicolo Barella",
    "Rodrigo Bentancur",
    "Youri Tielemans",
    "Joshua Kimmich",
    "Casemiro",
    "Fabinho",
    "Jordan Henderson",
    "Ilkay Gundogan",
    "Bernardo Silva",
    "Riyad Mahrez",
    "Jack Grealish",
    "Phil Foden",
    "Jadon Sancho",
    "Bukayo Saka",
    "Martin Odegaard",
    "Thomas Partey",
    "Granit Xhaka",
    "Mateo Kovacic",
    "Jorginho",
    "Kai Havertz",
    "Christian Pulisic",
    "Hakim Ziyech",
    "Mason Greenwood",
  ],
  [PlayerPosition.ATTACKER]: [
    "Lionel Messi",
    "Cristiano Ronaldo",
    "Kylian Mbappe",
    "Erling Haaland",
    "Robert Lewandowski",
    "Neymar Jr",
    "Mohamed Salah",
    "Sadio Mane",
    "Harry Kane",
    "Karim Benzema",
    "Vinicius Jr",
    "Jadon Sancho",
    "Phil Foden",
    "Bukayo Saka",
    "Rafael Leao",
    "Victor Osimhen",
    "Dusan Vlahovic",
    "Darwin Nunez",
    "Cody Gakpo",
    "Khvicha Kvaratskhelia",
    "Lautaro Martinez",
    "Romelu Lukaku",
    "Timo Werner",
    "Gabriel Jesus",
    "Raheem Sterling",
    "Son Heung-min",
    "Dejan Kulusevski",
    "Marcus Rashford",
    "Anthony Martial",
    "Mason Greenwood",
    "Ansu Fati",
    "Ferran Torres",
    "Ousmane Dembele",
    "Antoine Griezmann",
    "Paulo Dybala",
    "Lorenzo Insigne",
    "Federico Chiesa",
    "Ciro Immobile",
    "Andrea Belotti",
    "Alvaro Morata",
  ],
};

const TEAM_NAMES = [
  "FC Thunder",
  "United Eagles",
  "City Lions",
  "Royal Warriors",
  "Athletic Titans",
  "Sporting Legends",
  "Dynamic FC",
  "Elite United",
  "Victory Rangers",
  "Champion City",
  "Premier Stars",
  "Golden Eagles",
  "Silver Wolves",
  "Diamond FC",
  "Platinum United",
  "Lightning Bolts",
  "Storm Riders",
  "Fire Dragons",
  "Ice Wolves",
  "Thunder Hawks",
  "Steel Panthers",
  "Crimson Tigers",
  "Azure Knights",
  "Emerald Falcons",
  "Ruby Phoenixes",
];

const getRandomPlayerName = (
  position: PlayerPosition,
  usedNames: Set<string>
): string => {
  const availableNames = PLAYER_NAMES[position].filter(
    (name) => !usedNames.has(name)
  );

  if (availableNames.length === 0) {
    const baseNames = PLAYER_NAMES[position];
    const randomBase = baseNames[Math.floor(Math.random() * baseNames.length)];
    const suffix = Math.floor(Math.random() * 1000);
    return `${randomBase} ${suffix}`;
  }

  const randomName =
    availableNames[Math.floor(Math.random() * availableNames.length)];
  usedNames.add(randomName);
  return randomName;
};

const generatePlayerValue = (position: PlayerPosition): number => {
  const baseValues = {
    [PlayerPosition.GOALKEEPER]: { min: 500000, max: 2000000 },
    [PlayerPosition.DEFENDER]: { min: 800000, max: 3000000 },
    [PlayerPosition.MIDFIELDER]: { min: 1000000, max: 4000000 },
    [PlayerPosition.ATTACKER]: { min: 1200000, max: 5000000 },
  };

  const range = baseValues[position];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
};

const seedTransferMarketTeams = async (count = 15) => {
  try {
    console.log(`Seeding ${count} teams for transfer market...`);

    for (let i = 0; i < count; i++) {
      const seedTeam = new Team({
        userId: new Types.ObjectId(),
        name: TEAM_NAMES[i % TEAM_NAMES.length] + ` Seed ${i + 1}`,
        budget: Math.floor(Math.random() * 10000000) + 5000000,
      });

      await seedTeam.save();

      const usedNames = new Set<string>();
      const players: any[] = [];

      const playerDistribution = [
        { position: PlayerPosition.GOALKEEPER, count: 3 },
        { position: PlayerPosition.DEFENDER, count: 6 },
        { position: PlayerPosition.MIDFIELDER, count: 6 },
        { position: PlayerPosition.ATTACKER, count: 5 },
      ];

      for (const { position, count } of playerDistribution) {
        for (let j = 0; j < count; j++) {
          const isOnTransferList = Math.random() < 0.3;
          const value = generatePlayerValue(position);

          players.push({
            name: getRandomPlayerName(position, usedNames),
            position,
            teamId: seedTeam._id,
            value,
            isOnTransferList,
            askingPrice: isOnTransferList
              ? Math.floor(value * (1.1 + Math.random() * 0.4))
              : undefined,
          });
        }
      }

      const createdPlayers = await Player.insertMany(players);

      seedTeam.players = createdPlayers.map(
        (player) => player._id as Types.ObjectId
      );
      await seedTeam.save();

      console.log(
        `Created seed team: ${seedTeam.name} with ${createdPlayers.length} players`
      );
    }

    console.log(`Successfully seeded ${count} teams for transfer market`);
  } catch (error) {
    console.error("Error seeding transfer market teams:", error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    await connectDB();

    const seedTeams = await Team.find({
      name: { $regex: /Seed \d+$/ },
    });

    if (seedTeams.length > 0) {
      console.log(`Removing ${seedTeams.length} existing seed teams...`);
      const seedTeamIds = seedTeams.map((team) => team._id);
      await Player.deleteMany({ teamId: { $in: seedTeamIds } });
      await Team.deleteMany({ _id: { $in: seedTeamIds } });
    }

    console.log("Creating seed teams and players...");
    await seedTransferMarketTeams(15);

    const totalTeams = await Team.countDocuments();
    const totalPlayers = await Player.countDocuments();
    const playersOnTransferList = await Player.countDocuments({
      isOnTransferList: true,
    });

    console.log("\n Database Statistics:");
    console.log(`   Total Teams: ${totalTeams}`);
    console.log(`   Total Players: ${totalPlayers}`);
    console.log(`   Players on Transfer List: ${playersOnTransferList}`);

    console.log("\n Database seeding completed successfully!");
  } catch (error) {
    console.error(" Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
    process.exit(0);
  }
};

if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
