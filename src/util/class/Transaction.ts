import Field from "./Field.js";
import FieldMap from "./FieldMap.js";
import Loop from "./Loop.js";
import LoopMap from "./LoopMap.js";
import Segment from "./Segment.js";

/**
 * @class Transaction
 * @description A class representing an EDI transaction
 * @param {boolean} debug - Whether or not to enable debug mode
 * @returns {Transaction}
 * @example
	TO DO...
 */
export default class Transaction {
	segments: Segment[];
	loops: Loop[];
	debug: boolean;

	constructor(debug = false) {
		this.segments = [];
		this.loops = [];
		this.debug = debug;
	}

	/**
	 * @memberof Transaction
	 * @method toJSON
	 * @description Convert the transaction instance to a JSON object
	 * @returns {Object}
	 * @example
	 * const json = transaction.toJSON();
	 * console.log(json);
	 * // {
	 * //   segments: [
	 * //     {
	 * //       name: 'ST',
	 * //       fields: [
	 * //         { element: '945', position: 0 },
	 * //         { element: '0001', position: 1 },
	 * //       ]
	 * //     },
	 * //     {
	 * //       name: 'B4',
	 * //       fields: [
	 * //         { element: 'N', position: 0 },
	 * //         { element: '1234567890', position: 1 },
	 * //         { element: '20210101', position: 2 },
	 * //       ]
	 * //     },
	 * //   ],
	 * //   loops: [
	 * //     {
	 * //       position: 0,
	 * //       segmentIdentifiers: [ 'W07', 'N9', 'W20' ],
	 * //       elements: []
	 * //     }
	 * //   ]
	 * // }
	 */
	toJSON(): object {
		return {
			segments: this.segments.map((segment) => segment.toJson()),
			loops: this.loops.map((loop) => loop.toJson()),
		};
	}

	/**
	 * @memberof Transaction
	 * @method getType
	 * @description Get the type of EDI transaction 
	 * @returns {string}
	 * @example
	 * const type = transaction.getType();
	 * console.log(type);
	 * // 945
	 * @throws {Error} No ST segment found
	 * @throws {Error} No ST02 segment found
	 */
	getTransactionType(): Field {
		this.debug && console.log("[Getting Transaction Type]");
		const ST = this.segments.find((segment) => segment.name === "ST");
		this.debug && console.log("ST", ST);
		if (!ST) throw new Error("No ST segment found");
		this.debug && console.log("[ST.getFields() result]", ST.getFields());
		ST.trimFields();
		const ST02 = ST.getFields()[0];
		if (!ST02) throw new Error("No ST02 segment found");
		this.debug && console.log("[ST02]", ST02);
		return ST02;
	}

	/**
	 * @memberof Transaction
	 * @method getSegments
	 * @description Get all segments in the transaction instance
	 * @returns {Array.<Segment>}
	 * @example
	 * const segments = transaction.getSegments();
	 * console.log(segments);
	 * // [
	 * //   {
	 * //     name: 'ST',
	 * //     fields: [
	 * //       { element: '945', position: 0 },
	 * //       { element: '0001', position: 1 },
	 * //     ]
	 * //   },
	 * //   {
	 * //     name: 'B4',
	 * //     fields: [
	 * //       { element: 'N', position: 0 },
	 * //       { element: '1234567890', position: 1 },
	 * //       { element: '20210101', position: 2 },
	 * //     ]
	 * //   },
	 * // ]
	 */
	getSegments(): Array<Segment> {
		return this.segments.map((segment) => segment);
	}

	/**
	 * @memberof Transaction
	 * @method listSegmentIdentifiers
	 * @description Get all segment identifiers in the transaction instance
	 * @returns {Array.<string>}
	 * @example
	 * const segmentIdentifiers = transaction.listSegmentIdentifiers();
	 * console.log(segmentIdentifiers);
	 * // [
	 * //   'ST', 'B4', 'N1', 'N3', 'N4', 'G61', 'N1', 'N3', 'N4', 'G61',
	 * // ]
	 */
	listSegmentIdentifiers(): Array<string> {
		return this.segments.map((segment) => segment.name);
	}

