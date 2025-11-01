import ContactPageWrapper from './ContactPageWrapper';

interface ContactPageProps {
  params: Promise<{ lang: string }>;
}

export { generateMetadata } from './ContactPageWrapper';

export default function ContactPage({ params }: ContactPageProps) {
  return <ContactPageWrapper params={params} />;
}
