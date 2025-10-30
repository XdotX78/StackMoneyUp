import type { Language } from '@/types/blog';

interface NavigationTranslations {
  home: string;
  blog: string;
  about: string;
  invest: string;
  contact: string;
}

interface HeroTranslations {
  title: string;
  subtitle: string;
  cta: string;
}

interface NavigatingSection {
  tagline: string;
  title: string;
  budgeting: string;
  retirement: string;
  cta: string;
}

interface MasteringSection {
  tagline: string;
  title: string;
  cardTitle: string;
  cardText: string;
  rightTitle: string;
  rightText: string;
  cta: string;
}

interface AchieveSection {
  title: string;
  text: string;
  cta: string;
}

interface WealthCard {
  image: string;
  title: string;
  text: string;
}

interface GrowWealthSection {
  tagline: string;
  title: string;
  subtitle: string;
  cta: string;
  cards: WealthCard[];
}

interface BlogTranslations {
  title: string;
  readMore: string;
}

interface BlogPostPreview {
  date: string;
  category: string;
  title: string;
  excerpt: string;
}

interface AboutTranslations {
  title: string;
  text1: string;
  text2: string;
}

interface FooterTranslations {
  copyright: string;
  quickLinks: string;
  exploreMore: string;
  connectWithUs: string;
  home: string;
  about: string;
  invest: string;
  blog: string;
  contact: string;
  privacy: string;
  terms: string;
  sitemap: string;
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
}

interface LanguageTranslations {
  nav: NavigationTranslations;
  hero: HeroTranslations;
  navigating: NavigatingSection;
  mastering: MasteringSection;
  achieve: AchieveSection;
  growWealth: GrowWealthSection;
  blog: BlogTranslations;
  posts: BlogPostPreview[];
  about: AboutTranslations;
  footer: FooterTranslations;
}

