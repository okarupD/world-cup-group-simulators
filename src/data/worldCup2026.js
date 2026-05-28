export const DATA_SOURCES = [
  {
    title: "FIFA World Cup 2026 final draw results",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/final-draw-results"
  },
  {
    title: "FIFA World Cup 2026 match schedule PDF",
    url: "https://digitalhub.fifa.com/asset/4b5d4417-3343-4732-9cdf-14b6662af407/FWC26-Match-Schedule_English.pdf"
  },
  {
    title: "UEFA qualified teams and play-off winners",
    url: "https://www.uefa.com/european-qualifiers/news/029f-1f318027c4dd-8e9bab478b48-1000--world-cup-2026-which-european-teams-have-qualified/"
  },
  {
    title: "FIFA Play-Off Tournament review",
    url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/play-off-tournament-review"
  }
];

export const DATA_CHECKED_AT = "2026-05-28";

export const GROUPS = [
  {
    id: "A",
    teams: [
      team("MEX", "Mexico", "CONCACAF", "A1", "🇲🇽"),
      team("RSA", "South Africa", "CAF", "A2", "🇿🇦"),
      team("KOR", "Korea Republic", "AFC", "A3", "🇰🇷"),
      team("CZE", "Czechia", "UEFA", "A4", "🇨🇿")
    ]
  },
  {
    id: "B",
    teams: [
      team("CAN", "Canada", "CONCACAF", "B1", "🇨🇦"),
      team("BIH", "Bosnia and Herzegovina", "UEFA", "B2", "🇧🇦"),
      team("QAT", "Qatar", "AFC", "B3", "🇶🇦"),
      team("SUI", "Switzerland", "UEFA", "B4", "🇨🇭")
    ]
  },
  {
    id: "C",
    teams: [
      team("BRA", "Brazil", "CONMEBOL", "C1", "🇧🇷"),
      team("MAR", "Morocco", "CAF", "C2", "🇲🇦"),
      team("HAI", "Haiti", "CONCACAF", "C3", "🇭🇹"),
      team("SCO", "Scotland", "UEFA", "C4", "🏴")
    ]
  },
  {
    id: "D",
    teams: [
      team("USA", "USA", "CONCACAF", "D1", "🇺🇸"),
      team("PAR", "Paraguay", "CONMEBOL", "D2", "🇵🇾"),
      team("AUS", "Australia", "AFC", "D3", "🇦🇺"),
      team("TUR", "Türkiye", "UEFA", "D4", "🇹🇷")
    ]
  },
  {
    id: "E",
    teams: [
      team("GER", "Germany", "UEFA", "E1", "🇩🇪"),
      team("CUW", "Curaçao", "CONCACAF", "E2", "🇨🇼"),
      team("CIV", "Côte d'Ivoire", "CAF", "E3", "🇨🇮"),
      team("ECU", "Ecuador", "CONMEBOL", "E4", "🇪🇨")
    ]
  },
  {
    id: "F",
    teams: [
      team("NED", "Netherlands", "UEFA", "F1", "🇳🇱"),
      team("JPN", "Japan", "AFC", "F2", "🇯🇵"),
      team("SWE", "Sweden", "UEFA", "F3", "🇸🇪"),
      team("TUN", "Tunisia", "CAF", "F4", "🇹🇳")
    ]
  },
  {
    id: "G",
    teams: [
      team("BEL", "Belgium", "UEFA", "G1", "🇧🇪"),
      team("EGY", "Egypt", "CAF", "G2", "🇪🇬"),
      team("IRN", "IR Iran", "AFC", "G3", "🇮🇷"),
      team("NZL", "New Zealand", "OFC", "G4", "🇳🇿")
    ]
  },
  {
    id: "H",
    teams: [
      team("ESP", "Spain", "UEFA", "H1", "🇪🇸"),
      team("CPV", "Cabo Verde", "CAF", "H2", "🇨🇻"),
      team("KSA", "Saudi Arabia", "AFC", "H3", "🇸🇦"),
      team("URU", "Uruguay", "CONMEBOL", "H4", "🇺🇾")
    ]
  },
  {
    id: "I",
    teams: [
      team("FRA", "France", "UEFA", "I1", "🇫🇷"),
      team("SEN", "Senegal", "CAF", "I2", "🇸🇳"),
      team("IRQ", "Iraq", "AFC", "I3", "🇮🇶"),
      team("NOR", "Norway", "UEFA", "I4", "🇳🇴")
    ]
  },
  {
    id: "J",
    teams: [
      team("ARG", "Argentina", "CONMEBOL", "J1", "🇦🇷"),
      team("ALG", "Algeria", "CAF", "J2", "🇩🇿"),
      team("AUT", "Austria", "UEFA", "J3", "🇦🇹"),
      team("JOR", "Jordan", "AFC", "J4", "🇯🇴")
    ]
  },
  {
    id: "K",
    teams: [
      team("POR", "Portugal", "UEFA", "K1", "🇵🇹"),
      team("COD", "Congo DR", "CAF", "K2", "🇨🇩"),
      team("UZB", "Uzbekistan", "AFC", "K3", "🇺🇿"),
      team("COL", "Colombia", "CONMEBOL", "K4", "🇨🇴")
    ]
  },
  {
    id: "L",
    teams: [
      team("ENG", "England", "UEFA", "L1", "🏴"),
      team("CRO", "Croatia", "UEFA", "L2", "🇭🇷"),
      team("GHA", "Ghana", "CAF", "L3", "🇬🇭"),
      team("PAN", "Panama", "CONCACAF", "L4", "🇵🇦")
    ]
  }
];

function team(id, name, confederation, drawPosition, flag) {
  return {
    id,
    name,
    confederation,
    drawPosition,
    flag
  };
}
