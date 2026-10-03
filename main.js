// ==========================================
// إدارة فلترة المنتجات (الأقسام) والفئات الفرعية
// ==========================================
(function () {
    function applySubcategoryFilter(sub) {
        const items = document.querySelectorAll('.product-item.herbs');
        let visibleCount = 0;
        items.forEach(item => {
            if (sub === 'all' || item.dataset.subcategory === sub) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });

        const emptyMessage = document.getElementById('products-empty');
        if (emptyMessage) {
            emptyMessage.hidden = visibleCount !== 0;
        }
    }

    function renderSubcategoryFilter(category) {
        const container = document.getElementById('subcategory-filter');
        if (!container) return;

        if (category !== 'herbs') {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        const categories = window.STORE_CATEGORIES || [];
        const subcategories = categories.filter(c => c.parent === 'herbs');

        container.innerHTML = '';
        if (subcategories.length === 0) {
            container.style.display = 'none';
            return;
        }

        const chips = document.createElement('div');
        chips.className = 'subcategory-chips';
        chips.setAttribute('role', 'group');
        chips.setAttribute('aria-label', 'أقسام الطب البديل');

        function createChip(subId, label, isActive) {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'subcategory-chip' + (isActive ? ' active' : '');
            chip.dataset.sub = subId;
            chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            chip.textContent = label;
            chip.addEventListener('click', () => {
                chips.querySelectorAll('.subcategory-chip').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                });
                chip.classList.add('active');
                chip.setAttribute('aria-pressed', 'true');
                applySubcategoryFilter(subId);
            });
            return chip;
        }

        chips.appendChild(createChip('all', 'الكل', true));
        subcategories.forEach(sub => {
            chips.appendChild(createChip(sub.id, sub.label, false));
        });

        container.appendChild(chips);
        container.style.display = 'block';
    }

    function filterSelection(category) {
        let products = document.getElementsByClassName("product-item");
        let buttons = document.querySelectorAll(".filter-section button");

        // إخفاء رسالة "لا توجد منتجات" عند تبديل القسم الرئيسي؛ renderSubcategoryFilter/applySubcategoryFilter تقرر إظهارها من جديد عند الحاجة
        const productsEmpty = document.getElementById("products-empty");
        if (productsEmpty) {
            productsEmpty.hidden = true;
        }

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

        renderSubcategoryFilter(category);
    }

    // ==========================================
    // إدارة النوافذ المنبثقة والقوائم (Modal & Menu)
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

    function toggleCart() {
        const modal = document.getElementById("cartModal");
        modal.style.display = (modal.style.display === "block") ? "none" : "block";
    }

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

    window.addEventListener('load', () => {
        loadProducts();
        loadCart();
        updateCartUI();

        const footerPhone = document.getElementById("footer-phone");
        if (footerPhone) footerPhone.textContent = STORE_CONFIG.displayPhone;

        const deliveryFeeOption = document.getElementById("delivery-fee-option");
        if (deliveryFeeOption) deliveryFeeOption.textContent = `توصيل لعنوانك (${STORE_CONFIG.deliveryFee} شيكل)`;
    });

    window.filterSelection = filterSelection;
    window.toggleCart = toggleCart;
    window.toggleMenu = toggleMenu;
    window.openAbout = openAbout;
    window.closeAbout = closeAbout;
})();
