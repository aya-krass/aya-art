import reportKB from '../knowledge/preference-kb.report-derived.v1.json' with {type:'json'};
import {canonicalLabel} from './parser.mjs';
const classRows=new Map(reportKB.rows.map(r=>[r.experience_type,r]));
// Language routing only. Priors and functions are always retrieved from report-derived rows.
const classLexicon=[
 ['partner',['жена','муж','партнер','партнёр','wife','husband','partner','girlfriend','boyfriend']],['children',['дочь','сын','ребенок','дети','child']],['family',['семья','родители','family']],['friends',['друзья','friends','близкий друг']],
 ['live_sport_stadium',['стадион','stadium','live sport']],['festival_music',['фестиваль','festival']],['live_music',['концерт','концерты','concert','live music']],
 ['watching_sport',['смотреть футбол','смотреть регби','watch football']],['watching_with_friends',['смотреть с друзьями','watching with friends']],
 ['piano_practice',['пианино','фортепиано','piano','играть на рояле']],['coding_projects',['coding','кодинг','программировать','кодить','side project','писать код']],
 ['endurance_sport_running_cycling_swimming',['бег','бегать','пробежка','пробежки','пробежку','running','jogging','велосипед','cycling','плавать','swimming']],['combat_sport',['бокс','boxing']],['strength_training',['силовые','тренажерный зал','weight training']],['outdoor_adventure_sport',['сноуборд','snowboarding','snowboard','хайкинг','hiking','climbing','скалолазание','дайвинг']],
 ['strategy_games',['шахматы','chess','strategy games','стратегии','настольные игры']],['competitive_games',['теннис','tennis','ranked games','соревнования']],['dance',['танцы','dance']],['yoga_mind_body',['йога','yoga']],
 ['forest',['лес','лесные','forest']],['gardens_parks',['парк','паркам','парке','park','ботанический сад']],['gardening',['садоводство','gardening','растения','ухаживать за садом']],
 ['morning_coffee_tea',['чайный ритуал','tea ritual','утренний чай','morning coffee']],['coffee',['кофе','coffee']],['tea',['чай','tea']],['wine_tasting',['вино','wine','сидр','cider']],['rich_intense_food',['стейк','стейки','steak','шоколад']],['spicy_food',['острая еда','chilli','острый суп']],['eating_socially',['семейные ужины','ужины вместе','family dinner']],['fine_dining',['ресторан','restaurants','fine dining']],['cooking',['готовить','cooking']],['baking',['выпечка','baking']],
 ['tactile_material_design',['духи','парфюм','perfume','textile','текстиль','фактуры']],['candles_home_ambience',['свечи','candles']],['crafting_improving',['вязать','керамика','ceramics','акварель','watercolour']],
 ['road_trips',['ездить на машине','road trip','путешествовать на машине']],['nature_travel',['природные путешествия','nature travel']],['city_travel',['путешествовать','путешествия','travel']],['specific_city_country_place',['япония','japan','армения','armenia','париж','paris','англия','england','берлин','berlin','лондон','london','вена','vienna','исландия','iceland']],
 ['classical_music',['классическая музыка','classical music']],['rock_metal',['linkin park','линкин парк','metal','рок']],['energetic_music',['техно','techno']],['jazz',['джаз','jazz']],['ambient_music',['ambient','эмбиент']],['nostalgic_music',['музыка детства','ностальгическая музыка']],
 ['nonfiction_science_history',['космос','space','научные','научпоп','national geographic','история']],['biography_memoir',['биографии','memoir','biography']],['literary_fiction',['вулф','чехов','woolf','chekhov']],['philosophy',['философия','philosophy']],['comedy',['friends','комедии']],['horror',['horror','ужасы']],['crime_mystery',['детектив','mystery']],['art_cinema',['артхаус','art cinema']],
 ['luxury_brands',['mugler','rick owens','люксовые бренды','luxury brand']],['fashion_styling',['одежда','fashion']],['abstract_art',['абстрактная живопись','abstract art']],['conceptual_art',['концептуальное искусство','contemporary art']],['parties',['вечеринки','parties','клубы']],['researching',['исследовать','research']],['creating_from_scratch_at_work',['запуск проектов','создавать с нуля']],['independent_work',['работать самостоятельно','independent work']]
];
export function knownClassification(item){
 const text=canonicalLabel(item.label);let match=null;
 for(const [type,aliases] of classLexicon)if(aliases.some(alias=>{const normalized=canonicalLabel(alias);return (' '+text+' ').includes(' '+normalized+' ')})){match=type;break}
 if(!match)return null;return makeClassification(item.item_id,match,'HIGH',true);
}
export function makeClassification(itemId,type,confidence='MEDIUM',known=false,context={}){
 const row=classRows.get(type);if(!row&&type!=='unknown')throw Error('Unknown experience class');
 const active=['sport','games','work'].includes(row?.domain)&&!['live_sport_stadium','watching_sport'].includes(type)||['piano_practice','dance','gardening','cooking'].includes(type);
 const live=['live_sport_stadium','live_music','festival_music','concert_festival_stadium_crowd','parties'].includes(type);
 return {item_id:itemId,domain:row?.domain||'unknown',subdomain:row?.subdomain??null,experience_type:type,context:{active_participation:known?active:context.active_participation??null,live_presence:known&&live?true:context.live_presence??null,close_relationship:['partner','children','family'].includes(type)?true:context.close_relationship??null},classification_confidence:confidence};
}
export function classifyItems(items,modelOutput={items:[]}){
 const modeled=new Map((modelOutput.items||[]).map(c=>[c.item_id,c]));
 return items.map(item=>{const known=knownClassification(item);if(known)return known;const value=modeled.get(item.item_id);if(!value)return makeClassification(item.item_id,'unknown','LOW');if(!['LOW','MEDIUM','MEDIUM_HIGH','HIGH'].includes(value.classification_confidence))throw Error('Invalid classification confidence');return makeClassification(item.item_id,value.experience_type,value.classification_confidence,false,value.context)});
}
export const classifierPrompt=`Определи только observable/defensible experience class каждого item. Не мотив, функцию или личность. Выбери experience_type из переданного каталога. Учитывай активное участие, зрительский/живой контекст, близкие отношения только когда это известно. В unknown оставь всё, что нельзя уверенно классифицировать. Название страны — только specific_city_country_place, не архитектура/порядок/гостеприимство. Для named произведения или бренда не выдумывай свойства. Нельзя превращать зрителя стадиона в игрока, семью в толпу, слушание в живой концерт. Верни каждый входной item_id ровно один раз.`;
export function classificationCatalog(){return reportKB.rows.map(({experience_type,domain,report_label})=>({experience_type,domain,label:report_label}))}