	/**
	 * @memberof Transaction
	 * @method getLoops
	 * @description Get all loops in the transaction instance
	 * @returns {Array.<Loop>}
	 * @example
	 * const loops = transaction.getLoops();
	 * console.log(loops);
	 * // [
	 * //   {
	 * //     position: 0,
	 * //     segmentIdentifiers: [ 'W07', 'N9', 'W20' ],
	 * //     elements: [
	 * //       [
	 * //         {
	 * //           name: 'W07',
	 * //           fields: [
	 * //             { element: '100', position: 0 },
	 * //             { element: 'EA', position: 1 },
	 * //             { element: 'ITEM CODE', position: 4 },
	 * //             { element: '100', position: 5 },
	 * //             { element: 'LB', position: 6 },
	 * //             { element: 'LOT CODE', position: 7 },
	 * //           ]
	 * //         },
	 * //         {
	 * //           name: 'N9',
	 * //           fields: [
	 * //             { element: 'PD', position: 0 },
	 * //             { element: '20210101', position: 1 },
	 * //           ]
	 * //         },
	 * //         {
	 * //           name: 'W20',
	 * //           fields: [
	 * //             { element: '1000', position: 0 },
	 * //             { element: 'LB', position: 1 },
	 * //             { element: '1000', position: 3 },
	 * //             { element: 'LB', position: 4 },
	 * //           ]
	 * //         }
	 * //       ]
	 * //     ]
	 * //   }
	 * // ]
	 */
	getLoops(): Array<Loop> {
		return this.loops.map((loop) => loop);
	}

	/**
	 * @memberof Transaction
	 * @method addLoop
	 * @description Add a loop to the transaction instance
	 * @param {Loop} loop - The loop to add to the transaction instance
	 * @returns {void}
	 * @example
	 * const loop = new Loop();
	 * loop.addSegmentIdentifiers(["W07", "N9", "W20"]);
	 * transaction.addLoop(loop);
	 * console.log(transaction.getLoops());
	 * // [
	 * //   {
	 * //     position: 0,
	 * //     segmentIdentifiers: [ 'W07', 'N9', 'W20' ],
	 * //     contents: []
	 * //   }
	 * // ]
	 */
	addLoop(loop: Loop): void {
		this.loops.push(loop);
	}

	/**
	 * @memberof Transaction
	 * @method runLoops
	 * @description Run all loops in the transaction instance
	 * @returns {void}
	 */
	runLoops(): void {
		this.loops.forEach((loop) => {
			this.runLoop(loop);
		});
	}

	/**
	 * @access private
	 * @memberof Transaction
	 * @method runLoop
	 * @description Run a loop
	 * @param {Loop} loop - The loop to run
	 * @returns {void}
	 */
	private runLoop(loop: Loop): void {
		let segments = this.getSegments();
		const identifierStartsLoop = loop.segmentIdentifiers[0];

		if (typeof identifierStartsLoop === "string") {
			segments = segments.splice(
				segments.findIndex((segment) => {
					return segment.name === identifierStartsLoop;
				}),
				segments.length - 1
			);
		}
		// can never be object...
		// else if (typeof identifierStartsLoop === "object") {
		// 	const loopStartIndex = segments.findIndex((segment) => {
		// 		return (
		// 			segment.name === identifierStartsLoop.segmentIdentifier &&
		// 			segment.getFields()[identifierStartsLoop.identifierPosition]
		// 				.element === identifierStartsLoop.identifierValue
		// 		);
		// 	});
		// 	segments = segments.splice(loopStartIndex, segments.length - 1);
		// }

		this.debug && console.log("[Segments in Loop]", segments);
		let loopSegments: Segment[] = [];
		for (let segment of segments) {
			this.debug && console.log("[Segment]", segment);
			if (loop.getSegmentIdentifiers().includes(segment.name)) {
				this.debug && console.log("[Segment Name]", segment.name);
				// more object error stuff
				// if (typeof identifierStartsLoop === "object") {
				// 	if (loopSegments.length === 0) {
				// 		if (
				// 			segment.getFields()[identifierStartsLoop.identifierPosition]
				// 				.element !== identifierStartsLoop.identifierValue
				// 		) {
				// 			continue;
				// 		}
				// 	}
				// }
				if (loopSegments.length === loop.getSegmentIdentifiers().length - 1) {
					this.debug && console.log("[Last segment identifier for loop]");
					loop.contents.push([...JSON.stringify(loopSegments), JSON.stringify(segment)]);
					loopSegments = [];
				} else {
					loopSegments.push(segment);
				}
			}
		}
		this.debug && console.log("[Loop]", loop);
		this.debug && console.log("[Loop Contents]", loop.contents);
	}

