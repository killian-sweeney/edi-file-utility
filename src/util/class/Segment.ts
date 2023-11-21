import Field from "./Field";

/**
 * @class Segment
 * @description A Segment is a collection of Fields.
 * @param {String} name The name of the Segment, or the segment identifier.
 * @example
 * const segment = new Segment("ST");
 */
export default class Segment {
	// name: string
	// fields: Field[]

	constructor(
		public name: string,
		 public fields: Field[] = []
		 ) {
		// this.name = name;
		// this.fields = [];
	}

	/**
	 * @method toJSON
	 * @description Returns a JSON representation of the Segment.
	 * @returns {Object}
	 * @memberof Segment
	 * @example
	 * const json = segment.toJSON();
	 * console.log(json);
	 * // {
	 * //   name: "ST",
	 * //   fields: [
	 * //     {
	 * //       element: "ST",
	 * //     },
	 * //     {
	 * //       element: "997",
	 * //     },
	 * //     {
	 * //       element: "0001",
	 * //     },
	 * //   ],
	 * // }
	 */
	toJSON(): object {
		return {
			name: this.name,
			fields: this.fields.map((field: Field) => field),
		};
	}

	/**
	 * @method trimFields
	 * @description Removes whitespace from each Field in the Segment.
	 * @returns {Segment}
	 * @memberof Segment
	 * @example
	 * segment.trimFields();
	 * console.log(segment.fields[0].element);
	 * // "ST"
	 * console.log(segment.fields[1].element);
	 * // "997"
	 */
	trimFields() {
		this.fields.forEach((field) => field.trim());
	}

	/**
	 * @method getFields
	 * @description Returns the Fields in the Segment.
	 * @returns {Array<Field>}
	 * @memberof Segment
	 * @example
	 * const fields = segment.getFields();
	 * console.log(fields);
	 * // [
	 * //   {
	 * //     element: "ST",
	 * //   },
	 * //   {
	 * //     element: "997",
	 * //   },
	 * //   {
	 * //     element: "0001",
	 * //   },
	 * // ]
	 */
	getFields() {
		return this.fields;
	}

	/**
	 * @method addField
	 * @description Adds a Field to the Segment.
	 * @param {Field} field The Field to add.
	 * @returns {Segment}
	 * @memberof Segment
	 * @example
	 * segment.addField(new Field("ST"));
	 * console.log(segment.fields);
	 * // [
	 * //   {
	 * //     element: "ST",
	 * //   },
	 * // ]
	 */
	addField(field: Field) {
		this.fields.push(field);

		return this;
	}

	/**
	 * @method removeField
	 * @description Removes a Field from the Segment.
	 * @param {Field} field The Field to remove.
	 * @returns {Segment}
	 * @memberof Segment
	 * @example
	 * segment.removeField(segment.fields[0]);
	 * console.log(segment.fields);
	 * // []
	 */
	removeField(field: Field) {
		this.fields = this.fields.filter((f) => f !== field);

		return this;
	}
}

// let testSegment = new Segment("name")  
// console.log(testSegment)