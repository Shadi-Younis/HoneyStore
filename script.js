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
}

// ==========================================
// 2. إدارة سلة المشتريات (الإضافة، الحذف، التحديث)
// ==========================================
let cart = []; // مصفوفة السلة

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

    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

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

    totalPriceElement.innerText = total;
    cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
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
// 3. إتمام الطلب عبر الواتساب
// ==========================================
function sendCartToWhatsapp() {
    const name = document.getElementById("user-name").value;
    const address = document.getElementById("user-address").value;
    const phone = document.getElementById("user-phone").value;

    if (cart.length === 0 || !name || !address) {
        alert("يرجى إضافة منتجات للسلة وتعبئة الاسم والعنوان قبل إتمام الطلب.");
        return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        alert("يرجى إدخال رقم هاتف صحيح (يجب أن يتكون من 10 أرقام ويبدأ بالرقم 0).");
        return;
    }

    const phoneNumber = "972522344536";

    // تم إزالة الرموز التعبيرية (Emojis) لتجنب ظهور علامات الاستفهام
    let message = "*طلب جديد من متجر شهد وبركة*\n\n";
    message += "*الاسم:* " + name + "\n";
    message += "*الموقع:* " + address + "\n";
    message += "*رقم التواصل:* " + phone + "\n";
    message += "--------------------------\n";
    message += "*المنتجات:*\n";

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += (index + 1) + ". " + item.name + " (x" + item.quantity + ") - " + itemTotal + " شيكل\n";
    });

    message += "--------------------------\n";
    message += "*إجمالي المبلغ:* " + total + " شيكل";

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = "https://wa.me/" + phoneNumber + "?text=" + encodedMessage;

    window.open(whatsappURL, '_blank');
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

// إغلاق نافذة "من نحن" عند الضغط خارجها
window.onclick = function(event) {
    let modal = document.getElementById("aboutModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

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