	/**
	 * @memberof Transaction
	 * @method mapSegments
	 * @description Map segments to a JSON object
	 * @param {Object} mapLogic - The map logic to use to map segments and fields to a JSON object
	 * @param {Array.<Segment>} mapSegments - The segments to map to a JSON object (defaults to the segments in the transaction instance)
	 * @returns {Object}
	 * @example
	 * const mapLogic = {
	 *  header: {
	 *   sender: new FieldMap({
	 *   segmentIdentifier: "N1",
	 *  identifierValue: "SF",
	 * identifierPosition: 0,
	 * valuePosition: 1,
	 * }),
	 * receiver: new FieldMap({
	 * segmentIdentifier: "N1",
	 * identifierValue: "ST",
	 * identifierPosition: 0,
	 * valuePosition: 1,
	 * }),
	 * transmissionDate: new FieldMap({
	 * segmentIdentifier: "GS",
	 * identifierValue: null,
	 * identifierPosition: null,
	 * valuePosition: 3,
	 * }),
	 * warehouseReceiptNumber: new FieldMap({
	 * segmentIdentifier: "W17",
	 * identifierValue: null,
	 * identifierPosition: null,
	 * valuePosition: 2,
	 * }),
	 * warehouse: {
	 * name: new FieldMap({
	 * segmentIdentifier: "N1",
	 * identifierValue: "WH",
	 * identifierPosition: 0,
	 * valuePosition: 1,
	 * }),
	 * code: new FieldMap({
	 * segmentIdentifier: "N1",
	 * identifierValue: "WH",
	 * identifierPosition: 0,
	 * valuePosition: 3,
	 * }),
	 * },
	 * },
	 * detail: {
	 * items: new LoopMap({
	 * position: 0,
	 * values: {
	 * itemCode: new FieldMap({
	 * segmentIdentifier: "W07",
	 * identifierValue: null,
	 * identifierPosition: null,
	 * valuePosition: 4,
	 * }),
	 * lotCode: new FieldMap({
	 * segmentIdentifier: "W07",
	 * identifierValue: null,
	 * identifierPosition: null,
	 * valuePosition: 7,
	 * }),
	 * productionDate: new FieldMap({
	 * segmentIdentifier: "N9",
	 * identifierValue: null,
	 * identifierPosition: null,
	 * valuePosition: 1,
	 * }),
	 * netWeight: new FieldMap({
	 * segmentIdentifier: "W20",
	 * identifierValue: null,
	 * identifierPosition: null,
	 * valuePosition: 3,
	 * }),
	 * quantity: new FieldMap({
	 * segmentIdentifier: "W07",
	 * identifierValue: null,
	 * identifierPosition: null,
	 * valuePosition: 0,
	 * }),
	 * },
	 * }),
	 * },
	 * };
	 * const mapSegments = transaction.getSegments();
	 * const mapped = transaction.mapSegments(mapLogic, mapSegments);
	 * console.log(mapped);
	 * // {
	 * //   header: {
	 * //     sender: "SENDER",
	 * //     receiver: "RECEIVER",
	 * //     transmissionDate: "20210101",
	 * //     warehouseReceiptNumber: "1234567890",
	 * //     warehouse: {
	 * //       name: "WAREHOUSE NAME",
	 * //       code: "WAREHOUSE CODE",
	 * //     },
	 * //   },
	 * //   detail: {
	 * //     items: [
	 * //       {
	 * //         itemCode: "ITEM CODE",
	 * //         lotCode: "LOT CODE",
	 * //         productionDate: "20210101",
	 * //         netWeight: "1000",
	 * //         quantity: "100",
	 * //       },
	 * //     ],
	 * //   },
	 * // }
	 */
	mapSegments(mapLogic: object, mapSegments: Segment[] | null = null): object {
		let result: any = {};

		Object.entries(mapLogic).forEach(([key, value]) => {

			// The FieldMap object is used to map a field from a segment to a key in the result object
			if (value instanceof FieldMap) {
				if (!mapSegments) {
					mapSegments = this.getSegments();
				};

				let segment: Segment[] | Segment = mapSegments.filter(
					(segment: Segment) => segment.name === value.segmentIdentifier,
				);

				if (segment.length === 1) {
					segment = segment[0];
				}
				else {
					segment = segment.filter((segment) => {
						if (value.identifierPosition !== null) {
							return (
								segment.getFields()[value.identifierPosition].element ===
								value.identifierValue
							);
						} else {
							return (null);
						}
					});
					segment = segment[0];
				}

				// end of weird handler

				if (!segment) {
					this.debug &&
						console.error("Segment not found", value.segmentIdentifier);
					return;
				}

				if (value.identifierValue === null) {
					if (segment.getFields()[value.valuePosition] === undefined) return;
					return (result[key] =
						segment.getFields()[value.valuePosition].element);
				}


				if (value.identifierPosition === null) {

				} else {

					const isValid =
						segment.getFields()[value.identifierPosition].element ===
						value.identifierValue;

					if (!isValid) {
						this.debug &&
							console.error(
								"[Invalid identifier value]",
								"Expected: ",
								segment.getFields()[value.identifierPosition].element,
								"Received: ",
								value.identifierValue
							);
						return;
					}

				}

				const field: any = segment.getFields()[value.valuePosition];

				if (!field) {
					this.debug && console.error("Field not found", value.valuePosition);
					return;
				}

				return (result[key] = field.element);
			}

			// LoopMap is used to map a loop to a key in the result object
			if (value instanceof LoopMap) {
				const loop = this.loops[value.position];
				if (!loop) {
					return;
				}

				result[key] = loop.contents.map((element: any) => {
					return this.mapSegments(value.values, element);
				});

				return;
			}

			// Object is used to map an object to a key in the result object
			if (value instanceof Object) {
				result[key] = this.mapSegments(value, mapSegments);
				return;
			}
		});

		return result;
	}

