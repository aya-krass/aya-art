# Universal Preference Knowledge Base for «Между строк»

## Executive summary

The research brief defines the right scientific problem: **a preference should be treated as evidence about potentially rewarding forms of experience, not as a shortcut to personality, diagnosis or demographic identity**. The desired inference chain is therefore *preference → possible experiential functions → competing explanations → contextual evidence → cross-domain validation → confidence*, rather than *preference → type of person*. fileciteturn0file0

The literature strongly supports this architecture. Human motivation is demonstrably multi-determined: autonomy, competence and relatedness are recurrent motivational mechanisms, but their expression depends on context; a 2024 meta-analysis synthesised 4,561 effects across 881 samples and found substantial associations between interpersonal need support, need satisfaction, motivation and wellbeing, while a 2026 workplace meta-analysis similarly found an indirect chain from need support through need satisfaction and autonomous motivation to adaptive outcomes. citeturn14view0turn14view1 Reward science also distinguishes **hedonic “liking” from motivational “wanting”**, meaning even “I love X” should not automatically be interpreted as “I actively seek X for reason Y”. citeturn15search4turn15search5

Across the domains examined, the same smaller set of experiential functions repeatedly appears. Sport can provide movement pleasure, challenge, mastery, competence, social connection and state regulation; food can provide sensory reward, comfort, novelty, ritual and social bonding; music can regulate arousal and emotion while supporting social relatedness; fiction can provide respite, emotional experience, intellectual stimulation and social simulation; travel can provide exploration, recovery, novelty, bonding and contact with nature; games can provide achievement, agency, immersion, play and sociality. None of these mappings is one-to-one. citeturn4search0turn3search3turn9search3turn3search5turn14view6turn14view8

The resulting recommended ontology contains **40 atomic or near-atomic functions**. Importantly, not every recognised psychological construct should become a function. *Sensation seeking* is better treated as a possible individual-difference moderator rather than inferred from activities; *hedonic versus eudaimonic wellbeing* is an outcome distinction rather than a motive; *approach versus avoidance* is a directional modifier; *self-efficacy* overlaps substantially with task-specific competence/agency for this product; and *self-expansion* is most usefully represented as a compound pattern involving novelty, learning, perspective change and sometimes close relationships rather than automatically added whenever travel or relationships appear. Evidence is especially strong for keeping **curiosity separate from learning**, **awe separate from ordinary aesthetic pleasure**, **ritual separate from comfort**, and **belonging, intimacy, shared experience and collective energy separate from one another**. citeturn15search0turn15search1turn2search1turn15search2turn2search3turn7search1

A crucial implementation consequence is that «Между строк» needs **two kinds of confidence**, not one:

| Confidence dimension | Meaning | Example |
|---|---|---|
| **Evidence strength** | How well research supports a function as a plausible reward of this *class of experience*. | Running → movement pleasure: **HIGH**. |
| **User-fit confidence** | How much evidence this particular user's other preferences and wording give for that explanation. | Running → mastery: initially **LOW/MEDIUM**, rising if chess, piano practice and skill-building projects also appear. |

A scientifically well-supported mechanism can therefore have low user-fit confidence. This distinction prevents the most common failure mode: converting population-level associations or structural affordances into claims about one individual.

The safest inference strategy is **abductive rather than classificatory**: generate two to five plausible explanations, look for independent recurrence across unrelated domains, actively search for counter-evidence, and only then increase confidence. Explicit user explanations should outrank category priors. Contradictory preferences should usually produce a *more conditional interpretation*, not an assertion that the user is inconsistent.

Two implementation artefacts accompany this report. The workbook contains the 40-function taxonomy, **485 preference–function rows**, 42 interpretation traps, the 100 cross-domain examples, distinction rules, default-prior rules and source families. The JSON contains the same material in a machine-readable structure.

[Download the expanded XLSX knowledge base](sandbox:/mnt/data/mezhdu_strok_universal_preference_KB.xlsx)

[Download the JSON knowledge base](sandbox:/mnt/data/mezhdu_strok_universal_preference_KB.json)

**Overall research judgement**

| Quality label | What «Между строк» can do |
|---|---|
| **WELL SUPPORTED** | Treat preferences as multi-functional; model autonomy, competence, challenge/mastery, sensory pleasure, emotion regulation, restoration, curiosity/exploration, social connection, aesthetic experience, ritual and related mechanisms as competing hypotheses. |
| **PLAUSIBLE BUT CONTEXT DEPENDENT** | Infer specific motives such as nostalgia, escape, status, self-expression, collective energy or awe when the experience affords them **and** other evidence corroborates them. |
| **DO NOT DEFAULT TO THIS** | Personality traits; intelligence; discipline; aggression; extroversion; sophistication; materialism; attachment style; national/cultural stereotypes; diagnosis; addiction; or any sensitive attribute. |

## Scope, assumptions and methodology

**Scope and assumptions.** I interpret the requested knowledge base as infrastructure for an LLM that receives free-text lists of things a user likes and needs to produce **positive but non-flattering, uncertainty-preserving hypotheses about rewarding experience**. It is not intended as a psychometric instrument, diagnostic system, personality test, career test or demographic profiler. This follows the product specification directly. fileciteturn0file0

The research question was operationalised as:

> Given a class of liked experience, what recurring functions could plausibly make that experience rewarding; how strong is the evidence for each function at the class level; what alternative explanations remain; and what independent evidence should alter person-level confidence?

The review was conducted through **23 October 2026**. Searches prioritised PubMed-indexed peer-reviewed literature, PMC where available, journal/publisher records and recent meta-analyses, systematic reviews and research syntheses. Foundational studies were retained where they define constructs that remain current, such as reward decomposition, ritual psychology and shared experience. Examples include the 2024 basic-needs meta-analysis, the 2026 workplace SDT meta-analysis, a 2026 savouring meta-analysis, a 2024 curiosity review, a 2025 vacation meta-analysis and a 2026 aesthetic-experience review. citeturn14view0turn14view1turn15search3turn15search0turn14view6turn14view7

Domain-specific searches covered sport and spectatorship, food and drink, music, reading and narrative media, travel and place attachment, nature, art and aesthetics, fashion/luxury/identity expression, relationships and collective experiences, gaming, work and hobbies. Recent systematic reviews show why a single universal dictionary such as `running → discipline` would be scientifically indefensible: sport participation has multiple recurring facilitators and motives; food choice is jointly shaped by sensory, social, contextual and individual factors; digital gaming research identifies several distinct motivational families rather than one core motive. citeturn4search0turn3search3turn14view8

The synthesis uses the following evidence scale:

| Evidence label | Operational meaning for the KB | Person-level implication |
|---|---|---|
| **HIGH** | The function is intrinsic to the experience or repeatedly demonstrated in strong directly relevant evidence. | May be included automatically as a candidate, **not** stated as the user's reason. |
| **MEDIUM/HIGH** | Strongly recurrent in directly relevant literature but not structurally necessary. | Good prior; still needs context before confident wording. |
| **MEDIUM** | Common and theoretically coherent but heterogeneous across people/context. | Hypothesis only; cross-validation desirable. |
| **LOW / CONTEXT DEPENDENT** | Possible but poorly identified by the preference alone. | Do not surface confidently without explicit or converging evidence. |
| **BLOCKED** | Requires a trait, stereotype, diagnosis or sensitive inference unsupported by the preference. | Must not be generated from preference data. |

A further methodological principle is **granularity matching**. Evidence about “physical activity” can justify a broad physical-activity prior, but it should not automatically justify a claim about boxing, marathon running and yoga equally. Likewise, research on luxury consumption supports status signalling as *one possible mechanism*; it does not establish that a specific person's preference for a luxury hotel or handbag is status-motivated. The KB therefore records evidence at the highest defensible level and lowers confidence when extrapolating to narrower subclasses. Reviews of extreme sport, horror and luxury consumption are especially useful examples of why apparent stereotypes are often underdetermined. citeturn4search3turn9search2turn8search11turn8search13

The proposed inference architecture is:

```mermaid
flowchart LR
    P[Preference] --> C[Experience class & observable affordances]
    C --> H[Generate 2–5 candidate functions]
    H --> A[Alternative explanations]
    A --> X[Explicit wording + context + cross-domain recurrence]
    X --> U[Increase / decrease confidence]
    U --> O[Ranked hypotheses with evidence and counter-evidence]
    O --> G[Guardrails: no trait, stereotype, diagnosis or sensitive inference]
```

This should behave more like **evidence accumulation** than a lookup table. It should not pretend to calculate Bayesian probabilities unless the system is subsequently validated on labelled data.

**Research-quality judgement:** **WELL SUPPORTED** — multi-causal motivation and the need to distinguish motivational mechanisms. **PLAUSIBLE BUT CONTEXT DEPENDENT** — exact prior weights for individual preference classes. **DO NOT DEFAULT TO THIS** — converting correlations or population averages into claims about the individual.

## Evidence architecture and universal function taxonomy

The proposed taxonomy contains 40 functions. It intentionally favours a manageable set of discriminable mechanisms over hundreds of near-synonyms. The taxonomy is an **engineering ontology informed by psychological evidence**, not a claim that psychology has canonically established exactly these 40 categories.

