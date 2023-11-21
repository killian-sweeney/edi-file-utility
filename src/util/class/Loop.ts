/**
 * @class Loop
 * @description A Loop is a collection of Segments that are related to one another.
 * @example
 * const itemLoop = new Loop();
 * itemLoop.setPosition(0);
 * itemLoop.addSegmentIdentifiers(["INS", "REF", "NM1"]);
 * transaction.addLoop(itemLoop);
 * transaction.runLoops();
 */
export default class Loop {

	constructor(
		public position: number | null = null,
		public segmentIdentifiers: string[] = [],
		public contents: Array<Array<string>> = [[]]
	) { }

	/**
	 * @method toJSON
	 * @description Returns a JSON representation of the Loop.
	 * @returns {Object}
	 * @memberof Loop
	 * @instance
	 * @example
	 * const json = loop.toJSON();
	 * console.log(json);
	 * // {
	 * //   position: 0,
	 * //   segmentIdentifiers: ["W07", "N9", "W20"],
	 * //   contents: [
	 * //     [
	 * //       {
	 * //         name: "W07",
	 * //         fields: [
	 * //           {
	 * //             element: "W07",
	 * //           },
	 * //           {
	 * //             element: "A",
	 * //           },
	 * //           {
	 * //             element: "1",
	 * //           }
	 * //         ],
	 * //       },
	 * //       {
	 * //         name: "N9",
	 * //         fields: [
	 * //           {
	 * //             element: "N9",
	 * //           },
	 * //           {
	 * //             element: "1",
	 * //           },
	 * //           {
	 * //             element: "A",
	 * //           }
	 * //         ],
	 * //       },
	 * //     ],
	 * //     [...],
	 * //   ],
	 * // }
	 */
	toJSON(): object {
		return {
			position: this.position,
			segmentIdentifiers: this.segmentIdentifiers,
			contents: this.contents.map((element) => {
				return element.map((segment: any) => segment.toJSON());
			}),
		};
	}

	/**
	 * @method getLastSegmentIdentifier
	 * @description Returns the last segment identifier in the Loop.
	 * @returns {String}
	 * @memberof Loop
	 * @example
	 * const lastSegmentIdentifier = loop.getLastSegmentIdentifier();
	 * console.log(lastSegmentIdentifier);
	 * // "W20"
	 */
	getLastSegmentIdentifier(): string {
		return this.segmentIdentifiers[this.segmentIdentifiers.length - 1];
	}

	/**
	 * @method getSegmentIdentifiers
	 * @description Returns the segment identifiers in the Loop.
	 * @returns {Array.<String>}
	 * @memberof Loop
	 * @example
	 * const segmentIdentifiers = loop.getSegmentIdentifiers();
	 * console.log(segmentIdentifiers);
	 * // ["W07", "N9", "W20"]
	 * @example
	 * const [firstSegmentIdentifier, secondSegmentIdentifier, thirdSegmentIdentifier] = loop.getSegmentIdentifiers();
	 * console.log(firstSegmentIdentifier);
	 * // "W07"
	 * console.log(secondSegmentIdentifier);
	 * // "N9"
	 * console.log(thirdSegmentIdentifier);
	 * // "W20"
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
	 * @method addSegmentIdentifier
	 * @description Adds a segment identifier to the Loop.
	 * @param {String | Object} segmentIdentifier
	 * @returns {Loop}
	 * @memberof Loop
	 * @example
	 * loop.addSegmentIdentifier("W07");
	 * @example
	 * loop.addSegmentIdentifier("N9");
	 * @example
	 * loop.addSegmentIdentifier("W20");
	 */
	addSegmentIdentifier(segmentIdentifier: string): Loop {
		this.segmentIdentifiers.push(segmentIdentifier);

		return this;
	}

	/**
	 * @method addSegmentIdentifiers
	 * @description Adds segment identifiers to the Loop.
	 * @param {Array.<String | Object>} segmentIdentifiers
	 * @returns {Loop}
	 * @memberof Loop
	 * @example
	 * loop.addSegmentIdentifiers(["W07", "N9", "W20"]);
	 * @example
	 * loop.addSegmentIdentifiers([
	 *    {
	 *       segmentIdentifier: "HL",
	 *       identifierValue: "P",
	 *       identifierPosition: 2,
	 *     },
	 *     "W07",
	 *     "N9"
	 *   ]);
	 */
	addSegmentIdentifiers(segmentIdentifiers: string[]): Loop {
		segmentIdentifiers.forEach((segmentIdentifier: string) => {
			this.addSegmentIdentifier(segmentIdentifier);
		});

		return this;
	}

	/**
	 * @method removeSegmentIdentifier
	 * @description Removes a segment identifier from the Loop.
	 * @param {String} segmentIdentifier
	 * @returns {Loop}
	 * @memberof Loop
	 * @example
	 * loop.removeSegmentIdentifier("W07");
	 * @example
	 * loop.removeSegmentIdentifier("N9");
	 * @example
	 * loop.removeSegmentIdentifier("W20");
	 */
	removeSegmentIdentifier(segmentIdentifier: string): Loop {
		this.segmentIdentifiers = this.segmentIdentifiers.filter(
			(s) => s !== segmentIdentifier
		);

		return this;
	}

	/**
	 * @method getPosition
	 * @description Returns the position of the Loop.
	 * @returns {Number}
	 * @memberof Loop
	 * @example
	 * const position = loop.getPosition();
	 * console.log(position);
	 * // 0
	 */
	getPosition(): number | null {
		return this.position;
	}

	/**
	 * @method setPosition
	 * @description Sets the position of the Loop.
	 * @param {Number} position
	 * @returns {Loop}
	 * @memberof Loop
	 * @example
	 * loop.setPosition(0);
	 */
	setPosition(position: number): Loop {
		this.position = position;

		return this;
	}
}