// ==========================================
// 1. بيانات المنتجات (Data-driven OOP)
// ==========================================

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
            <img src="${this.image}" alt="${this.name}">
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

myStore.addProduct(new Product('عسل زهور برية', null, 80, 'honey', 'images/عسل-ازهار-برية.jpeg', 'طبيعي مستخلص من رحيق أزهار البرية المتنوعة.',false));
myStore.addProduct(new Product('عسل كينا', 'عسل كينا فاخر', 90, 'honey', 'images/عسل-كينا.jpeg', 'يتميز بنكهة قوية وفوائد صحية عديدة للجهاز التنفسي.',false));
myStore.addProduct(new Product('عسل سدر', 'عسل سدر فاخر', 150, 'honey', 'images/عسل-سدر.jpeg', 'من أجود أنواع العسل، يتميز برائحة ذكية وطعم أصيل وفوائد علاجية مذهلة.'));
myStore.addProduct(new Product('حبيبات اللقاح', null, 50, 'honey', 'images/حبيبات اللقاح.jpeg', 'غذاء ملكي متكامل، غني بالبروتينات والفيتامينات الطبيعية.'));
myStore.addProduct(new Product('عسل مكسرات', null, 50, 'honey', 'images/عسل-مكسرات.jpeg', 'مزيج رائع من العسل الطبيعي والمكسرات المحمصة.',));
myStore.addProduct(new Product('رهايف تمر', null, 70, 'dates', 'images/رهايف-تمر.jpeg', 'حبة كبيرة، مذاق غني، فرز أول من أجود المزارع.',));
myStore.addProduct(new Product('تمرية بالقمح الأبيض', null, 60, 'dates', 'images/تمرية-بالقمح-الابيض.jpeg', 'تمر طبيعي بجودة عالية، يتميز بقوام رائع وحلاوة معتدلة.'));
myStore.addProduct(new Product('تمريتي', null, 60, 'dates', 'images/تمريتي.jpeg', 'تمر طبيعي بجودة عالية، يتميز بقوام رائع وحلاوة معتدلة.'));
myStore.addProduct(new Product('تمرية بالقمح الأسمر', null, 60, 'dates', 'images/تمرية-بالقمح-الآسمر.jpeg', 'خيار صحي غني بالألياف مع طعم التمر الأصيل.'));
myStore.addProduct(new Product('سمسم بالطحينة', null, 60, 'dates', 'images/سمسم-بالطحينة.jpeg', 'حلى طبيعي يجمع بين فوائد السمسم والطحينة الفاخرة.'));

window.addEventListener('load', () => {
    myStore.renderAll();
    filterSelection('all');
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