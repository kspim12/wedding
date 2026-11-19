'use strict';
const wedding = new Date('2026-11-28T12:00:00+09:00');
const address = '서울 송파구 올림픽로35다길 42 루터회관 3층 더베네치아';
const days = document.querySelector('#calendar-days');
for (let day = 1; day <= 30; day++) {
  const cell = document.createElement('span');
  cell.textContent = day;
  if (day === 28) { cell.className = 'wedding-day'; cell.setAttribute('aria-label', '28일 토요일, 결혼식'); }
  days.append(cell);
}
function updateCountdown() {
  const remaining = wedding - Date.now();
  document.querySelector('#countdown').textContent = remaining > 0
    ? `우리의 킥오프까지 ${Math.ceil(remaining / 86400000)}일 남았습니다.`
    : remaining > -86400000 ? '오늘, 평생의 한 팀이 됩니다.' : '함께 축하해 주셔서 감사합니다.';
}
updateCountdown(); setInterval(updateCountdown, 60000);
let toastTimer;
function toast(message) {
  const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3200);
}
async function copy(text, message) {
  try { await navigator.clipboard.writeText(text); toast(message); }
  catch { window.prompt('아래 내용을 복사해 주세요.', text); }
}
document.querySelector('#copy-address').addEventListener('click', () => copy(address, '예식장 주소를 복사했어요.'));
document.querySelector('#share').addEventListener('click', async () => {
  const data = { title: '동률 ♥ 효정 — 하고FS에게 전하는 결혼 소식', text: '동률과 효정이 결혼합니다. 11월 28일 토요일 낮 12시 · 잠실 더베네치아', url: location.href.split('#')[0] };
  if (navigator.share) {
    try { await navigator.share(data); return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  await copy(data.url, '초대장 링크를 복사했어요. 하고FS에 전해주세요!');
});
document.querySelector('#save-calendar').addEventListener('click', () => {
  const event = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//HAGO FS//Wedding//KO','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:20261128-dongryul-hyojeong@hago-fs','DTSTAMP:20261118T000000Z','DTSTART:20261128T030000Z','SUMMARY:김동률 · 김효정 결혼식','LOCATION:' + address,'DESCRIPTION:동률과 효정의 새로운 시작','END:VEVENT','END:VCALENDAR',''].join('\r\n');
  const url = URL.createObjectURL(new Blob([event], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = '동률-효정-결혼식.ics'; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000); toast('캘린더 파일을 열어 일정을 저장해 주세요.');
});
const grid = document.querySelector('#photo-grid');
const dialog = document.querySelector('#lightbox');
const large = document.querySelector('#large-photo');
let activePhoto = 1, visiblePhotos = 0, lastFocus;
function photoPath(index) { return `photos/${String(index).padStart(2, '0')}.jpg`; }
function showPhoto(index) {
  activePhoto = (index + 26) % 27 + 1;
  large.src = photoPath(activePhoto); large.alt = `동률과 효정의 웨딩 사진 ${activePhoto}`;
  document.querySelector('#photo-counter').textContent = `${activePhoto} / 27`;
}
function addPhotos() {
  const end = Math.min(visiblePhotos + 9, 27);
  for (let i = visiblePhotos + 1; i <= end; i++) {
    const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-label', `웨딩 사진 ${i} 크게 보기`);
    const img = document.createElement('img'); img.src = photoPath(i); img.alt = `동률과 효정의 웨딩 사진 ${i}`; img.loading = 'lazy'; img.width = 300; img.height = 400;
    button.append(img); grid.append(button);
    button.addEventListener('click', () => { lastFocus = button; showPhoto(i); dialog.showModal(); document.body.classList.add('modal-open'); });
  }
  visiblePhotos = end;
  const more = document.querySelector('#more-photos');
  more.textContent = `우리 사진 더 보기 (${visiblePhotos}/27) ＋`; more.hidden = visiblePhotos === 27;
}
addPhotos();
document.querySelector('#more-photos').addEventListener('click', addPhotos);
document.querySelector('#close-photo').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); lastFocus?.focus(); });
document.querySelector('#prev-photo').addEventListener('click', () => showPhoto(activePhoto - 1));
document.querySelector('#next-photo').addEventListener('click', () => showPhoto(activePhoto + 1));
dialog.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') showPhoto(activePhoto - 1); if (event.key === 'ArrowRight') showPhoto(activePhoto + 1); });
let touchStart;
large.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
large.addEventListener('touchend', event => { const delta = event.changedTouches[0].clientX - touchStart; if (Math.abs(delta) > 50) showPhoto(activePhoto + (delta < 0 ? 1 : -1)); }, { passive: true });
