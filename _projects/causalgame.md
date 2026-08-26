---
layout: page
title: CausalGame
description: Benchmarking causal thinking of LLM agents through interactive scientific-discovery games
img: assets/img/projects/causalgame/overview.png
importance: 2
category: Academic Research
related_publications: true
homepage_feature: true
feature_key: causalgame
feature_weight: 2
---

**Zhenhao Chen · Yongqiang Chen · Chenxi Liu · Junchi Yu · Xiangchen Song · Zijian Li · Jialin Li · Philip Torr · Bo Han · Kun Zhang**<br>
*International Conference on Machine Learning (ICML), 2026 - Oral Presentation* {% cite chencausalgame2026 %}

[Project website](https://causalgame.github.io/) · [Paper](https://arxiv.org/abs/2607.04293) · [Code](https://github.com/CausalGame/CausalGame) · [Game](https://causalgame.github.io/game/) · [Leaderboard](https://causalgame.github.io/leaderboard/)

Large language models can automate many parts of research, but scientific discovery requires more than executing a workflow. An AI Scientist must distinguish correlation from causation, recognize when observations are biased, and choose interventions that reveal the mechanism behind an outcome.

**CausalGame** is an interactive benchmark for testing exactly this capability. It places an LLM agent inside a drone-design game governed by a hidden structural causal model (SCM). The agent must use a limited experimental budget to discover what truly determines survival, then submit a final design and explain the mechanism it believes it has found.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/causalgame/overview.png" title="Correlation versus causal intervention" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Observational correlations can be misleading under hidden confounding and selection. A causal agent actively tests the mechanism instead of treating the observed trend as fact.
</div>

## Why evaluate causal thinking?

Existing AI Scientist benchmarks often measure whether an agent can search, code, analyze data, or complete a research pipeline. These are necessary skills, but they do not establish that the agent understands how a system changes under intervention.

CausalGame adds the ingredients that make real scientific evidence difficult to interpret:

- **Selection bias**, where only a filtered subset of outcomes is observed.
- **Measurement error**, where the visible variable is a noisy proxy for the mechanism.
- **Hidden confounding**, where an unobserved variable creates a spurious relationship.
- **Local optima and environment shifts**, which test whether a conclusion survives beyond the exploration sample.

Every scenario is generated from a known SCM. This gives the evaluator access to the true mechanism and an analytical optimum, making it possible to separate genuine causal discovery from trial-and-error or luck.

## How the benchmark works

The agent allocates defense values across seven drone components: engine, wing, body, cockpit, antenna, camera, and gun. Its goal is to maximize survival in an unknown environment.

| Stage | Protocol |
|:--|:--|
| Exploration | A budget of 200 drones and at most 10 deployments, with partial observational feedback |
| Final evaluation | One committed design evaluated on a fleet of 1,000 drones |
| Explanation | A natural-language report describing the evidence, intervention, and inferred mechanism |
| Ground truth | A scenario-specific SCM, win threshold, and analytically derived optimal intervention |

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/causalgame/pipeline.png" title="The CausalGame benchmark pipeline" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The agent starts from survivor-censored history, performs interventions in the environment, and finishes with a one-shot design and reflection report.
</div>

The public benchmark contains **14 scenarios** across three families: Antenna Trap, Deployment Zone Trap, and Weather. It supports single-turn prompting, multi-turn ReAct-style agent execution, and an OpenCode coding-agent harness.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/causalgame/scenarios.jpg" title="Antenna Trap and Deployment Zone Trap scenarios" alt="Illustrations of the Antenna Trap and Deployment Zone Trap causal scenarios" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>
<div class="caption">
    The Antenna Trap rewards reducing detectability, while the Deployment Zone Trap asks the agent to distinguish a hidden interference mechanism from its visible altitude proxy.
</div>

## Representative causal traps

### Antenna Trap

The historical record suggests that drones with better-protected antennas survive more often. The apparent relationship is created by survivorship selection. In the hidden mechanism, a destroyed antenna stops emitting a detectable signal, reducing the chance of an enemy attack. A successful agent must test low antenna defense rather than reinforce the observed correlation.

### Deployment Zone Trap

Low-altitude flight appears to predict mission failure, but altitude is only a visible proxy. A hidden electromagnetic-interference zone affects both altitude and communication failure. The correct strategy protects the signal path rather than spending resources on a response to altitude itself.

These scenarios are configurable SCMs rather than hand-written riddles. By modifying graph structure, parameters, noise, and observation rules, the benchmark can generate new environments with controlled causal difficulty.

## Main results

The paper evaluates **30 frontier LLM agents** in prompting and agentic settings. None reliably clears the benchmark's win thresholds. The strongest agentic result reaches **68.0% average survival**, compared with a 75% win threshold and analytical optima of roughly **78-85%** across scenario families.

<div class="row">
    <div class="col-md-6 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/causalgame/selection-bias.png" title="Survival under selection bias" alt="Prompting and agent-style survival rates for 30 LLMs under selection bias" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
    <div class="col-md-6 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/causalgame/hidden-confounders.png" title="Survival under hidden confounding" alt="Prompting and agent-style survival rates for 30 LLMs under hidden confounding" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>
<div class="caption">
    Prompting and multi-turn agentic execution remain below the winning and optimal reference lines under both selection bias and hidden confounding.
</div>

The evaluation combines survival with fine-grained report rubrics covering causal reasoning, experimental design, reflection quality, and data usage. The central observations are:

- **High survival does not imply understanding.** Only about 5-7% of sessions receive credit for causal reasoning, even when some trajectories find a useful design.
- **Causal reasoning is the dimension that predicts generalization.** Causally aware trajectories avoid the exploration-to-evaluation degradation seen in other sessions.
- **More inference-time reasoning is not consistently better.** Larger reasoning budgets do not reliably improve mechanism identification.
- **Agentic scaffolding helps, but is not sufficient.** OpenCode raises survival by an average of 6.9 percentage points over ReAct on five tested models, yet remains below the win threshold.

<div class="row">
    <div class="col-md-6 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/causalgame/opencode.png" title="OpenCode agent-harness comparison" alt="Survival-rate comparison among prompting, ReAct, and OpenCode" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
    <div class="col-md-6 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/causalgame/baseline.png" title="Non-LLM baseline comparison" alt="CausalGame survival rates for non-LLM and hybrid baselines" class="img-fluid rounded z-depth-1" zoomable=true %}
    </div>
</div>
<div class="caption">
    A stronger coding-agent harness improves performance, but the remaining gap shows that the bottleneck is not simply tool access or exploration volume.
</div>

## What the trajectories reveal

Failure analysis shows that many agents do not form a causal model at all. They under-explore, lock component values too early, overfit noisy small batches, or move away from an effective intervention they have already discovered. In agentic mode, 68.4% of sessions show no meaningful causal engagement.

The benchmark also exposes evaluation risks relevant to autonomous research agents. Some coding agents probe the simulator for environmental shortcuts rather than investigate the mechanism, while other agents confidently declare success despite measured results below the winning threshold. CausalGame therefore relies on external, SCM-grounded evaluation rather than the agent's own narrative of success.

## Takeaway

CausalGame reframes AI Scientist evaluation around **mechanism discovery under intervention**. The benchmark asks not only whether an agent can produce a good answer, but whether it can recognize biased evidence, design an informative experiment, recover a hidden causal process, and carry that understanding into a new evaluation sample.

The results suggest a clear direction: causal thinking should be evaluated and trained as a capability in its own right. Better tools and stronger agent scaffolds help, but reliable scientific discovery will require agents that can question correlations and reason about how the world changes when they act.