Several theoretical constructs are deliberately represented differently. Reward “liking” and “wanting” are kept conceptually separate because reward neuroscience has long distinguished hedonic impact from incentive motivation. citeturn15search5turn15search4 Curiosity is separated from learning because contemporary reviews conceptualise curiosity as a drive to resolve information gaps and motivate exploration, whereas learning is what is acquired. citeturn15search0turn15search1 Ritual is separated from familiarity because ritual research identifies ordered symbolic/action sequences with regulatory functions that cannot be reduced to simply “knowing what comes next”. citeturn15search2 Awe is separated from aesthetics because experimental meta-analysis treats awe as a distinct emotion and contemporary aesthetics research describes aesthetic experience as broader and multidimensional. citeturn2search1turn14view7turn8search2

| Function ID | Function | Definition | What it is **not** | Research anchor | Typical signals | Cross-domain example |
|---|---|---|---|---|---|---|
| `sensory_pleasure` | Sensory pleasure | Positive hedonic response to sensory qualities. | Not necessarily high stimulation. | Food and aesthetic research show sensory qualities as one component of reward. citeturn3search3turn8search2 | taste, fragrance, texture, timbre, colour | food + perfume + textiles + music |
| `savouring` | Savouring | Attending to, deepening or prolonging a positive experience. | Not simply experiencing pleasure. | RCT meta-analysis supports savouring as a distinct positive-experience process. citeturn15search3 | tastings, slow coffee, sunsets | wine + gardens + music + slow travel |
| `stimulation_arousal` | Stimulation / arousal | Reward from activation, pace, energetic input or surprise. | Not necessarily emotional intensity or risk. | Music and horror research distinguish activation from other rewards. citeturn9search3turn9search0 | fast sport, energetic music, nightlife | electronic music + tennis + thriller |
| `emotional_intensity` | Emotional intensity | Valuing strong felt affect, including mixed emotion. | Not physical or sensory intensity. | Sad-music and aesthetics evidence demonstrates rewarding intense/mixed emotion. citeturn9search5turn8search2 | sad music, drama, horror | opera + literary fiction + character drama |
| `mood_regulation` | Mood/state regulation | Using experience to change, sustain or organise affect. | Not evidence of pathology. | Music meta-analyses and nature research support regulatory functions. citeturn9search4turn9search1turn13search8 | exercise, music, baths, familiar media | running + playlist + bath |
| `restoration` | Restoration | Replenishment after cognitive, emotional or physical demands. | Not equivalent to avoidance. | Vacation and nature syntheses support recovery/restoration. citeturn14view6turn6search7 | nature, quiet holidays, parks | forest + reading + slow trip |
| `escape_detachment` | Detachment / escape | Temporary psychological distance from demands or routine. | Not inherently maladaptive. | Vacation and media/gaming literatures distinguish detachment from pathology. citeturn14view6turn7search0turn9search9 | immersive fiction, games, travel | fantasy + RPG + cinema |
| `comfort_familiarity` | Comfort/familiarity | Reward from predictability, ease and known patterns. | Not necessarily nostalgia or ritual. | Comfort-food and rewatching reviews support familiar-experience functions. citeturn5search1turn9search9 | favourite food, reruns, repeat places | recipe + sitcom + repeat beach |
| `nostalgia` | Nostalgia/continuity | Reconnection with autobiographical or shared past. | Not all familiarity. | Sad-music and media-rewatching literature identifies nostalgia as one mechanism. citeturn9search5turn9search9 | old songs, childhood foods | teenage music + hometown + old film |
| `movement_pleasure` | Pleasure in movement | Intrinsic kinaesthetic enjoyment. | Not fitness, discipline or achievement. | Enjoyment is a recurrent physical-activity facilitator; dance work emphasises embodiment. citeturn4search0turn4search10 | dance, running, swimming | dance + cycling + walking |
| `embodied_intensity` | Embodied intensity | Reward from strong bodily sensations or exertion. | Not automatically sensation seeking. | Adventure-sport and spicy-food reviews show heterogeneous pathways into intense bodily experiences. citeturn4search3turn5search3 | hard exertion, heat, cold, speed | boxing + chilli + cold swimming |
| `challenge` | Challenge | Reward from tackling difficulty requiring effort/adaptation. | Not necessarily competition. | Flow and sport research consistently implicate challenge. citeturn12search0turn4search0 | hard routes, puzzles, complex recipes | climbing + chess puzzle + coding |
| `mastery` | Mastery | Reward from progressively refining a skill. | Not merely completing goals. | Competence/flow and gaming literature support skill refinement as motivating. citeturn14view0turn12search0turn14view8 | practice, technique, repeated refinement | piano + tennis + cooking |
| `achievement_progress` | Achievement/progress | Reward from milestones, completion or measurable advancement. | Not identical to mastery. | Achievement/goal orientation is recurrent in sport and gaming. citeturn4search0turn14view8 | PBs, ranks, completed projects | race + game rank + project launch |
| `competence` | Competence | Felt effectiveness when interacting with a task/environment. | Not a judgement of global ability. | A central basic psychological need in SDT evidence. citeturn14view0turn14view1 | solving, executing, performing effectively | cooking + sport + work problem |
| `autonomy` | Autonomy | Acting in a way experienced as volitional and self-endorsed. | Not simply doing something alone. | Strongly grounded in SDT evidence. citeturn14view0turn14view1 | self-directed projects/travel | road trip + side project + solo run |
| `agency_control` | Agency/control | Reward from shaping outcomes and observing effects of one's actions. | Not a “controlling personality”. | Gaming and work research supports action/outcome control as a relevant affordance. citeturn14view8turn14view1 | strategy, organising, making | simulation + DIY + planning |
| `novelty` | Novelty | Reward from unfamiliarity or freshness. | Not active exploration. | Novelty is implicated in curiosity and travel-related motivation. citeturn15search0turn6search6 | new cuisine, city, music | food + destination + art |
| `exploration` | Exploration | Active search through environments or possibilities. | Not just encountering novelty. | Curiosity theory explicitly connects curiosity with exploratory behaviour. citeturn15search0 | wandering, open-world games, browsing | city + market + hiking + game |
| `curiosity` | Curiosity | Desire to resolve a knowledge/information gap. | Not the knowledge obtained afterwards. | Current reviews directly support this distinction. citeturn15search0turn15search1 | science, mysteries, museums | book + documentary + research |
| `learning` | Learning | Reward from acquiring skill, knowledge or perspective. | Not identical to curiosity. | Curiosity and reading evidence distinguish knowledge-seeking from acquisition. citeturn15search0turn3search5 | nonfiction, classes, cultural travel | history + museum + project |
| `cognitive_complexity` | Cognitive complexity | Enjoyment of ambiguity, layered structure or interpretation. | Not intelligence or sophistication. | Aesthetic experience is strongly multidimensional and can involve ambiguity/interpretation. citeturn14view7turn8search2 | jazz, conceptual art, strategy | literary fiction + jazz + chess |
| `flow_absorption` | Flow/absorption | Deep involvement and intrinsically rewarding attentional absorption. | Not any period of concentration. | Flow reviews consistently identify absorption alongside challenge, goals and feedback. citeturn12search0turn12search3 | coding, climbing, performance | piano + climbing + coding |
| `play` | Play | Voluntary experimentation, humour, imaginative variation or intrinsically enjoyable rule use. | Not childishness. | Gaming and leisure research support play as distinct from achievement. citeturn14view8turn13search7 | games, improvisation, playful styling | board game + improv + fashion |
| `competition` | Competition | Reward from comparative contest or ranking. | Not difficulty itself. | Competition appears independently from mastery/challenge in sport and gaming motivation. citeturn4search0turn14view8 | matches, rankings, races | tennis + esports + quiz |
| `creativity_creation` | Creation | Reward from making or transforming something. | Not evidence of a “creative personality”. | Cooking/hobby evidence supports creation and self-efficacy-like rewards, though causality is uneven. citeturn5search2turn13search7 | cooking, writing, design, DIY | baking + décor + side project |
| `aesthetic_pleasure` | Aesthetic pleasure | Reward from form, composition, style or material qualities. | Not necessarily awe. | Contemporary aesthetics research rejects reduction of aesthetic experience to a single beauty dimension. citeturn14view7turn8search2 | art, design, architecture, clothing | architecture + fashion + food |
| `awe_transcendence` | Awe | Wonder/perspective shift elicited by perceived vastness or profundity. | Not generic liking or beauty. | Experimental meta-analysis supports awe as a distinguishable emotion. citeturn2search1 | mountains, monumental spaces | landscape + orchestra + astronomy |
| `meaning_reflection` | Meaning/reflection | Reward from significance, interpretation or connection to larger narratives. | Not proof of spirituality or virtue. | Narrative and aesthetic evidence supports reflective/meaning-oriented engagement. citeturn3search5turn8search1 | philosophy, historical places, serious art | philosophy + memorial + literature |
| `self_expression_identity` | Self-expression/identity | Using choices to express or maintain a sense of self. | Never licence to infer sensitive identity. | Identity-expressive consumption and music/media work support this function. citeturn8search14turn9search3 | fashion, music, décor | clothing + playlist + home |
| `distinction_status` | Distinction/status signalling | Reward from communicating prestige, scarcity or social distinction. | Not the default explanation for luxury. | Luxury research establishes status signalling as one motive among several. citeturn8search11turn8search13 | exclusivity, prestige language | fashion + exclusive dining + travel |
| `belonging` | Belonging | Inclusion and acceptance within a group or social world. | Not intimacy with a particular person. | Belonging and relatedness are well-supported constructs. citeturn11search5turn14view0 | clubs, fandoms, communities | running club + fandom + guild |
| `intimacy_attachment` | Intimacy/attachment | Close particularised bond involving trust and mutual importance. | Not group inclusion or crowd energy. | Adult attachment research supports close-bond functions. citeturn11search2 | partner, children, close friends | couple dinner + family ritual |
| `care` | Care/contribution | Reward from supporting or nurturing another person's welfare. | Not proof of self-sacrifice or moral virtue. | Meta-analytic work on communal motivation supports caregiving-oriented motivation. citeturn11search9 | hosting, mentoring, cooking for others | meal + mentoring + family care |
| `shared_experience` | Shared experience | Value of co-experiencing something with another person/group. | Not necessarily belonging or high arousal. | Experiments show sharing can alter experience and can be sought for connection. citeturn10search0turn10search3 | film together, dinner, trip | movie + meal + road trip |
| `collective_energy` | Collective energy | High-arousal unison from synchronised attention/emotion/movement. | Not intimacy. | Collective-effervescence meta-analysis supports this as a group-event process. citeturn7search1turn7search6 | stadiums, festivals, mass singing | match + festival + concert |
| `social_observation` | Social observation/simulation | Reward from interpreting others' motives, relationships and behaviour. | Not proof of empathy or social skill. | Narrative-reading evidence shows small/context-sensitive social-cognitive effects. citeturn3search1turn3search4 | biography, character drama | memoir + drama + documentary |
| `ritual_structure` | Ritual/structure | Reward from repeated ordered, meaningful sequences. | Not mere familiarity and not compulsivity. | Ritual review identifies emotional, goal-state and social regulation. citeturn15search2turn5search6 | morning coffee, weekly dinner | tea + bath + pre-run routine |
| `social_recognition` | Recognition/esteem | Reward from acknowledgement of contribution or performance. | Not necessarily status hierarchy. | Work/social motivation research supports interpersonal acknowledgement as contextual reward, although it is less cleanly isolated than basic needs. citeturn14view1 | applause, praise, awards | performance + project + hosting |
| `nature_connection` | Nature connection | Reward from contact with landscapes and living/non-built environments. | Not synonymous with calmness or restoration. | Nature syntheses show multiple affective and restorative pathways. citeturn6search2turn6search7turn13search8 | forest, sea, gardening | hiking + gardening + nature travel |

