// GET /api/report?token=...
// 서명이 유효하고, Toss에서 조회한 결제 상태가 DONE(환불·취소 아님)일 때만 유료 본문을 반환한다.
const L = require('./_lib');

module.exports = async (req, res) => {
  const t = L.verifyToken((req.query || {}).token);
  if (!t || t.p !== 'pair' || !t.pk) return L.json(res, 401, { error: '열람 권한이 없습니다' });

  try {
    const q = await L.lookupPayment(t.pk);
    if (!q.ok || q.data.status !== 'DONE' || q.data.orderId !== t.o) {
      return L.json(res, 403, { error: '환불·취소된 결제이거나 확인할 수 없는 결제입니다' });
    }
  } catch {
    return L.json(res, 502, { error: '결제 확인 서버와 통신하지 못했습니다. 잠시 후 다시 시도해 주세요' });
  }

  const r = L.reports[L.pairKey(t.a, t.b)];
  if (!r) return L.json(res, 404, { error: '리포트를 찾을 수 없습니다' });
  return L.json(res, 200, { a: t.a, b: t.b, ...r });
};
