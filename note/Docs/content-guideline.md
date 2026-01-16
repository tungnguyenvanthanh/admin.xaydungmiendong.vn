# 🏗️ Công ty Xây dựng Miền Đông

> **"Kiến tạo không gian sống chan hòa cùng thiên nhiên"**

---

## 📞 Thông tin liên hệ

- **Hotline:** 📱 0979.440.450
- **Văn phòng:** 🏤 73 Hoài Thanh, phường Lộc Sơn, thành phố Bảo Lộc, tỉnh Lâm Đồng
- **Email:** 📧 Xaydungmiendong75@gmail.com

---

## Mục đích tài liệu
Tài liệu này mô tả quy chuẩn viết content HTML cho website: cách dùng `quote`, danh sách, tiêu đề mục con, CTA, gallery, và `blockquote`. Mục tiêu: đồng nhất cấu trúc, đảm bảo truy cập và tối ưu hiệu năng.

---

## 1. CSS dùng chung
```html
<style>
    .quote {
        background: linear-gradient(135deg, #f3e7d8, #fdf6ee);
        border-left: 6px solid #c08457;
        padding: 2rem;
        border-radius: 1rem;
        font-style: italic;
    }
</style>
```

---

## 2. Quy tắc chung
- Nội dung nhấn mạnh: dùng `div.quote` và các đoạn bên trong phải dùng thẻ `<p>`.
- Thẻ `<p>` cuối cùng trong một khối nội dung phải có class `m-0` để tránh khoảng cách thừa.
- Tránh text trần trong các khối nhấn mạnh; chỉ dùng `<p>`.
- Mỗi vùng nội dung chỉ nên có một CTA chính.

---

## 3. Ví dụ & hướng dẫn chi tiết

### 3.1 `quote` (nhấn mạnh)
- Dùng để hiển thị slogan, triết lý hoặc thông điệp thương hiệu.
- Luôn dùng `<p>` bên trong `div.quote`.

```html
<div class="quote">
    <p>Kiến trúc không chỉ là xây dựng công trình, mà còn là tạo nên giá trị sống bền vững.</p>
    <p class="m-0">— Công ty Xây dựng Miền Đông</p>
</div>
```

---

### 3.2 `blockquote` (trích dẫn)
- Bao nội dung bằng `<p>`; đoạn cuối có `m-0`.
- Thêm `footer` + `cite` nếu cần nguồn.

```html
<blockquote class="blockquote border-start border-4 ps-3">
    <p class="m-0">“Một ngôi nhà đẹp ... lâu dài.”</p>
    <footer class="mt-2"><cite>— Công ty Xây dựng Miền Đông</cite></footer>
</blockquote>
```

---

### 3.3 Danh sách (ul / li)
- Mặc định: nội dung trong `li` nên đặt trong `<p>` để giữ nhất quán.
- Nếu icon đặt sát text và `<p>` gây xuống hàng, có thể để text inline hoặc dùng `<span>`.
- Giữ `aria` và khoảng cách bằng CSS khi dùng icon.

Ví dụ chuẩn:
```html
<ul class="blog-detail_list">
    <li>
        <p>Hỗ trợ cải tạo, nâng cấp cảnh quan theo nhu cầu sau này.</p>
    </li>
    <li>
        <p>Cam kết đồng hành cùng khách hàng trong suốt quá trình sử dụng.</p>
    </li>
    <li>
        <p class="m-0">Tại Sao Nên Chọn Miền Đông JSC Cho Thiết Kế &amp; Thi Công Cảnh Quan?</p>
    </li>
</ul>
```

Ví dụ icon (gọn, không dùng `<p>`):
```html
<ul class="about-one_list">
    <li>
        <i class="flaticon-checked-1" aria-hidden="true"></i>
        Helpful staff
    </li>
    <li class="m-0">
        <i class="flaticon-checked-1" aria-hidden="true"></i>
        Community involvement
    </li>
</ul>
```

---

