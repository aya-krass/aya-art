import reportTraps from '../knowledge/interpretation-traps.v1.json' with {type:'json'};
import {canonicalLabel} from './parser.mjs';
// Output lint: these patterns target positive assertions, not source preferences.
const blockedOutputPatterns=[
 /(?:running|бег|chess|шахматы|boxing|бокс|wine|вино|parties|вечеринки|luxury|люкс|classical music|классическая музыка)\s*(?:→|->|means|implies|означает|значит)\s*(?:disciplin|дисциплин|intelligen|high iq|iq|интеллект|aggress|агресси|hedonis|гедони|extrover|экстравер|materialis|материали|sophisticat)/iu,
 /(?:you (?:are|have)|у (?:тебя|вас)|ты|вы)\s+(?:probably |likely |вероятно )?(?:a |an )?(?:high iq|anxious|ocd|depressed|addict|dependent|reckless|fearless|superficial|insecure|attention.seek|глуп|умн|неглубок|поверхностн)/iu,

 /\b(?:you are|you re) (?:an? )?(?:disciplined|angry|aggressive|extrovert|intelligent|hedonist|materialistic|romantic|family.oriented)/iu,
 /(?:ты|вы)\s+(?:очень\s+)?(?:дисциплинированн|агрессивн|экстраверт|интеллектуал|гедонист|материалист|семейн(?:ый|ая) человек)/iu,
 /(?:у тебя|у вас)\s+(?:высокий iq|депресси|окр|зависимость|тревожное расстройство)/iu,
 /(?:япони[яю]|japan)\s*(?:→|->|значит|поэтому|means)\s*(?:порядок|order)/iu,
 /(?:армени[яю]|armenia)\s*(?:→|->|значит|поэтому|means)\s*(?:гостеприим|hospitality)/iu,
 /(?:париж|paris)\s*(?:→|->|значит|поэтому|means)\s*(?:романти|romantic)/iu,
 /(?:твоя|ваша)\s+(?:сексуальная ориентация|политическая принадлежность|этническая принадлежность|религия|психиатрический диагноз)/iu
];
const reportBlockedPhrases=reportTraps.traps.map(trap=>canonicalLabel(trap.blocked_inference));
export function assertSafeOutput(texts){for(const text of texts)if(typeof text==='string'){const normalized=canonicalLabel(text);if(blockedOutputPatterns.some(pattern=>pattern.test(text.replace(/[“”«»"]/g,'')))||reportBlockedPhrases.some(phrase=>phrase.length>5&&normalized.includes(phrase)))throw Object.assign(Error('Unsupported inference in output'),{check:'unsupported_trait_or_sensitive_inference'});}return true}