Several close-neighbour distinctions should be hard-coded because collapsing them substantially reduces the usefulness of cross-domain analysis:

| Pair | Operational distinction |
|---|---|
| **Pleasure vs stimulation** | Pleasure is positive hedonic valence; stimulation is activation. Chocolate may be pleasant but low-arousal; a tense thriller can be highly activating without being deeply pleasurable. Reward components need not coincide. citeturn15search5 |
| **Mastery vs achievement** | Mastery is refining capability over time; achievement is crossing a goal or benchmark. |
| **Belonging vs intimacy** | Belonging concerns inclusion in a group/social world; intimacy concerns a particular close bond. citeturn11search5turn11search2 |
| **Collective energy vs shared experience** | Collective energy requires relatively intense coordinated group activation; shared experience can be quiet and involve two people. citeturn7search1turn10search3 |
| **Novelty vs exploration** | Novelty is a property of encountering something unfamiliar; exploration is the active process of searching. citeturn15search0 |
| **Restoration vs escape** | Restoration implies replenishment; detachment merely means temporary distance. A detached experience may or may not restore. citeturn14view6 |
| **Sensory vs emotional intensity** | One concerns strength of sensory/body input; the other concerns strength of affect. |
| **Autonomy vs independence** | Autonomy means volition. A chosen collaborative activity can be highly autonomous; a solo activity can be externally controlled. citeturn14view0 |
| **Awe vs aesthetic pleasure** | Awe centrally involves vastness/profundity and frame adjustment; aesthetic pleasure covers a much broader range of pleasing form. citeturn2search1turn14view7 |
| **Curiosity vs learning** | Curiosity motivates wanting to know; learning is acquisition/change in knowledge. citeturn15search0turn15search1 |
| **Competition vs challenge** | Competition requires comparative contest; challenge does not require an opponent. |
| **Ritual vs comfort** | Ritual concerns ordered repetition and meaning; comfort concerns ease/predictability. Either can occur without the other. citeturn15search2turn5search1 |

**Research-quality judgement:** **WELL SUPPORTED** — the major distinctions above and broad families such as autonomy/competence, curiosity, restoration, affect regulation, social connection and aesthetic experience. **PLAUSIBLE BUT CONTEXT DEPENDENT** — exact boundaries among lower-level functions such as agency versus competence or self-expression versus distinction. **DO NOT DEFAULT TO THIS** — turning moderator constructs such as sensation seeking into personality labels inferred from activities.

## Preference knowledge base across domains

The downloadable workbook expands every candidate function into a separate row with the requested fields:

`Domain → Subdomain/Experience Type → Example → Possible Function → Evidence Strength → Why Rewarding → Alternatives → Confidence Up → Confidence Down → Unsafe Inference → Analyst Wording → Evidence Family`.

The table below compresses that expanded KB for readability. The confidence labels concern the **experience-class prior**, not certainty about an individual.

