/* =========================================================
   Love Type 16 — 유형별 징표(라인 엠블럼)
   - 페이지 곳곳의 유형 이모지(🌹 🗝️ …)를 같은 굵기의 선 엠블럼으로 바꾼다.
   - 클래스 이름에 "emoji"가 들어간 요소 중, 내용이 유형 이모지 하나뿐인 것만 교체한다.
   - 동적으로 그려지는 결과·궁합 화면도 MutationObserver로 따라간다.
   - 캔버스(공유 카드)용으로 LT16Emblem.image(code) 를 제공한다.
   ========================================================= */
(function () {
  var ACCENT = '#b8352a';
  var A = 'data-accent'; // 포인트 색을 쓰는 요소 표시

  // 48×48, 선 굵기 1.5 기준. a=true 는 포인트 색.
  var EMBLEMS = {
    // 열정 로맨티시스트 — 장미
    ECRF: [
      ['path', { d: 'M24 5.5c6 0 10.5 4.2 10.5 10S30 25.5 24 25.5 13.5 21.3 13.5 15.5 18 5.5 24 5.5z', a: 1 }],
      ['path', { d: 'M24 10.5c3.2 0 5.2 2 5.2 4.6S27.1 20 24 20s-4.6-1.8-4.6-4.1c0-1.8 1.4-3 3.1-3 1.3 0 2.2.8 2.2 1.9', a: 1 }],
      ['path', { d: 'M24 25.5V43' }],
      ['path', { d: 'M24 35.5c-4.6-.9-7.6-3.9-8.3-8 4.1.3 7.1 3 8.3 8z' }],
      ['path', { d: 'M24 32c4.2-.9 7-3.6 7.6-7.4-3.8.2-6.6 2.6-7.6 7.4z' }]
    ],
    // 츤데레 로맨티스트 — 리본
    ECRA: [
      ['path', { d: 'M21 21.5C15 15 8 15 8 20.5S15 27.5 21 24' }],
      ['path', { d: 'M27 21.5C33 15 40 15 40 20.5S33 27.5 27 24' }],
      ['path', { d: 'M22.5 26 18.5 38.5l3.5-2' }],
      ['path', { d: 'M25.5 26l4 12.5-3.5-2' }],
      ['rect', { x: 21, y: 19, width: 6, height: 7, rx: 1.5, a: 1, fill: 1 }]
    ],
    // 직진 현실주의자 — 과녁을 향한 화살
    ECLF: [
      ['circle', { cx: 30, cy: 22, r: 10 }],
      ['circle', { cx: 30, cy: 22, r: 5.5 }],
      ['circle', { cx: 30, cy: 22, r: 1.8, a: 1, fill: 1 }],
      ['path', { d: 'M8 44 28.6 23.4', a: 1 }],
      ['path', { d: 'M13 39l-5-.6M13 39l.6 5M10.5 41.5l-5-.6M10.5 41.5l.6 5' }]
    ],
    // 표현형 신중파 — 봉인된 편지
    ECLA: [
      ['rect', { x: 8, y: 13, width: 32, height: 23, rx: 1.5 }],
      ['path', { d: 'M8.5 14 24 27l15.5-13' }],
      ['circle', { cx: 24, cy: 27, r: 3.6, a: 1, fill: 1 }]
    ],
    // 자유로운 로맨티스트 — 나비
    ESRF: [
      ['path', { d: 'M24 16v19' }],
      ['path', { d: 'M24 16c-.8-3-2.6-5-4.8-5.6M24 16c.8-3 2.6-5 4.8-5.6' }],
      ['path', { d: 'M24 20C19 11 9 10 9 17s7 8.5 15 5.5' }],
      ['path', { d: 'M24 20c5-9 15-10 15-3s-7 8.5-15 5.5' }],
      ['path', { d: 'M24 25c-6 1-10 5-8 8.8s7 .8 8-4.8' }],
      ['path', { d: 'M24 25c6 1 10 5 8 8.8s-7 .8-8-4.8' }],
      ['circle', { cx: 15.5, cy: 17, r: 1.6, a: 1, fill: 1 }],
      ['circle', { cx: 32.5, cy: 17, r: 1.6, a: 1, fill: 1 }]
    ],
    // 시크한 로맨티스트 — 반쯤 칠한 하트
    ESRA: [
      ['path', { d: 'M24 39C14 32 8 26.5 8 20a7.5 7.5 0 0 1 16-3 7.5 7.5 0 0 1 16 3c0 6.5-6 12-16 19z' }],
      ['path', { d: 'M24 17a7.5 7.5 0 0 1 16 3c0 6.5-6 12-16 19z', fill: 1 }],
      ['path', { d: 'M38 6.5v4.5M35.75 8.75h4.5', a: 1 }]
    ],
    // 쿨한 직진러 — 번개
    ESLF: [
      ['path', { d: 'M27 6 13 27h10l-3 15 15-22H25l2-14z' }],
      ['path', { d: 'M37 11.5l3-2M38 17.5h3.5', a: 1 }]
    ],
    // 어른 연애러 — 와인잔
    ESLA: [
      ['path', { d: 'M15.6 14h16.8c-.8 5.5-3.8 9-8.4 9s-7.6-3.5-8.4-9z', a: 1, fill: 1, nostroke: 1 }],
      ['path', { d: 'M15 8h18c0 9-3.5 15-9 15s-9-6-9-15z' }],
      ['path', { d: 'M24 23v14M17.5 40c2-2 4.2-3 6.5-3s4.5 1 6.5 3z' }]
    ],
    // 소심한 껌딱지 — 토끼
    HCRF: [
      ['path', { d: 'M20 21.5C17.5 15 17 8.5 19.6 7.4s4.9 5.6 4.4 13.6' }],
      ['path', { d: 'M28 21.5C30.5 15 31 8.5 28.4 7.4S23.5 13 24 21' }],
      ['circle', { cx: 24, cy: 30, r: 10 }],
      ['circle', { cx: 20.5, cy: 28.5, r: 1.1, fill: 1, nostroke: 1 }],
      ['circle', { cx: 27.5, cy: 28.5, r: 1.1, fill: 1, nostroke: 1 }],
      ['path', { d: 'M23 32.5h2' }],
      ['circle', { cx: 18, cy: 32.5, r: 1.7, a: 1, fill: 1, nostroke: 1 }],
      ['circle', { cx: 30, cy: 32.5, r: 1.7, a: 1, fill: 1, nostroke: 1 }]
    ],
    // 속앓이 로맨티스트 — 안으로 삼킨 눈물
    HCRA: [
      ['path', { d: 'M24 7S13 20.5 13 29a11 11 0 0 0 22 0C35 20.5 24 7 24 7z' }],
      ['path', { d: 'M24 23s-4 5-4 8a4 4 0 0 0 8 0c0-3-4-8-4-8z', a: 1, fill: 1 }]
    ],
    // 조용한 진심파 — 책과 책갈피
    HCLF: [
      ['path', { d: 'M24 14C19 11 13 10.5 8 11.5v24c5-1 11-.5 16 2.5' }],
      ['path', { d: 'M24 14c5-3 11-3.5 16-2.5v24c-5-1-11-.5-16 2.5' }],
      ['path', { d: 'M24 14v24' }],
      ['path', { d: 'M12 18c3-.4 6-.1 8.5.8M12 22.5c3-.4 6-.1 8.5.8M12 27c3-.4 6-.1 8.5.8', op: 0.55 }],
      ['path', { d: 'M31 11.6V22l2.5-2 2.5 2V11.2', a: 1 }]
    ],
    // 무뚝뚝한 로열티 — 열쇠
    HCLA: [
      ['circle', { cx: 15, cy: 16, r: 7, a: 1 }],
      ['circle', { cx: 15, cy: 16, r: 2.5 }],
      ['path', { d: 'M20 21l19 19' }],
      ['path', { d: 'M34 35l4-4M30 31l3-3' }]
    ],
    // 신비주의 로맨티스트 — 수정구
    HSRF: [
      ['circle', { cx: 24, cy: 21, r: 12 }],
      ['path', { d: 'M15 38h18l-3-5.2H18z' }],
      ['path', { d: 'M24 14l1.4 4 4 1.4-4 1.4-1.4 4-1.4-4-4-1.4 4-1.4z', a: 1, fill: 1 }],
      ['path', { d: 'M30.5 25.5v2.4M29.3 26.7h2.4' }]
    ],
    // 고독한 몽상가 — 초승달과 별
    HSRA: [
      ['path', { d: 'M29 8.5a15 15 0 1 0 11 24A12.5 12.5 0 1 1 29 8.5z' }],
      ['path', { d: 'M35 12l1 2.7 2.7 1-2.7 1-1 2.7-1-2.7-2.7-1 2.7-1z', a: 1, fill: 1 }]
    ],
    // 침착한 관찰자 — 부엉이
    HSLF: [
      ['path', { d: 'M13 11l5 4h12l5-4v19c0 6.6-5 11-11 11s-11-4.4-11-11z' }],
      ['circle', { cx: 19.5, cy: 21.5, r: 4 }],
      ['circle', { cx: 28.5, cy: 21.5, r: 4 }],
      ['circle', { cx: 19.5, cy: 21.5, r: 1.3, fill: 1, nostroke: 1 }],
      ['circle', { cx: 28.5, cy: 21.5, r: 1.3, fill: 1, nostroke: 1 }],
      ['path', { d: 'M22.5 26.5 24 29.5l1.5-3z', a: 1, fill: 1 }],
      ['path', { d: 'M19 33.5c3.2 1.2 6.8 1.2 10 0', op: 0.55 }]
    ],
    // 신중한 거리유지러 — 설산과 해
    HSLA: [
      ['path', { d: 'M6 38 20 14l14 24' }],
      ['path', { d: 'M27.5 38 35 26l8 12' }],
      ['path', { d: 'M5 38h38' }],
      ['path', { d: 'M16 21l4 3 4-3' }],
      ['circle', { cx: 36, cy: 12, r: 3, a: 1, fill: 1, nostroke: 1 }]
    ]
  };

  var NAMES = {
    ECRF: '장미', ECRA: '리본', ECLF: '과녁과 화살', ECLA: '봉인된 편지',
    ESRF: '나비', ESRA: '반쯤 칠한 하트', ESLF: '번개', ESLA: '와인잔',
    HCRF: '토끼', HCRA: '눈물', HCLF: '책과 책갈피', HCLA: '열쇠',
    HSRF: '수정구', HSRA: '초승달', HSLF: '부엉이', HSLA: '설산'
  };

  // 기존 이모지 → 유형 (변형 선택자 FE0F 제거 후 비교)
  var EMOJI = {
    '🌹': 'ECRF', '🎀': 'ECRA', '💼': 'ECLF', '📋': 'ECLA',
    '🦋': 'ESRF', '🖤': 'ESRA', '⚡': 'ESLF', '🍷': 'ESLA',
    '🐰': 'HCRF', '🥺': 'HCRA', '📖': 'HCLF', '🗝': 'HCLA',
    '🔮': 'HSRF', '🌙': 'HSRA', '🦉': 'HSLF', '🏔': 'HSLA'
  };

  function norm(s) { return (s || '').replace(/️/g, '').trim(); }

  function svg(code, opt) {
    var parts = EMBLEMS[code];
    if (!parts) return '';
    opt = opt || {};
    var ink = opt.ink || 'currentColor';
    var accent = opt.accent || ACCENT;
    var body = parts.map(function (p) {
      var tag = p[0], at = p[1], attrs = [];
      var color = at.a ? accent : ink;
      for (var k in at) {
        if (k === 'a' || k === 'fill' || k === 'nostroke' || k === 'op') continue;
        attrs.push(k + '="' + at[k] + '"');
      }
      attrs.push('fill="' + (at.fill ? color : 'none') + '"');
      attrs.push(at.nostroke ? 'stroke="none"' : 'stroke="' + color + '"');
      if (at.op) attrs.push('opacity="' + at.op + '"');
      return '<' + tag + ' ' + attrs.join(' ') + '/>';
    }).join('');
    var size = opt.size ? ' width="' + opt.size + '" height="' + opt.size + '"' : '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"' + size +
      ' stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lt-emblem-svg"' +
      ' role="img" aria-label="' + (NAMES[code] || code) + '">' + body + '</svg>';
  }

  // 캔버스용 이미지 (공유 카드)
  function image(code, opt) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      var o = opt || {};
      img.src = 'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(svg(code, { ink: o.ink || '#141210', accent: o.accent, size: o.size || 480 }));
    });
  }

  function swapEl(el) {
    if (el.nodeType !== 1 || el.querySelector('svg')) return;
    var text = norm(el.textContent);
    // "📋 × 💼" 처럼 두 유형이 한 칸에 있는 경우 (궁합쌍 페이지)
    var pair = text.split(/\s*×\s*/);
    if (pair.length === 2 && EMOJI[pair[0]] && EMOJI[pair[1]]) {
      el.innerHTML = svg(EMOJI[pair[0]]) + '<span class="lt-emblem-x">×</span>' + svg(EMOJI[pair[1]]);
      el.classList.add('lt-emblem', 'lt-emblem-pair');
      return;
    }
    var code = EMOJI[text];
    if (!code) return;
    el.innerHTML = svg(code);
    el.classList.add('lt-emblem');
    el.setAttribute('data-type', code);
  }

  function scan(root) {
    if (!root || !root.querySelectorAll) return;
    if (root.matches && root.matches('[class*="emoji"]')) swapEl(root);
    root.querySelectorAll('[class*="emoji"], .match-pair > span').forEach(swapEl);
  }

  // 캔버스는 동기로 그리므로 이미지를 미리 만들어 둔다 (어두운 카드용 밝은 선 / 밝은 카드용 어두운 선)
  var PRE = { light: {}, dark: {} };
  function preload() {
    Object.keys(EMBLEMS).forEach(function (code) {
      [['light', '#f4f2ee'], ['dark', '#141210']].forEach(function (v) {
        var img = new Image();
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(code, { ink: v[1], size: 480 }));
        PRE[v[0]][code] = img;
      });
    });
  }
  // 이모지 또는 유형 코드를 받아 (cx, cy) 중심에 size 크기로 그린다. 그렸으면 true.
  function draw(ctx, emojiOrCode, cx, cy, size, tone) {
    var code = EMBLEMS[emojiOrCode] ? emojiOrCode : EMOJI[norm(emojiOrCode)];
    var img = code && PRE[tone === 'dark' ? 'dark' : 'light'][code];
    if (!img || !img.complete || !img.naturalWidth) return false;
    ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
    return true;
  }

  window.LT16Emblem = { svg: svg, image: image, draw: draw, names: NAMES, codeOf: function (e) { return EMOJI[norm(e)] || null; } };
  preload();

  function init() {
    scan(document.body);
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        var t = m.type === 'characterData' ? m.target.parentElement : m.target;
        if (t && t.closest) {
          var host = t.closest('[class*="emoji"], .match-pair > span');
          if (host) swapEl(host);
        }
        m.addedNodes && m.addedNodes.forEach(function (n) { scan(n.nodeType === 1 ? n : null); });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
