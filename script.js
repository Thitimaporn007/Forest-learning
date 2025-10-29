// ฟังก์ชันนี้จะทำงานเมื่อการ์ดถูกคลิก
function flipCard(cardElement) {
  // 'cardElement' คือ .card ที่ถูกคลิก
  
  // สั่งให้เพิ่ม/ลบ คลาส 'flipped'
  // CSS (ใน style.css) จะจัดการเรื่องการหมุนให้เอง
  cardElement.classList.toggle('flipped');
}

/* =========================================
  ฟังก์ชันสำหรับเกมจับคู่ (เพิ่มต่อท้ายไฟล์)
=========================================
*/

// ตรวจสอบก่อนว่าเราอยู่ในหน้าเกมจับคู่
if (document.querySelector('.matching-game-container')) {

  const draggableItems = document.querySelectorAll('.drag-item');
  const dropSlots = document.querySelectorAll('.drop-slot');
  let draggedItemId = null; // ตัวแปรเก็บ ID ของสิ่งที่กำลังลาก

  // 1. เพิ่ม Event Listeners ให้กับ "สิ่งที่ลากได้"
  draggableItems.forEach(item => {
    
    // เมื่อเริ่มลาก
    item.addEventListener('dragstart', (e) => {
      draggedItemId = e.target.id; // เก็บ ID ของชิ้นที่ลาก
      // ส่งข้อมูล 'match-id' ไปด้วย
      e.dataTransfer.setData('match-id', e.target.dataset.matchId);
      setTimeout(() => {
        e.target.style.opacity = '0.5'; // ทำให้จางลงเล็กน้อยตอนลาก
      }, 0);
    });

    // เมื่อลากเสร็จ (ไม่ว่าจะวางสำเร็จหรือไม่)
    item.addEventListener('dragend', (e) => {
      draggedItemId = null; // ล้างค่า
      e.target.style.opacity = '1'; // กลับมาทึบเหมือนเดิม
    });
  });

  // 2. เพิ่ม Event Listeners ให้กับ "ช่องสำหรับวาง"
  dropSlots.forEach(slot => {
    
    // เมื่อมีไอเทมลากมาอยู่เหนือช่อง
    slot.addEventListener('dragover', (e) => {
      e.preventDefault(); // *** สำคัญมาก: อนุญาตให้วางทับได้
      if (!slot.classList.contains('correct')) {
        slot.classList.add('hover'); // เพิ่มไฮไลต์
      }
    });

    // เมื่อไอเทมออกจากพื้นที่ช่อง
    slot.addEventListener('dragleave', () => {
      slot.classList.remove('hover'); // เอาไฮไลต์ออก
    });

    // เมื่อทำการ "ปล่อย" (Drop) ไอเทมลงในช่อง
    slot.addEventListener('drop', (e) => {
      e.preventDefault(); // ป้องกันการเปิดหน้าใหม่
      slot.classList.remove('hover');

      // ถ้าช่องนี้ถูกจับคู่ไปแล้ว ก็ไม่ต้องทำอะไร
      if (slot.classList.contains('correct')) {
        return;
      }

      // ตรวจสอบ ID
      const draggedMatchId = e.dataTransfer.getData('match-id');
      const targetMatchId = slot.dataset.matchId;

      const draggedElement = document.getElementById(draggedItemId);

      // ---- ตรวจสอบว่าถูกหรือผิด ----
      if (draggedMatchId === targetMatchId) {
        // 🟩 ถ้าถูก (สีเขียว)
        slot.classList.add('correct');
        slot.innerHTML = ''; // ล้างข้อความ "เทอร์โมมิเตอร์" ฯลฯ ออก
        slot.appendChild(draggedElement); // ย้ายไอเทมที่ลากมาใส่ในช่องนี้
        
        draggedElement.classList.add('matched');
        draggedElement.draggable = false; // ทำให้ลากต่อไม่ได้
        
      } else {
        // 🟥 ถ้าผิด (สีแดง)
        slot.classList.add('wrong');
        // ทำให้สีแดงหายไปหลังจาก 0.5 วินาที
        setTimeout(() => {
          slot.classList.remove('wrong');
        }, 500);
      }
    });
  });
}


