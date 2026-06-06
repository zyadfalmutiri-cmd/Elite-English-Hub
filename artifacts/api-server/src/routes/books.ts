import { Router } from "express";

export const booksRouter = Router();

// Real public domain books with substantial excerpts and comprehension questions
const booksData = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    categoryAr: "رواية",
    level: "B2",
    coverColor: "#1a365d",
    description: "A story of wealth, love, and the American Dream in the 1920s.",
    descriptionAr: "قصة عن الثروة والحب والحلم الأمريكي في عشرينيات القرن العشرين.",
    chapters: [
      {
        title: "Chapter 1 - The Narrator",
        content: `In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.

"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world haven't had the advantages that you've had."

He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.

My family have been prominent, well-to-do people in this Middle Western city for three generations. The Carraways are something of a clan, and we have a tradition that we're descended from the Dukes of Buccleuch, but the actual founder of my line was my grandfather's brother, who came here in fifty-one, sent a substitute to the Civil War, and started the wholesale hardware business that my father carries on today.

I graduated from New Haven in 1915, just a quarter of a century after my father, and a little later I participated in that delayed Teutonic migration known as the Great War. I enjoyed the counter-raid so thoroughly that I came back restless. Instead of being the warm centre of the world, the Middle West now seemed like the ragged edge of the universe — so I decided to go East and learn the bond business.`
      }
    ],
    questions: [
      { question: "What advice did the narrator's father give him?", options: ["To always be honest", "Not to criticize others because they may not have had the same advantages", "To work hard in life", "To move to the East"], correctIndex: 1 },
      { question: "What does the narrator say his habit of reserving judgment has done?", options: ["Made him wealthy", "Made him popular at parties", "Opened up many curious natures to him", "Helped him in business"], correctIndex: 2 },
      { question: "Where did the narrator graduate from?", options: ["Harvard", "Yale (New Haven)", "Princeton", "Columbia"], correctIndex: 1 },
      { question: "Why did the narrator decide to go East?", options: ["To find love", "The Middle West seemed like the ragged edge of the universe", "His father sent him", "To fight in the war"], correctIndex: 1 },
      { question: "What business does the narrator's family run?", options: ["Banking", "Wholesale hardware", "Real estate", "Farming"], correctIndex: 1 }
    ]
  },
  {
    id: 2,
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    category: "Self-Help",
    categoryAr: "تطوير الذات",
    level: "B1",
    coverColor: "#744210",
    description: "Classic principles of personal achievement and financial success.",
    descriptionAr: "مبادئ كلاسيكية للإنجاز الشخصي والنجاح المالي.",
    chapters: [
      {
        title: "Chapter 1 - Thoughts Are Things",
        content: `Truly, "thoughts are things," and powerful things at that, when they are mixed with definiteness of purpose, persistence, and a burning desire for their translation into riches, or other material objects.

Edwin C. Barnes discovered how true it is that men really do think and grow rich. His discovery did not come about at one sitting. It came little by little, beginning with a burning desire to become a business associate of the great Edison.

One of the chief characteristics of Barnes' desire was that it was definite. He wanted to work with Edison, not for him. He had nothing to start with, except the capacity to know what he wanted, and the determination to stand by that desire until he realized it.

When the opportunity came, it appeared in a different form, and from a different direction than Barnes had expected. That is one of the tricks of opportunity. It has a sly habit of slipping in by the back door, and often it comes disguised in the form of misfortune, or temporary defeat.

Barnes succeeded because he chose a definite goal, placed all his energy, all his willpower, all his effort, everything back of that goal. He did not become the partner of Edison the day he arrived. He was content to start in the most menial work, as long as it provided an opportunity to take even one step toward his cherished goal.`
      }
    ],
    questions: [
      { question: "According to the text, what makes thoughts powerful?", options: ["Reading books", "When mixed with purpose, persistence, and burning desire", "Having a lot of money", "Being educated"], correctIndex: 1 },
      { question: "What did Edwin C. Barnes want?", options: ["To work for Edison", "To become a business associate of Edison", "To invent something", "To become rich quickly"], correctIndex: 1 },
      { question: "How does opportunity often come according to the text?", options: ["Through hard work only", "Disguised as misfortune or temporary defeat", "Through education", "From family connections"], correctIndex: 1 },
      { question: "What was Barnes willing to do to achieve his goal?", options: ["Pay Edison money", "Start in the most menial work", "Study for years", "Move to another country"], correctIndex: 1 },
      { question: "What is the main message of this chapter?", options: ["Money is everything", "Definite goals with persistence lead to success", "Education is the key", "Luck determines success"], correctIndex: 1 }
    ]
  },
  {
    id: 3,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    category: "Science",
    categoryAr: "علوم",
    level: "C1",
    coverColor: "#1a202c",
    description: "Exploring the nature of time, space, and the universe.",
    descriptionAr: "استكشاف طبيعة الزمن والفضاء والكون.",
    chapters: [
      {
        title: "Chapter 1 - Our Picture of the Universe",
        content: `A well-known scientist once gave a public lecture on astronomy. He described how the earth orbits around the sun and how the sun, in turn, orbits around the center of a vast collection of stars called our galaxy. At the end of the lecture, a little old lady at the back of the room got up and said: "What you have told us is rubbish. The world is really a flat plate supported on the back of a giant tortoise." The scientist gave a superior smile before replying, "What is the tortoise standing on?" "You're very clever, young man, very clever," said the old lady. "But it's turtles all the way down!"

Most people would find the picture of our universe as an infinite tower of tortoises rather ridiculous, but why do we think we know better? What do we know about the universe, and how do we know it? Where did the universe come from, and where is it going? Did the universe have a beginning, and if so, what happened before then? What is the nature of time? Will it ever come to an end?

Recent breakthroughs in physics, made possible in part by fantastic new technologies, suggest answers to some of these longstanding questions. Someday these answers may seem as obvious to us as the earth orbiting the sun — or perhaps as ridiculous as a tower of tortoises. Only time will tell.`
      }
    ],
    questions: [
      { question: "What did the old lady claim the world was?", options: ["A sphere floating in space", "A flat plate on the back of a giant tortoise", "A cube", "A star"], correctIndex: 1 },
      { question: "What fundamental questions does Hawking raise?", options: ["Only about the earth", "About the universe's origin, time, and its future", "About biology", "About chemistry"], correctIndex: 1 },
      { question: "What has made recent breakthroughs in physics possible?", options: ["More scientists", "Fantastic new technologies", "Government funding", "Ancient knowledge"], correctIndex: 1 },
      { question: "What is the tone of the opening anecdote?", options: ["Angry", "Humorous and thought-provoking", "Sad", "Boring"], correctIndex: 1 },
      { question: "What does Hawking suggest about current scientific answers?", options: ["They are final", "They may someday seem obvious or ridiculous", "They are wrong", "They don't matter"], correctIndex: 1 }
    ]
  },
  {
    id: 4,
    title: "The Art of War",
    author: "Sun Tzu",
    category: "Strategy",
    categoryAr: "استراتيجية",
    level: "B1",
    coverColor: "#742a2a",
    description: "Ancient Chinese military strategy applicable to modern life and business.",
    descriptionAr: "استراتيجية عسكرية صينية قديمة قابلة للتطبيق في الحياة والأعمال الحديثة.",
    chapters: [
      {
        title: "Chapter 1 - Laying Plans",
        content: `Sun Tzu said: The art of war is of vital importance to the State. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.

The art of war, then, is governed by five constant factors, to be taken into account in one's deliberations, when seeking to determine the conditions obtaining in the field. These are: The Moral Law; Heaven; Earth; The Commander; Method and discipline.

The Moral Law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger. Heaven signifies night and day, cold and heat, times and seasons. Earth comprises distances, great and small; danger and security; open ground and narrow passes; the chances of life and death.

The Commander stands for the virtues of wisdom, sincerity, benevolence, courage and strictness. By method and discipline are to be understood the marshaling of the army in its proper subdivisions, the graduations of rank among the officers, the maintenance of roads by which supplies may reach the army, and the control of military expenditure.

These five heads should be familiar to every general: he who knows them will be victorious; he who knows them not will fail.`
      }
    ],
    questions: [
      { question: "According to Sun Tzu, what is the art of war?", options: ["A game", "Of vital importance to the State", "Only for soldiers", "Unimportant"], correctIndex: 1 },
      { question: "How many constant factors govern the art of war?", options: ["Three", "Four", "Five", "Seven"], correctIndex: 2 },
      { question: "What does 'The Moral Law' cause?", options: ["Fear in enemies", "People to be in accord with their ruler", "Wealth", "Confusion"], correctIndex: 1 },
      { question: "What virtues should a Commander have?", options: ["Only courage", "Wisdom, sincerity, benevolence, courage and strictness", "Wealth and power", "Speed and strength"], correctIndex: 1 },
      { question: "What happens to a general who knows these five factors?", options: ["He becomes rich", "He will be victorious", "He retires", "Nothing special"], correctIndex: 1 }
    ]
  },
  {
    id: 5,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Fiction",
    categoryAr: "رواية",
    level: "B2",
    coverColor: "#553c9a",
    description: "A witty exploration of love, class, and society in Regency England.",
    descriptionAr: "استكشاف ذكي للحب والطبقية والمجتمع في إنجلترا.",
    chapters: [
      {
        title: "Chapter 1",
        content: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.

However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.

"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"

Mr. Bennet replied that he had not.

"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."

Mr. Bennet made no answer.

"Do you not want to know who has taken it?" cried his wife impatiently.

"You want to tell me, and I have no objection to hearing it."

This was invitation enough.

"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week."

"What is his name?"

"Bingley."

"Is he married or single?"

"Oh! Single, my dear, to be sure! A single man of large fortune; four or five thousand a year. What a fine thing for our girls!"

"How so? How can it affect them?"

"My dear Mr. Bennet," replied his wife, "how can you be so tiresome! You must know that I am thinking of his marrying one of them."

"Is that his design in settling here?"

"Design! Nonsense, how can you talk so! But it is very likely that he may fall in love with one of them, and therefore you must visit him as soon as he comes."

"I see no occasion for that."`
      }
    ],
    questions: [
      { question: "What is the 'universal truth' stated at the beginning?", options: ["All men want to be rich", "A single man with fortune must want a wife", "Women should not work", "Marriage is unimportant"], correctIndex: 1 },
      { question: "What news does Mrs. Bennet share?", options: ["A new school opened", "Netherfield Park has been rented", "Someone died", "A war started"], correctIndex: 1 },
      { question: "Who is the new tenant of Netherfield?", options: ["Mr. Darcy", "Mr. Bingley", "Mr. Collins", "Mr. Wickham"], correctIndex: 1 },
      { question: "What does Mrs. Bennet hope will happen?", options: ["Mr. Bingley will hire her husband", "Mr. Bingley will marry one of her daughters", "They will move away", "Mr. Bingley will leave"], correctIndex: 1 },
      { question: "How would you describe Mr. Bennet's tone?", options: ["Excited and eager", "Dry and sarcastic", "Angry", "Sad"], correctIndex: 1 }
    ]
  },
  {
    id: 6,
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "Business",
    categoryAr: "أعمال",
    level: "B2",
    coverColor: "#22543d",
    description: "How today's entrepreneurs use continuous innovation to create successful businesses.",
    descriptionAr: "كيف يستخدم رواد الأعمال الابتكار المستمر لبناء مشاريع ناجحة.",
    chapters: [
      {
        title: "Chapter 1 - Start",
        content: `Entrepreneurship is management. A startup is an institution, not just a product, and so it requires a new kind of management specifically geared to its context of extreme uncertainty.

I believe that entrepreneurship requires a managerial discipline to harness the entrepreneurial opportunity we have been given. There are more entrepreneurs operating today than at any previous time in history. This has been made possible by dramatic changes in the global economy.

The Lean Startup method is not about cost, it is about speed. In a world that is changing faster than ever, startups need to be able to adapt quickly. The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere.

The Build-Measure-Learn feedback loop is at the core of the Lean Startup model. We need to focus our energies on minimizing the total time through this feedback loop. The first step is figuring out the problem that needs to be solved and then developing a minimum viable product (MVP) to begin the process of learning as quickly as possible.

Many startups fail not because they can't build a product, but because they build the wrong product. The Lean Startup methodology helps entrepreneurs test their vision continuously, to adapt and adjust before it's too late.`
      }
    ],
    questions: [
      { question: "According to the text, what is entrepreneurship?", options: ["Just having ideas", "Management", "Only about money", "A hobby"], correctIndex: 1 },
      { question: "What is the Lean Startup method about?", options: ["Reducing costs", "Speed and adaptation", "Hiring people", "Marketing"], correctIndex: 1 },
      { question: "What is at the core of the Lean Startup model?", options: ["Money", "The Build-Measure-Learn feedback loop", "Technology", "Investors"], correctIndex: 1 },
      { question: "What is an MVP?", options: ["Most Valuable Player", "Minimum Viable Product", "Maximum Value Proposition", "Main Vision Plan"], correctIndex: 1 },
      { question: "Why do many startups fail?", options: ["They can't build products", "They build the wrong product", "They have no money", "They have no team"], correctIndex: 1 }
    ]
  },
  {
    id: 7,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    categoryAr: "تطوير الذات",
    level: "B1",
    coverColor: "#2d3748",
    description: "Tiny changes, remarkable results. A proven framework for building good habits.",
    descriptionAr: "تغييرات صغيرة، نتائج مذهلة. إطار مثبت لبناء عادات جيدة.",
    chapters: [
      {
        title: "The Fundamentals - Why Tiny Changes Make a Big Difference",
        content: `It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. Too often, we convince ourselves that massive success requires massive action.

Meanwhile, improving by 1 percent isn't particularly notable — sometimes it isn't even noticeable — but it can be far more meaningful, especially in the long run. The difference a tiny improvement can make over time is astounding. Here's how the math works out: if you can get 1 percent better each day for one year, you'll end up thirty-seven times better by the time you're done. Conversely, if you get 1 percent worse each day for one year, you'll decline nearly down to zero.

Habits are the compound interest of self-improvement. The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them. They seem to make little difference on any given day and yet the impact they deliver over the months and years can be enormous.

Your outcomes are a lagging measure of your habits. Your net worth is a lagging measure of your financial habits. Your weight is a lagging measure of your eating habits. Your knowledge is a lagging measure of your learning habits.

You get what you repeat. If you want to predict where you'll end up in life, all you have to do is follow the curve of tiny gains or tiny losses, and see how your daily choices will compound ten or twenty years down the line.`
      }
    ],
    questions: [
      { question: "What do people often overestimate?", options: ["Small daily improvements", "One defining moment", "Their habits", "Their knowledge"], correctIndex: 1 },
      { question: "If you improve 1% daily for a year, how much better will you be?", options: ["10 times", "37 times", "100 times", "365 times"], correctIndex: 1 },
      { question: "What are habits compared to in the text?", options: ["Simple interest", "Compound interest of self-improvement", "A bank account", "A diet"], correctIndex: 1 },
      { question: "What is your net worth a lagging measure of?", options: ["Your job", "Your financial habits", "Your education", "Your age"], correctIndex: 1 },
      { question: "What is the main idea of this passage?", options: ["Big changes happen overnight", "Tiny daily improvements compound into remarkable results", "Habits don't matter", "Only talent matters"], correctIndex: 1 }
    ]
  },
  {
    id: 8,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    category: "History",
    categoryAr: "تاريخ",
    level: "C1",
    coverColor: "#4a5568",
    description: "A groundbreaking narrative of humanity's creation and evolution.",
    descriptionAr: "سرد رائد لخلق البشرية وتطورها.",
    chapters: [
      {
        title: "Part One - The Cognitive Revolution",
        content: `About 13.5 billion years ago, matter, energy, time and space came into being in what is known as the Big Bang. The story of these fundamental features of our universe is called physics.

About 300,000 years after their appearance, matter and energy started to coalesce into complex structures, called atoms, which then combined into molecules. The story of atoms, molecules and their interactions is called chemistry.

About 3.8 billion years ago, on a planet called Earth, certain molecules combined to form particularly large and intricate structures called organisms. The story of organisms is called biology.

About 70,000 years ago, organisms belonging to the species Homo sapiens started to form even more elaborate structures called cultures. The subsequent development of these human cultures is called history.

Three important revolutions shaped the course of history: the Cognitive Revolution kick-started history about 70,000 years ago. The Agricultural Revolution sped it up about 12,000 years ago. The Scientific Revolution, which got under way only 500 years ago, may well end history and start something completely different.

The most important thing to know about prehistoric humans is that they were insignificant animals with no more impact on their environment than gorillas, fireflies or jellyfish.`
      }
    ],
    questions: [
      { question: "When did the Big Bang occur according to the text?", options: ["3.8 billion years ago", "13.5 billion years ago", "70,000 years ago", "300,000 years ago"], correctIndex: 1 },
      { question: "What is the story of organisms called?", options: ["Physics", "Chemistry", "Biology", "History"], correctIndex: 2 },
      { question: "When did the Cognitive Revolution occur?", options: ["13.5 billion years ago", "3.8 billion years ago", "About 70,000 years ago", "500 years ago"], correctIndex: 2 },
      { question: "How many important revolutions shaped history?", options: ["Two", "Three", "Four", "Five"], correctIndex: 1 },
      { question: "What does Harari say about prehistoric humans?", options: ["They were powerful", "They were insignificant animals", "They were intelligent", "They ruled the earth"], correctIndex: 1 }
    ]
  },
  {
    id: 9,
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    category: "Mystery",
    categoryAr: "غموض",
    level: "B1",
    coverColor: "#1a202c",
    description: "The famous detective solves mysterious cases in Victorian London.",
    descriptionAr: "المحقق الشهير يحل قضايا غامضة في لندن الفيكتورية.",
    chapters: [
      {
        title: "A Scandal in Bohemia - Part 1",
        content: `To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.

He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer — excellent for drawing the veil from men's motives and actions. But for the trained reasoner to admit such intrusions into his own delicate and finely adjusted temperament was to introduce a distracting factor which might throw a doubt upon all his mental results.

And yet there was but one woman to him, and that woman was the late Irene Adler, of dubious and questionable memory.

I had seen little of Holmes lately. My marriage had drifted us away from each other. My own complete happiness, and the home-centred interests which rise up around the man who first finds himself master of his own establishment, were sufficient to absorb all my attention.`
      }
    ],
    questions: [
      { question: "Who is 'THE woman' to Sherlock Holmes?", options: ["Mrs. Watson", "Irene Adler", "Mrs. Hudson", "Mary Morstan"], correctIndex: 1 },
      { question: "How does Watson describe Holmes's mind?", options: ["Emotional and warm", "Cold, precise but admirably balanced", "Confused", "Simple"], correctIndex: 1 },
      { question: "What is Holmes's attitude toward love?", options: ["He embraces it", "He considers it a distracting factor", "He seeks it", "He writes about it"], correctIndex: 1 },
      { question: "Why had Watson seen little of Holmes lately?", options: ["Holmes was traveling", "Watson's marriage drifted them apart", "They had a fight", "Watson was ill"], correctIndex: 1 },
      { question: "What does Holmes consider emotions to be useful for?", options: ["Personal happiness", "Drawing the veil from men's motives and actions", "Making friends", "Nothing"], correctIndex: 1 }
    ]
  },
  {
    id: 10,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    category: "Finance",
    categoryAr: "مالية",
    level: "B2",
    coverColor: "#2c5282",
    description: "Timeless lessons on wealth, greed, and happiness.",
    descriptionAr: "دروس خالدة عن الثروة والطمع والسعادة.",
    chapters: [
      {
        title: "Introduction - The Greatest Show on Earth",
        content: `I love the question "What do you want to know about investing that we can't know?" because it forces you to think about what you don't know.

Ronald Read was a janitor and gas station attendant for most of his life. He fixed cars and shoveled snow. He was a quiet man who didn't draw much attention. When Read died in 2014 at age 92, his will revealed that he had accumulated $8 million — nearly all of which he left to charity.

People who knew him were baffled. Where did he get all that money? It turned out there was no secret. No lottery win. No inheritance. Read saved what little he could and invested it in blue chip stocks. Then he waited. For decades on end. That little sum compounded into $8 million.

Richard Fuscone was the opposite of Ronald Read. He was a Harvard-educated Merrill Lynch executive who retired in his 40s to become a philanthropist. But he borrowed heavily, got caught up in the 2008 financial crisis, and eventually went bankrupt.

The fascinating thing about these stories is that they have nothing to do with intelligence, education, or sophistication. Ronald Read had no financial education. Richard Fuscone had every advantage. The difference was behavior — patience, frugality, and letting compound interest work its magic versus overconfidence and debt.

Financial success is not a hard science. It's a soft skill, where how you behave is more important than what you know.`
      }
    ],
    questions: [
      { question: "What was Ronald Read's occupation?", options: ["A banker", "A janitor and gas station attendant", "A professor", "A doctor"], correctIndex: 1 },
      { question: "How much did Ronald Read accumulate?", options: ["$1 million", "$8 million", "$80 million", "$800,000"], correctIndex: 1 },
      { question: "What was Read's investment strategy?", options: ["Day trading", "Cryptocurrency", "Saving and investing in blue chip stocks for decades", "Real estate"], correctIndex: 2 },
      { question: "What happened to Richard Fuscone?", options: ["He became a billionaire", "He went bankrupt", "He retired happily", "He became president"], correctIndex: 1 },
      { question: "What is the main lesson from these two stories?", options: ["Education guarantees wealth", "Behavior matters more than knowledge in finance", "Only rich people can invest", "Luck is everything"], correctIndex: 1 }
    ]
  }
];

booksRouter.get("/", (_req, res) => {
  const list = booksData.map(({ chapters, questions, ...book }) => ({
    ...book,
    chaptersCount: chapters.length,
    questionsCount: questions.length,
  }));
  res.json(list);
});

booksRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = booksData.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  const { questions, ...bookData } = book;
  res.json({ ...bookData, questionsCount: questions.length });
});

booksRouter.get("/:id/questions", (req, res) => {
  const id = Number(req.params.id);
  const book = booksData.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book.questions);
});
