'use strict';
// Original language for B2 practice and C1 stretch. Levels are teaching targets.
// Each task/section has a contextual first choice and a bank of functional alternatives.
window.STUDIO_LANGUAGE = (() => {
  const TOPICS = {
  "home": {
    "p1": [
      [
        {
          "text": "peaceful surroundings",
          "level": "B2",
          "meaning": "a calm area around you",
          "kind": "word"
        },
        {
          "text": "a sense of belonging",
          "level": "B2",
          "meaning": "feeling accepted in a place",
          "kind": "word"
        },
        {
          "text": "local amenities",
          "level": "B2",
          "meaning": "nearby facilities and services",
          "kind": "word"
        }
      ],
      [
        {
          "text": "urban development",
          "level": "C1",
          "meaning": "changes to buildings and public areas",
          "kind": "word"
        },
        {
          "text": "improved infrastructure",
          "level": "B2",
          "meaning": "better roads and essential services",
          "kind": "word"
        },
        {
          "text": "residential area",
          "level": "B2",
          "meaning": "an area mainly made up of homes",
          "kind": "word"
        }
      ],
      [
        {
          "text": "close-knit community",
          "level": "B2",
          "meaning": "a group with strong relationships",
          "kind": "word"
        },
        {
          "text": "mutual support",
          "level": "B2",
          "meaning": "help that people give each other",
          "kind": "word"
        },
        {
          "text": "familiar faces",
          "level": "B2",
          "meaning": "people you recognise",
          "kind": "word"
        }
      ],
      [
        {
          "text": "unwind",
          "level": "B2",
          "meaning": "relax after a busy day",
          "kind": "word"
        },
        {
          "text": "escape the crowds",
          "level": "B2",
          "meaning": "get away from busy places",
          "kind": "word"
        },
        {
          "text": "within walking distance",
          "level": "B2",
          "meaning": "close enough to reach on foot",
          "kind": "word"
        }
      ],
      [
        {
          "text": "a productive environment",
          "level": "B2",
          "meaning": "a place that helps you work",
          "kind": "word"
        },
        {
          "text": "minimal distractions",
          "level": "B2",
          "meaning": "very few things interrupting you",
          "kind": "word"
        },
        {
          "text": "well-equipped",
          "level": "B2",
          "meaning": "having the equipment you need",
          "kind": "word"
        }
      ],
      [
        {
          "text": "relocate",
          "level": "B2",
          "meaning": "move to a different place",
          "kind": "word"
        },
        {
          "text": "quality of life",
          "level": "B2",
          "meaning": "how comfortable and enjoyable life is",
          "kind": "word"
        },
        {
          "text": "affordable housing",
          "level": "B2",
          "meaning": "homes people can afford",
          "kind": "word"
        }
      ]
    ],
    "p2": [
      [
        {
          "text": "a hidden gem",
          "level": "B2",
          "meaning": "a wonderful place few people know",
          "kind": "word"
        },
        {
          "text": "tucked away",
          "level": "B2",
          "meaning": "in a quiet or hidden position",
          "kind": "word"
        },
        {
          "text": "lively atmosphere",
          "level": "B2",
          "meaning": "an energetic feeling in a place",
          "kind": "word"
        },
        {
          "text": "unwind",
          "level": "B2",
          "meaning": "relax after a busy day",
          "kind": "word"
        },
        {
          "text": "a sense of belonging",
          "level": "B2",
          "meaning": "feeling accepted in a place",
          "kind": "word"
        }
      ]
    ],
    "p3": [
      [
        {
          "text": "social cohesion",
          "level": "C1",
          "meaning": "strong relationships within a society",
          "kind": "word"
        },
        {
          "text": "accessible facilities",
          "level": "B2",
          "meaning": "places everyone can reach and use",
          "kind": "word"
        },
        {
          "text": "shared public spaces",
          "level": "B2",
          "meaning": "places the whole community can use",
          "kind": "word"
        },
        {
          "text": "diverse needs",
          "level": "B2",
          "meaning": "different things that people require",
          "kind": "word"
        },
        {
          "text": "quality of life",
          "level": "B2",
          "meaning": "how comfortable and enjoyable life is",
          "kind": "word"
        }
      ],
      [
        {
          "text": "social isolation",
          "level": "C1",
          "meaning": "having little contact with other people",
          "kind": "word"
        },
        {
          "text": "demanding schedules",
          "level": "B2",
          "meaning": "routines that leave little free time",
          "kind": "word"
        },
        {
          "text": "remote working",
          "level": "B2",
          "meaning": "working away from a shared workplace",
          "kind": "word"
        },
        {
          "text": "individual circumstances",
          "level": "B2",
          "meaning": "the situation of each person",
          "kind": "word"
        },
        {
          "text": "community ties",
          "level": "B2",
          "meaning": "connections between local people",
          "kind": "word"
        }
      ],
      [
        {
          "text": "community investment",
          "level": "B2",
          "meaning": "money spent to benefit local people",
          "kind": "word"
        },
        {
          "text": "public wellbeing",
          "level": "B2",
          "meaning": "the health and happiness of everyone",
          "kind": "word"
        },
        {
          "text": "recreational facilities",
          "level": "B2",
          "meaning": "places for exercise and leisure",
          "kind": "word"
        },
        {
          "text": "competing priorities",
          "level": "B2",
          "meaning": "other needs requiring money or attention",
          "kind": "word"
        },
        {
          "text": "long-term benefits",
          "level": "B2",
          "meaning": "advantages that continue over time",
          "kind": "word"
        }
      ],
      [
        {
          "text": "health-conscious design",
          "level": "B2",
          "meaning": "planning that supports healthy choices",
          "kind": "word"
        },
        {
          "text": "active lifestyles",
          "level": "B2",
          "meaning": "ways of living with regular exercise",
          "kind": "word"
        },
        {
          "text": "pedestrian-friendly streets",
          "level": "B2",
          "meaning": "roads designed to be comfortable for walkers",
          "kind": "word"
        },
        {
          "text": "uneven access",
          "level": "B2",
          "meaning": "some people having better access",
          "kind": "word"
        },
        {
          "text": "preventative measures",
          "level": "B2",
          "meaning": "actions that stop problems developing",
          "kind": "word"
        }
      ],
      [
        {
          "text": "urban sprawl",
          "level": "C1",
          "meaning": "cities spreading into surrounding land",
          "kind": "word"
        },
        {
          "text": "pressure on services",
          "level": "B2",
          "meaning": "high demand for public facilities",
          "kind": "word"
        },
        {
          "text": "housing shortages",
          "level": "B2",
          "meaning": "too few homes for everyone",
          "kind": "word"
        },
        {
          "text": "economic opportunities",
          "level": "B2",
          "meaning": "chances to earn and develop",
          "kind": "word"
        },
        {
          "text": "sustainable growth",
          "level": "B2",
          "meaning": "development that can continue responsibly",
          "kind": "word"
        }
      ],
      [
        {
          "text": "changing priorities",
          "level": "B2",
          "meaning": "different things becoming important",
          "kind": "word"
        },
        {
          "text": "flexible working",
          "level": "B2",
          "meaning": "work arrangements with more choice",
          "kind": "word"
        },
        {
          "text": "rural relocation",
          "level": "B2",
          "meaning": "moving to a countryside area",
          "kind": "word"
        },
        {
          "text": "digital infrastructure",
          "level": "B2",
          "meaning": "systems that support online services",
          "kind": "word"
        },
        {
          "text": "balanced development",
          "level": "B2",
          "meaning": "growth that considers different needs",
          "kind": "word"
        }
      ]
    ]
  },
  "travel": {
    "p1": [
      [
        {
          "text": "daily commute",
          "level": "B2",
          "meaning": "the regular journey to school or work",
          "kind": "word"
        },
        {
          "text": "cost-effective",
          "level": "B2",
          "meaning": "giving good value for the money",
          "kind": "word"
        },
        {
          "text": "reliable transport",
          "level": "B2",
          "meaning": "travel services you can depend on",
          "kind": "word"
        }
      ],
      [
        {
          "text": "travel companions",
          "level": "B2",
          "meaning": "people who travel together",
          "kind": "word"
        },
        {
          "text": "greater flexibility",
          "level": "B2",
          "meaning": "more freedom to change plans",
          "kind": "word"
        },
        {
          "text": "shared experiences",
          "level": "B2",
          "meaning": "things people do and remember together",
          "kind": "word"
        }
      ],
      [
        {
          "text": "a hidden gem",
          "level": "B2",
          "meaning": "a wonderful place few people know",
          "kind": "word"
        },
        {
          "text": "cultural significance",
          "level": "B2",
          "meaning": "importance to a community or culture",
          "kind": "word"
        },
        {
          "text": "local heritage",
          "level": "B2",
          "meaning": "traditions and places inherited locally",
          "kind": "word"
        }
      ],
      [
        {
          "text": "plan ahead",
          "level": "B2",
          "meaning": "organise things before they happen",
          "kind": "word"
        },
        {
          "text": "peace of mind",
          "level": "B2",
          "meaning": "a feeling of calm without worry",
          "kind": "word"
        },
        {
          "text": "a flexible itinerary",
          "level": "B2",
          "meaning": "a travel plan you can change",
          "kind": "word"
        }
      ],
      [
        {
          "text": "childhood memories",
          "level": "B2",
          "meaning": "things you remember from early life",
          "kind": "word"
        },
        {
          "text": "broaden my horizons",
          "level": "B2",
          "meaning": "increase my understanding through experience",
          "kind": "word"
        },
        {
          "text": "family excursions",
          "level": "B2",
          "meaning": "short trips with family",
          "kind": "word"
        }
      ],
      [
        {
          "text": "an unfamiliar destination",
          "level": "B2",
          "meaning": "a place you have not visited",
          "kind": "word"
        },
        {
          "text": "cultural curiosity",
          "level": "B2",
          "meaning": "interest in other ways of life",
          "kind": "word"
        },
        {
          "text": "off the beaten track",
          "level": "B2",
          "meaning": "away from the usual tourist routes",
          "kind": "word"
        }
      ]
    ],
    "p2": [
      [
        {
          "text": "a memorable getaway",
          "level": "B2",
          "meaning": "a short holiday you remember clearly",
          "kind": "word"
        },
        {
          "text": "a coastal destination",
          "level": "B2",
          "meaning": "a place beside the sea",
          "kind": "word"
        },
        {
          "text": "like-minded companions",
          "level": "B2",
          "meaning": "people who share your interests",
          "kind": "word"
        },
        {
          "text": "immerse myself",
          "level": "B2",
          "meaning": "become deeply involved in an experience",
          "kind": "word"
        },
        {
          "text": "a lasting impression",
          "level": "B2",
          "meaning": "an effect you remember for years",
          "kind": "word"
        }
      ]
    ],
    "p3": [
      [
        {
          "text": "local livelihoods",
          "level": "B2",
          "meaning": "the ways local people earn money",
          "kind": "word"
        },
        {
          "text": "employment opportunities",
          "level": "B2",
          "meaning": "chances to find paid work",
          "kind": "word"
        },
        {
          "text": "locally owned businesses",
          "level": "B2",
          "meaning": "businesses run by people living nearby",
          "kind": "word"
        },
        {
          "text": "seasonal employment",
          "level": "B2",
          "meaning": "work available only at certain times",
          "kind": "word"
        },
        {
          "text": "shared prosperity",
          "level": "B2",
          "meaning": "economic success benefiting many people",
          "kind": "word"
        }
      ],
      [
        {
          "text": "overtourism",
          "level": "C1",
          "meaning": "too many visitors damaging a place",
          "kind": "word"
        },
        {
          "text": "pressure on infrastructure",
          "level": "B2",
          "meaning": "heavy demand on roads and services",
          "kind": "word"
        },
        {
          "text": "overcrowded attractions",
          "level": "B2",
          "meaning": "tourist places with too many visitors",
          "kind": "word"
        },
        {
          "text": "economic dependence",
          "level": "B2",
          "meaning": "relying on one source of income",
          "kind": "word"
        },
        {
          "text": "responsible tourism",
          "level": "B2",
          "meaning": "travel that considers local people",
          "kind": "word"
        }
      ],
      [
        {
          "text": "cultural awareness",
          "level": "C1",
          "meaning": "understanding and respecting different cultures",
          "kind": "word"
        },
        {
          "text": "challenge assumptions",
          "level": "B2",
          "meaning": "question ideas you previously accepted",
          "kind": "word"
        },
        {
          "text": "meaningful interaction",
          "level": "B2",
          "meaning": "contact that helps people understand each other",
          "kind": "word"
        },
        {
          "text": "superficial contact",
          "level": "B2",
          "meaning": "contact with little real understanding",
          "kind": "word"
        },
        {
          "text": "a broader perspective",
          "level": "B2",
          "meaning": "a wider way of understanding things",
          "kind": "word"
        }
      ],
      [
        {
          "text": "greater accessibility",
          "level": "B2",
          "meaning": "more people being able to travel",
          "kind": "word"
        },
        {
          "text": "technological advances",
          "level": "B2",
          "meaning": "improvements in technology",
          "kind": "word"
        },
        {
          "text": "online booking platforms",
          "level": "B2",
          "meaning": "websites for arranging travel",
          "kind": "word"
        },
        {
          "text": "environmental costs",
          "level": "B2",
          "meaning": "harm caused to the natural world",
          "kind": "word"
        },
        {
          "text": "a significant shift",
          "level": "B2",
          "meaning": "a major change over time",
          "kind": "word"
        }
      ],
      [
        {
          "text": "shared responsibility",
          "level": "B2",
          "meaning": "a duty divided between different groups",
          "kind": "word"
        },
        {
          "text": "conservation funding",
          "level": "B2",
          "meaning": "money used to protect important places",
          "kind": "word"
        },
        {
          "text": "visitor limits",
          "level": "B2",
          "meaning": "rules controlling how many people enter",
          "kind": "word"
        },
        {
          "text": "practical enforcement",
          "level": "B2",
          "meaning": "making sure rules work in reality",
          "kind": "word"
        },
        {
          "text": "coordinated action",
          "level": "B2",
          "meaning": "different groups working together",
          "kind": "word"
        }
      ],
      [
        {
          "text": "sustainable travel",
          "level": "B2",
          "meaning": "travel that reduces long-term harm",
          "kind": "word"
        },
        {
          "text": "environmental awareness",
          "level": "B2",
          "meaning": "understanding how choices affect nature",
          "kind": "word"
        },
        {
          "text": "rail alternatives",
          "level": "B2",
          "meaning": "train journeys instead of other transport",
          "kind": "word"
        },
        {
          "text": "affordability",
          "level": "B2",
          "meaning": "how easily people can pay",
          "kind": "word"
        },
        {
          "text": "changing travel patterns",
          "level": "B2",
          "meaning": "new ways people choose to travel",
          "kind": "word"
        }
      ]
    ]
  },
  "technology": {
    "p1": [
      [
        {
          "text": "an indispensable tool",
          "level": "B2",
          "meaning": "something very difficult to do without",
          "kind": "word"
        },
        {
          "text": "everyday convenience",
          "level": "B2",
          "meaning": "making ordinary tasks easier",
          "kind": "word"
        },
        {
          "text": "navigation apps",
          "level": "B2",
          "meaning": "software that helps you find routes",
          "kind": "word"
        }
      ],
      [
        {
          "text": "streamline tasks",
          "level": "B2",
          "meaning": "make jobs simpler and more efficient",
          "kind": "word"
        },
        {
          "text": "instant access",
          "level": "B2",
          "meaning": "being able to reach something immediately",
          "kind": "word"
        },
        {
          "text": "collaborative platforms",
          "level": "B2",
          "meaning": "online spaces for working together",
          "kind": "word"
        }
      ],
      [
        {
          "text": "personal preference",
          "level": "B2",
          "meaning": "the choice that suits you",
          "kind": "word"
        },
        {
          "text": "immediacy",
          "level": "B2",
          "meaning": "being able to communicate without delay",
          "kind": "word"
        },
        {
          "text": "voice messages",
          "level": "B2",
          "meaning": "recordings sent instead of written messages",
          "kind": "word"
        }
      ],
      [
        {
          "text": "an intuitive interface",
          "level": "B2",
          "meaning": "controls that are easy to understand",
          "kind": "word"
        },
        {
          "text": "a learning curve",
          "level": "B2",
          "meaning": "the time and effort needed to learn",
          "kind": "word"
        },
        {
          "text": "trial and error",
          "level": "B2",
          "meaning": "learning by trying and correcting mistakes",
          "kind": "word"
        }
      ],
      [
        {
          "text": "a digital detox",
          "level": "B2",
          "meaning": "a break from electronic devices",
          "kind": "word"
        },
        {
          "text": "mental clarity",
          "level": "B2",
          "meaning": "being able to think clearly",
          "kind": "word"
        },
        {
          "text": "notification-free time",
          "level": "B2",
          "meaning": "a period without digital alerts",
          "kind": "word"
        }
      ],
      [
        {
          "text": "changing habits",
          "level": "B2",
          "meaning": "different ways of doing everyday things",
          "kind": "word"
        },
        {
          "text": "greater dependence",
          "level": "B2",
          "meaning": "relying on something more than before",
          "kind": "word"
        },
        {
          "text": "screen-time limits",
          "level": "B2",
          "meaning": "restrictions on device use",
          "kind": "word"
        }
      ]
    ],
    "p2": [
      [
        {
          "text": "an indispensable device",
          "level": "B2",
          "meaning": "equipment very difficult to do without",
          "kind": "word"
        },
        {
          "text": "a practical solution",
          "level": "B2",
          "meaning": "something useful that solves a problem",
          "kind": "word"
        },
        {
          "text": "a turning point",
          "level": "B2",
          "meaning": "a moment when things changed significantly",
          "kind": "word"
        },
        {
          "text": "streamline my routine",
          "level": "B2",
          "meaning": "make everyday tasks more efficient",
          "kind": "word"
        },
        {
          "text": "time-saving",
          "level": "B2",
          "meaning": "reducing the time a task needs",
          "kind": "word"
        }
      ]
    ],
    "p3": [
      [
        {
          "text": "a digital divide",
          "level": "B2",
          "meaning": "unequal access to digital technology",
          "kind": "word"
        },
        {
          "text": "limited exposure",
          "level": "B2",
          "meaning": "having few opportunities to experience something",
          "kind": "word"
        },
        {
          "text": "accessible training",
          "level": "B2",
          "meaning": "learning opportunities people can easily use",
          "kind": "word"
        },
        {
          "text": "individual confidence",
          "level": "B2",
          "meaning": "how capable each person feels",
          "kind": "word"
        },
        {
          "text": "inclusive design",
          "level": "B2",
          "meaning": "design that considers different users",
          "kind": "word"
        }
      ],
      [
        {
          "text": "media literacy",
          "level": "C1",
          "meaning": "the ability to judge media critically",
          "kind": "word"
        },
        {
          "text": "assess credibility",
          "level": "B2",
          "meaning": "judge whether information is trustworthy",
          "kind": "word"
        },
        {
          "text": "misleading content",
          "level": "B2",
          "meaning": "information that creates a false impression",
          "kind": "word"
        },
        {
          "text": "curriculum pressures",
          "level": "B2",
          "meaning": "too many demands on school time",
          "kind": "word"
        },
        {
          "text": "informed judgement",
          "level": "B2",
          "meaning": "an opinion based on good information",
          "kind": "word"
        }
      ],
      [
        {
          "text": "workplace transformation",
          "level": "B2",
          "meaning": "major changes in how people work",
          "kind": "word"
        },
        {
          "text": "increased efficiency",
          "level": "B2",
          "meaning": "achieving more with less effort",
          "kind": "word"
        },
        {
          "text": "remote collaboration",
          "level": "B2",
          "meaning": "working together from different locations",
          "kind": "word"
        },
        {
          "text": "job displacement",
          "level": "B2",
          "meaning": "people losing work because tasks change",
          "kind": "word"
        },
        {
          "text": "adaptable skills",
          "level": "B2",
          "meaning": "abilities useful as conditions change",
          "kind": "word"
        }
      ],
      [
        {
          "text": "meaningful connection",
          "level": "B2",
          "meaning": "contact with real emotional importance",
          "kind": "word"
        },
        {
          "text": "maintain contact",
          "level": "B2",
          "meaning": "stay in touch with other people",
          "kind": "word"
        },
        {
          "text": "long-distance friendships",
          "level": "B2",
          "meaning": "friendships between people living far apart",
          "kind": "word"
        },
        {
          "text": "face-to-face interaction",
          "level": "B2",
          "meaning": "communicating while physically together",
          "kind": "word"
        },
        {
          "text": "quality over quantity",
          "level": "B2",
          "meaning": "value rather than the total amount",
          "kind": "word"
        }
      ],
      [
        {
          "text": "data protection",
          "level": "C1",
          "meaning": "keeping personal information safe",
          "kind": "word"
        },
        {
          "text": "informed consent",
          "level": "B2",
          "meaning": "permission given with proper understanding",
          "kind": "word"
        },
        {
          "text": "privacy settings",
          "level": "B2",
          "meaning": "controls over who sees your information",
          "kind": "word"
        },
        {
          "text": "individual accountability",
          "level": "B2",
          "meaning": "people answering for their own actions",
          "kind": "word"
        },
        {
          "text": "robust safeguards",
          "level": "B2",
          "meaning": "strong measures that prevent harm",
          "kind": "word"
        }
      ],
      [
        {
          "text": "widespread automation",
          "level": "B2",
          "meaning": "machines doing many previously human tasks",
          "kind": "word"
        },
        {
          "text": "technological innovation",
          "level": "B2",
          "meaning": "new ways of using technology",
          "kind": "word"
        },
        {
          "text": "personalised services",
          "level": "B2",
          "meaning": "services adapted to individual needs",
          "kind": "word"
        },
        {
          "text": "human oversight",
          "level": "B2",
          "meaning": "people checking what technology does",
          "kind": "word"
        },
        {
          "text": "responsible adoption",
          "level": "B2",
          "meaning": "introducing technology with care",
          "kind": "word"
        }
      ]
    ]
  },
  "learning": {
    "p1": [
      [
        {
          "text": "intellectual curiosity",
          "level": "B2",
          "meaning": "a strong wish to understand ideas",
          "kind": "word"
        },
        {
          "text": "a sense of discovery",
          "level": "B2",
          "meaning": "the feeling of finding something new",
          "kind": "word"
        },
        {
          "text": "hands-on learning",
          "level": "B2",
          "meaning": "learning through practical activity",
          "kind": "word"
        }
      ],
      [
        {
          "text": "independent study",
          "level": "B2",
          "meaning": "learning without other people guiding you",
          "kind": "word"
        },
        {
          "text": "peer support",
          "level": "B2",
          "meaning": "help from people learning alongside you",
          "kind": "word"
        },
        {
          "text": "exchange ideas",
          "level": "B2",
          "meaning": "share thoughts with other people",
          "kind": "word"
        }
      ],
      [
        {
          "text": "sustained concentration",
          "level": "B2",
          "meaning": "focusing for a long period",
          "kind": "word"
        },
        {
          "text": "minimal distractions",
          "level": "B2",
          "meaning": "very few things interrupting you",
          "kind": "word"
        },
        {
          "text": "a quiet setting",
          "level": "B2",
          "meaning": "a calm place without much noise",
          "kind": "word"
        }
      ],
      [
        {
          "text": "a transferable skill",
          "level": "B2",
          "meaning": "an ability useful in different situations",
          "kind": "word"
        },
        {
          "text": "personal development",
          "level": "B2",
          "meaning": "improving your abilities and understanding",
          "kind": "word"
        },
        {
          "text": "public speaking",
          "level": "B2",
          "meaning": "talking to an audience",
          "kind": "word"
        }
      ],
      [
        {
          "text": "an engaging storyline",
          "level": "B2",
          "meaning": "a story that holds your attention",
          "kind": "word"
        },
        {
          "text": "stimulate imagination",
          "level": "B2",
          "meaning": "encourage new mental pictures and ideas",
          "kind": "word"
        },
        {
          "text": "a vivid description",
          "level": "B2",
          "meaning": "words creating a clear mental picture",
          "kind": "word"
        }
      ],
      [
        {
          "text": "seek clarification",
          "level": "B2",
          "meaning": "ask for a clearer explanation",
          "kind": "word"
        },
        {
          "text": "constructive feedback",
          "level": "B2",
          "meaning": "comments that help you improve",
          "kind": "word"
        },
        {
          "text": "break it down",
          "level": "B2",
          "meaning": "divide something difficult into smaller parts",
          "kind": "word"
        }
      ]
    ],
    "p2": [
      [
        {
          "text": "a practical skill",
          "level": "B2",
          "meaning": "an ability useful in real situations",
          "kind": "word"
        },
        {
          "text": "effective communication",
          "level": "B2",
          "meaning": "the ability to express and understand ideas",
          "kind": "word"
        },
        {
          "text": "a patient mentor",
          "level": "B2",
          "meaning": "someone who calmly guides your learning",
          "kind": "word"
        },
        {
          "text": "trial and error",
          "level": "B2",
          "meaning": "learning by trying and correcting mistakes",
          "kind": "word"
        },
        {
          "text": "a sense of achievement",
          "level": "B2",
          "meaning": "satisfaction after succeeding at something",
          "kind": "word"
        }
      ]
    ],
    "p3": [
      [
        {
          "text": "adaptable teaching",
          "level": "B2",
          "meaning": "instruction that changes to suit learners",
          "kind": "word"
        },
        {
          "text": "constructive feedback",
          "level": "B2",
          "meaning": "comments that help people improve",
          "kind": "word"
        },
        {
          "text": "differentiated tasks",
          "level": "B2",
          "meaning": "activities adapted to different learning needs",
          "kind": "word"
        },
        {
          "text": "limited resources",
          "level": "B2",
          "meaning": "not enough time, money or equipment",
          "kind": "word"
        },
        {
          "text": "learner confidence",
          "level": "B2",
          "meaning": "how capable a student feels",
          "kind": "word"
        }
      ],
      [
        {
          "text": "experiential learning",
          "level": "B2",
          "meaning": "learning through direct experience",
          "kind": "word"
        },
        {
          "text": "active participation",
          "level": "B2",
          "meaning": "being involved rather than only watching",
          "kind": "word"
        },
        {
          "text": "hands-on practice",
          "level": "B2",
          "meaning": "doing a task to learn it",
          "kind": "word"
        },
        {
          "text": "individual learning needs",
          "level": "B2",
          "meaning": "what each learner requires",
          "kind": "word"
        },
        {
          "text": "complementary approaches",
          "level": "B2",
          "meaning": "different methods that work well together",
          "kind": "word"
        }
      ],
      [
        {
          "text": "equal access",
          "level": "B2",
          "meaning": "the same opportunity to use something",
          "kind": "word"
        },
        {
          "text": "geographical barriers",
          "level": "B2",
          "meaning": "difficulties caused by where people live",
          "kind": "word"
        },
        {
          "text": "flexible learning",
          "level": "B2",
          "meaning": "study arrangements with more choice",
          "kind": "word"
        },
        {
          "text": "a digital divide",
          "level": "B2",
          "meaning": "unequal access to digital technology",
          "kind": "word"
        },
        {
          "text": "inclusive education",
          "level": "B2",
          "meaning": "learning that welcomes different needs",
          "kind": "word"
        }
      ],
      [
        {
          "text": "lifelong learning",
          "level": "B2",
          "meaning": "continuing to learn throughout life",
          "kind": "word"
        },
        {
          "text": "professional adaptability",
          "level": "B2",
          "meaning": "being able to handle workplace change",
          "kind": "word"
        },
        {
          "text": "career transitions",
          "level": "B2",
          "meaning": "moves between different kinds of work",
          "kind": "word"
        },
        {
          "text": "competing commitments",
          "level": "B2",
          "meaning": "different duties needing the same time",
          "kind": "word"
        },
        {
          "text": "ongoing development",
          "level": "B2",
          "meaning": "improvement that continues over time",
          "kind": "word"
        }
      ],
      [
        {
          "text": "a balanced curriculum",
          "level": "C1",
          "meaning": "a course combining different learning priorities",
          "kind": "word"
        },
        {
          "text": "practical application",
          "level": "B2",
          "meaning": "using knowledge in real situations",
          "kind": "word"
        },
        {
          "text": "project-based learning",
          "level": "B2",
          "meaning": "developing understanding by completing projects",
          "kind": "word"
        },
        {
          "text": "academic foundations",
          "level": "B2",
          "meaning": "basic knowledge supporting later learning",
          "kind": "word"
        },
        {
          "text": "complementary skills",
          "level": "B2",
          "meaning": "abilities that support each other",
          "kind": "word"
        }
      ],
      [
        {
          "text": "critical thinking",
          "level": "B2",
          "meaning": "examining ideas carefully before judging",
          "kind": "word"
        },
        {
          "text": "rapid change",
          "level": "B2",
          "meaning": "developments happening very quickly",
          "kind": "word"
        },
        {
          "text": "collaborative problem-solving",
          "level": "B2",
          "meaning": "working together to find solutions",
          "kind": "word"
        },
        {
          "text": "an uncertain future",
          "level": "B2",
          "meaning": "what happens next being hard to predict",
          "kind": "word"
        },
        {
          "text": "transferable skills",
          "level": "B2",
          "meaning": "abilities useful in different situations",
          "kind": "word"
        }
      ]
    ]
  },
  "nature": {
    "p1": [
      [
        {
          "text": "an outdoor routine",
          "level": "B2",
          "meaning": "a regular habit of spending time outside",
          "kind": "word"
        },
        {
          "text": "mental wellbeing",
          "level": "B2",
          "meaning": "feeling emotionally healthy and balanced",
          "kind": "word"
        },
        {
          "text": "a refreshing walk",
          "level": "B2",
          "meaning": "a walk that makes you feel better",
          "kind": "word"
        }
      ],
      [
        {
          "text": "accessible open spaces",
          "level": "B2",
          "meaning": "outdoor areas people can reach easily",
          "kind": "word"
        },
        {
          "text": "recreational opportunities",
          "level": "B2",
          "meaning": "chances to enjoy leisure activities",
          "kind": "word"
        },
        {
          "text": "landscaped gardens",
          "level": "B2",
          "meaning": "gardens planned for an attractive appearance",
          "kind": "word"
        }
      ],
      [
        {
          "text": "a mild climate",
          "level": "B2",
          "meaning": "weather without extreme temperatures",
          "kind": "word"
        },
        {
          "text": "a comfortable atmosphere",
          "level": "B2",
          "meaning": "conditions that feel pleasant",
          "kind": "word"
        },
        {
          "text": "a gentle breeze",
          "level": "B2",
          "meaning": "a light and pleasant wind",
          "kind": "word"
        }
      ],
      [
        {
          "text": "childhood exploration",
          "level": "B2",
          "meaning": "discovering places when you were young",
          "kind": "word"
        },
        {
          "text": "a sense of adventure",
          "level": "B2",
          "meaning": "excitement about unfamiliar experiences",
          "kind": "word"
        },
        {
          "text": "woodland trails",
          "level": "B2",
          "meaning": "paths through areas with trees",
          "kind": "word"
        }
      ],
      [
        {
          "text": "scenic surroundings",
          "level": "B2",
          "meaning": "beautiful views around you",
          "kind": "word"
        },
        {
          "text": "escape the crowds",
          "level": "B2",
          "meaning": "get away from busy places",
          "kind": "word"
        },
        {
          "text": "tranquil countryside",
          "level": "B2",
          "meaning": "peaceful rural areas",
          "kind": "word"
        }
      ],
      [
        {
          "text": "an adventurous pursuit",
          "level": "B2",
          "meaning": "an exciting activity requiring effort",
          "kind": "word"
        },
        {
          "text": "a personal challenge",
          "level": "B2",
          "meaning": "something testing your own abilities",
          "kind": "word"
        },
        {
          "text": "a guided hike",
          "level": "B2",
          "meaning": "a long walk led by someone",
          "kind": "word"
        }
      ]
    ],
    "p2": [
      [
        {
          "text": "unspoilt scenery",
          "level": "B2",
          "meaning": "natural views with little human damage",
          "kind": "word"
        },
        {
          "text": "a remote location",
          "level": "B2",
          "meaning": "a place far from busy areas",
          "kind": "word"
        },
        {
          "text": "during a school break",
          "level": "B2",
          "meaning": "at a time away from normal lessons",
          "kind": "word"
        },
        {
          "text": "take in",
          "level": "B2",
          "meaning": "look at and appreciate something",
          "kind": "word"
        },
        {
          "text": "a sense of tranquillity",
          "level": "B2",
          "meaning": "a feeling of deep calm",
          "kind": "word"
        }
      ]
    ],
    "p3": [
      [
        {
          "text": "psychological wellbeing",
          "level": "B2",
          "meaning": "a healthy and balanced mental state",
          "kind": "word"
        },
        {
          "text": "relief from stress",
          "level": "B2",
          "meaning": "a reduction in worry and pressure",
          "kind": "word"
        },
        {
          "text": "restorative activities",
          "level": "B2",
          "meaning": "things that help you recover energy",
          "kind": "word"
        },
        {
          "text": "personal preferences",
          "level": "B2",
          "meaning": "different choices that suit individuals",
          "kind": "word"
        },
        {
          "text": "a healthier balance",
          "level": "B2",
          "meaning": "a better mixture of work and rest",
          "kind": "word"
        }
      ],
      [
        {
          "text": "accessible open spaces",
          "level": "B2",
          "meaning": "outdoor areas everyone can reach",
          "kind": "word"
        },
        {
          "text": "public health benefits",
          "level": "B2",
          "meaning": "advantages for the community’s health",
          "kind": "word"
        },
        {
          "text": "urban parks",
          "level": "B2",
          "meaning": "public outdoor areas within cities",
          "kind": "word"
        },
        {
          "text": "competing land uses",
          "level": "B2",
          "meaning": "different purposes needing the same space",
          "kind": "word"
        },
        {
          "text": "liveable cities",
          "level": "B2",
          "meaning": "cities offering comfortable everyday life",
          "kind": "word"
        }
      ],
      [
        {
          "text": "environmental conservation",
          "level": "C1",
          "meaning": "protecting nature from harm",
          "kind": "word"
        },
        {
          "text": "fragile ecosystems",
          "level": "B2",
          "meaning": "natural systems easily damaged",
          "kind": "word"
        },
        {
          "text": "designated trails",
          "level": "B2",
          "meaning": "paths officially provided for visitors",
          "kind": "word"
        },
        {
          "text": "local livelihoods",
          "level": "B2",
          "meaning": "the ways local people earn money",
          "kind": "word"
        },
        {
          "text": "sustainable management",
          "level": "B2",
          "meaning": "running places responsibly over time",
          "kind": "word"
        }
      ],
      [
        {
          "text": "collective impact",
          "level": "B2",
          "meaning": "the combined effect of many actions",
          "kind": "word"
        },
        {
          "text": "behavioural change",
          "level": "B2",
          "meaning": "a shift in what people do",
          "kind": "word"
        },
        {
          "text": "reduced consumption",
          "level": "B2",
          "meaning": "using and buying fewer things",
          "kind": "word"
        },
        {
          "text": "systemic change",
          "level": "B2",
          "meaning": "changes to wider systems and rules",
          "kind": "word"
        },
        {
          "text": "shared responsibility",
          "level": "B2",
          "meaning": "a duty divided between different groups",
          "kind": "word"
        }
      ],
      [
        {
          "text": "hands-on experience",
          "level": "B2",
          "meaning": "learning through practical involvement",
          "kind": "word"
        },
        {
          "text": "natural curiosity",
          "level": "B2",
          "meaning": "a wish to discover and understand",
          "kind": "word"
        },
        {
          "text": "outdoor education",
          "level": "B2",
          "meaning": "learning activities outside classrooms",
          "kind": "word"
        },
        {
          "text": "unequal opportunities",
          "level": "B2",
          "meaning": "some people having fewer chances",
          "kind": "word"
        },
        {
          "text": "lasting engagement",
          "level": "B2",
          "meaning": "interest and involvement that continue",
          "kind": "word"
        }
      ],
      [
        {
          "text": "unequal access",
          "level": "B2",
          "meaning": "some people having fewer opportunities",
          "kind": "word"
        },
        {
          "text": "urban expansion",
          "level": "B2",
          "meaning": "cities taking up more land",
          "kind": "word"
        },
        {
          "text": "community gardens",
          "level": "B2",
          "meaning": "shared spaces for growing plants",
          "kind": "word"
        },
        {
          "text": "planning restrictions",
          "level": "B2",
          "meaning": "rules limiting how land is used",
          "kind": "word"
        },
        {
          "text": "equitable provision",
          "level": "B2",
          "meaning": "services offered fairly to different groups",
          "kind": "word"
        }
      ]
    ]
  },
  "food": {
    "p1": [
      [
        {
          "text": "full of flavour",
          "level": "B2",
          "meaning": "having a strong and enjoyable taste",
          "kind": "word"
        },
        {
          "text": "personal taste",
          "level": "B2",
          "meaning": "the flavours an individual enjoys",
          "kind": "word"
        },
        {
          "text": "seasonal ingredients",
          "level": "B2",
          "meaning": "foods naturally available at that time",
          "kind": "word"
        }
      ],
      [
        {
          "text": "cooking from scratch",
          "level": "B2",
          "meaning": "making food using basic ingredients",
          "kind": "word"
        },
        {
          "text": "creative freedom",
          "level": "B2",
          "meaning": "being able to make your own choices",
          "kind": "word"
        },
        {
          "text": "a tried-and-tested recipe",
          "level": "B2",
          "meaning": "instructions known to work well",
          "kind": "word"
        }
      ],
      [
        {
          "text": "quality time",
          "level": "B2",
          "meaning": "time spent giving people full attention",
          "kind": "word"
        },
        {
          "text": "strengthen bonds",
          "level": "B2",
          "meaning": "make relationships closer",
          "kind": "word"
        },
        {
          "text": "a shared meal",
          "level": "B2",
          "meaning": "food eaten together with others",
          "kind": "word"
        }
      ],
      [
        {
          "text": "an inviting atmosphere",
          "level": "B2",
          "meaning": "a place feeling welcoming and pleasant",
          "kind": "word"
        },
        {
          "text": "good value",
          "level": "B2",
          "meaning": "worth the money you pay",
          "kind": "word"
        },
        {
          "text": "locally sourced ingredients",
          "level": "B2",
          "meaning": "foods obtained from nearby producers",
          "kind": "word"
        }
      ],
      [
        {
          "text": "an acquired taste",
          "level": "B2",
          "meaning": "something you learn to enjoy",
          "kind": "word"
        },
        {
          "text": "changing preferences",
          "level": "B2",
          "meaning": "different things becoming appealing",
          "kind": "word"
        },
        {
          "text": "a wider variety",
          "level": "B2",
          "meaning": "a greater range of different choices",
          "kind": "word"
        }
      ],
      [
        {
          "text": "culinary curiosity",
          "level": "B2",
          "meaning": "interest in unfamiliar foods and cooking",
          "kind": "word"
        },
        {
          "text": "broaden my palate",
          "level": "B2",
          "meaning": "learn to enjoy more flavours",
          "kind": "word"
        },
        {
          "text": "an unfamiliar cuisine",
          "level": "B2",
          "meaning": "a style of food new to you",
          "kind": "word"
        }
      ]
    ],
    "p2": [
      [
        {
          "text": "a memorable occasion",
          "level": "B2",
          "meaning": "an event you remember clearly",
          "kind": "word"
        },
        {
          "text": "on a special occasion",
          "level": "B2",
          "meaning": "during an important or meaningful event",
          "kind": "word"
        },
        {
          "text": "extended family",
          "level": "B2",
          "meaning": "relatives beyond parents and their children",
          "kind": "word"
        },
        {
          "text": "a homemade dish",
          "level": "B2",
          "meaning": "food cooked in someone’s home",
          "kind": "word"
        },
        {
          "text": "strengthen bonds",
          "level": "B2",
          "meaning": "make relationships closer",
          "kind": "word"
        }
      ]
    ],
    "p3": [
      [
        {
          "text": "cultural significance",
          "level": "B2",
          "meaning": "importance to a community or culture",
          "kind": "word"
        },
        {
          "text": "a shared identity",
          "level": "B2",
          "meaning": "a feeling of belonging together",
          "kind": "word"
        },
        {
          "text": "festive traditions",
          "level": "B2",
          "meaning": "customs followed during celebrations",
          "kind": "word"
        },
        {
          "text": "diverse dietary needs",
          "level": "B2",
          "meaning": "different food requirements people have",
          "kind": "word"
        },
        {
          "text": "a sense of togetherness",
          "level": "B2",
          "meaning": "a feeling of being united",
          "kind": "word"
        }
      ],
      [
        {
          "text": "culinary heritage",
          "level": "C1",
          "meaning": "food traditions passed between generations",
          "kind": "word"
        },
        {
          "text": "intergenerational connections",
          "level": "B2",
          "meaning": "relationships between younger and older people",
          "kind": "word"
        },
        {
          "text": "family recipes",
          "level": "B2",
          "meaning": "cooking instructions shared within families",
          "kind": "word"
        },
        {
          "text": "evolving traditions",
          "level": "B2",
          "meaning": "customs changing gradually over time",
          "kind": "word"
        },
        {
          "text": "cultural continuity",
          "level": "B2",
          "meaning": "traditions continuing across generations",
          "kind": "word"
        }
      ],
      [
        {
          "text": "shifting lifestyles",
          "level": "B2",
          "meaning": "changes in the way people live",
          "kind": "word"
        },
        {
          "text": "time constraints",
          "level": "B2",
          "meaning": "limits caused by little available time",
          "kind": "word"
        },
        {
          "text": "ready-made meals",
          "level": "B2",
          "meaning": "food prepared before you buy it",
          "kind": "word"
        },
        {
          "text": "cultural influences",
          "level": "B2",
          "meaning": "effects from other ways of life",
          "kind": "word"
        },
        {
          "text": "changing consumption patterns",
          "level": "B2",
          "meaning": "different habits in what people use",
          "kind": "word"
        }
      ],
      [
        {
          "text": "practical convenience",
          "level": "B2",
          "meaning": "making everyday tasks easier",
          "kind": "word"
        },
        {
          "text": "time-saving alternatives",
          "level": "B2",
          "meaning": "other choices that take less time",
          "kind": "word"
        },
        {
          "text": "pre-prepared ingredients",
          "level": "B2",
          "meaning": "food already partly prepared",
          "kind": "word"
        },
        {
          "text": "nutritional value",
          "level": "B2",
          "meaning": "how useful food is for health",
          "kind": "word"
        },
        {
          "text": "informed choices",
          "level": "B2",
          "meaning": "decisions made with good information",
          "kind": "word"
        }
      ],
      [
        {
          "text": "waste prevention",
          "level": "B2",
          "meaning": "stopping useful things being thrown away",
          "kind": "word"
        },
        {
          "text": "responsible consumption",
          "level": "B2",
          "meaning": "using resources with care",
          "kind": "word"
        },
        {
          "text": "portion control",
          "level": "B2",
          "meaning": "managing how much food is served",
          "kind": "word"
        },
        {
          "text": "logistical challenges",
          "level": "B2",
          "meaning": "difficulties organising storage and delivery",
          "kind": "word"
        },
        {
          "text": "sustainable habits",
          "level": "B2",
          "meaning": "routines that reduce long-term harm",
          "kind": "word"
        }
      ],
      [
        {
          "text": "preserve traditions",
          "level": "B2",
          "meaning": "keep customs alive over time",
          "kind": "word"
        },
        {
          "text": "practical independence",
          "level": "B2",
          "meaning": "being able to manage everyday needs",
          "kind": "word"
        },
        {
          "text": "pass down recipes",
          "level": "B2",
          "meaning": "teach cooking instructions to younger people",
          "kind": "word"
        },
        {
          "text": "changing priorities",
          "level": "B2",
          "meaning": "different things becoming important",
          "kind": "word"
        },
        {
          "text": "cultural resilience",
          "level": "B2",
          "meaning": "a culture’s ability to continue through change",
          "kind": "word"
        }
      ]
    ]
  }
};
  const FUNCTIONS = {
  "opinion": [
    {
      "text": "From my perspective,…",
      "level": "B2",
      "meaning": "Introduce your own view.",
      "kind": "expression"
    },
    {
      "text": "What strikes me is…",
      "level": "C1",
      "meaning": "Point out something you find noticeable.",
      "kind": "expression"
    },
    {
      "text": "I tend to think…",
      "level": "B2",
      "meaning": "Give a view without sounding absolute.",
      "kind": "expression"
    }
  ],
  "reason": [
    {
      "text": "A major factor is…",
      "level": "B2",
      "meaning": "Introduce an important cause.",
      "kind": "expression"
    },
    {
      "text": "This largely stems from…",
      "level": "C1",
      "meaning": "Explain the main source of a situation.",
      "kind": "expression"
    },
    {
      "text": "One underlying reason is…",
      "level": "C1",
      "meaning": "Introduce a cause beneath the obvious explanation.",
      "kind": "expression"
    }
  ],
  "example": [
    {
      "text": "A case in point…",
      "level": "C1",
      "meaning": "Introduce a clear example supporting your idea.",
      "kind": "expression"
    },
    {
      "text": "To illustrate this,…",
      "level": "B2",
      "meaning": "Move from an idea to a specific example.",
      "kind": "expression"
    },
    {
      "text": "In practical terms,…",
      "level": "B2",
      "meaning": "Show how the idea works in real life.",
      "kind": "expression"
    }
  ],
  "balance": [
    {
      "text": "To some extent,…",
      "level": "B2",
      "meaning": "Show that something is partly true.",
      "kind": "expression"
    },
    {
      "text": "A possible drawback is…",
      "level": "B2",
      "meaning": "Introduce a disadvantage.",
      "kind": "expression"
    },
    {
      "text": "There is a trade-off…",
      "level": "C1",
      "meaning": "Explain a benefit that has a cost.",
      "kind": "expression"
    }
  ],
  "conclusion": [
    {
      "text": "Taking everything into account,…",
      "level": "B2",
      "meaning": "Consider the different sides before concluding.",
      "kind": "expression"
    },
    {
      "text": "The key consideration is…",
      "level": "C1",
      "meaning": "Identify what matters most.",
      "kind": "expression"
    },
    {
      "text": "On balance, I’d say…",
      "level": "B2",
      "meaning": "Give your overall judgement.",
      "kind": "expression"
    }
  ],
  "opening": [
    {
      "text": "What comes to mind…",
      "level": "B2",
      "meaning": "Introduce the example you remember.",
      "kind": "expression"
    },
    {
      "text": "Particularly memorable was…",
      "level": "C1",
      "meaning": "Highlight a choice that made an impression.",
      "kind": "expression"
    },
    {
      "text": "What stands out is…",
      "level": "B2",
      "meaning": "Introduce a striking feature.",
      "kind": "expression"
    }
  ],
  "where": [
    {
      "text": "Within easy reach…",
      "level": "B2",
      "meaning": "Explain that a place is easy to get to.",
      "kind": "expression"
    },
    {
      "text": "In the vicinity of…",
      "level": "C1",
      "meaning": "Continue with a nearby place.",
      "kind": "expression"
    },
    {
      "text": "Situated just outside…",
      "level": "B2",
      "meaning": "Describe the location beyond a named place.",
      "kind": "expression"
    }
  ],
  "when": [
    {
      "text": "Around that time,…",
      "level": "B2",
      "meaning": "Set the time of your story.",
      "kind": "expression"
    },
    {
      "text": "It coincided with…",
      "level": "C1",
      "meaning": "Connect it to another event happening then.",
      "kind": "expression"
    },
    {
      "text": "At that stage,…",
      "level": "B2",
      "meaning": "Describe a point in your life or experience.",
      "kind": "expression"
    }
  ],
  "who": [
    {
      "text": "What we share is…",
      "level": "B2",
      "meaning": "Introduce a shared interest or quality.",
      "kind": "expression"
    },
    {
      "text": "A positive influence…",
      "level": "B2",
      "meaning": "Describe someone who helped you develop.",
      "kind": "expression"
    },
    {
      "text": "We share an interest…",
      "level": "B2",
      "meaning": "Continue with “in” and a shared activity.",
      "kind": "expression"
    }
  ],
  "how": [
    {
      "text": "Through trial and error,…",
      "level": "B2",
      "meaning": "Describe learning by trying and adjusting.",
      "kind": "expression"
    },
    {
      "text": "Gradually, I became…",
      "level": "B2",
      "meaning": "Describe a change that developed over time.",
      "kind": "expression"
    },
    {
      "text": "The process involved…",
      "level": "C1",
      "meaning": "Explain the main steps or activities.",
      "kind": "expression"
    }
  ],
  "detail": [
    {
      "text": "What struck me was…",
      "level": "C1",
      "meaning": "Introduce a detail you found remarkable.",
      "kind": "expression"
    },
    {
      "text": "A distinctive feature was…",
      "level": "C1",
      "meaning": "Describe what made it different.",
      "kind": "expression"
    },
    {
      "text": "It was characterised by…",
      "level": "C1",
      "meaning": "Continue with qualities typical of the thing.",
      "kind": "expression"
    }
  ],
  "meaning": [
    {
      "text": "It left me feeling…",
      "level": "B2",
      "meaning": "Explain your emotional reaction.",
      "kind": "expression"
    },
    {
      "text": "With hindsight,…",
      "level": "C1",
      "meaning": "Explain what you understand looking back.",
      "kind": "expression"
    },
    {
      "text": "It gave me insight…",
      "level": "C1",
      "meaning": "Continue with “into” and what you understood.",
      "kind": "expression"
    }
  ],
  "prediction": [
    {
      "text": "It is conceivable that…",
      "level": "C1",
      "meaning": "Introduce a possible future development.",
      "kind": "expression"
    },
    {
      "text": "There may well be…",
      "level": "B2",
      "meaning": "Describe a possibility you think is likely.",
      "kind": "expression"
    },
    {
      "text": "Much will depend on…",
      "level": "B2",
      "meaning": "Explain a condition affecting the future.",
      "kind": "expression"
    }
  ],
  "comparison": [
    {
      "text": "By comparison,…",
      "level": "B2",
      "meaning": "Contrast one situation with another.",
      "kind": "expression"
    },
    {
      "text": "A marked difference is…",
      "level": "C1",
      "meaning": "Highlight an important contrast.",
      "kind": "expression"
    },
    {
      "text": "In contrast to…",
      "level": "B2",
      "meaning": "Continue with the situation being compared.",
      "kind": "expression"
    }
  ]
};
  function bank(partId,theme,index,group) {
    const ids=partId==='p1'?['opinion','reason','example']:partId==='p2'?['opening','cue1','cue2','cue3','meaning']:['opinion','reason','example','balance','conclusion'];
    const primary=TOPICS[theme.id]?.[partId]?.[partId==='p2'?0:index]?.[ids.indexOf(group.id)];
    let purpose=group.id;
    if(partId==='p2' && group.id.startsWith('cue')) {
      const cue=theme.p2.bullets[Number(group.id.slice(3))-1];
      purpose=/where/.test(cue)?'where':/when/.test(cue)?'when':/who/.test(cue)?'who':/how/.test(cue)?'how':'detail';
    }
    if(partId==='p3' && group.id==='opinion')purpose=group.label==='Prediction'?'prediction':group.label==='Main comparison'?'comparison':'opinion';
    const seen=new Set();
    return [primary,...(FUNCTIONS[purpose]||FUNCTIONS.detail)].filter(item=>{
      if(!item||seen.has(item.text.toLocaleLowerCase()))return false;
      seen.add(item.text.toLocaleLowerCase());return true;
    }).map(item=>({...item}));
  }
  return {bank};
})();
