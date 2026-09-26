// ==========================================
// إدارة سلة المشتريات (الإضافة، الحذف، التحديث)
// ==========================================
(function () {
    let cart = []; // مصفوفة السلة
    const CART_STORAGE_KEY = "honeyStoreCart";

    function saveCart() {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (e) {
            // تجاهل أخطاء التخزين (مثال: وضع التصفح الخاص أو تجاوز السعة)
        }
    }

    function loadCart() {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            const parsed = stored ? JSON.parse(stored) : [];
            cart = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            cart = [];
        }
    }

    function shareProduct(name, price) {
        const text = `${name} - ${price} شيكل\nمن متجر شهد وبركة`;
        const url = STORE_CONFIG.siteUrl;

        if (navigator.share) {
            navigator.share({ title: name, text: text, url: url })
                .catch(() => {});
        } else {
            const msg = encodeURIComponent(url + '\n\n' + text);
            window.open('https://wa.me/?text=' + msg, '_blank');
        }
    }

    function addToCart(name, price) {
        const itemPrice = Number(price); // التأكد من تحويل السعر لرقم
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name: name, price: itemPrice, quantity: 1 });
        }

        updateCartUI();
    }

    function updateCartUI() {
        const cartItemsList = document.getElementById("cart-items");
        const cartCount = document.getElementById("cart-count");
        const totalPriceElement = document.getElementById("total-price");
        const deliveryMethod = document.getElementById("delivery-method");
        const cartEmpty = document.getElementById("cart-empty");
        const userInfo = document.querySelector(".user-info");
        const cartFooter = document.querySelector(".cart-footer");

        if (cartEmpty) cartEmpty.style.display = (cart.length === 0) ? "block" : "none";
        if (userInfo) userInfo.style.display = (cart.length === 0) ? "none" : "block";
        if (cartFooter) cartFooter.style.display = (cart.length === 0) ? "none" : "block";

        cartItemsList.innerHTML = "";
        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const li = document.createElement("li");
            li.className = "cart-item";

            // الشكل الجديد الذي يضم أزرار الزيادة (+) والنقصان (-)
            li.innerHTML = `
                <div class="qty-controls">
                    <button onclick="increaseQuantity(${index})" class="qty-btn add-btn" title="زيادة الكمية">+</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button onclick="removeFromCart(${index})" class="qty-btn delete-btn" title="تقليل الكمية">−</button>
                </div>
                <span class="item-info">${item.name} - ${itemTotal} شيكل</span>
            `;
            cartItemsList.appendChild(li);
        });

        let finalTotal = subtotal;
        let deliveryText = "";

        if (deliveryMethod && deliveryMethod.value === "delivery" && subtotal > 0) {
            finalTotal += STORE_CONFIG.deliveryFee;
            deliveryText = ` (شامل ${STORE_CONFIG.deliveryFee} شيكل توصيل)`;
        }

        totalPriceElement.innerText = finalTotal + deliveryText;
        cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);

        saveCart();
    }

    // دالة زيادة الكمية من داخل السلة
    function increaseQuantity(index) {
        cart[index].quantity += 1;
        updateCartUI();
    }

    // دالة تقليل أو حذف الكمية من داخل السلة
    function removeFromCart(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartUI();
    }

    // ==========================================
    // إتمام الطلب عبر الواتساب وإنشاء الفاتورة
    // ==========================================

    function generateInvoicePDF(name, address, phone, deliveryText, cartItems, finalTotal) {
        let tableRows = '';
        cartItems.forEach((item, index) => {
            tableRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price * item.quantity} شيكل</td>
                </tr>
            `;
        });

        const invoiceHTML = `
            <div class="invoice-container">
                <div class="invoice-header">
                    <h2>متجر شهد وبركة</h2>
                    <h3>فاتورة مشتريات</h3>
                </div>
                <hr class="invoice-divider">
                <div class="invoice-info">
                    <p><strong>الاسم:</strong> ${name}</p>
                    <p><strong>الموقع/المدينة:</strong> ${address}</p>
                    <p><strong>رقم التواصل:</strong> ${phone}</p>
                    <p><strong>طريقة الاستلام:</strong> ${deliveryText || 'استلام شخصي'}</p>
                </div>
                <table class="invoice-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>الصنف</th>
                            <th>الكمية</th>
                            <th>الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <div class="invoice-total">
                    <h3>المبلغ الإجمالي: <span class="highlight">${finalTotal} شيكل</span></h3>
                </div>
            </div>
        `;

        const w = window.open('', '_blank');
        if (!w) {
            alert('يرجى السماح بالنوافذ المنبثقة لعرض الفاتورة');
            return;
        }

        w.document.write(`
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>فاتورة - متجر شهد وبركة</title>
                <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">
                <style>
                    body { margin: 0; padding: 0; }
                    .invoice-container {
                        padding: 20px;
                        font-family: 'Amiri', 'Segoe UI', Tahoma, sans-serif;
                        direction: rtl;
                        text-align: right;
                        background-color: #fff;
                        color: #000;
                    }
                    .invoice-header { text-align: center; margin-bottom: 20px; }
                    .invoice-header h2 { color: #b8860b; margin: 0; }
                    .invoice-header h3 { color: #555; margin: 5px 0; }
                    .invoice-divider { border: 1px solid #b8860b; margin-bottom: 20px; }
                    .invoice-info { margin-bottom: 20px; line-height: 1.6; }
                    .invoice-info p { margin: 5px 0; }
                    .invoice-table { width: 100%; border-collapse: collapse; text-align: center; margin-bottom: 30px; }
                    .invoice-table thead { background-color: #f9f9f9; }
                    .invoice-table th, .invoice-table td { border: 1px solid #ddd; padding: 10px; }
                    .invoice-table td { padding: 8px; }
                    .invoice-table th { font-weight: bold; }
                    .invoice-total { text-align: left; background-color: #fdfaf1; padding: 15px; border-radius: 5px; border: 1px solid #e0d5b0; }
                    .invoice-total h3 { margin: 0; color: #333; }
                    .invoice-total .highlight { color: #b8860b; }
                </style>
            </head>
            <body>
                ${invoiceHTML}
            </body>
            </html>
        `);
        w.document.close();

        if (w.document.readyState === 'complete') {
            w.focus();
            w.print();
        } else {
            w.onload = function() { w.focus(); w.print(); };
        }
    }

    function sendCartToWhatsapp() {
        const name = document.getElementById("user-name").value;
        const address = document.getElementById("user-address").value;
        const phone = document.getElementById("user-phone").value;
        const deliveryMethodElement = document.getElementById("delivery-method");

        if (cart.length === 0 || !name || !address) {
            alert("يرجى إضافة منتجات للسلة وتعبئة الاسم والعنوان قبل إتمام الطلب.");
            return;
        }

        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phone)) {
            alert("يرجى إدخال رقم هاتف صحيح (يجب أن يتكون من 10 أرقام ويبدأ بالرقم 0).");
            return;
        }

        const phoneNumber = STORE_CONFIG.whatsapp;

        let deliveryMethodText = "";
        let isDelivery = false;
        if (deliveryMethodElement) {
            deliveryMethodText = deliveryMethodElement.options[deliveryMethodElement.selectedIndex].text;
            isDelivery = deliveryMethodElement.value === "delivery";
        }

        // تم إزالة الرموز التعبيرية (Emojis) لتجنب ظهور علامات الاستفهام
        let message = "*طلب جديد من متجر شهد وبركة*\n\n";
        message += "*الاسم:* " + name + "\n";
        message += "*الموقع:* " + address + "\n";
        message += "*رقم التواصل:* " + phone + "\n";
        if (deliveryMethodText) {
            message += "*طريقة الاستلام:* " + deliveryMethodText + "\n";
        }
        message += "--------------------------\n";
        message += "*المنتجات:*\n";

        let subtotal = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            message += (index + 1) + ". " + item.name + " (x" + item.quantity + ") - " + itemTotal + " شيكل\n";
        });

        let finalTotal = subtotal;
        if (isDelivery && subtotal > 0) {
            finalTotal += STORE_CONFIG.deliveryFee;
            message += "--------------------------\n";
            message += "*رسوم التوصيل:* " + STORE_CONFIG.deliveryFee + " شيكل\n";
        }

        message += "--------------------------\n";
        message += "*إجمالي المبلغ:* " + finalTotal + " شيكل";

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = "https://wa.me/" + phoneNumber + "?text=" + encodedMessage;

        const win = window.open(whatsappURL, '_blank');
        if (win) {
            cart = [];
            saveCart();
            updateCartUI();
        }
    }

    function downloadInvoice() {
        const name = document.getElementById("user-name").value;
        const address = document.getElementById("user-address").value;
        const phone = document.getElementById("user-phone").value;
        const deliveryMethodElement = document.getElementById("delivery-method");

        if (cart.length === 0 || !name || !address) {
            alert("يرجى إضافة منتجات للسلة وتعبئة الاسم والعنوان قبل تحميل الفاتورة.");
            return;
        }

        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(phone)) {
            alert("يرجى إدخال رقم هاتف صحيح (يجب أن يتكون من 10 أرقام ويبدأ بالرقم 0).");
            return;
        }

        let deliveryMethodText = "";
        let isDelivery = false;
        if (deliveryMethodElement) {
            deliveryMethodText = deliveryMethodElement.options[deliveryMethodElement.selectedIndex].text;
            isDelivery = deliveryMethodElement.value === "delivery";
        }

        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        let finalTotal = subtotal;
        if (isDelivery && subtotal > 0) {
            finalTotal += STORE_CONFIG.deliveryFee;
        }

        generateInvoicePDF(name, address, phone, deliveryMethodText, cart, finalTotal);
    }

    window.saveCart = saveCart;
    window.loadCart = loadCart;
    window.shareProduct = shareProduct;
    window.addToCart = addToCart;
    window.updateCartUI = updateCartUI;
    window.increaseQuantity = increaseQuantity;
    window.removeFromCart = removeFromCart;
    window.sendCartToWhatsapp = sendCartToWhatsapp;
    window.downloadInvoice = downloadInvoice;
})();
