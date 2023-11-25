import FieldMap from "./FieldMap"

/**
 * @class LoopMap
 * @description A LoopMap is used to map a Loop to the specified object key value in an array.
 * @example
 * let itemArray: object = new LoopMap(
 * 	0,	// position
 * 	{	// values
 * 		subscriberIndicator: new FieldMap("INS",null, null, 0),
 * 		subscriberNumber:    new FieldMap("REF","0F", 0   , 1)
 * 	}
 * );
 * console.log(itemArray)
 * // LoopMap {
 * //   position: 0,
 * //   values: {
 * //     subscriberIndicator: FieldMap {
 * //       segmentIdentifier: 'INS',
 * //       identifierValue: null,
 * //       identifierPosition: null,
 * //       valuePosition: 0
 * //     },
 * //     subscriberNumber: FieldMap {
 * //       segmentIdentifier: 'REF',
 * //       identifierValue: '0F',
 * //       identifierPosition: 0,
 * //       valuePosition: 1
 * //     }
 * //   }
 * // }
 */
export default class LoopMap {
	constructor(public position: number, public values: object) { }
}