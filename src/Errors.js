import merge from "deepmerge";

export default class Errors {
    
    constructor() {
        this.errors = {};
    }

    getAll() {
        return this.errors;
    }

    any() {
        return Object.keys( this.getAll() ).length > 0;
    }

    set( field, message ) {
        field = normalizeToArray( field );
        const fieldKey = field.shift();
        message = buildNestedObject( field, message, this.errors[ fieldKey ] );
        let obj = {};
        obj[ fieldKey ] = message;
        this.errors = merge.all( [ {}, this.errors, obj ] );
        return this;
    }

    has( field ) {
        const fieldArray = normalizeToArray( field );
        let result = this.errors;
        while ( fieldArray.length > 0 ) {
            let fieldPart = fieldArray.shift();
            result = result[ fieldPart ];
            if ( ! result ) {
                return false;
            }
        }
        return true;
    }

    get( field ) {
        if ( this.has( field ) ) {
            const fieldArray = normalizeToArray( field );
            let result = this.errors;
            while ( fieldArray.length > 0 ) {
                let fieldPart = fieldArray.shift();
                result = result[ fieldPart ];
            }
            return result[ 0 ].message;
        }
    }

    clear( field ) {
        if ( ! field ) {
            this.errors = {};
            return this;
        }

        const fieldArray = normalizeToArray( field );
        let result = this.errors;
        while ( fieldArray.length > 0 ) {
            let fieldPart = fieldArray.shift();
            if ( fieldArray.length === 0 ) {
                delete result[ fieldPart ];
                break;
            }
            result = result[ fieldPart ];
            if ( result === undefined ) {
                break;
            }
        }

        return this;
    }

    record( errors ) {
        this.errors = {};
        for ( let key in errors ) {
            this.set( key, errors[ key ] );
        }
        return this;
    }

}

function normalizeToArray( val, splitOn = "." ) {
    if ( ! Array.isArray( val ) ) {
        return val.split( splitOn );
    }
    return val.slice();
}

function buildNestedObject( fieldParts, message, existingObj ) {
    fieldParts.reverse();
    while ( fieldParts.length > 0 ) {
        let fieldPart = fieldParts.shift();
        let obj = {};
        obj[ fieldPart ] = message;
        message = obj;
    }
    if ( typeof message === "string" || message instanceof String ) {
        return message;
    }
    return Object.assign( {}, existingObj, message );
}