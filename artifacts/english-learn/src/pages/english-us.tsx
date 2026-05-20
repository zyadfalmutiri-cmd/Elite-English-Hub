import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, ChevronDown, ChevronUp } from "lucide-react";

const VOCAB_DIFFS = [
  { us: "elevator",    uk: "lift",          ar: "مصعد" },
  { us: "apartment",   uk: "flat",          ar: "شقة" },
  { us: "truck",       uk: "lorry",         ar: "شاحنة" },
  { us: "gas/gasoline",uk: "petrol",        ar: "بنزين" },
  { us: "cookie",      uk: "biscuit",       ar: "بسكويت" },
  { us: "candy",       uk: "sweets",        ar: "حلوى" },
  { us: "garbage/trash", uk: "rubbish",     ar: "قمامة" },
  { us: "faucet",      uk: "tap",           ar: "صنبور" },
  { us: "subway",      uk: "underground/tube", ar: "مترو" },
  { us: "diaper",      uk: "nappy",         ar: "حفاض" },
  { us: "sidewalk",    uk: "pavement",      ar: "رصيف" },
  { us: "vacation",    uk: "holiday",       ar: "إجازة" },
  { us: "movie",       uk: "film",          ar: "فيلم" },
  { us: "cell phone",  uk: "mobile",        ar: "هاتف محمول" },
  { us: "eraser",      uk: "rubber",        ar: "ممحاة" },
];

const SPELLING_DIFFS = [
  { us: "color",      uk: "colour" },
  { us: "center",     uk: "centre" },
  { us: "analyze",    uk: "analyse" },
  { us: "traveling",  uk: "travelling" },
  { us: "theater",    uk: "theatre" },
  { us: "honor",      uk: "honour" },
  { us: "favorite",   uk: "favourite" },
  { us: "license",    uk: "licence" },
  { us: "program",    uk: "programme" },
  { us: "organize",   uk: "organise" },
];

const US_FEATURES = [
  { title: "النبر والإيقاع", desc: "الإنجليزية الأمريكية أكثر مدًّا في الحروف، مع ضرب قوي على المقاطع المُنبَّرة" },
  { title: "حرف R", desc: "في الإنجليزية الأمريكية يُنطق R واضحاً في نهاية الكلمة مثل: car, water" },
  { title: "حرف T الأوسط", desc: "غالباً يُنطق مثل D: water→wader, butter→budder" },
  { title: "التفخيم", desc: "بعض أصوات A مختلفة: dance تُقرأ بشكل مختلف عن البريطانية" },
];

function speak(word: string) {
  const u = new SpeechSynthesisUtterance(word);
  u.lang = "en-US";
  speechSynthesis.speak(u);
}

export default function EnglishUS() {
  const [open, setOpen] = useState<string | null>("vocab");

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(open === id ? null : id)}
        className="w-full flex items-center justify-between px-5 py-4 text-right">
        <h2 className="font-bold text-white">{title}</h2>
        {open === id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open === id && <div className="px-5 pb-5">{children}</div>}
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 py-4">
        <div className="text-5xl mb-3">🇺🇸</div>
        <h1 className="text-2xl font-bold text-white">الإنجليزية الأمريكية</h1>
        <p className="text-muted-foreground text-sm">تعلّم المفردات والنطق الأمريكي</p>
      </motion.div>

      <Section id="vocab" title="مفردات أمريكية vs بريطانية">
        <div className="space-y-2">
          <div className="grid grid-cols-3 text-xs text-muted-foreground pb-2 border-b border-border">
            <span>🇺🇸 أمريكي</span>
            <span>🇬🇧 بريطاني</span>
            <span>المعنى</span>
          </div>
          {VOCAB_DIFFS.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="grid grid-cols-3 text-sm py-2 border-b border-border/40 items-center">
              <div className="flex items-center gap-1">
                <span className="text-blue-400 font-medium">{d.us}</span>
                <button onClick={() => speak(d.us)} className="text-muted-foreground hover:text-primary">
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
              <span className="text-muted-foreground text-xs">{d.uk}</span>
              <span className="text-muted-foreground">{d.ar}</span>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="spelling" title="اختلافات الإملاء">
        <div className="space-y-2">
          <div className="grid grid-cols-2 text-xs text-muted-foreground pb-2 border-b border-border">
            <span>🇺🇸 أمريكي</span>
            <span>🇬🇧 بريطاني</span>
          </div>
          {SPELLING_DIFFS.map((d, i) => (
            <div key={i} className="grid grid-cols-2 text-sm py-2 border-b border-border/40">
              <span className="text-blue-400 font-medium">{d.us}</span>
              <span className="text-muted-foreground">{d.uk}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="pronunciation" title="مميزات النطق الأمريكي">
        <div className="space-y-3">
          {US_FEATURES.map((f, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">{f.title}</p>
                <p className="text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="phrases" title="عبارات شائعة أمريكية">
        <div className="space-y-3 text-sm">
          {[
            { phrase: "What's up?", meaning: "شو أخبارك / ما الجديد؟" },
            { phrase: "Awesome!", meaning: "رائع / ممتاز!" },
            { phrase: "I'm good.", meaning: "أنا بخير" },
            { phrase: "For sure!", meaning: "بالتأكيد!" },
            { phrase: "No worries.", meaning: "لا مشكلة / لا بأس" },
            { phrase: "Hang on!", meaning: "انتظر لحظة!" },
            { phrase: "You bet!", meaning: "بالتأكيد / طبعاً" },
            { phrase: "My bad.", meaning: "غلطتي / آسف" },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-border/40">
              <div className="flex-1">
                <p className="text-blue-400 font-medium">{p.phrase}</p>
                <p className="text-muted-foreground">{p.meaning}</p>
              </div>
              <button onClick={() => speak(p.phrase)} className="text-muted-foreground hover:text-primary">
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
