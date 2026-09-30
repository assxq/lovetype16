// POST /api/create-order  { product:'pair', a:'ECRF', b:'HCLA' }
// 서버가 주문번호와 금액을 정한다. 콘텐츠가 준비된 조합만 판매한다.
const L = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.json(res, 405, { error: 'POST만 가능합니다' });
  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const { product, a, b } = body;
  const p = L.PRODUCTS[product];
  if (!p || !L.validPair(a, b)) return L.json(res, 400, { error: '잘못된 요청입니다' });
  if (!L.hasReport(a, b)) return L.json(res, 404, { error: '아직 준비 중인 조합입니다' });
  return L.json(res, 200, {
    orderId: L.newOrderId(product, a, b),
    amount: p.amount,
    orderName: `${p.name} (${[a, b].sort().join(' × ')})`,
    clientKey: process.env.TOSS_CLIENT_KEY || '',
  });
};

function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }
