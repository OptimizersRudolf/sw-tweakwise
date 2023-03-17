!function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/bundles/rhtweakwise/",n(n.s="F+NV")}({"F+NV":function(e,t,n){"use strict";n.r(t);Shopware.Service("exportTemplateService").registerProductExportTemplate({name:"tweakwise",translationKey:"sw-sales-channel.detail.productComparison.templates.template-label.tweakwise",headerTemplate:'<?xml version="1.0" encoding="utf-8"?>\n<tweakwise xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n    <items>\n'.trim(),bodyTemplate:"{% set price = product.calculatedPrice %}\n{%- if product.calculatedPrices.count > 0 -%}\n    {% set price = product.calculatedPrices.last %}\n{%- endif -%}\n\n{% set listPrice = false %}\n{% if price.listPrice %}\n    {% set listPrice = price.listPrice.percentage > 0 %}\n{% endif %}\n\n{% set hasRange = product.calculatedPrices.count > 1 %}\n\n{% set displayParent = false %}\n{% if product.variantListingConfig %}\n    {% set displayParent = product.variantListingConfig.displayParent and product.parentId === null %}\n{% endif %}\n\n{% set displayFromVariants = false %}\n{% if displayParent %}\n    {% set displayFromVariants = displayParent and price.unitPrice !== product.calculatedCheapestPrice.unitPrice %}\n{% endif %}\n\n{% set label = '' %}\n{% if (product.markAsTopseller) %}\n    {% set label = \"listing.boxLabelTopseller\"|trans|sw_sanitize %}\n{% elseif (listPrice and not hasRange and not displayFromVariants) %}\n    {% set label = \"listing.boxLabelDiscount\"|trans|sw_sanitize %}\n{% elseif (product.isNew) %}\n    {% set label = \"listing.boxLabelNew\"|trans|sw_sanitize %}\n{% endif %}\n\n<item>\n    <id>{{ product.productNumber }}</id>\n    <price>{{ price.unitPrice|number_format(context.currency.itemRounding.decimals, '.', '') }}</price>\n    <name><![CDATA[{{ product.translated.name|raw }}]]></name>\n    {% if product.manufacturer %}\n        <brand><![CDATA[{{ product.manufacturer.translated.name|raw }}]]></brand>\n    {% endif %}\n    <stock>{{ product.availableStock }}</stock>\n    <url>{{ seoUrl('frontend.detail.page', {'productId': product.id}) }}</url>\n    {% if product.cover.media is defined %}<image>{{ product.cover.media.url }}</image>{% endif %}\n    <attributes>\n        {% set optionGroups = [] %}\n        {% for option in product.options %}\n            <attribute>\n                <name><![CDATA[{{ option.group.translated.name|raw }}]]></name>\n                <value><![CDATA[{{ option.translated.name|raw }}]]></value>\n            </attribute>\n            {% set optionGroups = optionGroups|merge([option.groupId]) %}\n        {% endfor %}\n        {% for property in product.properties %}\n            {% if not (property.groupId in optionGroups) %}\n                <attribute>\n                    <name><![CDATA[{{ property.group.translated.name|raw }}]]></name>\n                    <value><![CDATA[{{ property.translated.name|raw }}]]></value>\n                </attribute>\n            {% endif %}\n        {% endfor %}\n        <attribute>\n            <name>sw-new</name>\n            <value>{% if product.isNew %}true{% else %}false{% endif %}</value>\n        </attribute>\n        <attribute>\n            <name>sw-has-discount</name>\n            <value>{% if listPrice and not hasRange and not displayFromVariants %}true{% else %}false{% endif %}</value>\n        </attribute>\n        <attribute>\n            <name>sw-is-topseller</name>\n            <value>{% if product.markAsTopseller %}true{% else %}false{% endif %}</value>\n        </attribute>\n        <attribute>\n            <name>sw-keywords</name>\n            <value>{{ product.customSearchKeywords|join(', ') }}</value>\n        </attribute>\n        <attribute>\n            <name>sw-label</name>\n            <value>{{ label }}</value>\n        </attribute>\n        <attribute>\n            <name>sw-id</name>\n            <value>{{ product.id }}</value>\n        </attribute>\n        <attribute>\n            <name>sw-ean</name>\n            <value>{{ product.ean }}</value>\n        </attribute>\n        <attribute>\n            <name>sw-manufacturer-partnumber</name>\n            <value>{{ product.manufacturerNumber }}</value>\n        </attribute>\n        <attribute>\n            <name>sw-release-date</name>\n            <value>{% if product.releaseDate %}{{ product.releaseDate|date('Y-m-d') }}{% endif %}</value>\n        </attribute>\n    </attributes>\n    <categories>\n        {% for category in product.categories %}\n            <categoryid>{{ category.id }}</categoryid>\n        {% endfor %}\n    </categories>\n</item>\n",footerTemplate:"</items>\n\n{% set categoryTree = tw_category_tree(context) %}\n<categories>\n    {% for category in categoryTree %}\n        {% if category.childCount or (category.type == 'page' and category.productAssignmentType == 'product' and category.products|length) %}\n            <category>\n                <categoryid>{{ category.id }}</categoryid>\n                <name><![CDATA[{{ category.name|raw }}]]></name>\n                <rank>{{ loop.index }}</rank>\n                {% if category.parentId %}\n                    <parents>\n                        <categoryid>{{ category.parentId }}</categoryid>\n                    </parents>\n                {% endif %}\n            </category>\n        {% endif %}\n    {% endfor %}\n</categories>\n</tweakwise>\n".trim(),fileName:"tweakwise.xml",encoding:"UTF-8",fileFormat:"xml",generateByCronjob:!1,interval:86400});Shopware.Component.override("sw-cms-el-config-product-listing",{template:"{% block sw_cms_element_product_listing_config_layout_select_options %}\n    {% parent %}\n    <option value=\"tweakwise\">\n        {{ $tc('sw-cms.elements.productBox.config.label.layoutTypeTweakwise') }}\n    </option>\n{% endblock %}\n"})}});