// =======================================
// 🃏 ฟังก์ชันพลิกการ์ด (ถ้ามีหน้าอื่นใช้ร่วม)
// =======================================
function flipCard(cardElement) {
  cardElement.classList.toggle('flipped');
}

/* =========================================
  🌿 ฟังก์ชันสำหรับเกมจับคู่ (รองรับทั้งคอมและมือถือ)
========================================= */
if (document.querySelector('.matching-game-container')) {

  const draggableItems = document.querySelectorAll('.drag-item');
  const dropSlots = document.querySelectorAll('.drop-slot');
  let draggedItemId = null;
  let touchItem = null;
  let touchX = 0, touchY = 0;

  // ==============================
  // 🖱️ Desktop Drag & Drop
  // ==============================
  draggableItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      draggedItemId = e.target.id;
      e.dataTransfer.setData('match-id', e.target.dataset.matchId);
      setTimeout(() => {
        e.target.style.opacity = '0.5';
      }, 0);
    });

    item.addEventListener('dragend', (e) => {
      draggedItemId = null;
      e.target.style.opacity = '1';
    });
  });

  dropSlots.forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!slot.classList.contains('correct')) {
        slot.classList.add('hover');
      }
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('hover');
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('hover');
      if (slot.classList.contains('correct')) return;

      const draggedMatchId = e.dataTransfer.getData('match-id');
      const targetMatchId = slot.dataset.matchId;
      const draggedElement = document.getElementById(draggedItemId);
      checkMatch(draggedMatchId, targetMatchId, draggedElement, slot);
    });
  });

  // ==============================
  // 📱 Touch Support (มือถือ / iPad)
  // ==============================
  draggableItems.forEach(item => {
    item.addEventListener('touchstart', (e) => {
      touchItem = item;
      item.classList.add('dragging');
      const touch = e.touches[0];
      touchX = touch.clientX;
      touchY = touch.clientY;
    }, { passive: true });

    item.addEventListener('touchmove', (e) => {
      if (!touchItem) return;
      const touch = e.touches[0];
      touchX = touch.clientX;
      touchY = touch.clientY;

      // ขยับตำแหน่งตามนิ้ว
      touchItem.style.position = 'fixed';
      touchItem.style.left = `${touchX - touchItem.offsetWidth / 2}px`;
      touchItem.style.top = `${touchY - touchItem.offsetHeight / 2}px`;
      touchItem.style.zIndex = 1000;

      e.preventDefault();
    }, { passive: false });

    item.addEventListener('touchend', (e) => {
      if (!touchItem) return;

      // หาจุดสัมผัสสุดท้าย
      const touch = e.changedTouches[0];
      const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

      // หา .drop-slot ที่อยู่ใต้ตำแหน่งนั้น (แม่นกว่า)
      const targetSlot = targetElement ? targetElement.closest('.drop-slot') : null;

      // ✅ ตรวจว่ามี drop-slot จริงไหม
      if (targetSlot && !targetSlot.classList.contains('correct')) {
        const draggedMatchId = touchItem.dataset.matchId;
        const targetMatchId = targetSlot.dataset.matchId;
        checkMatch(draggedMatchId, targetMatchId, touchItem, targetSlot);
      } else {
        // ❌ ถ้าไม่ได้วางบนช่องเลย ให้สั่นกลับเบา ๆ
        touchItem.style.transition = 'transform 0.2s';
        touchItem.style.transform = 'scale(0.9)';
        setTimeout(() => {
          touchItem.style.transition = '';
          touchItem.style.transform = '';
        }, 200);
      }

      // คืนตำแหน่งเดิมหลังปล่อย
      touchItem.style.position = 'static';
      touchItem.style.left = '';
      touchItem.style.top = '';
      touchItem.style.zIndex = '';
      touchItem.classList.remove('dragging');
      touchItem = null;
    });
  });

  // ==============================
  // ✅ ฟังก์ชันตรวจสอบการจับคู่
  // ==============================
  function checkMatch(draggedMatchId, targetMatchId, draggedElement, slot) {
    if (draggedMatchId === targetMatchId) {
      // 🟩 ถูก
      slot.classList.add('correct');
      slot.innerHTML = '';
      slot.appendChild(draggedElement);
      draggedElement.classList.add('matched');
      draggedElement.draggable = false;
      showFeedback(true);
    } else {
      // 🟥 ผิด
      slot.classList.add('wrong');
      setTimeout(() => slot.classList.remove('wrong'), 600);
      showFeedback(false);
    }
  }

  // ==============================
  // 🌿 แจ้งผลแบบ Pop-up
  // ==============================
  function showFeedback(isCorrect) {
    const msg = document.createElement('div');
    msg.className = isCorrect ? 'feedback correct-msg' : 'feedback wrong-msg';
    msg.textContent = isCorrect ? '✅ ถูกต้อง!' : '❌ ผิด ลองใหม่นะ';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 1000);
  }
}
