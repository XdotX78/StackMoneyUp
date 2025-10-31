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
      <section className="relative min-h-screen bg-black text-white flex items-center py-32">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Hero Content - Left Side */}
            <div className="space-y-10">
              {/* Green Eyebrow - BIGGER */}
              <div className="text-base font-bold tracking-widest uppercase" style={{ color: 'var(--green-primary)' }}>
                Welcome to StackMoneyUp
              </div>
              
              <h1 className="text-7xl font-black tracking-tight lg:text-8xl xl:text-9xl leading-[0.9]">
                Personal Finance Growth
              </h1>
              
              <p className="text-2xl text-gray-400 leading-relaxed">
                No bullshit. No easy money promises. Just real strategies for building wealth.
              </p>
              
              <div className="flex gap-4 pt-6">
                <a
                  href={`/${validLang}/blog`}
                  className="inline-block rounded-full bg-white px-14 py-5 text-lg font-bold transition-all hover:bg-gray-200 hover:-translate-y-1 shadow-xl text-black"
                >
                  Read Articles
                </a>
                <a
                  href={`#about`}
                  className="inline-block rounded-full bg-transparent border-2 border-white px-14 py-5 text-lg font-bold transition-all hover:bg-white hover:text-black hover:-translate-y-1 text-white"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Hero Image - Circular on Right - MUCH BIGGER */}
            <div className="relative flex justify-center items-center lg:justify-end">
              <div 
                className="relative w-[500px] h-[500px] xl:w-[700px] xl:h-[700px] rounded-full overflow-hidden"
                style={{ boxShadow: '0 30px 100px rgba(0, 255, 0, 0.2)' }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
                  alt="Financial Growth"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1280px) 500px, 700px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigating Section - WHITE Background */}
      <section id="navigating" className="bg-white py-40 lg:py-52 text-black">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="mb-12 text-center">
            <p className="text-lg uppercase tracking-widest font-bold mb-8" style={{ color: 'var(--green-primary)' }}>
              {t.navigating.tagline}
            </p>
          </div>
          
          <h2 className="mb-24 lg:mb-32 text-center text-6xl lg:text-8xl font-black leading-tight">
            {t.navigating.title}
          </h2>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl font-black mb-6">{t.navigating.subtitle}</h3>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">{t.navigating.text}</p>
              
              <div className="space-y-6">
                {t.navigating.features.map((feature, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-6 h-6" style={{ color: 'var(--green-primary)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-lg mb-2">{feature.title}</p>
                      <p className="text-gray-600 leading-relaxed">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <a
                href={`/${validLang}/blog`}
                className="inline-block mt-8 rounded-full bg-black px-14 py-5 text-lg font-bold transition-all hover:bg-gray-800 hover:-translate-y-1 shadow-xl text-white"
              >
                {t.navigating.cta}
              </a>
            </div>

            <div className="relative">
              <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&q=80"
                  alt="Financial Planning"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mastering Section - LIGHT GRAY with Overlay Card Design */}
      <section className="relative bg-gray-100 py-40 lg:py-52 text-black">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="mb-12 text-center">
            <p className="text-lg uppercase tracking-widest font-bold mb-8" style={{ color: 'var(--green-primary)' }}>
              {t.mastering.tagline}
            </p>
          </div>
          
          <h2 className="mb-24 lg:mb-32 text-center text-6xl lg:text-8xl font-black leading-tight">
            {t.mastering.title}
          </h2>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Side - Background Image */}
            <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
                alt="Financial Mastery"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              
              {/* Overlay Card - White card on top of image */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="bg-white rounded-2xl p-10 max-w-md shadow-2xl">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black mb-4">{t.mastering.card.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{t.mastering.card.text}</p>
                  <a
                    href={`/${validLang}/blog`}
                    className="inline-block text-base font-bold underline hover:no-underline"
                    style={{ color: 'var(--green-primary)' }}
                  >
                    {t.mastering.card.cta}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div className="space-y-8">
              <h3 className="text-4xl font-black">{t.mastering.subtitle}</h3>
              <p className="text-xl text-gray-600 leading-relaxed">{t.mastering.text}</p>
              <a
                href={`/${validLang}/blog`}
                className="inline-block mt-6 rounded-full bg-black px-14 py-5 text-lg font-bold transition-all hover:bg-gray-800 hover:-translate-y-1 shadow-xl text-white"
              >
                {t.mastering.cta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Achieve Financial Section - BLACK BACKGROUND */}
      <section className="relative bg-black py-40 lg:py-52 text-white">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-10">
              <h2 className="text-6xl lg:text-8xl font-black leading-tight">
                {t.achieve.title}
              </h2>
              <p className="text-2xl leading-relaxed text-gray-400">
                {t.achieve.text}
              </p>
              <a
                href={`/${validLang}/blog`}
                className="inline-block rounded-full bg-white px-14 py-5 text-lg font-bold transition-all hover:bg-gray-200 hover:-translate-y-1 shadow-xl text-black"
              >
                {t.achieve.cta}
              </a>
            </div>

            <div className="relative">
              <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
                <div className="relative w-full max-w-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80"
                    alt="Financial Success"
                    width={800}
                    height={600}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                  <div 
                    className="absolute -bottom-8 -right-8 w-64 h-64 rounded-full flex items-center justify-center text-6xl font-black"
                    style={{ 
                      backgroundColor: 'var(--green-primary)',
                      color: '#000000',
                      boxShadow: '0 20px 60px rgba(0, 255, 0, 0.3)'
                    }}
                  >
                    S
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grow Your Wealth Section - WHITE Background */}
      <section className="bg-white py-40 lg:py-52">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="mb-12 text-center">
            <p className="text-lg uppercase tracking-widest font-bold" style={{ color: 'var(--green-primary)' }}>
              {t.growWealth.tagline}
            </p>
          </div>

          {/* Top Card - BLACK with better contrast */}
          <div className="mb-20 rounded-3xl bg-black p-10 lg:p-14 text-white shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-800">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black mb-3">{t.growWealth.title}</h2>
                  <p className="text-xl text-gray-300">{t.growWealth.subtitle}</p>
                </div>
              </div>
              <a
                href={`/${validLang}/blog`}
                className="rounded-full bg-white px-14 py-5 text-lg font-bold transition-all hover:bg-gray-200 hover:-translate-y-1 shadow-xl whitespace-nowrap text-black"
              >
                {t.growWealth.cta}
              </a>
            </div>
          </div>

          {/* Three Image Cards */}
          <div className="grid gap-10 lg:gap-14 md:grid-cols-3">
            {t.growWealth.cards.map((card, index) => (
              <div key={index} className="group">
                <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="mb-4 text-3xl font-black text-black">{card.title}</h3>
                <p className="text-lg leading-relaxed text-gray-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section - LIGHT GRAY Background */}
      <section className="bg-gray-100 py-40 lg:py-52 text-black">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="mb-12 text-center">
            <p className="text-lg uppercase tracking-widest font-bold mb-8" style={{ color: 'var(--green-primary)' }}>
              {t.blog.tagline}
            </p>
          </div>
          
          <h2 className="mb-20 lg:mb-28 text-center text-6xl lg:text-8xl font-black leading-tight">
            {t.blog.title}
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            {t.blog.articles.map((article, index) => (
              <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border-2 border-gray-200">
                <div className="p-8">
                  <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span className="font-bold" style={{ color: 'var(--green-primary)' }}>{article.category}</span>
                  </div>
                  <h3 className="mb-4 text-2xl font-black text-black leading-tight">{article.title}</h3>
                  <p className="mb-6 text-gray-600 leading-relaxed">{article.excerpt}</p>
                  <a
                    href={`/${validLang}/blog`}
                    className="inline-block font-bold hover:underline"
                    style={{ color: 'var(--green-primary)' }}
                  >
                    {article.cta}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <a
              href={`/${validLang}/blog`}
              className="inline-block rounded-full bg-black px-14 py-5 text-lg font-bold transition-all hover:bg-gray-800 hover:-translate-y-1 shadow-xl text-white"
            >
              {t.blog.cta}
            </a>
          </div>
        </div>
      </section>

      {/* About Section - WHITE Background */}
      <section id="about" className="bg-white py-40 lg:py-52 text-black">
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32">
          <div className="text-center space-y-8">
            <h2 className="text-6xl lg:text-7xl font-black leading-tight">
              {t.about.title}
            </h2>
            <div className="space-y-6 text-xl text-gray-600 leading-relaxed">
              {t.about.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
