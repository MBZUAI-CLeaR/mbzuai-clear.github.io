---
layout: page
title: CausalBind
description: Causal modeling and structure-constrained learning for protein–molecule virtual screening
img: assets/img/projects/causalbind/overview.png
importance: 1
category: work
related_publications: true
---

**Loka Li · Jin Tian · Kun Zhang**<br>
*ICLR Workshop on Generative and Experimental Perspectives for Biomolecular Design, 2026* {% cite licausalbind %}

Large-scale virtual screening asks a deceptively simple question: **which molecules are most likely to bind a given protein?** Modern retrieval models can search enormous chemical libraries efficiently, but they usually align entire protein and molecule representations. This dense, holistic matching can entangle the few local interactions that drive binding with global, dataset-specific shortcuts.

**CausalBind** starts from a more biological view: binding is often determined by a small contact interface and a handful of decisive interactions—such as hydrogen bonds, hydrophobic contacts, and salt bridges. We turn this observation into a causal representation-learning framework that discovers and reuses simple cross-modal interaction structures.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/projects/causalbind/overview.png" title="Dense holistic alignment versus biology-inspired sparse binding" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Dense alignment compares global protein and molecule representations, while CausalBind focuses learning on the small set of local compatibilities that supports binding.
</div>

## Why a causal view?

Training corpora predominantly contain observed binders. Conditioning on binding creates a **selected collider**: molecule and protein features can appear statistically related even when that dependence does not reflect the physical binding mechanism. A flexible dense model may therefore learn correlations that work within one dataset but fail on new targets or chemical scaffolds.

We formalize this setting with a V-structure causal model under binder-only, Heckman-style selection. The analysis identifies three regimes:

- Unconstrained dense cross-modal interactions are generally **not identifiable**.
- Sparse interactions with an antichain structure are **component-wise identifiable**, up to unavoidable equivalences.
- Low-rank interactions are **subspace identifiable**, providing a practical relaxation when exact sparsity is too restrictive.

This gives a direct path from causal theory to model design: constrain how protein and molecule information may interact, rather than relying only on a better global embedding.

## How CausalBind works

CausalBind encodes molecule structure, protein-pocket structure, and protein sequence, then uses a Perceiver-style extractor to decompose each view into latent concept tokens. Protein–molecule evidence must pass through a structured interaction bottleneck before it contributes to the retrieval score.

We study three complementary implementations:

- **CausalBind-SP** learns sparse concept-pair masks for molecule–pocket and molecule–sequence interactions.
- **CausalBind-LR** explicitly factorizes the concept-level interaction mask into low-rank factors.
- **CausalBind-EMB** applies the same constrained-interaction principle after pooling in embedding space.

<div class="row justify-content-sm-center">
    <div class="col-sm-8 mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/causalbind/architecture.png" title="CausalBind implementation architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Pocket structure, molecule structure, and protein sequence are decomposed into concepts. Green links retain active concept-pair interactions; dashed red links suppress blocked interactions.
</div>

All variants retain dual-tower retrieval efficiency, making the framework suitable for screening very large molecule libraries.

## Stronger virtual screening

We train on assay-level interactions from ChEMBL and BindingDB together with structural pairs from PDBBind, and remove training targets whose UniProt IDs occur in the evaluation sets. Evaluation is zero-shot and cross-dataset on all 102 DUD-E targets and 15 LIT-PCBA targets. BEDROC and EF@1% emphasize the most practically valuable part of a ranked library: the very top candidates.

| Method | DUD-E AUROC | DUD-E BEDROC | DUD-E EF@1% | LIT-PCBA AUROC | LIT-PCBA BEDROC | LIT-PCBA EF@1% |
|:--|--:|--:|--:|--:|--:|--:|
| LigUnity | 0.897 | 0.674 | 44.20 | 0.599 | 0.075 | 6.50 |
| HypSeek | 0.909 | 0.605 | 37.83 | 0.603 | 0.061 | 4.62 |
| **CausalBind-SP** | 0.935 | 0.744 | 47.69 | **0.640** | 0.096 | 8.56 |
| **CausalBind-LR** | 0.935 | 0.704 | 44.87 | 0.632 | **0.103** | 8.84 |
| **CausalBind-EMB** | **0.939** | **0.754** | **48.56** | 0.636 | 0.102 | **9.60** |

All three variants outperform the reproduced retrieval baselines across the reported metrics. The clearest gains appear on LIT-PCBA, a property-debiased benchmark designed to suppress simple chemical-property shortcuts. CausalBind-EMB reaches **9.60 EF@1%**, compared with 6.50 for LigUnity and 4.62 for HypSeek.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/causalbind/hyperparameters.png" title="CausalBind hyperparameter study" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    CausalBind-SP remains effective across a useful range of concept counts, concept dimensions, sparsity weights, and extractor depths. Excessive sparsity removes useful binding signals and causes retrieval to collapse.
</div>

## Generalization beyond the main benchmarks

Additional zero-shot tests on DEKOIS 2.0 explicitly stress distribution shift. On target-level OOD screening, CausalBind-SP improves EF@1% to **23.00**, versus 20.06 for HypSeek and 19.82 for LigUnity. Under the stricter scaffold-level OOD split, CausalBind-EMB achieves **0.744 BEDROC** and **50.77 EF@1%**. These results support the central hypothesis that simple interaction structures transfer better than holistic correlations.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/causalbind/ood-generalization.png" title="CausalBind zero-shot OOD generalization on DEKOIS 2.0" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Early enrichment under target-level and scaffold-level distribution shifts. All three CausalBind variants remain competitive, with the strongest gains under the strict scaffold split.
</div>

## From learned concepts to local contacts

An attribution study on the Human Thyroid Hormone Receptor β (THRB) connects CausalBind's learned concepts back to an aligned protein–ligand complex. Heavy-atom contacts are concentrated **5.73×** above a uniform baseline within the most contact-aligned concept pair. Masking the associated ligand and pocket atoms lowers the predicted binding score from **1.878 to 0.851 (−54.7%)**; the effect is at the **99.2nd percentile** of matched random controls.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid path="assets/img/projects/causalbind/thrb-attribution.png" title="CausalBind local-to-global attribution on THRB" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Local contacts, their overlap with learned concept pairs, and controlled occlusion evidence in a THRB complex. This is model-level attribution rather than a claim of a uniquely identified physical causal mechanism.
</div>

## Takeaway

CausalBind reframes virtual screening as the recovery of **reusable protein–molecule interaction structure**. By connecting causal identifiability theory with sparse and low-rank retrieval models, it improves both early enrichment and out-of-distribution screening—without giving up the scalability that makes representation-based virtual screening attractive.

_Paper and code links will be added upon public release._
