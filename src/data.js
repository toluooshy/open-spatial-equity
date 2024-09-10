const text = {
  views: {
    portal: "Spatial Equity TO 🇨🇦", // name of the platform
    city_data: "Citywide Data 🏙",
    community_profiles: "Community Profiles 🏘",
    learn_more: "Learn More & Act 📚",
  },
  actions: {},
  metrics: {
    city_subdivision: "Wards", // the wards of the city
    city_neighbourhood: "Neighbourhoods", // the neighbourhoods of a city
  },
  boroughs: {
    Etobicoke: "#80b531",
    "East York": "#d9bb50",
    "North York": "#23c7d9",
    "Old Toronto": "#ed8b45",
    Scarborough: "#b553a8",
    York: "#383838",
  },
  categories: {
    // some sample categories for different topics
    infrastructure: {
      title: "Infrastructure",
      topics: ["Median Income"], //["Road Maintenence", "Builing Code Violations", "third"],
      colors: [
        "#034694", // Root color (Blue)
        "#4468A1", // Slightly lighter blue
        "#869BCE", // Lighter blue
        "#C8CDFB", // Very light blue
        "#E3E8FF", // Almost white blue
      ],
    },
    health: {
      title: "Health",
      topics: ["Healthcare Workers"], //["Air Pollution", "Noise Pollution"],
      colors: [
        "#D2122E", // Root color (Red)
        "#DC4A5D", // Slightly lighter red
        "#E6828D", // Lighter red
        "#F1BBC2", // Very light red
        "#F9DEE2", // Almost white red
      ],
    },
    environment: {
      title: "Environment",
      topics: [], //["Extreme Heat", "Flooding"],
      colors: [
        "#4B6F44", // Root color (Green)
        "#73896C", // Slightly lighter green
        "#9AA495", // Lighter green
        "#C2CDBD", // Very light green
        "#E8ECE7", // Almost white green
      ],
    },
    transportation: {
      title: "Transportation",
      topics: [], // ["Bus Lanes", "Sidewalks"],
      colors: [
        "#FFC72C", // Root color (Yellow)
        "#FFD764", // Slightly lighter yellow
        "#FFE89D", // Lighter yellow
        "#FFF9D5", // Very light yellow
        "#FFFCEB", // Almost white yellow
      ],
    },
  },
  menu: {
    mission: {
      title: "Mission",
    },
    act: { title: "Act" },
    acknowledgements: { title: "Acknowledgements" },
    sources: { title: "Sources" },
  },
};

export default text;
