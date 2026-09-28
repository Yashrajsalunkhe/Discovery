import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Brain,
  Clock,
  Image,
  Laptop,
  Lightbulb,
  Monitor,
  Palette,
  Presentation,
  Shield,
  Sparkles,
  Target,
  User,
  WandSparkles,
} from "lucide-react";

interface PromptWarsRoundsProps {
  specifications: string[];
}

const rounds = [
  {
    id: "01",
    title: "Prompt to Picture",
    subtitle: "Image Generation Challenge",
    participation: "Individual",
    duration: "10 Minutes",
    mode: "Classroom",
    level: "Easy",
    description:
      "Participants receive a simple theme or topic from the organizers and use prompt engineering to create an image with a permitted AI image-generation tool.",
    icon: Image,
    accentColor: "#ec4899",
    bgColor: "#ec489910",
    tasks: [
      "Understand the given topic.",
      "Write a suitable image-generation prompt.",
      "Generate the image using a permitted AI image generator.",
      "Take a mobile screenshot showing the prompt and generated output.",
      "Submit the screenshot through the official submission link before the timer ends.",
    ],
  },
  {
    id: "02",
    title: "Scenario Sprint",
    subtitle: "Situation-Based Prompting",
    participation: "Individual",
    duration: "10 Minutes",
    mode: "Computer Lab",
    level: "Intermediate",
    description:
      "Each participant randomly receives a scenario chit describing a situation in approximately 15 words. They must turn it into a clear prompt and generate a relevant AI output.",
    icon: WandSparkles,
    accentColor: "#06b6d4",
    bgColor: "#06b6d410",
    tasks: [
      "Read and understand the randomly assigned scenario.",
      "Convert the scenario into an effective prompt.",
      "Generate the required output using a permitted AI tool.",
      "Refine the prompt if necessary within the allotted time.",
      "Submit the final prompt and output before the deadline.",
    ],
  },
  {
    id: "03",
    title: "Prompt to Product",
    subtitle: "AI-Assisted Development Finale",
    participation: "Individual",
    duration: "20–30 Minutes",
    mode: "Computer Lab",
    level: "Advanced / Final Round",
    description:
      "Participants transform a product requirement or problem statement into a working digital prototype using an AI-assisted development tool and iterative prompts.",
    icon: Laptop,
    accentColor: "#f97316",
    bgColor: "#f9731610",
    tasks: [
      "Understand the assigned product requirement.",
      "Write prompts to instruct an AI coding or development tool.",
      "Generate and refine the product using iterative prompts.",
      "Create a functional prototype containing the required features.",
      "Present or demonstrate the final product when requested by the judges.",
    ],
  },
];

export const PromptWarsRounds = ({ specifications: _specifications }: PromptWarsRoundsProps) => (
  <div className="codemania-rounds space-y-5">
    <div className="codemania-tagline">
      <span className="codemania-tagline-text">Imagine</span>
      <span className="codemania-tagline-dot">•</span>
      <span className="codemania-tagline-text">Prompt</span>
      <span className="codemania-tagline-dot">•</span>
      <span className="codemania-tagline-text">Create</span>
    </div>

    <div className="codemania-flow">
      {rounds.map((round, index) => {
        const IconComponent = round.icon;
        return (
          <div key={round.id} className="contents">
            <div className="codemania-flow-step" style={{ "--step-color": round.accentColor } as React.CSSProperties}>
              <div className="codemania-flow-icon"><IconComponent className="h-4 w-4" /></div>
              <div className="codemania-flow-info">
                <span className="codemania-flow-title">{round.title}</span>
                <Badge className="codemania-flow-badge"><User className="h-2.5 w-2.5" />Individual</Badge>
              </div>
            </div>
            {index < rounds.length - 1 && <div className="codemania-flow-arrow"><ArrowRight className="h-4 w-4" /></div>}
          </div>
        );
      })}
    </div>

    {rounds.map((round, index) => {
      const IconComponent = round.icon;
      return (
        <div key={round.id} className="codemania-round" style={{ "--round-color": round.accentColor } as React.CSSProperties}>
          {index < rounds.length - 1 && <div className="codemania-timeline-connector" />}
          <div className="codemania-timeline-dot"><span>{round.id}</span></div>
          <div className="codemania-round-card">
            <div className="codemania-round-header">
              <div className="codemania-round-header-left">
                <div className="codemania-round-icon" style={{ background: round.bgColor }}><IconComponent className="h-5 w-5" style={{ color: round.accentColor }} /></div>
                <div>
                  <h3 className="codemania-round-title">Round {round.id} — {round.title}</h3>
                  <p className="codemania-round-subtitle">{round.subtitle}</p>
                </div>
              </div>
              <div className="codemania-round-header-right">
                <Badge className="codemania-meta-badge"><Clock className="h-3 w-3" />{round.duration}</Badge>
                <Badge className="codemania-meta-badge"><User className="h-3 w-3" />{round.participation}</Badge>
              </div>
            </div>

            <div className="codemania-round-body codemania-round-body-open">
              <div className="codemania-round-body-inner">
                <p className="codemania-description">{round.description}</p>
                <div className="codemania-format-row">
                  <div className="codemania-format-pill"><Monitor className="h-3.5 w-3.5" />{round.mode}</div>
                  <div className="codemania-format-pill"><Sparkles className="h-3.5 w-3.5" />Level: {round.level}</div>
                </div>
                <div className="codemania-section">
                  <h4 className="codemania-section-title"><Target className="h-4 w-4" />Participant Tasks</h4>
                  <ul className="codemania-rule-list">{round.tasks.map((task) => <li key={task}>{task}</li>)}</ul>
                </div>
                <div className="codemania-selection-area">
                  <div className="codemania-selection-box"><ArrowRight className="h-4 w-4" style={{ color: round.accentColor }} /><span>Submit all required work before the timer ends.</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}

    <div className="codemania-round-card">
      <div className="codemania-round-body codemania-round-body-open">
        <div className="codemania-round-body-inner">
          <div className="codemania-section">
            <h4 className="codemania-section-title"><Brain className="h-4 w-4" />Event Objective</h4>
            <p className="codemania-description">Prompt Wars develops participants&apos; ability to communicate effectively with Generative AI, solve problems through prompt engineering, think creatively, and transform natural-language instructions into useful digital products.</p>
          </div>
          <div className="codemania-format-row">
            <div className="codemania-format-pill"><Lightbulb className="h-3.5 w-3.5" />Prompt engineering</div>
            <div className="codemania-format-pill"><Palette className="h-3.5 w-3.5" />Creativity & problem-solving</div>
            <div className="codemania-format-pill"><Presentation className="h-3.5 w-3.5" />AI-assisted development</div>
          </div>
          <div className="codemania-section">
            <h4 className="codemania-section-title"><Shield className="h-4 w-4" />Overall Submission Rules</h4>
            <ul className="codemania-rule-list">
              <li>Use only the AI tools permitted or announced by the organizers.</li>
              <li>Submit the exact prompt and generated output through the official submission method.</li>
              <li>All work must be completed within the time allotted for the active round.</li>
              <li>Judges&apos; decisions regarding the final product and demonstration are final.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);