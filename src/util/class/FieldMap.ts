/**
 * @class FieldMap
 * @description Used to declare the position of a Field in a segment to a json object key value.
 * @param {Object} options
 * @param {String} options.segmentIdentifier The segment identifier.
 * @param {String} options.identifierValue The value of the field identifier.
 * @param {Number} options.identifierPosition The position of the field identifier.
 * @param {Number} options.valuePosition The position of the field value.
 * @example
 * const fieldMap = new FieldMap({
 *  segmentIdentifier: "INS",
 * identifierValue: null,
 * identifierPosition: null,
 * valuePosition: 1,
 * });
 * @example
 * const newObjectToMapFieldsTo = {
 *  subscriberNumber: new FieldMap({
 *    segmentIdentifier: "REF",
 *    identifierValue: "0F",
 *    identifierPosition: null,
 *   valuePosition: 1,
 *  }),
 *  groupId: new FieldMap({
 *    segmentIdentifier: "REF",
 *    identifierValue: 1L,
 *    identifierPosition: null,
 *    valuePosition: 7,
 *  }),
 * };
 */

export default class FieldMap {

	constructor(
		public segmentIdentifier: string,
		public identifierValue: string | null = null,
		public identifierPosition: number | null = null,
		public valuePosition: number
	) {	}

	/**
	 * @method toJSON
	 * @description Returns a JSON representation of the FieldMap.
	 * @returns {Object}
	 * @memberof FieldMap
	 * @example
	 * const json = fieldMap.toJSON();
	 * console.log(json);
	 * // {
	 * //   segmentIdentifier: "INS",
	 * //   identifierValue: null,
	 * //   identifierPosition: null,
	 * //   valuePosition: 1,
	 * // }
	 */
	toJSON(): object {
		return {
			segmentIdentifier: this.segmentIdentifier,
			identifierValue: this.identifierValue,
			identifierPosition: this.identifierPosition,
			valuePosition: this.valuePosition,
		};
	}
}