import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { WORLDS } from "../data/worlds";
import { BookHeart, Users2 } from "lucide-react";

const levelLabel: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

const WorldSelectionScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 min-h-screen py-16 px-4" dir="rtl">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <BookHeart className="w-4 h-4" />
            تجربة حية
          </div>
          <h1 className="font-arabic text-4xl md:text-5xl font-bold text-foreground mb-3">
            عالم السرد الحي
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            ادخل إلى عوالم أردنية أصيلة، وتحدث مع شخصيات حقيقية. كل حوار فريد ولا يتكرر.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {WORLDS.map((world, i) => (
            <motion.button
              key={world.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => navigate(`/story/${world.id}`)}
              className="group relative overflow-hidden rounded-3xl text-right cursor-pointer border border-border shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="relative aspect-[4/5] w-full">
                <img
                  src={world.worldImage}
                  alt={world.nameAr}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${world.accentColor} mix-blend-multiply opacity-70`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur text-white text-xs font-semibold border border-white/20">
                    {levelLabel[world.level]}
                  </span>
                </div>

                <div className="absolute bottom-0 right-0 left-0 p-6 text-white">
                  <div className="flex items-end gap-3 mb-3">
                    <img
                      src={world.characterImage}
                      alt={world.characterName}
                      loading="lazy"
                      className="w-14 h-14 rounded-full object-cover border-2 border-white/70 shadow-lg"
                    />
                    <div>
                      <p className="text-xs text-white/70">مع</p>
                      <p className="font-arabic font-bold text-lg">{world.characterName}</p>
                    </div>
                  </div>
                  <h3 className="font-arabic text-2xl font-bold mb-1">{world.nameAr}</h3>
                  <p className="text-sm text-white/85 mb-3 line-clamp-2">{world.tagline}</p>
                  <div className="flex items-center gap-4 text-xs text-white/80">
                    <span className="flex items-center gap-1">
                      <Users2 className="w-3.5 h-3.5" /> {world.targetVocab} كلمة مستهدفة
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorldSelectionScreen;
