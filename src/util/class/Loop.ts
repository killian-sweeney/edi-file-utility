import Segment from "./Segment";

/**
 * @class Loop
 * @description A Loop is a collection of Segments that are related to one another.
 * @example
 * const itemLoop = new Loop();
 * console.log(itemLoop)
 * // { position: null, segmentIdentifiers: [], contents: [ [] ] }
 * itemLoop.setPosition(0);
 * console.log(itemLoop)
 * // { position: 0, segmentIdentifiers: [], contents: [ [] ] }
 * itemLoop.addSegmentIdentifiers(["INS", "REF", "NM1"]);
 * console.log(itemLoop)
 * // {
 * //   position: 0,
 * //   segmentIdentifiers: [ 'INS', 'REF', 'NM1' ],
 * //   contents: [ [] ]
 * // }
 */
export default class Loop {

	constructor(
		public position: number | null = null,
		public segmentIdentifiers: string[] = [],
		public contents: Segment[] = []
	) { }

	/**
	 * @description Adds a segment identifier to the Loop.
	 * @returns {Loop}
	 * @example
	 * itemLoop.addSegmentIdentifier("DTP");
	 * console.log(itemLoop)
	 * // {
	 * //   position: null,
	 * //   segmentIdentifiers: [ 'INS', 'REF', 'NM1', 'DTP' ],
	 * //   contents: [ [] ]
	 * // }
	*/
	addSegmentIdentifier(segmentIdentifier: string): Loop {
		this.segmentIdentifiers.push(segmentIdentifier);

		return this;
	}

	/**
	 * @description Adds segment identifiers to the Loop.
	 * @returns {Loop}
	 * @example
	 * itemLoop.addSegmentIdentifiers(["INS", "REF", "NM1"]);
	 * console.log(itemLoop)
	 * // {
	 * //   position: null,
	 * //   segmentIdentifiers: [ 'INS', 'REF', 'NM1' ],
	 * //   contents: [ [] ]
	 * // }
	 */
	addSegmentIdentifiers(segmentIdentifiers: string[]): Loop {
		segmentIdentifiers.forEach((segmentIdentifier: string) => {
			this.addSegmentIdentifier(segmentIdentifier);
		});

		return this;
	}

	/**
	 * @description Returns the last segment identifier in the Loop.
	 * @returns {String}
	 * @example
	 * console.log(itemLoop.getLastSegmentIdentifier())
	 * // NM1
	 */
	getLastSegmentIdentifier(): string {
		return this.segmentIdentifiers[this.segmentIdentifiers.length - 1];
	}

	/**
	 * @description Returns the position of the Loop.
	 * @example
	 * console.log(itemLoop.getPosition())
	 * // 0
	 */
	getPosition(): number | null {
		return this.position;
	}

	/**
	 * @description Returns the segment identifiers in the Loop.
	 * @example
	 * console.log(itemLoop.getSegmentIdentifiers())
	 * // [ 'INS', 'REF', 'NM1' ]
	 */
	getSegmentIdentifiers(): Array<string> {
		let identifiers: any = [];
		for (let identifier of this.segmentIdentifiers) {
			switch (typeof identifier) {
				case "string":
					identifiers.push(identifier);
					break;
				default:
					throw new Error(`Invalid segment identifier: ${identifier}`);
			}
		}
		return identifiers;
	}

	/**
	 * @description Removes a segment identifier from the Loop.
	 * @returns {Loop}
	 * @example
	 * itemLoop.removeSegmentIdentifier("NM1");
	 * console.log(itemLoop)
	 * // {
	 * //   position: null,
	 * //   segmentIdentifiers: [ 'INS', 'REF' ],
	 * //   contents: [ [] ]
	 * // }
	 */
	removeSegmentIdentifier(segmentIdentifier: string): Loop {
		this.segmentIdentifiers = this.segmentIdentifiers.filter(
			(s) => s !== segmentIdentifier
		);

		return this;
	}

	/**
	 * @description Sets the position of the Loop.
	 * @returns {Loop}
	 * @example
	 * itemLoop.setPosition(0);
	 * console.log(itemLoop)
	 * // { position: 0, segmentIdentifiers: [], contents: [ [] ] }
	 */
	setPosition(position: number): Loop {
		this.position = position;

		return this;
	}

	/**
	 * @description Returns a JSON representation of the Loop.
	 * @returns {string}
	 * @memberof Loop
	 * @instance
	 * @example
	 * console.log(itemLoop.toJson())
	 * // {
	 * // 	"position": 0,
	 * // 	"segmentIdentifiers": [
	 * // 		"INS",
	 * // 		"REF",
	 * // 	],
	 * // 	"contents": [
	 * // 		[]
	 * // 	]
	 * // }
	 */
	toJson(): string {
		return JSON.stringify(this)
	}
}