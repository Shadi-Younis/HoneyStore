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
function sendOrder(productName, price) {
    const phoneNumber = "522344536"; // ضع رقمك هنا بدون أصفار أو علامة +

    // تنسيق الرسالة
    const message = `مرحباً شهد وبركة، أود طلب:
- المنتج: ${productName}
- السعر: ${price}
هل المنتج متوفر حالياً؟`;

    // تحويل النص إلى تنسيق يفهمه المتصفح (URL Encoding)
    const encodedMessage = encodeURIComponent(message);

    // إنشاء الرابط وفتحه في نافذة جديدة
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}