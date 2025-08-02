# 🔮 Tử Vi AI - Ứng Dụng Xem Lá Số Tử Vi

Ứng dụng web sử dụng trí tuệ nhân tạo Gemini để phân tích và luận giải lá số tử vi từ hình ảnh.

## ✨ Tính Năng

- 📝 Nhập thông tin cá nhân (tên, ngày sinh dương lịch)
- 🔄 Tự động chuyển đổi ngày sinh sang âm lịch
- 📷 Upload ảnh lá số tử vi
- 🤖 Phân tích lá số bằng AI Gemini
- 📊 Luận giải chi tiết về:
  - Bản mệnh và tính cách
  - Vận mệnh trong năm
  - Tình duyên và hôn nhân
  - Sự nghiệp và tài lộc
  - Sức khỏe
  - Lời khuyên và hướng dẫn

## 🚀 Hướng Dẫn Cài Đặt

### 1. Cài đặt Node.js dependencies
```bash
npm install
```

### 2. Cấu hình API Key
Chỉnh sửa file `.env` và thêm Gemini API key của bạn:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
```

### 3. Lấy Gemini API Key
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API key mới
3. Copy và paste vào file `.env`

### 4. Chạy ứng dụng
```bash
npm start
```

Hoặc để development với auto-reload:
```bash
npm run dev
```

### 5. Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

## 📋 Cách Sử Dụng

1. **Nhập thông tin**: Điền họ tên và ngày sinh dương lịch
2. **Upload ảnh**: Chọn ảnh lá số tử vi của bạn (JPG, PNG)
3. **Phân tích**: Nhấn "Xem Kết Quả Tử Vi" và chờ AI xử lý
4. **Xem kết quả**: Đọc phân tích chi tiết từ AI

## 🛠️ Công Nghệ Sử Dụng

- **Backend**: Node.js, Express.js
- **AI**: Google Gemini API
- **Frontend**: HTML5, CSS3, JavaScript
- **Upload**: Multer
- **Date Conversion**: Lunar calendar conversion

## 📁 Cấu Trúc Project

```
tuvi/
├── server.js          # Server backend
├── index.html         # Giao diện người dùng
├── package.json       # Dependencies
├── .env              # Cấu hình API key
├── uploads/          # Thư mục lưu ảnh tạm
└── README.md         # Hướng dẫn
```

## ⚠️ Lưu Ý

- Cần có API key hợp lệ từ Google Gemini
- Ảnh upload cần rõ nét để AI phân tích tốt
- Kết quả chỉ mang tính chất tham khảo
- Ảnh sẽ được xóa sau khi xử lý xong

## 🔧 Troubleshooting

### Lỗi API Key
- Kiểm tra API key trong file `.env`
- Đảm bảo API key có quyền truy cập Gemini

### Lỗi Upload
- Kiểm tra thư mục `uploads/` tồn tại
- Đảm bảo file ảnh không quá lớn

### Lỗi Server
- Kiểm tra port 3000 có bị chiếm không
- Xem log console để debug

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Node.js version >= 14
2. API key Gemini hợp lệ
3. Dependencies đã cài đặt đủ

## 📄 License

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.
# xemtuvi
