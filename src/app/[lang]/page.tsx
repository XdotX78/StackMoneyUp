import { getTranslations, isValidLanguage, getDefaultLanguage } from "@/lib/translations";
import type { Language } from "@/types/blog";
import Image from "next/image";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params;
  const validLang = isValidLanguage(lang) ? lang as Language : getDefaultLanguage();
  const t = getTranslations(validLang);

  return (
    <main className="min-h-screen">
      {/* Hero Section - BLACK BACKGROUND */}
      <section className="relative min-h-screen bg-black text-white flex items-center">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-24 lg:py-0">
            {/* Hero Content - Left Side */}
            <div className="space-y-8">
              {/* Green Eyebrow */}
              <div className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--green-primary)' }}>
                Welcome to StackMoneyUp
              </div>
              
              <h1 className="text-6xl font-black tracking-tight lg:text-7xl xl:text-8xl leading-[1.1]">
                Personal Finance Growth
              </h1>
              
              <p className="text-xl text-gray-400 leading-relaxed">
                No bullshit. No easy money promises. Just real strategies for building wealth.
              </p>
              
              <div className="flex gap-4 pt-4">
                <a
                  href={`/${validLang}/blog`}
                  className="inline-block rounded-full bg-white px-12 py-4 text-base font-bold transition-all hover:bg-gray-200 hover:-translate-y-1 shadow-lg text-black"
                >
                  Read Articles
                </a>
                <a
                  href={`#about`}
                  className="inline-block rounded-full bg-transparent border-2 border-white px-12 py-4 text-base font-bold transition-all hover:bg-white hover:text-black hover:-translate-y-1 text-white"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Hero Image - Circular on Right */}
            <div className="relative flex justify-center items-center lg:justify-center">
              <div 
                className="relative w-[420px] h-[420px] xl:w-[600px] xl:h-[600px] rounded-full overflow-hidden"
                style={{ boxShadow: '0 20px 60px var(--green-glow)' }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
                  alt="Financial Growth"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 420px, 600px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigating Section - Light Background */}
      <section id="navigating" className="bg-white py-32 lg:py-40 text-black">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: 'var(--green-primary)' }}>
              {t.navigating.tagline}
            </p>
          </div>
          
          <h2 className="mb-16 lg:mb-24 text-center text-4xl lg:text-5xl font-black">
            {t.navigating.title}
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <h3 className="text-3xl lg:text-4xl font-black text-gray-900">
                Unlock the Secrets to Smarter Investing
              </h3>
              
              <p className="text-lg leading-relaxed text-gray-600">
                Uncover the strategies that can help you make informed investment decisions and grow your wealth over time.
              </p>
              
              {/* Bullet Points with Green Dashes */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="text-2xl font-bold mt-1" style={{ color: 'var(--green-primary)' }}>—</span>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Budgeting Made Easy:</h4>
                    <p className="text-base text-gray-600">
                      Discover practical tips and tools to help you take control of your spending
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <span className="text-2xl font-bold mt-1" style={{ color: 'var(--green-primary)' }}>—</span>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Retirement Planning:</h4>
                    <p className="text-base text-gray-600">
                      Get expert insights on planning for a secure and fulfilling retirement
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <span className="text-2xl font-bold mt-1" style={{ color: 'var(--green-primary)' }}>—</span>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Investment Options:</h4>
                    <p className="text-base text-gray-600">
                      Explore different ways to grow your wealth and achieve financial freedom
                    </p>
                  </div>
                </div>
              </div>
              
              <a
                href={`/${validLang}/blog`}
                className="inline-block rounded-full bg-black px-12 py-4 text-base font-bold transition-all hover:bg-gray-800 hover:-translate-y-1"
                style={{ color: '#ffffff' }}
              >
                {t.navigating.cta}
              </a>
            </div>

            {/* Right Image */}
            <div className="relative h-[500px] lg:h-[600px] rounded-[20px] overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80"
                alt="Professional woman at laptop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mastering Section - Complex Layout with Overlay */}
      <section className="relative bg-gray-50 py-32 lg:py-40 text-black">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: 'var(--green-primary)' }}>
              {t.mastering.tagline}
            </p>
          </div>
          
          <h2 className="mb-16 lg:mb-24 text-center text-4xl lg:text-5xl font-black">
            {t.mastering.title}
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Background Image with White Card Overlay */}
            <div className="relative h-[600px]">
              {/* Background Image */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
                  alt="Mountain landscape"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* White Card Overlay */}
              <div className="absolute top-1/2 left-4 lg:left-8 -translate-y-1/2 w-72 lg:w-80 bg-white p-6 lg:p-8 rounded-xl shadow-2xl">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-4 text-xl font-bold text-gray-900">{t.mastering.cardTitle}</h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {t.mastering.cardText}
                </p>
              </div>
            </div>

            {/* Right Content */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">{t.mastering.rightTitle}</h3>
              <p className="text-base leading-relaxed text-gray-600">
                {t.mastering.rightText}
              </p>
              <a
                href={`/${validLang}/blog`}
                className="inline-block rounded-full bg-black px-12 py-4 text-base font-bold transition-all hover:bg-gray-800 hover:-translate-y-1"
                style={{ color: '#ffffff' }}
              >
                {t.mastering.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Achieve Financial Section - BLACK BACKGROUND with Laptop Mockup */}
      <section className="relative bg-black py-32 lg:py-40 text-white">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                {t.achieve.title}
              </h2>
              <p className="text-lg leading-relaxed text-gray-400">
                {t.achieve.text}
              </p>
              <a
                href={`/${validLang}/blog`}
                className="inline-block rounded-full bg-white px-12 py-4 text-base font-bold transition-all hover:bg-gray-200 hover:-translate-y-1 text-black"
              >
                {t.achieve.cta}
              </a>
            </div>

            {/* Right - Laptop Mockup */}
            <div className="relative aspect-[4/3]">
              <Image
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80"
                alt="Laptop workspace"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grow Your Wealth Section - Black Card + 3 Image Cards */}
      <section className="bg-white py-32 lg:py-40">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="mb-6 text-center">
            <p className="text-sm uppercase tracking-widest font-semibold" style={{ color: 'var(--green-primary)' }}>
              {t.growWealth.tagline}
            </p>
          </div>

          {/* Top Card - BLACK */}
          <div className="mb-16 rounded-2xl bg-black border-2 border-gray-800 p-8 lg:p-12 text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-gray-800">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black mb-2">{t.growWealth.title}</h2>
                  <p className="text-gray-400">{t.growWealth.subtitle}</p>
                </div>
              </div>
              <a
                href={`/${validLang}/blog`}
                className="rounded-full bg-white px-12 py-4 text-base font-bold transition-all hover:bg-gray-200 hover:-translate-y-1 whitespace-nowrap text-black"
              >
                {t.growWealth.cta}
              </a>
            </div>
          </div>

          {/* Three Image Cards */}
          <div className="grid gap-8 lg:gap-12 md:grid-cols-3">
            {t.growWealth.cards.map((card, index) => (
              <div key={index} className="group">
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="bg-gray-50 py-32 lg:py-40 text-black">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <h2 className="mb-12 lg:mb-16 text-center text-4xl lg:text-5xl font-black">
            {t.blog.title}
          </h2>
          
          <div className="grid gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-3">
            {t.posts.slice(0, 6).map((post, index) => (
              <article
                key={index}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                  <span className="rounded bg-gray-100 px-2 py-1 text-gray-700 text-xs font-medium">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="mb-3 text-xl font-bold group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h3>
                
                <p className="mb-4 text-gray-600 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                
                <a
                  href={`/${validLang}/blog`}
                  className="inline-flex items-center font-semibold text-black hover:text-gray-700 text-sm"
                >
                  {t.blog.readMore} →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-32 lg:py-40 text-black">
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="text-center">
            <h2 className="mb-8 text-4xl lg:text-5xl font-black">
              {t.about.title}
            </h2>
            <p className="mb-6 text-lg text-gray-600 leading-relaxed">
              {t.about.text1}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.about.text2}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

// Generate static params for both languages
export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'it' },
  ];
}
