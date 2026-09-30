// POST /api/confirm  { paymentKey, orderId, amount }
// 1) orderId에서 상품을 복원해 서버 가격과 금액을 대조 2) Toss 승인 API 호출 3) 성공 시에만 열람 토큰 발급
const L = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return L.json(res, 405, { error: 'POST만 가능합니다' });
  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body || {});
  const { paymentKey, orderId } = body;
  const amount = Number(body.amount);

  const order = L.parseOrderId(orderId);
  if (!paymentKey || !order) return L.json(res, 400, { error: '잘못된 주문입니다' });
  const expected = L.PRODUCTS[order.product].amount;
  if (amount !== expected) return L.json(res, 400, { error: '결제 금액이 일치하지 않습니다' });

  const key = process.env.TOSS_SECRET_KEY;
  if (!key) return L.json(res, 500, { error: '결제 설정이 완료되지 않았습니다' });

  let r, data;
  try {
    r = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(key + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount: expected }),
    });
    data = await r.json();
  } catch {
    return L.json(res, 502, { error: '결제 승인 서버와 통신하지 못했습니다' });
  }
  // 새로고침 등으로 이미 승인된 결제라면 Toss에 조회해서 같은 결제인지 확인한 뒤 열람권을 다시 발급한다.
  if (!r.ok && data.code === 'ALREADY_PROCESSED_PAYMENT') {
    try {
      const q = await L.lookupPayment(paymentKey);
      if (q.ok) { r = { ok: true }; data = q.data; }
    } catch { return L.json(res, 502, { error: '결제 조회 서버와 통신하지 못했습니다' }); }
  }
  if (!r.ok || data.status !== 'DONE' || data.totalAmount !== expected || data.orderId !== orderId) {
    return L.json(res, 400, { error: data.message || '결제가 승인되지 않았습니다' });
  }

  const token = L.signToken({ o: orderId, pk: paymentKey, p: order.product, a: order.a, b: order.b, t: Date.now() });
  return L.json(res, 200, { token, a: order.a, b: order.b });
};

function safeParse(s) { try { return JSON.parse(s); } catch { return {}; } }
