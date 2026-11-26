const crypto = require("crypto");
const WORDS = "about above actor acute adapt admit adopt adult after again agent agree ahead alarm album alert alike alive allow alone along alter amber among ample angel anger angle angry ankle apart apple apply arena argue arise armor array arrow aside asset atlas audio avoid awake award aware badge baker basic basin basis beach beard beast begin being belly below bench berry birth black blade blame blank blast blaze bleak blend bless blind block blood bloom board boast bonus boost booth bound brain brake brand brave bread break breed brick bride brief bring broad brook brown brush build bunch burst buyer cabin cable camel candy canoe carry carve catch cause cedar chain chair chalk charm chart chase cheap check cheek cheer chess chest chief child chill choir chord chunk cider cigar civic claim clash class clean clear clerk click cliff climb clock close cloth cloud clown coach coast cobra coral couch cough could count court cover crack craft crane crash crawl crazy cream creek crest crisp cross crowd crown cruel crush curve cycle daily dance dairy dealt death debut decay delay delta dense depth diary dirty ditch dizzy donor doubt dough dozen draft drain drama drank drawn dream dress dried drift drill drink drive drove dwarf eager eagle early earth easel eight elbow elder elect elite email empty enemy enjoy enter entry equal error essay event every exact exile exist extra fable faint fairy faith false fancy fatal feast fence ferry fever fiber field fiery fifth fifty fight final first flame flash fleet flesh float flock flood floor flour fluid flute focus force forge forth forum found frame frank fraud fresh front frost fruit fully gamma gauge ghost giant given glade glass gleam globe gloom glory glove grace grade grain grand grant grape graph grasp grass grave great greed green greet grief grill grind groom gross group grove grown guard guess guest guide guild habit happy harsh haste haunt heart heavy hedge hello hence honey honor horse hotel house human humor hurry ideal image imply index inner input irony ivory jelly jewel joint joker judge juice karma knife knock label labor lance large laser later laugh layer learn lease least leave legal lemon level lever light limit linen liver lobby local lodge logic loose lover lower loyal lucky lunar lunch magic major maker maple march marry match mayor meant medal media melon mercy merge merit metal meter might minor minus mirth model moist money month moral motor mount mouse mouth movie music naive nerve never newly night noble noise north novel nurse ocean offer olive onion opera orbit order organ other ought outer owner oxide paint panel paper party pasta patch pause peace pearl pedal penny phase phone photo piano piece pilot pinch pitch pixel pizza place plain plane plant plate plaza point polar pound power prank press price pride prime print prior prize proof proud prove pulse punch pupil queen query quest quick quiet quote radar radio raise rally ranch range rapid ratio reach react ready realm rebel refer reign relax reply rider ridge rifle right rigid risky rival river roast robin robot rocky rouge rough round route royal rural sable saint salad sauce scale scene scent scope score scout sense serve seven shade shake shape share sharp sheep sheet shelf shell shift shine shirt shock shore short shout sight silly since sixth skill skirt slate sleep slice slide slope small smart smile smoke snake solar solid solve sorry sound south space spare spark speak speed spend spice spike spine spoke sport spray squad stack staff stage stain stair stake stamp stand stare start state steam steel steep steer stick stiff still stock stone stood store storm story stove strap straw strip study stuff style sugar suite sunny super surge swamp swear sweet swift swing sword table taste teach tempo tenth thank theme there thick thing think third thorn those three threw throw thumb tiger tight timer title toast today token tonic tooth topic torch total touch tough tower toxic trace track trade trail train trait trash treat trend trial tribe trick tried troop truck truly trust truth tulip twice twist ultra uncle under union unite unity until upper upset urban usage usual valid value valve vapor vault verse vigor vinyl viral visit vital vivid vocal voice voter wagon waist waltz waste watch water weary weave wedge weigh weird whale wheat wheel where which while white whole whose widow width witch woman world worry worse worth would wound wrist write wrong yacht yield young youth zebra".split(" ").filter(w => w.length === 5);

// The answer travels only inside this encrypted token. Without WORD_SECRET nobody can read it.
const key = () => crypto.createHash("sha256").update(process.env.WORD_SECRET || "set-WORD_SECRET-in-vercel").digest();
function seal(obj) {
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([c.update(JSON.stringify(obj)), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), enc]).toString("base64url");
}
function open(token) {
  try {
    const b = Buffer.from(String(token), "base64url");
    const d = crypto.createDecipheriv("aes-256-gcm", key(), b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    return JSON.parse(Buffer.concat([d.update(b.subarray(28)), d.final()]).toString());
  } catch (e) { return null; }
}
function judge(g, a) {
  const res = Array(5).fill("ab"), pool = {};
  [...a].forEach((ch, i) => { if (g[i] === ch) res[i] = "ok"; else pool[ch] = (pool[ch] || 0) + 1; });
  [...g].forEach((ch, i) => { if (res[i] !== "ok" && pool[ch]) { res[i] = "pr"; pool[ch]--; } });
  return res;
}
async function isWord(w) {
  if (!/^[a-z]{5}$/.test(w)) return false;
  if (WORDS.includes(w)) return true;
  try {
    const r = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + w, { signal: AbortSignal.timeout(4000) });
    if (r.status === 200) return true;
    if (r.status === 404) return false;
  } catch (e) {}
  return true; // dictionary unreachable: accept any five letters
}
async function randomWord() {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch("https://random-word-api.herokuapp.com/word?length=5", { signal: AbortSignal.timeout(4000) });
      const [w] = await r.json();
      if (/^[a-z]{5}$/.test(w) && await isWord(w)) return w;
    } catch (e) {}
  }
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}
module.exports = { seal, open, judge, isWord, randomWord };
