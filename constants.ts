
import type { StyleCategory, Style, GenderSpecificStyles, ColorOption } from './types';

const FACE_PREVIEW = 'https://placehold.co/100x100/ffedd5/333/png?text=Face';

const SUIT_COLORS: ColorOption[] = [
  { label: 'ดำ', value: 'สีดำ', hex: '#262626' },
  { label: 'กรมท่า', value: 'สีกรมท่า', hex: '#1e3a8a' },
  { label: 'เทาเข้ม', value: 'สีเทาเข้ม', hex: '#404040' },
  { label: 'เทาอ่อน', value: 'สีเทาอ่อน', hex: '#a3a3a3' },
  { label: 'น้ำตาล', value: 'สีน้ำตาล', hex: '#78350f' },
  { label: 'ครีม', value: 'สีครีม', hex: '#fef3c7' },
  { label: 'ขาว', value: 'สีขาว', hex: '#ffffff' },
];

const SHIRT_COLORS: ColorOption[] = [
  { label: 'ขาว', value: 'สีขาว', hex: '#ffffff' },
  { label: 'ฟ้าอ่อน', value: 'สีฟ้าอ่อน', hex: '#bae6fd' },
  { label: 'ดำ', value: 'สีดำ', hex: '#262626' },
  { label: 'เทา', value: 'สีเทา', hex: '#a3a3a3' },
  { label: 'ชมพูอ่อน', value: 'สีชมพูอ่อน', hex: '#fce7f3' },
  { label: 'ครีม', value: 'สีครีม', hex: '#fef3c7' },
  { label: 'กรมท่า', value: 'สีกรมท่า', hex: '#1e3a8a' },
];

export const CATEGORIES: { id: StyleCategory; label:string }[] = [
    { id: 'saved', label: 'สไตล์ที่บันทึก' },
    { id: 'saved_clothes', label: 'เสื้อผ้าที่บันทึก' },
    { id: 'clothes', label: 'เปลี่ยนเสื้อ' },
    { id: 'background', label: 'เปลี่ยนฉาก' },
    { id: 'pose', label: 'ท่าโพส' },
    { id: 'lighting', label: 'แสง/เอฟเฟค' },
    { id: 'hair_color', label: 'เปลี่ยนสีผม' },
    { id: 'hairstyle', label: 'เปลี่ยนทรงผม' },
    { id: 'retouching', label: 'ปรับแต่งใบหน้า' },
];

