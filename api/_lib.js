// 공용 유틸: 상품 가격표(서버 기준), 주문번호 파싱, 열람 토큰 서명/검증
const crypto = require('crypto');

const TYPES = ['ECLA','ECLF','ECRA','ECRF','ESLA','ESLF','ESRA','ESRF',
               'HCLA','HCLF','HCRA','HCRF','HSLA','HSLF','HSRA','HSRF'];

// 금액은 반드시 서버의 이 표를 기준으로 한다. (클라이언트가 보낸 금액은 신뢰하지 않음)
const PRODUCTS = {
  pair: { name: '커플 궁합 리포트', amount: 3900 },
};

const reports = require('./_data/reports.json');

function pairKey(a, b) {
  return [a, b].sort().join('_');
}

function validPair(a, b) {
  return TYPES.includes(a) && TYPES.includes(b);
}

function hasReport(a, b) {
  return Boolean(reports[pairKey(a, b)]);
}

// orderId 형식: pair_<A>_<B>_<random>  (Toss 규격: 6~64자, 영문/숫자/-/_)
function newOrderId(product, a, b) {
  const rand = crypto.randomBytes(8).toString('hex');
  const [x, y] = [a, b].sort();
  return `${product}_${x}_${y}_${rand}`;
}

function parseOrderId(orderId) {
  const m = /^(pair)_([A-Z]{4})_([A-Z]{4})_[0-9a-f]{16}$/.exec(String(orderId || ''));
  if (!m) return null;
  const [, product, a, b] = m;
  if (!validPair(a, b)) return null;
  return { product, a, b };
}

function secret() {
  const s = process.env.ACCESS_SECRET;
  if (!s || s.length < 16) throw new Error('ACCESS_SECRET 환경변수가 없습니다');
  return s;
}

const b64u = (buf) => Buffer.from(buf).toString('base64url');

function signToken(payload) {
  const body = b64u(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verifyToken(token) {
  const [body, sig] = String(token || '').split('.');
  if (!body || !sig) return null;
  const expect = crypto.createHmac('sha256', secret()).update(body).digest('base64url');
  const a = Buffer.from(sig), b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try { return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); }
  catch { return null; }
}

function tossAuth() {
  const key = process.env.TOSS_SECRET_KEY;
  if (!key) throw new Error('TOSS_SECRET_KEY 환경변수가 없습니다');
  return 'Basic ' + Buffer.from(key + ':').toString('base64');
}

// 결제 조회: 환불(CANCELED) 여부와 금액을 Toss에서 직접 확인한다.
async function lookupPayment(paymentKey) {
  const r = await fetch('https://api.tosspayments.com/v1/payments/' + encodeURIComponent(paymentKey), {
    headers: { Authorization: tossAuth() },
  });
  const data = await r.json();
  return { ok: r.ok, data };
}

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

module.exports = { TYPES, PRODUCTS, reports, pairKey, validPair, hasReport,
  newOrderId, parseOrderId, signToken, verifyToken, tossAuth, lookupPayment, json };
