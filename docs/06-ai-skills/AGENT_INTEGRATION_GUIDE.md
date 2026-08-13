# How to Integrate Skills with AI Agents

> Quick start guide for connecting Copilot, Gemini, Claude, and other AI agents to your skill framework.

---

## Overview

You now have a complete system to make AI agents **skill-aware**:

- **SKILLS_REGISTRY.json** - What skills exist and how to find them
- **SKILL_ROUTING_GUIDE.md** - Which skill to use when  
- **AGENT_INSTRUCTIONS.md** - How agents should behave
- **11 Skill Files** - The actual skills

Agents use these to automatically guide users through the complete development workflow.

---

## For Copilot CLI

### Setup

```bash
# 1. Find your Copilot CLI config directory
~/.copilot/

# 2. Copy AGENT_INSTRUCTIONS.md to system prompt
cat /loopdev/docs/06-ai-skills/AGENT_INSTRUCTIONS.md >> ~/.copilot/system_prompt.md

# 3. Make sure these files are accessible
# Copilot will auto-load them from /loopdev/docs/06-ai-skills/
```

### Test It

```bash
copilot "Build a Bitcoin RSI strategy"

# Expected: Copilot walks through discovery → contract → strategy → testing → governance
```

### How It Works

1. Copilot loads AGENT_INSTRUCTIONS.md from system prompt
2. User asks: "Build something"
3. Copilot loads SKILL_ROUTING_GUIDE.md to find the right workflow
4. Copilot loads SKILLS_REGISTRY.json for metadata
5. Copilot recommends first skill
6. Copilot routes the applicable 8 active skills
7. Output: Production-ready code ✅

---

## For Copilot IDE (VS Code)

### Setup

```bash
# 1. Create .copilot folder in workspace
mkdir -p /loopdev/.copilot

# 2. Copy instructions file
cp /loopdev/docs/06-ai-skills/AGENT_INSTRUCTIONS.md /loopdev/.copilot/

# 3. Update VS Code settings
# In workspace .vscode/settings.json:
{
  "github.copilot.advanced.instructions": ".copilot/AGENT_INSTRUCTIONS.md"
}
```

### Test It

```
In VS Code, press Ctrl+I (or Cmd+I on Mac)

Type: "Build a trading strategy"

Expected: Copilot walks through complete workflow
```

### How It Works

1. Copilot reads `.copilot/AGENT_INSTRUCTIONS.md` in workspace
2. Copilot has access to `/loopdev/docs/06-ai-skills/` files
3. User highlights code or writes request
4. Copilot references skills automatically
5. Generates code following skill templates

---

## For Gemini (Google AI)

### Setup

```python
# Using Google AI Python SDK

import google.generativeai as genai

# Read instructions
with open('/loopdev/docs/06-ai-skills/AGENT_INSTRUCTIONS.md') as f:
    instructions = f.read()

# Read registry
import json
with open('/loopdev/docs/06-ai-skills/SKILLS_REGISTRY.json') as f:
    registry = json.load(f)

# Read routing guide
with open('/loopdev/docs/06-ai-skills/SKILL_ROUTING_GUIDE.md') as f:
    routing = f.read()

# Configure Gemini
model = genai.GenerativeModel(
    model_name='gemini-pro',
    system_instruction=instructions,
    context={
        'skills_registry': registry,
        'routing_guide': routing
    }
)

# Use it
response = model.generate_content("Build a trading strategy")
print(response.text)
```

### Test It

```
$ python gemini_agent.py

prompt: "Build a trading strategy"

Expected: Gemini walks through all 9 skills, generating code
```

---

## For Claude (Anthropic)

### Setup

```python
import anthropic
import json

client = anthropic.Anthropic()

# Read instructions
with open('/loopdev/docs/06-ai-skills/AGENT_INSTRUCTIONS.md') as f:
    system_prompt = f.read()

# Read context files
with open('/loopdev/docs/06-ai-skills/SKILLS_REGISTRY.json') as f:
    registry = json.load(f)

with open('/loopdev/docs/06-ai-skills/SKILL_ROUTING_GUIDE.md') as f:
    routing = f.read()

# Add to system prompt
full_system = f"""{system_prompt}

---

## Available Skills Registry

{json.dumps(registry, indent=2)}

---

## Skill Routing Guide

{routing}
"""

# Use it
message = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=2048,
    system=full_system,
    messages=[
        {"role": "user", "content": "Build a trading strategy"}
    ]
)

print(message.content[0].text)
```

### Test It

```bash
$ python claude_agent.py

Expected: Claude guides through all skills, generates production code
```

---

## For ChatGPT / OpenAI

### Setup

```python
from openai import OpenAI
import json

client = OpenAI()

# Read instructions
with open('/loopdev/docs/06-ai-skills/AGENT_INSTRUCTIONS.md') as f:
    system_prompt = f.read()

# Read context
with open('/loopdev/docs/06-ai-skills/SKILLS_REGISTRY.json') as f:
    registry = json.load(f)

with open('/loopdev/docs/06-ai-skills/SKILL_ROUTING_GUIDE.md') as f:
    routing = f.read()

# Prepare context
context = f"""
## Skills Available

{json.dumps(registry, indent=2)}

## Routing Guide

{routing}
"""

# Use it
response = client.chat.completions.create(
    model="gpt-4-turbo",
    system_prompt=f"{system_prompt}\n\n{context}",
    messages=[
        {"role": "user", "content": "Build a Bitcoin RSI strategy"}
    ]
)

print(response.choices[0].message.content)
```