| Domain / experience type | Stronger candidate functions | Context-dependent alternatives | Key evidence / caution |
|---|---|---|---|
| **Endurance sport** — running, cycling, swimming | movement pleasure **HIGH**; mastery **M/H** | progress, state regulation, autonomy, competition | Enjoyment and autonomous/competence-related motivation recur in physical-activity research. Do not translate running into “discipline”. citeturn4search0turn4search1 |
| **Strength training** | competence/mastery **M/H** | progress, embodied intensity, sociality | Motives are heterogeneous; appearance concerns cannot be assumed. citeturn4search0turn4search1 |
| **Combat sport** | challenge, mastery **M/H** | competition, embodied intensity, flow | Combat participation is not evidence of aggression. |
| **Team sport — doing** | belonging/shared experience/competition **M/H** | competence, play, identity | Sport has multiple simultaneous motives. citeturn4search0 |
| **Outdoor/adventure sport** | challenge/nature **M/H** | exploration, autonomy, competence, flow | Systematic review finds meanings far broader than risk/thrill. citeturn4search3turn4search4 |
| **Extreme sport** | challenge **M/H** | embodied intensity, nature, agency, flow | “Thrill seeker” should be a low-confidence hypothesis at most. citeturn4search3 |
| **Dance** | movement pleasure **HIGH** | aesthetics, embodiment, expression, belonging, flow | Dance research describes affect, embodiment, creativity, identity and belonging. citeturn4search10 |
| **Yoga/mind–body** | movement **HIGH** | restoration, regulation, ritual | Do not assume spirituality. |
| **Watching sport** | entertainment/stimulation **M**; fandom/belonging **M** | sociality, narrative/tactical interest | Spectator motives differ from participation motives. citeturn4search5 |
| **Live sport/stadium** | collective energy **M/H**; belonging **M/H** | spectacle, competition, stimulation | Live and mediated viewing have meaningfully different affordances. citeturn4search6turn7search1 |
| **Watching with friends** | shared experience **HIGH** | belonging, ritual, stimulation | Sharing itself can be valued independently of content. citeturn10search0turn10search3 |
| **Rich/intense food** | sensory pleasure **HIGH** | savouring, familiarity | Food preference is multiply determined; avoid global “hedonist” labels. citeturn3search3 |
| **Comfort food** | familiarity **M/H** | nostalgia, social memory, regulation | Comfort-food meanings are heterogeneous and not inherently dysfunctional. citeturn5search1 |
| **Fine dining** | sensory pleasure/savouring **M/H** | aesthetics, novelty, craft/learning, **status LOW** | Prestige is only one possible explanation. citeturn3search3turn8search11 |
| **Street food** | sensory pleasure **HIGH** | exploration, novelty, sociality | Context matters strongly. citeturn3search3 |
| **Cooking** | creation **M/H** | competence, care, sensory pleasure, ritual | Cooking-intervention evidence suggests several benefits but remains methodologically weaker than core motivational evidence. citeturn5search2 |
| **Baking** | creation/mastery **M** | ritual, care, sensory reward | Do not infer personality from precision-oriented recipes. |
| **Spicy food** | sensory/embodied intensity **HIGH/M** | novelty, cultural familiarity | Exposure, culture and biological factors all contribute; sensation seeking is not a safe default. citeturn5search3 |
| **Trying new foods** | novelty **HIGH** | exploration, curiosity, sociality | Stronger “exploration” hypothesis when active searching recurs elsewhere. citeturn3search3turn15search0 |
| **Eating socially** | shared experience **HIGH** | intimacy, belonging, care, ritual | Consumption rituals can carry social functions. citeturn5search6turn10search3 |
| **Coffee** | sensory pleasure **HIGH** | ritual, stimulation, sociality | Systematic-review-based work identifies functional, taste, habit/tradition and social motives. citeturn5search8 |
| **Tea** | sensory pleasure **HIGH** | ritual, savouring, restoration | “Calm person” is not warranted. citeturn15search2turn15search3 |
| **Wine/tasting** | sensory pleasure **HIGH** | savouring, learning/connoisseurship, sociality, ritual | Never infer addiction or a “hedonistic personality”. citeturn5search6turn3search3 |
| **Cocktails/specialty drinks** | sensory pleasure **HIGH** | novelty, aesthetics, craft, sociality | Alcohol-related health conclusions are outside safe preference inference. |
| **Energetic music** | arousal/stimulation **HIGH** | regulation, movement, collective energy | Music functions commonly include mood/arousal regulation. citeturn9search3turn0search12 |
| **Melancholic music** | emotional intensity **M/H** | nostalgia, being moved, reflection, regulation | Enjoying sad music is not evidence of depression. citeturn9search5 |
| **Classical music** | aesthetic pleasure **M/H** | emotional intensity, complexity, awe | Do not infer intelligence or sophistication. citeturn9search3turn14view7 |
| **Rock/metal** | stimulation **M/H** | regulation, community, identity, complexity | Genre does not license anger/aggression inference. citeturn9search3 |
| **Jazz** | aesthetic pleasure **M/H** | complexity, novelty, absorption | “Intellectual” remains an unjustified trait leap. |
| **Ambient music** | state regulation **M/H** | restoration, sensory pleasure | Function depends heavily on listening context. citeturn9search4 |
| **Live music** | sensory pleasure **HIGH**; shared/collective experience **M/H** | identity, emotion | Live music can create shared emotion and synchrony. citeturn7search6turn7search1 |
| **Festival music** | collective energy **HIGH** | belonging, novelty, stimulation | Distinguish crowd energy from close interpersonal intimacy. citeturn7search1 |
| **Nostalgic music** | nostalgia **HIGH when autobiographical cue explicit** | continuity, regulation, identity | Genre/year alone is insufficient; autobiographical association matters. citeturn9search5 |
| **General fiction** | emotional experience, detachment, social simulation **M** | meaning, aesthetics | Experimental social-cognitive effects are real on average but small/context-sensitive. citeturn3search1turn3search4 |
| **Nonfiction/science/history** | learning **HIGH** | curiosity, meaning | Curiosity is stronger when seeking/unknown language is present. citeturn15search0 |
| **Biography/memoir** | social observation **M/H** | learning, identification, meaning | Do not infer that admired lives are desired identities. |
| **Philosophy** | meaning/reflection **HIGH** | complexity, curiosity, learning | “Deep person” is flattering typology, not analysis. |
| **Crime/mystery** | curiosity **M/H** | tension, complexity | Information-gap mechanisms are plausible. citeturn15search1 |
| **Fantasy/speculative fiction** | exploration/detachment **M** | novelty, meaning, imagination | “Escapist person” is too broad. |
| **Literary fiction** | complexity/meaning/aesthetic language **M/H** | social observation, emotional experience | Do not claim high empathy from preference. citeturn3search1turn3search4 |
| **Poetry** | aesthetic language/emotional intensity **M/H** | ambiguity, meaning | Individual responses vary substantially, as aesthetic research predicts. citeturn14view7 |
| **Comedy** | play/state regulation **M/H** | shared experience | Humour can be social or solitary; preference gives little personality information. |
| **Drama/character-driven media** | emotional intensity/social observation **M/H** | meaning, identification | Narrative engagement does not prove empathy. citeturn3search4 |
| **Thriller** | stimulation/tension **M/H** | curiosity, emotional intensity | Separate suspense from general sensation seeking. |
| **Horror** | stimulation/emotional intensity **M/H** | morbid curiosity, controlled fear, social fun | Review evidence finds substantial heterogeneity; one 2024 experiment found morbid curiosity but not sensation seeking predictive in that sample. citeturn9search2turn9search0 |
| **Art cinema** | aesthetic/interpretive complexity **M/H** | meaning, ambiguity | Do not infer cultural sophistication. citeturn14view7 |
| **Blockbuster/spectacle** | stimulation **HIGH** | visual aesthetics, awe, social experience | Spectacle need not imply “simple” taste. |
| **Documentary** | learning/curiosity **M/H** | social observation, meaning | Topic matters more than format for finer inference. |
| **Rewatching** | familiarity **HIGH** | nostalgia, regulation, identity continuity | Repetition is not evidence of resistance to novelty. citeturn9search9 |
| **City travel** | exploration/novelty **M/H** | learning, aesthetics, sociality | City choice alone does not identify which urban layer matters. citeturn6search6turn6search5 |
| **Nature travel** | nature connection **HIGH** | restoration, awe, exploration | Nature exposure has relatively strong restoration evidence. citeturn6search7turn6search2 |
| **Road trips** | autonomy/exploration **M/H** | shared experience, movement, novelty | Ask whether route freedom or companionship is salient. |
| **Resorts** | restoration **M/H** | sensory comfort, convenience, familiarity | Vacation evidence supports recovery but not a universal destination mechanism. citeturn14view6 |
| **Adventure travel** | challenge/exploration **M/H** | nature, autonomy, learning | Avoid “risk seeker” shorthand. citeturn4search3 |
| **Cultural travel** | learning/curiosity **M/H** | aesthetics, meaning, food/social experience | Cultural interest must not be turned into nationality stereotypes. |
| **Repeat destinations** | familiarity **HIGH** | place attachment, nostalgia, ritual, belonging | Return visits can reflect depth, relationship or ease—not low novelty seeking. citeturn6search12 |
| **New destinations** | novelty **HIGH** | exploration, curiosity, self-expansion-like pattern | “Adventurous personality” remains too strong. citeturn6search6 |
| **Luxury travel** | comfort/aesthetics **M** | autonomy/service; **status LOW** | Status needs independent corroboration. citeturn8search11turn14view6 |
| **Slow travel** | savouring **M/H** | restoration, learning, local familiarity | Tempo is an affordance, not a personality trait. |
| **Specific city/country/place** | **no single default motive** | built environment, nature, pace, food, culture, history, memory, belonging, novelty, aesthetics | Place attachment depends jointly on person/process/place; never substitute national stereotypes for user evidence. citeturn6search12turn6search5 |
| **Figurative art** | aesthetic pleasure **M** | social observation, emotion, meaning | Responses are highly individual. citeturn8search2 |
| **Abstract art** | aesthetics **M** | sensory qualities, interpretive complexity | Avoid “intellectual” personality claims. |
| **Conceptual art** | meaning/complexity **M/H** | curiosity, provocation | Aesthetic experiences can involve disruption and reinterpretation, not only beauty. citeturn8search1turn14view7 |
| **Minimalism** | aesthetics **HIGH** | lower stimulation/restoration **LOW/M** | Do not infer need for control. |
| **Maximalism** | aesthetics **HIGH** | sensory richness, stimulation, play | Do not infer chaotic personality. |
| **Monumental art/architecture** | awe **M/H** | aesthetics, historical meaning | Awe becomes stronger when the user mentions scale/vastness. citeturn2search1 |
| **Tactile/material design** | sensory/aesthetic pleasure **H/MH** | craft learning | Material pleasure is distinct from status. |
| **Fashion styling** | aesthetic pleasure **HIGH** | self-expression, play | Identity expression is plausible; do not infer sensitive identity. citeturn8search14 |
| **Craft/material fashion** | aesthetic/sensory pleasure **M/H** | connoisseurship, learning | Brand price is not the mechanism. |
| **Luxury brands** | aesthetics/identity **M** | craftsmanship; **status LOW/CONTEXT** | Luxury literature supports status signalling as one pathway, not a universal one. citeturn8search11turn8search13 |
| **Collecting objects** | curiosity/ritual/aesthetics **M** | mastery, identity, distinction | Do not equate collecting with materialism. |
| **Partner** | intimacy/attachment **HIGH**; shared experience **HIGH** | care, self-expansion-like novelty | Close-bond processes differ from generic sociability. citeturn11search2turn2search3 |
| **Children** | care/attachment **HIGH** | play, shared experience | Do not convert a family preference into a virtue judgement. citeturn11search9 |
| **Family** | attachment/belonging **M/H** | ritual, nostalgia, care | Family is not evidence for liking crowds or “collective energy”. |
| **Friends** | shared experience **HIGH** | belonging, intimacy, play | Tie closeness matters. citeturn10search3 |
| **Communities** | belonging **HIGH** | shared activity, recognition | Community membership differs from intimate attachment. citeturn11search5 |
| **Public figures/creators** | admiration/learning/social observation **M** | identification or aspiration **LOW without evidence** | Do not assume “wants to be like X”. |
| **Parties** | shared experience **HIGH** | stimulation, play, belonging | Does not imply extraversion or attention seeking. |
| **Concert/festival/stadium crowd** | collective energy **HIGH/MH** | belonging, stimulation, shared emotion | Collective effervescence is distinct from intimacy. citeturn7search1turn7search6 |
| **Sea** | nature/sensory experience **HIGH/MH** | restoration, awe, activity, memory | Do not infer calm temperament. citeturn6search7 |
| **Mountains** | nature/awe **HIGH/MH** | challenge, solitude, restoration | “Conquest” only if achievement/challenge language recurs. citeturn2search1turn6search2 |
| **Forest** | restoration/nature connection **HIGH** | sensory pleasure, solitude | Among the stronger environment-function priors. citeturn6search7 |
| **Gardens/parks** | nature/restoration **M/H** | aesthetics, savouring, movement | May combine designed aesthetics and nature. |
| **Strategy games** | challenge/complexity **HIGH** | mastery, agency, competition | Never infer IQ from chess/strategy preference. citeturn14view8 |
| **Competitive games** | competition **HIGH** | progress, mastery, belonging | Ranking provides a structural competition prior. |
| **Co-operative games** | shared experience/play **HIGH** | competence, belonging | Co-operation does not prove a cooperative personality. |
| **Simulation games** | agency/control **HIGH** | creation, systems complexity | Do not infer real-world control needs. |
| **RPGs** | exploration/play **M/H** | sociality, identity experimentation, detachment | “Escapist” should never be the sole interpretation. citeturn14view8turn7search0 |
| **Creating from scratch at work** | creation **HIGH** | autonomy, challenge, agency | Task preference is not a career recommendation. citeturn14view1 |
| **Researching** | curiosity/learning **HIGH** | complexity, absorption | Strong cross-domain signal if nonfiction/museums/mysteries also recur. |
| **Solving** | challenge **HIGH** | competence, curiosity, flow | Problem-solving preference does not establish occupational aptitude. |
| **Crafting/improving** | mastery **M/H** | flow, progress, creation | Distinguish improvement process from milestone achievement. |
| **Collaborating** | shared experience/relatedness **M/H** | learning, competence | Collaboration can also be autonomous; autonomy ≠ solo work. citeturn14view1 |
| **Independent work** | autonomy **M/H** | agency, flow | Independence itself should not be interpreted as low sociability. |
| **Morning coffee/tea** | ritual **HIGH**; sensory pleasure **HIGH** | familiarity, stimulation | An unusually good example of multiple mechanisms coexisting. citeturn5search8turn15search2 |
| **Candles/home ambience** | sensory/aesthetic pleasure **HIGH/MH** | ritual, restoration | Does not imply being a “homebody”. |
| **Decorating** | aesthetics/creation **HIGH/MH** | self-expression, agency | Identity expression can be local to the home rather than global personality. |
| **Cleaning/tidying** | agency/ritual **M** | sensory outcome, completion | Never infer OCD, anxiety or other health information. |
| **Gardening** | nature connection **HIGH** | restoration, care, mastery | Nature-based activity evidence supports wellbeing pathways, not personality diagnosis. citeturn6search2 |
| **Hosting** | shared experience **HIGH** | care, recognition, ritual | Hosting may be care-oriented, social, aesthetic or competence-related. |
| **Bath/spa routine** | sensory pleasure **HIGH** | restoration, ritual, savouring | Do not equate self-care ritual with stress/pathology. |

