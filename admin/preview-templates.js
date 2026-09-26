// معاينة مخصصة لملف "المنتجات" داخل لوحة تحكم Sveltia CMS.
// يعتمد على الأسلوب غير المبني على JSX الموثّق من Sveltia (h/createClass)
// حتى لا نحتاج أي خطوة بناء (build step).
const ProductsPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const getAsset = this.props.getAsset;
    const products = entry.getIn(['data', 'products']) || [];

    return h(
      'div',
      {
        style: {
          fontFamily: "'Amiri', serif",
          direction: 'rtl',
          textAlign: 'right',
          padding: '20px',
          background: '#fdfaf1'
        }
      },
      products
        .map(function (product, index) {
          const imagePath = product.get('image');
          const imageAsset = imagePath ? getAsset(imagePath) : null;

          return h(
            'div',
            {
              key: index,
              style: {
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: '15px',
                padding: '15px',
                marginBottom: '20px',
                maxWidth: '280px'
              }
            },
            imageAsset
              ? h('img', {
                  src: imageAsset.url,
                  style: {
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }
                })
              : null,
            h('h3', { style: { margin: '10px 0', color: '#444' } }, product.get('name')),
            h(
              'span',
              {
                style: {
                  display: 'block',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#b8860b',
                  marginBottom: '10px'
                }
              },
              (product.get('price') || 0) + ' شيكل'
            ),
            h('p', { style: { color: '#555' } }, product.get('description'))
          );
        })
        .toArray()
    );
  }
});

CMS.registerPreviewTemplate('products', ProductsPreview);