---

## For Custom LLM Integration

### Template

```typescript
class LoopDevAgent {
  private registry: SkillsRegistry;
  private routingGuide: string;
  private instructions: string;
  
  constructor(llmClient: LLMClient) {
    // Load files
    this.registry = loadJSON('SKILLS_REGISTRY.json');
    this.routingGuide = loadFile('SKILL_ROUTING_GUIDE.md');
    this.instructions = loadFile('AGENT_INSTRUCTIONS.md');
  }
  
  async process(userRequest: string): Promise<string> {
    // Prepare system prompt
    const systemPrompt = `
      ${this.instructions}
      
      Available skills:
      ${JSON.stringify(this.registry, null, 2)}
      
      Routing guide:
      ${this.routingGuide}
    `;
    
    // Send to LLM
    const response = await llmClient.generate({
      system: systemPrompt,
      prompt: userRequest,
      context: {
        skillFiles: this.registry.skills,
        workflows: this.registry.workflows
      }
    });
    
    return response;
  }
}

// Usage
const agent = new LoopDevAgent(myLLMClient);
const result = await agent.process("Build a trading strategy");
console.log(result);
```

---

## Verification Checklist

After integrating, verify:

### ✅ Agent Knows Skills Exist
```
You: "What skills are available?"
Agent: "I have 8 active skills organized in 3 tiers..."
```

### ✅ Agent Recommends Skills in Order
```
You: "Build a trading strategy"
Agent: "Phase 1 uses Discovery Analysis Skill
        Phase 2 uses Contract Definition Skill
        ..."
```

### ✅ Agent Shows File Paths
```
Agent: "Skill: Discovery Analysis Skill
        Path: tier-1-foundation/DISCOVERY_ANALYSIS_SKILL.md"
```

### ✅ Agent Walks Through Checklist
```
Agent: "Checklist Item 1: Do you have requirements?
        [yes/no/help]"
```

### ✅ Agent Generates Correct Output
```
Agent: "Based on the skill template:
        [Output matching skill specification]"
```

### ✅ Agent Proposes Next Skill
```
Agent: "Phase 1 complete! Ready for Phase 2?
        Next skill: Contract Definition Skill"
```

---

## Troubleshooting

### Problem: Agent doesn't know about skills

**Solution**: Make sure AGENT_INSTRUCTIONS.md is in system prompt

```
# Check that instructions are loaded
Agent should mention "8 active skills" or "3 tiers" in first response
```

### Problem: Agent recommends skills out of order

**Solution**: Agent isn't loading SKILL_ROUTING_GUIDE.md

```
# Add routing guide to context
Make sure agent can access SKILL_ROUTING_GUIDE.md
```

### Problem: Agent generates output in wrong format

**Solution**: Agent isn't reading the skill files

```
# Verify agent can access skill files
Make sure /loopdev/docs/06-ai-skills/tier-*/
files are accessible to agent
```

### Problem: Agent skips Tier 3 (governance)

**Solution**: Tier 3 is optional by default. Edit AGENT_INSTRUCTIONS.md:

```markdown
// In AGENT_INSTRUCTIONS.md, section "Tier 3: Governance"

Add: "Tier 3 skills are REQUIRED before production.
      Users cannot skip them."
```

---

## Best Practices

### ✅ Keep Instructions Updated
- When you add skills, update AGENT_INSTRUCTIONS.md
- When you change workflows, update SKILL_ROUTING_GUIDE.md
- When you change metadata, update SKILLS_REGISTRY.json

### ✅ Test After Each Change
```bash
# After updating skills:
copilot "Build a trading strategy"

# Verify output matches new skills
```

### ✅ Monitor Agent Behavior
- Track which skills agents use most
- Track where users get stuck
- Update routing guide based on patterns

### ✅ Collect Feedback
- Ask users: Did the skills help?
- Ask users: What was confusing?
- Improve based on feedback

---

## What Happens When Agent Runs

```
User: "Build a trading strategy"
  ↓
Agent loads AGENT_INSTRUCTIONS.md
  ↓
Agent loads SKILLS_REGISTRY.json
  ↓
Agent checks SKILL_ROUTING_GUIDE.md
  → Finds: trading_strategy workflow = [discovery, contract, quant-strategy, qa, backtest, arch, security, perf, release]
  ↓
Agent recommends Phase 1
  ↓
Agent loads tier-1-foundation/DISCOVERY_ANALYSIS_SKILL.md
  ↓
Agent walks through 25-item checklist
  ↓
Agent generates impact analysis output
  ↓
Agent recommends Phase 2
  ↓
[Repeat for phases 2-9]
  ↓
"✅ Your strategy is production-ready!
   All 9 skills complete.
   Ready to deploy. 🚀"
```

---

## Files You're Using

| File | Purpose | Agent Reads |
|------|---------|-----------|
| AGENT_INSTRUCTIONS.md | System prompt + behavior | Yes (first) |
| SKILLS_REGISTRY.json | Metadata + workflows | Yes (during routing) |
| SKILL_ROUTING_GUIDE.md | Decision tree | Yes (when routing) |
| Individual skill files | Actual checklists | Yes (during execution) |

---

## Summary

1. **Copy AGENT_INSTRUCTIONS.md** to your agent's system prompt
2. **Make sure agent can access** SKILLS_REGISTRY.json and skill files
3. **Test** by asking agent to build something
4. **Verify** it walks through all skills in order
5. **Deploy** and let agents guide users to production-ready code

You're now ready to let AI agents handle complete development workflows! 🚀
