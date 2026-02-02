import React from "react";

const TermsAndPolicyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-gray-800 space-y-6 leading-relaxed pt-36">
      <h1 className="text-4xl font-bold text-center mb-10">Terms of Use and Policy</h1>
      <p>
        Welcome to <strong>Aisha Quran Academy</strong>. By accessing our website at 
        <a href="https://aishaquran.com" target="_blank" rel="noreferrer" className="text-blue-600 underline"> https://aishaquran.com</a>, 
        you agree to the following Terms of Use and Policy (“Agreement”). The terms “we” and “our” refer to Aisha Quran Academy.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Legal Terms</h2>
      <p>
        By using this website, you explicitly agree to our Terms of Use, Privacy Policy, and any posted rules or guidelines. 
        If you do not wish to be bound, please do not use or access our services.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Student Policy & Information</h2>
      <ul className="list-disc ml-5 space-y-2">
        <li>Arrive at class at least <strong>2 minutes early</strong>.</li>
        <li>If late, the teacher will wait up to 15 minutes.</li>
        <li>Report missing teachers to support immediately.</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6">Absences & Rescheduling</h3>
      <ul className="list-disc ml-5 space-y-2">
        <li>Excused: illness, work conflict, holidays, technical issues.</li>
        <li>Rescheduling allowed up to 2 hours before class.</li>
        <li>No refunds for missed or unexcused classes.</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6">Extended Absences</h3>
      <ul className="list-disc ml-5 space-y-2">
        <li>Up to 1 week: pay 50% to hold slot.</li>
        <li>More than 1 week: 50% for first, full for rest.</li>
      </ul>

      <h3 className="text-xl font-semibold mt-6">Conduct & Relationships</h3>
      <ul className="list-disc ml-5 space-y-2">
        <li>Professional interaction only with teachers.</li>
        <li>No sharing personal information or class outside the portal.</li>
        <li>Report teacher misconduct to <a href="mailto:support@aishaquran.com" className="text-blue-600">support@aishaquran.com</a>.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Tuition & Payments</h2>
      <ul className="list-disc ml-5 space-y-2">
        <li>Billed every 4 weeks. Payment due on invoice.</li>
        <li>Suspension after 4 days of non-payment.</li>
        <li>No refunds for missed or excused classes.</li>
        <li>Only pay through official AQA PayPal or credit card.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Class Content & Quality</h2>
      <ul className="list-disc ml-5 space-y-2">
        <li>All content is copyrighted. No reuse allowed.</li>
        <li>Some classes may be recorded for quality control.</li>
        <li>Students may not record classes.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Group & Homeschool Classes</h2>
      <ul className="list-disc ml-5 space-y-2">
        <li>Semester-based schedule only.</li>
        <li>No refunds or makeup for missed group sessions.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8">Holiday Schedule</h2>
      <p>
        Institute will be closed for:
        <ul className="list-disc ml-5 space-y-1 mt-2">
          <li><strong>Eid Ul-Fitr</strong> – 3 days</li>
          <li><strong>Eid Ul-Adha</strong> – 5 days</li>
        </ul>
        No refunds or credit for holidays. All other holidays: reschedule up to 2 lessons with 12-hour notice.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Privacy Policy</h2>
      <p>
        We do not share or sell any student information. Personal contact between students and teachers must go through our official email: 
        <a href="mailto:support@aishaquran.com" className="text-blue-600"> support@aishaquran.com</a>.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Gifts & Donations</h2>
      <p>
        Only monetary gifts are accepted and must be sent by check or money order. No physical gifts can be accepted for teachers.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Complaints</h2>
      <p>
        Contact support within 3 business days for any complaints or concerns. All issues will be addressed seriously.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Liability</h2>
      <p>
        Aisha Quran Academy is not responsible for actions taken outside of the platform or content misuse. Legal action may be taken for any unauthorized content use.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Contact</h2>
      <p>
        For all questions, reschedules, cancellations, and support:
        <br />
        📧 <a href="mailto:support@aishaquran.com" className="text-blue-600">support@aishaquran.com</a>
        <br />
        📞 +20 122 730 7646
      </p>

      <p className="mt-6 text-sm text-gray-500">
        Aisha Quran Academy reserves the right to update this policy at any time.
      </p>
    </div>
  );
};

export default TermsAndPolicyPage;
