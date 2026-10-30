import reportTaxonomy from '../knowledge/function-taxonomy.v1.json' with {type:'json'};
import reportKB from '../knowledge/preference-kb.report-derived.v1.json' with {type:'json'};
const bObject=properties=>({type:'object',properties,required:Object.keys(properties),additionalProperties:false});
const bString={type:'string'},bNullString={type:['string','null']},bBool={type:['boolean','null']};
const bArray=(items,min=0,max=100)=>({type:'array',items,minItems:min,maxItems:max});
const bFunction={type:'string',enum:reportTaxonomy.functions.map(f=>f.id)};
const bFit={type:'string',enum:['LOW','MEDIUM','MEDIUM_HIGH','HIGH']};
const bEvidence=bObject({item_id:bString,role:{type:'string',enum:['support']},reason:bString});
const bFinding=bObject({finding_id:bString,primary_function_id:bFunction,secondary_function_ids:bArray(bFunction,0,3),user_fit_confidence:bFit,evidence:bArray(bEvidence,2,12),counterevidence:bArray(bObject({item_id:bString,reason:bString}),0,30),competing_functions:bArray(bFunction,0,8),reason_selected:bString,title:bString,description:bString});
export const bundleSchemas={
 parser:bObject({items:bArray(bObject({item_id:bString,label:bString,source_text:bString,explicit_user_reason:bNullString}),0,100)}),
 classification:bObject({items:bArray(bObject({item_id:bString,experience_type:{type:'string',enum:[...reportKB.rows.map(r=>r.experience_type),'unknown']},context:bObject({active_participation:bBool,live_presence:bBool,close_relationship:bBool}),classification_confidence:bFit}),0,100)}),
 explicit_reasons:bObject({items:bArray(bObject({item_id:bString,confirmed_function_ids:bArray(bFunction,0,6),excluded_function_ids:bArray(bFunction,0,6)}),0,100)}),
 critic:bObject({findings:bArray(bFinding,0,5),unused_items:bArray(bObject({item_id:bString,reason:{type:'string',enum:['no_strong_evidence']}}),0,100)}),
 writer:bObject({headline:bString,headline_accent:bString,main_text:bString,patterns:bArray(bObject({finding_id:bString,title:bString,description:bString}),1,5)}),
 visual_brief:bObject({central_idea:bString,sections:bArray(bObject({meaning:bString,caption:bString,evidence:bArray(bString,1,12),visual_metaphor:bString,image_prompt:bString}),1,5),highlight_connection:{anyOf:[{type:'null'},bObject({item_1_id:bString,item_2_id:bString,meaning:bString})]}})
};
