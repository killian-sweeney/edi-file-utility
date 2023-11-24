/**
 * @class Field
 * @description Represents a Field in a Segment.
 * @param {String} element The data element in the Field.
 * @example
 * const field = new Field("INS");
 * @example
 * const field = new Field("Y");
 * @example
 * const field = new Field("18");
 */
export default class Field {

	constructor(public element: string) { }

	/**
	 * @method toJSON
	 * @description Returns a JSON representation of the Field.
	 * @returns {Object}
	 * @memberof Field
	 * @example
	 * const json = field.toJSON();
	 * console.log(json);
	 * // {
	 * //   element: "ST",
	 * // }
	 * @example
	 * const json = field.toJSON();
	 * console.log(json);
	 * // {
	 * //   element: "997",
	 * // }
	 */
	toJSON(): string {
		return this.element;
	}

	/**
	 * @method trim
	 * @description Removes whitespace from the Field and replaces newlines, tabs, and carriage returns with an empty string.
	 * @returns {Field}
	 * @memberof Field
	 * @example
	 * console.log(field.element);
	 * // "  ST\n"
	 * field.trim();
	 * console.log(field.element);
	 * // "ST"
	 */
	trim(): Field {
		this.element = this.element.trim().replace(/[\n\t\r\~]/g, "");

		return this;
	}

	/**
	 * @method getLength
	 * @description Returns the length of the Field.
	 * @returns {Number}
	 * @memberof Field
	 * @example
	 * console.log(field.element);
	 * // "INS"
	 * const length = field.getLength();
	 * console.log(length);
	 * // 3
	 */
	getLength(): number {
		return this.element.length;
	}

	/**
	 * @method toString
	 * @description Returns the Field as a string.
	 * @returns {String}
	 * @memberof Field
	 * @example
	 * console.log(field.toString());
	 * // "ST"
	 */
	toString(): string {
		return this.element;
	}
}
let field = new Field("INS")
console.log(JSON.stringify(field))