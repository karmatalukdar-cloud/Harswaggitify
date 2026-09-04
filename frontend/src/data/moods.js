const t = (name, artist, album) => ({ name, artist, album, query: `${name} ${artist.replace(/ · /g, " ")}` });

export const moods = [
  { id: "soft", label: "Soft & floaty", note: "for the days that feel like satin", keywords: ["soft", "calm", "cozy", "slow", "gentle", "warm", "cuddle", "sleepy", "rain"] },
  { id: "main-character", label: "Main character", note: "a little drama, a lot of sparkle", keywords: ["drama", "sparkle", "main", "hype", "party", "iconic", "strut", "glam", "energy"] },
  { id: "healing", label: "Healing era", note: "slow songs for a tender heart", keywords: ["sad", "cry", "heal", "hurt", "miss", "lonely", "tender", "tired", "heart"] },
  { id: "late-night", label: "After midnight", note: "city lights and honest feelings", keywords: ["night", "midnight", "city", "drive", "late", "moon", "stars", "honest", "2am"] },
  { id: "unbothered", label: "Unbothered", note: "pretty, powerful, completely yours", keywords: ["confident", "boss", "slay", "power", "queen", "unbothered", "pretty", "mine", "fierce"] },
];

export const tracklists = {
  soft: [
    t("Best Part", "Daniel Caesar · H.E.R.", "Freudian"), t("Get You", "Daniel Caesar · Kali Uchis", "Freudian"), t("Pink + White", "Frank Ocean", "Blonde"), t("fallingforyou", "The 1975", "The 1975"),
    t("Japanese Denim", "Daniel Caesar", "Freudian"), t("Snooze", "SZA", "SOS"), t("Adorn", "Miguel", "Kaleidoscope Dream"), t("Come Through and Chill", "Miguel · J. Cole", "War & Leisure"),
    t("Location", "Khalid", "American Teen"), t("Ivy", "Frank Ocean", "Blonde"), t("Hold On, We're Going Home", "Drake · Majid Jordan", "Nothing Was the Same"), t("Redbone", "Childish Gambino", "Awaken, My Love!"),
    t("Lovers Rock", "TV Girl", "French Exit"), t("Sweet Disposition", "The Temper Trap", "Conditions"), t("Nothing Even Matters", "Lauryn Hill · D'Angelo", "The Miseducation of Lauryn Hill"), t("Brown Sugar", "D'Angelo", "Brown Sugar"),
    t("I Wanna Be Yours", "Arctic Monkeys", "AM"), t("Blessed", "Daniel Caesar", "Freudian"), t("Cherry Wine", "Hozier", "Hozier"), t("Slow Dancing in the Dark", "Joji", "BALLADS 1"),
  ],
  "main-character": [
    t("SICKO MODE", "Travis Scott", "ASTROWORLD"), t("Nonstop", "Drake", "Scorpion"), t("Praise The Lord (Da Shine)", "A$AP Rocky · Skepta", "TESTING"), t("POWER", "Kanye West", "My Beautiful Dark Twisted Fantasy"),
    t("goosebumps", "Travis Scott", "Birds in the Trap Sing McKnight"), t("God's Plan", "Drake", "Scorpion"), t("Fashion Killa", "A$AP Rocky", "LONG.LIVE.A$AP"), t("Stronger", "Kanye West", "Graduation"),
    t("HIGHEST IN THE ROOM", "Travis Scott", "JACKBOYS"), t("Nice For What", "Drake", "Scorpion"), t("Sundress", "A$AP Rocky", "Sundress"), t("Flashing Lights", "Kanye West", "Graduation"),
    t("Rich Flex", "Drake · 21 Savage", "Her Loss"), t("good 4 u", "Olivia Rodrigo", "SOUR"), t("Vogue", "Madonna", "I'm Breathless"), t("No Scrubs", "TLC", "FanMail"),
    t("Rhythm Nation", "Janet Jackson", "Rhythm Nation 1814"), t("Antidote", "Travis Scott", "Rodeo"), t("Peso", "A$AP Rocky", "LIVE.LOVE.A$AP"), t("Started From the Bottom", "Drake", "Nothing Was the Same"),
  ],
  healing: [
    t("Marvins Room", "Drake", "Take Care"), t("Jungle", "Drake", "If You're Reading This It's Too Late"), t("Self Control", "Frank Ocean", "Blonde"), t("Runaway", "Kanye West", "My Beautiful Dark Twisted Fantasy"),
    t("Street Lights", "Kanye West", "808s & Heartbreak"), t("Somebody Else", "The 1975", "I like it when you sleep..."), t("Be Alright", "Dean Lewis", "A Place We Knew"), t("Good Days", "SZA", "SOS"),
    t("Loose", "Daniel Caesar", "Freudian"), t("We Find Love", "Daniel Caesar", "Freudian"), t("The Weekend", "SZA", "Ctrl"), t("About You", "The 1975", "Being Funny in a Foreign Language"),
    t("Nights", "Frank Ocean", "Blonde"), t("90210", "Travis Scott", "Rodeo"), t("Un-thinkable (I'm Ready)", "Alicia Keys", "The Element of Freedom"), t("everything i wanted", "Billie Eilish", "everything i wanted"),
    t("Nothing Compares 2 U", "Sinéad O'Connor", "I Do Not Want What I Haven't Got"), t("Un-Break My Heart", "Toni Braxton", "Secrets"), t("Killing Me Softly With His Song", "Fugees", "The Score"), t("Heartbreak Anniversary", "Giveon", "Take Time"),
  ],
  "late-night": [
    t("Love It If We Made It", "The 1975", "A Brief Inquiry into Online Relationships"), t("The Sound", "The 1975", "I like it when you sleep..."), t("Robbers", "The 1975", "The 1975"), t("Passionfruit", "Drake", "More Life"),
    t("Feel No Ways", "Drake", "Views"), t("SKELETONS", "Travis Scott", "ASTROWORLD"), t("Waves", "Kanye West", "The Life of Pablo"), t("Bound 2", "Kanye West", "Yeezus"),
    t("L$D", "A$AP Rocky", "AT.LONG.LAST.A$AP"), t("Everyday", "A$AP Rocky · Rod Stewart · Miguel · Mark Ronson", "AT.LONG.LAST.A$AP"), t("After Dark", "Mr.Kitty", "Time"), t("Crew", "GoldLink · Brent Faiyaz · Shy Glizzy", "At What Cost"),
    t("Love Galore", "SZA · Travis Scott", "Ctrl"), t("Blinding Lights", "The Weeknd", "After Hours"), t("Take On Me", "a-ha", "Hunting High and Low"), t("Tainted Love", "Soft Cell", "Non-Stop Erotic Cabaret"),
    t("Poison", "Bell Biv DeVoe", "Poison"), t("Pony", "Ginuwine", "Ginuwine... the Bachelor"), t("Chocolate", "The 1975", "The 1975"), t("Nikes", "Frank Ocean", "Blonde"),
  ],
  unbothered: [
    t("Wild for the Night", "A$AP Rocky · Skrillex", "LONG.LIVE.A$AP"), t("Diamonds", "Rihanna", "Unapologetic"), t("Needed Me", "Rihanna", "ANTI"), t("Kill Bill", "SZA", "SOS"),
    t("Say So", "Doja Cat", "Hot Pink"), t("Irreplaceable", "Beyoncé", "B'Day"), t("Bad Girls", "M.I.A.", "Matangi"), t("Toxic", "Britney Spears", "In the Zone"),
    t("Independent Women, Pt. 1", "Destiny's Child", "Survivor"), t("Believe", "Cher", "Believe"), t("Express Yourself", "Madonna", "Like a Prayer"), t("What's Love Got to Do with It", "Tina Turner", "Private Dancer"),
    t("Hotline Bling", "Drake", "Views"), t("Controlla", "Drake", "Views"), t("Can't Tell Me Nothing", "Kanye West", "Graduation"), t("Yamborghini High", "A$AP Mob · Juicy J", "Cozy Tapes Vol. 1"),
    t("BUTTERFLY EFFECT", "Travis Scott", "ASTROWORLD"), t("Truffle Butter", "Nicki Minaj · Drake · Lil Wayne", "The Pinkprint"), t("Woman", "Doja Cat", "Planet Her"), t("Chun-Li", "Nicki Minaj", "Queen"),
  ],
};

export const detectMood = (text) => {
  const lower = text.toLowerCase();
  return moods.find((mood) => mood.keywords.some((word) => lower.includes(word)))?.id || null;
};
