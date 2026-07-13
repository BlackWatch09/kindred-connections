import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Facebook, Instagram, MapPin, Clock, BookOpen, Languages } from "lucide-react";

const teachers = [
  {
    name: "Ahmed Al-Mansouri",
    age: 34,
    country: "Cairo, Egypt",
    major: "Modern Standard Arabic & Grammar",
    experience: 8,
    languages: ["Arabic", "English", "Turkish"],
    bio: "Passionate about making Arabic grammar accessible and fun. Specializes in breaking down complex rules into simple, digestible lessons for beginners and intermediate learners.",
    availability: "Weekdays evenings, Weekends",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    email: "ahmed.mansouri@gmail.com",
    facebook: "https://facebook.com/ahmed.mansouri",
    instagram: "https://instagram.com/ahmed.mansouri",
  },
  {
    name: "Fatima Al-Zahra",
    age: 29,
    country: "Amman, Jordan",
    major: "Conversational Arabic & Dialects",
    experience: 5,
    languages: ["Arabic", "English"],
    bio: "Focuses on practical conversation skills and helping students navigate different Arabic dialects. Believes in learning through real-world scenarios and daily practice.",
    availability: "Weekends, Monday & Wednesday evenings",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&crop=face",
    email: "fatima.zahra@gmail.com",
    facebook: "https://facebook.com/fatima.zahra",
    instagram: "https://instagram.com/fatima.zahra",
  },
  {
    name: "Omar Yılmaz",
    age: 41,
    country: "Istanbul, Turkey",
    major: "Tajweed & Quranic Arabic",
    experience: 15,
    languages: ["Arabic", "Turkish", "English"],
    bio: "Expert in Tajweed rules and Quranic recitation. Has taught hundreds of students across Turkey and the Middle East. Patient and methodical teaching approach.",
    availability: "Daily mornings, Weekend afternoons",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    email: "omar.yilmaz@gmail.com",
    facebook: "https://facebook.com/omar.yilmaz",
    instagram: "https://instagram.com/omar.yilmaz",
  },
  {
    name: "Layla Hassan",
    age: 26,
    country: "Beirut, Lebanon",
    major: "Arabic for Business & Media",
    experience: 4,
    languages: ["Arabic", "English", "French"],
    bio: "Specializes in formal Arabic used in business, journalism, and media. Helps professionals and students develop strong reading and writing skills for academic purposes.",
    availability: "Weekday afternoons, Saturday mornings",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    email: "layla.hassan@gmail.com",
    facebook: "https://facebook.com/layla.hassan",
    instagram: "https://instagram.com/layla.hassan",
  },
  {
    name: "Khaled Demir",
    age: 37,
    country: "Ankara, Turkey",
    major: "Arabic Calligraphy & Writing",
    experience: 10,
    languages: ["Arabic", "Turkish"],
    bio: "Combines the art of Arabic calligraphy with language teaching. His unique approach helps students master the Arabic script while appreciating its artistic beauty.",
    availability: "Tuesday, Thursday & Saturday",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    email: "khaled.demir@gmail.com",
    facebook: "https://facebook.com/khaled.demir",
    instagram: "https://instagram.com/khaled.demir",
  },
  {
    name: "Nour Al-Din",
    age: 32,
    country: "Damascus, Syria",
    major: "Arabic Literature & Poetry",
    experience: 7,
    languages: ["Arabic", "English", "Turkish"],
    bio: "Brings Arabic literature and poetry to life for advanced learners. Passionate about connecting students with the rich heritage of Arabic storytelling and expression.",
    availability: "Flexible schedule, contact to arrange",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face",
    email: "nour.aldin@gmail.com",
    facebook: "https://facebook.com/nour.aldin",
    instagram: "https://instagram.com/nour.aldin",
  },
  {
    name: "Yasmin Kaya",
    age: 28,
    country: "Izmir, Turkey",
    major: "Arabic for Kids & Young Learners",
    experience: 6,
    languages: ["Arabic", "Turkish", "English"],
    bio: "Creates engaging, playful lessons tailored for children and teens. Uses games, songs, and interactive activities to make Arabic learning exciting for young minds.",
    availability: "Weekday afternoons, Full weekends",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=face",
    email: "yasmin.kaya@gmail.com",
    facebook: "https://facebook.com/yasmin.kaya",
    instagram: "https://instagram.com/yasmin.kaya",
  },
  {
    name: "Tariq Ben Ali",
    age: 45,
    country: "Tunis, Tunisia",
    major: "Arabic Grammar & Morphology",
    experience: 20,
    languages: ["Arabic", "French", "English"],
    bio: "A veteran Arabic linguist with two decades of teaching experience. Known for his deep knowledge of Sarf and Nahw, making complex grammar concepts clear and logical.",
    availability: "Mornings daily, Wednesday & Friday full day",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face",
    email: "tariq.benali@gmail.com",
    facebook: "https://facebook.com/tariq.benali",
    instagram: "https://instagram.com/tariq.benali",
  },
];

const Teachers = () => {
  const { t } = useLanguage();

  return (
    <div className="relative z-10">
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-3xl" style={{ animation: "fade-in-up 0.8s ease-out" }}>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("teachers.title")}
          </h1>
          <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
            {t("teachers.subtitle")}
          </p>
          <p className="text-accent font-semibold text-base">
            {t("teachers.cta")}
          </p>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher, i) => (
              <div
                key={teacher.name}
                className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animation: `fade-in-up 0.5s ease-out ${i * 0.08}s both` }}
              >
                {/* Photo */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="font-display text-xl font-bold text-foreground">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {teacher.country} · {teacher.age} yrs
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">{teacher.major}</span>
                      <p className="text-xs text-muted-foreground">{teacher.experience} {t("teachers.yearsExp")}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Languages className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{teacher.languages.join(" · ")}</p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{teacher.bio}</p>

                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{teacher.availability}</p>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <a
                      href={`mailto:${teacher.email}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold gradient-gold text-accent-foreground hover:opacity-90 transition-opacity"
                    >
                      <Mail className="w-3.5 h-3.5" /> {t("teachers.email")}
                    </a>
                    <a
                      href={teacher.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-secondary transition-colors"
                    >
                      <Facebook className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={teacher.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium border border-border text-foreground hover:bg-secondary transition-colors"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Teachers;
