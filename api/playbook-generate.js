const RULES = [
  { id: "destination", number: 1, name: "Start at the End", principle: "Show the destination and create emotional resonance. People can't move toward something they can't picture \u2014 and they won't move toward something they don't feel.", promptHint: "Generate actions to help this manager paint a vivid, concrete destination for their team's AI adoption \u2014 and connect it to something the team actually cares about. The destination must be specific ('by June, we generate first drafts in 10 minutes instead of 2 hours') not vague ('we're adopting AI'). Critically, the manager must try AI first themselves before asking anyone else to \u2014 if they haven't used it yet, that's action #1. Help them explain the 'why' in local terms (what this means for this specific team's daily work, not 'the CEO said so'), and find the emotional angle that resonates with their people: easier work, better customer outcomes, professional growth, not being left behind \u2014 whatever fits. Passion sustains change longer than fear." },
  { id: "safe", number: 2, name: "Make It Safe", principle: "People won't try what they can't afford to fail at. Protect the stumbling, respect the loss, and celebrate experiments.", promptHint: "Generate actions that address three dimensions of safety: (1) Go first and show mistakes \u2014 the manager shares their own fumbling attempts ('here's what I tried, here's where I got stuck, here's what finally worked') to give permission to struggle. A single leader demo can nearly double adoption. (2) Acknowledge what's being lost \u2014 the old way had real value (speed, familiarity, expertise, identity). Losses are psychologically weighted at roughly twice the value of gains, so naming them must come before selling AI's benefits. Include direct conversations (1:1s, not town halls) where people feel heard. (3) Don't punish early failure \u2014 when someone tries and it doesn't work, respond with 'what did you learn?' not 'why didn't that work?' Include actions for asking and actually listening, and celebrating both wins and losses from AI experiments publicly." },
  { id: "script", number: 3, name: "Script the Steps", principle: "Don't ask people to \"embrace change.\" Tell them what to do on Monday morning.", promptHint: "Generate actions that give people specific, concrete instructions rather than inspirational mandates. Not 'start using AI' but 'tomorrow, take one email thread and ask AI to summarize it \u2014 just one.' Help the manager: (1) Find the bright spots \u2014 someone on the team has probably figured something out already. Find that person, learn exactly what they do, and help them show others. (2) Remove friction \u2014 when someone says 'I would, but...' fix that specific blocker (access issue, time issue, skill issue). (3) Make the new way the easy way \u2014 embed AI into what people already do rather than adding it on top. Defaults beat willpower: look for where AI can become the path of least resistance in existing workflows, templates, tools, and standard operating procedures." },
  { id: "small", number: 4, name: "Start Small, to go Big", principle: "Begin contained, expand with proof.", promptHint: "Generate actions to help this manager start with one focused experiment \u2014 not five things at once. Key principles: (1) Pick one use case, one team, one workflow and nail it before expanding. (2) Start with people who want to try it \u2014 don't waste energy converting skeptics first; let enthusiasts succeed, then use those successes to bring along the middle. (3) Set clear 'expand when' criteria upfront \u2014 specific markers of success, not vague feelings. (4) Protect the pilot from pressure to scale too fast \u2014 when leadership asks 'why aren't we doing this everywhere?' hold the line until the pilot actually works. Each small win should explicitly set up the next, slightly bigger experiment \u2014 help them see a 3-step sequence, not just an isolated first step." },
  { id: "visible", number: 5, name: "Make Progress Visible", principle: "Communicate relentlessly. Show wins. Sustain the narrative.", promptHint: "Generate actions to make progress visible and sustain momentum through communication. Most change efforts under-communicate by 10x or more \u2014 progress that isn't visible doesn't build momentum, convert skeptics, or sustain energy. Help the manager: (1) Share what's working \u2014 when someone figures something out, don't let it stay private ('Sarah found a way to do X \u2014 I asked her to show the team Thursday'). (2) Talk about it regularly \u2014 not one announcement and done, but in team meetings, 1:1s, casual conversation. Keep the change visible by simply mentioning it. (3) Connect progress to outcomes people care about \u2014 not 'adoption is at 60%' but 'the team saved 12 hours last week' or 'we got the proposal out a day early.' (4) Follow up \u2014 if they said they'd find an answer, come back with it. If they asked someone to try something, ask how it went." },
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { intake, starredPrimitives } = req.body;
  if (!intake) {
    return res.status(400).json({ error: "Missing intake data" });
  }

  const rulesBlock = RULES.map(
    (r) => `Rule ${r.number} (id: "${r.id}"): ${r.name}\nPrinciple: "${r.principle}"\n${r.promptHint}`
  ).join("\n\n");

  const starredBlock = starredPrimitives && starredPrimitives.length > 0
    ? `\n\nSTARRED AI USE CASES (the manager chose these as most important):\n${starredPrimitives.map((p) => `- ${p.category}: ${p.text}`).join("\n")}\n\nIMPORTANT: Reference these specific AI use cases in your actions where natural. For example, if they starred a content creation idea, Rule 3 (Script the Steps) actions should mention that specific use case as a concrete starting point. Make the playbook connect to the AI use cases they actually care about.`
    : "";

  const prompt = `You are a practical leadership coach helping a manager create a personalized AI change playbook. You generate specific, actionable steps grounded in behavioral science \u2014 not generic corporate advice.

KEY PRINCIPLES THAT GUIDE EVERYTHING YOU GENERATE:
- 80% of AI projects fail, and the root cause is almost never technology \u2014 it's unaddressed human resistance, missing psychological safety, and poor change management.
- People can't move toward what they can't picture, and won't move toward what they don't feel. A vivid destination combined with emotional resonance is what drives action.
- People won't try what they can't afford to fail at (Edmondson). Psychological safety is the prerequisite for learning. Losses weigh roughly twice as heavily as gains (Kahneman) \u2014 name what people are losing before selling what they'll gain.
- Behavior change requires specific instructions, not inspiration (Heath brothers). Defaults beat willpower (Thaler/Sunstein). Find bright spots and replicate them.
- Small wins build patterns that attract allies (Weick). Begin contained, expand with proof \u2014 not all at once.
- Progress that isn't visible doesn't build momentum, convert skeptics, or sustain energy. Most change efforts under-communicate by 10x (Kotter).

CONTEXT \u2014 THIS SPECIFIC PERSON:
- Role & team: ${intake.role}
- Manager's AI fluency: ${intake.managerFluency}
- Team's AI fluency: ${intake.teamFluency}
- What would make AI adoption fail: ${intake.failureRisks}
- 90-day success vision: ${intake.successVision}${starredBlock}

IMPORTANT CONTEXT SIGNALS TO PAY ATTENTION TO:
- The gap between manager fluency and team fluency is critical. A Transformative manager with a Not Yet Started team needs to slow down and build safety. A Capable manager with a Capable team needs momentum and scripted steps.
- If the manager is "Not yet started," their own AI learning is action #1 in Rule 1 (Start at the End) \u2014 they must try it first before asking anyone else to.
- If the failure risks mention senior people resisting, prioritize Rule 2 (Make It Safe) \u2014 especially acknowledging losses and creating space for honest conversation.
- If the failure risks mention previous failed attempts, prioritize Rule 4 (Start Small) and Rule 5 (Make Progress Visible) \u2014 smaller scope, more communication.
- If the 90-day vision is ambitious (e.g., "AI embedded in every workflow"), the plan needs concrete phasing via Rule 3 (Script the Steps) and Rule 4 (Start Small). If it's modest (e.g., "a few experiments"), match that energy.
- All participants work in SaaS companies. Tailor examples and actions to SaaS contexts \u2014 product teams, customer success, engineering, marketing, sales, support.

TASK:
For each rule below, generate 2-3 actions that are:
- Specific to THIS person's role, team, and situation \u2014 not interchangeable with someone else's plan
- Under 25 words each \u2014 concise and punchy, no filler
- Concrete enough to start this week (verbs like "schedule," "ask," "send," "create," "announce" \u2014 never "consider," "think about," "explore the idea of")
- Sensitive to their fluency levels (don't suggest advanced moves for not-yet-started teams, don't suggest basics for transformative teams)
- Sensitive to their failure risks (if people fear job loss, don't generate actions that ignore that fear)
- Connected across rules where natural (e.g., a small experiment from Rule 4 might connect to making progress visible in Rule 5)

QUALITY CHECK \u2014 BEFORE RETURNING, VERIFY EACH ACTION:
1. Could this action belong to anyone, or is it specific to this person? (If anyone's, rewrite it.)
2. Does it start with a concrete verb? (If not, rewrite it.)
3. Is it under 25 words? (If not, tighten it \u2014 cut every unnecessary word.)
4. Would this person know exactly what to do Monday morning? (If not, make it more specific.)

RULES:
${rulesBlock}

Respond with ONLY a JSON object (no markdown, no explanation):
{"plan":{"destination":["action 1","action 2"],"safe":["action 1","action 2"],"script":["action 1","action 2"],"small":["action 1","action 2"],"visible":["action 1","action 2"]}}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Claude API error:", response.status, errText);
      return res.status(502).json({ error: `Claude API returned ${response.status}` });
    }

    const data = await response.json();
    const raw = data.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const plan = JSON.parse(raw.replace(/```json|```/g, "").trim()).plan;
    return res.status(200).json({ plan });
  } catch (err) {
    console.error("Generation error:", err);
    return res.status(500).json({ error: "Failed to generate plan" });
  }
}
