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
    const name = document.getElementById("user-name").value;
    const address = document.getElementById("user-address").value;
    const phone = document.getElementById("user-phone").value;

    if (cart.length === 0 || !name || !address) {
        alert("يرجى التأكد من المنتجات وتعبئة الاسم والعنوان.");
        return;
    }

    const phoneNumber = "972522344536";

    // بناء الرسالة باستخدام متغيرات منفصلة لضمان التشفير الصحيح
    let header = "طلب جديد من متجر شهد وبركة";
    let userInfo = "\n\n" + " الاسم: " + name +
        "\n" + " الموقع: " + address +
        "\n" + " رقم التواصل: " + (phone || "غير محدد");

    let divider = "\n--------------------------\n";
    let productsHeader = "المنتجات:\n";
    let productsList = "";
    let total = 0;

    cart.forEach((item, index) => {
        productsList += (index + 1) + ". " + item.name + " (" + item.price + " شيكل)\n";
        total += item.price;
    });

    let footer = divider + "إجمالي المبلغ: " + total + " شيكل";

    // تجميع الرسالة كاملة
    let fullMessage = header + userInfo + divider + productsHeader + productsList + footer;

    // التشفير النهائي
    const encodedMessage = encodeURIComponent(fullMessage);
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