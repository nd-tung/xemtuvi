const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Import lunar date library
const { SolarDate, LunarDate } = require('@nghiavuive/lunar_date_vi');

// Function to convert solar date to lunar date
function solarToLunar(solarDateString) {
  try {
    const solarDate = new Date(solarDateString);
    const solarDateObj = new SolarDate(solarDate);
    const lunarDateObj = solarDateObj.toLunarDate();
    
    return {
      day: solarDate.getDate(),
      month: solarDate.getMonth() + 1,
      year: solarDate.getFullYear(),
      lunarDay: lunarDateObj.day,
      lunarMonth: lunarDateObj.month,
      lunarYear: lunarDateObj.year,
      leapMonth: lunarDateObj.leap_month || false
    };
  } catch (error) {
    console.error('Error converting solar to lunar date:', error);
    // Fallback to original date if conversion fails
    const date = new Date(solarDateString);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      lunarDay: date.getDate(),
      lunarMonth: date.getMonth() + 1,
      lunarYear: date.getFullYear(),
      leapMonth: false
    };
  }
}

// Hexagrams data (64 hexagrams of I Ching)
const hexagrams = [
  { symbol: '☰', name: 'Càn', meaning: 'Trời', description: 'Sức mạnh sáng tạo, khởi đầu tốt lành. Thời điểm thuận lợi để bắt đầu những dự án mới.' },
  { symbol: '☷', name: 'Khôn', meaning: 'Đất', description: 'Khả năng tiếp nhận và nuôi dưỡng. Cần kiên nhẫn và bao dung trong giai đoạn này.' },
  { symbol: '☳', name: 'Chấn', meaning: 'Sấm', description: 'Sự thức tỉnh và khởi động. Có thể có những thay đổi đột ngột nhưng tích cực.' },
  { symbol: '☵', name: 'Khảm', meaning: 'Nước', description: 'Khó khăn và thử thách. Cần thận trọng và kiên định để vượt qua.' },
  { symbol: '☶', name: 'Cấn', meaning: 'Núi', description: 'Sự dừng lại và suy ngẫm. Thời điểm thích hợp để nghỉ ngơi và tích lũy sức lực.' },
  { symbol: '☴', name: 'Tốn', meaning: 'Gió', description: 'Sự lan tỏa và phát triển từ từ. Ảnh hưởng tích cực sẽ lan rộng.' },
  { symbol: '☲', name: 'Ly', meaning: 'Lửa', description: 'Sự sáng tỏ và thông minh. Thời kỳ thuận lợi cho học tập và sáng tạo.' },
  { symbol: '☱', name: 'Đoài', meaning: 'Hồ', description: 'Niềm vui và hài hòa. Giai đoạn tốt cho các mối quan hệ và giao tiếp.' }
];

function getRandomHexagram() {
  return hexagrams[Math.floor(Math.random() * hexagrams.length)];
}

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Oracle endpoint
app.get('/oracle', async (req, res) => {
  const { type } = req.query;
  
  if (!type || !['week', 'month', 'year'].includes(type)) {
    return res.status(400).json({ message: 'Invalid oracle type' });
  }
  
  try {
    const hexagram = getRandomHexagram();
    
    // Generate AI interpretation based on type and hexagram
const userInfo = JSON.parse(req.query.userInfo);
    const prompt = `Bạn là một chuyên gia Kinh Dịch. Dưới đây là thông tin người dùng:

- Họ và tên: ${userInfo.name}
- Ngày sinh: ${userInfo.birthDate}
- Giờ sinh: ${userInfo.birthTime}

Hãy luận giải quẻ ${hexagram.name} (${hexagram.meaning}) cho giai đoạn ${type === 'week' ? '1 tuần' : type === 'month' ? '1 tháng' : '1 năm'} tới dựa trên thông tin cá nhân của họ.

Hãy trả lời theo đúng định dạng JSON sau (không thêm bất kỳ text nào khác ngoài JSON):

{
  "van_so_chung": "Phân tích vận số tổng quát cho giai đoạn này...",
  "cong_viec_su_nghiep": "Lời khuyên về công việc và sự nghiệp...",
  "tinh_cam_moi_quan_he": "Phân tích về tình cảm và các mối quan hệ...",
  "suc_khoe_tai_chinh": "Lời khuyên về sức khỏe và tài chính...",
  "loi_khuyen_cu_the": "Những lời khuyên cụ thể và hướng dẫn thực tế..."
}

Mỗi phần cần:
- Dựa trên ý nghĩa quẻ ${hexagram.name}
- Chi tiết và có thể áp dụng
- Dễ hiểu bằng tiếng Việt
- Dài khoảng 80-120 từ mỗi khía cạnh`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const interpretation = response.text();
    
    res.json({
      hexagram: hexagram.symbol,
      title: `Quẻ ${hexagram.name} - ${hexagram.meaning}`,
      description: interpretation
    });
    
  } catch (error) {
    console.error('Error generating oracle:', error);
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi xin quẻ', 
      error: error.message 
    });
  }
});

