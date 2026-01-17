function filterSelection(category) {
    // جلب جميع العناصر التي لها كلاس 'product-item'
    let products = document.getElementsByClassName("product-item");

    // إذا اختار المستخدم "الكل"، نظهر جميع المنتجات
    if (category === "all") {
        for (let i = 0; i < products.length; i++) {
            products[i].style.display = "block";
        }
    } else {
        // نمر على كل منتج، إذا كان الكلاس الخاص به يطابق التصنيف المختار نظهره، وإلا نخفيه
        for (let i = 0; i < products.length; i++) {
            if (products[i].classList.contains(category)) {
                products[i].style.display = "block";
            } else {
                products[i].style.display = "none";
            }
        }
    }

    // لمسة إضافية: تغيير شكل الزر النشط (Active Button)
    updateActiveButton(category);
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