For **places**, the KB should first decompose a named location into observable or user-mentioned layers:

`built environment · natural environment · pace · social atmosphere · cultural institutions · food · history · personal memories · relationships · identity/belonging · novelty · aesthetic character`.

The named location itself should carry almost no specific psychological prior beyond “this is a place preference”. Place-attachment theory explicitly integrates person-level meaning, psychological processes and the physical/social place, which makes stereotype-based shortcuts particularly inappropriate. citeturn6search12turn6search5

For **music genres, book genres, film genres and brands**, the same rule applies: classify the *experience afforded by the specific item* before using the broad category. “Metal” can be fast or atmospheric; “classical” covers radically different emotional and formal experiences; “luxury” products differ in craft, materials, design and signalling; fiction genres contain substantial within-genre variance. The category therefore provides candidate hypotheses rather than conclusions. citeturn9search3turn14view7turn8search13turn3search1

**Research quality by domain**

| Domain | WELL SUPPORTED | PLAUSIBLE BUT CONTEXT DEPENDENT | DO NOT DEFAULT TO THIS |
|---|---|---|---|
| Sport | enjoyment, movement, competence/challenge; sociality in appropriate formats | mastery, flow, regulation, collective energy | discipline, aggression, extroversion, recklessness |
| Food/drink | sensory reward; contextual/social complexity | comfort, ritual, novelty, connoisseurship | hedonism, addiction, status |
| Music | mood/arousal regulation; emotional and social functions | identity, nostalgia, particular genre functions | personality from genre |
| Reading/media | emotional/narrative engagement; respite; curiosity | perspective-taking, identification, meaning | empathy/intelligence/personality claims |
| Travel | recovery; novelty/exploration; bonding/nature as recurring motives | self-expansion, place attachment, status | “adventurous personality”, prestige by default |
| Places | multi-layer person–place explanation | any particular reason for liking a named place | national/cultural stereotypes |
| Art/design | multidimensional aesthetic experience | awe, challenge, transformative meaning | sophistication/intelligence |
| Fashion/brands | aesthetics and identity expression | status/distinction, belonging, play | materialism/insecurity |
| Relationships | attachment, belonging, care and shared experience are distinct | specific motivational mix | attachment style or personality |
| Social events | sharing, belonging and collective energy | arousal, ritual, recognition | extraversion/attention seeking |
| Nature | restoration and affective benefits | awe, solitude, challenge | calm temperament |
| Games | achievement, sociality, immersion, goal orientation, play | escape and identity experimentation | disorder, intelligence |
| Work | autonomy, competence, relatedness, challenge | recognition, creation, flow | automatic career recommendation |
| Home rituals | ritual, sensory experience, care, restoration are plausible | precise function of a routine | anxiety/OCD or other diagnosis |

## Interpretation traps and cross-domain validation

The most damaging errors are not usually incorrect descriptions of an activity; they are **invalid jumps in inferential level**. Horror contains frightening stimuli, but enjoying horror does not establish fearlessness. Running involves sustained effort, but liking running does not establish discipline. Fine dining can be prestigious, but that does not establish status motivation. The relevant domain literatures repeatedly show heterogeneous motives, and in some cases popular trait explanations perform poorly or inconsistently. citeturn9search2turn4search3turn3search3turn8search11

**Interpretation traps**

| Input | Bad inference | Why bad | Better hypotheses |
|---|---|---|---|
| running | “disciplined person” | trait leap | movement, mastery, progress, challenge, regulation |
| weight training | “insecure about appearance” | assumes pathology/body motive | competence, mastery, progress, intensity |
| boxing | “aggressive person” | activity ≠ aggression trait | mastery, challenge, competition, intensity |
| extreme sport | “reckless thrill seeker” | monocausal stereotype | challenge, agency, nature, competence, flow |
| team sport | “extrovert” | social format ≠ personality trait | belonging, shared play, competition |
| watching football | “wants to play football” | spectator and participant affordances differ | fandom, tension, entertainment, sociality |
| stadium | “likes crowds generally” | live-event mechanism may be event-specific | collective energy, identity, spectacle |
| wine | “hedonist” | global trait from one preference | taste, savouring, ritual, learning, sociality |
| wine | “alcohol problem” | sensitive health inference | analyse taste/ritual/context only |
| spicy food | “high sensation seeker” | trait evidence heterogeneous | sensory intensity, exposure, cuisine familiarity |
| fine dining | “status-driven” | status is one competing explanation | craft, sensory pleasure, aesthetics, novelty |
| comfort food | “emotionally dysregulated” | pathologises ordinary reward | familiarity, nostalgia, memory, sensory reward |
| coffee | “workaholic/dependent” | functional explanation overextended | taste, ritual, alertness, sociality |
| sad music | “depressed” | sensitive mental-health inference | emotion, nostalgia, being moved, reflection |
| metal | “angry” | genre stereotype | stimulation, regulation, community, sound |
| classical music | “intellectual” | flattering trait stereotype | aesthetics, complexity, emotion, awe |
| pop | “superficial” | evaluative stereotype | regulation, familiarity, sharing, movement |
| live concerts | “extrovert” | crowd preference ≠ broad trait | collective energy, sound, sharing |
| literary fiction | “high empathy” | average effects do not diagnose individual trait | social simulation, complexity, language, meaning |
| philosophy | “deep person” | flattering typology | curiosity, complexity, learning, meaning |
| romance novels | “relationship obsessed” | genre ≠ personal-life motive | emotional experience, narrative, attachment themes |
| horror | “fearless/disturbed” | contradictory stereotype; evidence heterogeneous | controlled fear, excitement, curiosity, social fun |
| rewatching | “resistant to change” | familiarity can have many functions | comfort, nostalgia, regulation |
| Japan | “likes order” | national stereotype | design, food, history, urban form, memories, novelty |
| Armenia | “likes hospitality” | assumed cultural explanation | landscape, family connection, food, history, architecture |
| Paris | “romantic person” | place cliché | architecture, walkability, food, art, memories |
| repeat destination | “unadventurous” | ignores attachment/comfort | familiarity, ritual, belonging, restoration |
| luxury travel | “status seeker” | ignores service/design/comfort | restoration, aesthetics, autonomy, sensory comfort |
| backpacking | “free spirit” | travel-format-to-trait leap | exploration, autonomy, sociality, challenge |
| minimalism | “needs control” | style does not establish motive | aesthetics, low stimulation, clarity |
| maximalism | “chaotic” | style-to-personality stereotype | richness, play, self-expression |
| luxury brand | “materialistic/insecure” | pathologising and monocausal | aesthetics, craft, identity, distinction |
| family | “likes collective experiences” | confuses intimacy with crowd experience | attachment, care, belonging, ritual |
| many friends | “extrovert” | preference/network ≠ trait | belonging, play, shared experience |
| public figure | “wants to be them” | admiration ≠ identification | craft, learning, ideas, aesthetics |
| parties | “attention seeking” | unsupported trait claim | play, stimulation, belonging, sharing |
| sea | “calm person” | environment preference ≠ temperament | sensory pleasure, restoration, awe, memory |
| mountains | “likes conquering things” | achievement metaphor imposed | awe, nature, challenge, solitude |
| chess | “high IQ” | preference ≠ intelligence measurement | challenge, mastery, pattern/system enjoyment |
| RPGs | “escapist person” | motive is not trait; escape has multiple forms | play, exploration, narrative, sociality |
| cleaning | “anxious/OCD” | sensitive diagnosis | ritual, agency, completion, sensory outcome |
| candles | “homebody” | object → global lifestyle leap | sensory pleasure, aesthetics, ritual |