	/**
	 * @access private
	 * @memberof Transaction
	 * @method addSegment
	 * @description Add a segment to the transaction instance
	 * @param {Segment} segment
	 * @returns {Transaction}
	 */
	private addSegment(segment: Segment): Transaction {
		this.segments.push(segment);

		return this;
	}

	/**
	 * @memberof Transaction
	 * @method removeSegment
	 * @description Remove a segment from the transaction instance
	 * @param {Segment} segment
	 * @returns {Transaction}
	 */
	removeSegment(segment: Segment): Transaction {
		this.segments = this.segments.filter((s) => s !== segment);

		return this;
	}

	/**
	 * @memberof Transaction
	 * @method inferLoops
	 * @description Infer loops from the transaction instance
	 * @returns {void}
	 */
	inferLoops(): void {
		const segments = this.getSegments();

		// Count the number of times a segment appears in the transaction

		const segmentCounts: any = [];

		segments.forEach((segment) => {
			if (!segmentCounts[segment.name]) {
				segmentCounts[segment.name] = 0;
			}

			segmentCounts[segment.name]++;
		});

		// Find the groups of segments that loop

		const loopGroups: Segment[] = [];
		// count was originally in this index if it messed anything up
		Object.entries(segmentCounts).forEach(([segmentName], count) => {
			if (count > 1) {
				const group = segments.filter(
					(segment) => segment.name === segmentName
				);

				loopGroups.push(group[count]);
			}
		});

		const loopIdentifiers = loopGroups.map((group: any) => group[0].name);

		const loop = new Loop();

		loop.setPosition(0);

		loop.addSegmentIdentifiers(loopIdentifiers);

		this.addLoop(loop);

		// Run the loops

		this.runLoops();
	}

	/**
	 * @memberof Transaction
	 * @method generateSegments
	 * @description Generate segments for instance from a string
	 * @param {string} element
	 * @returns {void}
	 */
	generateSegments(element: string): void {
		const segments = element.split("\n");
		segments.forEach((segment) => {
			const fields = segment.split("*");
			const segmentName = fields[0];
			const segmentInstance = new Segment(segmentName);
			fields.shift();
			fields.forEach((field) => {
				const fieldInstance: Field = new Field(field);
				fieldInstance.trim();
				segmentInstance.addField(fieldInstance);
			});
			this.addSegment(segmentInstance);
		});
	}
}

// ----------------------------------------------------------------------------------------------------------

import * as fs from 'fs';


