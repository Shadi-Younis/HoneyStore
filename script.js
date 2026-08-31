// ==========================================
// 1. بيانات المنتجات (Data-driven OOP)
// ==========================================

const STORE_CONFIG = {
    whatsapp: "972522344536",
    displayPhone: "0522344536",
    deliveryFee: 50
};

class Product {
    constructor(name, title, price, category, image, desc, inStock = true) {
        this.name = name;
        this.title = title || name;
        this.price = price;
        this.category = category;
        this.image = image;
        this.desc = desc;
        this.inStock = inStock;
    }

    render() {
        const itemDiv = document.createElement("div");
        itemDiv.className = `product-item ${this.category} ${this.inStock ? '' : 'out-of-stock'}`.trim();

        let buttonHTML = "";
        if (this.inStock) {
            buttonHTML = `<button class="whatsapp-btn" onclick="addToCart('${this.name}', ${this.price})">اضف لسلة المشتريات</button>`;
        } else {
            buttonHTML = `<button class="whatsapp-btn disabled-btn" disabled>غير متوفر حالياً</button>`;
        }

        itemDiv.innerHTML = `
            <img src="${this.image}" alt="${this.name}" loading="lazy" decoding="async">
            <h3>${this.title}</h3>
            <p>${this.desc}</p>
            <span class="price">${this.price} شيكل</span>
            ${buttonHTML}
        `;
        return itemDiv;
    }
}

class Store {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.products = [];
    }

    addProduct(product) {
        this.products.push(product);
    }

    renderAll() {
        if (!this.container) return;
        this.container.innerHTML = "";
        this.products.forEach(product => {
            this.container.appendChild(product.render());
        });
    }
}

const myStore = new Store("products-grid");

myStore.addProduct(new Product('عسل زهور برية', null, 80, 'honey', 'images/wildflower-honey.webp', 'طبيعي مستخلص من رحيق أزهار البرية المتنوعة.',false));
myStore.addProduct(new Product('عسل كينا', 'عسل كينا فاخر', 90, 'honey', 'images/eucalyptus-honey.webp', 'يتميز بنكهة قوية وفوائد صحية عديدة للجهاز التنفسي.',false));
myStore.addProduct(new Product('عسل سدر', 'عسل سدر فاخر', 150, 'honey', 'images/sidr-honey.webp', 'من أجود أنواع العسل، يتميز برائحة ذكية وطعم أصيل وفوائد علاجية مذهلة.'));
myStore.addProduct(new Product('حبيبات اللقاح', null, 50, 'honey', 'images/bee-pollen.webp', 'غذاء ملكي متكامل، غني بالبروتينات والفيتامينات الطبيعية.'));
myStore.addProduct(new Product('عسل مكسرات', null, 50, 'honey', 'images/honey-nuts.webp', 'مزيج رائع من العسل الطبيعي والمكسرات المحمصة.',));
myStore.addProduct(new Product('كبسولات البروبوليس (عكبر النحل)', null, 90, 'herbs', 'images/propolis-capsules.webp', 'كبسولات طبيعية من عكبر النحل الخام، غنية بمضادات الأكسدة، يُستخدم تقليدياً كمكمل غذائي يومي.'));
myStore.addProduct(new Product('كبسولات الزنجبيل والكركم', null, 70, 'herbs', 'images/ginger-turmeric-capsules.webp', 'مزيج مركّز من مسحوق الزنجبيل والكركم الطبيعي، غني بالمركبات النباتية، يُستخدم تقليدياً كمكمل غذائي يومي.'));
myStore.addProduct(new Product('زيت حبة البركة المعصور على البارد', null, 65, 'herbs', 'images/black-seed-oil.webp', 'زيت نقي 100% مستخلص من بذور حبة البركة بطريقة العصر البارد، غني بالأحماض الدهنية الطبيعية.'));
myStore.addProduct(new Product('خلطة الأعشاب الجبلية', null, 55, 'herbs', 'images/mountain-herbs-blend.webp', 'خلطة من أعشاب جبلية طبيعية مجففة ومختارة بعناية، تُحضّر تقليدياً كمشروب دافئ.'));
myStore.addProduct(new Product('كبسولات الميرمية والبابونج', null, 60, 'herbs', 'images/sage-chamomile-capsules.webp', 'كبسولات من مستخلص الميرمية والبابونج الطبيعي، تُستخدم تقليدياً كمكمل عشبي يومي.'));
myStore.addProduct(new Product('شراب الأعشاب بالعسل', null, 80, 'herbs', 'images/herbal-honey-syrup.webp', 'شراب طبيعي يجمع بين خلاصة الأعشاب المختارة وعسل النحل الأصلي، غني بالمكونات الطبيعية ويُستخدم تقليدياً كمشروب دافئ.'));

