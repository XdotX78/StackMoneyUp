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
  tagline: string;
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

interface BlogPageTranslations {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  categoryLabel: string;
  all: string;
  activeFilters: string;
  clearFilters: string;
  foundArticles: string;
  foundArticle: string;
  noPostsFound: string;
  noPostsFoundSubtitle: string;
}

interface LoginPageTranslations {
  title: string;
  subtitle: string;
  emailLabel: string;
  passwordLabel: string;
  confirmPasswordLabel: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  passwordsDontMatch: string;
  signIn: string;
  signingIn: string;
  signInWithGoogle: string;
  signUp: string;
  signUpWithGoogle: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  forgotPassword: string;
  mockAuthNote: string;
  loginFailed: string;
  emailNotConfirmed: string;
  checkEmailForConfirmation: string;
}

interface DashboardTranslations {
  title: string;
  welcomeBack: string;
  totalPosts: string;
  postsCreated: string;
  published: string;
  livePosts: string;
  drafts: string;
  unpublishedPosts: string;
  quickActions: string;
  newPost: string;
  manageTags: string;
  recentPosts: string;
  noPostsYet: string;
  createFirstPost: string;
  logout: string;
  loading: string;
  deleteConfirm: string;
}

interface ProfileTranslations {
  title: string;
  subtitle: string;
  personalInfo: string;
  accountSettings: string;
  displayName: string;
  email: string;
  emailVerified: string;
  emailNotVerified: string;
  changePassword: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  updateProfile: string;
  updating: string;
  profileUpdated: string;
  updateFailed: string;
  passwordChanged: string;
  passwordChangeFailed: string;
  saveChanges: string;
  cancel: string;
  memberSince: string;
  userId: string;
  language: string;
  avatar: string;
  uploadAvatar: string;
  uploading: string;
  removeAvatar: string;
  avatarUploaded: string;
  avatarUploadFailed: string;
  passwordsDontMatch: string;
  passwordTooShort: string;
}

interface NewPostTranslations {
  title: string;
  subtitle: string;
}

interface PostFormTranslations {
  slug: string;
  slugHelper: string;
  category: string;
  categoryPlaceholder: string;
  coverImage: string;
  coverImageHelper: string;
  tags: string;
  tagsHelper: string;
  tagsPlaceholder: string;
  content: string;
  published: string;
  featured: string;
  cancel: string;
  createPost: string;
  updatePost: string;
  english: string;
  italian: string;
  englishPlaceholder: string;
  italianPlaceholder: string;
  preview: string;
  previewTitle: string;
  previewEnglish: string;
  previewItalian: string;
  closePreview: string;
}

interface CategoryTranslations {
  [key: string]: {
    en: string;
    it: string;
  };
}

