import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Code,
  Map,
  Gavel,
  Users,
  User,
  Coins,
  Bug,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Lightbulb,
} from "lucide-react";

interface CodingCompetitionRoundsProps {
  specifications: string[];
}

export const CodingCompetitionRounds = ({ specifications: _specifications }: CodingCompetitionRoundsProps) => {

  const rounds = [
    {
      id: "01",
      title: "Code Quest",
      subtitle: "MCQ Round",
      participation: "Individual",
      duration: "30 Minutes",
      description:
        "Online or written MCQ test covering programming fundamentals, data structures, algorithms, output prediction, logic & aptitude, basic DBMS/OS/networking, and tech general knowledge.",
      languages: ["C", "C++", "Java", "Python"],
      icon: Code,
      accentColor: "#3b82f6",
      bgColor: "#3b82f610",
      format: {
        questions: "30 multiple-choice questions",
        mode: "Online or written (as announced)",
      },
      scoring: [
        { label: "Correct answer", value: "+1", positive: true },
        { label: "Wrong answer", value: "−0.25", positive: false },
        { label: "Unattempted", value: "0", positive: null },
      ],
      rules: [
        "Each question has exactly one correct option.",
        "Mobile phones, smartwatches, notes, books and internet use are strictly prohibited.",
        "Calculators are not allowed unless announced.",
        "Discussing answers or copying leads to immediate disqualification.",
        "The test auto-submits (or papers are collected) when time ends.",
        "Rough sheets will be provided and must be returned.",
      ],
      selection: "Top 24 participants (or top 25%) qualify for Round 2.",
      tieBreaker:
        "(1) Fewer wrong answers → (2) Less time taken → (3) Sudden-death question set",
    },
    {
      id: "02",
      title: "Code Treasure Hunt",
      subtitle: "Team Clue Hunt",
      participation: "Teams of 3–4",
      duration: "60 Minutes",
      description:
        "Qualified participants are divided into teams of 3–4 via random draw. Teams navigate checkpoint stations, solving output prediction, cipher/pattern decoding, algorithm problems, and code-completion clues to find the final treasure.",
      icon: Map,
      accentColor: "#10b981",
      bgColor: "#10b98110",
      format: {
        questions: "5–6 checkpoint stations across the venue",
        mode: "Physical clue-based puzzle hunt",
      },
      scoring: [
        { label: "Each checkpoint cleared", value: "+10 pts", positive: true },
        { label: "Finishing bonus (1st / 2nd / 3rd)", value: "+20 / +15 / +10", positive: true },
        { label: "Wrong answer at checkpoint", value: "−2 pts each", positive: false },
        { label: "Hint request (max 2 total)", value: "−5 pts each", positive: false },
        { label: "Final treasure correct", value: "+20 pts", positive: true },
      ],
      rules: [
        "All team members must stay together between checkpoints.",
        "Clues must be solved in order — no skipping.",
        "Maximum 2 hints per team in the entire round.",
        "Internet, AI tools, phones strictly prohibited.",
        "Do not share, hide, or tamper with clues.",
        "No running inside the building.",
        "Do not follow other teams to checkpoints.",
        "Checkpoint volunteer's decision is final.",
      ],
      selection: "Top 4 teams qualify → all members advance individually (~12–16 finalists).",
      tieBreaker:
        "Team that reached its furthest checkpoint first.",
    },
    {
      id: "03",
      title: "Code Auction & Debug",
      subtitle: "Bid & Debug",
      participation: "Individual",
      duration: "~70 Minutes",
      description:
        "Participants bid for buggy code snippets using 1000 virtual CodeCoins. Once a lot is won, the participant must debug it correctly to earn points. Smart bidding and strong debugging decide the winner.",
      icon: Gavel,
      accentColor: "#f59e0b",
      bgColor: "#f59e0b10",
      format: {
        questions: "8–10 buggy code snippets auctioned",
        mode: "Auction (~25 min) → Debugging (~45 min)",
      },
      auctionTable: [
        { difficulty: "Easy", basePrice: "50 CC", points: "100 pts", diffColor: "#10b981" },
        { difficulty: "Medium", basePrice: "100 CC", points: "200 pts", diffColor: "#f59e0b" },
        { difficulty: "Hard", basePrice: "150 CC", points: "350 pts", diffColor: "#ef4444" },
      ],
      auctionRules: [
        "Highest bidder wins when auctioneer says 'Sold!'",
        "Minimum bid increment: 10 CC",
        "Bids cannot be withdrawn once placed",
        "Cannot bid more than remaining balance",
        "Must buy min 2, max 4 lots",
        "Unsold lots are discarded",
        "Unspent CC → 1 point per 2 CC bonus",
        "Collusion or fake bidding → disqualification",
        "May include a Mystery Lot with surprise twist",
      ],
      debugRules: [
        "Receive full code of only lots you won",
        "Fix all bugs: syntax, logic, runtime, wrong output, edge cases",
        "Must use the snippet's language — no rewriting from scratch",
        "Internet, AI tools, external code prohibited",
        "Correct only if all test cases pass",
        "Max 3 submissions per lot — wrong ones after 1st deduct 10%",
        "Failed lots: 0 points, CC not refunded",
      ],
      partialCredit: [
        { condition: "All test cases passed", award: "100%", color: "#10b981" },
        { condition: "More than half passed", award: "50%", color: "#f59e0b" },
        { condition: "Half or fewer passed", award: "0%", color: "#ef4444" },
      ],
      scoring: [],
      rules: [],
      selection: "",
      tieBreaker:
        "(1) Higher Hard lot points → (2) Less debugging time → (3) Sudden-death debug question",
    },
  ];



  return (
    <div className="codemania-rounds space-y-5">

      {/* ─── Tagline Banner ─── */}
      <div className="codemania-tagline">
        <span className="codemania-tagline-text">Think</span>
        <span className="codemania-tagline-dot">•</span>
        <span className="codemania-tagline-text">Solve</span>
        <span className="codemania-tagline-dot">•</span>
        <span className="codemania-tagline-text">Conquer</span>
      </div>

      {/* ─── Progression Flow ─── */}
      <div className="codemania-flow">
        <div className="codemania-flow-step" style={{ "--step-color": "#3b82f6" } as React.CSSProperties}>
          <div className="codemania-flow-icon">
            <Code className="h-4 w-4" />
          </div>
          <div className="codemania-flow-info">
            <span className="codemania-flow-title">Code Quest</span>
            <Badge className="codemania-flow-badge">
              <User className="h-2.5 w-2.5" />
              Individual
            </Badge>
          </div>
        </div>
        <div className="codemania-flow-arrow">
          <ArrowRight className="h-4 w-4" />
        </div>
        <div className="codemania-flow-step" style={{ "--step-color": "#10b981" } as React.CSSProperties}>
          <div className="codemania-flow-icon">
            <Map className="h-4 w-4" />
          </div>
          <div className="codemania-flow-info">
            <span className="codemania-flow-title">Treasure Hunt</span>
            <Badge className="codemania-flow-badge">
              <Users className="h-2.5 w-2.5" />
              Teams
            </Badge>
          </div>
        </div>
        <div className="codemania-flow-arrow">
          <ArrowRight className="h-4 w-4" />
        </div>
        <div className="codemania-flow-step" style={{ "--step-color": "#f59e0b" } as React.CSSProperties}>
          <div className="codemania-flow-icon">
            <Gavel className="h-4 w-4" />
          </div>
          <div className="codemania-flow-info">
            <span className="codemania-flow-title">Auction & Debug</span>
            <Badge className="codemania-flow-badge">
              <User className="h-2.5 w-2.5" />
              Individual
            </Badge>
          </div>
        </div>
      </div>

      {/* ─── Round Cards ─── */}
      {rounds.map((round, index) => {
        const IconComponent = round.icon;
        return (
          <div
            key={round.id}
            className="codemania-round"
            style={{ "--round-color": round.accentColor } as React.CSSProperties}
          >
            {/* Connecting timeline line */}
            {index < rounds.length - 1 && (
              <div className="codemania-timeline-connector" />
            )}

            {/* Timeline dot */}
            <div className="codemania-timeline-dot">
              <span>{round.id}</span>
            </div>

            {/* Round content */}
            <div className="codemania-round-card">
              {/* Round header */}
              <div className="codemania-round-header">
                <div className="codemania-round-header-left">
                  <div className="codemania-round-icon" style={{ background: round.bgColor }}>
                    <IconComponent className="h-5 w-5" style={{ color: round.accentColor }} />
                  </div>
                  <div>
                    <h3 className="codemania-round-title">
                      Round {round.id} — {round.title}
                    </h3>
                    <p className="codemania-round-subtitle">{round.subtitle}</p>
                  </div>
                </div>
                <div className="codemania-round-header-right">
                  <Badge className="codemania-meta-badge">
                    <Clock className="h-3 w-3" />
                    {round.duration}
                  </Badge>
                  <Badge className="codemania-meta-badge">
                    {round.participation.includes("Team") ? (
                      <Users className="h-3 w-3" />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                    {round.participation}
                  </Badge>
                </div>
              </div>

              {/* Round body — always visible */}
              <div className="codemania-round-body codemania-round-body-open">
                <div className="codemania-round-body-inner">
                  {/* Description */}
                  <p className="codemania-description">{round.description}</p>

                  {/* Language tags (Round 1) */}
                  {"languages" in round && round.languages && (
                    <div className="codemania-lang-row">
                      <Zap className="h-3.5 w-3.5" style={{ color: round.accentColor }} />
                      <span className="codemania-lang-label">Languages:</span>
                      {round.languages.map((lang) => (
                        <span key={lang} className="codemania-lang-tag">{lang}</span>
                      ))}
                    </div>
                  )}

                  {/* Format pills */}
                  <div className="codemania-format-row">
                    <div className="codemania-format-pill">
                      <Lightbulb className="h-3.5 w-3.5" />
                      {round.format.questions}
                    </div>
                    <div className="codemania-format-pill">
                      <Shield className="h-3.5 w-3.5" />
                      {round.format.mode}
                    </div>
                  </div>

                  {/* ── Auction Table (Round 3) ── */}
                  {"auctionTable" in round && round.auctionTable && (
                    <div className="codemania-section">
                      <h4 className="codemania-section-title">
                        <Coins className="h-4 w-4" />
                        Lot Pricing & Rewards
                      </h4>
                      <div className="codemania-auction-table">
                        <div className="codemania-auction-header">
                          <span>Difficulty</span>
                          <span>Base Price</span>
                          <span>Points on Debug</span>
                        </div>
                        {round.auctionTable.map((row, i) => (
                          <div key={i} className="codemania-auction-row">
                            <span className="codemania-auction-diff">
                              <span
                                className="codemania-diff-dot"
                                style={{ background: row.diffColor }}
                              />
                              {row.difficulty}
                            </span>
                            <span className="codemania-auction-price">{row.basePrice}</span>
                            <span className="codemania-auction-points">{row.points}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Auction Rules (Round 3) ── */}
                  {"auctionRules" in round && round.auctionRules && (
                    <div className="codemania-section">
                      <h4 className="codemania-section-title">
                        <Gavel className="h-4 w-4" />
                        Auction Rules
                      </h4>
                      <ul className="codemania-rule-list">
                        {round.auctionRules.map((rule, i) => (
                          <li key={i}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ── Debug Rules (Round 3) ── */}
                  {"debugRules" in round && round.debugRules && (
                    <div className="codemania-section">
                      <h4 className="codemania-section-title">
                        <Bug className="h-4 w-4" />
                        Debugging Phase
                      </h4>
                      <ul className="codemania-rule-list">
                        {round.debugRules.map((rule, i) => (
                          <li key={i}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ── Partial Credit (Round 3) ── */}
                  {"partialCredit" in round && round.partialCredit && (
                    <div className="codemania-section">
                      <h4 className="codemania-section-title">
                        <CheckCircle className="h-4 w-4" />
                        Partial Credit (per lot)
                      </h4>
                      <div className="codemania-score-grid">
                        {round.partialCredit.map((item, i) => (
                          <div key={i} className="codemania-score-item">
                            <span className="codemania-score-label">{item.condition}</span>
                            <span
                              className="codemania-score-value"
                              style={{ color: item.color, borderColor: item.color }}
                            >
                              {item.award}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Round-specific rules ── */}
                  {round.rules && round.rules.length > 0 && (
                    <div className="codemania-section">
                      <h4 className="codemania-section-title">
                        <Shield className="h-4 w-4" />
                        Round Rules
                      </h4>
                      <ul className="codemania-rule-list">
                        {round.rules.map((rule, i) => (
                          <li key={i}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* ── Selection & Tie-breaker ── */}
                  <div className="codemania-selection-area">
                    {round.selection && (
                      <div className="codemania-selection-box">
                        <ArrowRight className="h-4 w-4" style={{ color: round.accentColor }} />
                        <span>{round.selection}</span>
                      </div>
                    )}
                    {round.tieBreaker && (
                      <p className="codemania-tiebreaker">
                        <strong>Tie-breaker:</strong> {round.tieBreaker}
                      </p>
                    )}
                  </div>

                  {/* ── Final Score Formula (Round 3) ── */}
                  {"auctionTable" in round && (
                    <div className="codemania-formula">
                      <span className="codemania-formula-label">Final Score</span>
                      <code className="codemania-formula-code">
                        Debug Points + Unspent CC Bonus − Penalties
                      </code>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}


    </div>
  );
};