### 3.4 Tiêu đề mục con (sử dụng `h4`)
- Dùng `h4` cho tiêu đề mục con. Thêm `fw-semibold` và `mb-3` để nổi bật.
- Nội dung bên dưới giữ trong `<p>`; thêm `m-0` cho đoạn cuối nếu cần.

```html
<section class="mb-3">
    <h4 class="fw-semibold mb-3">1. Lo chất lượng công trình không đảm bảo</h4>
    <p>Ngôi nhà có thể xây trong vài tháng, nhưng khách hàng sẽ sống trong đó hàng chục năm...</p>
</section>
```

---

### 3.4 CTA (Call To Action)
- Dùng động từ ngắn, rõ ràng; tạo tương phản màu để nổi bật.
- Thêm `aria-label` cho liên kết chứa emoji hoặc văn bản ngắn.

```html
<div class="text-center bg-success p-4 rounded">
    <h4 class="fw-bold mb-3 text-white">Đổi giao diện nhà mình kịp Tết 🎉</h4>
    <p class="text-white">Nếu anh chị đang ở <strong>Bảo Lộc</strong> ...</p>
    <p class="text-white m-0">📩 Liên hệ sớm ...</p>
    <div class="mt-3">
        <a href="/lien-he" class="theme-btn btn-style-one" aria-label="Liên hệ Công ty Xây dựng Miền Đông">
            <span class="btn-wrap">
                <span class="text-one">Liên Hệ Ngay</span>
                <span class="text-two">Liên Hệ Ngay</span>
            </span>
        </a>
    </div>
</div>
```

---

### 3.5 Gallery ảnh
- Mỗi ảnh kèm `alt` mô tả.
- Dùng `loading="lazy"`

```html
<section class="mb-3">
    <h4 class="fw-semibold mb-3 text-center">Hình ảnh công trình thực tế</h4>
    <ul class="gallery" aria-label="Gallery hình ảnh công trình">
        <li>
            <img src="/images/img1.jpg" alt="Phòng khách sau khi cải tạo" loading="lazy">
        </li>
        <!-- Thêm ảnh khác tương tự -->
    </ul>
</section>
```

---

### 3.6 Bootstrap 5 — Ngắn gọn
- Template đang sử dụng `Bootstrap 5`. Khi viết content, chỉ cần tuân theo các lớp và utility của Bootstrap để đảm bảo responsive và nhất quán. Tránh đưa nhiều ví dụ chi tiết để không gây hoang mang.
- Những điểm chính cần tuân thủ:
  - Layout: dùng `container` / `container-fluid`, `row`, `col-*`.
  - Ảnh: thêm `class="img-fluid"` và `loading="lazy"`.
  - Typography: dùng `lead`, `fw-*`, `text-*`.
  - Spacing: dùng utility như `mb-*`, `mt-*`, `py-*` thay vì inline styles.
  - CTA: dùng lớp `btn` (ví dụ `btn btn-primary`) và thêm `aria-label` nếu chỉ có icon/emoji.
  - Accessibility: giữ `aria-*` cho icon trang trí và kiểm tra tương phản màu.

---

## 4. Accessibility & Performance tips
- Thẻ `alt` không để trống cho ảnh quan trọng.
- Icon trang trí dùng `aria-hidden="true"`.
- CTA có `aria-label` khi cần.
- Nén ảnh và dùng `loading="lazy"`.
- Kiểm tra tương phản màu theo WCAG.

---

## 5. Quick checklist (Khi đăng bài)
- [ ] Tất cả đoạn trong `quote` dùng `<p>` và đoạn cuối có `m-0`.
- [ ] Ảnh có `alt` hợp lý và nén.
- [ ] CTA chính có văn bản rõ ràng và `aria-label` nếu cần.
- [ ] Danh sách icon dùng spacing CSS và `aria-hidden` cho icon.
- [ ] Kiểm tra responsive trên mobile.

---

© Công ty Xây dựng Miền Đông
