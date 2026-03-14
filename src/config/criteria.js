export const TEAMS = [
  { type: "team", code: "MI",   name: "Mumbai Indians",          logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/mi.webp" },
  { type: "team", code: "CSK",  name: "Chennai Super Kings",     logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/csk.webp" },
  { type: "team", code: "RCB",  name: "Royal Challengers Bangalore", logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/rcb.webp" },
  { type: "team", code: "KKR",  name: "Kolkata Knight Riders",   logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/kkr.webp" },
  { type: "team", code: "DC",   name: "Delhi Capitals",          logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/dc.webp" },
  { type: "team", code: "SRH",  name: "Sunrisers Hyderabad",     logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/srh.webp" },
  { type: "team", code: "PBKS", name: "Punjab Kings",            logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/pbks.webp" },
  { type: "team", code: "RR",   name: "Rajasthan Royals",        logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/rr.webp" },
  { type: "team", code: "GT",   name: "Gujarat Titans",          logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/gt.webp" },
  { type: "team", code: "LSG",  name: "Lucknow Super Giants",    logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/lsg.webp" },
  { type: "team", code: "DQ",   name: "Deccan Chargers",         logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/dq.webp" },
  { type: "team", code: "PWI",  name: "Pune Warriors India",     logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/pwi.webp" },
  { type: "team", code: "GL",   name: "Gujarat Lions",           logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/gl.webp" },
  { type: "team", code: "RPSG", name: "Rising Pune Supergiant",  logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/rpsg.webp" },
  { type: "team", code: "KTK",  name: "Kochi Tuskers Kerala",    logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/ktk.webp" },
];

export const NATIONALITIES = [
  { type: "nationality", code: "IND", name: "India",        logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/ind.jpg" },
  { type: "nationality", code: "AUS", name: "Australia",    logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/aus.jpg" },
  { type: "nationality", code: "SA",  name: "South Africa", logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/sa.jpg" },
  { type: "nationality", code: "ENG", name: "England",      logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/eng.jpg" },
  { type: "nationality", code: "NZ",  name: "New Zealand",  logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/nz.jpg" },
  { type: "nationality", code: "WI",  name: "West Indies",  logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/wi.jpg" },
  { type: "nationality", code: "PAK", name: "Pakistan",     logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/pak.jpg" },
  { type: "nationality", code: "SL",  name: "Sri Lanka",    logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/sl.jpg" },
  { type: "nationality", code: "BAN", name: "Bangladesh",   logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/ban.jpg" },
  { type: "nationality", code: "AFG", name: "Afghanistan",  logo: "https://res.cloudinary.com/diwsrrjbd/image/upload/afg.jpg" },
];

// Hard mode: only these 8 teams are eligible
export const HARD_TEAMS = ["SRH", "RCB", "KKR", "MI", "CSK", "PBKS", "RR", "DC"].map(
  (code) => TEAMS.find((t) => t.code === code)
);

// Hard mode metrics — tightened thresholds for proper difficulty (15–97 players per metric)
export const HARD_METRICS = [
  // ── Runs ──────────────────────────────────────────────────────
  { type: "metric", code: "SR_GT_150",   label: "Batting Strike Rate > 150", statType: "Most Runs",    field: "SR",        operator: "gt",  value: 150,  playerCount: 97  },
  { type: "metric", code: "RUNS_1000",   label: "1000+ Runs",                statType: "Most Runs",    field: "Runs",      operator: "gte", value: 1000, playerCount: 70  },
  { type: "metric", code: "SIXES_40",    label: "40+ Sixes",                 statType: "Most Runs",    field: "6s",        operator: "gte", value: 40,   playerCount: 69  },
  { type: "metric", code: "AVE_GT_35",   label: "Batting Average > 35",      statType: "Most Runs",    field: "Ave",       operator: "gt",  value: 35,   playerCount: 66  },
  { type: "metric", code: "FOURS_100",   label: "100+ Fours",                statType: "Most Runs",    field: "4s",        operator: "gte", value: 100,  playerCount: 65  },
  { type: "metric", code: "SR_GT_160",   label: "Batting Strike Rate > 160", statType: "Most Runs",    field: "SR",        operator: "gt",  value: 160,  playerCount: 63  },
  { type: "metric", code: "SIXES_50",    label: "50+ Sixes",                 statType: "Most Runs",    field: "6s",        operator: "gte", value: 50,   playerCount: 55  },
  { type: "metric", code: "AVE_GT_40",   label: "Batting Average > 40",      statType: "Most Runs",    field: "Ave",       operator: "gt",  value: 40,   playerCount: 37  },
  { type: "metric", code: "RUNS_2000",   label: "2000+ Runs",                statType: "Most Runs",    field: "Runs",      operator: "gte", value: 2000, playerCount: 32  },
  { type: "metric", code: "CENTURY_2",   label: "Scored 2+ Centuries",       statType: "Most Runs",    field: "Centuries", operator: "gte", value: 2,    playerCount: 17  },
  // ── Wickets ───────────────────────────────────────────────────
  { type: "metric", code: "BOWL_AVE_22", label: "Bowling Average < 22",      statType: "Most Wickets", field: "Ave",       operator: "lt",  value: 22,   playerCount: 84  },
  { type: "metric", code: "BOWL_SR_15",  label: "Bowling Strike Rate < 15",  statType: "Most Wickets", field: "SR",        operator: "lt",  value: 15,   playerCount: 70  },
  { type: "metric", code: "ECON_7",      label: "Economy Rate < 7",          statType: "Most Wickets", field: "Econ",      operator: "lt",  value: 7,    playerCount: 59  },
  { type: "metric", code: "BOWL_AVE_20", label: "Bowling Average < 20",      statType: "Most Wickets", field: "Ave",       operator: "lt",  value: 20,   playerCount: 55  },
  { type: "metric", code: "WKTS_50",     label: "50+ Wickets",               statType: "Most Wickets", field: "Wkts",      operator: "gte", value: 50,   playerCount: 45  },
  { type: "metric", code: "FOURWKT_2",   label: "Took 2+ Four-Wicket Hauls", statType: "Most Wickets", field: "4w",        operator: "gte", value: 2,    playerCount: 32  },
];

export const EASY_CRITERIA = [...TEAMS, ...NATIONALITIES];