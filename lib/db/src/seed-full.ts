import { db } from "@workspace/db";
import {
  levelsTable, topicsTable, lessonsTable,
  quizQuestionsTable, progressTable, placementQuestionsTable, userPlacementResultsTable
} from "@workspace/db";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 بدء بذر البيانات الكاملة...");

  // Clear all data
  await db.execute(sql`TRUNCATE TABLE user_placement_results, placement_questions, quiz_questions, progress, lessons, topics, levels RESTART IDENTITY CASCADE`);
  console.log("✅ تم مسح البيانات القديمة");

  // ───── LEVELS ─────
  await db.insert(levelsTable).values([
    { code: "A1", nameAr: "المبتدئ", descriptionAr: "ابدأ رحلتك مع الإنجليزية من الصفر. ستتعلم الحروف والكلمات الأساسية وتكوين جمل بسيطة.", order: 1, color: "#5B7CFF" },
    { code: "A2", nameAr: "المبتدئ المتقدم", descriptionAr: "وسّع مفرداتك وتعلم التعبير عن الماضي والمستقبل بجمل أكثر تعقيداً.", order: 2, color: "#7F5AF0" },
    { code: "B1", nameAr: "المتوسط", descriptionAr: "تواصل بثقة في المواقف اليومية. تعلم القواعد المتوسطة والتعبير عن آرائك.", order: 3, color: "#2CB67D" },
    { code: "B2", nameAr: "المتوسط المتقدم", descriptionAr: "ناقش مواضيع معقدة وافهم النصوص الطويلة. مستوى الوظائف الدولية.", order: 4, color: "#F4B942" },
    { code: "C1", nameAr: "المتقدم", descriptionAr: "أتقن الإنجليزية الأكاديمية والمهنية. تعبير مرن وطليق في جميع المواقف.", order: 5, color: "#FF6B6B" },
    { code: "C2", nameAr: "الإتقان", descriptionAr: "أعلى مستويات اللغة. تعبير دقيق وأسلوب راقٍ مماثل للناطق الأصلي.", order: 6, color: "#A8DADC" },
  ]);
  console.log("✅ المستويات");

  // ───── TOPICS ─────
  await db.insert(topicsTable).values([
    { nameAr: "القواعد النحوية", icon: "BookOpen", slug: "grammar" },
    { nameAr: "المفردات", icon: "BookMarked", slug: "vocabulary" },
    { nameAr: "الاستماع والفهم", icon: "Headphones", slug: "listening" },
    { nameAr: "التحدث والمحادثة", icon: "Mic", slug: "speaking" },
  ]);
  console.log("✅ الموضوعات");

  const levels = await db.select().from(levelsTable).orderBy(levelsTable.order);
  const topics = await db.select().from(topicsTable);
  const L = Object.fromEntries(levels.map(l => [l.code, l.id]));
  const T = Object.fromEntries(topics.map(t => [t.slug, t.id]));

  // ───── LESSONS ─────
  // Format: { titleAr, levelCode, topicSlug, order, durationMinutes, contentAr, examples: [{english, arabicTranslation}], keywords: [{english, arabicMeaning}] }
  const lessonsData = [

    // ═══════════════════════════════════════════════════════
    // A1 — GRAMMAR
    // ═══════════════════════════════════════════════════════
    {
      titleAr: "الضمائر الشخصية وفعل To Be",
      levelCode: "A1", topicSlug: "grammar", order: 1, durationMinutes: 10,
      contentAr: `الضمائر الشخصية هي الكلمات التي تحل محل الأسماء. في اللغة الإنجليزية هناك سبعة ضمائر أساسية: I, You, He, She, It, We, They.

فعل "To Be" هو الفعل الأكثر استخداماً في الإنجليزية، ويعني "يكون". يتغير شكله حسب الضمير:
- I am (أنا أكون)
- You are (أنت تكون)
- He/She/It is (هو/هي/ذلك يكون)
- We/They are (نحن/هم يكونون)

استخدم هذه الصيغة لوصف الأشياء والأشخاص وتقديم نفسك.`,
      examples: [
        { english: "I am a student.", arabicTranslation: "أنا طالب." },
        { english: "She is a doctor.", arabicTranslation: "هي طبيبة." },
        { english: "We are friends.", arabicTranslation: "نحن أصدقاء." },
        { english: "They are from Egypt.", arabicTranslation: "هم من مصر." },
      ],
      keywords: [
        { english: "I", arabicMeaning: "أنا" },
        { english: "He / She", arabicMeaning: "هو / هي" },
        { english: "Am / Is / Are", arabicMeaning: "يكون (حسب الضمير)" },
        { english: "Student", arabicMeaning: "طالب" },
      ],
    },
    {
      titleAr: "المفرد والجمع — هذا وهذه",
      levelCode: "A1", topicSlug: "grammar", order: 2, durationMinutes: 10,
      contentAr: `في الإنجليزية نستخدم "This" للإشارة إلى شيء قريب مفرد، و"That" للإشارة إلى شيء بعيد مفرد. أما للجمع فنستخدم "These" للقريب و"Those" للبعيد.

لتحويل المفرد إلى جمع نضيف "s" أو "es" في الغالب:
- book → books (كتاب → كتب)
- box → boxes (صندوق → صناديق)
- child → children (طفل → أطفال) — حالة استثنائية

الأداة "a/an" تستخدم مع المفرد. "a" قبل الحروف الساكنة و"an" قبل حروف العلة (a, e, i, o, u).`,
      examples: [
        { english: "This is a book.", arabicTranslation: "هذا كتاب." },
        { english: "These are pens.", arabicTranslation: "هذه أقلام." },
        { english: "That is an apple.", arabicTranslation: "تلك تفاحة." },
        { english: "Those are my bags.", arabicTranslation: "تلك حقائبي." },
      ],
      keywords: [
        { english: "This / That", arabicMeaning: "هذا / ذلك" },
        { english: "These / Those", arabicMeaning: "هؤلاء / أولئك" },
        { english: "A / An", arabicMeaning: "أداة النكرة" },
        { english: "Plural", arabicMeaning: "الجمع" },
      ],
    },
    {
      titleAr: "الأسئلة الأساسية — WH Questions",
      levelCode: "A1", topicSlug: "grammar", order: 3, durationMinutes: 12,
      contentAr: `أسئلة WH هي أسئلة تبدأ بكلمات استفهام وتستدعي إجابات كاملة. الكلمات الأساسية هي:
- What — ماذا/ما
- Where — أين
- Who — من
- When — متى
- How — كيف
- How old — كم عمرك

لتكوين السؤال في زمن المضارع البسيط مع ضمائر الغائب (He/She/It) نضيف "does" وللبقية "do":
- Where do you live? (أين تسكن؟)
- What does she do? (ماذا تعمل هي؟)`,
      examples: [
        { english: "What is your name?", arabicTranslation: "ما اسمك؟" },
        { english: "Where are you from?", arabicTranslation: "من أين أنت؟" },
        { english: "How old are you?", arabicTranslation: "كم عمرك؟" },
        { english: "Who is that man?", arabicTranslation: "من هذا الرجل؟" },
      ],
      keywords: [
        { english: "What", arabicMeaning: "ماذا / ما" },
        { english: "Where", arabicMeaning: "أين" },
        { english: "Who", arabicMeaning: "من" },
        { english: "How", arabicMeaning: "كيف" },
      ],
    },

    // A1 — VOCABULARY
    {
      titleAr: "التحية والتعارف",
      levelCode: "A1", topicSlug: "vocabulary", order: 4, durationMinutes: 8,
      contentAr: `تعلم التحية هو أول خطوة في أي لغة. في الإنجليزية هناك تحيات رسمية وغير رسمية:

التحيات الرسمية:
- Good morning — صباح الخير
- Good afternoon — مساء الخير
- Good evening — مساء النور
- How do you do? — تحية رسمية عند اللقاء لأول مرة

التحيات غير الرسمية:
- Hi / Hello — أهلاً
- How are you? — كيف حالك؟
- I'm fine, thank you — أنا بخير، شكراً
- Nice to meet you — سعيد بمعرفتك`,
      examples: [
        { english: "Good morning! My name is Sara.", arabicTranslation: "صباح الخير! اسمي سارة." },
        { english: "Hi! How are you?", arabicTranslation: "أهلاً! كيف حالك؟" },
        { english: "I'm fine, thank you. And you?", arabicTranslation: "أنا بخير، شكراً. وأنت؟" },
        { english: "Nice to meet you, Ahmed.", arabicTranslation: "سعيد بمعرفتك يا أحمد." },
      ],
      keywords: [
        { english: "Hello / Hi", arabicMeaning: "أهلاً / مرحباً" },
        { english: "Good morning", arabicMeaning: "صباح الخير" },
        { english: "Thank you", arabicMeaning: "شكراً" },
        { english: "Nice to meet you", arabicMeaning: "سعيد بمعرفتك" },
      ],
    },
    {
      titleAr: "الأرقام والألوان",
      levelCode: "A1", topicSlug: "vocabulary", order: 5, durationMinutes: 10,
      contentAr: `الأرقام من 1 إلى 20:
One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten
Eleven, Twelve, Thirteen, Fourteen, Fifteen, Sixteen, Seventeen, Eighteen, Nineteen, Twenty

الأرقام الكبيرة: Thirty (30), Forty (40), Fifty (50), One hundred (100)

الألوان الأساسية:
Red (أحمر), Blue (أزرق), Green (أخضر), Yellow (أصفر), Orange (برتقالي), Purple (بنفسجي), Black (أسود), White (أبيض), Brown (بني), Grey (رمادي)`,
      examples: [
        { english: "I have five brothers.", arabicTranslation: "لدي خمسة إخوة." },
        { english: "The car is red.", arabicTranslation: "السيارة حمراء." },
        { english: "She is twenty years old.", arabicTranslation: "هي في العشرين من عمرها." },
        { english: "My favourite colour is blue.", arabicTranslation: "لوني المفضل هو الأزرق." },
      ],
      keywords: [
        { english: "Colour", arabicMeaning: "لون" },
        { english: "Number", arabicMeaning: "رقم" },
        { english: "Favourite", arabicMeaning: "المفضل" },
        { english: "Years old", arabicMeaning: "من العمر" },
      ],
    },
    {
      titleAr: "الأسرة والعائلة",
      levelCode: "A1", topicSlug: "vocabulary", order: 6, durationMinutes: 10,
      contentAr: `كلمات الأسرة أساسية في التواصل اليومي. إليك أهم كلمات العائلة:

الأسرة المباشرة:
Mother/Mum (أم), Father/Dad (أب), Brother (أخ), Sister (أخت), Son (ابن), Daughter (ابنة)

الأقارب:
Grandfather (جد), Grandmother (جدة), Uncle (عم/خال), Aunt (عمة/خالة), Cousin (ابن العم/الخال)

للتحدث عن عائلتك قل:
- I have one brother and two sisters.
- My mother is a teacher.`,
      examples: [
        { english: "My mother is a nurse.", arabicTranslation: "أمي ممرضة." },
        { english: "I have two brothers.", arabicTranslation: "لدي أخان." },
        { english: "Her grandmother is 70 years old.", arabicTranslation: "جدتها في السبعين." },
        { english: "His uncle lives in London.", arabicTranslation: "عمه يسكن في لندن." },
      ],
      keywords: [
        { english: "Mother / Father", arabicMeaning: "أم / أب" },
        { english: "Brother / Sister", arabicMeaning: "أخ / أخت" },
        { english: "Grandmother", arabicMeaning: "جدة" },
        { english: "Uncle / Aunt", arabicMeaning: "عم/خال / عمة/خالة" },
      ],
    },

    // A1 — LISTENING
    {
      titleAr: "محادثة في المطار",
      levelCode: "A1", topicSlug: "listening", order: 7, durationMinutes: 12,
      contentAr: `استمع إلى هذه المحادثة بين مسافر وموظف المطار:

موظف: Good morning! Welcome to London Heathrow.
مسافر: Good morning! Thank you.
موظف: What is your name, please?
مسافر: My name is Khalid Al-Rashid.
موظف: Where are you from?
مسافر: I am from Saudi Arabia.
موظف: How long is your visit?
مسافر: One week.
موظف: Enjoy your stay!
مسافر: Thank you very much!

لاحظ استخدام التحيات الرسمية وأسئلة WH في الحوار.`,
      examples: [
        { english: "Welcome to London!", arabicTranslation: "مرحباً بك في لندن!" },
        { english: "How long is your visit?", arabicTranslation: "كم مدة زيارتك؟" },
        { english: "One week.", arabicTranslation: "أسبوع واحد." },
        { english: "Enjoy your stay!", arabicTranslation: "استمتع بإقامتك!" },
      ],
      keywords: [
        { english: "Welcome", arabicMeaning: "مرحباً / أهلاً" },
        { english: "Visit", arabicMeaning: "زيارة" },
        { english: "Stay", arabicMeaning: "إقامة" },
        { english: "Please", arabicMeaning: "من فضلك" },
      ],
    },
    {
      titleAr: "في المطعم — طلب الطعام",
      levelCode: "A1", topicSlug: "listening", order: 8, durationMinutes: 12,
      contentAr: `إليك محادثة في مطعم بين زبون ونادل:

نادل: Good evening! Are you ready to order?
زبون: Yes, please. I would like a burger and orange juice.
نادل: Would you like fries with that?
زبون: No, thank you.
نادل: Anything else?
زبون: No, that's all. How much is it?
نادل: That is fifteen pounds, please.
زبون: Here you are.
نادل: Thank you! Enjoy your meal.

عبارات مهمة في المطعم: "I would like..." لطلب شيء بلباقة، و"How much is it?" للسؤال عن السعر.`,
      examples: [
        { english: "I would like a coffee, please.", arabicTranslation: "أريد قهوة من فضلك." },
        { english: "How much is it?", arabicTranslation: "كم سعره؟" },
        { english: "Enjoy your meal!", arabicTranslation: "بالهناء والشفاء!" },
        { english: "That's all, thank you.", arabicTranslation: "هذا كل شيء، شكراً." },
      ],
      keywords: [
        { english: "Order", arabicMeaning: "يطلب / طلب" },
        { english: "Would like", arabicMeaning: "أريد / أرغب في" },
        { english: "Fries", arabicMeaning: "بطاطس مقلية" },
        { english: "Meal", arabicMeaning: "وجبة" },
      ],
    },
    {
      titleAr: "وصف الأماكن البسيطة",
      levelCode: "A1", topicSlug: "listening", order: 9, durationMinutes: 10,
      contentAr: `استمع إلى شخص يصف مكانه:

"My house is small but nice. There is a living room, a kitchen, two bedrooms, and one bathroom. The living room is big. There is a sofa and a TV. The kitchen is next to the living room. My bedroom is on the second floor. There is a bed and a desk in my bedroom."

الكلمات المهمة لوصف الأماكن:
- There is / There are — يوجد
- Next to — بجانب
- On the left / right — على اليسار / اليمين
- Upstairs / Downstairs — في الأعلى / في الأسفل`,
      examples: [
        { english: "There is a big window.", arabicTranslation: "يوجد نافذة كبيرة." },
        { english: "The kitchen is next to the hall.", arabicTranslation: "المطبخ بجانب القاعة." },
        { english: "There are two bathrooms.", arabicTranslation: "يوجد حمامان." },
        { english: "My room is upstairs.", arabicTranslation: "غرفتي في الأعلى." },
      ],
      keywords: [
        { english: "There is / There are", arabicMeaning: "يوجد" },
        { english: "Next to", arabicMeaning: "بجانب" },
        { english: "Bedroom", arabicMeaning: "غرفة نوم" },
        { english: "Kitchen", arabicMeaning: "مطبخ" },
      ],
    },

    // A1 — SPEAKING
    {
      titleAr: "تقديم نفسك",
      levelCode: "A1", topicSlug: "speaking", order: 10, durationMinutes: 12,
      contentAr: `تقديم النفس هو أول ما تتعلمه في أي لغة. إليك نموذج كامل:

"Hello! My name is Mohammed. I am 25 years old. I am from Riyadh, Saudi Arabia. I am a student at the university. I study computer science. I live with my family. I have two brothers and one sister. I like football and reading."

الخطوات:
1. قل اسمك: My name is...
2. قل عمرك: I am ... years old.
3. قل من أين أنت: I am from...
4. قل عملك أو دراستك: I am a... / I study...
5. تحدث عن اهتماماتك: I like...`,
      examples: [
        { english: "My name is Fatima.", arabicTranslation: "اسمي فاطمة." },
        { english: "I am from Cairo.", arabicTranslation: "أنا من القاهرة." },
        { english: "I am a teacher.", arabicTranslation: "أنا معلمة." },
        { english: "I like cooking and travel.", arabicTranslation: "أحب الطبخ والسفر." },
      ],
      keywords: [
        { english: "My name is", arabicMeaning: "اسمي" },
        { english: "I am from", arabicMeaning: "أنا من" },
        { english: "I work as", arabicMeaning: "أعمل كـ" },
        { english: "I like", arabicMeaning: "أحب" },
      ],
    },
    {
      titleAr: "وصف العائلة بالحديث",
      levelCode: "A1", topicSlug: "speaking", order: 11, durationMinutes: 10,
      contentAr: `تدرب على وصف عائلتك بالإنجليزية. استخدم الكلمات التي تعلمتها لتقول:

نموذج للتحدث:
"I have a big family. My father is 55 years old. He is an engineer. My mother is a housewife. She cooks very well. I have two brothers. My older brother is 30 years old. He is married. My younger brother is 18 years old. He is a student."

نصائح للتحدث بثقة:
- تحدث ببطء ووضوح
- لا تخف من الأخطاء
- استخدم الكلمات التي تعرفها
- إذا نسيت كلمة قل "How do you say...?"`,
      examples: [
        { english: "My father is an engineer.", arabicTranslation: "أبي مهندس." },
        { english: "She cooks very well.", arabicTranslation: "هي تطبخ بشكل ممتاز." },
        { english: "My older brother is married.", arabicTranslation: "أخي الأكبر متزوج." },
        { english: "How do you say 'ممرض' in English?", arabicTranslation: "كيف تقول 'ممرض' بالإنجليزية؟" },
      ],
      keywords: [
        { english: "Older / Younger", arabicMeaning: "أكبر / أصغر" },
        { english: "Married", arabicMeaning: "متزوج" },
        { english: "Housewife", arabicMeaning: "ربة بيت" },
        { english: "Engineer", arabicMeaning: "مهندس" },
      ],
    },
    {
      titleAr: "الاتجاهات البسيطة",
      levelCode: "A1", topicSlug: "speaking", order: 12, durationMinutes: 12,
      contentAr: `تعلم كيف تسأل عن الاتجاهات وتعطيها:

السؤال:
- Excuse me, where is the bank? — عفواً، أين البنك؟
- How do I get to the hospital? — كيف أصل إلى المستشفى؟

الإجابة:
- Go straight — اذهب مباشرة
- Turn right / left — انعطف يميناً / يساراً
- It's on your right — إنه على يمينك
- Take the first street — خذ الشارع الأول
- It's next to the mosque — إنه بجانب المسجد

تذكر أن تبدأ بـ "Excuse me" قبل سؤال أي شخص.`,
      examples: [
        { english: "Excuse me, where is the post office?", arabicTranslation: "عفواً، أين مكتب البريد؟" },
        { english: "Go straight and turn left.", arabicTranslation: "اذهب مباشرة ثم انعطف يساراً." },
        { english: "It's next to the supermarket.", arabicTranslation: "إنه بجانب السوبرماركت." },
        { english: "Take the second street on the right.", arabicTranslation: "خذ الشارع الثاني على اليمين." },
      ],
      keywords: [
        { english: "Excuse me", arabicMeaning: "عفواً / بإذنك" },
        { english: "Go straight", arabicMeaning: "اذهب مباشرة" },
        { english: "Turn right / left", arabicMeaning: "انعطف يميناً / يساراً" },
        { english: "Next to", arabicMeaning: "بجانب" },
      ],
    },

    // ═══════════════════════════════════════════════════════
    // A2 — GRAMMAR
    // ═══════════════════════════════════════════════════════
    {
      titleAr: "الماضي البسيط — الأفعال المنتظمة",
      levelCode: "A2", topicSlug: "grammar", order: 1, durationMinutes: 12,
      contentAr: `الماضي البسيط (Past Simple) يستخدم للحديث عن أحداث انتهت في الماضي.

للأفعال المنتظمة نضيف "ed" في نهاية الفعل:
- work → worked (عمل)
- play → played (لعب)
- study → studied (درس) — عند انتهاء الفعل بـ y بعد حرف ساكن تحول Y إلى I

النفي: did not (didn't) + المصدر
- I didn't work yesterday.

السؤال: Did + الفاعل + المصدر؟
- Did you study last night?

كلمات الزمن الماضي: yesterday, last week, last year, ago`,
      examples: [
        { english: "She worked in a hospital last year.", arabicTranslation: "عملت في مستشفى العام الماضي." },
        { english: "I studied English yesterday.", arabicTranslation: "درست الإنجليزية أمس." },
        { english: "Did you watch the match?", arabicTranslation: "هل شاهدت المباراة؟" },
        { english: "He didn't come to school today.", arabicTranslation: "لم يأتِ إلى المدرسة اليوم." },
      ],
      keywords: [
        { english: "Yesterday", arabicMeaning: "أمس" },
        { english: "Last week", arabicMeaning: "الأسبوع الماضي" },
        { english: "Ago", arabicMeaning: "منذ" },
        { english: "Didn't", arabicMeaning: "لم يفعل" },
      ],
    },
    {
      titleAr: "الماضي البسيط — الأفعال الشاذة",
      levelCode: "A2", topicSlug: "grammar", order: 2, durationMinutes: 15,
      contentAr: `الأفعال الشاذة (Irregular Verbs) لا تتبع قاعدة إضافة "ed". يجب حفظها:

go → went (ذهب)
come → came (جاء)
see → saw (رأى)
eat → ate (أكل)
drink → drank (شرب)
buy → bought (اشترى)
have → had (كان لديه)
take → took (أخذ)
make → made (صنع)
give → gave (أعطى)
write → wrote (كتب)
read → read (قرأ — ينطق red)

النفي والسؤال يبقيان نفس القاعدة: didn't + المصدر، Did + المصدر؟`,
      examples: [
        { english: "I went to Dubai last summer.", arabicTranslation: "ذهبت إلى دبي الصيف الماضي." },
        { english: "She bought a new car.", arabicTranslation: "اشترت سيارة جديدة." },
        { english: "Did he eat breakfast?", arabicTranslation: "هل أكل الفطور؟" },
        { english: "We had a great time.", arabicTranslation: "قضينا وقتاً رائعاً." },
      ],
      keywords: [
        { english: "Went", arabicMeaning: "ذهب (ماضي go)" },
        { english: "Bought", arabicMeaning: "اشترى (ماضي buy)" },
        { english: "Irregular", arabicMeaning: "شاذ / غير منتظم" },
        { english: "Had", arabicMeaning: "كان لديه (ماضي have)" },
      ],
    },
    {
      titleAr: "المستقبل — will و going to",
      levelCode: "A2", topicSlug: "grammar", order: 3, durationMinutes: 12,
      contentAr: `هناك طريقتان رئيسيتان للتحدث عن المستقبل:

1. Will + المصدر — للقرارات الفورية والتنبؤات:
- I will help you. (سأساعدك — قرار فوري)
- It will rain tomorrow. (سيمطر غداً — تنبؤ)

2. Going to + المصدر — للخطط المسبقة:
- I am going to study tonight. (سأدرس الليلة — خطة مسبقة)
- She is going to travel next week. (ستسافر الأسبوع القادم)

النفي: won't (will not) / am/is/are not going to
السؤال: Will...? / Are you going to...?`,
      examples: [
        { english: "I will call you later.", arabicTranslation: "سأتصل بك لاحقاً." },
        { english: "We are going to visit Paris.", arabicTranslation: "سنزور باريس." },
        { english: "Will you help me?", arabicTranslation: "هل ستساعدني؟" },
        { english: "She won't come to the party.", arabicTranslation: "لن تأتي إلى الحفلة." },
      ],
      keywords: [
        { english: "Will", arabicMeaning: "سـ / سوف" },
        { english: "Going to", arabicMeaning: "سيفعل / ينوي" },
        { english: "Won't", arabicMeaning: "لن" },
        { english: "Tomorrow", arabicMeaning: "غداً" },
      ],
    },

    // A2 — VOCABULARY
    {
      titleAr: "الطعام والمشروبات",
      levelCode: "A2", topicSlug: "vocabulary", order: 4, durationMinutes: 10,
      contentAr: `تعلم مفردات الطعام والمشروبات الأساسية:

الطعام: rice (أرز), bread (خبز), meat (لحم), chicken (دجاج), fish (سمك), vegetables (خضروات), fruit (فاكهة), cheese (جبن), eggs (بيض), soup (شوربة)

المشروبات: water (ماء), juice (عصير), coffee (قهوة), tea (شاي), milk (حليب)

أسلوب التعبير عن الرغبة:
- I love pizza! (أحب البيتزا كثيراً)
- I like salad. (أحب السلطة)
- I don't like fish. (لا أحب السمك)
- I hate onions! (أكره البصل!)`,
      examples: [
        { english: "I have eggs and bread for breakfast.", arabicTranslation: "آكل بيضاً وخبزاً على الفطور." },
        { english: "She doesn't eat meat.", arabicTranslation: "هي لا تأكل اللحم." },
        { english: "Would you like some juice?", arabicTranslation: "هل تريد بعض العصير؟" },
        { english: "My favourite food is grilled chicken.", arabicTranslation: "طعامي المفضل هو الدجاج المشوي." },
      ],
      keywords: [
        { english: "Vegetables", arabicMeaning: "خضروات" },
        { english: "Fruit", arabicMeaning: "فاكهة" },
        { english: "Grilled", arabicMeaning: "مشوي" },
        { english: "Favourite", arabicMeaning: "المفضل" },
      ],
    },
    {
      titleAr: "المهن والوظائف",
      levelCode: "A2", topicSlug: "vocabulary", order: 5, durationMinutes: 10,
      contentAr: `تعلم أسماء المهن الأكثر شيوعاً:

Teacher (معلم), Doctor (طبيب), Engineer (مهندس), Nurse (ممرض), Police officer (شرطي), Pilot (طيار), Chef (طاهٍ), Lawyer (محامٍ), Journalist (صحفي), Accountant (محاسب), Driver (سائق), Farmer (مزارع)

للتحدث عن المهنة:
- What do you do? — ماذا تعمل؟
- I work as a doctor. — أعمل طبيباً.
- I am an engineer. — أنا مهندس.
- Where do you work? — أين تعمل؟`,
      examples: [
        { english: "My father works as a pilot.", arabicTranslation: "أبي يعمل طياراً." },
        { english: "She is a successful lawyer.", arabicTranslation: "هي محامية ناجحة." },
        { english: "What do you do for a living?", arabicTranslation: "ماذا تعمل للعيش؟" },
        { english: "I want to be a journalist.", arabicTranslation: "أريد أن أكون صحفياً." },
      ],
      keywords: [
        { english: "Profession / Job", arabicMeaning: "مهنة / وظيفة" },
        { english: "Works as", arabicMeaning: "يعمل كـ" },
        { english: "Successful", arabicMeaning: "ناجح" },
        { english: "Journalist", arabicMeaning: "صحفي" },
      ],
    },
    {
      titleAr: "الطقس والفصول",
      levelCode: "A2", topicSlug: "vocabulary", order: 6, durationMinutes: 10,
      contentAr: `وصف الطقس والفصول الأربعة:

الفصول: Spring (ربيع), Summer (صيف), Autumn/Fall (خريف), Winter (شتاء)

الطقس: Sunny (مشمس), Cloudy (غائم), Rainy (ممطر), Windy (عاصف), Hot (حار), Cold (بارد), Warm (دافئ), Snowy (ثلجي)

التعبير عن الطقس:
- What's the weather like? — كيف الطقس؟
- It's sunny and warm. — الجو مشمس ودافئ.
- It's 35 degrees. — الحرارة 35 درجة.`,
      examples: [
        { english: "What's the weather like today?", arabicTranslation: "كيف الطقس اليوم؟" },
        { english: "It's very hot in summer.", arabicTranslation: "الجو حار جداً في الصيف." },
        { english: "I love rainy weather.", arabicTranslation: "أحب الطقس الممطر." },
        { english: "It's snowing in London.", arabicTranslation: "إنه يثلج في لندن." },
      ],
      keywords: [
        { english: "Weather", arabicMeaning: "الطقس" },
        { english: "Season", arabicMeaning: "فصل" },
        { english: "Temperature", arabicMeaning: "درجة الحرارة" },
        { english: "Snowy", arabicMeaning: "ثلجي" },
      ],
    },

    // A2 — LISTENING
    {
      titleAr: "حوار التسوق",
      levelCode: "A2", topicSlug: "listening", order: 7, durationMinutes: 12,
      contentAr: `استمع إلى هذا الحوار في متجر الملابس:

بائع: Good afternoon! Can I help you?
زبون: Yes, I'm looking for a shirt.
بائع: What size are you?
زبون: I'm a medium, please.
بائع: What colour do you prefer?
زبون: I like blue or white.
بائع: How about this one? It's on sale — 30% off.
زبون: Oh, nice! Can I try it on?
بائع: Of course! The changing room is over there.
زبون: It fits perfectly! I'll take it. How much is it?
بائع: It's 45 riyals.

عبارات مهمة: on sale (بتخفيض), try it on (يجربه), fits perfectly (مقاسه تماماً)`,
      examples: [
        { english: "Can I help you?", arabicTranslation: "هل يمكنني مساعدتك؟" },
        { english: "I'm looking for a shirt.", arabicTranslation: "أبحث عن قميص." },
        { english: "It's on sale.", arabicTranslation: "إنه بتخفيض." },
        { english: "Can I try it on?", arabicTranslation: "هل يمكنني تجربته؟" },
      ],
      keywords: [
        { english: "On sale", arabicMeaning: "بتخفيض / عرض" },
        { english: "Size", arabicMeaning: "مقاس" },
        { english: "Fits", arabicMeaning: "يناسب / مقاسه صح" },
        { english: "Changing room", arabicMeaning: "غرفة القياس" },
      ],
    },
    {
      titleAr: "حجز فندق",
      levelCode: "A2", topicSlug: "listening", order: 8, durationMinutes: 12,
      contentAr: `استمع إلى محادثة حجز فندق:

موظف: Good morning, Grand Hotel. How can I help?
زبون: I'd like to book a room, please.
موظف: Certainly. For how many nights?
زبون: Three nights — from Friday to Monday.
موظف: Single or double room?
زبون: Double room, please. Does it include breakfast?
موظف: Yes, breakfast is included. It's 200 dollars per night.
زبون: That's fine. My name is Omar Hassan.
موظف: Can I have your email address?
زبون: Sure, it's omar@email.com
موظف: Perfect. Your booking is confirmed!

كلمات مهمة: book (يحجز), included (مشمول), confirmed (مؤكد)`,
      examples: [
        { english: "I'd like to book a room.", arabicTranslation: "أريد حجز غرفة." },
        { english: "Does it include breakfast?", arabicTranslation: "هل يشمل الفطور؟" },
        { english: "Your booking is confirmed.", arabicTranslation: "حجزك مؤكد." },
        { english: "Per night", arabicMeaning: "في الليلة" },
      ],
      keywords: [
        { english: "Book / Booking", arabicMeaning: "يحجز / حجز" },
        { english: "Included", arabicMeaning: "مشمول" },
        { english: "Confirmed", arabicMeaning: "مؤكد" },
        { english: "Per night", arabicMeaning: "في الليلة" },
      ],
    },
    {
      titleAr: "مواعيد الطبيب",
      levelCode: "A2", topicSlug: "listening", order: 9, durationMinutes: 12,
      contentAr: `حوار في عيادة الطبيب:

ممرضة: Hello, City Clinic. How can I help?
مريض: I need to see a doctor. I don't feel well.
ممرضة: What are your symptoms?
مريض: I have a headache and a sore throat since yesterday.
ممرضة: Do you have a fever?
مريض: Yes, 38.5 degrees.
ممرضة: Can you come at 3 o'clock today?
مريض: Yes, that's fine.
ممرضة: Your name please?
مريض: Layla Al-Amri.
ممرضة: See you at 3, Layla. Get well soon!

تعابير طبية: symptoms (أعراض), sore throat (التهاب الحلق), fever (حمى)`,
      examples: [
        { english: "I don't feel well.", arabicTranslation: "لا أشعر بالارتياح." },
        { english: "I have a sore throat.", arabicTranslation: "لدي التهاب في الحلق." },
        { english: "Do you have a fever?", arabicTranslation: "هل لديك حمى؟" },
        { english: "Get well soon!", arabicTranslation: "شفاءً عاجلاً!" },
      ],
      keywords: [
        { english: "Symptom", arabicMeaning: "عرض / علامة مرضية" },
        { english: "Sore throat", arabicMeaning: "التهاب الحلق" },
        { english: "Fever", arabicMeaning: "حمى" },
        { english: "Appointment", arabicMeaning: "موعد" },
      ],
    },

    // A2 — SPEAKING
    {
      titleAr: "الحديث عن يومك",
      levelCode: "A2", topicSlug: "speaking", order: 10, durationMinutes: 12,
      contentAr: `تعلم كيف تصف يومك بشكل طبيعي:

استخدم أفعال الزمن المضارع البسيط (Present Simple) لوصف الروتين:
"Every day I wake up at 6 am. I have breakfast at 7. Then I go to work by car. I work from 8 to 4. After work, I go to the gym. In the evening, I have dinner with my family and watch TV."

تعابير الزمن: every day, in the morning, at noon, in the evening, at night, then, after that, finally

نصائح التحدث:
- صف أفعالك بالترتيب الزمني
- استخدم كلمات الربط: then, after that, finally
- لا تنس الأفعال الشاذة الشائعة: wake up, have, go`,
      examples: [
        { english: "I wake up at 6 am every day.", arabicTranslation: "أستيقظ الساعة 6 صباحاً كل يوم." },
        { english: "After lunch, I take a nap.", arabicTranslation: "بعد الغداء آخذ قيلولة." },
        { english: "In the evening, I study English.", arabicTranslation: "في المساء أدرس الإنجليزية." },
        { english: "Finally, I go to bed at 11.", arabicTranslation: "أخيراً أنام الساعة 11." },
      ],
      keywords: [
        { english: "Routine", arabicMeaning: "روتين / معتاد" },
        { english: "Wake up", arabicMeaning: "يستيقظ" },
        { english: "After that", arabicMeaning: "بعد ذلك" },
        { english: "Finally", arabicMeaning: "أخيراً" },
      ],
    },
    {
      titleAr: "الحديث عن الهوايات",
      levelCode: "A2", topicSlug: "speaking", order: 11, durationMinutes: 10,
      contentAr: `تحدث عن هواياتك باستخدام هذه الهياكل:

"I enjoy + فعل + ing"  — أستمتع بـ
"I love + فعل + ing" — أحب كثيراً
"I'm interested in + اسم" — أنا مهتم بـ
"I spend my free time + فعل + ing" — أقضي وقت الفراغ في

مثال: "In my free time, I enjoy reading books and watching documentaries. I am also interested in photography. On weekends, I go hiking with my friends. I spend about 2 hours a day on my hobbies."

أسئلة مفيدة:
- What do you do in your free time?
- Do you have any hobbies?`,
      examples: [
        { english: "I enjoy playing chess.", arabicTranslation: "أستمتع بلعب الشطرنج." },
        { english: "I'm interested in cooking.", arabicTranslation: "أنا مهتم بالطبخ." },
        { english: "I spend my free time painting.", arabicTranslation: "أقضي وقت الفراغ في الرسم." },
        { english: "What do you do in your free time?", arabicTranslation: "ماذا تفعل في وقت فراغك؟" },
      ],
      keywords: [
        { english: "Hobby", arabicMeaning: "هواية" },
        { english: "Free time", arabicMeaning: "وقت الفراغ" },
        { english: "Interested in", arabicMeaning: "مهتم بـ" },
        { english: "Documentary", arabicMeaning: "فيلم وثائقي" },
      ],
    },
    {
      titleAr: "وصف التجارب الماضية",
      levelCode: "A2", topicSlug: "speaking", order: 12, durationMinutes: 12,
      contentAr: `تحدث عن تجارب ماضية مثيرة للاهتمام باستخدام الماضي البسيط:

"Last summer, I visited Turkey with my family. We stayed there for one week. We went to Istanbul and saw the Blue Mosque. The food was amazing! We ate Turkish ice cream and visited the Grand Bazaar. It was the best trip of my life!"

هيكل الحديث عن تجربة:
1. متى؟ Last year / In 2023...
2. أين؟ I went to / I visited...
3. ماذا فعلت؟ I saw / I ate / I met...
4. كيف كان؟ It was amazing / wonderful / terrible...`,
      examples: [
        { english: "Last year, I visited London.", arabicTranslation: "السنة الماضية زرت لندن." },
        { english: "The food was amazing.", arabicTranslation: "كان الطعام رائعاً." },
        { english: "We stayed in a beautiful hotel.", arabicTranslation: "أقمنا في فندق جميل." },
        { english: "It was the best trip of my life.", arabicTranslation: "كانت أفضل رحلة في حياتي." },
      ],
      keywords: [
        { english: "Visited", arabicMeaning: "زار (ماضي visit)" },
        { english: "Amazing", arabicMeaning: "رائع / مذهل" },
        { english: "Experience", arabicMeaning: "تجربة" },
        { english: "Wonderful", arabicMeaning: "رائع / جميل" },
      ],
    },

    // ═══════════════════════════════════════════════════════
    // B1 — GRAMMAR
    // ═══════════════════════════════════════════════════════
    {
      titleAr: "المضارع التام — Have you ever?",
      levelCode: "B1", topicSlug: "grammar", order: 1, durationMinutes: 15,
      contentAr: `المضارع التام (Present Perfect) يربط الماضي بالحاضر. يتكون من: have/has + التصريف الثالث للفعل.

الاستخدامات الرئيسية:
1. تجارب الحياة: Have you ever been to Japan? — هل زرت اليابان من قبل؟
2. أحداث قريبة: I have just finished my homework — لقد أنهيت واجبي للتو
3. مدة مستمرة: I have lived here for 5 years — أسكن هنا منذ 5 سنوات

كلمات مهمة: ever, never, just, already, yet, for, since
- yet (في النفي والسؤال): Have you eaten yet? / I haven't eaten yet.
- already (في الإثبات): I've already done it.`,
      examples: [
        { english: "Have you ever tried sushi?", arabicTranslation: "هل جربت السوشي من قبل؟" },
        { english: "I have never been to France.", arabicTranslation: "لم أذهب إلى فرنسا قط." },
        { english: "She has just arrived.", arabicTranslation: "وصلت للتو." },
        { english: "I have worked here since 2020.", arabicTranslation: "أعمل هنا منذ 2020." },
      ],
      keywords: [
        { english: "Ever / Never", arabicMeaning: "من قبل / أبداً" },
        { english: "Just", arabicMeaning: "للتو / منذ لحظة" },
        { english: "Already / Yet", arabicMeaning: "بالفعل / بعد" },
        { english: "Since / For", arabicMeaning: "منذ / لمدة" },
      ],
    },
    {
      titleAr: "أسلوب الشرط الأول — If",
      levelCode: "B1", topicSlug: "grammar", order: 2, durationMinutes: 15,
      contentAr: `الشرط الأول (First Conditional) يُستخدم للحديث عن مواقف محتملة في المستقبل:

الصيغة: If + المضارع البسيط + will + المصدر

أمثلة:
- If it rains, I will stay at home. (إذا أمطرت سأبقى في البيت)
- If you study hard, you will pass the exam. (إذا درست بجد ستنجح)

يمكن عكس الجملة:
- I will stay at home if it rains.

النفي: If you don't hurry, you'll miss the bus.

⚠️ تذكر: بعد "if" نستخدم المضارع البسيط وليس "will".`,
      examples: [
        { english: "If I pass the exam, I will celebrate.", arabicTranslation: "إذا نجحت في الامتحان سأحتفل." },
        { english: "If you eat more, you'll feel better.", arabicTranslation: "إذا أكلت أكثر ستشعر بتحسن." },
        { english: "What will you do if it snows?", arabicTranslation: "ماذا ستفعل إذا تثلج؟" },
        { english: "If we leave now, we won't be late.", arabicTranslation: "إذا غادرنا الآن لن نتأخر." },
      ],
      keywords: [
        { english: "Conditional", arabicMeaning: "الشرط" },
        { english: "If", arabicMeaning: "إذا / لو" },
        { english: "Unless", arabicMeaning: "إلا إذا / ما لم" },
        { english: "Otherwise", arabicMeaning: "وإلا / في غير ذلك" },
      ],
    },
    {
      titleAr: "المبني للمجهول — Passive Voice",
      levelCode: "B1", topicSlug: "grammar", order: 3, durationMinutes: 15,
      contentAr: `المبني للمجهول (Passive Voice) يُستخدم عندما يكون التركيز على الفعل وليس على من فعله.

الصيغة: am/is/are + التصريف الثالث (للمضارع)
        was/were + التصريف الثالث (للماضي)

أمثلة:
المبني للمعلوم: They built this bridge in 1990.
المبني للمجهول: This bridge was built in 1990.

متى نستخدمه؟
- عندما لا نعرف من فعل الفعل: My wallet was stolen.
- عندما لا يهم من فعل الفعل: Coffee is grown in Brazil.
- في الكتابة الرسمية والأكاديمية`,
      examples: [
        { english: "The letter was written by Ali.", arabicTranslation: "كُتبت الرسالة من قِبَل علي." },
        { english: "Arabic is spoken in 22 countries.", arabicTranslation: "تُتحدث العربية في 22 دولة." },
        { english: "The car was damaged in the accident.", arabicTranslation: "تضررت السيارة في الحادث." },
        { english: "The report will be submitted tomorrow.", arabicTranslation: "سيُقدَّم التقرير غداً." },
      ],
      keywords: [
        { english: "Passive", arabicMeaning: "المبني للمجهول" },
        { english: "Active", arabicMeaning: "المبني للمعلوم" },
        { english: "Built", arabicMeaning: "بُني (ماضي build)" },
        { english: "Written", arabicMeaning: "كُتب (ماضي write)" },
      ],
    },

    // B1 — VOCABULARY
    {
      titleAr: "العواطف والمشاعر",
      levelCode: "B1", topicSlug: "vocabulary", order: 4, durationMinutes: 12,
      contentAr: `تعبير دقيق عن المشاعر يجعل حديثك أكثر ثراءً:

مشاعر إيجابية: excited (متحمس), proud (فخور), relieved (مرتاح), amazed (مندهش), grateful (ممتنن), thrilled (سعيد جداً)

مشاعر سلبية: anxious (قلق), frustrated (محبط), disappointed (خائب الأمل), jealous (غيور), exhausted (منهك), overwhelmed (مثقل)

التعبير عن المشاعر:
- I feel excited about my new job.
- She seems a bit anxious before the exam.
- He was disappointed with the results.

الفرق بين: sad (حزين) / upset (منزعج) / depressed (مكتئب)`,
      examples: [
        { english: "I'm really excited about the trip!", arabicTranslation: "أنا متحمس جداً للرحلة!" },
        { english: "She felt disappointed with her grade.", arabicTranslation: "شعرت بخيبة أمل من درجتها." },
        { english: "I'm grateful for your help.", arabicTranslation: "أنا ممتنن لمساعدتك." },
        { english: "He looks exhausted after the game.", arabicTranslation: "يبدو منهكاً بعد المباراة." },
      ],
      keywords: [
        { english: "Excited", arabicMeaning: "متحمس / مفعم بالحماس" },
        { english: "Frustrated", arabicMeaning: "محبط / متضايق" },
        { english: "Grateful", arabicMeaning: "ممتنن / شاكر" },
        { english: "Exhausted", arabicMeaning: "منهك / متعب جداً" },
      ],
    },
    {
      titleAr: "السفر والسياحة",
      levelCode: "B1", topicSlug: "vocabulary", order: 5, durationMinutes: 12,
      contentAr: `مفردات السفر الأساسية للمسافر العربي:

في المطار: passport (جواز سفر), visa (تأشيرة), boarding pass (بطاقة الصعود), luggage (أمتعة), customs (الجمارك), departure (مغادرة), arrival (وصول), gate (بوابة)

في الفندق: check in/out (تسجيل الدخول/الخروج), reservation (حجز), suite (جناح), room service (خدمة الغرف), wake-up call (مكالمة الإيقاظ)

في المدينة: sightseeing (مشاهدة المعالم), landmark (معلم سياحي), souvenir (هدية تذكارية), guided tour (جولة مع مرشد)`,
      examples: [
        { english: "My passport expires next year.", arabicTranslation: "جواز سفري ينتهي العام القادم." },
        { english: "I need to check in by 3 pm.", arabicTranslation: "أحتاج إلى تسجيل الدخول قبل الساعة 3 عصراً." },
        { english: "We went sightseeing in Rome.", arabicTranslation: "ذهبنا لمشاهدة معالم روما." },
        { english: "Don't forget your boarding pass.", arabicTranslation: "لا تنسَ بطاقة الصعود." },
      ],
      keywords: [
        { english: "Passport", arabicMeaning: "جواز سفر" },
        { english: "Boarding pass", arabicMeaning: "بطاقة الصعود للطائرة" },
        { english: "Luggage", arabicMeaning: "أمتعة" },
        { english: "Souvenir", arabicMeaning: "تذكار / هدية تذكارية" },
      ],
    },
    {
      titleAr: "التكنولوجيا والإنترنت",
      levelCode: "B1", topicSlug: "vocabulary", order: 6, durationMinutes: 10,
      contentAr: `مفردات التكنولوجيا الحديثة التي نستخدمها يومياً:

الأجهزة: smartphone (هاتف ذكي), laptop (حاسوب محمول), tablet (جهاز لوحي), charger (شاحن), headphones (سماعات)

الإنترنت والتطبيقات: download (تنزيل), upload (رفع), stream (بث), log in/out (دخول/خروج), password (كلمة المرور), username (اسم المستخدم), notification (إشعار), update (تحديث)

التواصل الاجتماعي: post (منشور), share (مشاركة), follow (متابعة), like (إعجاب), comment (تعليق)`,
      examples: [
        { english: "I need to update my password.", arabicTranslation: "أحتاج إلى تغيير كلمة المرور." },
        { english: "Can you download this app?", arabicTranslation: "هل يمكنك تنزيل هذا التطبيق؟" },
        { english: "My phone battery is dead.", arabicTranslation: "بطارية هاتفي نفدت." },
        { english: "I got a notification from the bank.", arabicTranslation: "تلقيت إشعاراً من البنك." },
      ],
      keywords: [
        { english: "Download / Upload", arabicMeaning: "تنزيل / رفع" },
        { english: "Notification", arabicMeaning: "إشعار" },
        { english: "Password", arabicMeaning: "كلمة المرور" },
        { english: "Update", arabicMeaning: "تحديث" },
      ],
    },

    // B1 — LISTENING
    {
      titleAr: "نشرة الأخبار",
      levelCode: "B1", topicSlug: "listening", order: 7, durationMinutes: 15,
      contentAr: `استمع إلى مقتطف من نشرة إخبارية بالإنجليزية:

"Good evening. In tonight's top stories: The government has announced a new plan to reduce pollution in major cities. Officials say they will invest three billion dollars in clean energy over the next decade. In sports news, the national team won its third match in a row, securing a place in the finals. And in business, tech giant DataTech reported record profits this quarter, with shares rising 15 percent."

مفردات الأخبار: announce (يُعلن), invest (يستثمر), secure (يُحكم / يضمن), record profits (أرباح قياسية), shares (أسهم)

استراتيجيات فهم الأخبار: ركز على الأرقام والأسماء والأحداث الرئيسية`,
      examples: [
        { english: "The government announced a new plan.", arabicTranslation: "أعلنت الحكومة عن خطة جديدة." },
        { english: "They will invest in clean energy.", arabicTranslation: "سيستثمرون في الطاقة النظيفة." },
        { english: "The team secured a place in the finals.", arabicTranslation: "ضمن الفريق مكاناً في النهائيات." },
        { english: "Shares rose 15 percent.", arabicTranslation: "ارتفعت الأسهم 15 بالمئة." },
      ],
      keywords: [
        { english: "Announce", arabicMeaning: "يُعلن" },
        { english: "Invest", arabicMeaning: "يستثمر" },
        { english: "Pollution", arabicMeaning: "تلوث" },
        { english: "Shares", arabicMeaning: "أسهم" },
      ],
    },
    {
      titleAr: "مقابلة عمل",
      levelCode: "B1", topicSlug: "listening", order: 8, durationMinutes: 15,
      contentAr: `استمع إلى مقابلة عمل نموذجية:

مُحاوِر: Tell me about yourself.
مُقابَل: I graduated from King Saud University with a degree in computer science. I've been working as a software developer for three years. I enjoy problem-solving and working in teams.
مُحاوِر: What are your strengths?
مُقابَل: I am hardworking, organized, and I learn quickly. I also communicate well with others.
مُحاوِر: Where do you see yourself in 5 years?
مُقابَل: I hope to become a project manager and lead a development team.

عبارات مقابلة العمل: Tell me about yourself, strengths and weaknesses, team player, career goals`,
      examples: [
        { english: "I graduated from university in 2020.", arabicTranslation: "تخرجت من الجامعة عام 2020." },
        { english: "I work well under pressure.", arabicTranslation: "أعمل بشكل جيد تحت الضغط." },
        { english: "I am a team player.", arabicTranslation: "أنا شخص يعمل ضمن الفريق." },
        { english: "My goal is to become a manager.", arabicTranslation: "هدفي أن أصبح مديراً." },
      ],
      keywords: [
        { english: "Strengths", arabicMeaning: "نقاط القوة" },
        { english: "Team player", arabicMeaning: "يعمل ضمن الفريق" },
        { english: "Goal", arabicMeaning: "هدف" },
        { english: "Graduated", arabicMeaning: "تخرج" },
      ],
    },
    {
      titleAr: "خطاب محفّز",
      levelCode: "B1", topicSlug: "listening", order: 9, durationMinutes: 12,
      contentAr: `استمع إلى هذا الخطاب التحفيزي:

"Success is not given — it is earned. Every person who has achieved something great started with a dream and the courage to pursue it. You will face challenges. You will make mistakes. But remember: every mistake is a lesson, and every challenge is an opportunity to grow. The difference between successful people and others is not talent — it is persistence. So wake up every morning with a purpose, work hard, and never give up on your dreams."

كلمات ملهمة: earned (مكتسب), pursue (يسعى لتحقيق), persistence (مثابرة), purpose (هدف)`,
      examples: [
        { english: "Success is earned, not given.", arabicTranslation: "النجاح يُكتسب ولا يُهدى." },
        { english: "Every challenge is an opportunity.", arabicTranslation: "كل تحدٍّ هو فرصة." },
        { english: "Never give up on your dreams.", arabicTranslation: "لا تستسلم أبداً لأحلامك." },
        { english: "The key to success is persistence.", arabicTranslation: "مفتاح النجاح هو المثابرة." },
      ],
      keywords: [
        { english: "Persistence", arabicMeaning: "مثابرة / إصرار" },
        { english: "Purpose", arabicMeaning: "هدف / غاية" },
        { english: "Pursue", arabicMeaning: "يسعى لتحقيق / يتابع" },
        { english: "Challenge", arabicMeaning: "تحدٍّ" },
      ],
    },

    // B1 — SPEAKING
    {
      titleAr: "التعبير عن الرأي",
      levelCode: "B1", topicSlug: "speaking", order: 10, durationMinutes: 12,
      contentAr: `تعلم كيف تعبر عن رأيك بلغة مؤثرة ومحترمة:

للتعبير عن رأيك:
- In my opinion... — في رأيي...
- I think / believe that... — أعتقد أن...
- From my perspective... — من وجهة نظري...
- As far as I'm concerned... — فيما يخصني...

للموافقة: I agree with you, That's a good point, Exactly!

لعدم الموافقة بلطف:
- I see your point, but... — أفهم وجهة نظرك لكن...
- I'm not sure I agree... — لست متأكداً من موافقتي...
- That's interesting, however... — هذا مثير للاهتمام، لكن...`,
      examples: [
        { english: "In my opinion, social media has more benefits.", arabicTranslation: "في رأيي، وسائل التواصل لها فوائد أكثر." },
        { english: "I see your point, but I disagree.", arabicTranslation: "أفهم وجهة نظرك لكنني أختلف." },
        { english: "That's a valid point.", arabicTranslation: "هذه نقطة صحيحة." },
        { english: "I strongly believe that education is key.", arabicTranslation: "أعتقد بشدة أن التعليم هو المفتاح." },
      ],
      keywords: [
        { english: "Opinion", arabicMeaning: "رأي" },
        { english: "Perspective", arabicMeaning: "وجهة نظر / منظور" },
        { english: "Agree / Disagree", arabicMeaning: "يوافق / لا يوافق" },
        { english: "Valid", arabicMeaning: "صحيح / منطقي" },
      ],
    },
    {
      titleAr: "وصف الصور",
      levelCode: "B1", topicSlug: "speaking", order: 11, durationMinutes: 12,
      contentAr: `وصف الصور مهارة مهمة في اختبارات مثل IELTS وTOEFL:

هيكل وصف الصورة:
1. وصف عام: "This picture shows..." / "In this photo, I can see..."
2. التفاصيل: "In the foreground..." / "In the background..." / "On the left/right..."
3. الاستنتاج: "It looks like..." / "I think..." / "The atmosphere seems..."

كلمات مهمة:
- Foreground (المقدمة), Background (الخلفية)
- Appears to be (يبدو أنه)
- Surrounded by (محاط بـ)
- Seems to be doing (يبدو أنه يفعل)`,
      examples: [
        { english: "This photo shows a busy city street.", arabicTranslation: "تُظهر هذه الصورة شارعاً مدنياً مزدحماً." },
        { english: "In the foreground, there is a man.", arabicTranslation: "في المقدمة يوجد رجل." },
        { english: "The woman appears to be happy.", arabicTranslation: "تبدو المرأة سعيدة." },
        { english: "In the background, I can see mountains.", arabicTranslation: "في الخلفية أستطيع رؤية جبال." },
      ],
      keywords: [
        { english: "Foreground", arabicMeaning: "المقدمة (في الصورة)" },
        { english: "Background", arabicMeaning: "الخلفية" },
        { english: "Appears", arabicMeaning: "يبدو" },
        { english: "Surrounded", arabicMeaning: "محاط بـ" },
      ],
    },
    {
      titleAr: "المناقشة ثنائية الرأي",
      levelCode: "B1", topicSlug: "speaking", order: 12, durationMinutes: 15,
      contentAr: `مهارة المناقشة تتطلب معرفة كيف تطرح الحجج وتدافع عنها:

هيكل المناقشة:
- الطرح: On one hand... — من جهة...
- الرأي المقابل: On the other hand... — من جهة أخرى...
- الخلاصة: Overall / In conclusion... — خلاصة القول...

موضوع للمناقشة: "Should students use social media in school?"
حجج مع: It helps with research, encourages communication, prepares for digital world.
حجج ضد: Distracts from studying, causes cyberbullying, reduces face-to-face interaction.

تمرن على مناقشة موضوع لمدة 2 دقائق.`,
      examples: [
        { english: "On one hand, technology saves time.", arabicTranslation: "من جهة، التكنولوجيا توفر الوقت." },
        { english: "On the other hand, it can be addictive.", arabicTranslation: "من جهة أخرى، قد تسبب الإدمان." },
        { english: "In conclusion, balance is key.", arabicTranslation: "خلاصة القول، التوازن هو المفتاح." },
        { english: "I would argue that...", arabicTranslation: "أنا أرى أن..." },
      ],
      keywords: [
        { english: "On one hand", arabicMeaning: "من جهة" },
        { english: "Argument", arabicMeaning: "حجة / نقاش" },
        { english: "In conclusion", arabicMeaning: "في الخلاصة" },
        { english: "Debate", arabicMeaning: "نقاش / مناظرة" },
      ],
    },

    // ═══════════════════════════════════════════════════════
    // B2 — GRAMMAR
    // ═══════════════════════════════════════════════════════
    {
      titleAr: "الشرط الثاني — الفرضيات",
      levelCode: "B2", topicSlug: "grammar", order: 1, durationMinutes: 15,
      contentAr: `الشرط الثاني (Second Conditional) للحديث عن مواقف افتراضية أو غير محتملة في الحاضر أو المستقبل:

الصيغة: If + الماضي البسيط + would + المصدر

أمثلة:
- If I had more time, I would travel. (لو كان لدي وقت أكثر لسافرت — لكن ليس لدي)
- If she were a doctor, she could help. (لو كانت طبيبة لاستطاعت المساعدة)

ملاحظة: مع "I/he/she/it" نستخدم "were" بدلاً من "was" في الإنجليزية الفصيحة.

الفرق بين الشرط الأول والثاني:
- If I study, I will pass. (أول — محتمل)
- If I studied, I would pass. (ثاني — افتراضي/بعيد)`,
      examples: [
        { english: "If I were rich, I would buy a yacht.", arabicTranslation: "لو كنت غنياً لاشتريت يختاً." },
        { english: "What would you do if you lost your job?", arabicTranslation: "ماذا ستفعل لو فقدت وظيفتك؟" },
        { english: "If she knew the answer, she would tell us.", arabicTranslation: "لو كانت تعرف الإجابة لأخبرتنا." },
        { english: "I would live in Spain if I could.", arabicTranslation: "كنت سأسكن في إسبانيا لو استطعت." },
      ],
      keywords: [
        { english: "Would", arabicMeaning: "كنت سـ / كان سيـ" },
        { english: "Hypothetical", arabicMeaning: "افتراضي" },
        { english: "Wish", arabicMeaning: "يتمنى" },
        { english: "If only", arabicMeaning: "يا ليت / ليتني" },
      ],
    },
    {
      titleAr: "الكلام المنقول — Reported Speech",
      levelCode: "B2", topicSlug: "grammar", order: 2, durationMinutes: 15,
      contentAr: `الكلام المنقول (Reported Speech) يُستخدم لنقل ما قاله شخص آخر.

التغييرات عند النقل:
الأفعال تتأخر زمناً للخلف:
- am/is/are → was/were
- have/has → had
- will → would
- can → could

الضمائر تتغير حسب السياق.

مثال:
المباشر: "I love English," said Sara.
المنقول: Sara said (that) she loved English.

السؤال المنقول:
المباشر: "Where do you live?"
المنقول: He asked where I lived.`,
      examples: [
        { english: "He said he was tired.", arabicTranslation: "قال أنه كان متعباً." },
        { english: "She told me she would come.", arabicTranslation: "أخبرتني أنها ستأتي." },
        { english: "They asked if I had eaten.", arabicTranslation: "سألوا إذا كنت قد أكلت." },
        { english: "He said he could help us.", arabicTranslation: "قال أنه يمكنه مساعدتنا." },
      ],
      keywords: [
        { english: "Reported speech", arabicMeaning: "الكلام المنقول" },
        { english: "Said / Told", arabicMeaning: "قال / أخبر" },
        { english: "Asked", arabicMeaning: "سأل" },
        { english: "Whether", arabicMeaning: "إذا / ما إذا" },
      ],
    },
    {
      titleAr: "الأفعال المساعدة المتقدمة",
      levelCode: "B2", topicSlug: "grammar", order: 3, durationMinutes: 15,
      contentAr: `الأفعال المساعدة (Modal Verbs) تضيف معاني دقيقة للجمل:

الإمكانية والاحتمال:
- must (يجب / لا بد أن): It must be true.
- might / may (ربما / يحتمل): He might be late.
- can't (مستحيل): That can't be right.

الالتزام والنصيحة:
- should (ينبغي): You should see a doctor.
- ought to (يجب): You ought to apologize.
- had better (الأفضل أن): You'd better hurry.

الماضي مع المساعدات:
- should have done — كان ينبغي أن يفعل (لكن لم يفعل)
- could have done — كان بإمكانه أن يفعل`,
      examples: [
        { english: "You should have told me earlier.", arabicTranslation: "كان ينبغي أن تخبرني مبكراً." },
        { english: "He might have missed the flight.", arabicTranslation: "ربما فوّت الطائرة." },
        { english: "You'd better leave now.", arabicTranslation: "الأفضل أن تغادر الآن." },
        { english: "She must be very talented.", arabicTranslation: "لا بد أنها موهوبة جداً." },
      ],
      keywords: [
        { english: "Must / Mustn't", arabicMeaning: "يجب / يُحظر" },
        { english: "Might / May", arabicMeaning: "ربما / يحتمل" },
        { english: "Should have", arabicMeaning: "كان ينبغي (ولم يحدث)" },
        { english: "Had better", arabicMeaning: "من الأفضل أن" },
      ],
    },

    // B2 — VOCABULARY
    {
      titleAr: "مفردات الأعمال والاقتصاد",
      levelCode: "B2", topicSlug: "vocabulary", order: 4, durationMinutes: 12,
      contentAr: `مفردات عالم الأعمال الضرورية للحياة المهنية:

الشركات: startup (شركة ناشئة), merger (اندماج), acquisition (استحواذ), revenue (إيرادات), profit/loss (ربح/خسارة), budget (ميزانية), investment (استثمار)

الموظفون: CEO (رئيس تنفيذي), HR (موارد بشرية), employee (موظف), employer (صاحب عمل), colleague (زميل), promotion (ترقية), resignation (استقالة)

في الاجتماعات: agenda (جدول أعمال), deadline (موعد نهائي), presentation (عرض تقديمي), negotiate (يتفاوض), strategy (استراتيجية)`,
      examples: [
        { english: "The company had a revenue of 5 million.", arabicTranslation: "حققت الشركة إيرادات 5 ملايين." },
        { english: "She got a promotion last month.", arabicTranslation: "حصلت على ترقية الشهر الماضي." },
        { english: "We need to meet the deadline.", arabicTranslation: "نحتاج إلى الوفاء بالموعد النهائي." },
        { english: "The merger was announced yesterday.", arabicTranslation: "أُعلن عن الاندماج أمس." },
      ],
      keywords: [
        { english: "Revenue", arabicMeaning: "إيرادات" },
        { english: "Deadline", arabicMeaning: "الموعد النهائي" },
        { english: "Promotion", arabicMeaning: "ترقية" },
        { english: "Strategy", arabicMeaning: "استراتيجية" },
      ],
    },
    {
      titleAr: "التعابير الاصطلاحية الشائعة — Idioms",
      levelCode: "B2", topicSlug: "vocabulary", order: 5, durationMinutes: 15,
      contentAr: `التعابير الاصطلاحية (Idioms) تُستخدم كثيراً في الإنجليزية المحكية والمكتوبة:

Break the ice — كسر الجليد (بدء محادثة في موقف غير مريح)
Hit the nail on the head — أصاب كبد الحقيقة
Bite the bullet — يتحمل الأمر ويمضي قُدُماً
Under the weather — يشعر بتوعك
Cost an arm and a leg — غالٍ جداً
Beat around the bush — يتحاشى الموضوع
The ball is in your court — الأمر عليك / القرار بيدك
Once in a blue moon — نادراً جداً

تذكر: الاصطلاحات لا تُترجم حرفياً!`,
      examples: [
        { english: "I'll break the ice by introducing myself.", arabicTranslation: "سأكسر الجليد بتقديم نفسي." },
        { english: "That car costs an arm and a leg.", arabicTranslation: "تلك السيارة غالية الثمن جداً." },
        { english: "I'm feeling a bit under the weather.", arabicTranslation: "أشعر ببعض التوعك." },
        { english: "The ball is in your court now.", arabicTranslation: "القرار بيدك الآن." },
      ],
      keywords: [
        { english: "Idiom", arabicMeaning: "تعبير اصطلاحي" },
        { english: "Break the ice", arabicMeaning: "كسر الجليد / بدء التواصل" },
        { english: "Under the weather", arabicMeaning: "يشعر بتوعك" },
        { english: "Cost an arm and a leg", arabicMeaning: "باهظ الثمن" },
      ],
    },
    {
      titleAr: "مفردات الصحة والطب",
      levelCode: "B2", topicSlug: "vocabulary", order: 6, durationMinutes: 12,
      contentAr: `مفردات طبية متقدمة للتواصل في البيئات الصحية:

الأمراض: chronic (مزمن), acute (حاد), contagious (معدٍ), diagnosed (مشخَّص), recovery (تعافٍ)

العلاج: prescription (وصفة طبية), dosage (جرعة), side effects (آثار جانبية), surgery (جراحة), therapy (علاج)

الرعاية الصحية: specialist (متخصص), GP (طبيب عام), clinic (عيادة), insurance (تأمين صحي), emergency (طوارئ)

جمل مهمة:
- I've been diagnosed with... — تم تشخيصي بـ
- What are the side effects? — ما الآثار الجانبية؟`,
      examples: [
        { english: "The doctor prescribed antibiotics.", arabicTranslation: "وصف الطبيب المضادات الحيوية." },
        { english: "What are the side effects of this medicine?", arabicTranslation: "ما الآثار الجانبية لهذا الدواء؟" },
        { english: "She was diagnosed with diabetes.", arabicTranslation: "تم تشخيصها بمرض السكري." },
        { english: "I need to see a specialist.", arabicTranslation: "أحتاج إلى رؤية متخصص." },
      ],
      keywords: [
        { english: "Prescription", arabicMeaning: "وصفة طبية" },
        { english: "Diagnosed", arabicMeaning: "مشخَّص" },
        { english: "Side effects", arabicMeaning: "آثار جانبية" },
        { english: "Specialist", arabicMeaning: "أخصائي / متخصص" },
      ],
    },

    // B2 — LISTENING
    {
      titleAr: "بودكاست علمي",
      levelCode: "B2", topicSlug: "listening", order: 7, durationMinutes: 15,
      contentAr: `استمع إلى هذا المقتطف من بودكاست علمي:

"Scientists have recently discovered that trees communicate with each other through an underground network of fungi, often called the 'Wood Wide Web'. Through this network, older trees — known as 'mother trees' — share nutrients with younger, weaker trees nearby. They can even send chemical signals to warn other trees about insect attacks. This discovery has completely changed how we understand forest ecosystems. It suggests that forests are not collections of individual trees competing for resources, but rather cooperative communities that support each other."

كلمات علمية: fungi (فطريات), nutrients (مغذيات), chemical signals (إشارات كيميائية), ecosystem (نظام بيئي), cooperative (تعاوني)`,
      examples: [
        { english: "Trees communicate through fungi.", arabicTranslation: "تتواصل الأشجار عبر الفطريات." },
        { english: "Older trees share nutrients.", arabicTranslation: "تتشارك الأشجار الأكبر في المغذيات." },
        { english: "They warn others about attacks.", arabicTranslation: "تحذر الأشجار الأخرى من الهجمات." },
        { english: "Forests are cooperative communities.", arabicTranslation: "الغابات مجتمعات تعاونية." },
      ],
      keywords: [
        { english: "Fungi", arabicMeaning: "فطريات" },
        { english: "Nutrients", arabicMeaning: "مغذيات" },
        { english: "Ecosystem", arabicMeaning: "نظام بيئي" },
        { english: "Cooperative", arabicMeaning: "تعاوني" },
      ],
    },
    {
      titleAr: "نقاش تلفزيوني",
      levelCode: "B2", topicSlug: "listening", order: 8, durationMinutes: 15,
      contentAr: `استمع إلى مقتطف من نقاش تلفزيوني حول التعليم عن بُعد:

مذيع: Is online education as effective as traditional schooling?
ضيف 1: I strongly believe it is. Students have access to world-class content from anywhere. They can learn at their own pace, which suits different learning styles.
ضيف 2: I disagree. While online education offers flexibility, it lacks the social interaction crucial for development. Students miss out on teamwork and face-to-face collaboration.
مذيع: What about the digital divide?
ضيف 1: That's a valid concern. Access to technology must be equal. Governments need to invest in infrastructure.

مفردات النقاش: access (وصول), flexible (مرن), crucial (حاسم/بالغ الأهمية), infrastructure (بنية تحتية)`,
      examples: [
        { english: "Students can learn at their own pace.", arabicTranslation: "يمكن للطلاب التعلم بوتيرتهم الخاصة." },
        { english: "It lacks social interaction.", arabicTranslation: "يفتقر إلى التفاعل الاجتماعي." },
        { english: "That's a valid concern.", arabicTranslation: "هذا قلق مشروع." },
        { english: "Access must be equal.", arabicTranslation: "يجب أن يكون الوصول متساوياً." },
      ],
      keywords: [
        { english: "Flexible", arabicMeaning: "مرن" },
        { english: "Crucial", arabicMeaning: "بالغ الأهمية / حاسم" },
        { english: "Digital divide", arabicMeaning: "الفجوة الرقمية" },
        { english: "Infrastructure", arabicMeaning: "بنية تحتية" },
      ],
    },
    {
      titleAr: "محاضرة أكاديمية",
      levelCode: "B2", topicSlug: "listening", order: 9, durationMinutes: 15,
      contentAr: `مقتطف من محاضرة أكاديمية حول علم النفس:

"Today we'll discuss the concept of cognitive bias — the systematic patterns of deviation from norm in judgement. One well-known example is confirmation bias, where people favour information that confirms their existing beliefs. Another is the Dunning-Kruger effect, where people with limited knowledge in a field overestimate their competence. Understanding these biases is crucial for critical thinking, decision-making, and avoiding manipulation. As future professionals, you need to recognize these patterns in both yourself and others."

مفردات أكاديمية: cognitive (معرفي), deviation (انحراف), confirmation bias (تحيز التأكيد), overestimate (يبالغ في تقدير)`,
      examples: [
        { english: "Cognitive bias affects our judgement.", arabicTranslation: "يؤثر التحيز المعرفي على حكمنا." },
        { english: "People favour confirming information.", arabicTranslation: "يفضل الناس المعلومات المؤكِّدة." },
        { english: "Recognizing bias is crucial.", arabicTranslation: "التعرف على التحيز أمر بالغ الأهمية." },
        { english: "We overestimate our own competence.", arabicTranslation: "نبالغ في تقدير كفاءتنا." },
      ],
      keywords: [
        { english: "Cognitive", arabicMeaning: "معرفي / إدراكي" },
        { english: "Bias", arabicMeaning: "تحيز / انحياز" },
        { english: "Overestimate", arabicMeaning: "يبالغ في التقدير" },
        { english: "Manipulation", arabicMeaning: "تلاعب" },
      ],
    },

    // B2 — SPEAKING
    {
      titleAr: "المناقشة المهنية",
      levelCode: "B2", topicSlug: "speaking", order: 10, durationMinutes: 15,
      contentAr: `في البيئات المهنية تحتاج للتحدث بثقة وإقناع:

عرض الأفكار:
- I'd like to propose... — أود أن أقترح...
- My recommendation would be... — توصيتي ستكون...
- The data suggests that... — تشير البيانات إلى...

التعامل مع الاعتراضات:
- I understand your concern, however... — أفهم قلقك، إلا أن...
- That's a fair point. Let me clarify... — هذه نقطة عادلة. دعني أوضح...
- With respect, I disagree because... — مع الاحترام، لا أوافق لأن...

إنهاء الاجتماع:
- To summarize what we've discussed... — لتلخيص ما ناقشناه...
- The next steps are... — الخطوات التالية هي...`,
      examples: [
        { english: "I'd like to propose a new approach.", arabicTranslation: "أود أن أقترح نهجاً جديداً." },
        { english: "The data suggests we need to change.", arabicTranslation: "تشير البيانات إلى أننا بحاجة للتغيير." },
        { english: "Let me clarify my position.", arabicTranslation: "دعني أوضح موقفي." },
        { english: "To summarize the key points...", arabicTranslation: "لتلخيص النقاط الرئيسية..." },
      ],
      keywords: [
        { english: "Propose", arabicMeaning: "يقترح" },
        { english: "Recommendation", arabicMeaning: "توصية" },
        { english: "Clarify", arabicMeaning: "يوضح / يشرح" },
        { english: "Summarize", arabicMeaning: "يلخص" },
      ],
    },
    {
      titleAr: "التفاوض والإقناع",
      levelCode: "B2", topicSlug: "speaking", order: 11, durationMinutes: 15,
      contentAr: `مهارات التفاوض مهمة في العمل والحياة اليومية:

بدء التفاوض:
- We're looking for a deal that works for both sides.
- Perhaps we could reach a compromise.

تقديم التنازلات:
- We're willing to offer... in exchange for...
- If you agree to..., we'll be happy to...

رفض شرط بلطف:
- I'm afraid that's not something we can agree to.
- That would be difficult for us, but perhaps...

إغلاق الاتفاق:
- I think we have a deal!
- Let's shake on it.
- I'll send you the contract by tomorrow.`,
      examples: [
        { english: "Perhaps we could reach a compromise.", arabicTranslation: "ربما يمكننا التوصل إلى حل وسط." },
        { english: "We're willing to offer a discount.", arabicTranslation: "نحن على استعداد لتقديم خصم." },
        { english: "I think we have a deal!", arabicTranslation: "أعتقد أننا توصلنا إلى اتفاق!" },
        { english: "I'll send the contract tomorrow.", arabicTranslation: "سأرسل العقد غداً." },
      ],
      keywords: [
        { english: "Negotiate", arabicMeaning: "يتفاوض" },
        { english: "Compromise", arabicMeaning: "حل وسط / تنازل متبادل" },
        { english: "Deal", arabicMeaning: "اتفاقية / صفقة" },
        { english: "Contract", arabicMeaning: "عقد" },
      ],
    },
    {
      titleAr: "عرض تقديمي احترافي",
      levelCode: "B2", topicSlug: "speaking", order: 12, durationMinutes: 15,
      contentAr: `هيكل العرض التقديمي الاحترافي:

1. المقدمة:
"Good morning everyone. Today I'll be presenting our quarterly results. My presentation will cover three main points..."

2. التنقل بين النقاط:
"Moving on to the next point..."
"This brings me to..."
"Let's now look at..."

3. استخدام البيانات:
"As you can see from this graph..."
"The figures show that..."
"This represents a 20% increase..."

4. الخاتمة:
"To summarize, the key takeaways are..."
"I'd be happy to answer any questions."`,
      examples: [
        { english: "Today I'll be presenting our results.", arabicTranslation: "اليوم سأقدم نتائجنا." },
        { english: "Moving on to the next point...", arabicTranslation: "الانتقال إلى النقطة التالية..." },
        { english: "As you can see from this graph...", arabicTranslation: "كما يمكنك رؤيته من هذا الرسم..." },
        { english: "I'd be happy to answer questions.", arabicTranslation: "يسعدني الإجابة على الأسئلة." },
      ],
      keywords: [
        { english: "Quarterly", arabicMeaning: "ربع سنوي" },
        { english: "Takeaway", arabicMeaning: "خلاصة / درس مستفاد" },
        { english: "Graph / Chart", arabicMeaning: "رسم بياني" },
        { english: "Key points", arabicMeaning: "النقاط الرئيسية" },
      ],
    },

    // ═══════════════════════════════════════════════════════
    // C1 — GRAMMAR
    // ═══════════════════════════════════════════════════════
    {
      titleAr: "الشرط الثالث — الماضي المفترض",
      levelCode: "C1", topicSlug: "grammar", order: 1, durationMinutes: 15,
      contentAr: `الشرط الثالث (Third Conditional) يتحدث عن مواقف افتراضية في الماضي — أشياء لم تحدث:

الصيغة: If + had + التصريف الثالث + would have + التصريف الثالث

أمثلة:
- If I had studied harder, I would have passed. (لو درست أكثر لكنت قد نجحت — لكنني لم أدرس)
- If she hadn't been late, she would have caught the flight. (لو لم تتأخر لكانت قد لحقت بالطائرة)

الخلط بين الشروط الثلاثة:
1. أول: If it rains, I'll stay. (محتمل في المستقبل)
2. ثانٍ: If it rained, I'd stay. (افتراضي في الحاضر)
3. ثالث: If it had rained, I'd have stayed. (افتراضي في الماضي)`,
      examples: [
        { english: "If he had called, I would have come.", arabicTranslation: "لو اتصل لكنت قد جئت." },
        { english: "She wouldn't have failed if she'd tried harder.", arabicTranslation: "كانت لن ترسب لو حاولت أكثر." },
        { english: "What would you have done differently?", arabicTranslation: "ماذا كنت ستفعل بشكل مختلف؟" },
        { english: "If I hadn't met her, my life would be different.", arabicTranslation: "لو لم أقابلها لكانت حياتي مختلفة." },
      ],
      keywords: [
        { english: "Would have", arabicMeaning: "كان سيكون (لو أن)" },
        { english: "Had + past participle", arabicMeaning: "ماضٍ تام في جملة الشرط" },
        { english: "Regret", arabicMeaning: "ندم" },
        { english: "Differently", arabicMeaning: "بشكل مختلف" },
      ],
    },
    {
      titleAr: "أساليب التوكيد والتقوية",
      levelCode: "C1", topicSlug: "grammar", order: 2, durationMinutes: 15,
      contentAr: `أساليب التوكيد (Cleft Sentences & Emphasis) تُستخدم لإبراز جزء معين من الجملة:

1. It is/was... that/who:
- It was John who called. (يبرز John)
- It is education that changes lives. (يبرز education)

2. What... is/was:
- What I need is more time. (ما أحتاجه هو وقت أكثر)
- What surprised me was his reaction. (ما فاجأني كان ردة فعله)

3. التقديم والتأخير:
- Never have I seen such beauty. (الجملة المعكوسة للتوكيد)
- Only then did I understand. (فقط حينها فهمت)

4. do/does/did للتوكيد:
- I do agree with you. (أنا أوافقك فعلاً)`,
      examples: [
        { english: "It was the speech that inspired me.", arabicTranslation: "كان الخطاب هو ما ألهمني." },
        { english: "What I want is honesty.", arabicTranslation: "ما أريده هو الصدق." },
        { english: "Never have I felt so proud.", arabicTranslation: "لم أشعر بهذا الفخر قط." },
        { english: "I do understand your frustration.", arabicTranslation: "أنا أفهم إحباطك فعلاً." },
      ],
      keywords: [
        { english: "Cleft sentence", arabicMeaning: "جملة الحصر والتوكيد" },
        { english: "Emphasis", arabicMeaning: "توكيد / تأكيد" },
        { english: "Inversion", arabicMeaning: "القلب / عكس ترتيب الجملة" },
        { english: "Highlight", arabicMeaning: "يُبرز / يُسلط الضوء على" },
      ],
    },
    {
      titleAr: "أسماء الموصول المتقدمة",
      levelCode: "C1", topicSlug: "grammar", order: 3, durationMinutes: 15,
      contentAr: `الجمل الموصولة (Relative Clauses) تُضاف للتوضيح والتفصيل:

المحددة (Defining): بدونها تتغير المعنى — بدون فاصلة
- The man who called you is my boss.

غير المحددة (Non-defining): معلومة إضافية — مع فاصلة
- My brother, who lives in London, is a doctor.

أدوات متقدمة:
- whose (الذي له / ملكية): The author whose book I read...
- whom (مفعول به رسمي): The person to whom I spoke...
- whereby (الذي بموجبه): A system whereby students...
- whichever / whoever / whatever (أياً كان)`,
      examples: [
        { english: "The policy, which was introduced last year, has failed.", arabicTranslation: "السياسة التي أُدخلت العام الماضي قد فشلت." },
        { english: "The scientist whose research changed medicine.", arabicTranslation: "العالم الذي غيّر بحثه الطب." },
        { english: "Whichever option you choose, I'll support you.", arabicTranslation: "أياً كان الخيار الذي تختاره، سأدعمك." },
        { english: "The colleague to whom I reported has retired.", arabicTranslation: "الزميل الذي كنت أرفع له تقاريري تقاعد." },
      ],
      keywords: [
        { english: "Whose", arabicMeaning: "الذي له / ملكية" },
        { english: "Whereby", arabicMeaning: "الذي بموجبه" },
        { english: "Defining", arabicMeaning: "محدد / تعريفي" },
        { english: "Non-defining", arabicMeaning: "غير محدد / وصفي" },
      ],
    },

    // C1 — VOCABULARY
    {
      titleAr: "المفردات الأكاديمية — Academic Word List",
      levelCode: "C1", topicSlug: "vocabulary", order: 4, durationMinutes: 15,
      contentAr: `المفردات الأكاديمية ضرورية للدراسة والكتابة الرسمية:

أفعال التحليل: analyze (يحلل), evaluate (يقيم), interpret (يفسر), assess (يقيّم), demonstrate (يُبرهن)

أفعال الحجة: argue (يحتج), claim (يدّعي), contend (يجادل), assert (يؤكد), refute (يدحض)

أسماء مهمة: framework (إطار), methodology (منهجية), perspective (منظور), implication (تداعية), phenomenon (ظاهرة)

صفات أكاديمية: significant (بالغ الأهمية), substantial (جوهري), comprehensive (شامل), consistent (متسق), relevant (ذو صلة)`,
      examples: [
        { english: "This study analyzes the impact of climate change.", arabicTranslation: "تحلل هذه الدراسة تأثير تغير المناخ." },
        { english: "The researcher refuted previous claims.", arabicTranslation: "دحض الباحث الادعاءات السابقة." },
        { english: "The findings have significant implications.", arabicTranslation: "للنتائج تداعيات بالغة الأهمية." },
        { english: "A comprehensive methodology was employed.", arabicTranslation: "تم توظيف منهجية شاملة." },
      ],
      keywords: [
        { english: "Analyze", arabicMeaning: "يحلل" },
        { english: "Methodology", arabicMeaning: "منهجية" },
        { english: "Implication", arabicMeaning: "تداعية / مضمون" },
        { english: "Refute", arabicMeaning: "يدحض / يرد على" },
      ],
    },
    {
      titleAr: "المجازات اللغوية والاستعارات",
      levelCode: "C1", topicSlug: "vocabulary", order: 5, durationMinutes: 15,
      contentAr: `الاستعارات والمجازات تمنح الكتابة والحديث حياة وتأثيراً:

استعارات الوقت: Time is money (الوقت من ذهب), Time flies (الوقت يطير)

استعارات الحياة: Life is a journey (الحياة رحلة), Life is a battlefield (الحياة معركة)

استعارات الأعمال: The company is bleeding money (الشركة تنزف مالاً), We need to plant seeds now (نحتاج لزرع البذور الآن)

الكنايات المهذبة (Euphemisms):
- Passed away (توفي — بدل مات)
- Let go (أُقيل — بدل طُرد)
- Between jobs (عاطل — بدل بلا عمل)`,
      examples: [
        { english: "Time is money — don't waste it.", arabicTranslation: "الوقت من ذهب — لا تهدره." },
        { english: "The economy is bleeding.", arabicTranslation: "الاقتصاد ينزف." },
        { english: "She passed away last night.", arabicTranslation: "رحلت البارحة." },
        { english: "He's currently between jobs.", arabicTranslation: "هو حالياً بين وظيفتين." },
      ],
      keywords: [
        { english: "Metaphor", arabicMeaning: "استعارة" },
        { english: "Euphemism", arabicMeaning: "كناية مهذبة / تلطيف" },
        { english: "Simile", arabicMeaning: "تشبيه (like/as)" },
        { english: "Figure of speech", arabicMeaning: "أسلوب بلاغي" },
      ],
    },
    {
      titleAr: "الكلمات المتشابهة والمتضادة",
      levelCode: "C1", topicSlug: "vocabulary", order: 6, durationMinutes: 12,
      contentAr: `الكلمات المتشابهة في النطق أو الكتابة لكنها مختلفة في المعنى (Confusables):

affect vs effect: affect (فعل: يؤثر على), effect (اسم: تأثير/أثر)
principal vs principle: principal (رئيسي/مدير), principle (مبدأ)
complement vs compliment: complement (يكمل), compliment (يمدح)
elicit vs illicit: elicit (يستدرج/يستخرج), illicit (غير مشروع)
eminent vs imminent: eminent (بارز/مشهور), imminent (وشيك)
discreet vs discrete: discreet (حذر/كتوم), discrete (منفصل/مستقل)

تذكر: السياق هو المفتاح!`,
      examples: [
        { english: "Stress can affect your health.", arabicTranslation: "يمكن أن يؤثر الضغط على صحتك." },
        { english: "The effect of stress on health is well-known.", arabicTranslation: "تأثير الضغط على الصحة معروف." },
        { english: "The principal aim is customer satisfaction.", arabicTranslation: "الهدف الرئيسي هو رضا العميل." },
        { english: "She complimented him on his speech.", arabicTranslation: "أثنت عليه لخطابه." },
      ],
      keywords: [
        { english: "Affect / Effect", arabicMeaning: "يؤثر / تأثير" },
        { english: "Complement", arabicMeaning: "يكمل" },
        { english: "Imminent", arabicMeaning: "وشيك / قريب الحدوث" },
        { english: "Discreet", arabicMeaning: "حذر / كتوم" },
      ],
    },

    // C1 — LISTENING
    {
      titleAr: "خطاب سياسي",
      levelCode: "C1", topicSlug: "listening", order: 7, durationMinutes: 15,
      contentAr: `استمع إلى مقتطف من خطاب سياسي:

"Fellow citizens, we stand at a crossroads. The decisions we make today will echo through generations. We face unprecedented challenges: economic inequality, environmental degradation, and the erosion of social trust. Yet history has shown us that adversity breeds innovation. Our nation has overcome hardship before, and we shall do so again — not through division, but through unity; not through fear, but through courage; not through rhetoric, but through action. I call upon every citizen to rise above partisan interests and embrace our shared humanity."

كلمات سياسية: unprecedented (غير مسبوق), inequality (عدم المساواة), adversity (شدة / محنة), partisan (حزبي), rhetoric (بلاغة / خطابة)`,
      examples: [
        { english: "We stand at a crossroads.", arabicTranslation: "نحن عند مفترق طرق." },
        { english: "Adversity breeds innovation.", arabicTranslation: "تُفرز الشدائد الابتكار." },
        { english: "Rise above partisan interests.", arabicTranslation: "تسامى فوق المصالح الحزبية." },
        { english: "Embrace our shared humanity.", arabicTranslation: "استيعاب إنسانيتنا المشتركة." },
      ],
      keywords: [
        { english: "Unprecedented", arabicMeaning: "غير مسبوق" },
        { english: "Adversity", arabicMeaning: "شدة / محنة" },
        { english: "Partisan", arabicMeaning: "حزبي / متحيز" },
        { english: "Rhetoric", arabicMeaning: "خطابة / بلاغة" },
      ],
    },
    {
      titleAr: "مقابلة ثقافية",
      levelCode: "C1", topicSlug: "listening", order: 8, durationMinutes: 15,
      contentAr: `مقابلة مع فنان حول إبداعه:

محاور: Your work often challenges social norms. Is that deliberate?
فنان: Absolutely. Art, at its core, is about asking uncomfortable questions. When society becomes complacent, art must provoke. My paintings are an attempt to hold up a mirror to our collective conscience.
محاور: Some critics find your work disturbing.
فنان: Good. Discomfort is the precursor to change. If my work makes people squirm a little, makes them question their assumptions — I've done my job.
محاور: What inspires your current series?
فنان: The juxtaposition of beauty and decay. We live in an era of breathtaking achievement alongside devastating inequality.

كلمات فنية: deliberate (متعمد), complacent (راضٍ بالوضع), provoke (يثير), precursor (مقدمة لـ), juxtaposition (تناقض/مقابلة)`,
      examples: [
        { english: "Art must provoke thought.", arabicTranslation: "يجب أن يثير الفن التفكير." },
        { english: "Discomfort is the precursor to change.", arabicTranslation: "الانزعاج هو مقدمة التغيير." },
        { english: "Challenging social norms.", arabicTranslation: "تحدي الأعراف الاجتماعية." },
        { english: "The juxtaposition of beauty and decay.", arabicTranslation: "التناقض بين الجمال والاضمحلال." },
      ],
      keywords: [
        { english: "Provoke", arabicMeaning: "يثير / يستفز" },
        { english: "Complacent", arabicMeaning: "راضٍ بالوضع / مستسلم" },
        { english: "Precursor", arabicMeaning: "مقدمة / بادئة" },
        { english: "Juxtaposition", arabicMeaning: "تناقض / مقارنة متجاورة" },
      ],
    },
    {
      titleAr: "نقاش فلسفي",
      levelCode: "C1", topicSlug: "listening", order: 9, durationMinutes: 15,
      contentAr: `نقاش فلسفي حول الأخلاق وتكنولوجيا الذكاء الاصطناعي:

"The question before us is not merely whether artificial intelligence is capable of replicating human intelligence, but whether the two are fundamentally distinct. If we define intelligence solely by functional output, then the distinction collapses. However, if consciousness, empathy, and moral agency are constitutive of true intelligence, then no machine — however sophisticated — can be truly intelligent. The implications extend beyond philosophy into law, ethics, and the very definition of personhood. Who is responsible when an autonomous system causes harm?"

كلمات فلسفية: replicating (نسخ/محاكاة), constitutive (مُكوِّن لـ), autonomous (مستقل/ذاتي), personhood (الشخصية القانونية/الإنسانية), moral agency (الفاعلية الأخلاقية)`,
      examples: [
        { english: "Intelligence cannot be defined by output alone.", arabicTranslation: "لا يمكن تعريف الذكاء بالناتج وحده." },
        { english: "Moral agency is uniquely human.", arabicTranslation: "الفاعلية الأخلاقية فريدة للإنسان." },
        { english: "Who is responsible for autonomous systems?", arabicTranslation: "من المسؤول عن الأنظمة الذاتية؟" },
        { english: "The implications extend into law.", arabicTranslation: "التداعيات تمتد إلى مجال القانون." },
      ],
      keywords: [
        { english: "Autonomous", arabicMeaning: "مستقل / ذاتي" },
        { english: "Constitutive", arabicMeaning: "مُكوِّن لـ / أساسي" },
        { english: "Moral agency", arabicMeaning: "الفاعلية الأخلاقية" },
        { english: "Personhood", arabicMeaning: "الشخصية الإنسانية / القانونية" },
      ],
    },

    // C1 — SPEAKING
    {
      titleAr: "الخطاب المقنع",
      levelCode: "C1", topicSlug: "speaking", order: 10, durationMinutes: 15,
      contentAr: `فن الإقناع (Persuasive Speaking) يجمع بين المنطق والعاطفة والمصداقية:

Logos — المنطق والبيانات:
"Statistics show that 80% of learners who practice daily improve significantly."

Pathos — العاطفة:
"Imagine your child unable to find a job because of a language barrier."

Ethos — المصداقية:
"As someone who spent 10 years in the field, I can tell you..."

تقنيات الإقناع:
- Rule of three (ثلاثية التأثير): fast, efficient, and reliable
- Rhetorical questions: Aren't we all responsible for this?
- Repetition for emphasis: Yes we can!`,
      examples: [
        { english: "The evidence clearly demonstrates...", arabicTranslation: "تُثبت الأدلة بوضوح..." },
        { english: "Think about the impact on future generations.", arabicTranslation: "فكر في التأثير على الأجيال القادمة." },
        { english: "As an expert in this field, I assure you...", arabicTranslation: "بوصفي خبيراً في هذا المجال، أؤكد لك..." },
        { english: "Aren't we all responsible for change?", arabicTranslation: "أَلَسنا جميعاً مسؤولين عن التغيير؟" },
      ],
      keywords: [
        { english: "Persuade", arabicMeaning: "يقنع" },
        { english: "Evidence", arabicMeaning: "دليل / برهان" },
        { english: "Rhetorical", arabicMeaning: "خطابي / بلاغي" },
        { english: "Credibility", arabicMeaning: "مصداقية" },
      ],
    },
    {
      titleAr: "التحدث عن القضايا الاجتماعية",
      levelCode: "C1", topicSlug: "speaking", order: 11, durationMinutes: 15,
      contentAr: `كيف تتحدث عن قضايا اجتماعية معقدة بلغة راقية:

البناء: Issue → Cause → Effect → Solution

مثال: "Climate change is one of the most pressing issues of our time. It's largely driven by human activity — fossil fuel consumption, deforestation, and industrial emissions. The effects are already visible: rising sea levels, extreme weather events, and loss of biodiversity. The solution requires a multi-faceted approach: international cooperation, investment in renewables, and a fundamental shift in consumer behavior."

مفردات القضايا الاجتماعية: pressing (ملحّ), driven by (مدفوع بـ), multi-faceted (متعدد الأوجه), biodiversity (تنوع بيولوجي)`,
      examples: [
        { english: "This is one of the most pressing issues.", arabicTranslation: "هذه واحدة من أكثر القضايا إلحاحاً." },
        { english: "The problem is largely driven by...", arabicTranslation: "المشكلة مدفوعة إلى حد بعيد بـ..." },
        { english: "A multi-faceted approach is needed.", arabicTranslation: "نهج متعدد الأوجه ضروري." },
        { english: "There needs to be a fundamental shift.", arabicTranslation: "هناك حاجة إلى تحول جذري." },
      ],
      keywords: [
        { english: "Pressing", arabicMeaning: "ملحّ / عاجل" },
        { english: "Multi-faceted", arabicMeaning: "متعدد الأوجه" },
        { english: "Biodiversity", arabicMeaning: "التنوع البيولوجي" },
        { english: "Fundamental", arabicMeaning: "جوهري / أساسي" },
      ],
    },
    {
      titleAr: "التفاعل في الندوات",
      levelCode: "C1", topicSlug: "speaking", order: 12, durationMinutes: 15,
      contentAr: `مهارات المشاركة في الندوات والمؤتمرات الأكاديمية:

طرح السؤال:
"I'd like to pick up on something you said earlier about..."
"Could you elaborate on the relationship between X and Y?"
"Your point about Z raises an interesting question..."

الإضافة إلى النقاش:
"Building on what the previous speaker said..."
"This connects to a broader debate about..."

التحفظ المودبة:
"While I accept your premise, I'd question whether..."
"The evidence you cite is compelling, however one might argue..."`,
      examples: [
        { english: "Could you elaborate on that point?", arabicTranslation: "هل يمكنك التفصيل في تلك النقطة؟" },
        { english: "Building on what was said earlier...", arabicTranslation: "بناءً على ما قيل مسبقاً..." },
        { english: "I'd question whether the data supports this.", arabicTranslation: "أتساءل إذا كانت البيانات تدعم هذا." },
        { english: "This raises an interesting question.", arabicTranslation: "هذا يطرح سؤالاً مثيراً للاهتمام." },
      ],
      keywords: [
        { english: "Elaborate", arabicMeaning: "يُفصّل / يُوسّع" },
        { english: "Premise", arabicMeaning: "مقدمة / افتراض" },
        { english: "Compelling", arabicMeaning: "مقنع / قوي" },
        { english: "Seminar", arabicMeaning: "ندوة / حلقة نقاش" },
      ],
    },

    // ═══════════════════════════════════════════════════════
    // C2 — GRAMMAR
    // ═══════════════════════════════════════════════════════
    {
      titleAr: "التراكيب النحوية المعقدة",
      levelCode: "C2", topicSlug: "grammar", order: 1, durationMinutes: 15,
      contentAr: `على مستوى C2 تُتقن التراكيب الأكثر تعقيداً ودقة:

1. التحويل (Nominalization): تحويل الأفعال والصفات إلى أسماء للتعبير الأكاديمي:
- "The company grew" → "The growth of the company"
- "He decided" → "His decision"

2. الحذف والاستبدال (Ellipsis & Substitution):
- "She came early and so did he." (so did = came early)
- "Would you like some? I'd love some." (some = coffee/tea)

3. التوازي (Parallelism):
- "He likes reading, writing, and speaking." (لا: "He likes reading, to write, and speech.")

4. الاقتباس المضمن والتضمين في الكتابة الأكاديمية`,
      examples: [
        { english: "The implementation of the policy was swift.", arabicTranslation: "كان تطبيق السياسة سريعاً." },
        { english: "She sings beautifully, and so does her sister.", arabicTranslation: "تغني بشكل جميل، وكذلك أختها." },
        { english: "The report examines, analyses, and evaluates.", arabicTranslation: "يفحص التقرير ويحلل ويقيّم." },
        { english: "His resignation sparked widespread debate.", arabicTranslation: "أشعلت استقالته نقاشاً واسعاً." },
      ],
      keywords: [
        { english: "Nominalization", arabicMeaning: "الأسمنة / تحويل إلى اسم" },
        { english: "Ellipsis", arabicMeaning: "الحذف اللغوي" },
        { english: "Parallelism", arabicMeaning: "التوازي / التوازن في الجمل" },
        { english: "Cohesion", arabicMeaning: "الترابط / الانسجام النصي" },
      ],
    },
    {
      titleAr: "الأسلوب والنبرة في الكتابة",
      levelCode: "C2", topicSlug: "grammar", order: 2, durationMinutes: 15,
      contentAr: `إتقان الأسلوب يعني التحكم في النبرة والوضوح والتأثير:

أسلوب رسمي:
- جمل أطول ومركبة، مفردات أكاديمية، مبني للمجهول كثير
- "It has been demonstrated that..."

أسلوب غير رسمي:
- جمل قصيرة، اختصارات، كلمات عامية
- "Studies show that..."

أسلوب إبداعي:
- تنويع طول الجمل. ثلاث كلمات. ثم سيل من المعاني يتدفق في جملة واحدة طويلة تجذب القارئ.

التحكم في النبرة:
- محايدة: "The results indicate..."
- متحمسة: "The results are remarkable!"
- قلقة: "The findings raise serious concerns..."`,
      examples: [
        { english: "The data suggests a correlation.", arabicTranslation: "تشير البيانات إلى وجود ارتباط." },
        { english: "It is evident that reform is necessary.", arabicTranslation: "من الواضح أن الإصلاح ضروري." },
        { english: "The findings raise serious concerns.", arabicTranslation: "النتائج تثير مخاوف جدية." },
        { english: "Stylistic choices define your voice.", arabicTranslation: "الخيارات الأسلوبية تحدد صوتك." },
      ],
      keywords: [
        { english: "Tone", arabicMeaning: "نبرة / أسلوب الخطاب" },
        { english: "Formal / Informal", arabicMeaning: "رسمي / غير رسمي" },
        { english: "Register", arabicMeaning: "مستوى اللغة / السجل اللغوي" },
        { english: "Nuance", arabicMeaning: "دقة / فارق دقيق في المعنى" },
      ],
    },
    {
      titleAr: "صياغة الحجج المعقدة كتابةً",
      levelCode: "C2", topicSlug: "grammar", order: 3, durationMinutes: 20,
      contentAr: `على مستوى C2 تستطيع كتابة مقالات أكاديمية متكاملة:

هيكل المقالة النقدية:
1. مقدمة: سياق، أطروحة (thesis statement)
2. الجسم: كل فقرة = نقطة + دليل + تحليل
3. خاتمة: إعادة صياغة الأطروحة + توصية

أدوات الربط المتقدمة:
- Notwithstanding (بالرغم من)
- Insofar as (بقدر ما / من حيث)
- Albeit (وإن كان / رغم أن)
- Hitherto (حتى الآن — للماضي)
- Therein lies (وفي ذلك يكمن)

التحوط الأكاديمي (Hedging):
- "It appears that..." / "There is evidence to suggest..."`,
      examples: [
        { english: "Notwithstanding the challenges, progress was made.", arabicTranslation: "على الرغم من التحديات، تم إحراز تقدم." },
        { english: "Albeit imperfect, the solution worked.", arabicTranslation: "وإن لم تكن مثالية، نجحت الحل." },
        { english: "Therein lies the fundamental contradiction.", arabicTranslation: "وفي ذلك يكمن التناقض الجوهري." },
        { english: "There is evidence to suggest a link.", arabicTranslation: "هناك أدلة تشير إلى وجود صلة." },
      ],
      keywords: [
        { english: "Notwithstanding", arabicMeaning: "بالرغم من / على الرغم من" },
        { english: "Albeit", arabicMeaning: "وإن كان / رغم أن" },
        { english: "Hedging", arabicMeaning: "التحوط الأكاديمي" },
        { english: "Thesis", arabicMeaning: "أطروحة / فرضية" },
      ],
    },

    // C2 — VOCABULARY
    {
      titleAr: "الكلمات النادرة والمتطورة",
      levelCode: "C2", topicSlug: "vocabulary", order: 4, durationMinutes: 15,
      contentAr: `مفردات C2 تميزك كمتكلم على مستوى الناطق الأصلي المثقف:

Ephemeral — زائل / عابر (short-lived)
Serendipity — اكتشاف سعيد بالصدفة
Ubiquitous — في كل مكان / منتشر
Ameliorate — يُحسّن / يُخفف
Exacerbate — يُفاقم / يُزيد سوءاً
Juxtapose — يضع جنباً إلى جنب (للمقارنة)
Nuanced — دقيق / متعدد الأبعاد
Paradoxical — متناقض / عكسي
Proliferate — ينتشر بسرعة / يتكاثر
Quintessential — النموذج الأمثل / الجوهر الحقيقي`,
      examples: [
        { english: "Social media is ubiquitous in modern life.", arabicTranslation: "وسائل التواصل في كل مكان في الحياة الحديثة." },
        { english: "The new policy may exacerbate inequality.", arabicTranslation: "قد تُفاقم السياسة الجديدة من عدم المساواة." },
        { english: "He gave a nuanced analysis of the situation.", arabicTranslation: "قدّم تحليلاً دقيقاً للوضع." },
        { english: "It was a serendipitous discovery.", arabicTranslation: "كان اكتشافاً سعيداً بالصدفة." },
      ],
      keywords: [
        { english: "Ubiquitous", arabicMeaning: "في كل مكان / منتشر" },
        { english: "Exacerbate", arabicMeaning: "يُفاقم / يُزيد سوءاً" },
        { english: "Nuanced", arabicMeaning: "دقيق / متعدد الأبعاد" },
        { english: "Serendipity", arabicMeaning: "الاكتشاف السعيد بالصدفة" },
      ],
    },
    {
      titleAr: "اللغة الأدبية والشعرية",
      levelCode: "C2", topicSlug: "vocabulary", order: 5, durationMinutes: 15,
      contentAr: `فهم اللغة الأدبية يفتح أمامك عالم الأدب الإنجليزي:

أساليب بلاغية:
- Alliteration (الجناس التصويتي): "Peter Piper picked a peck of pickled peppers"
- Onomatopoeia (محاكاة الأصوات): buzz, crash, whisper
- Oxymoron (المتناقضات): deafening silence, bittersweet
- Hyperbole (المبالغة): "I've told you a million times!"
- Personification (التشخيص): "The wind whispered secrets"

الأجناس الأدبية: novel (رواية), short story (قصة قصيرة), poetry (شعر), play (مسرحية), memoir (مذكرات)`,
      examples: [
        { english: "The deafening silence was overwhelming.", arabicTranslation: "كان الصمت الصاخب مُرهقاً." },
        { english: "Time crawls when you're bored.", arabicTranslation: "الوقت يزحف حين تشعر بالملل." },
        { english: "The waves sang their ancient song.", arabicTranslation: "غنّت الأمواج أغنيتها الأزلية." },
        { english: "It was a bittersweet farewell.", arabicTranslation: "كانت وداعاً مُرّ الحلاوة." },
      ],
      keywords: [
        { english: "Alliteration", arabicMeaning: "جناس تصويتي" },
        { english: "Oxymoron", arabicMeaning: "طباق / تناقض بلاغي" },
        { english: "Personification", arabicMeaning: "تشخيص / إحياء الجماد" },
        { english: "Hyperbole", arabicMeaning: "مبالغة بلاغية" },
      ],
    },
    {
      titleAr: "الفروق الدقيقة في المعنى",
      levelCode: "C2", topicSlug: "vocabulary", order: 6, durationMinutes: 15,
      contentAr: `إتقان الفروق الدقيقة يجعلك دقيقاً كالمتحدث الأصلي:

Look / See / Watch / Gaze / Glance / Peer / Stare:
- look (ينظر — بقصد), see (يرى — بدون قصد), watch (يشاهد — متابعة), gaze (يحدق — بإعجاب), glance (ينظر خطفاً), stare (يحدق — بفضول أو تشخيص)

Say / Tell / Speak / Talk / Claim / Assert / Contend:
- say (يقول), tell (يخبر + شخص), speak (يتكلم — رسمي), talk (يتحدث — غير رسمي), claim (يدّعي — يحتمل الشك), assert (يؤكد — بثقة), contend (يجادل)

Fast / Quick / Rapid / Swift / Speedy / Hasty:
- fast (سريع عموماً), rapid (متسارع — تقني), swift (سريع — جميل), hasty (متسرع — سلبي)`,
      examples: [
        { english: "She gazed at the painting for hours.", arabicTranslation: "حدّقت في اللوحة لساعات." },
        { english: "He asserted his innocence.", arabicTranslation: "أكد براءته بثقة." },
        { english: "Don't make a hasty decision.", arabicTranslation: "لا تتخذ قراراً متسرعاً." },
        { english: "The virus spread rapidly.", arabicTranslation: "انتشر الفيروس بسرعة متسارعة." },
      ],
      keywords: [
        { english: "Gaze", arabicMeaning: "يحدق / ينظر بإمعان" },
        { english: "Assert", arabicMeaning: "يؤكد بثقة" },
        { english: "Hasty", arabicMeaning: "متسرع (بمعنى سلبي)" },
        { english: "Contend", arabicMeaning: "يجادل / يزعم" },
      ],
    },

    // C2 — LISTENING
    {
      titleAr: "خطاب نوبل",
      levelCode: "C2", topicSlug: "listening", order: 7, durationMinutes: 15,
      contentAr: `مقتطف من خطاب استلام جائزة نوبل للسلام:

"I stand before you today not as an individual, but as a symbol of the millions who dare to stand up for their rights and dignity. I have witnessed unspeakable violence, unimaginable poverty, and the systematic destruction of hope. Yet I have also seen extraordinary courage — the mother who risked her life to educate her daughter, the boy who walked miles under threat to reach a classroom. These are not exceptional people. They are ordinary human beings with extraordinary determination. Today, I dedicate this prize not to myself, but to every child who was told their voice does not matter. Because it does."

كلمات: unspeakable (لا يوصف), dignity (كرامة), extraordinary (استثنائي), determination (إصرار)`,
      examples: [
        { english: "I stand as a symbol, not an individual.", arabicTranslation: "أقف كرمز لا كفرد." },
        { english: "They showed extraordinary determination.", arabicTranslation: "أبدوا إصراراً استثنائياً." },
        { english: "I dedicate this prize to every child.", arabicTranslation: "أهدي هذه الجائزة لكل طفل." },
        { english: "Every voice matters.", arabicTranslation: "كل صوت مهم." },
      ],
      keywords: [
        { english: "Dignity", arabicMeaning: "كرامة" },
        { english: "Extraordinary", arabicMeaning: "استثنائي / خارق للعادة" },
        { english: "Determination", arabicMeaning: "إصرار / عزم" },
        { english: "Unspeakable", arabicMeaning: "لا يوصف / لا يُقال" },
      ],
    },
    {
      titleAr: "مقابلة مع كاتب",
      levelCode: "C2", topicSlug: "listening", order: 8, durationMinutes: 15,
      contentAr: `مقابلة عمق مع روائي:

محاور: Your novels are often described as 'uncomfortable'. Do you write to disturb?
روائي: Not to disturb — to illuminate. Great literature doesn't offer comfortable answers; it asks better questions. Dostoevsky, Kafka, Achebe — none of them sought to reassure. They sought to excavate the human condition.
محاور: Is there a moral responsibility in storytelling?
روائي: Inescapably so. Every narrative makes implicit choices about whose perspective matters, whose suffering counts. The writer who claims neutrality is either naive or dishonest. Language is never neutral.

كلمات: illuminate (يُضيء/يُلقي الضوء), excavate (يحفر/يكشف), inescapably (بشكل لا مفر منه), implicit (ضمني)`,
      examples: [
        { english: "Great literature asks better questions.", arabicTranslation: "الأدب الرفيع يطرح أسئلة أفضل." },
        { english: "They sought to excavate the human condition.", arabicTranslation: "سعوا إلى الكشف عن الحالة الإنسانية." },
        { english: "Language is never neutral.", arabicTranslation: "اللغة ليست أبداً محايدة." },
        { english: "Every narrative makes implicit choices.", arabicTranslation: "كل سرد يتضمن خيارات ضمنية." },
      ],
      keywords: [
        { english: "Illuminate", arabicMeaning: "يُضيء / يُلقي الضوء" },
        { english: "Excavate", arabicMeaning: "يحفر / يكشف ما هو خفي" },
        { english: "Inescapably", arabicMeaning: "بشكل لا مفر منه" },
        { english: "Implicit", arabicMeaning: "ضمني / غير صريح" },
      ],
    },
    {
      titleAr: "نقاش فلسفي متقدم",
      levelCode: "C2", topicSlug: "listening", order: 9, durationMinutes: 15,
      contentAr: `نقاش فلسفي حول الحرية والمسؤولية:

"The tension between freedom and responsibility is perhaps the defining paradox of human existence. Jean-Paul Sartre famously proclaimed that we are 'condemned to be free' — meaning that choice is inescapable, and with choice comes absolute responsibility. But this raises a troubling question: can we truly be free if our choices are constrained by circumstance, biology, or society? The determinist would say no — that our actions are the inevitable product of prior causes. The compatibilist offers a middle ground: freedom is not the absence of causation, but the alignment of one's actions with one's deepest desires."

مفردات: paradox (مفارقة), condemned (محكوم عليه), determinist (حتمي), compatibilist (توافقي في الفلسفة)`,
      examples: [
        { english: "We are condemned to be free.", arabicTranslation: "نحن محكوم علينا بالحرية." },
        { english: "Choice is inescapable.", arabicTranslation: "الاختيار لا مفر منه." },
        { english: "This raises a troubling question.", arabicTranslation: "هذا يطرح سؤالاً مقلقاً." },
        { english: "Freedom is not the absence of causation.", arabicTranslation: "الحرية ليست غياب السببية." },
      ],
      keywords: [
        { english: "Paradox", arabicMeaning: "مفارقة / تناقض" },
        { english: "Condemned", arabicMeaning: "محكوم عليه" },
        { english: "Determinist", arabicMeaning: "حتمي (فلسفياً)" },
        { english: "Inescapable", arabicMeaning: "لا مفر منه" },
      ],
    },

    // C2 — SPEAKING
    {
      titleAr: "الخطاب الأدبي",
      levelCode: "C2", topicSlug: "speaking", order: 10, durationMinutes: 15,
      contentAr: `التحدث بمستوى أدبي راقٍ يجمع بين المعرفة والجمال اللغوي:

التعليق الأدبي:
"What strikes me most about Austen's prose is its deceptive simplicity. On the surface, it is witty and elegant; beneath, it is a precise anatomization of social hypocrisy and gender inequality in Regency England."

مهارات التحليل الأدبي:
- Identify themes (تحديد الموضوعات)
- Analyse literary devices (تحليل الأساليب البلاغية)
- Contextualise historically (السياق التاريخي)
- Personal response (الاستجابة الشخصية للنص)

تعابير النقد الأدبي: deceptive simplicity, anatomization, subverts expectations, emblematic of`,
      examples: [
        { english: "What strikes me most is the irony.", arabicTranslation: "ما يلفت انتباهي أكثر هو السخرية." },
        { english: "The novel anatomizes social hypocrisy.", arabicTranslation: "الرواية تشرّح الرياء الاجتماعي." },
        { english: "This is emblematic of the period.", arabicTranslation: "هذا تعبير رمزي عن تلك الحقبة." },
        { english: "Austen subverts reader expectations.", arabicTranslation: "أوستن تقلب توقعات القارئ." },
      ],
      keywords: [
        { english: "Deceptive", arabicMeaning: "مضلل / خادع" },
        { english: "Anatomize", arabicMeaning: "يشرّح / يحلل بعمق" },
        { english: "Emblematic", arabicMeaning: "رمزي / ممثل لـ" },
        { english: "Subvert", arabicMeaning: "يقوّض / يعكس" },
      ],
    },
    {
      titleAr: "النقاش الأكاديمي المتقدم",
      levelCode: "C2", topicSlug: "speaking", order: 11, durationMinutes: 15,
      contentAr: `مشاركة فاعلة في النقاشات الأكاديمية عالية المستوى:

الطعن في الفرضيات:
"I'd like to challenge the underlying assumption that..."
"The premise of your argument seems to rest on..."
"That claim merits closer scrutiny because..."

بناء على الحجة:
"Your point dovetails with recent research by..."
"This resonates with the theoretical framework of..."

تقديم تحفظات متطورة:
"While broadly compelling, the argument overlooks..."
"The evidence, whilst suggestive, cannot be taken as conclusive..."`,
      examples: [
        { english: "I'd like to challenge that assumption.", arabicTranslation: "أريد أن أتحدى ذلك الافتراض." },
        { english: "That claim merits closer scrutiny.", arabicTranslation: "ذلك الادعاء يستحق تدقيقاً أعمق." },
        { english: "This dovetails with recent research.", arabicTranslation: "هذا يتوافق مع الأبحاث الحديثة." },
        { english: "The evidence cannot be conclusive.", arabicTranslation: "لا يمكن اعتبار الأدلة حاسمة." },
      ],
      keywords: [
        { english: "Scrutiny", arabicMeaning: "تدقيق / فحص دقيق" },
        { english: "Dovetail", arabicMeaning: "يتوافق / ينسجم تماماً" },
        { english: "Conclusive", arabicMeaning: "حاسم / قاطع" },
        { english: "Premise", arabicMeaning: "افتراض مبدئي" },
      ],
    },
    {
      titleAr: "التعبير الإبداعي الشفهي",
      levelCode: "C2", topicSlug: "speaking", order: 12, durationMinutes: 15,
      contentAr: `في C2 تستطيع التعبير بحرية وإبداع تاماً:

الحكاية الشخصية المؤثرة:
"There is a moment I return to often in memory — a rain-soaked afternoon in Edinburgh, when I first understood what it meant to be truly alone in a place where no one knows your name. It was terrifying. It was liberating. It was, in retrospect, the moment I became myself."

مهارات السرد المتقدم:
- In medias res (البدء في قلب الحدث)
- Non-linear narrative (السرد غير الخطي)
- Stream of consciousness (تيار الوعي)
- Show, don't tell (اعرض لا تُخبر)`,
      examples: [
        { english: "It was, in retrospect, a turning point.", arabicTranslation: "كانت، في نظرة للوراء، نقطة تحوّل." },
        { english: "There is a moment I return to often.", arabicTranslation: "ثمة لحظة أعود إليها كثيراً في ذاكرتي." },
        { english: "It was terrifying. It was liberating.", arabicTranslation: "كان مرعباً. كان محرراً." },
        { english: "Show, don't tell.", arabicTranslation: "اعرض لا تُخبر." },
      ],
      keywords: [
        { english: "In retrospect", arabicMeaning: "في نظرة للوراء / استرجاعاً" },
        { english: "Liberating", arabicMeaning: "محرر / مُعتِق" },
        { english: "Narrative", arabicMeaning: "سرد / قصة" },
        { english: "Stream of consciousness", arabicMeaning: "تيار الوعي" },
      ],
    },
  ];

  // Insert lessons
  let lessonOrder = 0;
  for (const l of lessonsData) {
    await db.insert(lessonsTable).values({
      titleAr: l.titleAr,
      levelId: L[l.levelCode],
      topicId: T[l.topicSlug],
      order: ++lessonOrder,
      durationMinutes: l.durationMinutes,
      contentAr: l.contentAr,
      examplesJson: JSON.stringify(l.examples),
      keyWordsJson: JSON.stringify(l.keywords),
    });
  }
  console.log(`✅ ${lessonsData.length} درس`);

  // Fetch inserted lessons
  const dbLessons = await db.select().from(lessonsTable).orderBy(lessonsTable.order);

  // ───── QUIZ QUESTIONS ─────
  const quizData: { titleAr: string; questions: { q: string; opts: string[]; correct: number }[] }[] = [
    // A1 Grammar
    {
      titleAr: "الضمائر الشخصية وفعل To Be",
      questions: [
        { q: "ما الصيغة الصحيحة؟", opts: ["She am a doctor.", "She is a doctor.", "She are a doctor.", "She be a doctor."], correct: 1 },
        { q: "أكمل: '_____ are students.'", opts: ["He", "I", "They", "She"], correct: 2 },
        { q: "ما معنى 'We are friends'؟", opts: ["هي صديقة", "نحن أصدقاء", "هم أصدقاء", "أنتم أصدقاء"], correct: 1 },
      ]
    },
    {
      titleAr: "المفرد والجمع — هذا وهذه",
      questions: [
        { q: "ما الصحيح لوصف جمع قريب؟", opts: ["That", "This", "These", "Those"], correct: 2 },
        { q: "أي جملة صحيحة؟", opts: ["An book", "A apple", "An apple", "A hour"], correct: 2 },
        { q: "ما جمع 'child'؟", opts: ["Childs", "Children", "Childes", "Childer"], correct: 1 },
      ]
    },
    {
      titleAr: "الأسئلة الأساسية — WH Questions",
      questions: [
        { q: "ما كلمة الاستفهام للسؤال عن المكان؟", opts: ["What", "Who", "Where", "When"], correct: 2 },
        { q: "أكمل: '_____ is your name?'", opts: ["Where", "Who", "What", "How"], correct: 2 },
        { q: "السؤال عن العمر يبدأ بـ:", opts: ["How old", "How many", "What age", "Who old"], correct: 0 },
      ]
    },
    // A1 Vocabulary
    {
      titleAr: "التحية والتعارف",
      questions: [
        { q: "ما معنى 'Nice to meet you'؟", opts: ["وداعاً", "سعيد بمعرفتك", "شكراً", "أهلاً"], correct: 1 },
        { q: "كيف تقول 'صباح الخير'؟", opts: ["Good evening", "Good afternoon", "Good morning", "Good night"], correct: 2 },
        { q: "رد مناسب على 'How are you?'", opts: ["My name is Ahmed", "I'm fine, thank you", "Nice to meet you", "Goodbye"], correct: 1 },
      ]
    },
    {
      titleAr: "الأرقام والألوان",
      questions: [
        { q: "ما لون 'أزرق'؟", opts: ["Red", "Green", "Blue", "Yellow"], correct: 2 },
        { q: "كيف تكتب الرقم 15؟", opts: ["Fifty", "Fifteen", "Fiveteen", "Five-ten"], correct: 1 },
        { q: "ما معنى 'Twenty'؟", opts: ["12", "20", "30", "02"], correct: 1 },
      ]
    },
    {
      titleAr: "الأسرة والعائلة",
      questions: [
        { q: "ما معنى 'Grandmother'؟", opts: ["عمة", "أخت", "جدة", "أم"], correct: 2 },
        { q: "كيف تقول 'أخ'؟", opts: ["Sister", "Cousin", "Uncle", "Brother"], correct: 3 },
        { q: "ما معنى 'Uncle'؟", opts: ["ابن العم", "عم أو خال", "جد", "أخ"], correct: 1 },
      ]
    },
    // A1 Listening
    {
      titleAr: "محادثة في المطار",
      questions: [
        { q: "ما معنى 'Enjoy your stay'؟", opts: ["وداعاً", "استمتع بإقامتك", "شكراً لك", "مرحباً بك"], correct: 1 },
        { q: "كيف يسأل الموظف عن المدة؟", opts: ["Where are you from?", "How long is your visit?", "What is your name?", "Are you ready?"], correct: 1 },
        { q: "ما معنى 'Welcome'؟", opts: ["وداعاً", "شكراً", "مرحباً", "آسف"], correct: 2 },
      ]
    },
    {
      titleAr: "في المطعم — طلب الطعام",
      questions: [
        { q: "كيف تطلب شيئاً بلباقة؟", opts: ["I want coffee", "Give me coffee", "I would like a coffee", "Coffee please now"], correct: 2 },
        { q: "كيف تسأل عن السعر؟", opts: ["How much is it?", "What time is it?", "Where is it?", "Who is it?"], correct: 0 },
        { q: "ما معنى 'Meal'؟", opts: ["طاولة", "وجبة", "قائمة", "طاهٍ"], correct: 1 },
      ]
    },
    {
      titleAr: "وصف الأماكن البسيطة",
      questions: [
        { q: "كيف تقول 'يوجد كتاب'؟", opts: ["There are book", "There is a book", "Here is book", "Is there book"], correct: 1 },
        { q: "ما معنى 'Next to'؟", opts: ["بعيداً عن", "فوق", "بجانب", "تحت"], correct: 2 },
        { q: "ما معنى 'Upstairs'؟", opts: ["في الأسفل", "في الخارج", "في الداخل", "في الأعلى"], correct: 3 },
      ]
    },
    // A1 Speaking
    {
      titleAr: "تقديم نفسك",
      questions: [
        { q: "كيف تقول 'اسمي محمد'؟", opts: ["I am named Mohammed", "My name is Mohammed", "Name is Mohammed", "Mohammed my name"], correct: 1 },
        { q: "كيف تقول 'أنا من الرياض'؟", opts: ["I come of Riyadh", "I from Riyadh am", "I am from Riyadh", "From Riyadh I"], correct: 2 },
        { q: "ما الصيغة الصحيحة للهواية؟", opts: ["I like play football", "I am like football", "I like football", "I likes football"], correct: 2 },
      ]
    },
    {
      titleAr: "وصف العائلة بالحديث",
      questions: [
        { q: "ما معنى 'Married'؟", opts: ["أعزب", "متزوج", "مطلق", "منخطب"], correct: 1 },
        { q: "كيف تقول 'أخي الأكبر'؟", opts: ["My young brother", "My older brother", "My big brother", "My elder brothers"], correct: 1 },
        { q: "كيف تسأل عن كلمة لا تعرفها؟", opts: ["What means this?", "How do you say this?", "What is the word?", "Translate please"], correct: 1 },
      ]
    },
    {
      titleAr: "الاتجاهات البسيطة",
      questions: [
        { q: "كيف تبدأ بسؤال شخص غريب؟", opts: ["Hey you!", "Listen!", "Excuse me", "Hello man"], correct: 2 },
        { q: "ما معنى 'Turn right'؟", opts: ["اذهب مباشرة", "انعطف يساراً", "انعطف يميناً", "ارجع للخلف"], correct: 2 },
        { q: "ما معنى 'Go straight'؟", opts: ["انعطف", "ارجع", "اذهب مباشرة", "قف"], correct: 2 },
      ]
    },
    // A2 Grammar
    {
      titleAr: "الماضي البسيط — الأفعال المنتظمة",
      questions: [
        { q: "ما الماضي الصحيح لـ 'study'؟", opts: ["Studyed", "Studied", "Study", "Studing"], correct: 1 },
        { q: "ما الصحيح في النفي؟", opts: ["She not work", "She didn't worked", "She didn't work", "She don't work"], correct: 2 },
        { q: "أي كلمة تدل على الماضي؟", opts: ["Tomorrow", "Now", "Yesterday", "Soon"], correct: 2 },
      ]
    },
    {
      titleAr: "الماضي البسيط — الأفعال الشاذة",
      questions: [
        { q: "ما الماضي الصحيح لـ 'go'؟", opts: ["Goed", "Gone", "Went", "Going"], correct: 2 },
        { q: "ما الماضي الصحيح لـ 'buy'؟", opts: ["Buyed", "Buyd", "Bought", "Byed"], correct: 2 },
        { q: "ما الماضي الصحيح لـ 'have'؟", opts: ["Haved", "Had", "Has", "Have"], correct: 1 },
      ]
    },
    {
      titleAr: "المستقبل — will و going to",
      questions: [
        { q: "متى نستخدم 'going to'؟", opts: ["للتنبؤات العشوائية", "للخطط المسبقة", "للقرارات الفورية", "للماضي"], correct: 1 },
        { q: "ما نفي 'will'؟", opts: ["Willnot", "Won't", "Not will", "Willn't"], correct: 1 },
        { q: "الجملة الصحيحة:", opts: ["I will going", "I am will go", "I will go", "I go will"], correct: 2 },
      ]
    },
    // A2 Vocabulary
    {
      titleAr: "الطعام والمشروبات",
      questions: [
        { q: "ما معنى 'Vegetables'؟", opts: ["فاكهة", "خضروات", "لحوم", "حلويات"], correct: 1 },
        { q: "كيف تقول لا تحب شيئاً؟", opts: ["I don't like", "I not like", "I dislike not", "No I like"], correct: 0 },
        { q: "ما معنى 'Grilled'؟", opts: ["مقلي", "مسلوق", "مشوي", "نيء"], correct: 2 },
      ]
    },
    {
      titleAr: "المهن والوظائف",
      questions: [
        { q: "كيف تسأل عن مهنة شخص؟", opts: ["What you do?", "What do you do?", "What are you work?", "How you work?"], correct: 1 },
        { q: "ما معنى 'Lawyer'؟", opts: ["طبيب", "محاسب", "محامٍ", "طيار"], correct: 2 },
        { q: "الصيغة الصحيحة:", opts: ["I am working as teacher", "I work as a teacher", "I is a teacher working", "Work teacher I am"], correct: 1 },
      ]
    },
    {
      titleAr: "الطقس والفصول",
      questions: [
        { q: "ما معنى 'Cloudy'؟", opts: ["مشمس", "غائم", "ممطر", "ثلجي"], correct: 1 },
        { q: "كيف تسأل عن الطقس؟", opts: ["How is weather?", "What's the weather like?", "How weather today?", "Tell me weather"], correct: 1 },
        { q: "ما الفصل الذي يلي الربيع؟", opts: ["Winter", "Autumn", "Summer", "Spring"], correct: 2 },
      ]
    },
    // A2 Listening
    {
      titleAr: "حوار التسوق",
      questions: [
        { q: "ما معنى 'On sale'؟", opts: ["بسعر مرتفع", "بتخفيض", "للبيع فقط", "جديد"], correct: 1 },
        { q: "ما معنى 'Can I try it on'؟", opts: ["هل يمكنني شراؤه؟", "هل يمكنني تجربته؟", "هل أنت متأكد؟", "هل هو جيد؟"], correct: 1 },
        { q: "ما هو مقاس 'Medium'؟", opts: ["صغير", "كبير جداً", "وسط", "ضخم"], correct: 2 },
      ]
    },
    {
      titleAr: "حجز فندق",
      questions: [
        { q: "ما معنى 'Booking is confirmed'؟", opts: ["الحجز مرفوض", "الحجز مؤكد", "الحجز معلق", "لا يوجد حجز"], correct: 1 },
        { q: "ما معنى 'Per night'؟", opts: ["في الأسبوع", "شهرياً", "في الليلة", "يومياً"], correct: 2 },
        { q: "ما نوع الغرفة 'Double room'؟", opts: ["غرفة بسرير واحد صغير", "غرفة بسريرين", "غرفة بسرير كبير", "جناح فاخر"], correct: 2 },
      ]
    },
    {
      titleAr: "مواعيد الطبيب",
      questions: [
        { q: "ما معنى 'Sore throat'؟", opts: ["ألم في الرأس", "التهاب الحلق", "ألم في المعدة", "حمى"], correct: 1 },
        { q: "ما معنى 'Get well soon'؟", opts: ["تصرف بسرعة", "شفاءً عاجلاً", "اذهب بسرعة", "انتهِ سريعاً"], correct: 1 },
        { q: "ما معنى 'Fever'؟", opts: ["برودة", "حمى", "دوار", "تعب"], correct: 1 },
      ]
    },
    // A2 Speaking
    {
      titleAr: "الحديث عن يومك",
      questions: [
        { q: "ما الصحيح لوصف الروتين؟", opts: ["I woke up every day at 6", "I wake up every day at 6", "I am wake up at 6", "Every day I waking up"], correct: 1 },
        { q: "ما معنى 'Take a nap'؟", opts: ["يأخذ دواء", "يقود سيارة", "يأخذ قيلولة", "يذهب للعمل"], correct: 2 },
        { q: "كيف تقول 'أخيراً'؟", opts: ["Before", "Then", "Finally", "After"], correct: 2 },
      ]
    },
    {
      titleAr: "الحديث عن الهوايات",
      questions: [
        { q: "ما الصحيح؟", opts: ["I enjoy to play chess", "I enjoy play chess", "I enjoy playing chess", "I enjoying chess"], correct: 2 },
        { q: "ما معنى 'Hobby'؟", opts: ["مهنة", "هواية", "عمل", "دراسة"], correct: 1 },
        { q: "كيف تسأل عن هواية شخص؟", opts: ["What hobbies have you?", "Do you have any hobbies?", "What you like hobby?", "Have any hobbies?"], correct: 1 },
      ]
    },
    {
      titleAr: "وصف التجارب الماضية",
      questions: [
        { q: "ما الصحيح؟", opts: ["Last year I visit London", "Last year I visited London", "Last year I have visited", "Last year visiting London"], correct: 1 },
        { q: "ما معنى 'Amazing'؟", opts: ["مخيف", "ممل", "رائع", "سيء"], correct: 2 },
        { q: "كيف تصف شعوراً إيجابياً عن رحلة؟", opts: ["It was terrible", "It was boring", "It was awful", "It was wonderful"], correct: 3 },
      ]
    },
    // B1 Grammar
    {
      titleAr: "المضارع التام — Have you ever?",
      questions: [
        { q: "ما الصحيح؟", opts: ["Have you ever been to Paris?", "Did you ever been to Paris?", "Have you ever went?", "You ever been?"], correct: 0 },
        { q: "ما معنى 'I have never tried sushi'؟", opts: ["جربت السوشي من قبل", "لم أجرب السوشي قط", "سأجرب السوشي", "أحب السوشي"], correct: 1 },
        { q: "ما الفرق بين 'for' و 'since'؟", opts: ["نفس المعنى", "for للمدة، since لنقطة البداية", "since للمدة، for للنهاية", "لا فرق"], correct: 1 },
      ]
    },
    {
      titleAr: "أسلوب الشرط الأول — If",
      questions: [
        { q: "ما الصحيح في الشرط الأول؟", opts: ["If it will rain", "If it rained", "If it rains", "If it rain"], correct: 2 },
        { q: "أكمل: 'If you study hard, you _____ pass.'", opts: ["would", "will", "might have", "could have"], correct: 1 },
        { q: "ما معنى 'Unless'؟", opts: ["حتى لو", "إلا إذا / ما لم", "لأن", "عندما"], correct: 1 },
      ]
    },
    {
      titleAr: "المبني للمجهول — Passive Voice",
      questions: [
        { q: "حوّل إلى مبني للمجهول: 'They built the bridge.'", opts: ["The bridge built", "The bridge was built", "The bridge is built", "Built was the bridge"], correct: 1 },
        { q: "ما الصحيح في المضارع المبني للمجهول؟", opts: ["Coffee grows in Brazil", "Coffee is grew", "Coffee is grown", "Coffee was grow"], correct: 2 },
        { q: "متى نستخدم المبني للمجهول؟", opts: ["عندما يكون الفاعل مهماً", "عندما لا يكون الفاعل مهماً", "دائماً في الإنجليزية", "فقط في الماضي"], correct: 1 },
      ]
    },
    // B1 Vocabulary
    {
      titleAr: "العواطف والمشاعر",
      questions: [
        { q: "ما معنى 'Exhausted'؟", opts: ["سعيد", "قلق", "منهك جداً", "غاضب"], correct: 2 },
        { q: "ما معنى 'Grateful'؟", opts: ["غيور", "ممتنن", "محبط", "متحمس"], correct: 1 },
        { q: "ما الفرق بين 'sad' و 'depressed'؟", opts: ["نفس المعنى", "sad أخف، depressed أعمق وطبي", "depressed مؤقت، sad دائم", "لا فرق"], correct: 1 },
      ]
    },
    {
      titleAr: "السفر والسياحة",
      questions: [
        { q: "ما معنى 'Boarding pass'؟", opts: ["جواز السفر", "التأشيرة", "بطاقة الصعود", "تذكرة الحجز"], correct: 2 },
        { q: "ما معنى 'Souvenir'؟", opts: ["فندق", "تذكار / هدية", "ترحيب", "تأشيرة"], correct: 1 },
        { q: "ما معنى 'Check in'؟", opts: ["تسجيل الخروج", "تسجيل الدخول", "حجز الغرفة", "دفع الفاتورة"], correct: 1 },
      ]
    },
    {
      titleAr: "التكنولوجيا والإنترنت",
      questions: [
        { q: "ما معنى 'Download'؟", opts: ["رفع ملف", "تنزيل ملف", "حذف ملف", "فتح ملف"], correct: 1 },
        { q: "ما معنى 'Notification'؟", opts: ["تحديث", "إشعار", "كلمة مرور", "اتصال"], correct: 1 },
        { q: "ما الفرق بين 'upload' و 'download'؟", opts: ["نفس الشيء", "upload رفع، download تنزيل", "download رفع، upload تنزيل", "كلاهما تنزيل"], correct: 1 },
      ]
    },
    // B1 Listening
    {
      titleAr: "نشرة الأخبار",
      questions: [
        { q: "ما معنى 'Announce'؟", opts: ["يلغي", "يُعلن", "يُخفي", "يُرجئ"], correct: 1 },
        { q: "ما معنى 'Pollution'؟", opts: ["تطوير", "تلوث", "نمو", "هجرة"], correct: 1 },
        { q: "ما معنى 'Shares rose 15 percent'؟", opts: ["الأسهم انخفضت", "الأسهم ارتفعت", "الأسهم ثبتت", "الأسهم أُلغيت"], correct: 1 },
      ]
    },
    {
      titleAr: "مقابلة عمل",
      questions: [
        { q: "ما معنى 'Strengths'؟", opts: ["نقاط الضعف", "التحديات", "نقاط القوة", "الأهداف"], correct: 2 },
        { q: "ما معنى 'Team player'؟", opts: ["يعمل وحيداً", "يعمل ضمن الفريق", "قائد الفريق", "مدرب الفريق"], correct: 1 },
        { q: "ما الإجابة الأفضل على 'Tell me about yourself'؟", opts: ["My hobby is football", "I graduated and have 3 years experience", "I need this job", "I don't know"], correct: 1 },
      ]
    },
    {
      titleAr: "خطاب محفّز",
      questions: [
        { q: "ما معنى 'Persistence'؟", opts: ["كسل", "مثابرة", "سرعة", "هدوء"], correct: 1 },
        { q: "ما معنى 'Pursue your dreams'؟", opts: ["انتظر أحلامك", "اترك أحلامك", "اسعَ لتحقيق أحلامك", "نسيان الأحلام"], correct: 2 },
        { q: "ما معنى 'Challenge is an opportunity'؟", opts: ["التحدي خطر", "التحدي مشكلة", "التحدي فرصة", "التحدي نهاية"], correct: 2 },
      ]
    },
    // B1 Speaking
    {
      titleAr: "التعبير عن الرأي",
      questions: [
        { q: "ما الجملة الصحيحة للتعبير عن الرأي؟", opts: ["My opinion is...", "In my opinion...", "I opinion...", "Opinion of me..."], correct: 1 },
        { q: "كيف ترفض رأياً بلطف؟", opts: ["You are wrong!", "I see your point, but...", "That's stupid", "No, I disagree"], correct: 1 },
        { q: "ما معنى 'Valid point'؟", opts: ["نقطة خاطئة", "نقطة صحيحة ومقبولة", "نقطة غير مهمة", "نقطة معقدة"], correct: 1 },
      ]
    },
    {
      titleAr: "وصف الصور",
      questions: [
        { q: "ما معنى 'Foreground'؟", opts: ["الخلفية", "الجانب", "المقدمة", "الوسط"], correct: 2 },
        { q: "كيف تبدأ وصف صورة؟", opts: ["The picture is...", "This photo shows...", "I see a photo", "Picture of..."], correct: 1 },
        { q: "ما معنى 'Appears to be'؟", opts: ["يختفي", "يبدو أنه", "يعرف أنه", "يؤكد أنه"], correct: 1 },
      ]
    },
    {
      titleAr: "المناقشة ثنائية الرأي",
      questions: [
        { q: "كيف تعرض الرأي المقابل؟", opts: ["But...", "On the other hand...", "Also...", "Because..."], correct: 1 },
        { q: "كيف تبدأ الخلاصة؟", opts: ["First of all...", "However...", "In conclusion...", "Moreover..."], correct: 2 },
        { q: "ما معنى 'I would argue that'؟", opts: ["أنا أرفض أن", "أنا غير متأكد أن", "أنا أرى أن / أحتج بأن", "أنا لا أعرف أن"], correct: 2 },
      ]
    },
    // B2 Grammar
    {
      titleAr: "الشرط الثاني — الفرضيات",
      questions: [
        { q: "ما الصحيح في الشرط الثاني؟", opts: ["If I am rich", "If I will be rich", "If I were rich", "If I be rich"], correct: 2 },
        { q: "متى نستخدم الشرط الثاني؟", opts: ["للأحداث المحتملة", "للأحداث الافتراضية غير المحتملة", "للماضي", "للمستقبل المؤكد"], correct: 1 },
        { q: "أكمل: 'If she knew, she _____ tell us.'", opts: ["will", "would", "could have", "might have"], correct: 1 },
      ]
    },
    {
      titleAr: "الكلام المنقول — Reported Speech",
      questions: [
        { q: "حوّل: 'I am tired' → He said...", opts: ["He said he is tired", "He said he was tired", "He said I am tired", "He said I was tired"], correct: 1 },
        { q: "ما يتغير في الكلام المنقول؟", opts: ["الضمائر فقط", "الأفعال فقط", "الضمائر والأفعال والزمن", "لا شيء"], correct: 2 },
        { q: "حوّل: 'will' في المنقول:", opts: ["would", "will", "shall", "could"], correct: 0 },
      ]
    },
    {
      titleAr: "الأفعال المساعدة المتقدمة",
      questions: [
        { q: "ما معنى 'You should have told me'؟", opts: ["ستخبرني", "كان ينبغي أن تخبرني", "يجب أن تخبرني", "ربما أخبرتني"], correct: 1 },
        { q: "ما معنى 'He might have missed the flight'؟", opts: ["لحق بالطائرة", "ربما فوّت الطائرة", "لم يفوّت الطائرة", "سيفوّت الطائرة"], correct: 1 },
        { q: "ما معنى 'You'd better leave'؟", opts: ["قد تغادر", "من الأفضل أن تغادر", "يجب أن لا تغادر", "ربما تغادر"], correct: 1 },
      ]
    },
    // B2 Vocabulary
    {
      titleAr: "مفردات الأعمال والاقتصاد",
      questions: [
        { q: "ما معنى 'Revenue'؟", opts: ["خسارة", "إيرادات", "ميزانية", "قرض"], correct: 1 },
        { q: "ما معنى 'Deadline'؟", opts: ["بداية المشروع", "الموعد النهائي", "عقد العمل", "وقت الراحة"], correct: 1 },
        { q: "ما معنى 'Promotion'؟", opts: ["فصل من العمل", "إعلان", "ترقية", "تحويل"], correct: 2 },
      ]
    },
    {
      titleAr: "التعابير الاصطلاحية الشائعة — Idioms",
      questions: [
        { q: "ما معنى 'Break the ice'؟", opts: ["كسر شيء", "بدء التواصل في موقف غير مريح", "خسارة مباراة", "تدمير علاقة"], correct: 1 },
        { q: "ما معنى 'The ball is in your court'؟", opts: ["ابدأ اللعب", "الأمر عليك / قرارك", "الفريق يلعب", "انتهت اللعبة"], correct: 1 },
        { q: "ما معنى 'Under the weather'؟", opts: ["تحت المطر", "الجو سيء", "يشعر بتوعك", "في الخارج"], correct: 2 },
      ]
    },
    {
      titleAr: "مفردات الصحة والطب",
      questions: [
        { q: "ما معنى 'Prescription'؟", opts: ["فاتورة المستشفى", "وصفة طبية", "التشخيص", "التأمين"], correct: 1 },
        { q: "ما معنى 'Side effects'؟", opts: ["فوائد الدواء", "الآثار الجانبية", "جرعة الدواء", "مدة العلاج"], correct: 1 },
        { q: "ما معنى 'Diagnosed with'؟", opts: ["علاج من", "وقاية من", "تشخيص بـ", "تعافٍ من"], correct: 2 },
      ]
    },
    // B2 Listening
    {
      titleAr: "بودكاست علمي",
      questions: [
        { q: "ما معنى 'Ecosystem'؟", opts: ["نظام الكمبيوتر", "النظام البيئي", "النظام الاقتصادي", "النظام الاجتماعي"], correct: 1 },
        { q: "كيف تتواصل الأشجار وفق النص؟", opts: ["بالضوء", "بالرياح", "عبر شبكة فطريات", "بالأصوات"], correct: 2 },
        { q: "ما معنى 'Nutrients'؟", opts: ["سموم", "مغذيات", "مياه", "أكسجين"], correct: 1 },
      ]
    },
    {
      titleAr: "نقاش تلفزيوني",
      questions: [
        { q: "ما معنى 'Flexible'؟", opts: ["صارم", "مرن", "ثابت", "بطيء"], correct: 1 },
        { q: "ما معنى 'Digital divide'؟", opts: ["الشبكة الرقمية", "الفجوة الرقمية", "التعليم الرقمي", "الفصل الرقمي"], correct: 1 },
        { q: "ما معنى 'Crucial'؟", opts: ["بسيط", "اختياري", "بالغ الأهمية", "نادر"], correct: 2 },
      ]
    },
    {
      titleAr: "محاضرة أكاديمية",
      questions: [
        { q: "ما معنى 'Cognitive bias'؟", opts: ["التحيز المعرفي", "الذاكرة القوية", "الذكاء العالي", "الإدراك السليم"], correct: 0 },
        { q: "ما تأثير Dunning-Kruger؟", opts: ["الخبراء يقللون من أنفسهم", "المبتدئون يبالغون في تقدير كفاءتهم", "الجميع يفكر بطريقة صحيحة", "لا يوجد تأثير"], correct: 1 },
        { q: "ما معنى 'Overestimate'؟", opts: ["يقلل من التقدير", "يقدر بدقة", "يبالغ في التقدير", "يرفض التقدير"], correct: 2 },
      ]
    },
    // B2 Speaking
    {
      titleAr: "المناقشة المهنية",
      questions: [
        { q: "كيف تقدم اقتراحاً مهنياً؟", opts: ["I want to...", "I'd like to propose...", "You should...", "Do this..."], correct: 1 },
        { q: "ما معنى 'Clarify'؟", opts: ["يُعقّد", "يُخفي", "يُوضح", "يغير"], correct: 2 },
        { q: "كيف تبدأ تلخيص النقاط؟", opts: ["First...", "To summarize...", "However...", "Although..."], correct: 1 },
      ]
    },
    {
      titleAr: "التفاوض والإقناع",
      questions: [
        { q: "ما معنى 'Compromise'؟", opts: ["رفض تام", "موافقة تامة", "حل وسط", "خسارة"], correct: 2 },
        { q: "كيف تُغلق اتفاقاً؟", opts: ["We'll think about it", "I think we have a deal!", "Maybe we can try", "Not sure yet"], correct: 1 },
        { q: "ما معنى 'Negotiate'؟", opts: ["يرفض", "يوافق", "يتفاوض", "يُلغي"], correct: 2 },
      ]
    },
    {
      titleAr: "عرض تقديمي احترافي",
      questions: [
        { q: "كيف تنتقل بين نقاط العرض؟", opts: ["Anyway...", "Moving on to the next point...", "Let me stop here...", "That's enough..."], correct: 1 },
        { q: "ما معنى 'Key takeaways'؟", opts: ["أسئلة المستمعين", "الدروس والخلاصات الرئيسية", "بداية العرض", "المراجع"], correct: 1 },
        { q: "كيف تتعامل مع الأسئلة بعد العرض؟", opts: ["أرفضها", "أتجاهلها", "أقول I'd be happy to answer", "أغادر"], correct: 2 },
      ]
    },
    // C1 Grammar
    {
      titleAr: "الشرط الثالث — الماضي المفترض",
      questions: [
        { q: "ما الصحيح في الشرط الثالث؟", opts: ["If he called", "If he had called", "If he would call", "If he calls"], correct: 1 },
        { q: "ما المعنى: 'If I had studied, I would have passed'؟", opts: ["درست ونجحت", "لم أدرس ولم أنجح", "سأدرس وسأنجح", "أدرس وأنجح"], correct: 1 },
        { q: "ما الجملة الصحيحة في الشرط الثالث؟", opts: ["She wouldn't fail if she tried", "She wouldn't have failed if she'd tried", "She wouldn't failed if she tried harder", "She would failed if she hadn't tried"], correct: 1 },
      ]
    },
    {
      titleAr: "أساليب التوكيد والتقوية",
      questions: [
        { q: "ما الهدف من 'It was John who called'؟", opts: ["التوكيد على أن John هو من اتصل", "التشكيك في أن John اتصل", "سؤال عن John", "نفي اتصال John"], correct: 0 },
        { q: "ما معنى 'Never have I seen'؟", opts: ["رأيت مرة واحدة", "لم أرَ قط (توكيد)", "ربما رأيت", "سأرى قريباً"], correct: 1 },
        { q: "متى نستخدم 'do/does/did' للتوكيد؟", opts: ["في الأسئلة فقط", "في النفي فقط", "في الإثبات لتأكيد الفعل", "مع الماضي فقط"], correct: 2 },
      ]
    },
    {
      titleAr: "أسماء الموصول المتقدمة",
      questions: [
        { q: "ما الفرق بين الجملة المحددة وغير المحددة؟", opts: ["لا فرق", "المحددة ضرورية للمعنى، غير المحددة إضافية", "غير المحددة ضرورية، المحددة إضافية", "المحددة تستخدم فاصلة"], correct: 1 },
        { q: "ما استخدام 'whose'؟", opts: ["للمكان", "للزمان", "للملكية", "للسبب"], correct: 2 },
        { q: "ما معنى 'Whichever option you choose'؟", opts: ["الخيار الذي اخترته", "أياً كان الخيار الذي تختاره", "الخيار الأفضل", "اختر خياراً"], correct: 1 },
      ]
    },
    // C1 Vocabulary
    {
      titleAr: "المفردات الأكاديمية — Academic Word List",
      questions: [
        { q: "ما معنى 'Methodology'؟", opts: ["النتائج", "المنهجية / الأسلوب العلمي", "الفرضية", "البيانات"], correct: 1 },
        { q: "ما معنى 'Refute'؟", opts: ["يؤكد", "يدعم", "يدحض / يرد على", "يتجاهل"], correct: 2 },
        { q: "ما معنى 'Implication'؟", opts: ["سبب", "نتيجة / تداعية", "مقدمة", "افتراض"], correct: 1 },
      ]
    },
    {
      titleAr: "المجازات اللغوية والاستعارات",
      questions: [
        { q: "ما معنى 'Time flies'؟", opts: ["الوقت يتوقف", "الوقت يطير / يمر بسرعة", "الطائرة تتأخر", "الوقت ثمين"], correct: 1 },
        { q: "ما معنى 'Euphemism'؟", opts: ["مبالغة", "استعارة", "تلطيف للتعبير عن شيء غير مريح", "تشبيه"], correct: 2 },
        { q: "ما معنى 'Passed away'؟", opts: ["سافر", "غادر", "توفي (كناية)", "نام"], correct: 2 },
      ]
    },
    {
      titleAr: "الكلمات المتشابهة والمتضادة",
      questions: [
        { q: "ما الفرق بين 'affect' و 'effect'؟", opts: ["نفس المعنى", "affect فعل، effect اسم", "affect اسم، effect فعل", "كلاهما اسمان"], correct: 1 },
        { q: "ما معنى 'Imminent'؟", opts: ["مشهور / بارز", "وشيك / قريب الحدوث", "قديم", "بعيد"], correct: 1 },
        { q: "ما الفرق بين 'complement' و 'compliment'؟", opts: ["نفس المعنى", "complement يكمل، compliment يمدح", "compliment يكمل، complement يمدح", "كلاهما يعنيان يمدح"], correct: 1 },
      ]
    },
    // C1 Listening
    {
      titleAr: "خطاب سياسي",
      questions: [
        { q: "ما معنى 'Unprecedented'؟", opts: ["معتاد ومألوف", "غير مسبوق", "بسيط وعادي", "قديم"], correct: 1 },
        { q: "ما معنى 'Adversity breeds innovation'؟", opts: ["الابتكار يُسبب الشدائد", "الشدائد تُفرز الابتكار", "الابتكار يمنع الشدائد", "الشدائد تمنع الابتكار"], correct: 1 },
        { q: "ما معنى 'Partisan interests'؟", opts: ["مصالح وطنية عليا", "مصالح حزبية / فئوية", "مصالح فردية", "مصالح دولية"], correct: 1 },
      ]
    },
    {
      titleAr: "مقابلة ثقافية",
      questions: [
        { q: "ما معنى 'Provoke thought'؟", opts: ["يمنع التفكير", "يثير التفكير", "يُبسّط التفكير", "يوقف التفكير"], correct: 1 },
        { q: "ما معنى 'Complacent'؟", opts: ["قلق ومتوتر", "راضٍ بالوضع / لا يريد التغيير", "غاضب وثائر", "متحمس للتغيير"], correct: 1 },
        { q: "ما معنى 'Juxtaposition'؟", opts: ["التشابه", "التكامل", "التناقض والمقارنة المتجاورة", "التسلسل"], correct: 2 },
      ]
    },
    {
      titleAr: "نقاش فلسفي",
      questions: [
        { q: "ما معنى 'Autonomous'؟", opts: ["تابع / مرتبط", "مستقل / ذاتي", "مُتحكَّم فيه", "بطيء"], correct: 1 },
        { q: "ما معنى 'Moral agency'؟", opts: ["قوة جسدية", "الفاعلية الأخلاقية / القدرة على الحكم أخلاقياً", "المعرفة التقنية", "السلطة القانونية"], correct: 1 },
        { q: "السؤال الرئيسي في النقاش الفلسفي:", opts: ["هل الذكاء الاصطناعي أسرع؟", "هل الذكاء الاصطناعي يساوي الذكاء البشري؟", "كيف نبرمج الذكاء الاصطناعي؟", "ما تكلفة الذكاء الاصطناعي؟"], correct: 1 },
      ]
    },
    // C1 Speaking
    {
      titleAr: "الخطاب المقنع",
      questions: [
        { q: "ما هو Logos في الإقناع؟", opts: ["استخدام العاطفة", "استخدام المنطق والبيانات", "استخدام المصداقية", "استخدام الصور"], correct: 1 },
        { q: "ما هو Pathos؟", opts: ["المنطق والحجج", "المصداقية الشخصية", "العاطفة والتأثير النفسي", "البيانات والإحصاء"], correct: 2 },
        { q: "ما هو 'Rule of three' في الإقناع؟", opts: ["ثلاثة أمثلة دائماً", "ثلاثة وقائع كافية", "استخدام ثلاث صفات متتالية للتأثير", "ثلاثة متحدثون"], correct: 2 },
      ]
    },
    {
      titleAr: "التحدث عن القضايا الاجتماعية",
      questions: [
        { q: "ما معنى 'Pressing issue'؟", opts: ["قضية قديمة", "قضية ملحّة وعاجلة", "قضية بسيطة", "قضية حُلّت"], correct: 1 },
        { q: "ما معنى 'Biodiversity'؟", opts: ["التنوع السكاني", "التنوع البيولوجي", "التنوع الثقافي", "التنوع الاقتصادي"], correct: 1 },
        { q: "ما معنى 'Multi-faceted approach'؟", opts: ["نهج بسيط", "نهج من جانب واحد", "نهج متعدد الأوجه", "نهج قديم"], correct: 2 },
      ]
    },
    {
      titleAr: "التفاعل في الندوات",
      questions: [
        { q: "كيف تطلب التوضيح في ندوة؟", opts: ["What?", "Could you elaborate on that?", "Say again", "I don't understand"], correct: 1 },
        { q: "ما معنى 'Compelling evidence'؟", opts: ["أدلة ضعيفة", "أدلة مقنعة وقوية", "أدلة قديمة", "أدلة مشكوك فيها"], correct: 1 },
        { q: "كيف تبني على رأي متحدث سابق؟", opts: ["Forget what was said...", "Building on what was said...", "Ignoring the previous point...", "Starting fresh..."], correct: 1 },
      ]
    },
    // C2 Grammar
    {
      titleAr: "التراكيب النحوية المعقدة",
      questions: [
        { q: "ما معنى Nominalization؟", opts: ["تحويل اسم إلى فعل", "تحويل فعل أو صفة إلى اسم", "حذف الفاعل", "ترتيب الجمل"], correct: 1 },
        { q: "ما معنى Ellipsis؟", opts: ["تكرار الكلمات", "الحذف اللغوي", "إضافة معلومات", "التصريف"], correct: 1 },
        { q: "ما الجملة ذات التوازي الصحيح (Parallelism)؟", opts: ["He likes reading, to write, and speech", "He likes reading, writing, and speaking", "He likes read, writing, speech", "He likes to read, writing, speaks"], correct: 1 },
      ]
    },
    {
      titleAr: "الأسلوب والنبرة في الكتابة",
      questions: [
        { q: "ما معنى 'Register' في اللغة؟", opts: ["تسجيل البيانات", "مستوى رسمية اللغة", "نبرة الصوت", "الكتابة اليدوية"], correct: 1 },
        { q: "ما سمة الأسلوب الرسمي؟", opts: ["جمل قصيرة وكلمات بسيطة", "اختصارات وعامية", "مفردات أكاديمية وجمل مركبة", "كلام غير رسمي"], correct: 2 },
        { q: "ما معنى 'Nuance'؟", opts: ["اختلاف كبير وواضح", "فارق دقيق في المعنى", "خطأ لغوي", "تناقض واضح"], correct: 1 },
      ]
    },
    {
      titleAr: "صياغة الحجج المعقدة كتابةً",
      questions: [
        { q: "ما معنى 'Notwithstanding'؟", opts: ["لأن / بسبب", "بالرغم من / رغم", "حتى / إلى أن", "منذ / بما أن"], correct: 1 },
        { q: "ما معنى 'Albeit'؟", opts: ["لذلك / وبالتالي", "إلا أن / ومع ذلك", "وإن كان / رغم أن", "كما أن / علاوة على"], correct: 2 },
        { q: "ما هدف Hedging في الكتابة الأكاديمية؟", opts: ["التأكيد القاطع", "إضافة التحفظ والحذر", "التناقض", "الإطالة"], correct: 1 },
      ]
    },
    // C2 Vocabulary
    {
      titleAr: "الكلمات النادرة والمتطورة",
      questions: [
        { q: "ما معنى 'Ubiquitous'؟", opts: ["نادر / غير موجود", "في كل مكان / منتشر", "قديم / تاريخي", "خاص / فريد"], correct: 1 },
        { q: "ما معنى 'Exacerbate'؟", opts: ["يُحسّن / يُصلح", "يُفاقم / يُزيد سوءاً", "يُقلل / يُخفف", "يمنع / يوقف"], correct: 1 },
        { q: "ما معنى 'Serendipity'؟", opts: ["الفشل المتوقع", "الصدفة السعيدة / اكتشاف جيد بالصدفة", "الخطة المحكمة", "التعلم المتعمد"], correct: 1 },
      ]
    },
    {
      titleAr: "اللغة الأدبية والشعرية",
      questions: [
        { q: "ما معنى Personification؟", opts: ["تشبيه الأشخاص بالأشياء", "تشخيص الجماد / إعطاء الأشياء صفات إنسانية", "وصف الطبيعة", "الاستعارة المجردة"], correct: 1 },
        { q: "ما معنى Oxymoron؟", opts: ["تكرار صوت", "مبالغة", "طباق / تناقض بلاغي", "استعارة"], correct: 2 },
        { q: "مثال على Hyperbole:", opts: ["The wind sang", "Peter Piper picked", "I've told you a million times", "Bittersweet memories"], correct: 2 },
      ]
    },
    {
      titleAr: "الفروق الدقيقة في المعنى",
      questions: [
        { q: "ما الفرق بين 'look' و 'gaze'؟", opts: ["نفس المعنى", "look عام، gaze تحديق بإعجاب أو إمعان", "gaze قصير، look طويل", "look للأشخاص، gaze للأشياء"], correct: 1 },
        { q: "ما معنى 'Hasty decision'؟", opts: ["قرار متأنٍّ", "قرار صائب", "قرار متسرع", "قرار مبدئي"], correct: 2 },
        { q: "ما الفرق بين 'say' و 'claim'؟", opts: ["نفس المعنى", "say محايد، claim يحتمل الشك", "claim رسمي، say غير رسمي", "say للكتابة، claim للحديث"], correct: 1 },
      ]
    },
    // C2 Listening
    {
      titleAr: "خطاب نوبل",
      questions: [
        { q: "ما معنى 'Dignity'؟", opts: ["قوة", "ثروة", "كرامة", "شهرة"], correct: 2 },
        { q: "ما معنى 'Extraordinary determination'؟", opts: ["إرادة عادية", "إصرار استثنائي", "ذكاء نادر", "تعليم عالٍ"], correct: 1 },
        { q: "لمن أهدى المتحدث الجائزة؟", opts: ["لعائلته", "لفريق عمله", "لكل طفل قيل له إن صوته لا يهم", "لحكومته"], correct: 2 },
      ]
    },
    {
      titleAr: "مقابلة مع كاتب",
      questions: [
        { q: "ما معنى 'Illuminate' حسب الروائي؟", opts: ["يُسلي / يرفّه", "يُضيء / يكشف الحقيقة", "يُربك القارئ", "يُرضي الجمهور"], correct: 1 },
        { q: "ما موقف الروائي من الحياد في الكتابة؟", opts: ["اللغة محايدة دائماً", "الحياد مثالي", "اللغة ليست محايدة أبداً", "الحياد ممكن أحياناً"], correct: 2 },
        { q: "ما معنى 'Inescapably so'؟", opts: ["ربما هذا صحيح", "بشكل لا مفر منه / بالضرورة", "هذا غير صحيح", "أحياناً ما يكون"], correct: 1 },
      ]
    },
    {
      titleAr: "نقاش فلسفي متقدم",
      questions: [
        { q: "ما مقولة سارتر المذكورة؟", opts: ["نحن محكوم علينا بالتعاسة", "نحن محكوم علينا بالحرية", "نحن أحرار بالكامل", "الحرية وهم"], correct: 1 },
        { q: "ما رأي الحتمي (Determinist)؟", opts: ["نحن أحرار تماماً", "أفعالنا نتيجة حتمية لأسباب سابقة", "الحرية تعني غياب الرغبة", "الإرادة تتغلب على الظروف"], correct: 1 },
        { q: "ما معنى 'Paradox'؟", opts: ["مبدأ واضح", "مفارقة / تناقض", "قانون علمي", "نظرية ثابتة"], correct: 1 },
      ]
    },
    // C2 Speaking
    {
      titleAr: "الخطاب الأدبي",
      questions: [
        { q: "ما معنى 'Deceptive simplicity'؟", opts: ["بساطة حقيقية", "بساطة ظاهرة تخفي عمقاً", "تعقيد مقصود", "غموض متعمد"], correct: 1 },
        { q: "ما معنى 'Subvert expectations'؟", opts: ["يُحقق التوقعات", "يتجاهل التوقعات", "يقلب ويُخالف التوقعات", "يُؤكد التوقعات"], correct: 2 },
        { q: "ما معنى 'Emblematic of'؟", opts: ["مختلف عن", "رمزي لـ / ممثل لـ", "عكس", "غير مرتبط بـ"], correct: 1 },
      ]
    },
    {
      titleAr: "النقاش الأكاديمي المتقدم",
      questions: [
        { q: "كيف تتحدى افتراضاً في نقاش أكاديمي؟", opts: ["You're wrong!", "I'd like to challenge that assumption.", "That's not true.", "I disagree completely."], correct: 1 },
        { q: "ما معنى 'Scrutiny'؟", opts: ["قبول سريع", "تدقيق وفحص دقيق", "تجاهل", "موافقة كاملة"], correct: 1 },
        { q: "ما معنى 'Conclusive evidence'؟", opts: ["أدلة جزئية", "أدلة حاسمة وقاطعة", "أدلة قابلة للجدل", "أدلة قديمة"], correct: 1 },
      ]
    },
    {
      titleAr: "التعبير الإبداعي الشفهي",
      questions: [
        { q: "ما معنى 'In retrospect'؟", opts: ["في المستقبل", "في نظرة للوراء / بعد مرور الوقت", "في الحاضر", "في الخيال"], correct: 1 },
        { q: "ما معنى 'Show, don't tell'؟", opts: ["أظهر الصور لا الكلمات", "اعرض بالأفعال والتفاصيل بدل التقرير المباشر", "أخبر القارئ بكل شيء", "استخدم الإحصاء"], correct: 1 },
        { q: "ما معنى 'Liberating'؟", opts: ["مُثقِل / صعب", "محرر / مُعتِق", "مخيف / مرعب", "ممل / مُكِل"], correct: 1 },
      ]
    },
  ];

  let qCount = 0;
  for (const lessonQuiz of quizData) {
    const lesson = dbLessons.find(l => l.titleAr === lessonQuiz.titleAr);
    if (!lesson) continue;
    for (const q of lessonQuiz.questions) {
      await db.insert(quizQuestionsTable).values({
        lessonId: lesson.id,
        questionAr: q.q,
        optionsJson: JSON.stringify(q.opts),
        correctIndex: q.correct,
      });
      qCount++;
    }
  }
  console.log(`✅ ${qCount} سؤال اختبار`);

  // ───── PLACEMENT TEST QUESTIONS ─────
  const placementQuestions = [
    // A1 — 5 questions
    { q: "ما الصيغة الصحيحة؟", opts: ["She am happy", "She is happy", "She be happy", "She are happy"], correct: 1, level: "A1" },
    { q: "ما معنى 'My name is Ahmed'؟", opts: ["عمره أحمد", "اسمه أحمد", "هو من أحمد", "أحمد موجود"], correct: 1, level: "A1" },
    { q: "ما جمع 'book'؟", opts: ["Bookes", "Bookies", "Books", "Bokes"], correct: 2, level: "A1" },
    { q: "ما معنى 'Where are you from'؟", opts: ["أين أنت ذاهب؟", "من أين أنت؟", "كيف حالك؟", "ما اسمك؟"], correct: 1, level: "A1" },
    { q: "ما الصحيح لطلب شيء بلباقة؟", opts: ["Give me water", "Water!", "I would like water, please", "Water give"], correct: 2, level: "A1" },
    // A2 — 5 questions
    { q: "ما ماضي 'go'؟", opts: ["Goed", "Going", "Went", "Gone"], correct: 2, level: "A2" },
    { q: "أكمل: 'If it rains, I _____ stay home.'", opts: ["would", "will", "might have", "had"], correct: 1, level: "A2" },
    { q: "ما الصحيح؟", opts: ["She didn't went", "She didn't go", "She don't go", "She not go"], correct: 1, level: "A2" },
    { q: "ما معنى 'I am going to travel next week'؟", opts: ["أنا أسافر الآن", "سأسافر الأسبوع القادم (خطة)", "أنا أحب السفر", "سافرت الأسبوع الماضي"], correct: 1, level: "A2" },
    { q: "ما معنى 'What's the weather like'؟", opts: ["ما رأيك في الطقس؟", "كيف الطقس؟", "هل تحب الطقس؟", "أين الطقس؟"], correct: 1, level: "A2" },
    // B1 — 5 questions
    { q: "ما الصحيح في المضارع التام؟", opts: ["Have you ever went?", "Have you ever been?", "Did you ever been?", "You ever have been?"], correct: 1, level: "B1" },
    { q: "حوّل: 'They built this bridge.' إلى مبني للمجهول:", opts: ["This bridge built", "This bridge was built", "This bridge is build", "Built this bridge"], correct: 1, level: "B1" },
    { q: "ما معنى 'I've been working here since 2020'؟", opts: ["عملت هنا في 2020 وانتهيت", "أعمل هنا منذ 2020 (ولا زلت)", "سأعمل هنا في 2020", "عملت مرة واحدة في 2020"], correct: 1, level: "B1" },
    { q: "ما الصحيح في جملة الشرط الأول؟", opts: ["If it will rain, I'll stay", "If it rained, I'll stay", "If it rains, I'll stay", "If it rain, I stay"], correct: 2, level: "B1" },
    { q: "ما معنى 'In my opinion, education is key'؟", opts: ["أسأل عن التعليم", "في رأيي، التعليم هو المفتاح", "التعليم ليس مهماً", "لا أعرف عن التعليم"], correct: 1, level: "B1" },
    // B2 — 5 questions
    { q: "ما الصحيح في الشرط الثاني؟", opts: ["If I am rich", "If I were rich, I would travel", "If I will be rich", "If I would be rich"], correct: 1, level: "B2" },
    { q: "حوّل: 'I am tired' إلى كلام منقول:", opts: ["He said he is tired", "He said he was tired", "He said I was tired", "He told I am tired"], correct: 1, level: "B2" },
    { q: "ما معنى 'You should have arrived earlier'؟", opts: ["يجب أن تصل مبكراً", "كان ينبغي أن تكون قد وصلت مبكراً", "ستصل مبكراً", "ربما وصلت مبكراً"], correct: 1, level: "B2" },
    { q: "ما معنى 'Break the ice'؟", opts: ["كسر شيء من الجليد", "بدء التواصل في موقف متوتر", "الجليد انكسر", "الفوز بمباراة"], correct: 1, level: "B2" },
    { q: "ما معنى 'The merger was announced'؟", opts: ["أُعلن عن الاندماج", "تم إلغاء الاندماج", "الاندماج محتمل", "الاندماج رُفض"], correct: 0, level: "B2" },
    // C1 — 5 questions
    { q: "ما الصحيح في الشرط الثالث؟", opts: ["If he called, I would have come", "If he had called, I would have come", "If he would call, I came", "If he has called, I come"], correct: 1, level: "C1" },
    { q: "ما معنى 'It was the speech that inspired me'؟", opts: ["سأُلقي خطاباً", "كان الخطاب هو ما ألهمني (توكيد)", "الخطاب لم يُلهمني", "أنا ألقيت الخطاب"], correct: 1, level: "C1" },
    { q: "ما معنى 'Methodology'؟", opts: ["النتيجة", "المنهجية العلمية", "الفرضية", "الخلاصة"], correct: 1, level: "C1" },
    { q: "ما الفرق بين 'affect' و 'effect'؟", opts: ["نفس المعنى", "affect فعل (يؤثر)، effect اسم (تأثير)", "effect فعل، affect اسم", "كلاهما أفعال"], correct: 1, level: "C1" },
    { q: "ما معنى 'Unprecedented challenges'؟", opts: ["تحديات معتادة", "تحديات غير مسبوقة", "تحديات صغيرة", "تحديات قديمة"], correct: 1, level: "C1" },
    // C2 — 5 questions
    { q: "ما معنى 'Notwithstanding the difficulties, progress was made'؟", opts: ["بسبب الصعوبات تقدمنا", "على الرغم من الصعوبات تقدمنا", "لم نتقدم بسبب الصعوبات", "الصعوبات أوقفت التقدم"], correct: 1, level: "C2" },
    { q: "ما معنى 'Ubiquitous'؟", opts: ["نادر للغاية", "غير معروف", "في كل مكان / منتشر", "قديم جداً"], correct: 2, level: "C2" },
    { q: "ما معنى Nominalization؟", opts: ["تحويل فعل إلى اسم", "حذف الجملة", "إضافة صفات", "تغيير الزمن"], correct: 0, level: "C2" },
    { q: "ما معنى 'Exacerbate'؟", opts: ["يُحسّن / يُصلح", "يُفاقم / يزيد سوءاً", "يمنع / يوقف", "يُبسّط"], correct: 1, level: "C2" },
    { q: "ما معنى 'Albeit imperfect, the solution worked'؟", opts: ["لأنها مثالية نجحت", "وإن لم تكن مثالية، نجح الحل", "الحل فشل رغم كونه مثالياً", "الحل مثالي تماماً"], correct: 1, level: "C2" },
  ];

  for (let i = 0; i < placementQuestions.length; i++) {
    const pq = placementQuestions[i];
    await db.insert(placementQuestionsTable).values({
      questionAr: pq.q,
      optionsJson: JSON.stringify(pq.opts),
      correctIndex: pq.correct,
      levelCode: pq.level,
      order: i + 1,
    });
  }
  console.log(`✅ ${placementQuestions.length} سؤال تحديد مستوى`);

  console.log("\n🎉 اكتملت عملية بذر البيانات بنجاح!");
}

seed().catch(console.error);