interface PasswordResetTranslations {
  forgotPasswordTitle: string;
  forgotPasswordSubtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  sendResetLink: string;
  sendingResetLink: string;
  resetLinkSent: string;
  resetLinkSentMessage: string;
  backToLogin: string;
  resetPasswordTitle: string;
  resetPasswordSubtitle: string;
  newPasswordLabel: string;
  confirmPasswordLabel: string;
  newPasswordPlaceholder: string;
  confirmPasswordPlaceholder: string;
  updatePassword: string;
  updatingPassword: string;
  passwordUpdated: string;
  passwordUpdatedMessage: string;
  invalidToken: string;
  invalidTokenMessage: string;
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
  blogPage: BlogPageTranslations;
  login: LoginPageTranslations;
  dashboard: DashboardTranslations;
  profile: ProfileTranslations;
  newPost: NewPostTranslations;
  postForm: PostFormTranslations;
  categories: CategoryTranslations;
  passwordReset: PasswordResetTranslations;
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
    }, blog: {
      title: "Financial Wisdom",
      readMore: "Read More →",
      tagline: "Financial Wisdom"
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
    },
    blogPage: {
      title: "Blog",
      subtitle: "Explore our articles on personal finance, investing, and financial growth",
      searchPlaceholder: "Search articles...",
      categoryLabel: "Category:",
      all: "All",
      activeFilters: "Active filters:",
      clearFilters: "Clear filters",
      foundArticles: "Found {count} articles",
      foundArticle: "Found {count} article",
      noPostsFound: "No posts found",
      noPostsFoundSubtitle: "Try adjusting your search or filters"
    },
    login: {
      title: "StackMoneyUp",
      subtitle: "Sign in to access the dashboard",
      emailLabel: "Email",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      emailPlaceholder: "your@email.com",
      passwordPlaceholder: "Enter your password",
      confirmPasswordPlaceholder: "Re-enter your password",
      passwordsDontMatch: "Passwords do not match",
      signIn: "Sign In",
      signingIn: "Signing in...",
      signInWithGoogle: "Sign in with Google",
      signUp: "Sign Up",
      signUpWithGoogle: "Sign up with Google",
      alreadyHaveAccount: "Already have an account? Sign in",
      dontHaveAccount: "Don't have an account? Sign up",
      forgotPassword: "Forgot password?",
      mockAuthNote: "Real Supabase authentication",
      loginFailed: "Login failed. Please try again.",
      emailNotConfirmed: "Please check your email to confirm your account. We've sent you a confirmation link.",
      checkEmailForConfirmation: "Registration successful! Please check your email to confirm your account."
    },
    dashboard: {
      title: "Dashboard",
      welcomeBack: "Welcome back",
      totalPosts: "Total Posts",
      postsCreated: "Posts created",
      published: "Published",
      livePosts: "Live posts",
      drafts: "Drafts",
      unpublishedPosts: "Unpublished posts",
      quickActions: "Quick Actions",
      newPost: "+ New Post",
      manageTags: "Manage Tags",
      recentPosts: "Recent Posts",
      noPostsYet: "No posts yet",
      createFirstPost: "Create Your First Post",
      logout: "Logout",
      loading: "Loading...",
      deleteConfirm: "Are you sure you want to delete this post?"
    },
    profile: {
      title: "Profile",
      subtitle: "Manage your account settings and preferences",
      personalInfo: "Personal Information",
      accountSettings: "Account Settings",
      displayName: "Display Name",
      email: "Email",
      emailVerified: "Email Verified",
      emailNotVerified: "Email Not Verified",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      updateProfile: "Update Profile",
      updating: "Updating...",
      profileUpdated: "Profile updated successfully!",
      updateFailed: "Failed to update profile. Please try again.",
      passwordChanged: "Password changed successfully!",
      passwordChangeFailed: "Failed to change password. Please try again.",
      saveChanges: "Save Changes",
      cancel: "Cancel",
      memberSince: "Member Since",
      userId: "User ID",
      language: "Language",
      avatar: "Avatar",
      uploadAvatar: "Upload Avatar",
      uploading: "Uploading...",
      removeAvatar: "Remove Avatar",
      avatarUploaded: "Avatar uploaded successfully!",
      avatarUploadFailed: "Failed to upload avatar. Please try again.",
      passwordsDontMatch: "New passwords do not match",
      passwordTooShort: "Password must be at least 6 characters"
    },
    newPost: {
      title: "Create New Post",
      subtitle: "Write your blog post in both English and Italian"
    },
    postForm: {
      slug: "Slug",
      slugHelper: "Auto-generated from title, but you can edit it",
      category: "Category",
      categoryPlaceholder: "e.g., Investing, Saving & Emergency Fund, Budgeting & Spending",
      coverImage: "Cover Image URL",
      coverImageHelper: "URL for the blog post cover image",
      tags: "Tags (comma-separated)",
      tagsHelper: "Separate tags with commas",
      tagsPlaceholder: "investing, budgeting, mindset",
      content: "Content",
      published: "Published",
      featured: "Featured",
      cancel: "Cancel",
      createPost: "Create Post",
      updatePost: "Update Post",
      english: "English",
      italian: "Italian",
      englishPlaceholder: "Start writing your blog post in English...",
      italianPlaceholder: "Inizia a scrivere il tuo post in italiano...",
      preview: "Preview",
      previewTitle: "Blog Post Preview",
      previewEnglish: "English Preview",
      previewItalian: "Italian Preview",
      closePreview: "Close Preview"
    },
    categories: {
      'Investing': { en: 'Investing', it: 'Investimenti' },
      'Saving & Emergency Fund': { en: 'Saving & Emergency Fund', it: 'Risparmio & Fondo Emergenza' },
      'Budgeting & Spending': { en: 'Budgeting & Spending', it: 'Budget & Spese' },
      'Debt & Loans': { en: 'Debt & Loans', it: 'Debiti & Prestiti' },
      'Income & Earning More': { en: 'Income & Earning More', it: 'Reddito & Guadagnare di Più' },
      'Money Mindset': { en: 'Money Mindset', it: 'Psicologia del Denaro' },
    },
    passwordReset: {
      forgotPasswordTitle: "Reset Password",
      forgotPasswordSubtitle: "Enter your email address and we'll send you a link to reset your password",
      emailLabel: "Email",
      emailPlaceholder: "your@email.com",
      sendResetLink: "Send Reset Link",
      sendingResetLink: "Sending...",
      resetLinkSent: "Reset link sent!",
      resetLinkSentMessage: "Check your email for a password reset link. If you don't see it, check your spam folder.",
      backToLogin: "Back to Login",
      resetPasswordTitle: "Set New Password",
      resetPasswordSubtitle: "Enter your new password below",
      newPasswordLabel: "New Password",
      confirmPasswordLabel: "Confirm Password",
      newPasswordPlaceholder: "Enter new password",
      confirmPasswordPlaceholder: "Confirm new password",
      updatePassword: "Update Password",
      updatingPassword: "Updating...",
      passwordUpdated: "Password updated!",
      passwordUpdatedMessage: "Your password has been successfully updated. You can now log in with your new password.",
      invalidToken: "Invalid or expired link",
      invalidTokenMessage: "This password reset link is invalid or has expired. Please request a new one."
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
      readMore: "Leggi Tutto →",
      tagline: "Saggezza Finanziaria"
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
    },
    blogPage: {
      title: "Blog",
      subtitle: "Esplora i nostri articoli su finanza personale, investimenti e crescita finanziaria",
      searchPlaceholder: "Cerca articoli...",
      categoryLabel: "Categoria:",
      all: "Tutte",
      activeFilters: "Filtri attivi:",
      clearFilters: "Cancella filtri",
      foundArticles: "Trovati {count} articoli",
      foundArticle: "Trovato {count} articolo",
      noPostsFound: "Nessun post trovato",
      noPostsFoundSubtitle: "Prova ad aggiustare la tua ricerca o i filtri"
    },
    login: {
      title: "StackMoneyUp",
      subtitle: "Accedi per accedere alla dashboard",
      emailLabel: "Email",
      passwordLabel: "Password",
      confirmPasswordLabel: "Conferma Password",
      emailPlaceholder: "tua@email.com",
      passwordPlaceholder: "Inserisci la tua password",
      confirmPasswordPlaceholder: "Reinserisci la tua password",
      passwordsDontMatch: "Le password non corrispondono",
      signIn: "Accedi",
      signingIn: "Accesso in corso...",
      signInWithGoogle: "Accedi con Google",
      signUp: "Registrati",
      signUpWithGoogle: "Registrati con Google",
      alreadyHaveAccount: "Hai già un account? Accedi",
      dontHaveAccount: "Non hai un account? Registrati",
      forgotPassword: "Password dimenticata?",
      mockAuthNote: "Autenticazione Supabase reale",
      loginFailed: "Accesso fallito. Per favore riprova.",
      emailNotConfirmed: "Per favore controlla la tua email per confermare il tuo account. Ti abbiamo inviato un link di conferma.",
      checkEmailForConfirmation: "Registrazione completata! Controlla la tua email per confermare il tuo account."
    },
    dashboard: {
      title: "Dashboard",
      welcomeBack: "Bentornato",
      totalPosts: "Totale Post",
      postsCreated: "Post creati",
      published: "Pubblicati",
      livePosts: "Post live",
      drafts: "Bozze",
      unpublishedPosts: "Post non pubblicati",
      quickActions: "Azioni Rapide",
      newPost: "+ Nuovo Post",
      manageTags: "Gestisci Tag",
      recentPosts: "Post Recenti",
      noPostsYet: "Nessun post ancora",
      createFirstPost: "Crea il Tuo Primo Post",
      logout: "Esci",
      loading: "Caricamento...",
      deleteConfirm: "Sei sicuro di voler eliminare questo post?"
    },
    profile: {
      title: "Profilo",
      subtitle: "Gestisci le impostazioni del tuo account e le preferenze",
      personalInfo: "Informazioni Personali",
      accountSettings: "Impostazioni Account",
      displayName: "Nome Visualizzato",
      email: "Email",
      emailVerified: "Email Verificata",
      emailNotVerified: "Email Non Verificata",
      changePassword: "Cambia Password",
      currentPassword: "Password Attuale",
      newPassword: "Nuova Password",
      confirmNewPassword: "Conferma Nuova Password",
      updateProfile: "Aggiorna Profilo",
      updating: "Aggiornamento...",
      profileUpdated: "Profilo aggiornato con successo!",
      updateFailed: "Impossibile aggiornare il profilo. Per favore riprova.",
      passwordChanged: "Password cambiata con successo!",
      passwordChangeFailed: "Impossibile cambiare la password. Per favore riprova.",
      saveChanges: "Salva Modifiche",
      cancel: "Annulla",
      memberSince: "Membro dal",
      userId: "ID Utente",
      language: "Lingua",
      avatar: "Avatar",
      uploadAvatar: "Carica Avatar",
      uploading: "Caricamento...",
      removeAvatar: "Rimuovi Avatar",
      avatarUploaded: "Avatar caricato con successo!",
      avatarUploadFailed: "Impossibile caricare l'avatar. Per favore riprova.",
      passwordsDontMatch: "Le nuove password non corrispondono",
      passwordTooShort: "La password deve essere di almeno 6 caratteri"
    },
    newPost: {
      title: "Crea Nuovo Post",
      subtitle: "Scrivi il tuo post del blog in inglese e italiano"
    },
    postForm: {
      slug: "Slug",
      slugHelper: "Generato automaticamente dal titolo, ma puoi modificarlo",
      category: "Categoria",
      categoryPlaceholder: "es. Investimenti, Risparmio & Fondo Emergenza, Budget & Spese",
      coverImage: "URL Immagine di Copertina",
      coverImageHelper: "URL per l'immagine di copertina del post",
      tags: "Tag (separati da virgola)",
      tagsHelper: "Separa i tag con virgole",
      tagsPlaceholder: "investimenti, budget, mentalità",
      content: "Contenuto",
      published: "Pubblicato",
      featured: "In Evidenza",
      cancel: "Annulla",
      createPost: "Crea Post",
      updatePost: "Aggiorna Post",
      english: "Inglese",
      italian: "Italiano",
      englishPlaceholder: "Inizia a scrivere il tuo post del blog in inglese...",
      italianPlaceholder: "Inizia a scrivere il tuo post in italiano...",
      preview: "Anteprima",
      previewTitle: "Anteprima del Post",
      previewEnglish: "Anteprima Inglese",
      previewItalian: "Anteprima Italiana",
      closePreview: "Chiudi Anteprima"
    },
    categories: {
      'Investing': { en: 'Investing', it: 'Investimenti' },
      'Saving & Emergency Fund': { en: 'Saving & Emergency Fund', it: 'Risparmio & Fondo Emergenza' },
      'Budgeting & Spending': { en: 'Budgeting & Spending', it: 'Budget & Spese' },
      'Debt & Loans': { en: 'Debt & Loans', it: 'Debiti & Prestiti' },
      'Income & Earning More': { en: 'Income & Earning More', it: 'Reddito & Guadagnare di Più' },
      'Money Mindset': { en: 'Money Mindset', it: 'Psicologia del Denaro' },
    },
    passwordReset: {
      forgotPasswordTitle: "Reimposta Password",
      forgotPasswordSubtitle: "Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la password",
      emailLabel: "Email",
      emailPlaceholder: "tua@email.com",
      sendResetLink: "Invia Link di Reset",
      sendingResetLink: "Invio in corso...",
      resetLinkSent: "Link di reset inviato!",
      resetLinkSentMessage: "Controlla la tua email per il link di reset password. Se non lo vedi, controlla la cartella spam.",
      backToLogin: "Torna al Login",
      resetPasswordTitle: "Imposta Nuova Password",
      resetPasswordSubtitle: "Inserisci la tua nuova password qui sotto",
      newPasswordLabel: "Nuova Password",
      confirmPasswordLabel: "Conferma Password",
      newPasswordPlaceholder: "Inserisci nuova password",
      confirmPasswordPlaceholder: "Conferma nuova password",
      updatePassword: "Aggiorna Password",
      updatingPassword: "Aggiornamento in corso...",
      passwordUpdated: "Password aggiornata!",
      passwordUpdatedMessage: "La tua password è stata aggiornata con successo. Ora puoi accedere con la tua nuova password.",
      invalidToken: "Link non valido o scaduto",
      invalidTokenMessage: "Questo link di reset password non è valido o è scaduto. Per favore richiedine uno nuovo."
    }
  }
};

/**
 * Get translated category name
 */
export function getCategoryTranslation(category: string, lang: Language): string {
  const categories = translations[lang]?.categories;
  if (categories && categories[category]) {
    return categories[category][lang];
  }
  return category; // Fallback to original if not found
}

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