Cross-domain recurrence is the core mechanism for strengthening hypotheses. It should operate roughly as follows:

**Single signal:** `running` → movement is HIGH as an affordance, mastery/challenge/regulation remain candidates.

**Independent recurrence:** `running + piano practice + chess + coding projects` → mastery/challenge becomes substantially more plausible because it appears across physical, musical, game and work domains.

**Explicit confirmation:** if the user also says “I love seeing myself get better”, mastery/progress moves above other explanations.

**Counter-evidence:** if the user says “I don't care about improving; I run because it clears my head”, mastery should immediately fall while state regulation rises. Explicit reason should outrank the prior.

The same logic applies to weak priors. Luxury hotel + designer clothing should **not** be enough to assert status orientation. Luxury hotel + limited editions + exclusive member venues + explicit interest in rarity/prestige gives a stronger status/distinction hypothesis, while repeated focus on fabrics, architecture, tasting and scent might instead favour sensory/aesthetic refinement. Luxury research supports both signalling and other value dimensions, making this competition between explanations essential. citeturn8search11turn8search13

The following table contains **100 abstract cross-domain examples**—four independent manifestations for each of 25 mechanisms. These are pattern-training examples, not personas.

| Mechanism | Example A | Example B | Example C | Example D |
|---|---|---|---|---|
| **sensory pleasure** | dark chocolate → perfume → linen → hi-fi music | specialty coffee → ceramics → flowers → interior materials | fresh bread → sea air → warm bath → acoustic timbre | tasting menu → material architecture → skincare texture → vinyl |
| **savouring** | wine tasting → sunset → slow jazz → gallery | tea ritual → slow travel → long breakfast → perfume sampling | specialty coffee → garden walk → poetry → craft observation | dessert tasting → scenic train → bath → acoustic set |
| **stimulation** | electronic music → tennis → street market → action film | punk concert → competitive game → busy city → party | fast cycling → thriller → nightlife → spicy food | dance class → stadium → festival → fast strategy game |
| **emotional intensity** | melancholic music → drama → literary fiction → figurative art | horror → storm → tragic opera → dark poetry | romance → memoir → live ballad → family photographs | documentary → historical novel → memorial → sad playlist |
| **mood regulation** | running → comfort playlist → bath → familiar series | forest → ambient music → tea → yoga | dance music → cooking → comedy → friend dinner | swimming → reading → gardening → evening film |
| **restoration** | forest → slow holiday → quiet reading → gardening | sea → spa → ambient music → park | familiar countryside → tea → yoga → hobby | botanical garden → slow breakfast → gentle swim → poetry |
| **comfort/familiarity** | family recipe → sitcom → repeat beach → coffee | childhood dessert → old album → favourite neighbourhood → board game | regular café → annual holiday → familiar author → weekly dinner | known running route → comfort series → favourite tea → home ritual |
| **nostalgia** | teenage playlist → family dish → hometown → old film | childhood book → holiday tradition → vintage object → school sport | old perfume → photographs → repeat city → classic game | legacy band → grandparent recipe → historic neighbourhood → reunion |
| **movement pleasure** | running → dance → swimming → walking | cycling → hiking → yoga → club dancing | rowing → tennis → gardening → walking tour | skiing → social dance → paddleboarding → park walk |
| **embodied intensity** | boxing → chilli → cold swim → energetic dance | sprints → sauna → mountain biking → loud bass | climbing → hot curry → surfing → thrill ride | heavy lifting → rough-sea swim → fast skiing → drumming |
| **challenge** | bouldering → strategy game → complex recipe → research | tennis drill → hard piano piece → philosophy → coding | mountain hike → language → escape room → bread making | race training → chess problem → DIY → history research |
| **mastery** | piano → chess → running plan → coding | baking → tennis serve → photography → language | coffee brewing → woodworking → strategy game → drawing | swimming technique → knife skills → gardening → music production |
| **achievement/progress** | half-marathon → chess rating → shipped project → language milestone | lifting PB → game rank → reading target → craft | climbing grade → certificate → garden project → repertoire | cycling distance → puzzle streak → portfolio → baking benchmark |
| **autonomy** | solo itinerary → project → freestyle cooking → run | road-trip route → research → DIY décor → open-world game | backpacking → improvisation → self-paced fitness → writing | museum day → freelance craft → experiment → photo walk |
| **exploration** | city wandering → hiking → open-world game → market | museum hopping → neighbourhoods → record digging → trail | road trip → bookshops → street food → photography | island hopping → garden → sandbox game → architecture walk |
| **curiosity** | science book → museum → documentary → research | biography → historical travel → podcast → collecting | mystery → strategy analysis → food origins → architecture history | astronomy → etymology → wine regions → maker videos |
| **cognitive complexity** | jazz → literary novel → abstract art → strategy | philosophy → arthouse film → board game → experimental music | conceptual art → history → chess → systems project | poetry → architecture → mystery → data puzzle |
| **flow/absorption** | coding → piano → climbing → strategy game | painting → running → cooking → photography | woodworking → dance → chess → research | gardening → music production → swimming → writing |
| **play** | board games → improv → styling → beach games | casual gaming → dance party → experimental cooking → costume | puzzle night → karaoke → water play → decorating | role-play → social sport → comedy → maker hobby |
| **aesthetic pleasure** | architecture → clothing → art → garden design | plated food → cinematography → ceramics → interiors | calligraphy → classical music → landscape → watch design | typography → fashion → product design → museum objects |
| **awe** | mountains → monumental architecture → orchestra → astronomy | stormy sea → installation → ruins → cosmic documentary | desert sky → vast interior → choral music → canyon | glacier → monumental sculpture → space science → epic cinema |
| **belonging** | team sport → fan group → book club → gaming guild | dance community → café regulars → craft group → fandom | running club → family tradition → hobby group → board-game circle | professional community → festival fandom → sports club → creative group |
| **intimacy/attachment** | partner dinner → family holiday → close-friend walk → bedtime ritual | cooking together → shared playlist → road trip → evening at home | parent-child reading → anniversary place → close-friend café → recipe | conversation → garden project → co-op activity → couple destination |
| **shared experience** | film night → meal → road trip → co-op game | concert → museum → cooking → paired hike | sport viewing → book club → coffee → travel | board game → festival → family series → class |
| **collective energy** | stadium → festival → concert → mass dance | club floor → marathon crowd → sing-along → team celebration | arena → fan zone → group fitness → street celebration | festival stage → sports final → dance event → crowd performance |

These patterns should be interpreted conjunctively, not mechanically. For example, `spicy food + loud concert + cold-water swimming` may support embodied/sensory intensity; but adding `literary tragedy` does not automatically mean the same “intensity” construct explains everything—the latter may be emotional rather than bodily intensity. Maintaining the fine distinctions in the function taxonomy is what prevents superficially attractive but psychologically vague summaries.

**Research-quality judgement:** **WELL SUPPORTED** — cross-domain evidence should be more informative than isolated preferences because it reduces dependence on a single ambiguous item; explicit user statements should dominate generic priors. **PLAUSIBLE BUT CONTEXT DEPENDENT** — the exact amount by which each additional signal should raise confidence. **DO NOT DEFAULT TO THIS** — treating mere repetition of loosely similar labels as proof of a latent trait.

## Safe priors and JSON implementation

The safest production architecture separates **objective affordances**, **research priors** and **user-level inference**.

An objective affordance is something genuinely present in the experience: running involves movement; tasting involves sensory exposure; a ranked tennis match contains competition; a live concert contains sound and live co-presence. A research prior says a function is common among people who engage with that experience. A user-level inference says that *this person* probably likes it for that reason. Only the first two can be pre-populated from the KB. The third requires evidence accumulation.

Recommended default-prior policy:

