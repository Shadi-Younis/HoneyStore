// ==========================================
// بيانات المنتجات (Data-driven OOP)
// ==========================================
(function () {
    class Product {
        constructor(name, title, price, category, image, desc, inStock = true, subcategory = null) {
            this.name = name;
            this.title = title || name;
            this.price = price;
            this.category = category;
            this.image = image;
            this.desc = desc;
            this.inStock = inStock;
            this.subcategory = subcategory;
        }

        render() {
            const itemDiv = document.createElement("div");
            itemDiv.className = `product-item ${this.category} ${this.inStock ? '' : 'out-of-stock'}`.trim();
            if (this.subcategory) itemDiv.dataset.subcategory = this.subcategory;

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
                <button class="share-btn" onclick="shareProduct('${this.name}', ${this.price})" title="شارك عبر واتساب">🔗 مشاركة</button>
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

    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            const data = await response.json();
            window.STORE_CATEGORIES = data.categories || [];
            data.products.forEach(p => {
                myStore.addProduct(new Product(p.name, null, p.price, p.category, p.image, p.description, p.inStock, p.subcategory));
            });
            myStore.renderAll();
            filterSelection('all');
        } catch (e) {
            const grid = document.getElementById('products-grid');
            if (grid) grid.innerHTML = '<p>تعذّر تحميل المنتجات، يرجى تحديث الصفحة</p>';
        }
    }

    window.loadProducts = loadProducts;
})();
