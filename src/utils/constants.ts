export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

// Категории товаров в соответствии с разметкой и макетом
export const productCategories: Record<string, string> = {
    'софт-скил': 'card__category_soft',
    'другое': 'card__category_other',
    'дополнительное': 'card__category_additional',
    'кнопка': 'card__category_button',
    'хард-скил': 'card__category_hard',
}

// События, которые инициируются при изменениях
export const triggerEvents = {
    itemsChanged: 'items:changed',
    basketChanged: 'basket:changed',
    modalOpen: 'modal:open',
    preview: 'preview:change',
    itemSelect: 'item:select',
    addToBasket: 'item:addToBasket',
    deleteFromBasket: 'item:deleteFromBasket',
    basketOpen: 'basket:open',
    orderOpen: 'order:open',
    paymentChange: 'payment:change',
    addressChange: 'order.address:change',
    deliveryFormErrors: 'deliveriesFormErrors:change',
    orderSumbit: 'order:submit',
    contactsChange: /^contacts\..*:change/,
    contactsFormErrors: 'contactsFormErrors:change',
    contactsSumbit: 'contacts:submit',
    modalClose: 'modal:close'
}