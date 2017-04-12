import Form from "./Form";
import Errors from "./Errors";

describe( "Form", () => {
    describe( "instantiation", () => {
        it( "can accept a collection of form fields", () => {
            const form = new Form( {
                name: "",
                email: ""
            } );
            expect( form.name ).toBe( "" );
            expect( form.email ).toBe( "" );
        } );

        it( "creates an empty errors class on instantiation", () => {
            const form = new Form( {
                name: "",
                email: ""
            } );
            expect( form.errors ).toBeInstanceOf( Errors );
        } );
    } );

    describe( "data", () => {
        it( "can return an object of the current data values", () => {
            const form = new Form( {
                name: "John Doe",
                phones: [
                    "5554652323",
                    "5551441244"
                ]
            } );
            form.phones.push( "5551619098" );

            expect( form.data() ).toEqual( {
                name: "John Doe",
                phones: [
                    "5554652323",
                    "5551441244",
                    "5551619098"
                ]           
            } );
        } );
    } );

    describe( "ajax methods", () => {
        it( "has shortcuts for POST", () => {
            const form = new Form( { name: "" } );
            expect( form.post ).toBeDefined();
        } );

        it( "has shortcuts for PUT", () => {
            const form = new Form( { name: "" } );
            expect( form.put ).toBeDefined();
        } );

        it( "has shortcuts for PATCH", () => {
            const form = new Form( { name: "" } );
            expect( form.patch ).toBeDefined();
        } );

        it( "has shortcuts for DELETE", () => {
            const form = new Form( { name: "" } );
            expect( form.delete ).toBeDefined();
        } );
    } );

    describe( "reset", () => {
        it( "resets form values back to their original values", () => {
            const form = new Form( {
                name: "",
                email: "",
                checked: false
            } );
            form.name = "Test name";
            form.email = "test@example.com";
            form.checked = true;
            expect( form.name ).toBe( "Test name" );
            expect( form.email ).toBe( "test@example.com" );
            expect( form.checked ).toBe( true );

            form.reset();

            expect( form.name ).toBe( "" );
            expect( form.email ).toBe( "" );
            expect( form.checked ).toBe( false );
        } );
    } );
} );