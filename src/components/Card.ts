import { ensureElement } from "../utils/utils";
import { productCategories } from "../utils/constants";
import { Component } from "./base/Component";
import { IActionsCard, IItem } from "../types";

// Интерфейс карточки товара
export interface ICardData extends IItem {
    button?: string;
    index?: number;
}

export class CardData extends Component<ICardData> {
    protected _description?: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _title: HTMLElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IActionsCard) {
        super(container);

        this._description = this.container.querySelector('.card__text');
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = this.container.querySelector('.card__button');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            };
        };
    };

    set description(value: string | string[]) {
        this.setText(this._description, value);
    };

    set image(value: string) {
		if (this._image) {
			this.setImage(this._image, value, this.title);
		};
	};

    set title(value: string) {
        this.setText(this._title, value);
    };

    get title(): string {
        return this._title.textContent || '';
    };

    set category(value: string) {
		this.setText(this._category, value);
        this._category.classList.add(`${productCategories[value]}`);
	};

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        this._button && (this._button.disabled = value === null);
	};

    set button(value: string) {
        if (this._button) {
            this.setText(this._button, value);
        };
    };

    public getContainer(): HTMLElement {
        return this.container;
    }
}