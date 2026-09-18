import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const questions = [
  {
    question: 'How do I choose the right event for my team?',
    answer: 'Browse the department tracks and open an event card to check its format, team size, eligibility, and instructions before registering.',
  },
  {
    question: 'Can students from different colleges form a team?',
    answer: 'Yes, unless an event rulebook says otherwise. Add every teammate’s correct college and contact details during registration.',
  },
  {
    question: 'How is the registration fee paid?',
    answer: 'The fee is collected securely online during registration. Your final amount is shown before payment, including any applicable team-member charges.',
  },
  {
    question: 'What happens after I complete registration?',
    answer: 'You will receive a registration confirmation and ID after successful payment. Keep them ready for check-in and contact the organizers if they do not arrive.',
  },
  {
    question: 'What should we carry to the venue?',
    answer: 'Bring a valid college ID, your registration confirmation, and any equipment specifically listed in your event rules. Check the event schedule for reporting time and venue details.',
  },
];

export const FAQSection = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAFAF8] text-[#0F1115] border-b-2 border-[#0F1115]" id="faq">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-8">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-bold tracking-widest bg-[#FFCC00] text-[#0F1115] px-3 py-1 border-2 border-[#0F1115] shadow-[2px_2px_0px_#0F1115] mb-6">
          <span>FILE 05</span>
          <span>//</span>
          <span>FIELD NOTES & FAQ</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-[#0F1115] leading-[0.95]">
              Before you <span className="bg-[#FFCC00] px-2 border-2 border-[#0F1115] inline-block">deploy.</span>
            </h2>
            <p className="font-body text-base text-[#0F1115]/80 font-medium leading-relaxed border-l-3 border-[#FFCC00] pl-4 py-1 mt-6 max-w-md">
              The short version of what teams ask before they enter the arena.
            </p>
          </div>

          <Accordion type="single" collapsible className="lg:col-span-7 border-t-2 border-[#0F1115]">
            {questions.map((item, index) => (
              <AccordionItem value={`question-${index}`} key={item.question} className="border-b-2 border-[#0F1115]">
                <AccordionTrigger className="py-5 text-left font-display font-black text-base sm:text-lg uppercase hover:no-underline hover:bg-[#FFCC00] px-3 transition-colors [&[data-state=open]]:bg-[#FFCC00]">
                  <span className="flex items-start gap-3">
                    <span className="font-mono text-xs pt-1 shrink-0">0{index + 1}</span>
                    <span>{item.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="font-body text-sm text-[#0F1115]/80 leading-relaxed px-3 pb-5 pl-11">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};