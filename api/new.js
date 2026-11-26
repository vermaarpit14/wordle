const { seal, randomWord } = require("./_lib");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const w = await randomWord();
  res.json({ token: seal({ w, n: 0 }) }); // the word is encrypted, never sent in plain text
};
