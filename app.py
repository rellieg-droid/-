import streamlit as st
import streamlit.components.v1 as components

# הגדרת תצורת העמוד
st.set_page_config(
    page_title="Español 10 - לימוד ספרדית",
    page_icon="🇪🇸",
    layout="centered"
)

# עיצוב מותאם אישית (CSS)
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Heebo', sans-serif;
        direction: rtl;
    }
    
    .main-header {
        text-align: center;
        color: #4f46e5;
        font-weight: 800;
        margin-bottom: 20px;
    }
    
    .hero-banner {
        position: relative;
        border-radius: 16px;
        overflow: hidden;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .hero-banner img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    
    .hero-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent, rgba(0,0,0,0.8));
        color: white;
        padding: 15px;
        text-align: center;
    }
    
    .word-box {
        background-color: #fef08a;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        display: inline-block;
        margin: 2px;
    }
    
    .story-card {
        background: white;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        line-height: 2.2;
        font-size: 1.25rem;
        direction: ltr;
        text-align: left;
    }
</style>
""", unsafe_allow_html=True)

# כותרת האפליקציה
st.markdown("<h1 class='main-header'>Español 10 🇪🇸</h1>", unsafe_allow_html=True)

# תפריט לשוניות עליון
tab1, tab2, tab3 = st.tabs(["📖 סיפורים", "💡 אוצר מילים", "✍️ תרגול"])

# נתונים ומילון
WORD_DATA = {
    "vive": {"he": "חיה / גר", "explanation": "פועל שפירושו לחיות או לגור במקום מסוים.", "sentence": "María vive en una granja.", "sentence_he": "מריה חיה בחווה."},
    "granja": {"he": "חווה", "explanation": "שטח חקלאי עם גידולים וחיות משק.", "sentence": "La granja es grande.", "sentence_he": "החווה גדולה."},
    "pequeña": {"he": "קטנה", "explanation": "תואר השם המתאר גודל קטן בלשון נקבה.", "sentence": "Una casa pequeña.", "sentence_he": "בית קטן."},
    "mañana": {"he": "בוקר / מחר", "explanation": "שעות הבוקר המוקדמות.", "sentence": "Cada mañana toma café.", "sentence_he": "בכל בוקר היא שותה קפה."},
    "temprano": {"he": "מוקדם", "explanation": "בשעה מוקדמת של היום.", "sentence": "Se levanta temprano.", "sentence_he": "היא קמה מוקדם."},
    "gallinas": {"he": "תרנגולות", "explanation": "עוף משק המטיל ביצים.", "sentence": "Las gallinas comen maíz.", "sentence_he": "התרנגולות אוכלות תירס."},
    "vacas": {"he": "פרות", "explanation": "בהמת משק הגדלה בחווה.", "sentence": "Las vacas dan leche.", "sentence_he": "הפרות נותנות חלב."},
    "huevos": {"he": "ביצים", "explanation": "מזון שמגיע מהתרנגולות.", "sentence": "Recoge los huevos.", "sentence_he": "היא אוספת את הביצים."},
    "plantas": {"he": "צמחים", "explanation": "צמחייה וגידולים בגינה.", "sentence": "Riega las plantas.", "sentence_he": "היא משקה את הצמחים."},
    "árbol": {"he": "עץ", "explanation": "צמח עצי גדול בעל ענפים.", "sentence": "Bajo un árbol.", "sentence_he": "תחת עץ."},
    "campo": {"he": "כפר / שדה", "explanation": "אזור כפרי מחוץ לעיר.", "sentence": "La vida en el campo.", "sentence_he": "החיים בכפר."}
}

STORY_TEXT = "María vive en una granja pequeña. Cada mañana, ella se levanta temprano. Da comida a las gallinas y a las vacas. Después, recoge los huevos y riega las plantas. Por la tarde, María lee un libro bajo un árbol. Le gusta mucho la vida en el campo."

# --- לשונית 1: סיפורים ---
with tab1:
    st.markdown("""
    <div class="hero-banner">
        <img src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80" alt="Granja">
        <div class="hero-overlay">
            <h2>La Granja de María</h2>
            <p>A1 - לימוד בסיסי - החווה של מריה</p>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # כפתור השמעת הסיפור
    if st.button("🔊 השמע סיפור מלא בספרדית"):
        components.html(f"""
            <script>
                var msg = new SpeechSynthesisUtterance("{STORY_TEXT}");
                msg.lang = 'es-ES';
                msg.rate = 0.85;
                window.speechSynthesis.speak(msg);
            </script>
        """, height=0)

    st.subheader("קראי את הסיפור (לחצי על מילה להסבר):")
    
    # הצגת הסיפור בחלוקה למילים
    selected_word = st.selectbox("בחרי מילה מתוך הסיפור כדי לראות תרגום והסבר:", [""] + list(WORD_DATA.keys()))
    
    st.markdown(f"<div class='story-card'>{STORY_TEXT}</div>", unsafe_allow_html=True)
    
    if selected_word:
        info = WORD_DATA[selected_word]
        st.info(f"**מילה:** {selected_word} | **תרגום:** {info['he']}\n\n"
                f"**הסבר:** {info['explanation']}\n\n"
                f"**משפט דוגמה:** {info['sentence']} ({info['sentence_he']})")
        
        if st.button(f"🔊 השמע את המילה '{selected_word}'"):
            components.html(f"""
                <script>
                    var msg = new SpeechSynthesisUtterance("{selected_word}");
                    msg.lang = 'es-ES';
                    window.speechSynthesis.speak(msg);
                </script>
            """, height=0)

# --- לשונית 2: אוצר מילים ---
with tab2:
    st.subheader("💡 מילון ואוצר מילים שנלמד")
    for word, details in WORD_DATA.items():
        with st.expander(f"🇪🇸 {word} - {details['he']}"):
            st.write(f"**הסבר:** {details['explanation']}")
            st.write(f"**משפט דוגמה:** {details['sentence']}")
            st.write(f"**תרגום המשפט:** {details['sentence_he']}")

# --- לשונית 3: תרגול ---
with tab3:
    st.subheader("✍️ תרגול הבנה")
    q1 = st.radio("1. איפה מריה חיה?", ["באירופה", "בחווה קטנה", "בעיר גדולה", "ליד הים"], index=None)
    if q1:
        if q1 == "בחווה קטנה":
            st.success("נכון מאוד! 🎉 (María vive en una granja pequeña)")
        else:

            st.error("לא מדויק, נסי שוב.")

    q2 = st.radio("2. מה מריה עושה בבוקר?", ["קוראת ספר", "נוסעת לעיר", "נותנת אוכל לתרנגולות ולפרות"], index=None)
    if q2:
        if q2 == "נותנת אוכל לתרנגולות ולפרות":
            st.success("מעולה! 👏 (Da comida a las gallinas y a las vacas)")
        else:
            st.error("לא מדויק, נסי שוב.")
