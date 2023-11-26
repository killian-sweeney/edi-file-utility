import { validateHeaderName } from "http";
import Field from "./Field";
import FieldMap from "./FieldMap";
import Loop from "./Loop";
import LoopMap from "./LoopMap";
import Segment from "./Segment";

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

	 * @description Convert the transaction instance to a JSON object
	 * @example
	 */
	toJSON(): object {
		return {
			segments: this.segments.map((segment) => segment.toJson()),
			loops: this.loops.map((loop) => loop.toJson()),
		};
	}

	/**
	 * @description Get the type of EDI transaction 
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
	 * @description Get all segments in the transaction instance
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
	getSegments(): Segment[] {
		return this.segments.map((segment) => segment);
	}

	/**
	 * @description Get all segment identifiers in the transaction instance
	 * @example
	 * const segmentIdentifiers = transaction.listSegmentIdentifiers();
	 * console.log(segmentIdentifiers);
	 * // [
	 * //   'ST', 'B4', 'N1', 'N3', 'N4', 'G61', 'N1', 'N3', 'N4', 'G61',
	 * // ]
	 */
	listSegmentIdentifiers(): string[] {
		return this.segments.map((segment) => segment.name);
	}

	/**
	 * @description Get all loops in the transaction instance
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
	getLoops(): Loop[] {
		return this.loops.map((loop) => loop);
	}

	/**
	 * @description Add a loop to the transaction instance
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
	 * @description Run a loop
	 * @returns {void}
	 */
	private runLoop(loop: Loop): void {
		let segments = this.getSegments();

		// console.log("<-- SEGMENTS IN transaction --> runLoop -->")
		// console.log(segments)

		const identifierStartsLoop = loop.segmentIdentifiers[0];
		console.log(`identifierStartsLoop: ${loop.segmentIdentifiers[0]}`)

			segments = segments.splice(
				segments.findIndex((segment: Segment) => {		
					return segment.name === identifierStartsLoop;
				}),
				segments.length - 1
			);

		this.debug && console.log("[Segments in Loop]", segments);

		let loopSegments: Segment[] = [];

		for (let segment of segments) {
			this.debug && console.log("[Segment]", segment);

			if (loop.getSegmentIdentifiers().includes(segment.name)) {
				this.debug && console.log("[Segment Name]", segment.name);

				console.log(loopSegments.length, loop.getSegmentIdentifiers().length)

				if (loopSegments.length === loop.getSegmentIdentifiers().length - 1) {
					this.debug && console.log("[Last segment identifier for loop]");

					console.log("<-- loopSegments, 'if' -->")
					console.log(loopSegments)

					console.log("loop.contents after push")
					loop.contents.push([...loopSegments, segment]);
					
					
					// console.log(loop.contents)
					
					loopSegments = [];
				} 

				else {
				
					// console.log("loopSegments.push(segment);")
					// console.log(segment)
					segment.fields.forEach((field) => {
						field = field.toString();
						console.log(`forEach(field):`, field)
					});
					console.log(`'else'`);
					console.log(segment.fields);					
					loopSegments.push(segment);
				}
			}
		}
		this.debug && console.log("[Loop]", loop);
		this.debug && console.log("[Loop Contents]", loop.contents);
	}

	/**
	 * @description Map segments to a JSON object
	 * @example
	 */
	mapSegments(mapLogic: object, mapSegments: Segment[]): object {

		let result: any = {};
	
		Object.entries(mapLogic).forEach(([key, value]) => {

			if (value === null) {
				console.log("   * value === null")
			}
			


			if (value instanceof FieldMap) {

				// console.log("value instanceof Fieldmap:", value instanceof FieldMap, value)
				
				let segment: Segment[] | Segment = mapSegments.filter(
					(segment: Segment) => segment.name === value.segmentIdentifier,
				);

				if (segment.length === 1) {

					// console.log( "segment.length === 1", segment)
					
					segment = segment[0];

				} 
				else {
					// console.log( "segment.length !== 1", `The Segment:`, segment)

					segment = segment.filter((segment: Segment) => {
						if (value.identifierPosition !== null) {


							
							return (
								segment.getFields()[value.identifierPosition].element ===
								value.identifierValue
							);
						} else {
							return;
						}
						
					});
					segment = segment[0];
				}

				// console.log(segment)

				if (!segment) {
					this.debug &&
						console.error("Segment not found", value.segmentIdentifier);
					return;
				}

				if (value.identifierValue === null) {			
					if (segment.getFields()[value.valuePosition] === undefined)
						return;
					return (result[key] =
						segment.getFields()[value.valuePosition].element);
				}

					// const isValid =
					// 	segment.getFields()[value.identifierPosition].element ===
					// 	value.identifierValue;

					// if (!isValid) {
					// 	this.debug &&
					// 		console.error(
					// 			"[Invalid identifier value]",
					// 			"Expected: ",
					// 			segment.getFields()[value.identifierPosition].element,
					// 			"Received: ",
					// 			value.identifierValue
					// 		);
					// 	return;
					// }

				

				const field: Field = segment.fields[value.valuePosition];

				if (!field) {
					this.debug && console.error("Field not found", value.valuePosition);
					return;
				}
				return (result[key] = JSON.stringify(field.element));
			}

			// LoopMap is used to map a loop to a key in the result object
			if (value instanceof LoopMap) {

			// console.log("<-- LOOP MAP -->", value instanceof LoopMap)

				const loop = this.loops[value.position];
				
				// console.log(loop)

				if (!loop) {
					return;
				}

				result[key] = loop.contents.map((element: any) => {
					return this.mapSegments(value.values, [element]);
				});

				return;
			}

			// Object is used to map an object to a key in the result object
			if (typeof value === 'object') {
				// console.log("INSTANCEOF OBJECT!!")
				result[key] = this.mapSegments(value, mapSegments);
				return;
			}
		});
		// console.log({result})
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

// Reads in the data
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

// Creates and Adds the Segements to the Transaction
const transaction = new Transaction();
transaction.generateSegments(file);
// console.log(transaction.segments[0])
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

// Create the itemLoop and sets the position
const itemLoop = new Loop();
itemLoop.setPosition(0);


itemLoop.addSegmentIdentifiers(["INS", "REF", "REF", "REF", "REF", "DTP", "NM1", "PER", "N3", "N4", "DMG", "HD", "DTP" ]);
// ["INS", "REF", "REF", "DTP", "DTP", "NM1", "PER", "N3", "N4", "DMG", "HD", "DTP", "DTP"]


transaction.addLoop(itemLoop);
// console.log("<-- BEFORE RUN -->")
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
// console.log("BEFORE RUNLOOPS")
// console.log(JSON.stringify(transaction.loops[0].contents))

transaction.runLoops();
// console.log("TEST RESULT")
// console.log(JSON.stringify(transaction.loops))

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

console.log("<-- AFTER RUN -->")
console.log(JSON.stringify(transaction.loops[0]))



let authorizationInformationQualifier = new FieldMap("ISA", null, null,  0);
let authorizationInformation		  =	new FieldMap("ISA", null, null,  1);
const mapLogic1 = {authorizationInformationQualifier, authorizationInformation}

// console.log("<-- mapLogic1 -->")
// console.log(mapLogic1)


const mapLogic = {
	header: {
		ISA: {
			authorizationInformationQualifier: 		new FieldMap("ISA", null, null,  0),
			authorizationInformation: 				new FieldMap("ISA", null, null,  1),
			securityInformationQualifier: 			new FieldMap("ISA", null, null,  2),
			securityInformation: 					new FieldMap("ISA", null, null,  3),
			interchangeSenderIdQualifier: 			new FieldMap("ISA", null, null,  4),
			interchangeSenderId: 					new FieldMap("ISA", null, null,  5),
			interchangeReceiverIdQualifier: 		new FieldMap("ISA", null, null,  6),
			interchangeReceiverId: 					new FieldMap("ISA", null, null,  7),
			interchangeDate: 						new FieldMap("ISA", null, null,  8),
			interchangeTime: 						new FieldMap("ISA", null, null,  9),
			interchangeControlStandardsIdentifier: 	new FieldMap("ISA", null, null, 10),
			interchangeControlVersionNumber: 		new FieldMap("ISA", null, null, 11),
			interchangeControlNumber: 				new FieldMap("ISA", null, null, 12),
			acknowledgmentRequested: 				new FieldMap("ISA", null, null, 13),
			usageIndicator: 						new FieldMap("ISA", null, null, 14),
			componentElementSeparator:				new FieldMap("ISA", null, null, 15),
		},
		GS: {
			functionalIdentifierCode:				new FieldMap("GS", null, null, 0),
			applicationSenderId:					new FieldMap("GS", null, null, 1),
			applicationReceiverId:					new FieldMap("GS", null, null, 2),
			date:									new FieldMap("GS", null, null, 3),
			time:									new FieldMap("GS", null, null, 4),
			groupControlNumber:						new FieldMap("GS", null, null, 5),
			responsibleAgencyCode:					new FieldMap("GS", null, null, 6),
			versionReleaseIndustryIdentifierCode:	new FieldMap("GS", null, null, 7)
		},
		ST: {
			transactionSetIdentifierCode: 		new FieldMap("ST", null, null, 0),
			transactionSetControlNumber: 		new FieldMap("ST", null, null, 1),
			implementationConventionReference: 	new FieldMap("ST", null, null, 2)
		},
		BGN: {
			transactionSetPurposeCode: 		new FieldMap("BGN", null, null, 0), 
			TransactionSetReferenceCode: 	new FieldMap("BGN", null, null, 1),
			date: 							new FieldMap("BGN", null, null, 2),
			time: 							new FieldMap("BGN", null, null, 3),
			timeZoneCode: 					new FieldMap("BGN", null, null, 4),
			affectsTransactionSetReference: new FieldMap("BGN", null, null, 5),
			transactionTypeCode: 			new FieldMap("BGN", null, null, 6),
			actionCode: 					new FieldMap("BGN", null, null, 7),
			securityLevelCode: 				new FieldMap("BGN", null, null, 8)
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
					deathDateFormatQualifier: 	new FieldMap("INS", null, null, 10),
					insuredIndividualDeathDate: new FieldMap("INS", null, null, 11),
					confidentialityCodeNotUsed: new FieldMap("INS", null, null, 12),
					cityNotUsed: 				new FieldMap("INS", null, null, 13),
					stateCodeNotUsed: 			new FieldMap("INS", null, null, 14),
					countryCodeNotUsed: 		new FieldMap("INS", null, null, 15),
					birthSequenceNumber:		new FieldMap("INS", null, null, 16),

					subscriberReferenceIdQualifier: new FieldMap("REF", "0F", 0, 0),
					subscriberNumberId:				new FieldMap("REF", "0F", 0, 1),
					// subscriberDescription: 			new FieldMap("REF", "0F", 0, 2)

					groupReferenceIdentificationQualifier: 	new FieldMap("REF","1L", 0, 0),
					groupId: 								new FieldMap("REF","1L", 0, 1),
					// groupDescription: 						new FieldMap("REF","1L", 0, 2)

					memberIdentificationDivision: {
						divisionReferenceIdQualifier: 	new FieldMap("REF", "DX", 0, 0),
						division: 						new FieldMap("REF", "DX", 0, 1),
						// divisionDescription: new FieldMap("REF", "DX", 0, 2)
					},
				memberIdentificationDependentNumber: {
					dependentReferenceIdQualifier: 	new FieldMap("REF", "ZZ", 0, 0),
					dependentId: 					new FieldMap("REF", "ZZ", 0, 1),
					// dependentDescription: new FieldMap("REF", "ZZ", 0, 2)
				},
				employmentStart: {
					employmentStartQualifier: 		new FieldMap("DTP", "336", 0, 0),
					employmentStartFormatQualifier: new FieldMap("DTP", "336", 0, 1),
					employmentStartDate: 			new FieldMap("DTP", "336", 0, 2)
				},
				// employmentEnd: {},
				memberName: {
					entityIdentifierCode: 			new FieldMap("NM1", null, null, 0),
					entityTypeQualifier: 			new FieldMap("NM1", null, null, 1),
					lastName: 						new FieldMap("NM1", null, null, 2),
					firstName: 						new FieldMap("NM1", null, null, 3),
					middleName: 					new FieldMap("NM1", null, null, 4),
					prefix: 						new FieldMap("NM1", null, null, 5),
					suffix: 						new FieldMap("NM1", null, null, 6),
					identificationCodeQualifier: 	new FieldMap("NM1", null, null, 7),
					identificationCode: 			new FieldMap("NM1", null, null, 8)
				},
				// memberTelecommunications: {},
				// memberResidenceStreetAddress: {},
				// memberResidenceCityStateZipCode: {},
				// memberDemographics: {},
				// healthCoverage: {},
				healthCoverageBegin: {
					benefitStartFormatQualifier: 	new FieldMap("DTP", "348", 0, 0),
					benefitStartQualifier: 			new FieldMap("DTP", "348", 0, 1),
					benefitStartDate: 				new FieldMap("DTP", "348", 0, 2)
				},
				// healthCoverageEnd: {}
			}
		)
	}
}



// console.log(JSON.stringify(transaction.getSegments()))


const output = transaction.mapSegments(mapLogic, transaction.getSegments());



// console.log(`output: ${output}`);
// console.log("<-- OUTPUT -->")
// console.log(JSON.stringify(output))
// console.log(output)