window.addEventListener('load', () => {
    myStore.renderAll();
    filterSelection('all');
    loadCart();
    updateCartUI();

    const footerPhone = document.getElementById("footer-phone");
    if (footerPhone) footerPhone.textContent = STORE_CONFIG.displayPhone;

    const deliveryFeeOption = document.getElementById("delivery-fee-option");
    if (deliveryFeeOption) deliveryFeeOption.textContent = `توصيل لعنوانك (${STORE_CONFIG.deliveryFee} شيكل)`;
});

// ==========================================
// 1. إدارة فلترة المنتجات (الأقسام)
// ==========================================
function filterSelection(category) {
    let products = document.getElementsByClassName("product-item");
    let buttons = document.querySelectorAll(".filter-section button");

    // إظهار وإخفاء المنتجات حسب القسم
    for (let i = 0; i < products.length; i++) {
        if (category === "all" || products[i].classList.contains(category)) {
            products[i].style.display = "block";
        } else {
            products[i].style.display = "none";
        }
    }

    // تلوين الزر النشط (بشكل دقيق وآمن)
    buttons.forEach(btn => {
        btn.classList.remove("active");
        // إذا كان الزر يحتوي على اسم القسم، نقوم بتفعيله
        if (btn.getAttribute('onclick').includes(category)) {
            btn.classList.add("active");
        }
    });

    // إظهار تنويه الأعشاب فقط عند تفعيل قسم الطب البديل
    const herbsDisclaimer = document.getElementById("herbs-disclaimer");
    if (herbsDisclaimer) {
        herbsDisclaimer.style.display = (category === "herbs") ? "block" : "none";
    }
}

// ==========================================
// 2. إدارة سلة المشتريات (الإضافة، الحذف، التحديث)
// ==========================================
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

function toggleCart() {
    const modal = document.getElementById("cartModal");
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}

// ==========================================
// 3. إتمام الطلب عبر الواتساب وإنشاء الفاتورة
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

// ==========================================
// 4. إدارة النوافذ المنبثقة والقوائم (Modal & Menu)
// ==========================================
function openAbout() {
    document.getElementById("aboutModal").style.display = "block";
}

function closeAbout() {
    document.getElementById("aboutModal").style.display = "none";
}

// إغلاق النوافذ المنبثقة (من نحن وسلة المشتريات) عند الضغط خارجها
document.addEventListener('click', function(event) {
    const aboutModal = document.getElementById("aboutModal");
    if (aboutModal && event.target == aboutModal) {
        aboutModal.style.display = "none";
    }

    const cartModal = document.getElementById("cartModal");
    const cartIcon = document.querySelector(".cart-icon");
    if (cartModal && cartModal.style.display === "block") {
        const path = event.composedPath();
        if (!path.includes(cartModal) && !path.includes(cartIcon)) {
            cartModal.style.display = "none";
        }
    }
});

// إغلاق النوافذ المنبثقة عند الضغط على مفتاح Escape
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeAbout();
        const cartModal = document.getElementById("cartModal");
        if (cartModal) cartModal.style.display = "none";
    }
});

// تبديل حالة المنيو في الموبايل
function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "flex";
    }
}

// إغلاق المنيو تلقائياً عند اختيار قسم (في شاشات الموبايل)
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            document.getElementById("nav-links").style.display = "none";
        }
    });
});