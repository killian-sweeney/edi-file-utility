/**
 * @class FieldMap
 * @description Used to declare the position of a Field in a segment to a json object key value.
 * @example
 * let example = {
 * 	subscriberIndicator: new FieldMap("INS",null, null, 0),
 * 	subscriberNumber:    new FieldMap("REF","0F", 0   , 1)
 * }
 * console.log(example)
 * // {
 * //   subscriberIndicator: FieldMap {
 * //     segmentIdentifier: 'INS',
 * //     identifierValue: null,
 * //     identifierPosition: null,
 * //     valuePosition: 0
 * //   },
 * //   subscriberNumber: FieldMap {
 * //     segmentIdentifier: 'REF',
 * //     identifierValue: '0F',
 * //     identifierPosition: 0,
 * //     valuePosition: 1
 * //   }
 * // }
 */
export default class FieldMap {

	constructor(
		public segmentIdentifier: string,
		public identifierValue: string | null, // = null,
		public identifierPosition: number | null,// = null,
		public valuePosition: number
	) {	}

	/**
	 * @description Returns a JSON representation of the FieldMap.
	 * @returns {string}
	 * @example
	 * const json = example.subscriberIndicator.toJson();
	 * console.log(json);
	 * // {
	 * //   segmentIdentifier: "INS",
	 * //   identifierValue: null,
	 * //   identifierPosition: null,
	 * //   valuePosition: 1,
	 * // }
	 */
	toJson(): string {
		return JSON.stringify(this) 
		// {
		// 	segmentIdentifier: this.segmentIdentifier,
		// 	identifierValue: this.identifierValue,
		// 	identifierPosition: this.identifierPosition,
		// 	valuePosition: this.valuePosition,
		// };
	}
}
let example = {
 	subscriberIndicator: new FieldMap("INS",null, null, 0),
 	subscriberNumber:    new FieldMap("REF","0F", 0   , 1)
 }
console.log(example.subscriberIndicator.toJson())