| Rule class | Production status | Example | Required guardrail |
|---|---|---|---|
| **Structural affordance** | Safe default candidate | running → movement; tournament → competition | Describe the experience, not personality. |
| **Strong replicated function** | Default candidate with M/H prior | nature → restoration; sport → competence/enjoyment | Keep alternatives alive. citeturn6search7turn4search0 |
| **Common heterogeneous motive** | Candidate only | travel → novelty; fiction → detachment | Do not elevate without cross-validation. |
| **Nostalgia** | Usually cross-validation | old music/place/food | Raise with autobiographical/family/time cues. |
| **Escape/detachment** | Cross-validation | games, books, travel | Do not equate with maladaptive avoidance. citeturn7search0 |
| **Status/distinction** | Cross-validation only | luxury fashion/travel/dining | Require exclusivity/prestige/rank signals across items. citeturn8search11 |
| **Collective energy** | Context-dependent | stadium/festival | Require live synchrony/crowd context; do not substitute for intimacy. citeturn7search1 |
| **Attachment/intimacy** | Strong only for close relational objects | partner/child/close friend | Do not infer attachment style. citeturn11search2 |
| **Trait interpretation** | Do not encode as automatic motive | running → discipline; chess → intelligence | Block. |
| **Sensitive attribute inference** | Never infer from preferences | politics, religion, sexuality, health, ethnicity, criminality, addiction | Hard safety rule. |

A useful runtime scoring model is ordinal rather than pseudo-precise:

\[
\text{UserFit}(f) =
P_{\text{class}}(f)
+ E_{\text{explicit}}(f)
+ X_{\text{cross-domain}}(f)
+ C_{\text{context}}(f)
- A_{\text{alternative-fit}}
- K_{\text{counterevidence}}
\]

Here `P_class` is **not a statistical probability** unless subsequently calibrated. It is a prior-strength band. Explicit explanation should have the highest practical weight; independent cross-domain recurrence should be next; broad category priors should usually be weaker.

For example:

```text
Input
running
piano
chess
coding side projects
quiet forest walks

Candidate evidence
running -> movement [structural]
running -> mastery [medium prior]
piano -> mastery [medium/high]
chess -> mastery/challenge [medium/high]
coding projects -> mastery/challenge/creation [medium/high]
forest -> restoration [high]

Output hypotheses
1. mastery / skill refinement          HIGH user-fit
2. challenge                           MEDIUM/HIGH
3. restoration                         MEDIUM, distinct secondary pattern
4. movement pleasure                   HIGH for running specifically,
                                       LOW as a universal cross-domain mechanism

Rejected overreach
"disciplined personality"
"high intelligence"
"competitive person"
```

The fact that restoration appears beside mastery should **not** reduce the analysis to a single axis such as “high intensity versus calm”. People can repeatedly value multiple complementary kinds of positive experience. The desired product output is a small **mixture of recurring mechanisms**, not necessarily one master explanation.

Recommended JSON structure:

```json
{
  "preference_class": {
    "domain": "sport",
    "subdomain": "endurance",
    "experience_type": "running",
    "examples": ["running", "jogging"],
    "objective_affordances": [
      "movement_pleasure"
    ],
    "candidate_functions": [
      {
        "function_id": "mastery",
        "evidence_strength": "MEDIUM_HIGH",
        "evidence_scope": "endurance_physical_activity",
        "why_rewarding": "Repeated practice can make skill and capacity improvement rewarding.",
        "alternatives": [
          "movement_pleasure",
          "achievement_progress",
          "mood_regulation",
          "autonomy"
        ],
        "confidence_up": [
          "explicit enjoyment of improvement",
          "mastery recurs in unrelated domains"
        ],
        "confidence_down": [
          "user explicitly rejects performance goals",
          "running described only as relaxation or social time"
        ],
        "forbidden_inferences": [
          "disciplined_personality"
        ],
        "sources": [
          "source_id_sport_review",
          "source_id_sdt_review"
        ]
      }
    ]
  }
}
```

At user-analysis time, keep a separate evidence object:

```json
{
  "hypothesis": {
    "function_id": "mastery",
    "user_fit_confidence": "HIGH",
    "support": [
      {"preference": "running", "weight": "medium"},
      {"preference": "piano", "weight": "medium_high"},
      {"preference": "chess", "weight": "medium_high"},
      {"preference": "coding projects", "weight": "medium_high"}
    ],
    "counterevidence": [],
    "competing_functions": [
      "challenge",
      "achievement_progress"
    ],
    "safe_wording": "A recurring thread may be enjoyment of getting better at something through repeated engagement."
  }
}
```

Several additional schema fields would materially improve reliability:

| Field | Why it matters |
|---|---|
| `evidence_scope` | Prevents evidence about “exercise” being presented as boxing-specific evidence. |
| `affordance_vs_motive` | Prevents “contains movement” from becoming “likes it because of movement”. |
| `user_fit_confidence` | Keeps scientific evidence strength separate from individual inference. |
| `alternative_functions` | Forces competing explanations to remain available. |
| `confidence_up` / `confidence_down` | Implements cross-validation rather than static mappings. |
| `explicit_user_reason` | Allows direct explanation to override priors. |
| `contradictory_signal_ids` | Makes counter-evidence first-class. |
| `sensitive_inference_block` | Prevents downstream generation from bypassing guardrails. |
| `culture_scope` | Records whether evidence may be culturally narrow. |
| `evidence_date` | Allows literature refresh and deprecation. |
| `evidence_type` | Separates meta-analysis, review, individual study and theoretical source. |
| `version` | Allows ontology changes without silently changing old analyses. |

The LLM prompt should contain three particularly strong procedural rules:

> **Generate hypotheses before choosing one.** A preference normally gets at least two plausible functions unless its interpretation is nearly structural.

> **Explain why confidence changed.** “Mastery is more plausible because it recurs in running, piano and chess” is preferable to an ungrounded statement that the person “values mastery”.

> **Use specific positive-experience language, not identity labels.** “These activities may make progress itself rewarding” is preferable to “you are achievement-oriented”.

Sensitive preferences require a separate hard boundary. Political, religious, health, psychiatric, sexual-orientation, ethnic, criminality and addiction attributes should not be derived from preference patterns. A sensitive-domain item may sometimes be described only at the experiential level—for example, participation in a large event might involve shared attention or ritual—but the model should not propagate that item into an inferred political or religious identity.

## Uncertainties, research quality and next steps

The largest limitation is that **most relevant literature studies motives, experiences or outcomes in particular domains rather than the exact inference problem «Между строк» poses**. A meta-analysis can establish that competence or enjoyment commonly matters in sport, but it does not provide a validated likelihood ratio for `running → mastery` in an arbitrary user's preference list. The initial confidence values should therefore remain ordinal priors rather than numerical probabilities. citeturn4search0turn4search1

Evidence quality also varies substantially by domain. Basic-needs theory has very large meta-analytic evidence bases. citeturn14view0turn14view1 Nature/restoration and vacation recovery have systematic/meta-analytic support. citeturn6search7turn14view6 Music emotion-regulation evidence has grown but remains heterogeneous. citeturn9search1turn9search4 Cooking and hobbies have promising but considerably thinner causal evidence. citeturn5search2turn13search7 Aesthetic research strongly supports multidimensionality, but predicting a specific individual's motive from “minimalism”, “abstract art” or another style is much less secure. citeturn14view7turn8search2

Several areas should therefore **not receive hard rules yet**:

| Area | Evidence gap | Current KB policy |
|---|---|---|
| Fine-grained music genres | Large within-genre and listener variability | Infer from acoustic/contextual description where possible; keep genre priors weak. |
| Specific book genres | Reading research is richer for fiction broadly than for every subgenre | Use narrative affordances; avoid genre-personality mappings. |
| Specific film genres other than horror | Motive-specific meta-analytic evidence is uneven | Treat tension, humour, aesthetics etc. as hypotheses. |
| Brand-level interpretation | Brand meanings vary by country, period and subculture | Map brand → observable product/aesthetic/social attributes first. |
| City/country preference | Reasons are profoundly person- and memory-dependent | Near-zero motive prior until layers/context are available. |
| Home rituals | Many mechanisms are theoretically plausible but less directly studied | Medium/low priors except obvious sensory/structural affordances. |
| “Status” | Often confounded with quality, aesthetics, scarcity and identity | Low prior; require cross-validation. |
| “Escape” | Can describe benign detachment or problematic coping | Never pathologise; require context. citeturn7search0 |
| Sensation seeking | Individual-difference links vary by activity and study | Do not make it a default inferred function/trait. citeturn9search0turn4search3turn5search3 |
| Self-expansion | Valid theoretical construct but overlaps multiple atomic functions in this application | Represent as a derived pattern of novelty + learning/perspective + relational expansion. citeturn2search3 |
| Hedonic/eudaimonic wellbeing | Important outcome distinction, but too broad as preference motive | Use as analytic metadata rather than direct function; recent review notes construct proliferation. citeturn13search0 |

A deeper validation programme should focus less on collecting ever more descriptive studies and more on **testing the ontology itself**. The highest-value next research resources would be one lead behavioural-science researcher, domain reviewers for food/music/media/travel/sport, a statistician or psychometrician, and a data/knowledge engineer. A robust validation corpus would ideally include a substantially larger set of directly relevant meta-analyses/systematic reviews, dual-coded evidence for ambiguous function assignments, and an expert-reviewed benchmark containing preference bundles with explicit user explanations. The key evaluation is not whether the model can guess a hidden “true personality”, but whether it can **retain plausible alternatives, privilege explicit explanations, detect cross-domain recurrence, recognise counter-evidence and avoid unsafe overreach**.

