const { seal, open, judge, isWord } = require("./_lib");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).end();
  const { token, guess } = req.body || {};
  const s = open(token), g = String(guess || "").toLowerCase();
  if (!s || !/^[a-z]{5}$/.test(g) || s.n >= 6) return res.status(400).json({ error: "bad request" });
  if (!(await isWord(g))) return res.json({ valid: false });
  const n = s.n + 1, won = g === s.w;
  const out = { valid: true, res: judge(g, s.w), won, token: seal({ w: s.w, n }) };
  if (!won && n >= 6) out.answer = s.w; // only revealed once the game is lost
  res.json(out);
};
