/**
 * @class Field
 * @description Represents a value in a Segment.
 * @example
 * const field = new Field("INS");
 * console.log(field.toString())
 * // "INS"
*/
export default class Field {

	constructor(public element: string) { }

	/**
	 * @description Returns the length of the Field.
	 * @returns {Number}
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
	 * @description Returns the Field object as a JSON string.
	 * @returns {string}
	 * @example 
	 * console.log(field.toJson());
	 * // {"element":"INS"}
	 */
	toJson(): string {
		return JSON.stringify(this);
	}
	
	/**
	 * @description Returns the Field.element as a string.
	 * @returns {String}
	 * @example
	 * console.log(field.toString());
	 * // "ST"
	 */
	toString(): string {
		return JSON.stringify(this.element);
	}

	/**
	 * @description Removes whitespace from the Field and replaces newlines, tabs, and carriage returns with an empty string.
	 * @returns {Field}
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
}