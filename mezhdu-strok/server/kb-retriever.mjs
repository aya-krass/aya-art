import reportKB from '../knowledge/preference-kb.report-derived.v1.json' with {type:'json'};
import reportTaxonomy from '../knowledge/function-taxonomy.v1.json' with {type:'json'};
import reportTraps from '../knowledge/interpretation-traps.v1.json' with {type:'json'};
import reportDistinctions from '../knowledge/distinctions.v1.json' with {type:'json'};
export const bundleFunctionIds=new Set(reportTaxonomy.functions.map(f=>f.id));
const retrievalRows=new Map(reportKB.rows.map(r=>[r.experience_type,r]));
export function retrieveKnowledge(classifications){return classifications.map(c=>{
 const row=retrievalRows.get(c.experience_type);const candidates=(row?.candidate_functions||[]).filter(f=>bundleFunctionIds.has(f.function_id));
 const exact=c.classification_confidence==='HIGH';
 return {item_id:c.item_id,experience_type:c.experience_type,domain:c.domain,matched_row_ids:row?[row.id]:[],retrieval_scope:row?exact?'classified_class':'tentative_class':'no_defensible_class',objective_affordances:row?.objective_affordances||[],candidate_functions:c.experience_type==='specific_city_country_place'?[]:candidates.slice(0,5).map(f=>({...f,evidence_strength:exact?f.evidence_strength:f.evidence_strength==='HIGH'?'MEDIUM_HIGH':f.evidence_strength==='MEDIUM_HIGH'?'MEDIUM':f.evidence_strength})),caution:row?.caution??null,source_line:row?.source_line??null};
 })}
export function relevantBundleRules(retrieved){const functions=new Set(retrieved.flatMap(r=>r.candidate_functions.map(f=>f.function_id)));return {distinctions:reportDistinctions.rules,hard_non_equivalences:reportDistinctions.hard_non_equivalences,traps:reportTraps.traps,sensitive_inference_block:reportTraps.sensitive_inference_block,taxonomy:reportTaxonomy.functions.filter(f=>functions.has(f.id)).map(({id,name,definition,not_equivalent_to})=>({id,name,definition,not_equivalent_to}))}}
export function knowledgeSnapshot(){return {kb_version:reportKB.version,derivation:reportKB.derivation,visible_table_classes:reportKB.actual_visible_row_count,visible_example_classes:reportKB.visible_example_derived_classes,total_runtime_classes:reportKB.rows.length,functions:reportTaxonomy.functions.length,traps:reportTraps.traps.length}}

export function bundleTaxonomy(){return reportTaxonomy.functions.map(({id,definition})=>({id,definition}))}
