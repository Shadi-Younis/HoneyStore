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
let cart = [];

function addToCart(name, price) {
    // إضافة المنتج للمصفوفة
    cart.push({ name, price: parseInt(price) });
    updateCartUI();
}

function updateCartUI() {
    // تحديث رقم العداد
    document.getElementById("cart-count").innerText = cart.length;

    // عرض المنتجات في السلة
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <span>${item.name} - ${item.price} شيكل</span>
                <button onclick="removeFromCart(${index})">حذف</button>
            </div>
        `;
    });
    document.getElementById("total-price").innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    const modal = document.getElementById("cartModal");
    modal.style.display = (modal.style.display === "block") ? "none" : "block";
}

function sendCartToWhatsapp() {
    if (cart.length === 0) {
        alert("السلة فارغة!");
        return;
    }

    const phoneNumber = "52-234-4536"; // تأكد من الرقم بدون + أو أصفار في البداية
    let message = "مرحباً شهد وبركة، أود طلب المنتجات التالية:\n\n";
    let total = 0;

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.price} شيكل\n`;
        total += item.price;
    });

    message += `\nإجمالي المبلغ: ${total} شيكل`;

    // الحل السحري هنا: تشفير الرسالة بالكامل
    const encodedMessage = encodeURIComponent(message);

    // استخدام الرابط المخصص للواتساب (api.whatsapp.com أو wa.me)
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

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