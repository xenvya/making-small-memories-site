export const business = {
  name: "Making Small Memories",
  legalName: "Making Small Memories LLC",
  contact: "John C. Small Jr.",
  partner: "Veronica Kouassi Small",
  couple: "John C. Small Jr. & Veronica Kouassi Small",
  phone: "757-232-7664",
  tel: "+17572327664",
  email: "johncurtis.small324@gmail.com",
  mission:
    "We help people turn everyday moments into meaningful memories. Through thoughtful experiences, personalized details, and heartfelt creativity, we create opportunities to slow down, connect, celebrate, and cherish the little moments that become the stories we remember most.",
  vision:
    "A world where the small moments matter most—where connection, joy, and intentional experiences bring people closer together.",
  about:
    "Making Small Memories brings together travel, life coaching, VA disability enhancement, retirement planning, and investment education. Our services are especially relevant to veterans, active-duty military, and people moving into civilian life or retirement.",
};
export const services = [
  {
    id: "travel",
    label: "Travel services",
    short: "Go somewhere. Feel something.",
    category: "Explore",
    description:
      "Make room for the experience. We help coordinate the details of your trip, so you can focus on making memories.",
    details: [
      "End-to-end travel advising and trip coordination",
      "Tailored itineraries for retirement travel",
      "International destination and relocation exploration",
    ],
    note: "For the places you have been meaning to go.",
  },
  {
    id: "coaching",
    label: "Life coaching",
    short: "Find your footing in what’s next.",
    category: "Grow",
    description:
      "A change in direction can bring new questions. Explore personal goals, sustainable routines, and the transition from military to civilian life.",
    details: [
      "Military separation and transition support",
      "Accountability and long-term goal setting",
      "Daily routines and stress management through change",
    ],
    note: "For a new direction, at your own pace.",
  },
  {
    id: "benefits",
    label: "VA disability enhancement",
    short: "Understand the benefits you’ve earned.",
    category: "Navigate",
    description:
      "Guidance to help you understand benefit options and organize the information behind your claims roadmap.",
    details: [
      "Service-record and secondary-condition organization",
      "Claims roadmap coaching",
      "Guidance on HISA, dental enrollment, and CHAMPVA options",
    ],
    note: "For clearer questions and a more organized next step.",
  },
  {
    id: "retirement",
    label: "Retirement planning",
    short: "Plan for a life, not just a date.",
    category: "Reimagine",
    description:
      "Think beyond the last day of work. Explore purpose, community, and the practical decisions that shape life after a career.",
    details: [
      "Lifestyle, identity, and community planning",
      "Social Security timing coordination with partners",
      "Workplace contribution and health-coverage planning",
    ],
    note: "For a retirement that feels like your own.",
  },
  {
    id: "investment",
    label: "Investment options & strategies",
    short: "Build understanding. Find perspective.",
    category: "Prepare",
    description:
      "Explore how different accounts and investment approaches fit together, with education around diversification and a stable financial foundation.",
    details: [
      "Brokerage and workplace account coordination",
      "Education on self-directed IRAs and diversification",
      "Cash reserves, low-risk bonds, and growth foundations",
    ],
    note: "For thoughtful conversations about your future.",
  },
] as const;
export const steps = [
  {
    title: "Start with what matters.",
    body: "Tell John what is changing, what you are hoping for, and where you would welcome guidance.",
  },
  {
    title: "Explore your options.",
    body: "Ask about the services that fit your goals, the support involved, and the associated fees.",
  },
  {
    title: "Choose your next step.",
    body: "Discuss the scope and timing with John before deciding how you would like to move forward.",
  },
];
export const faqs = [
  {
    q: "Who is Making Small Memories for?",
    a: "Our services support individuals and families, with particular attention to veterans, active-duty military, and people transitioning into civilian life or retirement.",
  },
  {
    q: "Can I ask about more than one service?",
    a: "Yes. Our approach brings travel, personal goals, benefits, retirement, and investment education into the same conversation. Tell John which areas you would like to explore.",
  },
  {
    q: "What kind of travel can I discuss?",
    a: "Trip coordination, retirement travel, international destinations, and travel to explore potential relocation are all part of our travel services.",
  },
  {
    q: "What does VA disability enhancement support include?",
    a: "Claims roadmap coaching, organizing service records and secondary conditions, and guidance on benefits such as HISA, dental enrollment, and CHAMPVA. Discuss your circumstances with John to understand the scope of support.",
  },
  {
    q: "How do I find out about pricing and payment?",
    a: "Contact John to discuss the service, scope, fees, and payment arrangements before making a commitment.",
  },
  {
    q: "How do I arrange a consultation?",
    a: "Use the appointment section below, call 757-232-7664, or email johncurtis.small324@gmail.com to discuss a suitable time.",
  },
  {
    q: "What should I share in my first message?",
    a: "Your name, a way to reach you, and the service you are interested in are a good starting point. Please do not send medical records or other highly sensitive information through email or scheduling forms.",
  },
];
export const concepts = [
  {
    slug: "concept-one",
    theme: "keepsake",
    number: "01",
    name: "The Keepsake",
    line: "A life well lived. A moment well kept.",
    rationale:
      "For individuals and families seeking a personal connection. Warm paper tones, literary typography, and a collected, intimate composition make the first conversation feel approachable.",
    tags: "Warm · Personal · Editorial",
  },
  {
    slug: "concept-two",
    theme: "horizon",
    number: "02",
    name: "Open Horizon",
    line: "There’s more life out there.",
    rationale:
      "For retirees and explorers looking forward to possibility. Ocean blue, expansive scenery, and an interactive service compass turn planning into an invitation to explore.",
    tags: "Expansive · Optimistic · Fluid",
  },
  {
    slug: "concept-three",
    theme: "fieldnotes",
    number: "03",
    name: "Field Notes",
    line: "A little direction. A world of possibility.",
    rationale:
      "For veterans and people navigating a major transition. An olive field-guide palette, precise notation, and a scroll-aware route through the services create a calm sense of orientation.",
    tags: "Grounded · Clear · Purposeful",
  },
  {
    slug: "concept-four",
    theme: "chapter",
    number: "04",
    name: "Golden Hour",
    line: "Some moments change everything.",
    rationale:
      "For people ready to make life more meaningful. A cinematic aubergine-and-gold palette, intimate portraiture, animated celestial linework, and a hands-on journey selector bring warmth, energy, and discovery.",
    tags: "Cinematic · Intimate · Alive",
  },
  {
    slug: "concept-five",
    theme: "kinetic",
    number: "05",
    name: "Living Moments",
    line: "Life, in motion.",
    rationale:
      "For curious people who want to feel possibility. A responsive particle field, scroll-driven typography, moving portrait composition, and a draggable service journey make this the most interactive direction.",
    tags: "Kinetic · Playful · Exploratory",
  },
] as const;
export type Theme = (typeof concepts)[number]["theme"];
