import Errors from "./Errors";

describe( "Errors", () => {
    describe( "constructor", () => {
        it( "defaults to empty", () => {
            const errors = new Errors();
            expect( errors.getAll() ).toMatchObject( {} );
        } );

        it( "returns itself for chaining", () => {
            const result = new Errors();

            expect( result ).toBeInstanceOf( Errors ); 
        } );
    } );

    describe( "set", () => {
        it( "can add errors for a field", () => {
            const errors = new Errors();
            errors.set( "some-field", "some error message" );
            expect( errors.getAll() ).toEqual( {
                "some-field": "some error message"
            } );
        } );

        it( "can add nested properties using an array syntax", () => {
            const errors = new Errors();
            errors.set( [ "some", "nested", "field" ], "some error message" );
            expect( errors.getAll() ).toEqual( {
                "some": {
                    "nested": {
                        "field": "some error message"
                    }
                }
            } );
        } );

        it( "setting a value with the same key overwrites previous values", () => {
            const errors = new Errors();
            errors.set( "some.nested.field", "some error message" );
            errors.set( "some", "some other message" );
            expect( errors.getAll() ).toEqual( {
                "some": "some other message"
            } );
        } );

        it( "can add nested properties using a dot syntax", () => {
            const errors = new Errors();
            errors.set( "some.nested.field", "some error message" );
            expect( errors.getAll() ).toEqual( {
                "some": {
                    "nested": {
                        "field": "some error message"
                    }
                }
            } );
        } );

        it( "can set nested properties under the same nested key", () => {
            const errors = new Errors();
            errors.set( "some.nested.field", [ { message: "some error message" } ] );
            errors.set( "some.other.field", [ { message: "some other message" } ] );
            expect( errors.get( "some.nested.field" ) ).toBe( "some error message" );
            expect( errors.get( "some.other.field" ) ).toBe( "some other message" );
            expect( errors.get( "some.non-existent.field" ) ).toBe( undefined );
        } );

        it( "can set multiple errors with the same nested ancestry", () => {
            const errors = new Errors();
            errors.set( "items.0.partNumber", [ { message: "Please use only numbers." } ] );
            errors.set( "items.0.quantity", [ { message: "Quantity cannot be 0." } ] );

            expect( errors.has( "items.0.partNumber" ) ).toBe( true );
            expect( errors.has( "items.0.quantity" ) ).toBe( true );
        } );

        it( "returns itself for chaining", () => {
            const errors = new Errors();
            const result = errors.set( "some-field", "some error message" );

            expect( result ).toBeInstanceOf( Errors ); 
        } );
    } );

    describe( "has", () => {
        it( "returns true if an error exists for a field", () => {
            const errors = new Errors();
            errors.set( "some-field", "some error message" );
            expect( errors.has( "some-field" ) ).toBe( true );
        } );

        it( "works with array syntax nested fields", () => {
            const errors = new Errors();
            errors.set( [ "some", "nested", "field" ], "some error message" );
            expect( errors.has( [ "some", "nested", "field" ] ) ).toBe( true );
            expect( errors.has( [ "some", "non-existent", "field" ] ) ).toBe( false );
        } );

        it( "works with dot syntax nested fields", () => {
            const errors = new Errors();
            errors.set( "some.nested.field", "some error message" );
            expect( errors.has( "some.nested.field" ) ).toBe( true );
            expect( errors.has( "some.non-existent.field" ) ).toBe( false );
        } );
    } );

    describe( "get", () => {
        it( "returns the error message for a field if it exists", () => {
            const errors = new Errors();
            errors.set( "some-field", [ { message: "some error message" } ] );
            expect( errors.get( "some-field" ) ).toBe( "some error message" );
        } );

        it( "returns undefined if the field does not have an error message associated", () => {
            const errors = new Errors();
            errors.set( "some-field", "some error message" );
            expect( errors.get( "non-existent-field" ) ).toBe( undefined );
        } );

        it( "works with array syntax nested fields", () => {
            const errors = new Errors();
            errors.set( [ "some", "nested", "field" ], [ { message: "some error message" } ] );
            expect( errors.get( [ "some", "nested", "field" ] ) ).toBe( "some error message" );
            expect( errors.get( [ "some", "non-existent", "field" ] ) ).toBe( undefined );
        } );

        it( "works with dot syntax nested fields", () => {
            const errors = new Errors();
            errors.set( "some.nested.field", [ { message: "some error message" } ] );
            expect( errors.get( "some.nested.field" ) ).toBe( "some error message" );
            expect( errors.get( "some.non-existent.field" ) ).toBe( undefined );
        } );
    } );

    describe( "clear", () => {
        it( "can clear a specific field of its error messages", () => {
            const errors = new Errors();
            errors.set( "some-field", [ { message: "some error message" } ] );
            errors.set( "other-field", [ { message: "some other message" } ] );
            expect( errors.has( "some-field" ) ).toBe( true );

            errors.clear( "some-field" );

            expect( errors.has( "some-field" ) ).toBe( false );
            expect( errors.has( "other-field" ) ).toBe( true );
            expect( errors.any() ).toBe( true );
        } );

        it( "can clear a nested field using array syntax", () => {
            const errors = new Errors();
            errors.set( [ "some", "nested", "field" ], [ { message: "some error message" } ] );
            expect( errors.has( [ "some", "nested", "field" ] ) ).toBe( true );

            errors.clear( [ "some", "nested", "field" ] );

            expect( errors.has( [ "some", "nested", "field" ] ) ).toBe( false );
        } );

        it( "can clear a nested field using dot syntax", () => {
            const errors = new Errors();
            errors.set( "some.nested.field", [ { message: "some error message" } ] );
            expect( errors.has( "some.nested.field" ) ).toBe( true );

            errors.clear( "some.nested.field" );

            expect( errors.has( "some.nested.field" ) ).toBe( false );
        } );

        it( "clears all fields if no field is given", () => {
            const errors = new Errors();
            errors.set( "some-field", "some error message" );
            errors.set( "other-field", "some other message" );
            expect( errors.has( "some-field" ) ).toBe( true );

            errors.clear();

            expect( errors.has( "some-field" ) ).toBe( false );
            expect( errors.has( "other-field" ) ).toBe( false );
            expect( errors.any() ).toBe( false );
        } );

        it( "returns itself for chaining", () => {
            const errors = new Errors();
            errors.set( "some-field", "some error message" );
            expect( errors.has( "some-field" ) ).toBe( true );

            var result = errors.clear( "some-field" );

            expect( result ).toBeInstanceOf( Errors ); 
        } );
    } );

    describe( "any", () => {
        it( "returns false if no errors have been recorded", () => {
            const errors = new Errors();
            expect( errors.any() ).toBe( false );
        } );

        it( "returns true if any errors have been recorded", () => {
            const errors = new Errors();
            errors.set( "some-field", "some error message" );
            expect( errors.any() ).toBe( true );
        } );
    } );

    describe( "record", () => {
        it( "can record all errors at once", () => {
            const errors = new Errors();
            expect( errors.any() ).toBe( false );

            errors.record( {
                "some-field": "a different error message",
                "another-field": "another error message"
            } );

            expect( errors.any() ).toBe( true );
            expect( errors.getAll() ).toEqual( {
                "some-field": "a different error message",
                "another-field": "another error message"
            } );
        } );

        it( "can record nested keys in record", () => {
            const errors = new Errors();
            expect( errors.any() ).toBe( false );

            errors.record( {
                "flat-field": "a boring error message",
                "some.nested.field": "a different error message",
                "some.other.field": "another error message"
            } );

            expect( errors.any() ).toBe( true );
            expect( errors.getAll() ).toEqual( {
                "flat-field": "a boring error message",
                "some": {
                    "nested": {
                        "field": "a different error message"
                    },
                    "other": {
                        "field": "another error message"
                    }
                }
            } );
        } );

        it( "can record multiple errors with the same nested ancestry", () => {
            const errors = new Errors();
            errors.record( {
                "items.0.partNumber": [ { message: "Please use only numbers." } ],
                "items.0.quantity": [ { message: "Quantity cannot be 0." } ],
                "locationsAdjusted": [ { message: "The number of unique locations (1) must match [locationsAdjusted] (2)." } ]
            } );

            expect( errors.has( "items.0.partNumber" ) ).toBe( true );
            expect( errors.has( "items.0.quantity" ) ).toBe( true );
            expect( errors.has( "locationsAdjusted" ) ).toBe( true );
        } );

        it( "old errors are forgotten when recording new errors", () => {
            const errors = new Errors();
            errors.set( "some-field", "some error message" );
            expect( errors.any() ).toBe( true );

            errors.record( {
                "some-field": "a different error message",
                "another-field": "another error message"
            } );

            expect( errors.any() ).toBe( true );
            expect( errors.getAll() ).toEqual( {
                "some-field": "a different error message",
                "another-field": "another error message"
            } );
        } );

        it( "returns itself for chaining", () => {
            const errors = new Errors();

            const result = errors.record( {
                "some-field": "a different error message",
                "another-field": "another error message"
            } );

            expect( result ).toBeInstanceOf( Errors );
        } );
    } );
} );