const file = fs.readFileSync("./bin/proto/input/834.edi", 'utf8');
// console.log(file)
// ISA*00*          *00*          *ZZ*123456789012345*ZZ*123456789012346*080503*1705*>*00501*000010216*0*T*:~
// GS*BE*1234567890*1234567890*20080503*1705*20213*X*005010X220A1~
// ST*834*12345*005010X220A1~
// BGN*00*12456*19980520*1200****2~
// N1*P5**FI*999888777~
// N1*IN**FI*654456654~
// INS*Y*18*030*28*A***FT~
// REF*0F*ABCXYZ~
// REF*1L*GROUP2023~
// REF*DX*0001~
// REF*ZZ*00~                               
// DTP*336*D8*20220601~
// NM1*IL*1*LAKIN*CARY****34*999681271~
// PER*IP**HP*7172343334*EM*email@ex.com~
// N3*734 DARE BRIDGE~
// N4*TAMPA*FL*33618**CY*HILLSBOROUGH~
// DMG*D8*19880306*F~
// HD*030**HLT*PLAN_ID*EMP~
// DTP*348*D8*20230101~
// INS*Y*18*030*28*A***FT~
// REF*0F*ABCXYZ~
// REF*1L*GROUP2023~
// REF*DX*0001~
// REF*ZZ*00~
// DTP*336*D8*20220601~
// NM1*IL*1*LAKIN*CARY****34*999681271~
// PER*IP**HP*7172343334*EM*email@ex.com~
// N3*734 DARE BRIDGE~
// N4*TAMPA*FL*33618**CY*HILLSBOROUGH~
// DMG*D8*19880306*F~
// HD*030**HLT*PLAN_ID*EMP~
// DTP*348*D8*20230101~
// SE*21*12345~
// GE*1*20213~
// IEA*1*000010216~

const transaction = new Transaction();
transaction.generateSegments(file);
// console.log(transaction)
	// Transaction {
	// 	segments: [
	// 	  Segment { name: 'ISA', fields: [Array] },
	// 	  Segment { name: 'GS', fields: [Array] },
	// 	  Segment { name: 'ST', fields: [Array] },
	// 	  Segment { name: 'BGN', fields: [Array] },
	// 	  Segment { name: 'N1', fields: [Array] },
	// 	  Segment { name: 'N1', fields: [Array] },
	// 	  Segment { name: 'INS', fields: [Array] },
	// 	  Segment { name: 'REF', fields: [Array] },
	// 	  Segment { name: 'REF', fields: [Array] },
	// 	  Segment { name: 'REF', fields: [Array] },
	// 	  Segment { name: 'REF', fields: [Array] },
	// 	  Segment { name: 'DTP', fields: [Array] },
	// 	  Segment { name: 'NM1', fields: [Array] },
	// 	  Segment { name: 'PER', fields: [Array] },
	// 	  Segment { name: 'N3', fields: [Array] },
	// 	  Segment { name: 'N4', fields: [Array] },
	// 	  Segment { name: 'DMG', fields: [Array] },
	// 	  Segment { name: 'HD', fields: [Array] },
	// 	  Segment { name: 'DTP', fields: [Array] },
	// 	  Segment { name: 'INS', fields: [Array] },
	// 	  Segment { name: 'REF', fields: [Array] },
	// 	  Segment { name: 'REF', fields: [Array] },
	// 	  Segment { name: 'REF', fields: [Array] },
	// 	  Segment { name: 'REF', fields: [Array] },
	// 	  Segment { name: 'DTP', fields: [Array] },
	// 	  Segment { name: 'NM1', fields: [Array] },
	// 	  Segment { name: 'PER', fields: [Array] },
	// 	  Segment { name: 'N3', fields: [Array] },
	// 	  Segment { name: 'N4', fields: [Array] },
	// 	  Segment { name: 'DMG', fields: [Array] },
	// 	  Segment { name: 'HD', fields: [Array] },
	// 	  Segment { name: 'DTP', fields: [Array] },
	// 	  Segment { name: 'SE', fields: [Array] },
	// 	  Segment { name: 'GE', fields: [Array] },
	// 	  Segment { name: 'IEA', fields: [Array] }
	// 	],
	// 	loops: [],
	// 	debug: false
	//   }
