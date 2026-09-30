// GET /api/preview?a=ECRF&b=HCLA  -> 무료 미리보기(점수+한 줄 요약)와 판매 가능 여부
const L = require('./_lib');

module.exports = async (req, res) => {
  const { a, b } = req.query || {};
  if (!L.validPair(a, b)) return L.json(res, 400, { error: '잘못된 요청입니다' });
  const r = L.reports[L.pairKey(a, b)];
  if (!r) return L.json(res, 404, { available: false });
  return L.json(res, 200, {
    available: true, a, b,
    price: L.PRODUCTS.pair.amount,
    score: r.score, title: r.title, label: r.label, summary: r.summary,
    sectionTitles: r.sections.map(s => s.h),
  });
};
