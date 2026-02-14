function filterSelection(category) {
    let products = document.getElementsByClassName("product-item");
    let buttons = document.querySelectorAll(".filter-section button");

    // 1. منطق إظهار وإخفاء المنتجات
    for (let i = 0; i < products.length; i++) {
        if (category === "all" || products[i].classList.contains(category)) {
            products[i].style.display = "block";
        } else {
            products[i].style.display = "none";
        }
    }

    // 2. تلوين الزر المضغوط (هذا الجزء اللي فيه المشكلة)
    buttons.forEach(btn => {
        btn.classList.remove("active");
    });

    // نستخدم event.currentTarget لضمان تحديد الزر الصحيح
    if (event) {
        event.currentTarget.classList.add("active");
    }
}

function updateActiveButton(category) {
    let buttons = document.querySelectorAll(".filter-section button");
    buttons.forEach(btn => {
        btn.style.background = "transparent";
        btn.style.color = "#b8860b";
    });

    // إيجاد الزر الذي تم ضغطه وتمييزه (يمكن تحسين هذا الجزء لاحقاً في CSS)
    // حالياً الكود سيعمل على إظهار وإخفاء المنتجات فوراً
}
// مصفوفة السلة الأصلية
let cart = [];

function addToCart(name, price) {
    // التأكد من تحويل السعر لرقم لتجنب NaN
    const itemPrice = Number(price);

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // إضافة المنتج مع التأكد من أن السعر رقم
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
        // حساب سعر الكمية لهذا المنتج
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const li = document.createElement("li");
        li.className = "cart-item";
        // ابحث عن هذا الجزء داخل دالة updateCartUI وحدثه:
        li.innerHTML = `
    <button onclick="removeFromCart(${index})" class="delete-btn" title="تقليل الكمية">−</button>
    <span>${item.name} (x${item.quantity}) - ${itemTotal} شيكل</span>
`;
        cartItemsList.appendChild(li);
    });

    // تحديث السعر الإجمالي النهائي في السلة
    totalPriceElement.innerText = total;
    cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function removeFromCart(index) {
    // التحقق من كمية المنتج الموجود في هذا الترتيب (index)
    if (cart[index].quantity > 1) {
        // إذا كان أكثر من واحد، بنقص الكمية بس
        cart[index].quantity -= 1;
    } else {
        // إذا كانت الكمية واحد فقط، بنحذف الصنف نهائياً من المصفوفة
        cart.splice(index, 1);
    }

    // تحديث الواجهة والأسعار بعد التعديل
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById("cartModal");
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}

function sendCartToWhatsapp() {
    const name = document.getElementById("user-name").value;
    const address = document.getElementById("user-address").value;
    const phone = document.getElementById("user-phone").value;

    if (cart.length === 0 || !name || !address) {
        alert("يرجى التأكد من المنتجات وتعبئة الاسم والعنوان.");
        return;
    }

    const phoneNumber = "972522344536";

    let message = "طلب جديد من متجر شهد وبركة\n\n";
    message += "الاسم: " + name + "\n";
    message += "الموقع: " + address + "\n";
    message += "رقم التواصل: " + (phone || "غير محدد") + "\n";
    message += "--------------------------\n";
    message += "المنتجات:\n";

    let total = 0;
    cart.forEach((item, index) => {
        // حساب السعر الإجمالي لهذا الصنف بناءً على الكمية
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        // التعديل الجوهري: إضافة الكمية (x) بجانب اسم المنتج في الرسالة
        message += (index + 1) + ". " + item.name + " (x" + item.quantity + ") - " + itemTotal + " شيكل\n";
    });

    message += "--------------------------\n";
    message += "إجمالي المبلغ:" + total + " شيكل";

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = "https://wa.me/" + phoneNumber + "?text=" + encodedMessage;

    window.open(whatsappURL, '_blank');
}
function openAbout() {
    document.getElementById("aboutModal").style.display = "block";
}

function closeAbout() {
    document.getElementById("aboutModal").style.display = "none";
}

// إغلاق النافذة عند الضغط في أي مكان خارج المربع
window.onclick = function(event) {
    let modal = document.getElementById("aboutModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function toggleMenu() {
    const navLinks = document.getElementById("nav-links");
    // التحقق من الحالة الحالية وتبديلها
    if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "flex";
    }
}

// إغلاق المنيو تلقائياً عند الضغط على أي قسم
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById("nav-links").classList.remove("active");
    });
});