// console.log(transaction.segments)
	// [
	// 	Segment {
	// 	name: 'ISA',
	// 	fields: [
	// 		[Field], [Field], [Field],
	// 		[Field], [Field], [Field],
	// 		[Field], [Field], [Field],
	// 		[Field], [Field], [Field],
	// 		[Field], [Field], [Field],
	// 		[Field]
	// 	]
	// 	},
	// 	Segment {
	// 	name: 'GS',
	// 	fields: [
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field]
	// 	]
	// 	},
	// 	Segment { name: 'ST', fields: [ [Field], [Field], [Field] ] },
	// 	Segment {
	// 	name: 'BGN',
	// 	fields: [
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field]
	// 	]
	// 	},
	// 	Segment {
	// 	name: 'N1',
	// 	fields: [ [Field], [Field], [Field], [Field] ]
	// 	},
	// 	Segment {
	// 	name: 'N1',
	// 	fields: [ [Field], [Field], [Field], [Field] ]
	// 	},
	// 	Segment {
	// 	name: 'INS',
	// 	fields: [
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field]
	// 	]
	// 	},
	// 	Segment { name: 'REF', fields: [ [Field], [Field] ] },
	// 	Segment { name: 'REF', fields: [ [Field], [Field] ] },
	// 	Segment { name: 'REF', fields: [ [Field], [Field] ] },
	// 	Segment { name: 'REF', fields: [ [Field], [Field] ] },
	// 	Segment { name: 'DTP', fields: [ [Field], [Field], [Field] ] },
	// 	Segment {
	// 	name: 'NM1',
	// 	fields: [
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field]
	// 	]
	// 	},
	// 	Segment {
	// 	name: 'PER',
	// 	fields: [ [Field], [Field], [Field], [Field], [Field], [Field] ]
	// 	},
	// 	Segment { name: 'N3', fields: [ [Field] ] },
	// 	Segment {
	// 	name: 'N4',
	// 	fields: [ [Field], [Field], [Field], [Field], [Field], [Field] ]
	// 	},
	// 	Segment { name: 'DMG', fields: [ [Field], [Field], [Field] ] },
	// 	Segment {
	// 	name: 'HD',
	// 	fields: [ [Field], [Field], [Field], [Field], [Field] ]
	// 	},
	// 	Segment { name: 'DTP', fields: [ [Field], [Field], [Field] ] },
	// 	Segment {
	// 	name: 'INS',
	// 	fields: [
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field]
	// 	]
	// 	},
	// 	Segment { name: 'REF', fields: [ [Field], [Field] ] },
	// 	Segment { name: 'REF', fields: [ [Field], [Field] ] },
	// 	Segment { name: 'REF', fields: [ [Field], [Field] ] },
	// 	Segment { name: 'REF', fields: [ [Field], [Field] ] },
	// 	Segment { name: 'DTP', fields: [ [Field], [Field], [Field] ] },
	// 	Segment {
	// 	name: 'NM1',
	// 	fields: [
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field], [Field],
	// 		[Field]
	// 	]
	// 	},
	// 	Segment {
	// 	name: 'PER',
	// 	fields: [ [Field], [Field], [Field], [Field], [Field], [Field] ]
	// 	},
	// 	Segment { name: 'N3', fields: [ [Field] ] },
	// 	Segment {
	// 	name: 'N4',
	// 	fields: [ [Field], [Field], [Field], [Field], [Field], [Field] ]
	// 	},
	// 	Segment { name: 'DMG', fields: [ [Field], [Field], [Field] ] },
	// 	Segment {
	// 	name: 'HD',
	// 	fields: [ [Field], [Field], [Field], [Field], [Field] ]
	// 	},
	// 	Segment { name: 'DTP', fields: [ [Field], [Field], [Field] ] },
	// 	Segment { name: 'SE', fields: [ [Field], [Field] ] },
	// 	Segment { name: 'GE', fields: [ [Field], [Field] ] },
	// 	Segment { name: 'IEA', fields: [ [Field], [Field] ] }
	// ]


const itemLoop = new Loop();
itemLoop.setPosition(0);

itemLoop.addSegmentIdentifiers(["INS", "REF", "REF", "DTP", "DTP", "NM1", "PER", "N3", "N4", "DMG", "HD", "DTP", "DTP"]);

