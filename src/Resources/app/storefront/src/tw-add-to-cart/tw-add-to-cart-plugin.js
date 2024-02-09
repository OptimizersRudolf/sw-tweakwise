import Plugin from 'src/plugin-system/plugin.class';
import PluginManager from 'src/plugin-system/plugin.manager';
import Iterator from 'src/helper/iterator.helper';
import FormSerializeUtil from 'src/utility/form/form-serialize.util';

export default class TwAddToCartPlugin extends Plugin {
    init() {
        this._registerEvents();
    }

    _registerEvents() {
        const twAddToCart = this._addToCart.bind(this);

        window.addEventListener('twAddToCart', twAddToCart);
    }

    _addToCart(e) {
        let shopwareIdAttribute = e.detail.data.attributes.find(attribute => {
            return attribute.name === 'product_id'
        });
        if (shopwareIdAttribute === undefined) {
            alert('An error occurred');
        }
        const productId = shopwareIdAttribute.values[0];


        let form = document.createElement('form');
        form.dataset.addToCart = 'true';
        form.setAttribute('action', e.detail.addToCartAction);
        form.setAttribute('method', 'post');
        form.setAttribute('id', 'twn-add-to-cart-form');
        form.setAttribute('data-add-to-cart', 'true');

        let redirectToField = document.createElement('input');
        redirectToField.setAttribute('type', 'hidden');
        redirectToField.setAttribute('name', 'redirectTo');
        redirectToField.setAttribute('value', 'frontend.cart.offcanvas');

        let redirectParametersField = document.createElement('input');
        redirectParametersField.setAttribute('type', 'hidden');
        redirectParametersField.setAttribute('name', 'redirectParameters');
        redirectParametersField.dataset.redirectParameters = 'true';
        redirectParametersField.setAttribute('value', '{"productId": "' + productId + '"}');

        let lineItemIdField = document.createElement('input');
        lineItemIdField.setAttribute('type', 'hidden');
        lineItemIdField.setAttribute('name', 'lineItems[' + productId + '][id]');
        lineItemIdField.setAttribute('value', productId);

        let lineItemReferenceIdField = document.createElement('input');
        lineItemReferenceIdField.setAttribute('type', 'hidden');
        lineItemReferenceIdField.setAttribute('name', 'lineItems[' + productId + '][referencedId]');
        lineItemReferenceIdField.setAttribute('value', productId);

        let lineItemTypeField = document.createElement('input');
        lineItemTypeField.setAttribute('type', 'hidden');
        lineItemTypeField.setAttribute('name', 'lineItems[' + productId + '][type]');
        lineItemTypeField.setAttribute('value', 'product');

        let lineItemStackableField = document.createElement('input');
        lineItemStackableField.setAttribute('type', 'hidden');
        lineItemStackableField.setAttribute('name', 'lineItems[' + productId + '][stackable]');
        lineItemStackableField.setAttribute('value', '1');

        let lineItemRemovableField = document.createElement('input');
        lineItemRemovableField.setAttribute('type', 'hidden');
        lineItemRemovableField.setAttribute('name', 'lineItems[' + productId + '][removable]');
        lineItemRemovableField.setAttribute('value', '1');

        let lineItemQuantityField = document.createElement('input');
        lineItemQuantityField.setAttribute('type', 'hidden');
        lineItemQuantityField.setAttribute('name', 'lineItems[' + productId + '][quantity]');
        lineItemQuantityField.setAttribute('value', '1');

        let csrfTokenField = document.createElement('input');
        csrfTokenField.setAttribute('type', 'hidden');
        csrfTokenField.setAttribute('name', '_csrf_token');
        csrfTokenField.setAttribute('value', e.detail.csrfToken);

        form.appendChild(redirectToField);
        form.appendChild(redirectParametersField);
        form.appendChild(lineItemIdField);
        form.appendChild(lineItemReferenceIdField);
        form.appendChild(lineItemTypeField);
        form.appendChild(lineItemStackableField);
        form.appendChild(lineItemRemovableField);
        form.appendChild(lineItemQuantityField);
        form.appendChild(csrfTokenField);

        const requestUrl = e.detail.addToCartAction;
        const formData = FormSerializeUtil.serialize(form);

        this.$emitter.publish('beforeFormSubmit', formData);
        this._openOffCanvasCarts(requestUrl, formData);
    }

    _openOffCanvasCarts(requestUrl, formData) {
        const offCanvasCartInstances = PluginManager.getPluginInstances('OffCanvasCart');
        Iterator.iterate(offCanvasCartInstances, instance => this._openOffCanvasCart(instance, requestUrl, formData));
    }

    _openOffCanvasCart(instance, requestUrl, formData) {
        instance.openOffCanvas(requestUrl, formData, () => {
            this.$emitter.publish('openOffCanvasCart');
        });
    }
}