export const translations: Record<Language, LanguageTranslations> = {
  en: {
    nav: {
      home: "Home",
      blog: "Blog",
      about: "About",
      invest: "Invest",
      contact: "Contact"
    },
    hero: {
      title: "Discover Your",
      subtitle: "Welcome to StackMoneyUp, your guide to personal finance, investing, and useful information. Explore our blog to learn how to manage your money, grow your wealth, and achieve financial stability",
      cta: "Learn More"
    },
    navigating: {
      tagline: "Investing for the Future",
      title: "Navigating the World of Personal Finance",
      budgeting: "Budgeting Made Easy: Discover practical tips and tools to help you take control of your spending, reduce debt, and reach your savings targets. Learn how to create a budget that works for your unique financial situation and lifestyle",
      retirement: "Retirement Planning: Get expert insights on planning for a secure and fulfilling retirement. Explore investment options, tax-saving strategies",
      cta: "Explore Now"
    },
    mastering: {
      tagline: "Your Financial Future",
      title: "Mastering Personal Finance",
      cardTitle: "Financial Insights",
      cardText: "Unleash Your Financial Potential: Our comprehensive blog covers a wide range of personal finance topics, from budgeting and saving to investing and retirement planning. Discover practical strategies and expert insights to help you achieve your financial goals and secure your future",
      rightTitle: "Navigating the Complexities",
      rightText: "Investing can be a powerful tool for building wealth, but it also carries risks. At StackMoneyUp, we're here to guide you through the complexities of the investment landscape. Our blog offers in-depth analyses, market insights",
      cta: "Invest Wisely"
    },
    achieve: {
      title: "Achieve Financial",
      text: "Take control of your financial future with the help of StackMoneyUp. Our blog is filled with practical tips, expert advice, and real-life stories to inspire you on your journey towards financial independence",
      cta: "Get Started"
    },
    growWealth: {
      tagline: "Stay Informed",
      title: "Grow Your Wealth",
      subtitle: "Invest in Your Future: Explore the latest investment trends, market insights",
      cta: "Invest Now",
      cards: [
        {
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          title: "Explore the",
          text: "Discover the Path to Financial Freedom: Our blog offers practical guidance and inspiring stories to help you take control of"
        },
        {
          image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
          title: "Unlock Your",
          text: "Achieve Financial Stability: Learn how to manage your money, reduce debt, and build wealth for a secure future"
        },
        {
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
          title: "Embrace the Future",
          text: "Secure Your Financial Future: Explore the latest trends, strategies, and insights to help you make informed decisions and"
        }
      ]
    },    blog: {
      title: "Financial Wisdom",
      readMore: "Read More →"
    },
    posts: [
      {
        date: "Dec 2024",
        category: "Investing",
        title: "The Compound Effect of Consistent Investing",
        excerpt: "Why investing $100 monthly beats trying to time the market with $10,000 once."
      },
      {
        date: "Dec 2024",
        category: "Budgeting",
        title: "The 50/30/20 Rule Isn't Perfect",
        excerpt: "Why the popular budgeting rule fails for most people and what to do instead."
      },
      {
        date: "Nov 2024",
        category: "Mindset",
        title: "Stop Chasing Quick Wins",
        excerpt: "The psychology behind get-rich-quick schemes and why they fail."
      },
      {
        date: "Nov 2024",
        category: "Debt",
        title: "Debt Snowball vs. Debt Avalanche",
        excerpt: "The psychological vs. mathematical approach to debt payoff."
      },
      {
        date: "Oct 2024",
        category: "Emergency Fund",
        title: "Why 6 Months Isn't Enough",
        excerpt: "The case for building a larger emergency fund in uncertain times."
      },
      {
        date: "Oct 2024",
        category: "Income",
        title: "Side Hustles That Actually Scale",
        excerpt: "Beyond Uber and DoorDash. Real side businesses that can grow."
      }
    ],
    about: {
      title: "About StackMoneyUp",
      text1: "This isn't another personal finance blog promising to make you rich overnight.",
      text2: "No affiliate links. No sponsored content. Just honest advice about money."
    },
    footer: {
      copyright: "© 2025 StackMoneyUp, Inc. All rights reserved.",
      quickLinks: "Quick Links",
      exploreMore: "Explore More",
      connectWithUs: "Connect With Us",
      home: "Home",
      about: "About",
      invest: "Invest",
      blog: "Blog",
      contact: "Contact",
      privacy: "Privacy",
      terms: "Terms",
      sitemap: "Sitemap",
      twitter: "Twitter",
      facebook: "Facebook",
      instagram: "Instagram",
      linkedin: "LinkedIn"
    }
  },
  it: {
    nav: {
      home: "Home",
      blog: "Blog",
      about: "Chi Siamo",
      invest: "Investire",
      contact: "Contatti"
    },
    hero: {
      title: "Scopri il Tuo",
      subtitle: "Benvenuto su StackMoneyUp, la tua guida alle finanze personali, agli investimenti e alle informazioni utili. Esplora il nostro blog per imparare a gestire i tuoi soldi, far crescere la tua ricchezza e raggiungere la stabilità finanziaria",
      cta: "Scopri di Più"
    },
    navigating: {
      tagline: "Investire per il Futuro",
      title: "Navigare nel Mondo delle Finanze Personali",
      budgeting: "Budget Facilitato: Scopri consigli pratici e strumenti per aiutarti a prendere il controllo delle tue spese, ridurre i debiti e raggiungere i tuoi obiettivi di risparmio. Impara a creare un budget che funzioni per la tua situazione finanziaria e stile di vita unici",
      retirement: "Pianificazione Pensionistica: Ottieni approfondimenti esperti sulla pianificazione per una pensione sicura e soddisfacente. Esplora opzioni di investimento, strategie di risparmio fiscale",
      cta: "Esplora Ora"
    },
    mastering: {
      tagline: "Il Tuo Futuro Finanziario",
      title: "Padroneggiare le Finanze Personali",
      cardTitle: "Approfondimenti Finanziari",
      cardText: "Libera il Tuo Potenziale Finanziario: Il nostro blog completo copre un'ampia gamma di argomenti di finanza personale, dal budget e risparmio agli investimenti e pianificazione pensionistica. Scopri strategie pratiche e approfondimenti esperti per aiutarti a raggiungere i tuoi obiettivi finanziari e proteggere il tuo futuro",
      rightTitle: "Navigare le Complessità",
      rightText: "Investire può essere uno strumento potente per costruire ricchezza, ma comporta anche rischi. Su StackMoneyUp, siamo qui per guidarti attraverso le complessità del panorama degli investimenti. Il nostro blog offre analisi approfondite, approfondimenti di mercato",
      cta: "Investi Saggiamente"
    },
    achieve: {
      title: "Raggiungi la Libertà Finanziaria",
      text: "Prendi il controllo del tuo futuro finanziario con l'aiuto di StackMoneyUp. Il nostro blog è pieno di consigli pratici, consulenza esperta e storie di vita reale per ispirarti nel tuo viaggio verso l'indipendenza finanziaria",
      cta: "Inizia Ora"
    },
    growWealth: {
      tagline: "Rimani Informato",
      title: "Fai Crescere la Tua Ricchezza",
      subtitle: "Investi nel Tuo Futuro: Esplora le ultime tendenze di investimento, approfondimenti di mercato",
      cta: "Investi Ora",
      cards: [
        {
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          title: "Esplora il",
          text: "Scopri il Percorso verso la Libertà Finanziaria: Il nostro blog offre guida pratica e storie ispiratrici per aiutarti a prendere il controllo"
        },
        {
          image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
          title: "Sblocca il Tuo",
          text: "Raggiungi la Stabilità Finanziaria: Impara a gestire i tuoi soldi, ridurre i debiti e costruire ricchezza per un futuro sicuro"
        },
        {
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
          title: "Abbraccia il Futuro",
          text: "Proteggi il Tuo Futuro Finanziario: Esplora le ultime tendenze, strategie e approfondimenti per aiutarti a prendere decisioni informate e"
        }
      ]
    },
    blog: {
      title: "Saggezza Finanziaria",
      readMore: "Leggi Tutto →"
    },
    posts: [
      {
        date: "Dic 2024",
        category: "Investimenti",
        title: "L'Effetto Composto degli Investimenti Costanti",
        excerpt: "Perché investire 100€ mensili batte il tentativo di cronometrare il mercato."
      },
      {
        date: "Dic 2024",
        category: "Budget",
        title: "La Regola 50/30/20 Non È Perfetta",
        excerpt: "Perché la popolare regola di budget fallisce per la maggior parte delle persone."
      },
      {
        date: "Nov 2024",
        category: "Mentalità",
        title: "Smetti di Cercare Vincite Rapide",
        excerpt: "La psicologia dietro gli schemi di arricchimento rapido e perché falliscono."
      },
      {
        date: "Nov 2024",
        category: "Debiti",
        title: "Debito a Palla di Neve vs. Valanga di Debito",
        excerpt: "L'approccio psicologico vs. matematico per estinguere i debiti."
      },
      {
        date: "Ott 2024",
        category: "Fondo Emergenza",
        title: "Perché 6 Mesi Non Bastano",
        excerpt: "Il caso per costruire un fondo di emergenza più grande in tempi incerti."
      },
      {
        date: "Ott 2024",
        category: "Reddito",
        title: "Side Hustle che Scalano Davvero",
        excerpt: "Oltre Uber e DoorDash. Veri business secondari che possono crescere."
      }
    ],
    about: {
      title: "Chi Siamo - StackMoneyUp",
      text1: "Questo non è un altro blog di finanza personale che promette di arricchirti.",
      text2: "Nessun link di affiliazione. Nessun contenuto sponsorizzato."
    },
    footer: {
      copyright: "© 2025 StackMoneyUp. Tutti i diritti riservati.",
      quickLinks: "Link Rapidi",
      exploreMore: "Esplora di Più",
      connectWithUs: "Connettiti Con Noi",
      home: "Home",
      about: "Chi Siamo",
      invest: "Investire",
      blog: "Blog",
      contact: "Contatti",
      privacy: "Privacy",
      terms: "Termini",
      sitemap: "Mappa del Sito",
      twitter: "Twitter",
      facebook: "Facebook",
      instagram: "Instagram",
      linkedin: "LinkedIn"
    }
  }
};

/**
 * Get translations for a specific language
 */
export function getTranslations(lang: Language): LanguageTranslations {
  return translations[lang] || translations.en;
}

/**
 * Get translated content from localized object
 */
export function getLocalizedContent<T extends Record<Language, string>>(
  content: T,
  lang: Language
): string {
  return content[lang] || content.en;
}

/**
 * Validate if language is supported
 */
export function isValidLanguage(lang: string): lang is Language {
  return lang === 'en' || lang === 'it';
}

/**
 * Get default language
 */
export function getDefaultLanguage(): Language {
  return 'en';
}