transaction.addLoop(itemLoop);
// console.log(transaction.loops)
// [
// 	Loop {
// 	  position: 0,
// 	  segmentIdentifiers: [
// 		'INS', 'REF', 'REF',
// 		'DTP', 'DTP', 'NM1',
// 		'PER', 'N3',  'N4',
// 		'DMG', 'HD',  'DTP',
// 		'DTP'
// 	  ],
// 	  contents: [ [] ]
// 	}
// ]

transaction.runLoops();
// console.log(transaction)

// console.log(transaction.segments[0])
	// Segment {
	// 	name: 'ISA',
	// 	fields: [
	// 	  Field { element: '00' },
	// 	  Field { element: '' },
	// 	  Field { element: '00' },
	// 	  Field { element: '' },
	// 	  Field { element: 'ZZ' },
	// 	  Field { element: '123456789012345' },
	// 	  Field { element: 'ZZ' },
	// 	  Field { element: '123456789012346' },
	// 	  Field { element: '080503' },
	// 	  Field { element: '1705' },
	// 	  Field { element: '>' },
	// 	  Field { element: '00501' },
	// 	  Field { element: '000010216' },
	// 	  Field { element: '0' },
	// 	  Field { element: 'T' },
	// 	  Field { element: ':' }
	// 	]
	//   }

let authorizationInformationQualifier = new FieldMap("INS", null, null,  0);
const mapLogic1 = authorizationInformationQualifier

const mapLogic = {
	header: {
		ISA: {
			authorizationInformationQualifier: 		new FieldMap("INS", null, null,  0),
			authorizationInformation: 				new FieldMap("INS", null, null,  1),
			securityInformationQualifier: 			new FieldMap("INS", null, null,  2),
			securityInformation: 					new FieldMap("INS", null, null,  3),
			interchangeSenderIdQualifier: 			new FieldMap("INS", null, null,  4),
			interchangeSenderId: 					new FieldMap("INS", null, null,  5),
			interchangeReceiverIdQualifier: 		new FieldMap("INS", null, null,  6),
			interchangeReceiverId: 					new FieldMap("INS", null, null,  7),
			interchangeDate: 						new FieldMap("INS", null, null,  8),
			interchangeTime: 						new FieldMap("INS", null, null,  9),
			interchangeControlStandardsIdentifier: 	new FieldMap("INS", null, null,  0),
			interchangeControlVersionNumber: 		new FieldMap("INS", null, null, 11),
			interchangeControlNumber: 				new FieldMap("INS", null, null, 12),
			acknowledgmentRequested: 				new FieldMap("INS", null, null, 13),
			usageIndicator: 						new FieldMap("INS", null, null, 14),
			componentElementSeparator:				new FieldMap("INS", null, null, 15),
		},
		GS: {

		},
		ST: {

		},
		BGN: {

		}
	},
	detail: {
		member: new LoopMap(
			0,
			{
				subscriberIndicator: 		new FieldMap("INS", null, null,  0),
				individualRelationshipCode: new FieldMap("INS", null, null,  1),
				insuredMaintenanceTypeCode: new FieldMap("INS", null, null,  2),
				maintenanceReasonCode: 		new FieldMap("INS", null, null,  3),
				benefitStatusCode:			new FieldMap("INS", null, null,  4),
				medicarePlanCode: 			new FieldMap("INS", null, null,  5),
				cobraQualifyingEventCode: 	new FieldMap("INS", null, null,  6),
				employmentStatusCode: 		new FieldMap("INS", null, null,  7),
				studentStatusCode: 			new FieldMap("INS", null, null,  8),
				handicapIndicator: 			new FieldMap("INS", null, null,  9),
				deathDateFormatQualifier: 	new FieldMap("INS", null, null,  0),
				insuredIndividualDeathDate: new FieldMap("INS", null, null, 11),
				confidentialityCodeNotUsed: new FieldMap("INS", null, null, 12),
				cityNotUsed: 				new FieldMap("INS", null, null, 13),
				stateCodeNotUsed: 			new FieldMap("INS", null, null, 14),
				countryCodeNotUsed: 		new FieldMap("INS", null, null, 15),
				birthSequenceNumber:		new FieldMap("INS", null, null, 16),
			}
		)
	}
}
console.log(mapLogic.detail.member.values)

// const jsonMapLogic = JSON.stringify(mapLogic)

// console.log(transaction.getSegments())

const output = transaction.mapSegments(mapLogic1, transaction.getSegments());
console.log(JSON.stringify(output))