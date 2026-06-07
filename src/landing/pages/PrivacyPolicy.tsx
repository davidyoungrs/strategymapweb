import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-container-max mx-auto px-margin-desktop py-16 md:py-24">
      <h1 className="font-display-lg text-display-lg font-bold mb-8 text-on-surface">Kettle Strat Limited Privacy Statement</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-8 text-on-surface-variant">
        <section>
          <h2 className="font-headline-sm text-headline-sm font-semibold mt-8 mb-4 text-on-surface">1. What Information We Collect</h2>
          <p>We may collect and process the following personal data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your name</li>
            <li>Contact details (phone number, email address)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm font-semibold mt-8 mb-4 text-on-surface">2. How We Use Your Information</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact you regarding the services and solutions we offer.</li>
            <li>Maintain internal records.</li>
            <li>Comply with legal or regulatory obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm font-semibold mt-8 mb-4 text-on-surface">3. Legal Basis for Processing</h2>
          <p>We process your personal data under the following lawful bases:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contract (to provide services you have requested)</li>
            <li>Legitimate interests (to manage our business effectively)</li>
            <li>Legal obligations (where applicable)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm font-semibold mt-8 mb-4 text-on-surface">4. Data Sharing</h2>
          <p>We do not sell or rent your personal data. We may share your data with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Service providers (e.g., booking systems) who process data on our behalf.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm font-semibold mt-8 mb-4 text-on-surface">5. Data Retention</h2>
          <p>We retain your data only as long as necessary to fulfil the purposes we collected it for, including legal, accounting, or reporting requirements.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm font-semibold mt-8 mb-4 text-on-surface">6. Data Security</h2>
          <p>We take appropriate technical and organisational measures to protect your personal data from unauthorised access, loss, or misuse.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm font-semibold mt-8 mb-4 text-on-surface">7. Your Rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data.</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing.</li>
            <li>Withdraw consent at any time (where applicable)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm font-semibold mt-8 mb-4 text-on-surface">8. Contact Us</h2>
          <p>
            If you have any questions about this privacy notice or your data, please contact:<br />
            <a href="mailto:info@reallysimpleapps.com" className="text-primary hover:underline font-semibold">info@reallysimpleapps.com</a>
          </p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm font-semibold mt-8 mb-4 text-on-surface">9. Complaints</h2>
          <p>You have the right to lodge a complaint with the Information Commissioner’s Office (ICO) if you believe your data has been handled improperly.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
