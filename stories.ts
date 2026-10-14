import { Story } from '../types';

export const STORIES: Story[] = [
  {
    id: 'maria-farm',
    title: 'La Granja de María',
    titleHe: 'החווה של מריה',
    author: 'לימוד בסיסי - רמה A1',
    level: 'A1 - מתחילים',
    coverImage: '/src/assets/images/cover_maria_farm_1792007358059.jpg',
    descriptionHe: 'סיפור קליל על שגרת הבוקר של מריה בחווה הכפרית, עם בעלי החיים והצמחים.',
    content: `María vive en una granja pequeña. Cada mañana, ella se levanta temprano. Da comida a las gallinas y a las vacas. Después, recoge los huevos y riega las plantas. Por la tarde, María lee un libro bajo un árbol. Le gusta mucho la vida en el campo.`,
    paragraphs: [
      {
        spanish: "María vive en una granja pequeña. Cada mañana, ella se levanta temprano. Da comida a las gallinas y a las vacas.",
        hebrew: "מריה חיה בחווה קטנה. בכל בוקר, היא קמה מוקדם. היא נותנת אוכל לתרנגולות ולפרות."
      },
      {
        spanish: "Después, recoge los huevos y riega las plantas. Por la tarde, María lee un libro bajo un árbol. Le gusta mucho la vida en el campo.",
        hebrew: "לאחר מכן, היא אוספת את הביצים ומשקה את הצמחים. אחר הצהריים, מריה קוראת ספר תחת עץ. היא אוהבת מאוד את החיים בכפר."
      }
    ],
    quiz: [
      {
        question: "איפה מריה גרה?",
        options: ["בעיר גדולה", "בחווה קטנה", "ליד הים", "במרכז מדריד"],
        answer: 1,
        explanation: "הטקסט פותח במילים: 'María vive en una granja pequeña' (מריה חיה בחווה קטנה)."
      },
      {
        question: "מה מריה עושה דבר ראשון בבוקר?",
        options: ["קוראת ספר", "רוכבת על סוס", "מאכילה את התרנגולות והפרות", "נוסעת לשוק"],
        answer: 2,
        explanation: "בטקסט נאמר: 'Da comida a las gallinas y a las vacas'."
      },
      {
        question: "היכן מריה יושבת לקרוא ספר בשעות אחה\"צ?",
        options: ["בתוך המטבח", "על גג הבית", "תחת עץ", "ליד הנהר"],
        answer: 2,
        explanation: "בטקסט נאמר: 'María lee un libro bajo un árbol' (תחת עץ)."
      }
    ]
  },
  {
    id: 'animal-farm',
    title: 'Animal Farm (Rebelión en la granja)',
    titleHe: 'חוות החיות - ג\'ורג\' אורוול',
    author: 'George Orwell',
    level: 'A2 - בסיסי',
    coverImage: '/src/assets/images/cover_animal_farm_1792007357182.jpg',
    descriptionHe: 'העיבוד הספרדי לרומן האלגורי המפורסם: החיות מתאחדות בלילה למען חירות ושוויון.',
    content: `Una noche, todos los animales de la granja se reunieron en el granero. El viejo cerdo sabio habló con voz fuerte y clara. "Compañeros, tenemos un sueño de libertad y respeto. El trabajo duro debe ser para nosotros, no solo para el hombre egoísta."

Los animales escucharon con gran entusiasmo. El caballo fuerte, las gallinas trabajadoras y las vacas decidieron unirse. Escribieron en la pared blanca siete mandamientos esenciales: "Todos los animales son iguales y hermanos en el campo."`,
    paragraphs: [
      {
        spanish: `Una noche, todos los animales de la granja se reunieron en el granero. El viejo cerdo sabio habló con voz fuerte y clara. "Compañeros, tenemos un sueño de libertad y respeto. El trabajo duro debe ser para nosotros, no solo para el hombre egoísta."`,
        hebrew: `לילה אחד, כל חיות החווה התאספו באסם. החזיר הזקן והחכם דיבר בקול חזק וברור: "חברים, יש לנו חלום של חירות וכבוד. העבודה הקשה צריכה להיות עבורנו, ולא רק עבור האדם האנוכי."`
      },
      {
        spanish: `Los animales escucharon con gran entusiasmo. El caballo fuerte, las gallinas trabajadoras y las vacas decidieron unirse. Escribieron en la pared blanca siete mandamientos esenciales: "Todos los animales son iguales y hermanos en el campo."`,
        hebrew: `החיות הקשיבו בהתלהבות רבה. הסוס החזק, התרנגולות החרוצות והפרות החליטו להתאחד. הם כתבו על הקיר הלבן שבע דיברות עיקריות: "כל בעלי החיים שווים ואחים בשדה."`
      }
    ],
    quiz: [
      {
        question: "איפה התאספו כל חיות החווה בלילה?",
        options: ["באסם (en el granero)", "ביער", "על הגבעה", "בבית האיכר"],
        answer: 0,
        explanation: "המשפט הראשון מציין: 'todos los animales de la granja se reunieron en el granero'."
      },
      {
        question: "מה היה המסר המרכזי של החזיר החכם?",
        options: ["שצריך לעבוד פחות", "חלום של חירות ושוויון בין החיות", "שצריך לקנות טרקטור חדש", "שצריך לברוח לעיר"],
        answer: 1,
        explanation: "החזיר הזקן הכריז: 'tenemos un sueño de libertad y respeto'."
      },
      {
        question: "מה כתבו החיות על הקיר הלבן?",
        options: ["שבע דיברות (siete mandamientos)", "מתכון לאוכל", "שמות כל החיות", "שיר ערש"],
        answer: 0,
        explanation: "בטקסט נכתב: 'Escribieron en la pared blanca siete mandamientos esenciales'."
      }
    ]
  },
  {
    id: 'el-principito',
    title: 'El Principito y el Zorro',
    titleHe: 'הנסיך הקטן והשועל',
    author: 'Antoine de Saint-Exupéry',
    level: 'A2 - בסיסי',
    coverImage: '/src/assets/images/cover_el_principito_1792007357705.jpg',
    descriptionHe: 'המפגש המרגש במדבר בין הנסיך הקטן לשועל על מהות הידידות וראיית הלב.',
    content: `El principito llegó a la Tierra y conoció a un zorro bajo un árbol de manzanas. "Ven a jugar conmigo", pidió el niño, "estoy muy triste". "No puedo jugar contigo", respondió el zorro, "todavía no estoy domesticado".

"¿Qué significa domesticar?", preguntó el principito con curiosidad. "Significa crear lazos afectivos", explicó el zorro con ternura. "Si tú me domesticas, nos necesitaremos el uno al otro. Para mí serás único en el mundo, y para ti yo seré único también."

Antes de despedirse, el zorro le regaló su secreto más valioso: "Solo con el corazón se puede ver bien; lo esencial es invisible a los ojos. El tiempo que perdiste por tu rosa hace que tu rosa sea tan importante."`,
    paragraphs: [
      {
        spanish: `El principito llegó a la Tierra y conoció a un zorro bajo un árbol de manzanas. "Ven a jugar conmigo", pidió el niño, "estoy muy triste". "No puedo jugar contigo", respondió el zorro, "todavía no estoy domesticado".`,
        hebrew: `הנסיך הקטן הגיע לכדור הארץ ופגש שועל תחת עץ תפוחים. "בוא לשחק איתי", ביקש הילד, "אני עצוב מאוד". "אינני יכול לשחק איתך", ענה השועל, "עדיין אינני מאולף".`
      },
      {
        spanish: `"¿Qué significa domesticar?", preguntó el principito con curiosidad. "Significa crear lazos afectivos", explicó el zorro con ternura. "Si tú me domesticas, nos necesitaremos el uno al otro. Para mí serás único en el mundo, y para ti yo seré único también."`,
        hebrew: `"מה פירוש לאלף?", שאל הנסיך הקטן בסקרנות. "פירושו ליצור קשרים של חיבה", הסביר השועל בעדינות. "אם תאלף אותי, נהיה זקוקים זה לזה. עבורי תהיה יחיד בעולם, ועבורך אהיה יחיד ומיוחד גם כן."`
      },
      {
        spanish: `Antes de despedirse, el zorro le regaló su secreto más valioso: "Solo con el corazón se puede ver bien; lo esencial es invisible a los ojos. El tiempo que perdiste por tu rosa hace que tu rosa sea tan importante."`,
        hebrew: `לפני שנפרדו, העניק השועל לנסיך את סודו היקר ביותר: "רק עם הלב אפשר לראות היטב; המהותי סמוי מן העין. הזמן שהקדשת לורד שלך הוא שעושה אותה לכה חשובה."`
      }
    ],
    quiz: [
      {
        question: "מה הסביר השועל לגבי המשמעות של 'domesticar'?",
        options: ["ללמד חיה לשבת", "ליצור קשרים של חיבה (crear lazos)", "לכלוא בכלוב", "לקנות אוכל טעים"],
        answer: 1,
        explanation: "השועל אמר במפורש: 'Significa crear lazos afectivos'."
      },
      {
        question: "מהו הסוד המפורסם שהשועל העניק לנסיך הקטן?",
        options: ["כסף מביא אושר", "רק עם הלב רואים היטב; המהותי סמוי מן העין", "השועל תמיד רעב", "צריך לטוס לכוכב אחר"],
        answer: 1,
        explanation: "'Solo con el corazón se puede ver bien; lo esencial es invisible a los ojos'."
      },
      {
        question: "מה גורם לורד של הנסיך הקטן להיות כה מיוחדת?",
        options: ["הצבע האדום שלה", "הגודל שלה", "הזמן והמסירות שהנסיך הקדיש לה", "המחיר ששילם עליה"],
        answer: 2,
        explanation: "'El tiempo que perdiste por tu rosa hace que tu rosa sea tan importante'."
      }
    ]
  },
  {
    id: 'don-quijote',
    title: 'Don Quijote y los Molinos',
    titleHe: 'דון קיחוטה וטחנות הרוח',
    author: 'Miguel de Cervantes',
    level: 'B1 - בינוני',
    coverImage: '/src/assets/images/cover_don_quijote_1792007357483.jpg',
    descriptionHe: 'הפרק האיקוני ביותר בספרות הספרדית: דון קיחוטה וסנצ\'ו פנזה בשדות לה מנצ\'ה.',
    content: `En un día soleado en los campos de La Mancha, el hidalgo Don Quijote y su fiel escudero Sancho Panza cabalgaban tranquilamente. De repente, Don Quijote se detuvo y señaló el horizonte con su lanza:

"Mira allí, amigo Sancho. Treinta o más enormes gigantes con brazos larguísimos se levantan ante nosotros. Voy a entrar en feroz batalla contra ellos para ganar gloria y honor."

Sancho Panza abrió los ojos con asombro y respondió: "Mire bien, señor Don Quijote, que aquellos que allí se parecen no son gigantes, sino molinos de viento. Lo que parecen brazos son las aspas que mueven la piedra con el viento."

Sin embargo, Don Quijote espoleó a su caballo Rocinante y gritó: "¡No huyáis, cobardes criaturas!" Así comenzó una de las leyendas más famosas de la literatura mundial.`,
    paragraphs: [
      {
        spanish: `En un día soleado en los campos de La Mancha, el hidalgo Don Quijote y su fiel escudero Sancho Panza cabalgaban tranquilamente. De repente, Don Quijote se detuvo y señaló el horizonte con su lanza:`,
        hebrew: `ביום שמש בהיר בשדות לה מנצ'ה, האציל דון קיחוטה ונושא כליו הנאמן סנצ'ו פנזה רכבו בנחת. לפתע, דון קיחוטה עצר והצביע אל האופק ברומחו:`
      },
      {
        spanish: `"Mira allí, amigo Sancho. Treinta o más enormes gigantes con brazos larguísimos se levantan ante nosotros. Voy a entrar en feroz batalla contra ellos para ganar gloria y honor."`,
        hebrew: `"הבט לשם, ידידי סנצ'ו. שלושים או יותר ענקים אדירים בעלי זרועות ארוכות מתנשאים לפנינו. אני עומד לצאת לקרב עז נגדם כדי לזכות בתהילה ובכבוד."`
      },
      {
        spanish: `Sancho Panza abrió los ojos con asombro y respondió: "Mire bien, señor Don Quijote, que aquellos que allí se parecen no son gigantes, sino molinos de viento. Lo que parecen brazos son las aspas que mueven la piedra con el viento."`,
        hebrew: `סנצ'ו פנזה פער את עיניו בתדהמה והשיב: "הבט היטב, אדוני דון קיחוטה, אלה שנראים שם אינם ענקים, אלא טחנות רוח. מה שנראה כזרועות הן כנפי הטחנה המניעות את אבן הריחיים עם הרוח."`
      },
      {
        spanish: `Sin embargo, Don Quijote espoleó a su caballo Rocinante y gritó: "¡No huyáis, cobardes criaturas!" Así comenzó una de las leyendas más famosas de la literatura mundial.`,
        hebrew: `אף על פי כן, דון קיחוטה זירז את סוסו רוסיננטה וצעק: "אל תברחו, יצורים פחדנים!" כך החלה אחת האגדות המפורסמות ביותר בספרות העולמית.`
      }
    ],
    quiz: [
      {
        question: "מה דון קיחוטה חשב שהוא רואה באופק?",
        options: ["ענקים עם זרועות ארוכות", "טירה מלכותית", "צבא אויב", "נהר רחב"],
        answer: 0,
        explanation: "דון קיחוטה אמר לסנצ'ו: 'Treinta o más enormes gigantes con brazos larguísimos'."
      },
      {
        question: "מה היו למעשה ה'ענקים' לפי סנצ'ו פנזה?",
        options: ["עצי צפצפה גבוהים", "טחנות רוח (molinos de viento)", "אנשים רכובים על חמורים", "עמודי אבן"],
        answer: 1,
        explanation: "סנצ'ו הסביר: 'no son gigantes, sino molinos de viento'."
      },
      {
        question: "איך קוראים לסוסו של דון קיחוטה בסיפור?",
        options: ["פגסוס", "בוצפלוס", "רוסיננטה (Rocinante)", "אל דוראדו"],
        answer: 2,
        explanation: "הטקסט מציין: 'Don Quijote espoleó a su caballo Rocinante'."
      }
    ]
  }
];
