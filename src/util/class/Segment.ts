import Field from "./Field";

/**
 * @class Segment
 * @description A Segment is a collection of Fields.
 * @example
 * const segment = new Segment("INS");
 * console.log(segment)
 * // { name: 'INS', fields: [] }
 */
export default class Segment {

	constructor(
		public name: string,
		public fields: Field[] = []
	) { }

	/**
	 * @description Adds a Field to the Segment.
	 * @example
	 * segment.addField(new Field("INS"))
	 * console.log(segment)
	 * // Segment { name: 'INS', fields: [ Field { element: 'INS' } ] }
	 */
	addField(field: Field): Segment {
		this.fields.push(field);

		return this;
	}
	
	/**
	 * @description Returns the Fields in the Segment.
	 * @example
	 * segment.addField(new Field("INS01"))
	 * console.log(segment.getFields())
	 * // [ Field { element: 'INS' }, Field { element: 'INS01' } ]
	 */
	getFields(): Array<Field> {
		return this.fields;
	}

	/**
	 * @description Removes a Field from the Segment.
	 * @example
	 * segment.removeField(segment.fields[0]);
	 * console.log(segment.fields);
	 * // []
	 */
	removeField(field: Field): Segment {
		this.fields = this.fields.filter((f) => f !== field);

		return this;
	}

	/**
	 * @description Returns a JSON representation of the Segment.
	 * @example
	 * console.log(segment.toJson())
	 * // {"name":"INS","fields":[{"element":"INS"}]}
	 */
	toJson(): string {
		return JSON.stringify(this);
	}

	/**
	 * @description Removes whitespace from the Fields and replaces newlines, tabs, and carriage returns with an empty string.
	 * @example
	 * segment.addField(new Field("REF\n~"))
	 * console.log(segment)
	 * // {
	 * // 	name: 'INS',
	 * // 	fields: [ Field { element: 'INS' }, Field { element: 'REF\n~' } ]
	 * // }
	 * segment.trimFields()
	 * console.log(segment)
	 * // {
	 * //	name: 'INS',
	 * //	fields: [ Field { element: 'INS' }, Field { element: 'REF' } ]
	 * // }
	 */
	trimFields(): void {
		this.fields.forEach((field) => field.trim());
	}
}