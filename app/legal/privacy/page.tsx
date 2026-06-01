import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | HantaWorld',
  description:
    'Privacy policy for HantaWorld website and Android app, including analytics, advertising, push notifications, and public health data usage.',
  alternates: { canonical: 'https://www.hantaworld.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}

export function PrivacyPolicyContent() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg-primary)' }}>
        <div className="container-main" style={{ padding: '4rem 1.5rem', maxWidth: 860 }}>
          <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Effective date: May 21, 2026
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}
          >
            Privacy Policy
          </h1>

          <div style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              HantaWorld provides hantavirus outbreak intelligence, country risk information, public health reports, and
              related educational content through the HantaWorld website and Android application.
            </p>

            <Section title="1. Information We Collect">
              We do not require users to create an account to access the public website or Android app. The app may
              collect technical information needed to operate core features, including device platform, app version,
              locale, Expo push notification token, notification delivery status, and basic usage events from analytics
              or advertising services.
            </Section>

            <Section title="2. Push Notifications">
              If you allow notifications, the Android app sends an Expo push token to the HantaWorld API so we can
              deliver public health updates and newly published reports. You can disable notifications at any time from
              your device settings. Push tokens are used only for app notifications and are not sold.
            </Section>

            <Section title="3. Advertising and Cookies">
              The website may use Google AdSense Auto Ads, and the Android app may display ads through Google AdMob.
              Google and its partners may use cookies, advertising identifiers, device information, approximate
              location, diagnostics, and interaction data to deliver, measure, and personalize ads according to Google
              policies. You can manage browser cookies through your browser settings and mobile advertising preferences
              through Android privacy settings.
            </Section>

            <Section title="4. Analytics">
              The website uses Google Analytics to understand aggregate traffic and improve the service. Analytics data
              may include browser, device, page view, and approximate location information. We do not use analytics to
              identify individual medical status.
            </Section>

            <Section title="5. Public Health Content">
              HantaWorld publishes verified and source-attributed public health information. The service is for
              informational purposes only and does not provide medical diagnosis, treatment, emergency response, or
              patient-specific health advice.
            </Section>

            <Section title="6. How We Use Information">
              We use collected technical data to operate the app, deliver notifications, improve reliability, measure
              aggregate usage, prevent abuse, and support advertising. We do not sell personal information.
            </Section>

            <Section title="7. Data Sharing">
              We may share limited technical data with service providers that help operate the platform, including
              hosting providers, notification services, analytics providers, and advertising SDK providers. These
              providers process data according to their own terms and applicable law.
            </Section>

            <Section title="8. Data Retention and Security">
              We retain technical records only as long as needed for operational, security, analytics, or compliance
              purposes. We use encrypted connections and reasonable administrative and technical safeguards to protect
              platform data.
            </Section>

            <Section title="9. Your Choices">
              You can disable push notifications from Android settings, reset or limit your advertising ID from Android
              privacy settings, and use browser controls to manage cookies or analytics preferences.
            </Section>

            <Section title="10. Contact">
              For privacy questions about HantaWorld, contact the site operator through the official HantaWorld website
              contact channels.
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: '2rem' }}>
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.85rem', fontSize: '1.25rem' }}>{title}</h2>
      <p style={{ margin: 0 }}>{children}</p>
    </section>
  );
}
