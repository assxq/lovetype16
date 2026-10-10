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
    var out = svgFrom(parts, opt);
    return out.replace('aria-label=""', 'aria-label="' + (NAMES[code] || code) + '"');
  }

  function svgFrom(parts, opt) {
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
    var box = opt.box || 48, sw = opt.sw || 1.5;
    var label = opt.box ? ' aria-hidden="true"' : ' role="img" aria-label=""';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + box + ' ' + box + '"' + size +
      ' stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" class="lt-emblem-svg"' +
      label + '>' + body + '</svg>';
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
    if (!root) return;
    if (root.nodeType === 3) { swapText(root); return; }
    if (!root.querySelectorAll) return;
    if (root.matches && root.matches('[class*="emoji"]')) swapEl(root);
    root.querySelectorAll('[class*="emoji"], .match-pair > span').forEach(swapEl);
    numberSlots(root);
    swapText(root);
  }

  // ===== 일반 아이콘 (24×24, 문장 속 장식 이모지 대체) =====
  // h=1 이면 포인트 색. 같은 의미의 이모지는 같은 아이콘을 쓴다.
  var ICONS = {
    talk:    [['path', { d: 'M4 5.5h16v10H10l-4 3.5v-3.5H4z' }]],
    caution: [['path', { d: 'M12 4 21 19.5H3z' }], ['path', { d: 'M12 10v4.2' }], ['circle', { cx: 12, cy: 16.9, r: 0.7, fill: 1, nostroke: 1 }]],
    letter:  [['rect', { x: 3.5, y: 6, width: 17, height: 12.5, rx: 1 }], ['path', { d: 'M4 7l8 6 8-6' }]],
    spark:   [['path', { d: 'M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z', a: 1 }]],
    magnet:  [['path', { d: 'M5.5 4.5h4V12a2.5 2.5 0 0 0 5 0V4.5h4V12a6.5 6.5 0 0 1-13 0z' }], ['path', { d: 'M5.5 8h4M14.5 8h4' }]],
    link:    [['path', { d: 'M10 14l4-4M8.6 11.4l-2 2a3 3 0 0 0 4.2 4.2l2-2M15.4 12.6l2-2a3 3 0 0 0-4.2-4.2l-2 2' }]],
    leaf:    [['path', { d: 'M5 19C5 10 10 5 19 5c0 9-5 14-14 14z' }], ['path', { d: 'M5 19 13 11' }]],
    calendar:[['rect', { x: 4, y: 5.5, width: 16, height: 14.5, rx: 1 }], ['path', { d: 'M4 10h16M8.5 3.5v4M15.5 3.5v4' }]],
    compass: [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M14.8 9.2l-1.6 4-4 1.6 1.6-4z', a: 1 }]],
    heart:   [['path', { d: 'M12 19.5C6.5 15.8 3.5 12.6 3.5 9.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8.5 2.2c0 3.4-3 6.6-8.5 10.3z', a: 1 }]],
    broken:  [['path', { d: 'M12 19.5C6.5 15.8 3.5 12.6 3.5 9.2A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 8.5 2.2c0 3.4-3 6.6-8.5 10.3z' }], ['path', { d: 'M12 7l-1.6 4 2.6 2-1.6 4', a: 1 }]],
    flame:   [['path', { d: 'M12 3.5c1 3.5 5.5 5.5 5.5 10a5.5 5.5 0 0 1-11 0c0-2.5 1.5-4 2.5-5 .3 1.8 1 2.8 2 3.2-.5-3.2.2-5.8 1-8.2z' }]],
    sprout:  [['path', { d: 'M12 20v-8' }], ['path', { d: 'M12 12c0-3.5-2.5-6-6.5-6 0 3.5 2.5 6 6.5 6zM12 14.5c0-3 2-5 5.5-5 0 3-2 5-5.5 5z' }]],
    halfmoon:[['circle', { cx: 12, cy: 12, r: 8 }], ['path', { d: 'M12 4a8 8 0 0 1 0 16z', fill: 1 }]],
    bulb:    [['path', { d: 'M12 3.5a5.5 5.5 0 0 0-3.2 10c.4.3.7.9.7 1.4v1.6h5v-1.6c0-.5.3-1.1.7-1.4A5.5 5.5 0 0 0 12 3.5z' }], ['path', { d: 'M10 19.5h4' }]],
    book:    [['path', { d: 'M12 6.5C9.5 5 6.5 4.8 4 5.3v12.5c2.5-.5 5.5-.3 8 1.2 2.5-1.5 5.5-1.7 8-1.2V5.3c-2.5-.5-5.5-.3-8 1.2zM12 6.5V19' }]],
    pen:     [['path', { d: 'M15.5 4.5l4 4L9 19H5v-4z' }], ['path', { d: 'M13.5 6.5l4 4' }]],
    target:  [['circle', { cx: 12, cy: 12, r: 8.5 }], ['circle', { cx: 12, cy: 12, r: 4.5 }], ['circle', { cx: 12, cy: 12, r: 1.3, a: 1, fill: 1, nostroke: 1 }]],
    pin:     [['path', { d: 'M9 3.5h6l-1 5 3 3H7l3-3z' }], ['path', { d: 'M12 11.5V20' }]],
    image:   [['rect', { x: 4, y: 5, width: 16, height: 14, rx: 1 }], ['path', { d: 'M4 16l4.5-4.5 4 4 2.5-2.5L20 18' }], ['circle', { cx: 15.5, cy: 9.5, r: 1.4 }]],
    home:    [['path', { d: 'M4 11 12 4.5 20 11M6 9.5v10h12v-10' }]],
    cloud:   [['path', { d: 'M7.5 18h9.5a3.5 3.5 0 0 0 .4-7A5.5 5.5 0 0 0 6.8 10 4 4 0 0 0 7.5 18z' }]],
    cup:     [['path', { d: 'M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10.5h1.5a2.5 2.5 0 0 1 0 5H16M8.5 3.5v3M12 3.5v3' }]],
    share:   [['path', { d: 'M12 15V4M8 7.5 12 3.5l4 4M6 11v8.5h12V11' }]],
    refresh: [['path', { d: 'M19 8a7.5 7.5 0 1 0 .5 6.5M19.5 3.5v5h-5' }]],
    gift:    [['rect', { x: 4, y: 9, width: 16, height: 4 }], ['path', { d: 'M5.5 13v7h13v-7M12 9v11M12 9c-2-3.5-6-3.5-5.5-1S12 9 12 9zM12 9c2-3.5 6-3.5 5.5-1S12 9 12 9z' }]],
    lock:    [['rect', { x: 5, y: 10.5, width: 14, height: 9.5, rx: 1 }], ['path', { d: 'M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5' }]],
    chart:   [['path', { d: 'M4 20h16M7 16.5V11M12 16.5V6.5M17 16.5v-4', a: 0 }]],
    bolt:    [['path', { d: 'M13.5 3 6 13.5h5L9.5 21 18 10h-5z' }]],
    moon:    [['path', { d: 'M15 4a8.5 8.5 0 1 0 5 12.5A7 7 0 1 1 15 4z' }]],
    eye:     [['path', { d: 'M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z' }], ['circle', { cx: 12, cy: 12, r: 2.5 }]],
    clock:   [['circle', { cx: 12, cy: 12, r: 8.5 }], ['path', { d: 'M12 7.5V12l3 2' }]],
    music:   [['path', { d: 'M9 17.5V6l10-2v11.5' }], ['circle', { cx: 7, cy: 17.5, r: 2 }], ['circle', { cx: 17, cy: 15.5, r: 2 }]],
    person:  [['circle', { cx: 12, cy: 8, r: 3.5 }], ['path', { d: 'M5 20c.8-4 3.5-6 7-6s6.2 2 7 6' }]]
  };
  var ICON_OF = {};
  function mapIcons(name, list) { list.split(' ').forEach(function (e) { ICON_OF[e] = name; }); }
  mapIcons('talk', '💬 🗨 🗣 📞 📱');
  mapIcons('caution', '⚠ 🚨 ❗ ❕ ‼');
  mapIcons('letter', '💌 ✉ 📩 📨 📮');
  mapIcons('spark', '✨ 🌟 ⭐ 💫 🎉 🎊 🌈 💎');
  mapIcons('magnet', '🧲');
  mapIcons('link', '🔗 🤝');
  mapIcons('leaf', '🕊 🍃 🌿 🌸 🌷 🌼 🍀');
  mapIcons('calendar', '📅 🗓 📆');
  mapIcons('compass', '🧭 🗺');
  mapIcons('heart', '🫶 💞 💕 💝 💘 💖 💗 💓 ❤ ♥ 💚 💛 🧡 💙 💜 🤍 🩷 😍 🥰 😘 💑 💏 💍');
  mapIcons('broken', '💔');
  mapIcons('flame', '🔥');
  mapIcons('sprout', '🌱 🪴');
  mapIcons('halfmoon', '🌗 🌓 🌑 🌕 ☯');
  mapIcons('bulb', '💡 🤔 🧠');
  mapIcons('book', '📚 📓 📕 📗 📘 📙 📜');
  mapIcons('pen', '📝 🖋 ✏ ✍ 🖊');
  mapIcons('target', '🎯 💪 🚀 🏆');
  mapIcons('pin', '📌 📍 📐 📎');
  mapIcons('image', '🖼 📸 📷 🎨 🎬');
  mapIcons('home', '🏠 🏡');
  mapIcons('cloud', '🌫 🌧 🌪 ☁ ⛅ 🌦 🌊 😢 😭 😔 😞');
  mapIcons('cup', '☕ 🍵 🕯 🍽');
  mapIcons('share', '📤 📣 📢');
  mapIcons('refresh', '🔄 🔁 ♻');
  mapIcons('gift', '🎁 🧸 🍰 🎂 🍫 💐');
  mapIcons('lock', '🔒 🔐 🔑');
  mapIcons('chart', '📊 📈 📉');
  mapIcons('eye', '👀 👁 🔍 🔎');
  mapIcons('clock', '⏰ ⏳ ⌛ 🕐');
  mapIcons('music', '🎵 🎶 🎧');
  mapIcons('person', '👤 👥 🙋 🧑');
  var MEDAL = { '🥇': '1', '🥈': '2', '🥉': '3' };
  // 그대로 둘 기호 (글자로 쓰는 것)
  var KEEP = { '✓': 1, '✔': 1, '✕': 1, '✗': 1, '✘': 1, '★': 1, '☆': 1, '♪': 1, '©': 1, '®': 1, '™': 1 };
  var EMOJI_RE = /(?:[←-⇿⌀-⏿①-⓿■-➿⤴⤵⬅-⭕〰〽㊗㊙]|[\uD83C-\uDBFF][\uDC00-\uDFFF])(?:️|‍(?:[☀-➿]|[\uD83C-\uDBFF][\uDC00-\uDFFF])️?|[\uD83C][\uDFFB-\uDFFF])*/g;
  var ARROWS = /^[←-⇿⌀-⏿①-⓿■-◿⬅-⬇]$/; // 화살표·도형·원문자 등은 글자 그대로

  function iconSvg(name) {
    return svgFrom(ICONS[name], { box: 24, sw: 1.6 });
  }

  function replacementFor(raw) {
    var e = norm(raw.replace(/‍.*$/, ''));
    if (KEEP[e] || ARROWS.test(e)) return null;            // 그대로
    if (MEDAL[e]) return { html: '<span class="lt-num">' + MEDAL[e] + '</span>' };
    if (EMOJI[e]) return { html: '<span class="lt-ico lt-ico-type">' + svg(EMOJI[e]) + '</span>' };
    if (ICON_OF[e]) return { html: '<span class="lt-ico">' + iconSvg(ICON_OF[e]) + '</span>' };
    return { html: '' };                                    // 그 밖의 장식 이모지는 지움
  }

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, TITLE: 1, OPTION: 1, svg: 1, SVG: 1 };
  function swapText(root) {
    if (!root) return;
    if (root.nodeType === 3) { swapTextNode(root); return; }
    if (root.nodeType !== 1 || SKIP_TAGS[root.nodeName] || (root.closest && root.closest('svg'))) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || SKIP_TAGS[p.nodeName] || (p.closest && p.closest('svg, [contenteditable]'))) return NodeFilter.FILTER_REJECT;
        EMOJI_RE.lastIndex = 0;
        return EMOJI_RE.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var list = [];
    while (walker.nextNode()) list.push(walker.currentNode);
    list.forEach(swapTextNode);
  }
  function swapTextNode(node) {
    var p = node.parentNode;
    if (!p || SKIP_TAGS[p.nodeName] || (p.closest && p.closest('svg'))) return;
    var text = node.nodeValue, out = '', last = 0, changed = false, m;
    EMOJI_RE.lastIndex = 0;
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    while ((m = EMOJI_RE.exec(text))) {
      var r = replacementFor(m[0]);
      if (!r) continue;
      changed = true;
      var before = text.slice(last, m.index);
      var after = m.index + m[0].length;
      if (r.html === '') {
        // 지운 자리에 공백이 겹치지 않게
        if (/\s$/.test(before) || before === '') { while (text[after] === ' ') after++; }
      }
      out += esc(before) + r.html;
      last = after;
      EMOJI_RE.lastIndex = after;
    }
    if (!changed) return;
    out += esc(text.slice(last));
    var tpl = document.createElement('template');
    tpl.innerHTML = out;
    p.replaceChild(tpl.content, node);
  }

  // 특징 목록처럼 '항목마다 다른 이모지'를 쓰는 슬롯은 01·02·03 번호로
  var NUMBER_SLOTS = '.feature-icon';
  function numberSlots(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var els = [];
    if (scope.matches && scope.matches(NUMBER_SLOTS)) els.push(scope);
    scope.querySelectorAll(NUMBER_SLOTS).forEach(function (e) { els.push(e); });
    els.forEach(function (el) {
      if (el.classList.contains('lt-num-slot')) return;
      var sibs = el.parentElement && el.parentElement.parentElement
        ? el.parentElement.parentElement.querySelectorAll(NUMBER_SLOTS) : [el];
      var i = Array.prototype.indexOf.call(sibs, el);
      el.textContent = String((i < 0 ? 0 : i) + 1).padStart(2, '0');
      el.classList.add('lt-num-slot');
    });
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
          var slot = t.closest('.feature-icon');
          if (slot && !/^\d{2}$/.test(slot.textContent.trim())) { slot.classList.remove('lt-num-slot'); numberSlots(slot); }
        }
        if (m.type === 'characterData') swapText(m.target);
        m.addedNodes && m.addedNodes.forEach(function (n) { scan(n); });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