export const STYLES: {
  clothes: GenderSpecificStyles;
  background: Style[];
  retouching: GenderSpecificStyles;
  hair_color: Style[];
  hairstyle: GenderSpecificStyles;
  lighting: Style[];
  pose: Style[];
  saved: Style[]; 
  saved_clothes: Style[]; 
} = {
  clothes: {
    male: [
      { label: 'สูทคลาสสิก', prompt: 'เปลี่ยนเป็นชุดสูทสากล {color} ทับเสื้อเชิ้ตขาวเรียบ และผูกเนคไทสีที่เข้ากัน', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/374151/FFF/png?text=Suit'], colors: SUIT_COLORS },
      { label: 'ชุดสูท (ไม่ผูกไท)', prompt: 'เปลี่ยนเป็นชุดสูท {color} ทับเสื้อเชิ้ตขาว ปลดกระดุมบน ไม่ผูกเนคไท', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/374151/FFF/png?text=Open+Suit'], colors: SUIT_COLORS },
      { label: 'เสื้อเบลเซอร์', prompt: 'เปลี่ยนเป็นเสื้อเบลเซอร์สไตล์ business casual {color} ทับเสื้อตัวในสีพื้น', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/374151/FFF/png?text=Blazer'], colors: SUIT_COLORS },
      { label: 'ชุดข้าราชการ', prompt: 'เปลี่ยนเป็นชุดข้าราชการพลเรือนสีกากีคอพับสำหรับผู้ชาย (ปลอดเครื่องหมายและตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/a1887f/FFF/png?text=Official'] },
      { label: 'ชุดปกติขาว', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบปกติขาวสำหรับผู้ชาย (ปลอดเครื่องหมายและตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/f1f5f9/333/png?text=White+Uniform'] },
      { label: 'ชุดซาฟารี', prompt: 'เปลี่ยนเป็นชุดซาฟารีสีกากีหรือสีสุภาพสำหรับผู้ชาย', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/a1887f/FFF/png?text=Safari'] },
      { label: 'ชุดครุย', prompt: 'เปลี่ยนเป็นชุดครุยรับปริญญาสำหรับผู้ชาย (รูปแบบทั่วไป ปลอดตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/111827/FFF/png?text=Gown'] },
      { label: 'ชุดตำรวจ', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบตำรวจชายไทย (รูปแบบทั่วไป ปลอดเครื่องหมายยศและตราจริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/5d4037/FFF/png?text=Police'] },
      { label: 'ชุดทหาร', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบทหารชาย (รูปแบบทั่วไป ปลอดเครื่องหมายยศและตราจริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/4d7c0f/FFF/png?text=Army'] },
      { label: 'นักเรียนประถม (ชาย)', prompt: 'เปลี่ยนเป็นชุดนักเรียนชายระดับประถม เสื้อเชิ้ตขาวคอปก แขนสั้น ปล่อยชายเสื้อ', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Elem+Boy'] },
      { label: 'นักเรียน ม.ต้น (ชาย)', prompt: 'เปลี่ยนเป็นชุดนักเรียนชายระดับมัธยมต้น เสื้อเชิ้ตขาวคอปก แขนสั้น ไม่มีกระเป๋าเสื้อ ใส่ชายเสื้อในกางเกง', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Mid+Boy'] },
      { label: 'นักเรียน ม.ปลาย (ชาย)', prompt: 'เปลี่ยนเป็นชุดนักเรียนชายระดับมัธยมปลาย เสื้อเชิ้ตขาวคอปก แขนสั้น มีกระเป๋าเสื้อด้านซ้าย ใส่ชายเสื้อในกางเกง', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=High+Boy'] },
      { label: 'นักศึกษา (ชาย)', prompt: 'เปลี่ยนเป็นชุดนักศึกษาชาย เสื้อเชิ้ตขาวแขนยาวพับแขน มีกระเป๋าเสื้อด้านซ้าย ใส่ชายเสื้อในกางเกง', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Uni+Boy'] },
      { label: 'ชุด ร.ด. (นักศึกษาวิชาทหาร)', prompt: 'เปลี่ยนเป็นชุดนักศึกษาวิชาทหาร (ร.ด.) สีดำ แขนยาว พร้อมเครื่องหมาย', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/171717/FFF/png?text=R.D.'] },
      { label: 'นักศึกษา (ไทแดงเลือดหมู)', prompt: 'เปลี่ยนเป็นชุดนักศึกษาชาย เสื้อเชิ้ตขาวแขนยาว ผูกเนคไทสีแดงเลือดหมู', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/7f1d1d/FFF/png?text=Red+Tie'] },
      { label: 'เสื้อเชิ้ต', prompt: 'เปลี่ยนเป็นเสื้อเชิ้ต {color} เรียบสุภาพสำหรับผู้ชาย', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/f8fafc/333/png?text=Shirt'], colors: SHIRT_COLORS },
      { label: 'เสื้อโปโลสีสุภาพ', prompt: 'เปลี่ยนเป็นเสื้อโปโลมีปกสีสุภาพเรียบๆ เช่น สีกรมท่า, สีขาว, หรือสีเทา', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/4b5563/FFF/png?text=Polo'] },
      { label: 'เสื้อคอจีน', prompt: 'เปลี่ยนเป็นเสื้อคอจีนสีขาวหรือสีอ่อนสำหรับผู้ชาย ดูสุภาพเรียบร้อย', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/e5e7eb/333/png?text=Mandarin'] },
      { label: 'เสื้อคอเต่า', prompt: 'เปลี่ยนเป็นเสื้อคอเต่าสีพื้นเรียบๆ (เช่น สีดำ, เทา) ดูอบอุ่นและเป็นมืออาชีพ', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/171717/FFF/png?text=Turtleneck'] },
      { label: 'เสื้อสเวตเตอร์', prompt: 'เปลี่ยนเป็นเสื้อสเวตเตอร์ไหมพรมคอกลมสีสุภาพ ทับบนเสื้อเชิ้ต', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/9ca3af/FFF/png?text=Sweater'] },
      { label: 'เชิ้ตออกซ์ฟอร์ด', prompt: 'เปลี่ยนเป็นเสื้อเชิ้ตผ้าออกซ์ฟอร์ดสีพื้น เช่น สีฟ้าอ่อน หรือสีขาว', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/a5f3fc/333/png?text=Oxford'] },
      { label: 'แจ็คเก็ตลำลอง', prompt: 'เปลี่ยนเป็นแจ็คเก็ตสไตล์ลำลองที่ดูดี เช่น บอมเบอร์แจ็คเก็ต หรือฟิลด์แจ็คเก็ตสีเข้ม', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/57534e/FFF/png?text=Jacket'] },
      { label: 'เสื้อพระราชทาน', prompt: 'เปลี่ยนเป็นชุดเสื้อพระราชทานสำหรับผู้ชาย (ปลอดเครื่องหมายและตราสัญลักษณ์)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/fcd34d/333/png?text=Thai'] },
      { label: 'เสื้อยืดแขนกุด', prompt: 'เปลี่ยนเป็นเสื้อยืดแขนกุดสีพื้นเรียบๆ เช่น สีขาว, สีดำ, หรือสีเทา', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/f8fafc/333/png?text=Sleeveless'] },
    ],
    female: [
      { label: 'สูททำงาน', prompt: 'เปลี่ยนเป็นชุดสูททำงาน {color} สำหรับผู้หญิงที่ดูสุภาพและเป็นมืออาชีพ', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/374151/FFF/png?text=Suit'], colors: SUIT_COLORS },
      { label: 'เสื้อเบลเซอร์', prompt: 'เปลี่ยนเป็นเสื้อเบลเซอร์สไตล์ business casual {color} ทับเสื้อตัวในสีพื้น', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/374151/FFF/png?text=Blazer'], colors: SUIT_COLORS },
      { label: 'เสื้อเบลาส์ทำงาน', prompt: 'เปลี่ยนเป็นเสื้อเบลาส์ทำงาน {color} ดูสุภาพและเป็นมืออาชีพ', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/e9d5ff/333/png?text=Blouse'], colors: SHIRT_COLORS },
      { label: 'ชุดข้าราชการ', prompt: 'เปลี่ยนเป็นชุดข้าราชการพลเรือนสีกากีสำหรับผู้หญิง (ปลอดเครื่องหมายและตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/a1887f/FFF/png?text=Official'] },
      { label: 'ชุดปกติขาว', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบปกติขาวสำหรับผู้หญิง (ปลอดเครื่องหมายและตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/f1f5f9/333/png?text=White+Uniform'] },
      { label: 'ชุดครุย', prompt: 'เปลี่ยนเป็นชุดครุยรับปริญญาสำหรับผู้หญิง (รูปแบบทั่วไป ปลอดตราสัญลักษณ์จริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/111827/FFF/png?text=Gown'] },
      { label: 'ชุดตำรวจ', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบตำรวจหญิงไทย (รูปแบบทั่วไป ปลอดเครื่องหมายยศและตราจริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/5d4037/FFF/png?text=Police'] },
      { label: 'ชุดทหาร', prompt: 'เปลี่ยนเป็นชุดเครื่องแบบทหารหญิง (รูปแบบทั่วไป ปลอดเครื่องหมายยศและตราจริง)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/4d7c0f/FFF/png?text=Army'] },
      { label: 'ชุดพยาบาล', prompt: 'เปลี่ยนเป็นชุดพยาบาลสีขาว (รูปแบบมาตรฐาน ปลอดตราสถาบัน)', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/ecfccb/333/png?text=Nurse'] },
      { label: 'นักเรียนประถม (หญิง)', prompt: 'เปลี่ยนเป็นชุดนักเรียนหญิงระดับประถม เสื้อเชิ้ตขาวคอบัว แขนสั้นจีบ ปล่อยชายเสื้อ', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Elem+Girl'] },
      { label: 'นักเรียน ม.ต้น (หญิง)', prompt: 'เปลี่ยนเป็นชุดนักเรียนหญิงระดับมัธยมต้น เสื้อคอบัวสีขาว แขนสั้น ผูกโบว์สีน้ำเงินกรมท่า ปล่อยชายเสื้อ', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Mid+Girl'] },
      { label: 'นักเรียน ม.ปลาย (หญิง)', prompt: 'เปลี่ยนเป็นชุดนักเรียนหญิงระดับมัธยมปลาย เสื้อเชิ้ตขาวคอปก แขนสั้น จีบที่ไหล่และหลัง ใส่ชายเสื้อในกระโปรง', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=High+Girl'] },
      { label: 'นักศึกษา (หญิง)', prompt: 'เปลี่ยนเป็นชุดนักศึกษาหญิง เสื้อเชิ้ตขาวพอดีตัว ติดกระดุมคอเสื้อ กลัดเข็มกลัดมหาวิทยาลัย ใส่ชายเสื้อในกระโปรง', previewImages: ['https://placehold.co/100x100/ffedd5/333/png?text=Face', 'https://placehold.co/100x100/f8fafc/333/png?text=Uni+Girl'] },
      { label: 'ชุดไทยจิตรลดา', prompt: 'เปลี่ยนเป็นชุดไทยจิตรลดาผ้าไหมสีสุภาพ (เช่น สีเหลือง, ฟ้า, หรือสีครีม) แขนยาวคอตั้ง', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/fcd34d/333/png?text=Thai'] },
      { label: 'เสื้อคอเต่า', prompt: 'เปลี่ยนเป็นเสื้อคอเต่าสีพื้นเรียบๆ (เช่น สีดำ, เทา) ดูอบอุ่นและเป็นมืออาชีพ', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/171717/FFF/png?text=Turtleneck'] },
      { label: 'เดรสสุภาพ', prompt: 'เปลี่ยนเป็นชุดเดรสทำงานสีสุภาพ คอกลมหรือคอวีตื้น ทรงสุภาพ', previewImages: [FACE_PREVIEW, 'https://placehold.co/100x100/fce7f3/333/png?text=Dress'] },
    ]
  },
  background: [
    { label: 'สตูดิโอ (น้ำเงิน)', prompt: 'ฉากหลังสีน้ำเงินเข้ม ไล่เฉดสีแบบสตูดิโอถ่ายภาพบุคคลมาตรฐาน', previewImages: ['https://placehold.co/100x100/1e3a8a/FFF/png?text=Blue'] },
    { label: 'สตูดิโอ (ฟ้าน้ำทะเล)', prompt: 'ฉากหลังสีฟ้าน้ำทะเลไล่เฉด (Sea Blue Gradient) แบบสตูดิโอถ่ายภาพ ดูสดใสและเป็นมืออาชีพ', previewImages: ['https://placehold.co/100x100/0ea5e9/FFF/png?text=Sea+Blue'] },
    { label: 'สตูดิโอ (ขาว)', prompt: 'ฉากหลังสีขาวสะอาดตา แสงสว่างนุ่มนวล', previewImages: ['https://placehold.co/100x100/ffffff/333/png?text=White'] },
    { label: 'สตูดิโอ (เทา)', prompt: 'ฉากหลังสีเทากลาง ไล่เฉดสีนุ่มนวล ดูเป็นมืออาชีพ', previewImages: ['https://placehold.co/100x100/9ca3af/333/png?text=Grey'] },
    { label: 'สีฟ้าอ่อน', prompt: 'ฉากหลังสีฟ้าอ่อนพาสเทล สดใสสะอาดตา', previewImages: ['https://placehold.co/100x100/bae6fd/333/png?text=Light+Blue'] },
    { label: 'เอาท์ดอร์ (เบลอ)', prompt: 'ฉากหลังธรรมชาติภายนอกอาคาร ละลายหลัง (Bokeh) แสงธรรมชาติ', previewImages: ['https://placehold.co/100x100/84cc16/FFF/png?text=Nature'] },
    { label: 'ออฟฟิศ', prompt: 'ฉากหลังสภาพแวดล้อมสำนักงานสมัยใหม่ ละลายหลัง (Blurred Office background)', previewImages: ['https://placehold.co/100x100/64748b/FFF/png?text=Office'] },
    { label: 'ห้องสมุด', prompt: 'ฉากหลังชั้นหนังสือในห้องสมุด ละลายหลัง ดูมีความรู้', previewImages: ['https://placehold.co/100x100/78350f/FFF/png?text=Library'] },
    { label: 'Cyberpunk City', prompt: 'ลบพื้นหลังเดิมและแทนที่ด้วยเมืองโลกอนาคตไ Cyberpunk ยามค่ำคืน มีแสงไฟนีออนสีชมพูและฟ้าสะท้อนสวยงาม', previewImages: ['https://placehold.co/100x100/1e1b4b/FFF/png?text=Cyber'] },
    { label: 'Fantasy Forest', prompt: 'ลบพื้นหลังเดิมและแทนที่ด้วยป่าแฟนตาซีที่มีละอองแสงเวทมนตร์และต้นไม้ใหญ่ดูร่มรื่น', previewImages: ['https://placehold.co/100x100/064e3b/FFF/png?text=Forest'] },
  ],
  retouching: {
    male: [
       { label: 'หน้าเนียนใส', prompt: 'Smooth skin, reduce blemishes and wrinkles, natural skin texture', previewImages: [] },
       { label: 'หน้าเรียว', prompt: 'Slightly slimmer face, defined jawline', previewImages: [] },
       { label: 'ลดถุงใต้ตา', prompt: 'Remove eye bags and dark circles, bright eyes', previewImages: [] },
       { label: 'โกนหนวด', prompt: 'Clean shaven face, remove facial hair', previewImages: [] },
    ],
    female: [
       { label: 'หน้าเนียนใส', prompt: 'Smooth skin, porcelain skin texture, reduce blemishes', previewImages: [] },
       { label: 'หน้าเรียว', prompt: 'V-shape face, slimmer cheeks', previewImages: [] },
       { label: 'ตาโต', prompt: 'Slightly larger eyes, bright and sparkling', previewImages: [] },
       { label: 'แต่งหน้าธรรมชาติ', prompt: 'Natural makeup, soft lipstick, light blush', previewImages: [] },
       { label: 'แต่งหน้าจัดเต็ม', prompt: 'Full glam makeup, defined eyeliner, red lips', previewImages: [] },
    ]
  },
  hair_color: [
    { label: 'สีดำธรรมชาติ', prompt: 'Natural Black hair color', previewImages: [] },
    { label: 'สีน้ำตาลเข้ม', prompt: 'Dark Brown hair color', previewImages: [] },
    { label: 'สีน้ำตาลอ่อน', prompt: 'Light Brown hair color', previewImages: [] },
    { label: 'สีทอง', prompt: 'Blonde hair color', previewImages: [] },
    { label: 'สีเทา', prompt: 'Grey/Silver hair color', previewImages: [] },
    { label: 'สีแดง', prompt: 'Red/Auburn hair color', previewImages: [] },
  ],
  hairstyle: {
    male: [
      { label: 'รองทรงต่ำ', prompt: 'Short haircut, low fade, neat and professional', previewImages: [] },
      { label: 'รองทรงสูง', prompt: 'Short haircut, high fade, smart look', previewImages: [] },
      { label: 'เปิดข้าง', prompt: 'Undercut hairstyle, slicked back top', previewImages: [] },
      { label: 'แสกข้าง', prompt: 'Side part hairstyle, classic gentleman look', previewImages: [] },
      { label: 'เกาหลี (Two Block)', prompt: 'Two block haircut, K-pop style, soft texture', previewImages: [] },
    ],
    female: [
      { label: 'ผมยาวตรง', prompt: 'Long straight hair, silky and smooth', previewImages: [] },
      { label: 'ผมลอน', prompt: 'Long wavy hair, loose curls, voluminous', previewImages: [] },
      { label: 'ผมบ๊อบสั้น', prompt: 'Short bob hairstyle, chin length', previewImages: [] },
      { label: 'รวบผม', prompt: 'Tied back hair, ponytail or bun, neat professional look', previewImages: [] },
      { label: 'หน้าม้า', prompt: 'Hairstyle with bangs/fringe', previewImages: [] },
    ]
  },
  lighting: [
    { label: 'แสงสตูดิโอ', prompt: 'Studio Lighting, Softbox, evenly lit face', previewImages: [] },
    { label: 'แสงธรรมชาติ', prompt: 'Natural Lighting, soft sunlight', previewImages: [] },
    { label: 'แสงริมไลท์', prompt: 'Rim Lighting, backlight, dramatic edge', previewImages: [] },
    { label: 'แสงดรามาติก', prompt: 'Dramatic Lighting, high contrast, shadows', previewImages: [] },
    { label: 'แสงอุ่น', prompt: 'Warm Lighting, golden hour tone', previewImages: [] },
    { label: 'แสงเย็น', prompt: 'Cool Lighting, cinematic blue tone', previewImages: [] },
    { label: 'Studio Neon', prompt: 'จัดแสงแบบ Studio Neon Light ใช้ไฟสีคู่ตรงข้าม (เช่น ส้ม-ฟ้า) ส่องกระทบตัวแบบให้ดูทันสมัย', previewImages: ['https://placehold.co/100x100/312e81/FFF/png?text=Neon'] },
  ],
  pose: [
    { label: 'หน้าตรง', prompt: 'Facing camera directly, straight head', previewImages: [] },
    { label: 'หันข้างเล็กน้อย', prompt: 'Turned slightly to the side (45 degrees), looking at camera', previewImages: [] },
    { label: 'กอดอก', prompt: 'Arms crossed, confident pose', previewImages: [] },
  ],
  saved: [],
  saved_clothes: [],
};

export const MEMORIAL_OUTFITS = [
    { label: 'ชุดสูทดำ (ชาย)', prompt: 'ชุดสูทสีดำสนิท ทับเสื้อเชิ้ตขาว ผูกเนคไทสีดำ สำหรับงานพิธีศพ (ผู้ชาย)' },
    { label: 'เสื้อเชิ้ตขาว (ชาย)', prompt: 'เสื้อเชิ้ตสีขาวแขนยาว ติดกระดุมคอ เรียบร้อย สำหรับงานพิธี (ผู้ชาย)' },
    { label: 'ชุดไทยดำ (หญิง)', prompt: 'ชุดไทยจิตรลดาสีดำสนิท สำหรับงานพิธีศพ (ผู้หญิง)' },
    { label: 'ชุดสูทดำ (หญิง)', prompt: 'ชุดสูทสีดำสนิทสุภาพ สำหรับงานพิธีศพ (ผู้หญิง)' },
    { label: 'เสื้อลูกไม้ดำ (หญิง)', prompt: 'เสื้อลูกไม้สีดำสุภาพแขนยาว สำหรับงานพิธี (ผู้หญิง)' },
];

export const MEMORIAL_BACKGROUNDS = [
    { label: 'ฟ้าขาว (ไล่สี)', prompt: 'ฉากหลังไล่เฉดสีฟ้าอ่อนไปขาว ดูสงบและสุภาพ (Memorial style)' },
    { label: 'ขาวล้วน', prompt: 'ฉากหลังสีขาวล้วน สะอาดตา' },
    { label: 'ลายเทพพนม', prompt: 'ฉากหลังลายไทยเทพพนมสีจางๆ ดูขลังและศักดิ์สิทธิ์' },
    { label: 'วิวภูเขา', prompt: 'ฉากหลังวิวภูเขาและหมอกจางๆ ดูสงบ (Peaceful scenery)' },
    { label: 'ดอกไม้ขาว', prompt: 'ฉากหลังประดับดอกไม้สีขาวเล็กน้อย ดูอ่อนโยน' },
];