// Endpoint to handle form submission
app.post('/submit', upload.single('tuviImage'), async (req, res) => {
const { name, birthDate, birthTime } = req.body;
  const userInfo = { name, birthDate, birthTime };
  
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  try {
    const lunarInfo = solarToLunar(birthDate);
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString('base64');
    const prompt = `Tôi có một lá số tử vi cần được phân tích chi tiết. Thông tin người cần luận giải như sau:

Họ và tên: ${name}

Ngày tháng năm sinh (Dương lịch): ${birthDate}

Giờ sinh: ${birthTime}

Ngày tháng năm sinh (Âm lịch): ${lunarInfo.lunarDay}/${lunarInfo.lunarMonth}/${lunarInfo.lunarYear}

Tôi đã đính kèm hình ảnh lá số tử vi. Hãy căn cứ hoàn toàn vào các dữ liệu, cung mệnh, các sao và cách cục xuất hiện trong hình ảnh lá số tử vi đính kèm để đưa ra lý giải chi tiết về các khía cạnh sau đây:

Hãy trả lời theo đúng định dạng JSON sau (không thêm bất kỳ text nào khác ngoài JSON):

{
  "tong_quan_van_menh": "Phân tích tổng quan về vận mệnh cuộc đời dựa trên cung mệnh, các sao chính, cách cục trong lá số...",
  "cong_danh_su_nghiep": "Phân tích về công danh, sự nghiệp dựa trên cung quan lộc, các sao liên quan...",
  "tinh_duyen_hon_nhan": "Phân tích về tình duyên, hôn nhân dựa trên cung phu thê, các sao tình duyên...",
  "gia_dao_suc_khoe_tai_chinh": "Phân tích về gia đạo, sức khỏe và tài chính dựa trên các cung liên quan và sao chiếu mệnh..."
}

Mỗi phần phân tích cần:
- Dựa trên giải thích rõ ràng về cung, sao, cách cục
- Chi tiết, chuyên nghiệp
- Dễ hiểu bằng tiếng Việt
- Dài khoảng 200-300 từ mỗi khía cạnh`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype
        }
      }
    ]);
    const response = await result.response;
    const analysisResult = response.text();
    fs.unlinkSync(req.file.path);
    const lunarDateString = lunarInfo.leapMonth ? 
      `${lunarInfo.lunarDay}/${lunarInfo.lunarMonth} (nhuận)/${lunarInfo.lunarYear}` : 
      `${lunarInfo.lunarDay}/${lunarInfo.lunarMonth}/${lunarInfo.lunarYear}`;
      
    res.json({ 
      message: 'Success', 
      analysis: analysisResult,
      lunarDate: lunarDateString,
      solarDate: birthDate,
      birthTime: birthTime,
      name: name
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Đã xảy ra lỗi khi xử lý yêu cầu', 
      error: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

