import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "How do I register for events at Discovery 2K26?",
      answer: "You can register directly on this website by clicking the 'Register Now' button. You can choose to register as an individual (solo) or as a team leader for multi-member events. Registration takes under 3 minutes.",
      category: "Registration",
    },
    {
      question: "Can students from any college or university participate?",
      answer: "Yes! Discovery 2K26 is a national-level technical festival. Students from diploma, undergraduate, and postgraduate programs of any recognized university or college across India are eligible.",
      category: "Eligibility",
    },
    {
      question: "What is the entry fee structure?",
      answer: "Entry fees are nominal (starting from ₹100 per participant depending on the event). The exact fee breakdown per team member is automatically calculated during registration before payment.",
      category: "Fees & Payment",
    },
    {
      question: "Will all participants receive certificates?",
      answer: "Yes, 100% of registered participants who attend and participate in their respective event rounds will receive an official, verifiable Certificate of Participation from ADCET Ashta.",
      category: "Certificates",
    },
    {
      question: "When and how are cash prizes distributed?",
      answer: "Cash prizes totaling ₹1.5 Lakhs+ along with official trophies are awarded directly during the Grand Valedictory Ceremony at 05:00 PM on the day of the event.",
      category: "Prizes",
    },
    {
      question: "Can I participate in multiple events?",
      answer: "Yes, as long as the event schedules do not overlap. The 1-day itinerary is structured to allow participants to compete in morning preliminary tracks and afternoon presentations.",
      category: "Rules",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section bg-[#F6F8F5] border-b border-[#E6E6E6]" id="faq">
      <div className="wrap">
        
        {/* Header Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1F5EE] border border-[#BAC8B1] text-[#404E3B] font-mono text-xs font-bold tracking-wide w-fit mb-4">
          <span className="w-2 h-2 rounded-full bg-[#7B9669]" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="section-title text-[#404E3B]">Everything You Need to Know</h2>
            <p className="text-[#2E382A] text-base max-w-[560px] mt-2">
              Have questions about team limits, certificates, fees, or event day guidelines? Find quick answers below.
            </p>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-[900px] space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="jade-card overflow-hidden transition-all duration-300 border-[#E6E6E6]"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-display font-extrabold text-lg sm:text-xl text-[#404E3B] hover:text-[#7B9669] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#7B9669] bg-[#F1F5EE] border border-[#BAC8B1] px-2.5 py-1 rounded-md">
                      0{index + 1}
                    </span>
                    {faq.question}
                  </span>
                  <span className={`w-8 h-8 rounded-full bg-[#F1F5EE] border border-[#BAC8B1] flex items-center justify-center text-sm font-bold text-[#404E3B] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#7B9669] text-white' : ''}`}>
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-[#2E382A] text-base leading-relaxed border-t border-[#E6E6E6] pt-4 bg-[#F9FBF8]">
                    <p>{faq.answer}</p>
                    <div className="mt-3 inline-block font-mono text-xs font-semibold text-[#6C8480] bg-[#EEF2EB] px-3 py-1 rounded-full">
                      Category: {faq.category}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
