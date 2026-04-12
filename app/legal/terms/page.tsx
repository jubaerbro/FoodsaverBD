export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="bg-emerald-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Last updated: March 14, 2026
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl prose prose-slate">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the FoodSaver BD website and services, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            FoodSaver BD provides an online platform that connects consumers with local food businesses (restaurants, bakeries, cafes, grocery stores) that have surplus food available at a discounted price. We do not prepare, sell, or handle the food ourselves.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>

          <h2>4. Reservations and Purchases</h2>
          <p>
            When you reserve a meal or &quot;Surprise Box&quot; through FoodSaver BD, you are committing to pick it up during the specified time window. Payment is currently handled directly at the store during pickup, but online payment options may be introduced in the future.
          </p>
          <ul>
            <li><strong>Cancellations:</strong> You may cancel a reservation up to 2 hours before the start of the pickup window.</li>
            <li><strong>No-shows:</strong> Repeated failure to pick up reserved items may result in the suspension or termination of your account.</li>
          </ul>

          <h2>5. Food Quality and Safety</h2>
          <p>
            The food businesses listed on our platform are solely responsible for the quality, safety, and compliance of the food they sell. FoodSaver BD acts only as an intermediary and does not guarantee the quality or safety of the food. If you have any concerns about the food you receive, please contact the business directly and notify us.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            In no event shall FoodSaver BD, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> legal@foodsaverbd.com<br />
            <strong>Address:</strong> 123 Green Avenue, Block C, Banani, Dhaka 1213, Bangladesh
          </p>
        </div>
      </section>
    </div>
  )
}