Useful evaluation metrics would include: false-positive function rate; proportion of outputs retaining a credible competing hypothesis; agreement with users' stated reasons; sensitivity to explicit counter-evidence; calibration of HIGH/MEDIUM/LOW confidence; sensitive-inference violation rate; stereotype violation rate; and stability under paraphrases or different preference ordering. These metrics are proposed engineering criteria rather than established psychological measures.

The first production version should therefore treat the KB as a **versioned hypothesis generator**. It can safely encode structural affordances and well-replicated function priors; it should keep context-dependent motives weak; and it should make unsupported trait and sensitive inference impossible at the schema/prompt level rather than merely discouraging them in prose.

## Sources

The following are the most consequential sources underpinning the synthesis; the accompanying workbook organises them by evidence family rather than as a conventional bibliography.

| Evidence area | Key source and relevance |
|---|---|
| Basic psychological needs | *Interpersonal supports for basic psychological needs and their relations with motivation, well-being, and performance: A meta-analysis* (2024), DOI `10.1037/pspi0000459`. Large meta-analysis supporting autonomy, competence and relatedness mechanisms. citeturn14view0 |
| Work motivation | Hagger & McAnally Star, *Self-Determination Theory and Workplace Outcomes: A Meta-Analysis* (2026), DOI `10.1002/smi.70151`. citeturn14view1 |
| Reward architecture | Berridge, Robinson & Aldridge, *Dissecting components of reward: “liking”, “wanting”, and learning* (2009), DOI `10.1016/j.coph.2008.12.014`; the distinction remains central in later reward theory. citeturn15search5turn15search4 |
| Curiosity | Poli et al., *Curiosity and the dynamics of optimal exploration* (2024), DOI `10.1016/j.tics.2024.02.001`. citeturn15search0 |
| Epistemic curiosity | *An Integrative Appraisal Model of Epistemic Curiosity* (2025/2026), integrating information-gap, affect and reward-anticipation accounts. citeturn15search1 |
| Awe | Pérez et al., experimental awe meta-analysis covering 84 studies and 17,801 participants; supports awe as distinguishable from generic positive affect. citeturn2search1 |
| Savouring | Chen et al., *Effectiveness of savoring interventions* (2026), systematic review/meta-analysis of 20 RCTs and 4,805 participants; pooled effect `g = 0.51`. citeturn15search3 |
| Ritual | Hobson et al., *The Psychology of Rituals: An Integrative Review and Process-Based Framework* (2018), DOI `10.1177/1088868317734944`; identifies emotional, performance-state and social regulatory functions. citeturn15search2 |
| Self-expansion | Aron & Tomlinson (2026) review of self-expansion and relationships, supporting novel/challenging shared activity as one relational pathway. citeturn2search3 |
| Flow | Recent flow review/meta-analytic literature supports absorption, challenge–skill balance, goals and feedback while cautioning against equating every challenging activity with flow. citeturn12search0turn12search3 |
| Sport participation | 2024 systematic review of adult sport participation, covering 91 articles; enjoyment and health were prominent facilitators amid a multi-level motivational structure. citeturn4search0 |
| Exercise motivation | Systematic review of SDT and exercise, supporting autonomous motivation and competence while showing multiple motives coexist. citeturn4search1 |
| Adventure/extreme sport | 2024 systematic review of 35 studies; nature, freedom, challenge, capability, sociality and risk-management themes argue against a simple thrill-seeking model. citeturn4search3turn4search4 |
| Sport spectatorship | Meta-analytic and qualitative work on attendance/fanship and live-versus-mediated viewing supports identification, entertainment and socialisation while showing live attendance has distinctive affordances. citeturn4search5turn4search6 |
| Food choice | Fernqvist & Spendrup (2024), systematic review of reviews on food choice; sensory, contextual, social, cultural and individual determinants interact. citeturn3search3 |
| Comfort food | 2025 Annual Review synthesis highlighting heterogeneous definitions and links to familiarity/social experience rather than a single pathological mechanism. citeturn5search1 |
| Cooking | Systematic review of cooking interventions; possible benefits include socialisation, affect and self-efficacy-like outcomes, with generally limited evidence quality. citeturn5search2 |
| Chilli/spicy food | Review of chilli preference showing contributions from culture, repeated exposure, biology and other factors. citeturn5search3 |
| Consumption rituals | Review of food/drink rituals and psychosocial outcomes, supporting social and affective possibilities while noting limited mechanistic evidence. citeturn5search6 |
| Music functions | Major review of functions of music listening identifies broad recurrent families including arousal/mood regulation, self-awareness and social relatedness. citeturn9search3 |
| Music emotion regulation | Meta-analytic/systematic-review evidence supports modest emotion-regulatory effects while showing substantial heterogeneity. citeturn9search4turn9search1 |
| Sad music | Integrative review identifies nostalgia, being moved, imagination, social-surrogacy and regulatory mechanisms rather than one explanation. citeturn9search5 |
| Live music | Systematic review of social outcomes from live music, relevant to shared emotion, synchrony and collective experience. citeturn7search6 |
| Fiction | Preregistered meta-analyses find small cognitive/social-cognitive effects of fiction and strong dependence on study design; useful evidence against “fiction reader = empathic person”. citeturn3search1turn3search4 |
| Reading and wellbeing | Realist review identifies mechanisms including respite from stress, perspective taking, memory, intellectual stimulation and collective meaning-making. citeturn3search5 |
| Horror | Horror-film review plus recent experimental work supports suspense/excitement and curiosity while finding heterogeneous individual differences. citeturn9search2turn9search0 |
| Rewatching media | 2026 review identifies comfort, emotion regulation, social connection, nostalgia and identity continuity as possible functions. citeturn9search9 |
| Vacation/recovery | Grant, Buchanan & Shockley, *I need a vacation: A meta-analysis of vacation and employee well-being* (2025), DOI `10.1037/apl0001262`; 32 studies and 256 effects, with detachment and activity relevant to benefits. citeturn14view6 |
| Tourism motivation | Half-century tourism-motivation synthesis identifies recurring motives such as curiosity, play/boredom alleviation, biophilia, intimate-bond reinforcement and ego-enhancement, while warning that the literature often conflates motives with outcomes, emotions and traits. citeturn6search6 |
| Place attachment | Scannell & Gifford's person–process–place framework plus recent urban favourite-place work support a layered physical/social/personal model rather than national stereotypes. citeturn6search12turn6search5 |
| Nature | Systematic reviews/meta-analyses of green/nature exposure support restorative and affective benefits while also revealing heterogeneity. citeturn6search2turn6search7turn13search8 |
| Aesthetic experience | Cardillo & Chatterjee, *Aesthetic experience: Foundations, tensions, and new directions* (2026), DOI `10.1016/j.copsyc.2026.102402`, plus large-scale empirical mapping of aesthetic experiences; both support a multidimensional model beyond beauty alone. citeturn14view7turn8search2 |
| Transformative art | Systematic review of transformative aesthetic experience, supporting disruption, reflection and meaning as possible responses. citeturn8search1 |
| Fashion/luxury | Systematic reviews of luxury consumption and status signalling show that status is real but sits alongside authenticity, value, aesthetics and other motives. citeturn8search11turn8search13 |
| Identity expression | Systematic review of identity expressiveness in consumption/marketing supports self-expression as a legitimate function without licensing sensitive-identity inference. citeturn8search14 |
| Belonging | Contemporary review conceptualises belonging as subjective connection with social groups, places and experiences. citeturn11search5 |
| Attachment | Adult attachment review supports keeping close-bond attachment conceptually separate from group belonging. citeturn11search2 |
| Care | Meta-analysis of communal motivation across 100 studies and 26,645 participants supports care-oriented relational motivation as distinct from generic sociability. citeturn11search9 |
| Shared experience | Experimental programmes show that shared experience can intensify experience and that people may seek co-experience for connection even without a simple hedonic boost. citeturn10search0turn10search3 |
| Collective energy | Meta-analysis of collective effervescence, `k=50`, `N=182,738`, supports intense shared emotional activation/unison and its links with communal sharing and integration. citeturn7search1 |
| Gaming | Cheah, Shimul & Phau, systematic review of 91 papers on digital-game motivations, identifies immersion/flow, gratification/affect, escape, social interaction, identification and goal orientation. citeturn14view8 |
| Gaming escape | 2026 meta-analysis on escapism and gaming underscores why “escape” needs contextual treatment and should not become an automatic disorder inference. citeturn7search0 |
| Hobbies | 2025 scoping review finds pleasure, relaxation, growth and social connection recurring in hobby research while causal evidence remains limited. citeturn13search7 |

The central design conclusion is therefore robust: **the knowledge base should encode affordances and competing experiential functions, while the LLM's job is to discover which functions recur across a person's otherwise unrelated preferences.** The most useful output is not “what kind of person likes these things?”, but “which forms of rewarding experience appear repeatedly here, what else could explain them, and how much independent evidence supports each interpretation?”